import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Product, CartItem, Order, ShippingAddress, FulfillmentMethod } from '../types';
import { PRODUCTS } from '../data/products';
import { computeDeliveryFee, getUnitPrice } from '../lib/pricing';
import { initializePayment, openPaystackPopup, verifyPayment, PaymentError } from '../lib/paystack';
import { supabase } from '../lib/supabase';
import { mapOrderRow, ORDER_SELECT, type OrderRow } from '../lib/orderMapper';
import confetti from 'canvas-confetti';

interface ToastData {
  message: string;
  submessage?: string;
  type?: 'success' | 'info' | 'error';
}

export type PaymentPhase = 'idle' | 'starting' | 'awaiting_customer' | 'verifying';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

interface ProfileRow {
  full_name: string | null;
  phone: string | null;
  default_address: ShippingAddress | null;
}

interface ShopContextType {
  products: Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  cart: CartItem[];
  addToCart: (product: Product, selectedLength?: number, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Auth (Supabase + Google)
  isAuthConfigured: boolean;
  authReady: boolean;
  user: AuthUser | null;
  signInWithGoogle: (returnPath?: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Navigation & Active views
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Orders (from Supabase)
  orders: Order[];
  ordersLoading: boolean;
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;

  // Checkout State
  checkoutAddress: ShippingAddress;
  setCheckoutAddress: React.Dispatch<React.SetStateAction<ShippingAddress>>;
  fulfillmentMethod: FulfillmentMethod;
  setFulfillmentMethod: (method: FulfillmentMethod) => void;
  deliveryFee: number;
  orderTotal: number;

  // Payment
  paymentPhase: PaymentPhase;
  payWithPaystack: () => Promise<void>;
  recheckPayment: (order: Order) => Promise<void>;

  // Toast
  toast: ToastData | null;
  showToast: (message: string, submessage?: string, type?: 'success' | 'info' | 'error') => void;

  // WhatsApp Concierge Modal
  isConciergeOpen: boolean;
  setIsConciergeOpen: (open: boolean) => void;

  // Sizing & Custom Order Modal
  isCustomOrderModalOpen: boolean;
  setIsCustomOrderModalOpen: (open: boolean) => void;

  // Currency
  currency: 'NGN' | 'USD';
  setCurrency: (currency: 'NGN' | 'USD') => void;
  formatPrice: (amountInNgn: number) => string;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const EMPTY_ADDRESS: ShippingAddress = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  streetAddress: '',
  suiteFlat: '',
  district: 'Lekki Phase 1',
  state: 'Lagos State',
  country: 'Nigeria',
  deliveryNotes: '',
};

// localStorage can be unavailable (private mode, blocked storage); never let that break the store.
const loadStored = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
};

const store = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

/** Builds a cart line from catalog data, dropping anything no longer sold. */
const toCartItem = (productId: string, selectedLength: number, quantity: number): CartItem | null => {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product || !product.lengths.includes(selectedLength) || !(quantity > 0)) return null;
  const unitPrice = getUnitPrice(product, selectedLength);
  return {
    id: `${product.id}-${selectedLength}`,
    productId: product.id,
    product,
    selectedLength,
    quantity: Math.min(quantity, 20),
    unitPrice,
    lineTotal: unitPrice * Math.min(quantity, 20),
  };
};

// Re-price stored cart lines against the current catalog so stale prices or removed products never reach checkout.
const loadCart = (): CartItem[] =>
  loadStored<CartItem[]>('bhp_cart', []).flatMap((item) => {
    const line = toCartItem(item.productId, item.selectedLength, item.quantity);
    return line ? [line] : [];
  });

