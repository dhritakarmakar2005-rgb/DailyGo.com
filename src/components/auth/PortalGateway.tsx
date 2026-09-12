import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Shield,
  ArrowRight,
  Sparkles,
  MapPin,
  Utensils,
  Store,
  Lock,
  ChevronRight,
  Truck
} from 'lucide-react';

export const PortalGateway: React.FC = () => {
  const { setActivePortal, setCurrentRole, settings } = useApp();

  const handleSelectPortal = (portal: 'customer' | 'admin') => {
    setActivePortal(portal);
    setCurrentRole(portal);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Header */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between py-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{settings.appName || 'TownDrop'}</span>
              <span className="text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Gateway
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              {settings.appTagline || 'Hyperlocal Food & Grocery Delivery Hub'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Servicing:</span>
          <span className="font-bold text-slate-200">{settings.targetCity || 'Central Hub & Villages'}</span>
        </div>
      </div>

      {/* Main Selection Area */}
      <div className="max-w-4xl w-full mx-auto my-auto py-10 sm:py-16">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Your Destination Portal</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Choose which portal to access
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Please choose your destination. Only one active portal is loaded at a time for complete security and streamlined experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Option 1: Customer Portal */}
          <div
            id="portal-select-customer-btn"
            onClick={() => handleSelectPortal('customer')}
            className="group relative bg-slate-800/80 hover:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-emerald-500/50 shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
                <Utensils className="w-7 h-7" />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  Public Ordering
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Customer Portal
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
                Order hot restaurant meals, daily kitchen groceries, bakery snacks, and mandi produce delivered straight to your doorstep or village home.
              </p>

              <div className="mt-6 space-y-2 pt-5 border-t border-white/10 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>50+ Food & Grocery items</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Live Hyperlocal GPS Order Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Instant UPI & Cash on Delivery</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-8 w-full py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/30 transition-all group-hover:shadow-emerald-500/50"
            >
              <span>Enter Customer Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Option 2: Admin Portal */}
          <div
            id="portal-select-admin-btn"
            onClick={() => handleSelectPortal('admin')}
            className="group relative bg-slate-800/80 hover:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-blue-500/50 shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none group-hover:bg-blue-500/20 transition-colors" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-105 transition-transform">
                <Shield className="w-7 h-7" />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-400">
                  Protected & Restricted
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Admin Portal
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
                Platform control center for store approvals, product menus, live rider dispatch, commission settings, and delivery revenue management.
              </p>

              <div className="mt-6 space-y-2 pt-5 border-t border-white/10 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Single Master Admin (1/1) Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Add, Edit & Remove Restaurants / Shops</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>TownHub & Rural Village Cluster Settings</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-8 w-full py-3.5 px-5 rounded-2xl bg-slate-700 group-hover:bg-blue-600 text-white font-black text-sm flex items-center justify-center space-x-2 border border-white/10 group-hover:border-blue-500 shadow-lg transition-all"
            >
              <Lock className="w-4 h-4 text-blue-300" />
              <span>Enter Admin Portal (Login Required)</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl w-full mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <p>© 2026 {settings.appName}. All rights reserved.</p>
        <div className="flex items-center space-x-4">
          <span>Support: {settings.supportPhone}</span>
          <span>•</span>
          <span>Only 1 Portal Loaded at a Time</span>
        </div>
      </div>
    </div>
  );
};
