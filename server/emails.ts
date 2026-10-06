import type { Order } from '../src/types/index.js';
import type { EmailMessage } from './mailgun.js';

const naira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const absoluteUrl = (path: string, siteUrl: string) =>
  /^https?:\/\//.test(path) ? path : `${siteUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;

export const orderConfirmationEmail = (order: Order, siteUrl: string): EmailMessage => {
  const firstName = order.customerName.split(' ')[0] || 'there';
  const isPickup = order.fulfillmentMethod === 'studio_pickup';
  const a = order.shippingAddress;
  const addressLine = [a.streetAddress, a.suiteFlat, a.district, a.state].filter(Boolean).join(', ');
  const deliveryLabel = isPickup ? 'Studio pickup' : 'Express Lagos delivery';
  const deliveryValue = order.deliveryCharge === 0 ? 'Free' : naira(order.deliveryCharge);
  const orderUrl = `${siteUrl.replace(/\/$/, '')}/orders`;

  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #EAE8E5;width:64px;vertical-align:top">
            <img src="${escapeHtml(absoluteUrl(item.image, siteUrl))}" width="56" height="70" alt="" style="display:block;border-radius:4px;object-fit:cover;background:#F5F3F0">
          </td>
          <td style="padding:12px 12px;border-bottom:1px solid #EAE8E5;vertical-align:top;font-size:14px;color:#1A1412">
            <strong>${escapeHtml(item.productName)}</strong><br>
            <span style="color:#807571;font-size:12px">${item.selectedLength}" &middot; Qty ${item.quantity}</span>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #EAE8E5;vertical-align:top;text-align:right;font-size:14px;color:#1A1412;white-space:nowrap">
            ${naira(item.lineTotal)}
          </td>
        </tr>`
    )
    .join('');

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#FBF9F6;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF9F6;padding:32px 16px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #EAE8E5;border-radius:12px;padding:32px">
          <tr><td>
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#725B38;font-weight:700">Bernice Hairplace &middot; Lagos</p>
            <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:28px;color:#1A1412">Thank you, ${escapeHtml(firstName)}.</h1>
            <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#4E4542">
              Your payment was received and order <strong style="color:#1A1412">#${escapeHtml(order.orderNumber)}</strong> is confirmed.
              ${isPickup
                ? 'We will contact you when your order is ready for collection at our Victoria Island studio.'
                : 'Our team is preparing your order for dispatch.'}
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemRows}</table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;font-size:14px;color:#4E4542">
              <tr><td style="padding:4px 0">Subtotal</td><td style="padding:4px 0;text-align:right">${naira(order.subtotal)}</td></tr>
              <tr><td style="padding:4px 0">${deliveryLabel}</td><td style="padding:4px 0;text-align:right">${deliveryValue}</td></tr>
              <tr><td style="padding:12px 0 0;font-weight:700;color:#1A1412;font-size:16px">Total paid</td><td style="padding:12px 0 0;text-align:right;font-weight:700;color:#1A1412;font-size:16px">${naira(order.total)}</td></tr>
            </table>

            <div style="margin-top:24px;padding:16px;background:#F5F3F0;border-radius:8px;font-size:13px;line-height:1.6;color:#4E4542">
              <strong style="color:#1A1412">${deliveryLabel}</strong><br>
              ${isPickup ? 'Victoria Island Studio, Lagos' : escapeHtml(addressLine)}<br>
              ${escapeHtml(order.customerPhone)}<br>
              <span style="color:#807571">Payment reference: ${escapeHtml(order.paymentReference)}</span>
            </div>

            <p style="margin:24px 0 0;text-align:center">
              <a href="${escapeHtml(orderUrl)}" style="display:inline-block;background:#1A1412;color:#ffffff;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;padding:14px 24px;border-radius:6px">View your orders</a>
            </p>
          </td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#807571">Questions? Reply to this email or message us on WhatsApp with your order number.</p>
      </td></tr>
    </table>
  </body>
</html>`;

  const text = [
    `Thank you, ${firstName}.`,
    '',
    `Your payment was received and order #${order.orderNumber} is confirmed.`,
    '',
    ...order.items.map((i) => `- ${i.quantity} x ${i.productName} (${i.selectedLength}") — ${naira(i.lineTotal)}`),
    '',
    `Subtotal: ${naira(order.subtotal)}`,
    `${deliveryLabel}: ${deliveryValue}`,
    `Total paid: ${naira(order.total)}`,
    '',
    isPickup ? 'Pickup: Victoria Island Studio, Lagos' : `Delivery address: ${addressLine}`,
    `Phone: ${order.customerPhone}`,
    `Payment reference: ${order.paymentReference}`,
    '',
    `View your orders: ${orderUrl}`,
  ].join('\n');

  return {
    to: order.customerEmail,
    subject: `Order confirmed — #${order.orderNumber}`,
    html,
    text,
    bcc: process.env.STORE_NOTIFICATION_EMAIL || undefined,
  };
};
