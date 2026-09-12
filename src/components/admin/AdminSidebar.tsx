import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminTab } from '../../types';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Package,
  Bike,
  Tag,
  BarChart3,
  Settings,
  ArrowLeft,
  ShieldCheck,
  Bell,
  Sparkles
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    setCurrentRole,
    orders,
    adminUser,
    adminCount,
    logoutAdmin,
    settings,
  } = useApp();

  const pendingOrdersCount = orders.filter(
    o => o.orderStatus === 'pending' || o.orderStatus === 'accepted'
  ).length;

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Live Orders', icon: ShoppingBag, badge: pendingOrdersCount },
    { id: 'shops', label: 'Shops & Restaurants', icon: Store },
    { id: 'products', label: 'Products & Menu', icon: Package },
    { id: 'delivery', label: 'Delivery Riders', icon: Bike },
    { id: 'promotions', label: 'Coupons & Banners', icon: Tag },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-950 text-white flex flex-col shrink-0 border-r border-slate-800 lg:min-h-[calc(100vh-65px)]">
      {/* Admin Profile Branding with DailyGo Logo */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {settings.appLogo && (settings.appLogo.startsWith('http') || settings.appLogo.startsWith('data:')) ? (
              <img
                src={settings.appLogo}
                alt={settings.appName || 'DailyGo'}
                className="w-9 h-9 rounded-xl object-cover border border-slate-700 shadow-md shadow-emerald-500/20"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-500/30">
                {settings.appLogo || 'DG'}
              </div>
            )}
            <div>
              <h2 className="font-extrabold text-sm text-white">{settings.appName || 'DailyGo'}</h2>
              <p className="text-[11px] text-emerald-400 font-medium">Admin Central Hub</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentRole('customer')}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Back to Customer App"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Single Admin Identity Card */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400 mb-1">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>SINGLE ADMIN</span>
            </span>
            <span className="bg-emerald-500/20 px-1.5 py-0.2 rounded text-emerald-300">
              {adminCount} / 1 Master
            </span>
          </div>
          <p className="text-xs font-bold text-white truncate">{adminUser.name}</p>
          <p className="text-[10px] text-slate-400 font-mono truncate">{adminUser.email}</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = adminTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setAdminTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Return & Logout */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <button
          onClick={() => setCurrentRole('customer')}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-bold transition-colors border border-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go to Customer App</span>
        </button>

        <button
          onClick={logoutAdmin}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 hover:text-rose-200 text-xs font-bold transition-colors border border-rose-900/40"
        >
          <span>Sign Out Master Admin</span>
        </button>
      </div>
    </aside>
  );
};
