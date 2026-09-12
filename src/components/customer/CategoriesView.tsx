import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FOOD_CATEGORIES, GROCERY_CATEGORIES } from '../../data/mockData';
import { Product } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';
import { Plus, Minus, Check, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const {
    products,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    cart,
    addToCart,
    updateCartQuantity,
    setCustomerTab,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'food' | 'grocery'>('food');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const currentCategories = activeTab === 'food' ? FOOD_CATEGORIES : GROCERY_CATEGORIES;

  const currentCategory = selectedCategoryFilter || currentCategories[0].name;

  const categoryProducts = products.filter(
    p => p.category.toLowerCase() === currentCategory.toLowerCase() && p.isActive
  );

  const getProductCartQty = (productId: string) => {
    const items = cart.filter(item => item.product.id === productId);
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28 animate-in fade-in">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Explore All Categories
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse authentic restaurant cuisine and fresh grocery staples
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center max-w-xs border border-slate-200">
          <button
            id="cat-view-food-tab"
            onClick={() => {
              setActiveTab('food');
              setSelectedCategoryFilter(FOOD_CATEGORIES[0].name);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'food'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🍲 Food ({FOOD_CATEGORIES.length})
          </button>
          <button
            id="cat-view-grocery-tab"
            onClick={() => {
              setActiveTab('grocery');
              setSelectedCategoryFilter(GROCERY_CATEGORIES[0].name);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'grocery'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🥦 Grocery ({GROCERY_CATEGORIES.length})
          </button>
        </div>
      </div>

      {/* Main Layout: Left Category Drawer/Pills + Right Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
        {/* Left Category List */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-xs space-y-1.5 max-h-[75vh] overflow-y-auto">
            {currentCategories.map(cat => {
              const isSelected =
                (selectedCategoryFilter || currentCategories[0].name).toLowerCase() ===
                cat.name.toLowerCase();

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.name)}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'hover:bg-slate-50 text-slate-700 font-semibold'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{cat.icon}</span>
                    <div>
                      <p className="text-xs sm:text-sm">{cat.name}</p>
                      <p
                        className={`text-[10px] ${
                          isSelected ? 'text-emerald-100' : 'text-slate-400'
                        }`}
                      >
                        {cat.count}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      isSelected ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Products in selected category */}
        <div className="md:col-span-8 lg:col-span-9">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              {currentCategory} Items ({categoryProducts.length})
            </h2>
            <span className="text-xs text-slate-400">
              Hyperlocal delivery available
            </span>
          </div>

          {categoryProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <p className="text-slate-500 font-medium text-sm">
                No active products currently in {currentCategory}.
              </p>
              <button
                onClick={() => setCustomerTab('search')}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Search all items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryProducts.map(prod => {
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
