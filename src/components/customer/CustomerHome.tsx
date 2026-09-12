import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FOOD_CATEGORIES, GROCERY_CATEGORIES } from '../../data/mockData';
import { Product } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';
import { PromoBannerCard } from '../common/PromoBannerCard';
import {
  Search,
  Star,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  ShieldCheck,
  Plus,
  Minus,
  Check,
  ChevronRight,
  Flame,
  ShoppingBag,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const CustomerHome: React.FC = () => {
  const {
    shops,
    products,
    banners,
    setSelectedShopId,
    setCustomerTab,
    setSelectedCategoryFilter,
    setSearchQuery,
    selectedLocation,
    setSelectedLocation,
    settings,
    cart,
    addToCart,
    updateCartQuantity,
    orders,
    setTrackingOrderId,
    user,
    setActivePortal,
    setCurrentRole,
    deliveryZones,
  } = useApp();

  const [activeMainTab, setActiveMainTab] = useState<'all' | 'food' | 'grocery'>('all');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [homeLocationInput, setHomeLocationInput] = useState(selectedLocation);
  const [locationSaveFeedback, setLocationSaveFeedback] = useState(false);

  useEffect(() => {
    setHomeLocationInput(selectedLocation);
  }, [selectedLocation]);

  const handleSaveHomeLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeLocationInput.trim()) {
      const loc = homeLocationInput.trim();
      setSelectedLocation(loc);
      try {
        localStorage.setItem('td_selected_location', loc);
      } catch {
        // ignore
      }
      setLocationSaveFeedback(true);
      setTimeout(() => setLocationSaveFeedback(false), 2500);
    }
  };

  const restaurants = shops.filter(s => s.type === 'restaurant' && s.isApproved);
  const groceryShops = shops.filter(s => s.type === 'grocery' && s.isApproved);

  const bestSellingProducts = products.filter(p => p.isBestSeller && p.isActive);
  const recommendedProducts = products.filter(p => p.isRecommended && p.isActive);

  const getProductCartQty = (productId: string) => {
    const items = cart.filter(item => item.product.id === productId);
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategoryFilter(categoryName);
    setCustomerTab('categories');
  };

  const userMobileDigits = (user.mobile || '').replace(/\D/g, '');
  const recentOrders = orders.filter(o => {
    if (!user.id && !user.mobile && !user.email) return false;
    if (o.customerId && user.id && o.customerId === user.id) return true;
    if (userMobileDigits && o.customerMobile) {
      const oDigits = o.customerMobile.replace(/\D/g, '');
      if (userMobileDigits.length >= 8 && (oDigits.includes(userMobileDigits) || userMobileDigits.includes(oDigits))) return true;
    }
    if (user.email && o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase()) {
      return true;
    }
    return false;
  }).slice(0, 2);

  return (
    <div className="pb-24 animate-in fade-in space-y-6 sm:space-y-8">
      {/* Delivery Location Selector / Manual Editable Input */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto pt-4">
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                  Delivery Location
                </span>
                {locationSaveFeedback && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Saved locally</span>
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                {selectedLocation}
              </p>
              <p className="text-[11px] text-slate-500">
                Delivering food & groceries to your doorstep or village
              </p>
            </div>
          </div>

          {/* Quick Manual Location Input Field */}
          <form
            onSubmit={handleSaveHomeLocation}
            className="flex-1 max-w-lg flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                id="customer-home-location-input"
                value={homeLocationInput}
                onChange={e => setHomeLocationInput(e.target.value)}
                placeholder="Type your area, village or town (e.g. Harishchandrapur)..."
                className="w-full text-xs py-2.5 px-3.5 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 font-semibold text-slate-900 placeholder:text-slate-400 shadow-inner"
              />
            </div>
            <button
              type="submit"
              id="customer-home-save-location-btn"
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
            >
              Set Location
            </button>
          </form>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 px-1 text-xs">
          <span className="text-[11px] text-slate-400 font-medium">Quick areas:</span>
          {deliveryZones.filter(z => z.isDelivering).slice(0, 6).map(zone => (
            <button
              key={zone.id}
              type="button"
              onClick={() => {
                setSelectedLocation(zone.name);
                setHomeLocationInput(zone.name);
                try {
                  localStorage.setItem('td_selected_location', zone.name);
                } catch {
                  // ignore
                }
                setLocationSaveFeedback(true);
                setTimeout(() => setLocationSaveFeedback(false), 2500);
              }}
              className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              {zone.name.split(' - ')[0]}
            </button>
          ))}
        </div>
      </section>

      {/* Hero Promotional Banners Carousel / Grid */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {banners.filter(b => b.isActive).map(banner => (
            <PromoBannerCard
              key={banner.id}
              banner={banner}
              onClick={() => {
                if (banner.linkType === 'shop') {
                  setSelectedShopId(banner.linkTarget);
                  setCustomerTab('shop_detail');
                } else if (banner.linkType === 'category') {
                  setSelectedCategoryFilter(banner.linkTarget);
                  setCustomerTab('categories');
                } else {
                  setCustomerTab('cart');
                }
              }}
            />
          ))}
        </div>
      </section>

      {/* Main Category Filter Bar (All / Food / Grocery) */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-slate-100/90 p-1.5 rounded-2xl flex items-center max-w-md mx-auto border border-slate-200">
          <button
            id="main-tab-all-btn"
            onClick={() => setActiveMainTab('all')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              activeMainTab === 'all'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Services
          </button>
          <button
            id="main-tab-food-btn"
            onClick={() => setActiveMainTab('food')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
              activeMainTab === 'food'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🍲 Food Delivery</span>
          </button>
          <button
            id="main-tab-grocery-btn"
            onClick={() => setActiveMainTab('grocery')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
              activeMainTab === 'grocery'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🥦 Grocery & Mandi</span>
          </button>
        </div>
      </section>

      {/* Quick Jump Search Box */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div
          onClick={() => setCustomerTab('search')}
          className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs hover:border-emerald-400 cursor-pointer flex items-center justify-between text-slate-400 group transition-all"
        >
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              Search &quot;Biryani&quot;, &quot;Atta&quot;, &quot;Pizza&quot;, &quot;Milk&quot;, or local shops...
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs hidden sm:inline-block">
            Explore 50+ Items →
          </span>
        </div>
      </section>

      {/* Food Categories Horizontal Grid */}
      {(activeMainTab === 'all' || activeMainTab === 'food') && (
        <section className="px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                <span>🍽️ Craving Food? Popular Categories</span>
              </h2>
              <p className="text-xs text-slate-500">Freshly prepared meals from top local restaurants</p>
            </div>
            <button
              onClick={() => setCustomerTab('categories')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center"
            >
              See All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {FOOD_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="bg-white hover:bg-emerald-50/60 p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-400 flex flex-col items-center text-center transition-all hover:scale-105 group shadow-2xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-emerald-100 flex items-center justify-center text-2xl mb-1.5 transition-colors">
                  {cat.icon}
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 leading-tight">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">{cat.count}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Grocery Categories Horizontal Grid */}
      {(activeMainTab === 'all' || activeMainTab === 'grocery') && (
        <section className="px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                <span>🛒 Grocery, Mandi & Daily Essentials</span>
              </h2>
              <p className="text-xs text-slate-500">Wholesale rates, fresh vegetables, atta, oils & dairy</p>
            </div>
            <button
              onClick={() => setCustomerTab('categories')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center"
            >
              See All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {GROCERY_CATEGORIES.slice(0, 7).map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="bg-white hover:bg-emerald-50/60 p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-400 flex flex-col items-center text-center transition-all hover:scale-105 group shadow-2xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-emerald-100 flex items-center justify-center text-2xl mb-1.5 transition-colors">
                  {cat.icon}
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 leading-tight">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">{cat.count}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Recently Ordered Quick Reorder Banner (if any) */}
      {recentOrders.length > 0 && (
        <section className="px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="bg-emerald-50/70 rounded-3xl p-4 sm:p-5 border border-emerald-200/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Recently Ordered Items</span>
              </span>
              <button
                onClick={() => setCustomerTab('orders')}
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                View Past Orders
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentOrders.map(ord => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl p-3 border border-emerald-100 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {ord.shopName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {ord.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                    </p>
                    <span className="text-[10px] text-slate-400">₹{ord.totalAmount} • {ord.orderStatus.replace(/_/g, ' ')}</span>
                  </div>

                  <button
                    onClick={() => {
                      setTrackingOrderId(ord.id);
                      setCustomerTab('tracking');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0"
                  >
                    Track / View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Restaurants Section */}
      {(activeMainTab === 'all' || activeMainTab === 'food') && (
        <section className="px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                ⭐ Popular Restaurants in {selectedLocation.split(' - ')[0]}
              </h2>
              <p className="text-xs text-slate-500">Biryani, Pizzas, Burgers, Rolls & Chinese favorites</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {restaurants.map(rest => (
              <div
                key={rest.id}
                onClick={() => {
                  setSelectedShopId(rest.id);
                  setCustomerTab('shop_detail');
                }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={rest.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
                      alt={rest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />

                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-slate-900">{rest.rating}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                      <span className="flex items-center space-x-1 bg-slate-900/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>{rest.deliveryTimeMins}</span>
                      </span>
                      <span className="bg-slate-900/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        {rest.distanceKm} km
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                      {rest.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {rest.cuisineOrCategory.join(' • ')}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium">Min: ₹{rest.minimumOrder}</span>
                  <span className="text-emerald-700 font-bold">
                    Delivery ₹{rest.deliveryCharge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Grocery Shops Section */}
      {(activeMainTab === 'all' || activeMainTab === 'grocery') && (
        <section className="px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                🌾 Popular Grocery & Mandi Stores
              </h2>
              <p className="text-xs text-slate-500">Fresh vegetables, organic farm produce, daily kirana items</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groceryShops.map(shop => (
              <div
                key={shop.id}
                onClick={() => {
                  setSelectedShopId(shop.id);
                  setCustomerTab('shop_detail');
                }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={shop.coverImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />

                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-slate-900">{shop.rating}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                      <span className="flex items-center space-x-1 bg-slate-900/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>{shop.deliveryTimeMins}</span>
                      </span>
                      <span className="bg-slate-900/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        {shop.distanceKm} km
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {shop.cuisineOrCategory.join(' • ')}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium">Min: ₹{shop.minimumOrder}</span>
                  <span className="text-emerald-700 font-bold">
                    Delivery ₹{shop.deliveryCharge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Best-Selling Products Section */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>Best-Selling Food & Daily Essentials</span>
            </h2>
            <p className="text-xs text-slate-500">Most ordered items in town & neighboring villages this week</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bestSellingProducts.slice(0, 8).map(prod => {
            const inCartQty = getProductCartQty(prod.id);
            const hasCustomizations = (prod.variations && prod.variations.length > 0) || (prod.addOns && prod.addOns.length > 0);

            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => setSelectedProductForModal(prod)}
                    className="relative h-36 rounded-2xl overflow-hidden bg-slate-100 cursor-pointer group"
                  >
                    <img
                      src={prod.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center space-x-1">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          prod.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      />
                      <span>{prod.isVeg ? 'Veg' : 'Non-Veg'}</span>
                    </div>

                    {prod.discountPercentage > 0 && (
                      <span className="absolute bottom-2 right-2 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md">
                        {prod.discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {prod.category} • {prod.shopName}
                    </span>
                    <h3
                      onClick={() => setSelectedProductForModal(prod)}
                      className="font-bold text-sm text-slate-900 hover:text-emerald-700 cursor-pointer mt-0.5 line-clamp-1"
                    >
                      {prod.name}
                    </h3>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-sm font-black text-slate-900">
                        ₹{prod.sellingPrice}
                      </span>
                      {prod.mrp > prod.sellingPrice && (
                        <span className="text-[11px] text-slate-400 line-through">
                          ₹{prod.mrp}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {prod.unit}
                    </span>
                  </div>

                  {/* Add Button / Qty */}
                  <div>
                    {inCartQty === 0 ? (
                      <button
                        onClick={() => {
                          if (hasCustomizations) {
                            setSelectedProductForModal(prod);
                          } else {
                            addToCart(prod);
                          }
                        }}
                        className="bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-400/80 shadow-xs py-1.5 px-3 rounded-xl font-black text-xs uppercase transition-all"
                      >
                        ADD
                      </button>
                    ) : (
                      <div className="flex items-center space-x-1 bg-emerald-600 text-white rounded-xl p-1 shadow-xs">
                        <button
                          onClick={() => {
                            const item = cart.find(c => c.product.id === prod.id);
                            if (item) updateCartQuantity(item.id, -1);
                          }}
                          className="w-5 h-5 rounded flex items-center justify-center hover:bg-emerald-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1">{inCartQty}</span>
                        <button
                          onClick={() => {
                            if (hasCustomizations) {
                              setSelectedProductForModal(prod);
                            } else {
                              addToCart(prod);
                            }
                          }}
                          className="w-5 h-5 rounded flex items-center justify-center hover:bg-emerald-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hyperlocal Village Assurance Banner */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              🌾 Hyperlocal Rural & Town Logistics
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Serving Harishchandrapur & All Surrounding Villages
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
              {deliveryZones.filter(z => z.isDelivering).map(z => z.name.split(' - ')[0]).slice(0, 7).join(', ')}. Express delivery guaranteed with local partner riders who know every village road, lane, and landmark.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl text-center">
              <span className="block text-xl font-black">15-30</span>
              <span className="text-[10px] text-emerald-200 uppercase font-bold">Mins Avg Delivery</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl text-center">
              <span className="block text-xl font-black">100%</span>
              <span className="text-[10px] text-emerald-200 uppercase font-bold">Fresh Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Subtle Footer with Discreet Administrator Entrance */}
      <footer className="mt-12 mb-16 py-8 border-t border-slate-200/80 text-center text-xs text-slate-400">
        <div className="max-w-md mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-500">
            © {new Date().getFullYear()} {settings.appName} • Hyperlocal Town & Rural Quick Delivery
          </p>
          <p className="text-[11px] text-slate-400">
            Serving all local wards, colonies, and village clusters with express delivery.
          </p>
          <div className="pt-3 flex items-center justify-center space-x-2">
            <button
              id="discreet-admin-entry-btn"
              type="button"
              onClick={() => {
                setActivePortal('admin');
                setCurrentRole('admin');
              }}
              className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors flex items-center space-x-1 cursor-pointer py-1 px-2 rounded-md hover:bg-slate-200/50"
              title="Administrator Login"
            >
              <Lock className="w-2.5 h-2.5 opacity-60" />
              <span>Admin Portal Access</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modal for product details */}
      {selectedProductForModal && (
        <ProductDetailModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
        />
      )}
    </div>
  );
};
