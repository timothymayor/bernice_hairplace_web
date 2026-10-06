import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin, getUserFromRequest } from '../../server/supabase.js';
import { getPaystackSecret, initializeTransaction } from '../../server/paystack.js';
import { createPendingOrder, OrderInputError, parseCheckoutInput } from '../../server/orders.js';

// Creates the order in Supabase (priced server-side from the catalog) and starts a Paystack transaction for it.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = getPaystackSecret();
  const supabase = getSupabaseAdmin();
  if (!secret || !supabase) {
    return res.status(503).json({ error: 'Online payment is not configured' });
  }

  const user = await getUserFromRequest(supabase, req);
  if (!user) return res.status(401).json({ error: 'Please sign in to check out' });

  let orderId: string | undefined;
  try {
    const input = parseCheckoutInput(req.body);
    const order = await createPendingOrder(supabase, user, input);
    orderId = order.id;

    const { accessCode } = await initializeTransaction(secret, {
      email: input.address.email,
      amountKobo: order.total * 100,
      reference: order.reference,
      metadata: {
        order_id: order.id,
        order_number: order.orderNumber,
        user_id: user.id,
        custom_fields: [
          { display_name: 'Order', variable_name: 'order_number', value: order.orderNumber },
          { display_name: 'Customer', variable_name: 'customer', value: `${input.address.firstName} ${input.address.lastName}` },
          { display_name: 'Phone', variable_name: 'phone', value: input.address.phone },
          {
            display_name: 'Items',
            variable_name: 'items',
            value: order.lines.map((l) => `${l.quantity}× ${l.product_name} (${l.selected_length}")`).join(', '),
          },
        ],
      },
    });

    return res.status(200).json({
      accessCode,
      reference: order.reference,
      orderNumber: order.orderNumber,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
    });
  } catch (err) {
    if (err instanceof OrderInputError) return res.status(400).json({ error: err.message });
    console.error('Checkout initialize failed', err);
    if (orderId) await supabase.from('orders').update({ status: 'cancelled', payment_status: 'failed' }).eq('id', orderId);
    return res.status(502).json({ error: 'Could not start payment. Please try again.' });
  }
}
