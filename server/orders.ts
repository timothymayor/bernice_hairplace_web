import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { VercelRequest } from '@vercel/node';
import { PRODUCTS } from '../src/data/products.js';
import { computeDeliveryFee, getUnitPrice } from '../src/lib/pricing.js';
import { mapOrderRow, ORDER_SELECT, type OrderRow } from '../src/lib/orderMapper.js';
import type { FulfillmentMethod, ShippingAddress } from '../src/types/index.js';
import type { PaystackTransaction } from './paystack.js';
import { isMailgunConfigured, sendEmail } from './mailgun.js';
import { orderConfirmationEmail } from './emails.js';

export class OrderInputError extends Error {}

export interface CheckoutInput {
  fulfillmentMethod: FulfillmentMethod;
  address: ShippingAddress;
  items: { productId: string; selectedLength: number; quantity: number }[];
}

const text = (value: unknown, max = 200) => String(value ?? '').trim().slice(0, max);

/** Validates untrusted checkout input from the browser. */
export const parseCheckoutInput = (body: unknown): CheckoutInput => {
  const b = (body ?? {}) as Record<string, any>;
  const fulfillmentMethod: FulfillmentMethod = b.fulfillmentMethod === 'studio_pickup' ? 'studio_pickup' : 'courier_express';
  const raw = (b.address ?? {}) as Record<string, unknown>;
  const address: ShippingAddress = {
    firstName: text(raw.firstName, 80),
    lastName: text(raw.lastName, 80),
    email: text(raw.email, 254),
    phone: text(raw.phone, 40),
    streetAddress: text(raw.streetAddress),
    suiteFlat: text(raw.suiteFlat, 100),
    district: text(raw.district, 80),
    state: 'Lagos State',
    country: 'Nigeria',
    deliveryNotes: text(raw.deliveryNotes, 500),
  };

  if (!address.firstName || !address.lastName) throw new OrderInputError('Please provide your full name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) throw new OrderInputError('A valid email address is required');
  if (address.phone.replace(/\D/g, '').length < 7) throw new OrderInputError('A valid phone number is required');
  if (fulfillmentMethod === 'courier_express' && !address.streetAddress) {
    throw new OrderInputError('Please provide a delivery address');
  }

  if (!Array.isArray(b.items) || b.items.length === 0) throw new OrderInputError('Your bag is empty');
  if (b.items.length > 50) throw new OrderInputError('Too many items in your bag');
  const items = b.items.map((i: any) => ({
    productId: text(i?.productId, 100),
    selectedLength: Number(i?.selectedLength),
    quantity: Number(i?.quantity),
  }));
  return { fulfillmentMethod, address, items };
};

const generateOrderNumber = () =>
  `BHP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

/** Prices the bag from the catalog (never from the browser) and stores a pending order with its items. */
export const createPendingOrder = async (supabase: SupabaseClient, user: User, input: CheckoutInput) => {
  let subtotal = 0;
  const lines = input.items.map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    if (!product || !product.isInStock) throw new OrderInputError('An item in your bag is no longer available');
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
      throw new OrderInputError('Invalid quantity in your bag');
    }
    if (!product.lengths.includes(item.selectedLength)) {
      throw new OrderInputError(`Invalid length selected for ${product.name}`);
    }
    const unitPrice = getUnitPrice(product, item.selectedLength);
    subtotal += unitPrice * item.quantity;
    return {
      product_id: product.id,
      product_name: product.name,
      sku: product.sku,
      category_label: product.subtitle,
      image: product.images.main,
      selected_length: item.selectedLength,
      quantity: item.quantity,
      unit_price: unitPrice,
      line_total: unitPrice * item.quantity,
    };
  });

  const deliveryFee = computeDeliveryFee(subtotal, input.fulfillmentMethod);
  const orderNumber = generateOrderNumber();
  const a = input.address;

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      customer_name: `${a.firstName} ${a.lastName}`,
      customer_email: a.email,
      customer_phone: a.phone,
      shipping_address: a,
      fulfillment_method: input.fulfillmentMethod,
      subtotal,
      delivery_fee: deliveryFee,
      total: subtotal + deliveryFee,
      payment_reference: orderNumber,
    })
    .select('id')
    .single();
  if (error || !order) throw new Error(`Could not create order: ${error?.message}`);

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(lines.map((line) => ({ ...line, order_id: order.id })));
  if (itemsError) {
    await supabase.from('orders').delete().eq('id', order.id);
    throw new Error(`Could not save order items: ${itemsError.message}`);
  }

  // Remember the delivery details for next time (best effort).
  await supabase
    .from('profiles')
    .update({ phone: a.phone, full_name: `${a.firstName} ${a.lastName}`, default_address: a })
    .eq('id', user.id);

  return {
    id: order.id as string,
    orderNumber,
    reference: orderNumber,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    lines,
  };
};

export const getOrderByReference = async (supabase: SupabaseClient, reference: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('payment_reference', reference)
    .maybeSingle();
  if (error) throw new Error(`Could not load order: ${error.message}`);
  return data as OrderRow | null;
};

const siteUrlFor = (req?: VercelRequest) => {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  const host = req?.headers['x-forwarded-host'] ?? req?.headers.host ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return host ? `https://${host}` : 'https://bernicehairplace.com';
};

