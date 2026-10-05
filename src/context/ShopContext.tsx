import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, UserProfile, ShippingAddress, FulfillmentMethod } from '../types';
import { PRODUCTS } from '../data/products';
import { INITIAL_USER, INITIAL_ORDERS } from '../data/initialData';
import confetti from 'canvas-confetti';

interface ToastData {
  message: string;
  submessage?: string;
  type?: 'success' | 'info' | 'error';
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

  // User & Auth
  user: UserProfile | null;
  isLoggedIn: boolean;
  loginWithGoogle: () => void;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

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

  // Orders
  orders: Order[];
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  createPendingOrder: (address: ShippingAddress, fulfillment: FulfillmentMethod) => Order;
  finalizePaidOrder: (orderId: string, reference?: string) => Order | undefined;
  markOrderFailed: (orderId: string) => void;

  // Checkout State
  checkoutAddress: ShippingAddress;
  setCheckoutAddress: React.Dispatch<React.SetStateAction<ShippingAddress>>;
  fulfillmentMethod: FulfillmentMethod;
  setFulfillmentMethod: (method: FulfillmentMethod) => void;
  deliveryFee: number;
  orderTotal: number;

  // Paystack Modal & Flow
  isPaystackModalOpen: boolean;
  paystackProgress: number;
  openPaystackPayment: (order?: Order) => void;
  closePaystackPayment: () => void;
  simulatePaystackSuccess: () => void;
  simulatePaystackFailure: () => void;

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

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(PRODUCTS);
  
  // Initialize cart with 2 default items as seen in the prompt mockups
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bhp_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default 2 items from the reference mockup
    const p1 = PRODUCTS.find((p) => p.id === 'prod-cambodian-bone-straight') || PRODUCTS[0];
    const p2 = PRODUCTS.find((p) => p.id === 'prod-hd-swiss-closure-5x5') || PRODUCTS[1];
    return [
      {
        id: 'cart-init-1',
        productId: p1.id,
        product: p1,
        selectedLength: 20,
        quantity: 1,
        unitPrice: 185000,
        lineTotal: 185000,
      },
      {
        id: 'cart-init-2',
        productId: p2.id,
        product: p2,
        selectedLength: 16,
        quantity: 1,
        unitPrice: 75000,
        lineTotal: 75000,
      },
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('bhp_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [wishlist, setWishlist] = useState<string[]>(['prod-burmese-curly-hd-unit']);
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => PRODUCTS[0]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bhp_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [currentOrder, setCurrentOrder] = useState<Order | null>(() => INITIAL_ORDERS[0]);

  const [checkoutAddress, setCheckoutAddress] = useState<ShippingAddress>(() => INITIAL_USER.defaultAddress);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('courier_express');

  const [isPaystackModalOpen, setIsPaystackModalOpen] = useState(false);
  const [paystackProgress, setPaystackProgress] = useState(25);
  const [activePaystackOrder, setActivePaystackOrder] = useState<Order | null>(null);

  const [toast, setToast] = useState<ToastData | null>(null);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isCustomOrderModalOpen, setIsCustomOrderModalOpen] = useState(false);
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist cart
  useEffect(() => {
    localStorage.setItem('bhp_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist orders
  useEffect(() => {
    localStorage.setItem('bhp_orders', JSON.stringify(orders));
  }, [orders]);

  // Persist user
  useEffect(() => {
    if (user) localStorage.setItem('bhp_user', JSON.stringify(user));
  }, [user]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.lineTotal, 0);
  const deliveryFee = fulfillmentMethod === 'courier_express' ? 4500 : 0;
  const orderTotal = cartSubtotal + deliveryFee;

  const showToast = (message: string, submessage?: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, submessage, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  const addToCart = (product: Product, selectedLength?: number, quantity: number = 1) => {
    const length = selectedLength || product.defaultLength;
    const cartItemId = `${product.id}-${length}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                lineTotal: (item.quantity + quantity) * item.unitPrice,
              }
            : item
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
          unitPrice: product.price,
          lineTotal: product.price * quantity,
        },
      ];
    });

    showToast(
      `${product.name} (${length}″)`,
      `Added to Luxury Bag • ₦${(product.price * quantity).toLocaleString('en-NG')}`,
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
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId
          ? {
              ...item,
              quantity: newQty,
              lineTotal: newQty * item.unitPrice,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from Wishlist', undefined, 'info');
        return prev.filter((id) => id !== productId);
      }
      showToast('Saved to Atelier Wishlist', undefined, 'success');
      return [...prev, productId];
    });
  };

  const loginWithGoogle = () => {
    setUser(INITIAL_USER);
    setIsLoggedIn(true);
    showToast('Authenticated via Google', `Welcome back, ${INITIAL_USER.firstName}!`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('Signed Out', 'Your session has ended securely.', 'info');
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
    showToast('Profile Updated', 'Your measurements & addresses have been saved.', 'success');
  };

  const formatPrice = (amountInNgn: number) => {
    if (currency === 'USD') {
      const usdAmount = Math.round(amountInNgn / 1550);
      return `$${usdAmount.toLocaleString('en-US')}`;
    }
    return `₦${amountInNgn.toLocaleString('en-NG')}`;
  };

  const createPendingOrder = (address: ShippingAddress, fulfillment: FulfillmentMethod): Order => {
    const timestamp = Date.now();
    const orderNum = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fee = fulfillment === 'courier_express' ? 4500 : 0;
    const sub = cartSubtotal;
    const tot = sub + fee;

    const newOrder: Order = {
      id: `ord-${timestamp}`,
      orderNumber: orderNum,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customerName: `${address.firstName} ${address.lastName}`,
      customerEmail: address.email,
      customerPhone: address.phone,
      shippingAddress: address,
      fulfillmentMethod: fulfillment,
      deliveryCharge: fee,
      subtotal: sub,
      tax: 0,
      total: tot,
      currency: 'NGN',
      status: 'pending_payment',
      paymentStatus: 'initialized',
      paymentReference: `pstk_ref_${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      paymentChannel: 'Paystack Gateway Direct',
      trackingStep: 1,
      estimatedDelivery:
        fulfillment === 'courier_express'
          ? 'Tomorrow • by 3:00 PM (Lagos Dedicated Courier)'
          : 'Ready in 3 hours at Victoria Island Studio',
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        sku: item.product.sku,
        selectedLength: item.selectedLength,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
        image: item.product.images.main,
        categoryLabel: item.product.subtitle,
      })),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    return newOrder;
  };

  const finalizePaidOrder = (orderId: string, reference?: string) => {
    let finalized: Order | undefined;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          finalized = {
            ...ord,
            status: 'processing',
            paymentStatus: 'success',
            paidAt: new Date().toISOString(),
            paymentReference: reference || ord.paymentReference,
            trackingStep: 2,
            waybillNumber: `BHP-LG-${Math.floor(1000 + Math.random() * 9000)}`,
          };
          return finalized;
        }
        return ord;
      })
    );

