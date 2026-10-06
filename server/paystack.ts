const PAYSTACK_API = 'https://api.paystack.co';

export interface PaystackTransaction {
  id: number;
  reference: string;
  status: string; // success | failed | abandoned | ongoing | pending | processing | queued | reversed
  amount: number; // kobo
  currency: string;
  channel?: string;
  paid_at?: string | null;
}

export const getPaystackSecret = () => process.env.PAYSTACK_SECRET_KEY || null;

export const initializeTransaction = async (
  secret: string,
  params: { email: string; amountKobo: number; reference: string; metadata: Record<string, unknown> }
): Promise<{ accessCode: string; reference: string }> => {
  const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      currency: 'NGN',
      reference: params.reference,
      metadata: params.metadata,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.status) {
    throw new Error(`Paystack initialize failed (${res.status}): ${data?.message ?? 'unknown error'}`);
  }
  return { accessCode: data.data.access_code, reference: data.data.reference };
};

/** Returns null when Paystack has no transaction for the reference. */
export const verifyTransaction = async (secret: string, reference: string): Promise<PaystackTransaction | null> => {
  const res = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 404 || (res.ok && !data.status)) return null;
  if (!res.ok) throw new Error(`Paystack verify failed (${res.status}): ${data?.message ?? 'unknown error'}`);
  return data.data as PaystackTransaction;
};