/**
 * Applies a Paystack transaction result to its order. Safe to call repeatedly and concurrently
 * (browser verify + webhook): each transition is a conditional update, and the confirmation email
 * is sent only by the call that wins the "email not yet sent" claim.
 */
export const applyPaystackResult = async (
  supabase: SupabaseClient,
  order: OrderRow,
  tx: PaystackTransaction,
  req?: VercelRequest
): Promise<OrderRow> => {
  let current = order;

  if (tx.status === 'success') {
    if (tx.amount !== order.total * 100 || tx.currency !== 'NGN') {
      console.error('Paystack amount mismatch', { order: order.order_number, expected: order.total * 100, got: tx.amount, currency: tx.currency });
      return current;
    }
    const { data } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_status: 'success',
        paid_at: tx.paid_at ?? new Date().toISOString(),
        payment_channel: tx.channel ?? null,
        paystack_transaction_id: String(tx.id),
      })
      .eq('id', order.id)
      .neq('payment_status', 'success')
      .select(ORDER_SELECT)
      .maybeSingle();
    if (data) current = data as OrderRow;
    if (current.payment_status === 'success') await sendConfirmationOnce(supabase, current, req);
    return current;
  }

  const failure =
    tx.status === 'failed'
      ? { status: 'payment_failed', payment_status: 'failed' }
      : tx.status === 'reversed'
        ? { status: 'payment_reversed', payment_status: 'reversed' }
        : tx.status === 'abandoned'
          ? { status: 'cancelled', payment_status: 'failed' }
          : { status: 'pending_payment', payment_status: 'pending' };

  // Never downgrade an order that has already been paid (except an explicit reversal).
  let query = supabase.from('orders').update(failure).eq('id', order.id);
  if (tx.status !== 'reversed') query = query.neq('payment_status', 'success');
  const { data } = await query.select(ORDER_SELECT).maybeSingle();
  return (data as OrderRow | null) ?? current;
};

const sendConfirmationOnce = async (supabase: SupabaseClient, order: OrderRow, req?: VercelRequest) => {
  if (!isMailgunConfigured()) {
    console.warn('Mailgun not configured; skipping confirmation email for', order.order_number);
    return;
  }
  // Claim the send so concurrent verify/webhook calls don't email twice.
  const { data: claimed } = await supabase
    .from('orders')
    .update({ confirmation_email_sent_at: new Date().toISOString() })
    .eq('id', order.id)
    .is('confirmation_email_sent_at', null)
    .select('id')
    .maybeSingle();
  if (!claimed) return;

  try {
    await sendEmail(orderConfirmationEmail(mapOrderRow(order), siteUrlFor(req)));
  } catch (err) {
    console.error('Confirmation email failed for', order.order_number, err);
    // Release the claim so the next verify/webhook delivery retries the email.
    await supabase.from('orders').update({ confirmation_email_sent_at: null }).eq('id', order.id);
  }
};