    if (finalized) {
      setCurrentOrder(finalized);
      clearCart();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C5A880', '#1A1412', '#FEDEB2'],
        });
      } catch (e) {
        console.error(e);
      }
    }
    return finalized;
  };

  const markOrderFailed = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          const failed: Order = {
            ...ord,
            status: 'payment_failed',
            paymentStatus: 'failed',
          };
          setCurrentOrder(failed);
          return failed;
        }
        return ord;
      })
    );
  };

  const openPaystackPayment = (order?: Order) => {
    const targetOrder = order || currentOrder || createPendingOrder(checkoutAddress, fulfillmentMethod);
    setActivePaystackOrder(targetOrder);
    setPaystackProgress(25);
    setIsPaystackModalOpen(true);
  };

  const closePaystackPayment = () => {
    setIsPaystackModalOpen(false);
    setActivePaystackOrder(null);
  };

  const simulatePaystackSuccess = () => {
    setPaystackProgress(100);
    setTimeout(() => {
      if (activePaystackOrder) {
        finalizePaidOrder(activePaystackOrder.id);
      }
      setIsPaystackModalOpen(false);
      setCurrentView('payment-status');
      showToast('Payment Successful', '256-Bit transaction confirmed via Paystack.', 'success');
    }, 800);
  };

  const simulatePaystackFailure = () => {
    if (activePaystackOrder) {
      markOrderFailed(activePaystackOrder.id);
    }
    setIsPaystackModalOpen(false);
    setCurrentView('payment-status');
    showToast('Payment Declined', 'Bank code 51: Transaction halted by issuer.', 'error');
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
        user,
        isLoggedIn,
        loginWithGoogle,
        logout,
        updateUserProfile,
        wishlist,
        toggleWishlist,
        currentView,
        setCurrentView,
        selectedProduct,
        setSelectedProduct,
        quickViewProduct,
        setQuickViewProduct,
        orders,
        currentOrder,
        setCurrentOrder,
        createPendingOrder,
        finalizePaidOrder,
        markOrderFailed,
        checkoutAddress,
        setCheckoutAddress,
        fulfillmentMethod,
        setFulfillmentMethod,
        deliveryFee,
        orderTotal,
        isPaystackModalOpen,
        paystackProgress,
        openPaystackPayment,
        closePaystackPayment,
        simulatePaystackSuccess,
        simulatePaystackFailure,
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
