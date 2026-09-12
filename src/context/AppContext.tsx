import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  AdminUser,
  Shop,
  Product,
  CartItem,
  Order,
  DeliveryPartner,
  Coupon,
  PromoBanner,
  SystemSettings,
  AppNotification,
  WalletTransaction,
  UserAddress,
  OrderStatus,
  DeliveryAreaZone,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_CUSTOMERS,
  MASTER_ADMIN_CREDENTIALS,
  INITIAL_SHOPS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_DELIVERY_PARTNERS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_SETTINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DELIVERY_ZONES,
  TOWN_LOCATIONS
} from '../data/mockData';
import { safeStorage } from '../utils/storage';

interface AppContextType {
  // Navigation & Role
  currentRole: 'customer' | 'admin';
  setCurrentRole: (role: 'customer' | 'admin') => void;
  activePortal: 'gateway' | 'customer' | 'admin';
  setActivePortal: (portal: 'gateway' | 'customer' | 'admin') => void;
  customerTab: string;
  setCustomerTab: (tab: string) => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;
  selectedShopId: string | null;
  setSelectedShopId: (id: string | null) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (cat: string | null) => void;

  // User & Profile
  user: User;
  allCustomers: User[];
  updateUserProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  switchCustomerAccount: (customerId: string) => void;

  // Shops & Products
  shops: Shop[];
  products: Product[];
  addShop: (shop: Omit<Shop, 'id'>) => void;
  updateShop: (id: string, shop: Partial<Shop>) => void;
  deleteShop: (id: string) => void;
  toggleShopStatus: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  bulkAddProducts: (newProducts: Omit<Product, 'id'>[]) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variationId?: string, addOnIds?: string[], specialInstructions?: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotals: {
    subtotal: number;
    deliveryFee: number;
    platformFee: number;
    taxes: number;
    couponDiscount: number;
    grandTotal: number;
    itemCount: number;
  };

  // Orders
  orders: Order[];
  placeOrder: (
    paymentMethod: 'cod' | 'upi' | 'online',
    deliveryAddress: UserAddress,
    instructions?: string,
    customerDetails?: { name?: string; mobile?: string; email?: string }
  ) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  assignDeliveryPartner: (orderId: string, partnerId: string) => void;
  autoAssignNearestPartner: (orderId: string) => void;
  rateOrder: (orderId: string, rating: number, review: string) => void;
  cancelOrder: (orderId: string) => void;

  // Delivery Partners
  deliveryPartners: DeliveryPartner[];
  addDeliveryPartner: (partner: Omit<DeliveryPartner, 'id'>) => void;
  updateDeliveryPartner: (id: string, data: Partial<DeliveryPartner>) => void;
  toggleDeliveryPartnerApproval: (id: string) => void;

  // Coupons & Banners
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;
  banners: PromoBanner[];
  addBanner: (banner: Omit<PromoBanner, 'id'>) => void;
  updateBanner: (id: string, banner: Partial<PromoBanner>) => void;
  toggleBanner: (id: string) => void;
  deleteBanner: (id: string) => void;

  // Wallet
  walletTransactions: WalletTransaction[];
  addMoneyToWallet: (amount: number) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (title: string, message: string, type: 'order' | 'promo' | 'wallet' | 'system', orderId?: string) => void;

  // Settings
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;

  // Delivery Areas & Village Coverage Control
  deliveryZones: DeliveryAreaZone[];
  addDeliveryZone: (zone: Omit<DeliveryAreaZone, 'id'>) => void;
  updateDeliveryZone: (id: string, updates: Partial<DeliveryAreaZone>) => void;
  toggleDeliveryZoneStatus: (id: string) => void;
  deleteDeliveryZone: (id: string) => void;
  resetDeliveryZonesToDefault: () => void;
  checkAreaDelivering: (areaName: string) => { allowed: boolean; zone?: DeliveryAreaZone; reason?: string };

