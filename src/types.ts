export type UserRole = 'customer' | 'admin' | 'merchant' | 'delivery_partner';

export interface UserAddress {
  id: string;
  label: 'Home' | 'Work' | 'Village Home' | 'Other';
  street: string;
  area: string;
  landmark?: string;
  townOrVillage: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  avatar: string;
  role: UserRole;
  walletBalance: number;
  password?: string;
  addresses: UserAddress[];
  isBlocked?: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'admin';
  phone: string;
  avatar: string;
  isMasterAdmin: boolean;
  designation?: string;
}

export type ShopType = 'restaurant' | 'grocery';
export type ProductType = ShopType;
export type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'shops'
  | 'products'
  | 'delivery'
  | 'promotions'
  | 'reports'
  | 'settings';

export interface Shop {
  id: string;
  name: string;
  type: ShopType;
  cuisineOrCategory: string[];
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  deliveryTimeMins: string;
  deliveryCharge: number;
  minimumOrder: number;
  isOpen: boolean;
  openingHours: string;
  openingTime?: string;
  closingTime?: string;
  distanceKm: number;
  locationName: string;
  deliveryRadiusKm: number;
  phone: string;
  email?: string;
  isApproved: boolean;
  isBlocked?: boolean;
  address: string;
  commissionRate: number; // percentage, e.g. 15%
  commissionPercentage?: number;
}

export interface ProductVariation {
  id: string;
  name: string;
  priceModifier: number; // e.g. +30 or absolute price
  price?: number;
  isDefault?: boolean;
}

export interface ProductAddOn {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  shopId: string;
  shopName: string;
  name: string;
  sku: string;
  type: ShopType;
  category: string;
  subcategory?: string;
  image: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  stockQuantity: number;
  unit: string; // e.g. '1 kg', '500 g', '1 pc', 'Plate', 'Bottle'
  isVeg?: boolean;
  isBestSeller?: boolean;
  isRecommended?: boolean;
  isActive: boolean;
  inStock?: boolean;
  variations?: ProductVariation[];
  addOns?: ProductAddOn[];
}

export interface CartItem {
  id: string; // cart item unique id
  product: Product;
  quantity: number;
  selectedVariation?: ProductVariation;
  selectedAddOns?: ProductAddOn[];
  specialInstructions?: string;
  itemPrice: number; // base or variation + addons
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'cod' | 'upi' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface DeliveryPartner {
  id: string;
  name: string;
  mobile: string;
  avatar?: string;
  address?: string;
  vehicleType: string;
  vehicleNumber: string;
  drivingLicense?: string;
  aadhaarNumber?: string;
  status?: 'active' | 'busy' | 'offline';
  isApproved: boolean;
  isBlocked?: boolean;
  isOnline?: boolean;
  rating: number;
  completedDeliveries?: number;
  completedOrdersCount?: number;
  totalEarnings: number;
  walletBalance?: number;
  currentLocationName?: string;
  currentLocation?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  deliveryAddress: UserAddress;
  shopId: string;
  shopName: string;
  shopType: ShopType;
  items: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  couponDiscount: number;
  appliedCouponCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryInstructions?: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryPartnerMobile?: string;
  estimatedDeliveryTime: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  reviewComment?: string;
  shopCommission: number;
  netPayableToShop: number;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'flat';
  discountValue: number;
  maximumDiscount?: number;
  maxDiscount?: number;
  minimumOrder: number;
  validTill: string;
  usageLimit?: number;
  usedCount?: number;
  applicableType?: 'all' | 'restaurant' | 'grocery';
  isActive: boolean;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  code?: string;
  image: string;
  badge: string;
  linkType: 'category' | 'shop' | 'coupon';
  linkTarget: string;
  bgColor: string;
  isActive: boolean;

  // Banner Image Adjustment Controls
  imageFit?: 'cover' | 'contain' | 'fill' | 'none';
  imagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  imagePositionX?: number; // 0 to 100% horizontal alignment
  imagePositionY?: number; // 0 to 100% vertical alignment
  imageZoom?: number; // 50 to 200% zoom/scale
  imageOpacity?: number; // 10 to 100% opacity
  imageOverlay?: 'none' | 'subtle' | 'dark' | 'gradient'; // overlay style
  bannerLayout?: 'full' | 'split' | 'poster'; // presentation layout
  noColor?: boolean; // when true, no colored background (pure natural image)
  textColor?: 'dark' | 'light' | 'auto';
  hideTextOnBanner?: boolean; // if the image is a self-contained designed poster
}

export type Banner = PromoBanner;

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
  orderId?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'order' | 'promo' | 'wallet' | 'system';
  orderId?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  orderId?: string;
  subject: string;
  category: 'delivery' | 'food_quality' | 'payment' | 'other';
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface DeliveryAreaZone {
  id: string;
  name: string;
  type: 'town' | 'village';
  distanceKm: number;
  estimatedDeliveryMins: string;
  isDelivering: boolean;
  deliveryFeeSurcharge?: number;
  minOrderAmount?: number;
  notes?: string;
}

export interface SystemSettings {
  appName: string;
  appLogo?: string;
  appTagline?: string;
  supportPhone: string;
  supportEmail: string;
  businessAddress?: string;
  targetCity: string;
  coveredVillages?: string[];
  targetVillages?: string[];
  deliveryZones?: DeliveryAreaZone[];
  maxDeliveryRadiusKm?: number;
  strictZoneEnforcement?: boolean;
  baseDeliveryFee?: number;
  baseDeliveryCharge?: number;
  isDeliveryFree?: boolean;
  deliveryChargeType?: 'flat' | 'distance_based';
  perKmCharge?: number;
  freeDeliveryThreshold: number;
  platformFee?: number;
  taxRatePercent?: number;
  restaurantCommissionRate?: number;
  groceryCommissionRate?: number;
  autoAssignRiders?: boolean;
  acceptingOrders?: boolean;
  enableCOD?: boolean;
  enableUPI?: boolean;
  enableOnline?: boolean;
  enableWhatsAppAlerts?: boolean;
}
