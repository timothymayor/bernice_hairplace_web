export type ProductCategory = 'all' | 'bundles' | 'wigs' | 'frontals' | 'care' | 'closures';

export type HairTexture = 'Bone Straight' | 'Deep Wave' | 'Burmese Curly' | 'Body Wave' | 'Natural Wavy';

export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  category: ProductCategory;
  texture: HairTexture;
  origin: string;
  price: number; // in NGN
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  sku: string;
  description: string;
  fullSpecs: {
    origin: string;
    texture: string;
    weight: string;
    weft: string;
    lifespan: string;
    bleachGrade: string;
  };
  lengths: number[]; // e.g. [18, 20, 22, 26, 30]
  defaultLength: number;
  images: {
    main: string;
    luster: string;
    weft: string;
    cuticle: string;
    styled: string;
  };
  badge?: string;
  secondaryBadge?: string;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isInStock: boolean;
  inStockLocation?: string;
  donorShade: string;
  recommendedPairing?: {
    name: string;
    specs: string;
    price: number;
    image: string;
  };
}

export interface CartItem {
  id: string; // unique item cart id
  productId: string;
  product: Product;
  selectedLength: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  customNotes?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  suiteFlat?: string;
  district: string; // e.g. Lekki Phase 1, Victoria Island, Ikoyi
  state: string; // Lagos State
  postalCode?: string;
  country: string;
  deliveryNotes?: string;
}

export type FulfillmentMethod = 'courier_express' | 'studio_pickup';

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'in_transit'
  | 'delivered'
  | 'payment_failed'
  | 'payment_reversed'
  | 'cancelled';

export type PaymentStatus = 'initialized' | 'pending' | 'success' | 'failed' | 'reversed';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  selectedLength: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image: string;
  categoryLabel: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  fulfillmentMethod: FulfillmentMethod;
  deliveryCharge: number;
  subtotal: number;
  tax: number;
  total: number;
  currency: 'NGN' | 'USD';
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentReference: string;
  paymentChannel: string;
  paystackTransactionId?: string;
  paidAt?: string;
  items: OrderItem[];
  trackingStep: 1 | 2 | 3 | 4; // 1: Placed, 2: Audit, 3: In Transit, 4: Delivered
  waybillNumber?: string;
  estimatedDelivery?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  tier: string;
  avatarUrl: string;
  capCircumference: string;
  lacePreference: string;
  signatureTexture: string;
  defaultParting: string;
  defaultAddress: ShippingAddress;
  savedCard: {
    brand: string;
    last4: string;
    expiry: string;
    cardHolder: string;
  };
}