const toAuthUser = (session: Session | null): AuthUser | null => {
  const u = session?.user;
  if (!u) return null;
  const meta = u.user_metadata ?? {};
  return {
    id: u.id,
    email: u.email ?? '',
    fullName: meta.full_name || meta.name || u.email || '',
    avatarUrl: meta.avatar_url || meta.picture || undefined,
  };
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(PRODUCTS);

  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!supabase);
  const user = toAuthUser(session);
  const userId = user?.id ?? null;
  // The user id whose bag has been merged with the database; writes are only synced after that.
  const cartSyncedFor = useRef<string | null>(null);

  const [wishlist, setWishlist] = useState<string[]>(() => loadStored('bhp_wishlist', []));
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => PRODUCTS[0]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const [checkoutAddress, setCheckoutAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('courier_express');
  const [paymentPhase, setPaymentPhase] = useState<PaymentPhase>('idle');

  const [toast, setToast] = useState<ToastData | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isCustomOrderModalOpen, setIsCustomOrderModalOpen] = useState(false);
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (message: string, submessage?: string, type: 'success' | 'info' | 'error' = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, submessage, type });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  // ─── Auth session ───
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setAuthReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const fetchOrders = async () => {
    if (!supabase || !userId) return [];
    setOrdersLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(ORDER_SELECT)
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false })
      .limit(50);
    setOrdersLoading(false);
    if (error) {
      console.error('Could not load orders', error);
      return [];
    }
    const mapped = (data as OrderRow[]).map(mapOrderRow);
    setOrders(mapped);
    return mapped;
  };

  // ─── Load / merge account data when someone signs in ───
  useEffect(() => {
    if (!supabase || !userId) return;
    const client = supabase;
    let cancelled = false;

    (async () => {
      const [profileRes, cartRes, wishlistRes] = await Promise.all([
        client.from('profiles').select('full_name, phone, default_address').eq('id', userId).maybeSingle(),
        client.from('cart_items').select('product_id, selected_length, quantity'),
        client.from('wishlist_items').select('product_id'),
      ]);
      if (cancelled) return;

      // Bag: keep what was added before signing in, plus anything saved on the account.
      setCart((local) => {
        const merged = [...local];
        for (const row of cartRes.data ?? []) {
          if (merged.some((i) => i.productId === row.product_id && i.selectedLength === row.selected_length)) continue;
          const line = toCartItem(row.product_id, row.selected_length, row.quantity);
          if (line) merged.push(line);
        }
        return merged;
      });
      cartSyncedFor.current = userId;

      // Wishlist: union of local and saved.
      const saved = (wishlistRes.data ?? []).map((r) => r.product_id as string);
      setWishlist((local) => {
        const missing = local.filter((id) => !saved.includes(id));
        if (missing.length) {
          client.from('wishlist_items').insert(missing.map((product_id) => ({ user_id: userId, product_id }))).then();
        }
        return [...new Set([...saved, ...local])];
      });

      // Checkout details: fill blanks from the saved profile / Google account.
      const profile = profileRes.data as ProfileRow | null;
      setCheckoutAddress((prev) => {
        const saved = profile?.default_address ?? null;
        const [first = '', ...rest] = (profile?.full_name || user?.fullName || '').split(' ');
        const base: ShippingAddress = {
          ...EMPTY_ADDRESS,
          firstName: first,
          lastName: rest.join(' '),
          email: user?.email ?? '',
          phone: profile?.phone ?? '',
          ...(saved ?? {}),
        };
        const next = { ...prev };
        for (const key of Object.keys(base) as (keyof ShippingAddress)[]) {
          if (!next[key] && base[key]) (next as Record<string, unknown>)[key] = base[key];
        }
        return next;
      });

      fetchOrders();
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // ─── Persist bag & wishlist ───
  useEffect(() => store('bhp_cart', cart), [cart]);
  useEffect(() => store('bhp_wishlist', wishlist), [wishlist]);

  // Mirror the bag to Supabase for signed-in customers (debounced, atomic replace).
  useEffect(() => {
    if (!supabase || !userId || cartSyncedFor.current !== userId) return;
    const client = supabase;
    const timer = setTimeout(() => {
      client
        .rpc('replace_cart', {
          items: cart.map((i) => ({ product_id: i.productId, selected_length: i.selectedLength, quantity: i.quantity })),
        })
        .then(({ error }) => error && console.error('Could not save bag', error));
    }, 600);
    return () => clearTimeout(timer);
  }, [cart, userId]);

  const signInWithGoogle = async (returnPath?: string) => {
    if (!supabase) {
      showToast('Sign-in unavailable', 'Google sign-in has not been configured yet.', 'error');
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${returnPath ?? window.location.pathname}` },
    });
    if (error) showToast('Sign-in failed', error.message, 'error');
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
    // Don't leave the previous customer's data on a shared device.
    cartSyncedFor.current = null;
    setCart([]);
    setWishlist([]);
    setOrders([]);
    setCurrentOrder(null);
    setCheckoutAddress(EMPTY_ADDRESS);
    setCurrentView('home');
    showToast('Signed out', undefined, 'info');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.lineTotal, 0);
  const deliveryFee = computeDeliveryFee(cartSubtotal, fulfillmentMethod);
  const orderTotal = cartSubtotal + deliveryFee;

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  const addToCart = (product: Product, selectedLength?: number, quantity: number = 1) => {
    const length = selectedLength || product.defaultLength;
    const cartItemId = `${product.id}-${length}`;
    const unitPrice = getUnitPrice(product, length);

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, 20);
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQty, lineTotal: newQty * item.unitPrice } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          selectedLength: length,
          quantity,
          unitPrice,
          lineTotal: unitPrice * quantity,
        },
      ];
    });

    showToast(
      `${product.name} (${length}″)`,
      `Added to Luxury Bag • ${formatPrice(unitPrice * quantity)}`,
      'success'
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const qty = Math.min(newQty, 20);
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: qty, lineTotal: qty * item.unitPrice } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    const removing = wishlist.includes(productId);
    setWishlist((prev) => (removing ? prev.filter((id) => id !== productId) : [...prev, productId]));
    showToast(removing ? 'Removed from Wishlist' : 'Saved to Wishlist', undefined, removing ? 'info' : 'success');

    if (supabase && userId) {
      const table = supabase.from('wishlist_items');
      const request = removing
        ? table.delete().eq('user_id', userId).eq('product_id', productId)
        : table.upsert({ user_id: userId, product_id: productId }, { onConflict: 'user_id,product_id', ignoreDuplicates: true });
      request.then(({ error }) => error && console.error('Could not save wishlist', error));
    }
  };

  const formatPrice = (amountInNgn: number) => {
    if (currency === 'USD') {
      const usdAmount = Math.round(amountInNgn / 1550);
      return `≈ $${usdAmount.toLocaleString('en-US')}`;
    }
    return `₦${amountInNgn.toLocaleString('en-NG')}`;
  };

  const upsertOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)]);
    setCurrentOrder(order);
  };

  const celebrate = () => {
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#C5A880', '#1A1412', '#FEDEB2'] });
    } catch {
      // purely decorative
    }
  };

  const getAccessToken = async () => {
    const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
    return data.session?.access_token ?? null;
  };

  const validateCheckout = () => {
    if (cart.length === 0) {
      showToast('Your bag is empty', 'Add an item before checking out.', 'error');
      return false;
    }
    const a = checkoutAddress;
    if (!a.firstName.trim() || !a.lastName.trim() || !a.email.trim() || !a.phone.trim()) {
      showToast('Missing Details', 'Please provide your name, email and phone number.', 'error');
      return false;
    }
    if (fulfillmentMethod === 'courier_express' && !a.streetAddress.trim()) {
      showToast('Missing Address', 'Please provide a delivery address.', 'error');
      return false;
    }
    return true;
  };

  const payWithPaystack = async () => {
    if (paymentPhase !== 'idle') return;
    const accessToken = await getAccessToken();
    if (!accessToken) {
      showToast('Please sign in', 'Sign in with Google to complete your order.', 'info');
      await signInWithGoogle('/checkout');
      return;
    }
    if (!validateCheckout()) return;

    setPaymentPhase('starting');
    try {
      const init = await initializePayment({ accessToken, address: checkoutAddress, fulfillmentMethod, cart });

      setPaymentPhase('awaiting_customer');
      const reference = await openPaystackPopup(init.accessCode);
      if (!reference) {
        // Let the server record the abandoned attempt; the bag stays as it is.
        verifyPayment(init.reference, accessToken).catch(() => undefined);
        showToast('Payment cancelled', 'Your bag has been kept for you.', 'info');
        return;
      }

      setPaymentPhase('verifying');
      let order: Order | undefined;
      try {
        order = await verifyPayment(reference, (await getAccessToken()) ?? accessToken);
      } catch {
        // Fall back to reading the order directly; the webhook will still confirm it.
        order = (await fetchOrders()).find((o) => o.paymentReference === reference);
      }

      if (order) upsertOrder(order);
      if (order?.paymentStatus !== 'failed') clearCart();
      setCurrentView(order ? 'payment-status' : 'orders');

      if (order?.paymentStatus === 'success') {
        celebrate();
        showToast('Payment Successful', `Order ${init.orderNumber} confirmed. A confirmation email is on its way.`, 'success');
      } else if (order?.paymentStatus === 'failed') {
        showToast('Payment not completed', 'Your bank did not approve this transaction.', 'error');
      } else {
        showToast('Payment received — confirming', 'We are still confirming this with Paystack.', 'info');
      }
    } catch (err) {
      if (err instanceof PaymentError && err.notConfigured) {
        showToast('Card payment unavailable', 'Please contact us on WhatsApp to complete your order.', 'error');
      } else {
        showToast('Payment error', err instanceof Error ? err.message : 'Please try again.', 'error');
      }
    } finally {
      setPaymentPhase('idle');
    }
  };

  const recheckPayment = async (order: Order) => {
    if (paymentPhase !== 'idle') return;
    const accessToken = await getAccessToken();
    if (!accessToken) {
      await signInWithGoogle();
      return;
    }
    setPaymentPhase('verifying');
    try {
      const updated = await verifyPayment(order.paymentReference, accessToken);
      upsertOrder(updated);
      if (updated.paymentStatus === 'success') {
        celebrate();
        showToast('Payment Confirmed', `Order ${order.orderNumber} is confirmed.`, 'success');
      } else {
        showToast('Still pending', 'Paystack has not confirmed this payment yet.', 'info');
      }
    } catch (err) {
      showToast('Could not verify', err instanceof Error ? err.message : 'Please try again shortly.', 'error');
    } finally {
      setPaymentPhase('idle');
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        getProductBySlug,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        isAuthConfigured: !!supabase,
        authReady,
        user,
        signInWithGoogle,
        signOut,
        wishlist,
        toggleWishlist,
        currentView,
        setCurrentView,
        selectedProduct,
        setSelectedProduct,
        quickViewProduct,
        setQuickViewProduct,
        orders,
        ordersLoading,
        currentOrder,
        setCurrentOrder,
        checkoutAddress,
        setCheckoutAddress,
        fulfillmentMethod,
        setFulfillmentMethod,
        deliveryFee,
        orderTotal,
        paymentPhase,
        payWithPaystack,
        recheckPayment,
        toast,
        showToast,
        isConciergeOpen,
        setIsConciergeOpen,
        isCustomOrderModalOpen,
        setIsCustomOrderModalOpen,
        currency,
        setCurrency,
        formatPrice,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
