import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin, getUserFromRequest } from '../../server/supabase.js';
import { getPaystackSecret, verifyTransaction } from '../../server/paystack.js';
import { applyPaystackResult, getOrderByReference } from '../../server/orders.js';
import { mapOrderRow } from '../../src/lib/orderMapper.js';

// Confirms a payment with Paystack, updates the order, sends the confirmation email, and returns the order.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.setHeader('Cache-Control', 'no-store');

  const secret = getPaystackSecret();
  const supabase = getSupabaseAdmin();
  if (!secret || !supabase) {
    return res.status(503).json({ error: 'Online payment is not configured' });
  }

  const user = await getUserFromRequest(supabase, req);
  if (!user) return res.status(401).json({ error: 'Please sign in' });

  const reference = String(req.query.reference ?? '');
  if (!/^[A-Za-z0-9._=-]{1,100}$/.test(reference)) {
    return res.status(400).json({ error: 'Invalid reference' });
  }

  try {
    const order = await getOrderByReference(supabase, reference);
    if (!order || order.user_id !== user.id) return res.status(404).json({ error: 'Order not found' });

    const tx = await verifyTransaction(secret, reference);
    const updated = tx ? await applyPaystackResult(supabase, order, tx, req) : order;
    return res.status(200).json({ order: mapOrderRow(updated) });
  } catch (err) {
    console.error('Payment verify failed', err);
    return res.status(502).json({ error: 'Could not reach the payment gateway' });
  }
}
