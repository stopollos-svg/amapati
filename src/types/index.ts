export type UserRole = 'superuser' | 'editor' | 'customer';

export type UserStatus = 'active' | 'invited' | 'suspended';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  companyName?: string;
  phone?: string;
  createdAt: string;
  lastLogin: string;
}

export interface PriceTier {
  minQty: number;
  maxQty: number | null; // null means "and above"
  unitPrice: number;
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  userCompany?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  sku: string;
  description: string;
  shortDescription: string;
  images: string[];
  priceTiers: PriceTier[];
  basePrice: number; // Single item / lowest qty price
  moq: number; // Minimum Order Quantity
  stock: number;
  leadTimeDays: number;
  specs: ProductSpec[];
  supplier: {
    name: string;
    country: string;
    countryCode: string;
    verified: boolean;
    tradeAssurance: boolean;
    yearsInBusiness: number;
    rating: number;
    responseRate: string;
  };
  featured: boolean;
  isNewArrival: boolean;
  isTopRated: boolean;
  reviewsCount: number;
  averageRating: number;
  reviews: ProductReview[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  productCount: number;
  image: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  badgeText?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  appliedUnitPrice: number;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  companyName?: string;
  phone: string;
  addressLine1: string;
  city: string;
  stateOrRegion: string;
  country: string;
  postalCode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: 'pay_on_delivery' | 'mobile_money' | 'card_escrow' | 'wire_transfer';
  paymentStatus: 'pending' | 'paid' | 'escrow_held' | 'refunded';
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Inquiry {
  id: string;
  productId?: string;
  productTitle?: string;
  productImage?: string;
  customerEmail: string;
  customerName: string;
  companyName?: string;
  targetQuantity?: number;
  targetPrice?: number;
  message: string;
  status: 'new' | 'replied' | 'closed';
  replyMessage?: string;
  repliedAt?: string;
  repliedBy?: string;
  createdAt: string;
}

export interface EditorInvite {
  id: string;
  email: string;
  token: string;
  expiresAt: string;
  used: boolean;
  invitedBy: string;
  createdAt: string;
}

export interface EditorRequest {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  target: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface SiteSettings {
  siteName: string;
  siteLogoUrl: string;
  contactEmail: string;
  supportPhone: string;
  defaultCurrency: string;
  enablePayOnDelivery: boolean;
  enableMobileMoney: boolean;
  enableCardEscrow: boolean;
  enableTradeAssurance: boolean;
  taxRatePercent: number;
  minOrderQuantityStrict: boolean;
  heroAnnouncement: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'KES' | 'NGN' | 'CNY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD (1.0)
  label: string;
}
