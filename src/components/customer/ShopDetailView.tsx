import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';
import {
  Star,
  Clock,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  MapPin,
  Phone,
  Filter
} from 'lucide-react';

export const ShopDetailView: React.FC = () => {
  const {
    selectedShopId,
    setSelectedShopId,
    shops,
    products,
    cart,
    addToCart,
    updateCartQuantity,
    setCustomerTab
  } = useApp();

  const shop = shops.find(s => s.id === selectedShopId) || shops[0];
  const shopProducts = products.filter(p => p.shopId === shop.id && p.isActive);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchInShop, setSearchInShop] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Extract distinct categories in this shop
  const shopCategories = Array.from(new Set(shopProducts.map(p => p.category)));

  // Filtered products
  const filteredProducts = shopProducts.filter(p => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (vegOnly && !p.isVeg) return false;
    if (searchInShop.trim()) {
      const q = searchInShop.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const getProductCartQty = (productId: string) => {
    const items = cart.filter(item => item.product.id === productId);
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="pb-24 animate-in fade-in">
      {/* Top Banner Navigation */}
      <div className="relative h-60 sm:h-72 bg-slate-900 overflow-hidden">
        <img
          src={shop.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
          alt={shop.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <button
          id="back-to-home-from-shop-btn"
          onClick={() => {
            setSelectedShopId(null);
            setCustomerTab('home');
          }}
          className="absolute top-4 left-4 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Status Tag */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md flex items-center space-x-1.5 shadow-sm ${
              shop.isOpen
                ? 'bg-emerald-500/90 text-white'
                : 'bg-rose-500/90 text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>{shop.isOpen ? 'Open Now' : 'Closed for Orders'}</span>
          </span>
        </div>

        {/* Shop Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-white flex items-end justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <img
              src={shop.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200'}
              alt={shop.name}
              className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-white/80 shadow-lg bg-white"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold uppercase tracking-wider">
                  {shop.type === 'restaurant' ? 'Restaurant' : 'Grocery Store'}
                </span>
                <span className="text-xs text-slate-300">
                  {shop.openingHours}
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black mt-1 leading-tight drop-shadow-xs">
                {shop.name}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                {shop.cuisineOrCategory.join(' • ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="flex items-center space-x-1 font-bold text-slate-900 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/80">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{shop.rating}</span>
              <span className="text-[11px] text-slate-400 font-normal">
                ({shop.reviewCount}+ ratings)
              </span>
            </div>

            <div className="flex items-center space-x-1 font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{shop.deliveryTimeMins}</span>
            </div>

            <div className="flex items-center space-x-1 font-semibold text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{shop.distanceKm} km ({shop.locationName})</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-lg">
              Min. Order: ₹{shop.minimumOrder}
            </span>
            <span className="text-slate-500">
              Delivery: ₹{shop.deliveryCharge} (Free &gt; ₹299)
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar within Shop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="shop-search-input"
              value={searchInShop}
              onChange={e => setSearchInShop(e.target.value)}
              placeholder={`Search items in ${shop.name}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          {/* Veg Only Toggle */}
          <button
            id="toggle-veg-filter-btn"
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              vegOnly
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full border border-emerald-600 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </span>
            <span>Veg Only</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 no-scrollbar">
          <button
            id="cat-filter-all-btn"
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Items ({shopProducts.length})
          </button>
          {shopCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              {activeCategory === 'all' ? 'Recommended & Menu Items' : activeCategory}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredProducts.length} items
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80">
              <p className="text-slate-500 font-medium text-sm">
                No products found matching your search or filters.
              </p>
              <button
                id="reset-shop-filters-btn"
                onClick={() => {
                  setSearchInShop('');
                  setVegOnly(false);
                  setActiveCategory('all');
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map(product => {
                const inCartQty = getProductCartQty(product.id);
                const hasCustomizations = (product.variations && product.variations.length > 0) || (product.addOns && product.addOns.length > 0);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all flex justify-between gap-3 group relative"
                  >
                    {/* Left Details */}
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
                            product.isVeg ? 'border-emerald-600' : 'border-rose-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                          />
                        </span>
                        {product.isBestSeller && (
                          <span className="px-1.5 py-0.5 rounded-xs bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Bestseller
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium">
                          {product.category}
                        </span>
                      </div>

                      <button
                        id={`open-prod-modal-${product.id}`}
                        onClick={() => setSelectedProductForModal(product)}
                        className="text-left font-bold text-sm sm:text-base text-slate-900 hover:text-emerald-700 mt-1 block transition-colors leading-snug"
                      >
                        {product.name}
                      </button>

                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-sm sm:text-base font-extrabold text-slate-900">
                          ₹{product.sellingPrice}
                        </span>
                        {product.mrp > product.sellingPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{product.mrp}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 font-medium">
                          / {product.unit}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {hasCustomizations && (
                        <button
                          onClick={() => setSelectedProductForModal(product)}
                          className="mt-2 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Customizable options available</span>
                        </button>
                      )}
                    </div>

                    {/* Right Image + Add Button */}
                    <div className="w-28 sm:w-32 flex flex-col items-center shrink-0">
                      <div
                        onClick={() => setSelectedProductForModal(product)}
                        className="w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-slate-100 cursor-pointer relative shadow-inner"
                      >
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.discountPercentage > 0 && (
                          <span className="absolute top-1 right-1 bg-rose-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-md">
                            {product.discountPercentage}% OFF
                          </span>
                        )}
                      </div>

                      {/* ADD or Quantity Controls */}
                      <div className="-mt-4 z-10 w-24">
                        {inCartQty === 0 ? (
                          <button
                            id={`add-btn-${product.id}`}
                            onClick={() => {
                              if (hasCustomizations) {
                                setSelectedProductForModal(product);
                              } else {
                                addToCart(product);
                              }
                            }}
                            className="w-full bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-400/80 shadow-md py-1.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider text-center transition-all active:scale-95"
                          >
                            ADD
                          </button>
                        ) : (
                          <div className="flex items-center justify-between bg-emerald-600 text-white rounded-xl shadow-md p-1">
                            <button
                              id={`decrement-btn-${product.id}`}
                              onClick={() => {
                                const cartItem = cart.find(c => c.product.id === product.id);
                                if (cartItem) updateCartQuantity(cartItem.id, -1);
                              }}
                              className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-black px-1">
                              {inCartQty}
                            </span>
                            <button
                              id={`increment-btn-${product.id}`}
                              onClick={() => {
                                if (hasCustomizations) {
                                  setSelectedProductForModal(product);
                                } else {
                                  addToCart(product);
                                }
                              }}
                              className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Product Customization Modal */}
      {selectedProductForModal && (
        <ProductDetailModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
        />
      )}
    </div>
  );
};
