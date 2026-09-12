import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Shop } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';
import {
  Search,
  X,
  Star,
  Clock,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  Plus,
  Minus,
  Store,
  ChevronRight
} from 'lucide-react';

export const SearchView: React.FC = () => {
  const {
    products,
    shops,
    setSelectedShopId,
    setCustomerTab,
    cart,
    addToCart,
    updateCartQuantity,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [selectedType, setSelectedType] = useState<'all' | 'food' | 'grocery'>('all');
  const [selectedVegFilter, setSelectedVegFilter] = useState<'all' | 'veg' | 'non_veg'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const popularSearches = [
    'Biryani',
    'Pizza',
    'Atta',
    'Burger',
    'Dal',
    'Potatoes',
    'Milk',
    'Gulab Jamun',
    'Eggs',
    'Sunflower Oil'
  ];

  const getProductCartQty = (productId: string) => {
    const items = cart.filter(item => item.product.id === productId);
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const query = searchQuery.toLowerCase().trim();

  // Search matching shops
  const matchingShops = shops.filter(shop => {
    if (!shop.isApproved) return false;
    if (selectedType !== 'all' && shop.type !== selectedType) return false;
    if (minRating > 0 && shop.rating < minRating) return false;
    if (!query) return true;

    return (
      shop.name.toLowerCase().includes(query) ||
      shop.cuisineOrCategory.some(c => c.toLowerCase().includes(query)) ||
      shop.locationName.toLowerCase().includes(query)
    );
  });

  // Search matching products
  let matchingProducts = products.filter(prod => {
    if (!prod.isActive) return false;
    if (selectedType !== 'all' && prod.type !== selectedType) return false;
    if (selectedVegFilter === 'veg' && !prod.isVeg) return false;
    if (selectedVegFilter === 'non_veg' && prod.isVeg) return false;
    if (prod.sellingPrice > maxPrice) return false;

    if (!query) return true;

    return (
      prod.name.toLowerCase().includes(query) ||
      prod.category.toLowerCase().includes(query) ||
      prod.shopName.toLowerCase().includes(query) ||
      prod.description.toLowerCase().includes(query)
    );
  });

  // Sorting
  matchingProducts = matchingProducts.sort((a, b) => {
    if (sortBy === 'price_asc') return a.sellingPrice - b.sellingPrice;
    if (sortBy === 'price_desc') return b.sellingPrice - a.sellingPrice;
    if (sortBy === 'rating') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    return 0; // default popularity
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28 animate-in fade-in">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-emerald-600 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          id="global-search-input"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search food, grocery products, restaurants, shops, categories..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Search Tag Suggestions */}
      {!searchQuery && (
        <div className="mt-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Trending Searches in Town:
          </span>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map(term => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-xs font-semibold text-slate-700 transition-colors border border-slate-200/60"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Sort Bar */}
      <div className="mt-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Type Filter */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedType === 'all'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedType('food')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedType === 'food'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Food Only
          </button>
          <button
            onClick={() => setSelectedType('grocery')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedType === 'grocery'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Grocery Only
          </button>
        </div>

        {/* Veg / Non-Veg filter */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedVegFilter(selectedVegFilter === 'veg' ? 'all' : 'veg')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              selectedVegFilter === 'veg'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Veg Only</span>
          </button>

          {/* Rating 4.5+ */}
          <button
            onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              minRating === 4.5
                ? 'bg-amber-50 border-amber-400 text-amber-900'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>4.5+ Stars</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Sort by:</span>
          <select
            id="search-sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="text-xs font-bold text-slate-800 border border-slate-200 rounded-xl p-1.5 bg-slate-50 focus:outline-hidden"
          >
            <option value="popular">Popularity</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Matching Restaurants / Shops */}
      {matchingShops.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Matching Shops & Restaurants ({matchingShops.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingShops.map(shop => (
              <div
                key={shop.id}
                onClick={() => {
                  setSelectedShopId(shop.id);
                  setCustomerTab('shop_detail');
                }}
                className="bg-white rounded-2xl p-3.5 border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex items-center space-x-3.5"
              >
                <img
                  src={shop.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200'}
                  alt={shop.name}
                  className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm text-slate-900 truncate">
                    {shop.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate">
                    {shop.cuisineOrCategory.join(', ')}
                  </p>
                  <div className="flex items-center space-x-3 mt-1 text-[11px] text-slate-600">
                    <span className="flex items-center font-bold text-amber-700">
                      ★ {shop.rating}
                    </span>
                    <span>• {shop.deliveryTimeMins}</span>
                    <span>• {shop.locationName}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matching Products Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Matching Food & Grocery Items ({matchingProducts.length})
          </h2>
        </div>

        {matchingProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 font-medium text-sm">
              No products found matching &quot;{searchQuery}&quot; with current filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedVegFilter('all');
                setMinRating(0);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {matchingProducts.map(prod => {
              const inCartQty = getProductCartQty(prod.id);
              const hasCustomizations =
                (prod.variations && prod.variations.length > 0) ||
                (prod.addOns && prod.addOns.length > 0);

              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div
                      onClick={() => setSelectedProductForModal(prod)}
                      className="relative h-36 rounded-xl overflow-hidden bg-slate-100 cursor-pointer group"
                    >
                      <img
                        src={prod.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center space-x-1">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            prod.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        />
                        <span>{prod.isVeg ? 'Veg' : 'Non-Veg'}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">
                        {prod.shopName}
                      </span>
                      <h3
                        onClick={() => setSelectedProductForModal(prod)}
                        className="font-bold text-sm text-slate-900 hover:text-emerald-700 cursor-pointer mt-0.5 line-clamp-1"
                      >
                        {prod.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {prod.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-slate-900">
                        ₹{prod.sellingPrice}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {prod.unit}
                      </span>
                    </div>

                    {/* Add / Qty */}
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
                          className="bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-400/80 py-1.5 px-3 rounded-xl font-black text-xs uppercase shadow-xs transition-all"
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
        )}
      </div>

      {selectedProductForModal && (
        <ProductDetailModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
        />
      )}
    </div>
  );
};
