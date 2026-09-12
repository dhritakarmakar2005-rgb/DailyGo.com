import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { customerTab, setCustomerTab, cartTotals, currentRole } = useApp();

  if (currentRole !== 'customer') return null;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Floating cart bar preview on mobile if cart has items and not on cart/checkout page */}
      {cartTotals.itemCount > 0 && customerTab !== 'cart' && customerTab !== 'tracking' && (
        <div className="fixed bottom-16 left-0 right-0 z-30 p-3 max-w-lg mx-auto sm:hidden animate-in slide-in-from-bottom-2">
          <button
            id="mobile-floating-cart-btn"
            onClick={() => setCustomerTab('cart')}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white p-3 rounded-2xl shadow-xl flex items-center justify-between font-bold text-sm border border-emerald-500/30"
          >
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                {cartTotals.itemCount}
              </span>
              <span>{cartTotals.itemCount === 1 ? '1 item in cart' : `${cartTotals.itemCount} items in cart`}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-200">₹{cartTotals.grandTotal}</span>
              <span className="text-xs bg-white text-emerald-800 px-2.5 py-1 rounded-lg">View Cart →</span>
            </div>
          </button>
        </div>
      )}

      {/* Main Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg safe-area-bottom">
        <div className="max-w-md sm:max-w-xl mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = customerTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`bottom-nav-${item.id}`}
                  onClick={() => setCustomerTab(item.id)}
                  className={`flex flex-col items-center justify-center w-14 py-1 transition-all relative ${
                    isActive ? 'text-emerald-700 scale-105' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  <span className={`text-[11px] mt-1 font-semibold ${isActive ? 'font-bold' : ''}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 w-4 h-1 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};
