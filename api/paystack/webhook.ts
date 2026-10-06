import { createHmac, timingSafeEqual } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from '../../server/supabase.js';
import { getPaystackSecret, verifyTransaction } from '../../server/paystack.js';
import { applyPaystackResult, getOrderByReference } from '../../server/orders.js';

// Paystack → Settings → API Keys & Webhooks → Webhook URL: https://<your-domain>/api/paystack/webhook
// Confirms orders (and sends the email) even if the customer closes the browser before returning.

const readRawBody = async (req: VercelRequest): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks).toString('utf8');
};

const isValidSignature = (payload: string, signature: string, secret: string) => {
  const expected = createHmac('sha512', secret).update(payload).digest('hex');
  return (
    signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  );
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = getPaystackSecret();
  const supabase = getSupabaseAdmin();
  if (!secret || !supabase) return res.status(503).json({ error: 'Not configured' });

  const signature = String(req.headers['x-paystack-signature'] ?? '');
  let raw = await readRawBody(req).catch(() => '');
  // Fall back to the parsed body if the runtime already consumed the stream (Paystack signs compact JSON).
  if (!raw && req.body) raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  if (!signature || !raw || !isValidSignature(raw, signature, secret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const reference = event.data?.reference;
  if (!reference || !['charge.success', 'refund.processed'].includes(event.event ?? '')) {
    return res.status(200).json({ received: true });
  }

  try {
    const order = await getOrderByReference(supabase, reference);
    if (!order) return res.status(200).json({ received: true, unknownReference: true });

    // Re-fetch from Paystack rather than trusting the event body.
    const tx = await verifyTransaction(secret, reference);
    if (tx) await applyPaystackResult(supabase, order, tx, req);
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Paystack webhook processing failed', err);
    // A non-2xx response makes Paystack retry the event.
    return res.status(500).json({ error: 'Processing failed' });
  }
}
