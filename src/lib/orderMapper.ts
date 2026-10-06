import type { FulfillmentMethod, Order, OrderStatus, PaymentStatus, ShippingAddress } from '../types';

// Row shapes of the Supabase `orders` / `order_items` tables (see supabase/migrations).
export interface OrderItemRow {
  product_id: string;
  product_name: string;
  sku: string;
  category_label: string;
  image: string;
  selected_length: number;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface OrderRow {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  fulfillment_method: FulfillmentMethod;
  subtotal: number;
  delivery_fee: number;
  total: number;
  currency: 'NGN';
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_reference: string;
  payment_channel: string | null;
  paystack_transaction_id: string | null;
  paid_at: string | null;
  waybill_number: string | null;
  created_at: string;
  order_items?: OrderItemRow[];
}

export const ORDER_SELECT = '*, order_items(*)';

const TRACKING_STEP: Partial<Record<OrderStatus, Order['trackingStep']>> = {
  paid: 2,
  processing: 2,
  in_transit: 3,
  delivered: 4,
};

export const estimatedDeliveryFor = (method: FulfillmentMethod) =>
  method === 'courier_express'
    ? 'Same-day Lagos dispatch for orders confirmed before 2 PM'
    : 'Ready for pickup at our Victoria Island studio within 3 hours';

export const mapOrderRow = (row: OrderRow): Order => ({
  id: row.id,
  orderNumber: row.order_number,
  date: new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  customerName: row.customer_name,
  customerEmail: row.customer_email,
  customerPhone: row.customer_phone,
  shippingAddress: row.shipping_address,
  fulfillmentMethod: row.fulfillment_method,
  deliveryCharge: row.delivery_fee,
  subtotal: row.subtotal,
  tax: 0,
  total: row.total,
  currency: row.currency,
  status: row.status,
  paymentStatus: row.payment_status,
  paymentReference: row.payment_reference,
  paymentChannel: row.payment_channel ? `Paystack (${row.payment_channel})` : 'Paystack',
  paystackTransactionId: row.paystack_transaction_id ?? undefined,
  paidAt: row.paid_at ?? undefined,
  trackingStep: TRACKING_STEP[row.status] ?? 1,
  waybillNumber: row.waybill_number ?? undefined,
  estimatedDelivery: estimatedDeliveryFor(row.fulfillment_method),
  items: (row.order_items ?? []).map((item) => ({
    productId: item.product_id,
    productName: item.product_name,
    sku: item.sku,
    selectedLength: item.selected_length,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    lineTotal: item.line_total,
    image: item.image,
    categoryLabel: item.category_label,
  })),
});
