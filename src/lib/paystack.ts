import type { CartItem, FulfillmentMethod, Order, ShippingAddress } from '../types';

const INLINE_SCRIPT_SRC = 'https://js.paystack.co/v2/inline.js';

interface PaystackPopInstance {
  resumeTransaction: (
    accessCode: string,
    callbacks: {
      onSuccess?: (tx: { reference: string }) => void;
      onCancel?: () => void;
      onError?: (err: { message?: string }) => void;
    }
  ) => void;
}

declare global {
  interface Window {
    PaystackPop?: new () => PaystackPopInstance;
  }
}

export class PaymentError extends Error {
  constructor(message: string, public readonly notConfigured = false) {
    super(message);
  }
}

let scriptPromise: Promise<void> | null = null;

const loadInlineScript = () => {
  if (window.PaystackPop) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = INLINE_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new PaymentError('Could not load Paystack. Check your connection and try again.'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
};

export interface InitializedPayment {
  accessCode: string;
  reference: string;
  orderNumber: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const authHeaders = (accessToken: string) => ({ Authorization: `Bearer ${accessToken}` });

/** Creates the order on the server and starts a Paystack transaction for it. */
export const initializePayment = async (params: {
  accessToken: string;
  address: ShippingAddress;
  fulfillmentMethod: FulfillmentMethod;
  cart: CartItem[];
}): Promise<InitializedPayment> => {
  let res: Response;
  try {
    res = await fetch('/api/paystack/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders(params.accessToken) },
      body: JSON.stringify({
        fulfillmentMethod: params.fulfillmentMethod,
        address: params.address,
        items: params.cart.map((i) => ({
          productId: i.productId,
          selectedLength: i.selectedLength,
          quantity: i.quantity,
        })),
      }),
    });
  } catch {
    throw new PaymentError('Network error. Please check your connection and try again.');
  }
  // A 404 means the /api functions aren't deployed (e.g. plain `vite dev`).
  if (res.status === 503 || res.status === 404) {
    throw new PaymentError('Online payment is not available right now.', true);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new PaymentError(data.error || 'Could not start payment. Please try again.');
  return data as InitializedPayment;
};

/** Opens the Paystack popup. Resolves with the reference on success, or null if the customer closed it. */
export const openPaystackPopup = async (accessCode: string): Promise<string | null> => {
  await loadInlineScript();
  if (!window.PaystackPop) throw new PaymentError('Could not load Paystack. Please try again.');
  const popup = new window.PaystackPop();
  return new Promise((resolve, reject) => {
    popup.resumeTransaction(accessCode, {
      onSuccess: (tx) => resolve(tx.reference),
      onCancel: () => resolve(null),
      onError: (err) => reject(new PaymentError(err?.message || 'Payment could not be completed.')),
    });
  });
};

/** Asks the server to confirm the payment with Paystack; returns the up-to-date order. */
export const verifyPayment = async (reference: string, accessToken: string): Promise<Order> => {
  const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`, {
    headers: authHeaders(accessToken),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new PaymentError(data.error || 'Could not verify payment.');
  return data.order as Order;
};