  // Authentication & Single Admin
  isLoggedIn: boolean; // alias for isCustomerLoggedIn
  isCustomerLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  adminUser: AdminUser;
  adminCount: number; // strictly 1
  loginUser: (mobileOrEmail: string, name?: string) => void;
  logoutUser: () => void;
  loginCustomer: (email: string, mobile: string, password?: string) => { success: boolean; message: string };
  registerCustomer: (data: { name: string; mobile: string; email: string; password?: string; townOrVillage?: string; addressText?: string }) => { success: boolean; message: string };
  logoutCustomer: () => void;
  loginAdmin: (usernameOrEmail: string, password: string, securityPin?: string) => { success: boolean; message: string };
  logoutAdmin: () => void;
  activeAuthModal: 'none' | 'customer' | 'admin';
  setActiveAuthModal: (modal: 'none' | 'customer' | 'admin') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Portal & Role State
  const [activePortal, setActivePortal] = useState<'gateway' | 'customer' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('portal') === 'admin' || urlParams.get('admin') === 'true' || window.location.hash.includes('admin')) {
          return 'admin';
        }
      } catch {
        // ignore
      }
    }
    const saved = safeStorage.getItem('td_active_portal');
    if (saved === 'admin') {
      return 'admin';
    }
    return 'customer';
  });
  const [currentRole, setCurrentRole] = useState<'customer' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('portal') === 'admin' || urlParams.get('admin') === 'true' || window.location.hash.includes('admin')) {
          return 'admin';
        }
      } catch {
        // ignore
      }
    }
    const saved = safeStorage.getItem('td_active_portal');
    return saved === 'admin' ? 'admin' : 'customer';
  });
  const [customerTab, setCustomerTab] = useState<string>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>(() => {
    const saved = safeStorage.getItem('td_selected_location');
    return saved || TOWN_LOCATIONS[0].name;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Entities with LocalStorage Persistence
  const [allCustomers, setAllCustomers] = useState<User[]>(() => {
    return safeStorage.getArray('td_all_customers', INITIAL_CUSTOMERS);
  });

  const [user, setUser] = useState<User>(() => {
    const parsed = safeStorage.getJSON<User | null>('td_user', null);
    if (parsed && typeof parsed === 'object' && parsed.id) {
      return {
        ...INITIAL_CUSTOMERS[0],
        ...parsed,
        addresses: Array.isArray(parsed.addresses) ? parsed.addresses : INITIAL_CUSTOMERS[0].addresses,
      };
    }
    return INITIAL_CUSTOMERS[0];
  });

  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState<boolean>(() => {
    const saved = safeStorage.getItem('td_customer_auth');
    return saved !== null ? saved === 'true' : true;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return safeStorage.getItem('td_admin_auth') === 'true';
  });

  const [activeAuthModal, setActiveAuthModal] = useState<'none' | 'customer' | 'admin'>('none');

  const adminUser = MASTER_ADMIN_CREDENTIALS;
  const adminCount = 1; // Strictly 1 single administrator

  const [shops, setShops] = useState<Shop[]>(() => {
    return safeStorage.getArray('td_shops', INITIAL_SHOPS);
  });

  const [products, setProducts] = useState<Product[]>(() => {
    return safeStorage.getArray('td_products', INITIAL_PRODUCTS);
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    return safeStorage.getArray('td_cart', []);
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    return safeStorage.getArray('td_orders', INITIAL_ORDERS);
  });

  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>(() => {
    return safeStorage.getArray('td_partners', INITIAL_DELIVERY_PARTNERS);
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    return safeStorage.getArray('td_coupons', INITIAL_COUPONS);
  });

  const [banners, setBanners] = useState<PromoBanner[]>(() => {
    const list = safeStorage.getArray<PromoBanner>('td_banners', INITIAL_BANNERS);
    return list.map(b => ({
      ...b,
      title: b?.title || 'Offer',
      bgColor: b?.bgColor || 'from-emerald-600 to-teal-800',
      isActive: b?.isActive !== false,
    }));
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const parsed = safeStorage.getJSON<SystemSettings | null>('td_settings', null);
    if (parsed && typeof parsed === 'object') {
      return { ...INITIAL_SETTINGS, ...parsed };
    }
    return INITIAL_SETTINGS;
  });

  const [deliveryZones, setDeliveryZones] = useState<DeliveryAreaZone[]>(() => {
    const zones = safeStorage.getArray<DeliveryAreaZone>('td_delivery_zones', []);
    if (zones.length > 0) return zones;
    const savedSettings = safeStorage.getJSON<any>('td_settings', null);
    if (savedSettings && Array.isArray(savedSettings.deliveryZones) && savedSettings.deliveryZones.length > 0) {
      return savedSettings.deliveryZones;
    }
    return INITIAL_DELIVERY_ZONES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    return safeStorage.getArray('td_notifs', INITIAL_NOTIFICATIONS);
  });

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx_1',
      userId: 'usr_001',
      amount: 50,
      type: 'credit',
      description: 'Welcome Bonus Credited',
      date: '2026-09-08'
    },
    {
      id: 'tx_2',
      userId: 'usr_001',
      amount: 190,
      type: 'credit',
      description: 'UPI Wallet Topup',
      date: '2026-09-09'
    }
  ]);

  // Sync to safeStorage
  useEffect(() => {
    safeStorage.setJSON('td_user', user);
    setAllCustomers(prev => prev.map(c => (c.id === user.id ? user : c)));
  }, [user]);

  useEffect(() => {
    safeStorage.setJSON('td_all_customers', allCustomers);
  }, [allCustomers]);

  useEffect(() => {
    safeStorage.setItem('td_customer_auth', String(isCustomerLoggedIn));
  }, [isCustomerLoggedIn]);

  useEffect(() => {
    safeStorage.setItem('td_admin_auth', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  useEffect(() => {
    safeStorage.setJSON('td_shops', shops);
  }, [shops]);

  useEffect(() => {
    safeStorage.setJSON('td_products', products);
  }, [products]);

  useEffect(() => {
    safeStorage.setJSON('td_cart', cart);
  }, [cart]);

  useEffect(() => {
    safeStorage.setJSON('td_orders', orders);
  }, [orders]);

  useEffect(() => {
    safeStorage.setJSON('td_partners', deliveryPartners);
  }, [deliveryPartners]);

  useEffect(() => {
    safeStorage.setItem('td_active_portal', activePortal);
  }, [activePortal]);

  useEffect(() => {
    if (selectedLocation) {
      safeStorage.setItem('td_selected_location', selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
    safeStorage.setJSON('td_coupons', coupons);
  }, [coupons]);

  useEffect(() => {
    safeStorage.setJSON('td_banners', banners);
  }, [banners]);

  useEffect(() => {
    safeStorage.setJSON('td_settings', settings);
  }, [settings]);

  useEffect(() => {
    safeStorage.setJSON('td_notifs', notifications);
  }, [notifications]);

  // User Actions
  const updateUserProfile = (data: Partial<User>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  const addAddress = (address: Omit<UserAddress, 'id'>) => {
    const newAddr: UserAddress = {
      ...address,
      id: 'addr_' + Date.now(),
      isDefault: user.addresses.length === 0,
    };
    setUser(prev => ({ ...prev, addresses: [...prev.addresses, newAddr] }));
  };

  const deleteAddress = (id: string) => {
    setUser(prev => ({
      ...prev,
      addresses: prev.addresses.filter(a => a.id !== id),
    }));
  };

  const setDefaultAddress = (id: string) => {
    setUser(prev => ({
      ...prev,
      addresses: prev.addresses.map(a => ({
        ...a,
        isDefault: a.id === id,
      })),
    }));
  };

  const switchCustomerAccount = (customerId: string) => {
    const found = allCustomers.find(c => c.id === customerId);
    if (found) {
      setUser(found);
      setIsCustomerLoggedIn(true);
      addNotification('Account Switched', `Logged in as ${found.name}`, 'system');
    }
  };

  const loginCustomer = (email: string, mobile: string, password?: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanMobileDigits = mobile.replace(/\D/g, '');

    if (!cleanEmail && !cleanMobileDigits) {
      return { success: false, message: 'Please enter your Gmail and Mobile number.' };
    }

    // Check existing
    const found = allCustomers.find(c => {
      const cEmail = (c.email || '').trim().toLowerCase();
      const cDigits = (c.mobile || '').replace(/\D/g, '');
      const emailMatches = cleanEmail ? cEmail === cleanEmail : false;
      const mobileMatches = cleanMobileDigits.length >= 8 && cDigits.includes(cleanMobileDigits);
      return emailMatches || mobileMatches;
    });

    if (found) {
      if (password && found.password && found.password !== password.trim()) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }
      setUser(found);
      setIsCustomerLoggedIn(true);
      addNotification('Welcome Back', `Logged in as ${found.name}`, 'system');
      return { success: true, message: `Welcome back, ${found.name}!` };
    }

    return {
      success: false,
      message: 'No account found with this Gmail/Mobile. Please switch to "New Customer" tab to create your account.'
    };
  };

  const registerCustomer = (data: {
    name: string;
    mobile: string;
    email: string;
    password?: string;
    townOrVillage?: string;
    addressText?: string;
  }): { success: boolean; message: string } => {
    const cleanDigits = data.mobile.replace(/\D/g, '');
    const cleanEmail = data.email.trim().toLowerCase();

    const existing = allCustomers.find(c =>
      (cleanEmail && c.email.toLowerCase() === cleanEmail) ||
      (cleanDigits.length >= 8 && c.mobile.replace(/\D/g, '').includes(cleanDigits))
    );

    if (existing) {
      setUser(existing);
      setIsCustomerLoggedIn(true);
      return { success: true, message: `Account already exists! Signed in as ${existing.name}.` };
    }

    const newCustomer: User = {
      id: 'usr_' + Date.now(),
      name: data.name.trim() || 'Customer',
      mobile: data.mobile.trim(),
      email: data.email.trim(),
      password: data.password?.trim() || 'customer123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'customer',
      walletBalance: 0, // No auto wallet money!
      addresses: data.addressText?.trim() ? [
        {
          id: 'addr_' + Date.now(),
          label: 'Home',
          street: data.addressText.trim(),
          area: data.townOrVillage?.trim() || 'Local Area',
          townOrVillage: data.townOrVillage?.trim() || 'Town / Village',
          isDefault: true,
        }
      ] : [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAllCustomers(prev => [...prev, newCustomer]);
    setUser(newCustomer);
    setIsCustomerLoggedIn(true);
    addNotification('Account Created', `Welcome to TownDrop, ${newCustomer.name}!`, 'system');
    return { success: true, message: `Account created successfully for ${newCustomer.name}!` };
  };

  const logoutCustomer = () => {
    setIsCustomerLoggedIn(false);
    setUser({
      id: '',
      name: '',
      mobile: '',
      email: '',
      password: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'customer',
      walletBalance: 0,
      addresses: [],
      createdAt: new Date().toISOString().split('T')[0]
    });
  };

  const loginUser = (mobileOrEmail: string, name?: string) => {
    loginCustomer(mobileOrEmail, mobileOrEmail);
  };

  const logoutUser = () => {
    logoutCustomer();
  };

  // Admin Authentication (Strictly 1 Single Administrator)
  const loginAdmin = (usernameOrEmail: string, password: string): { success: boolean; message: string } => {
    const clean = usernameOrEmail.trim().toLowerCase();
    const isMatch =
      (clean === MASTER_ADMIN_CREDENTIALS.email.toLowerCase() ||
       clean === MASTER_ADMIN_CREDENTIALS.username.toLowerCase() ||
       clean === 'ankit' ||
       clean === 'ankit@towndrop.in') &&
      password === MASTER_ADMIN_CREDENTIALS.password;

    if (!isMatch) {
      return {
        success: false,
        message: 'Invalid Master Admin credentials. Only the 1 designated Master Administrator is authorized.'
      };
    }

    setIsAdminLoggedIn(true);
    addNotification('Master Admin Verified', 'Single-administrator session authorized.', 'system');
    return {
      success: true,
      message: 'Master Admin authenticated successfully. Single-admin access granted.'
    };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setCurrentRole('customer');
  };

  // Cart Operations
  const addToCart = (
    product: Product,
    variationId?: string,
    addOnIds: string[] = [],
    specialInstructions?: string
  ) => {
    const variation = product.variations?.find(v => v.id === variationId);
    const selectedAddOns = product.addOns?.filter(a => addOnIds.includes(a.id)) || [];

    const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const itemPrice = product.sellingPrice + (variation ? variation.priceModifier : 0) + addOnsTotal;

    const cartItemId = `${product.id}_${variationId || 'base'}_${addOnIds.sort().join('-')}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            product,
            quantity: 1,
            selectedVariation: variation,
            selectedAddOns,
            specialInstructions,
            itemPrice,
          },
        ];
      }
    });
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
  const isFreeDelivery = !!(
    settings.isDeliveryFree ||
    settings.baseDeliveryCharge === 0 ||
    settings.baseDeliveryFee === 0 ||
    (settings.freeDeliveryThreshold > 0 && subtotal >= settings.freeDeliveryThreshold)
  );
  const baseRate = settings.baseDeliveryCharge ?? settings.baseDeliveryFee ?? 20;
  const activeZone = deliveryZones.find(
    z => z.name.toLowerCase() === selectedLocation.toLowerCase() ||
         selectedLocation.toLowerCase().includes(z.name.toLowerCase())
  );
  const zoneSurcharge = (!isFreeDelivery && activeZone?.deliveryFeeSurcharge) ? activeZone.deliveryFeeSurcharge : 0;
  const deliveryFee = cart.length > 0 ? (isFreeDelivery ? 0 : baseRate + zoneSurcharge) : 0;
  // Per user directive: "Don't charge or show any extra charges or gst or other"
  const platformFee = 0;
  const taxes = 0;

  let couponDiscount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minimumOrder) {
    if (appliedCoupon.discountType === 'percentage') {
      const calculated = (subtotal * appliedCoupon.discountValue) / 100;
      couponDiscount = appliedCoupon.maximumDiscount ? Math.min(calculated, appliedCoupon.maximumDiscount) : calculated;
    } else {
      couponDiscount = appliedCoupon.discountValue;
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - couponDiscount);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = (code: string) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (subtotal < coupon.minimumOrder) {
      return { success: false, message: `Minimum order amount for ${coupon.code} is ₹${coupon.minimumOrder}.` };
    }
    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon ${coupon.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Order Placement & Tracking
  const placeOrder = (
    paymentMethod: 'cod' | 'upi' | 'online',
    deliveryAddress: UserAddress,
    instructions?: string,
    customerDetails?: { name?: string; mobile?: string; email?: string }
  ): Order => {
    const firstShop = cart[0]?.product;
    const shop = shops.find(s => s.id === firstShop?.shopId) || shops[0];

    const commRate = shop.type === 'restaurant' ? settings.restaurantCommissionRate : settings.groceryCommissionRate;
    const shopCommission = Math.round((subtotal * commRate) / 100 * 100) / 100;
    const netPayable = Math.max(0, subtotal - shopCommission);

    const cName = customerDetails?.name?.trim() || user.name || 'Customer';
    const cMobile = customerDetails?.mobile?.trim() || user.mobile || '';
    const cEmail = customerDetails?.email?.trim() || user.email || '';

    // If customer updated their contact info at checkout, update active user profile
    if (user.id && (cName !== user.name || cMobile !== user.mobile || cEmail !== user.email)) {
      setUser(prev => ({
        ...prev,
        name: cName || prev.name,
        mobile: cMobile || prev.mobile,
        email: cEmail || prev.email
      }));
    }

    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      orderNumber: 'TD-' + Math.floor(1000 + Math.random() * 9000),
      customerId: user.id || 'usr_' + Date.now(),
      customerName: cName,
      customerMobile: cMobile,
      customerEmail: cEmail,
      deliveryAddress,
      shopId: shop.id,
      shopName: shop.name,
      shopType: shop.type,
      items: [...cart],
      itemTotal: subtotal,
      deliveryFee,
      platformFee,
      taxes,
      couponDiscount,
      appliedCouponCode: appliedCoupon?.code,
      totalAmount: grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'pending',
      deliveryInstructions: instructions,
      estimatedDeliveryTime: '25-35 mins',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shopCommission,
      netPayableToShop: netPayable,
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setTrackingOrderId(newOrder.id);
    setCustomerTab('tracking');

    addNotification(
      'Order Placed! 🛍️',
      `Order ${newOrder.orderNumber} for ₹${newOrder.totalAmount} has been placed with ${shop.name}.`,
      'order',
      newOrder.id
    );

    // If auto-assign is on, simulate automated progression
    if (settings.autoAssignRiders) {
      setTimeout(() => {
        autoAssignNearestPartner(newOrder.id);
      }, 5000);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updated = { ...ord, orderStatus: newStatus, updatedAt: new Date().toISOString() };
          if (newStatus === 'delivered') {
            updated.paymentStatus = 'paid';
          }
          return updated;
        }
        return ord;
      })
    );

    const ord = orders.find(o => o.id === orderId);
    if (ord) {
      const statusLabels: Record<OrderStatus, string> = {
        pending: 'Pending merchant confirmation',
        accepted: 'Accepted by merchant',
        preparing: 'Kitchen/Shop is preparing your order',
        ready: 'Order is packed & ready for pickup',
        assigned: 'Delivery partner assigned',
        out_for_delivery: 'Out for delivery 🛵',
        delivered: 'Delivered successfully! Enjoy your meal/groceries 🎉',
        cancelled: 'Order has been cancelled',
        refunded: 'Payment refunded to wallet/bank',
      };
      addNotification(
        `Order ${ord.orderNumber} Update`,
        statusLabels[newStatus],
        'order',
        ord.id
      );
    }
  };

  const assignDeliveryPartner = (orderId: string, partnerId: string) => {
    const partner = deliveryPartners.find(p => p.id === partnerId);
    if (!partner) return;

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            deliveryPartnerId: partner.id,
            deliveryPartnerName: partner.name,
            deliveryPartnerMobile: partner.mobile,
            orderStatus: 'assigned',
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );

    setDeliveryPartners(prev =>
      prev.map(p => (p.id === partnerId ? { ...p, status: 'busy' } : p))
    );
  };

  const autoAssignNearestPartner = (orderId: string) => {
    const available = deliveryPartners.find(p => p.status === 'active' && p.isApproved && !p.isBlocked);
    if (available) {
      assignDeliveryPartner(orderId, available.id);
    }
  };

  const rateOrder = (orderId: string, rating: number, review: string) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, rating, reviewComment: review } : ord))
    );
    addNotification('Review Submitted', `Thank you for rating your order ${rating}★!`, 'system', orderId);
  };

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
    // If prepaid, refund to wallet
    const ord = orders.find(o => o.id === orderId);
    if (ord && ord.paymentStatus === 'paid') {
      addMoneyToWallet(ord.totalAmount);
      addNotification('Refund Credited', `₹${ord.totalAmount} refunded to your TownDrop Wallet.`, 'wallet', orderId);
    }
  };

  // Wallet
  const addMoneyToWallet = (amount: number) => {
    setUser(prev => ({ ...prev, walletBalance: prev.walletBalance + amount }));
    setWalletTransactions(prev => [
      {
        id: 'tx_' + Date.now(),
        userId: user.id,
        amount,
        type: 'credit',
        description: 'Wallet Balance Added',
        date: new Date().toISOString().split('T')[0],
      },
      ...prev,
    ]);
  };

  // Notifications
  const addNotification = (
    title: string,
    message: string,
    type: 'order' | 'promo' | 'wallet' | 'system',
    orderId?: string
  ) => {
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      title,
      message,
      time: 'Just now',
      isRead: false,
      type,
      orderId,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Admin Shop Management
  const addShop = (newShop: Omit<Shop, 'id'>) => {
    const shop: Shop = { ...newShop, id: 'shp_' + Date.now() };
    setShops(prev => [shop, ...prev]);
  };

  const updateShop = (id: string, updated: Partial<Shop>) => {
    setShops(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteShop = (id: string) => {
    setShops(prev => prev.filter(s => s.id !== id));
    setProducts(prev => prev.filter(p => p.shopId !== id));
    addNotification('Shop Removed', 'Merchant and associated items removed from platform.', 'system');
  };

  const toggleShopStatus = (id: string) => {
    setShops(prev => prev.map(s => (s.id === id ? { ...s, isOpen: !s.isOpen } : s)));
  };

  // Product Management
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const prod: Product = { ...newProd, id: 'prod_' + Date.now() };
    setProducts(prev => [prod, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const bulkAddProducts = (newProducts: Omit<Product, 'id'>[]) => {
    const created: Product[] = newProducts.map((p, idx) => ({
      ...p,
      id: `prod_bulk_${Date.now()}_${idx}`,
    }));
    setProducts(prev => [...created, ...prev]);
  };

  // Delivery Partner Management
  const addDeliveryPartner = (partner: Omit<DeliveryPartner, 'id'>) => {
    const newPartner: DeliveryPartner = { ...partner, id: 'dlv_' + Date.now() };
    setDeliveryPartners(prev => [newPartner, ...prev]);
  };

  const updateDeliveryPartner = (id: string, data: Partial<DeliveryPartner>) => {
    setDeliveryPartners(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
  };

  const toggleDeliveryPartnerApproval = (id: string) => {
    setDeliveryPartners(prev =>
      prev.map(p => (p.id === id ? { ...p, isApproved: !p.isApproved } : p))
    );
  };

  // Coupons & Banners
  const addCoupon = (coupon: Omit<Coupon, 'id'>) => {
    setCoupons(prev => [{ ...coupon, id: 'cp_' + Date.now() }, ...prev]);
  };

  const toggleCoupon = (id: string) => {
    setCoupons(prev => prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const addBanner = (banner: Omit<PromoBanner, 'id'>) => {
    setBanners(prev => [{ ...banner, id: 'ban_' + Date.now() }, ...prev]);
  };

  const updateBanner = (id: string, updated: Partial<PromoBanner>) => {
    setBanners(prev => prev.map(b => (b.id === id ? { ...b, ...updated } : b)));
  };

  const toggleBanner = (id: string) => {
    setBanners(prev => prev.map(b => (b.id === id ? { ...b, isActive: !b.isActive } : b)));
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  // Settings
  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Delivery Areas & Village Coverage Control
  useEffect(() => {
    safeStorage.setJSON('td_delivery_zones', deliveryZones);
    setSettings(prev => ({
      ...prev,
      deliveryZones,
      coveredVillages: (deliveryZones || []).filter(z => z && z.isDelivering).map(z => z.name),
      targetVillages: (deliveryZones || []).filter(Boolean).map(z => z.name)
    }));
  }, [deliveryZones]);

  const addDeliveryZone = (zone: Omit<DeliveryAreaZone, 'id'>) => {
    const newZone: DeliveryAreaZone = {
      ...zone,
      id: 'zone_' + Date.now(),
    };
    setDeliveryZones(prev => [...prev, newZone]);
    addNotification('Delivery Area Added', `Added ${zone.name} to DailyGo delivery service areas.`, 'system');
  };

  const updateDeliveryZone = (id: string, updates: Partial<DeliveryAreaZone>) => {
    setDeliveryZones(prev => prev.map(z => z.id === id ? { ...z, ...updates } : z));
  };

  const toggleDeliveryZoneStatus = (id: string) => {
    setDeliveryZones(prev => prev.map(z => {
      if (z.id === id) {
        const newState = !z.isDelivering;
        addNotification(
          newState ? 'Delivery Area Activated' : 'Delivery Area Paused',
          `${z.name} is now ${newState ? 'ACTIVE for delivery' : 'PAUSED (Delivery stopped)'}.`,
          'system'
        );
        return { ...z, isDelivering: newState };
      }
      return z;
    }));
  };

  const deleteDeliveryZone = (id: string) => {
    const zone = deliveryZones.find(z => z.id === id);
    setDeliveryZones(prev => prev.filter(z => z.id !== id));
    if (zone) {
      addNotification('Delivery Area Removed', `Removed ${zone.name} from delivery service areas.`, 'system');
    }
  };

  const resetDeliveryZonesToDefault = () => {
    setDeliveryZones(INITIAL_DELIVERY_ZONES);
    addNotification('Delivery Areas Reset', 'Restored standard Harishchandrapur & Surrounding Villages delivery zones.', 'system');
  };

  const checkAreaDelivering = (areaName: string): { allowed: boolean; zone?: DeliveryAreaZone; reason?: string } => {
    if (!areaName || !areaName.trim()) {
      return { allowed: true };
    }
    const clean = areaName.toLowerCase().replace(/village|gram|road|station|more|market|hub|town/gi, '').trim();
    
    // Exact or partial name match
    const found = deliveryZones.find(z => {
      const zClean = z.name.toLowerCase().replace(/village|gram|road|station|more|market|hub|town/gi, '').trim();
      return (
        z.name.toLowerCase() === areaName.toLowerCase() ||
        z.name.toLowerCase().includes(clean) ||
        (clean.length >= 3 && zClean.includes(clean))
      );
    });

    if (found) {
      if (!found.isDelivering) {
        return {
          allowed: false,
          zone: found,
          reason: `Delivery to ${found.name} is currently suspended by DailyGo Admin.`
        };
      }
      return { allowed: true, zone: found };
    }

    // If strictly checking zones
    if (settings.strictZoneEnforcement) {
      // If it contains Harishchandrapur, allow
      if (areaName.toLowerCase().includes('harishchandrapur')) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: `DailyGo currently only delivers in Harishchandrapur and active surrounding villages.`
      };
    }

    return { allowed: true };
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activePortal,
        setActivePortal,
        customerTab,
        setCustomerTab,
        adminTab,
        setAdminTab,
        selectedShopId,
        setSelectedShopId,
        trackingOrderId,
        setTrackingOrderId,
        selectedLocation,
        setSelectedLocation,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        user,
        allCustomers,
        updateUserProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        switchCustomerAccount,
        shops,
        products,
        addShop,
        updateShop,
        deleteShop,
        toggleShopStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkAddProducts,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartTotals: {
          subtotal,
          deliveryFee,
          platformFee,
          taxes,
          couponDiscount,
          grandTotal,
          itemCount,
        },
        orders,
        placeOrder,
        updateOrderStatus,
        assignDeliveryPartner,
        autoAssignNearestPartner,
        rateOrder,
        cancelOrder,
        deliveryPartners,
        addDeliveryPartner,
        updateDeliveryPartner,
        toggleDeliveryPartnerApproval,
        coupons,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        banners,
        addBanner,
        updateBanner,
        toggleBanner,
        deleteBanner,
        walletTransactions,
        addMoneyToWallet,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        addNotification,
        settings,
        updateSettings,
        deliveryZones,
        addDeliveryZone,
        updateDeliveryZone,
        toggleDeliveryZoneStatus,
        deleteDeliveryZone,
        resetDeliveryZonesToDefault,
        checkAreaDelivering,
        isLoggedIn: isCustomerLoggedIn,
        isCustomerLoggedIn,
        isAdminLoggedIn,
        adminUser,
        adminCount,
        loginUser,
        logoutUser,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        loginAdmin,
        logoutAdmin,
        activeAuthModal,
        setActiveAuthModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
