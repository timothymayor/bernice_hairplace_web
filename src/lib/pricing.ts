import type { FulfillmentMethod, Product } from '../types';

// Shared by the storefront and the /api payment functions so the amount
// Paystack charges is always computed from the same rules the customer sees.
export const EXPRESS_DELIVERY_FEE = 4500;
export const FREE_DELIVERY_THRESHOLD = 150000;

const PRICE_PER_INCH_LONGER = 15000;
const PRICE_PER_INCH_SHORTER = 10000;

/** Unit price for a product at a given length (longer than default costs more, shorter costs less). */
export const getUnitPrice = (product: Pick<Product, 'price' | 'defaultLength'>, length: number) => {
  const diff = length - product.defaultLength;
  const adjustment = diff > 0 ? diff * PRICE_PER_INCH_LONGER : diff * PRICE_PER_INCH_SHORTER;
  return Math.max(product.price + adjustment, 0);
};

export const computeDeliveryFee = (subtotal: number, method: FulfillmentMethod) => {
  if (method !== 'courier_express') return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : EXPRESS_DELIVERY_FEE;
};
