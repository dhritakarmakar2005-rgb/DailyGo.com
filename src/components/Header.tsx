import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOWN_LOCATIONS } from '../data/mockData';
import {
  MapPin,
  Search,
  ShoppingBag,
  Bell,
  Shield,
  User,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  X,
  Store,
  Compass,
  ArrowLeft
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    customerTab,
    setCustomerTab,
    selectedLocation,
    setSelectedLocation,
    cartTotals,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    settings,
    deliveryZones,
    user,
    isCustomerLoggedIn,
    isAdminLoggedIn,
    adminUser,
    logoutAdmin,
    activePortal,
    setActivePortal,
  } = useApp();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [manualLocInput, setManualLocInput] = useState('');
  const [pausedWarning, setPausedWarning] = useState<string | null>(null);

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  const handleSelectZone = (zone: typeof deliveryZones[0]) => {
    if (!zone.isDelivering) {
      setPausedWarning(`DailyGo Admin has temporarily paused deliveries to ${zone.name}. Please select an active village or Harishchandrapur town area.`);
      return;
    }
    setPausedWarning(null);
    setSelectedLocation(zone.name);
    try {
      localStorage.setItem('td_selected_location', zone.name);
    } catch {
      // ignore
    }
    setShowLocationModal(false);
  };

  const handleSaveManualLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualLocInput.trim()) return;

    const matchedZone = deliveryZones.find(
      z => z.name.toLowerCase().includes(manualLocInput.trim().toLowerCase()) ||
           manualLocInput.trim().toLowerCase().includes(z.name.toLowerCase())
    );

    if (matchedZone && !matchedZone.isDelivering) {
      setPausedWarning(`Delivery to ${matchedZone.name} is currently suspended by DailyGo Admin.`);
      return;
    }

    setPausedWarning(null);
    setSelectedLocation(manualLocInput.trim());
    try {
      localStorage.setItem('td_selected_location', manualLocInput.trim());
    } catch {
      // ignore
    }
    setShowLocationModal(false);
    setManualLocInput('');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand Logo + Location Selector */}
            <div className="flex items-center space-x-3 sm:space-x-6">
              <button
                id="brand-logo-btn"
                onClick={() => {
                  if (currentRole === 'admin') {
                    setCurrentRole('customer');
                  }
                  setCustomerTab('home');
                }}
                className="flex items-center space-x-2.5 text-left focus:outline-hidden group"
              >
                {settings.appLogo && (settings.appLogo.startsWith('http') || settings.appLogo.startsWith('data:')) ? (
                  <img
                    src={settings.appLogo}
                    alt={settings.appName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                    {settings.appLogo && settings.appLogo.length <= 4 ? (
                      <span className="text-xl">{settings.appLogo}</span>
                    ) : (
                      <ShoppingBag className="w-5 h-5" />
                    )}
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-xl tracking-tight text-slate-900">
                      {settings.appName}
                    </span>
                    <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                      LOCAL & VILLAGES
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium -mt-0.5 hidden xs:block">
                    Food & Grocery Express
                  </p>
                </div>
              </button>

              {/* Location Picker */}
              {currentRole === 'customer' && (
                <button
                  id="header-location-picker-btn"
                  onClick={() => setShowLocationModal(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors border border-slate-200/60 max-w-[150px] sm:max-w-[240px] truncate"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{selectedLocation}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
              )}
            </div>

            {/* Right: Notifications, Cart / Admin Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* If currentRole is admin, provide exit back to storefront */}
              {currentRole === 'admin' && (
                <button
                  id="header-switch-to-storefront-btn"
                  onClick={() => {
                    setCurrentRole('customer');
                    setActivePortal('customer');
                    setCustomerTab('home');
                  }}
                  className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200/80"
                  title="Return to Customer Storefront"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Storefront</span>
                </button>
              )}

              {currentRole === 'customer' && (
                <>
                  {/* Search Icon button for mobile quick jump */}
                  <button
                    id="header-search-nav-btn"
                    onClick={() => setCustomerTab('search')}
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors sm:hidden"
                    title="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>

                  {/* Notification Dropdown Trigger */}
                  <div className="relative">
                    <button
                      id="notifications-toggle-btn"
                      onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                      className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="Notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadNotifs > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                          {unreadNotifs}
                        </span>
                      )}
                    </button>

                    {/* Notifications Popup */}
                    {showNotifDropdown && (
                      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Bell className="w-4 h-4 text-emerald-600" />
                            <span className="font-bold text-sm text-slate-900">Notifications</span>
                            {unreadNotifs > 0 && (
                              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded-md">
                                {unreadNotifs} new
                              </span>
                            )}
                          </div>
                          {notifications.length > 0 && (
                            <button
                              id="clear-all-notifs-btn"
                              onClick={clearAllNotifications}
                              className="text-xs text-slate-500 hover:text-slate-800"
                            >
                              Clear all
                            </button>
                          )}
                        </div>

                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map(notif => (
                              <div
                                key={notif.id}
                                onClick={() => {
                                  markNotificationRead(notif.id);
                                  if (notif.orderId) {
                                    setCustomerTab('orders');
                                    setShowNotifDropdown(false);
                                  }
                                }}
                                className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex space-x-3 ${
                                  !notif.isRead ? 'bg-emerald-50/40' : ''
                                }`}
                              >
                                <div className="mt-0.5">
                                  {notif.type === 'order' ? (
                                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                                      🛍️
                                    </div>
                                  ) : notif.type === 'wallet' ? (
                                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs">
                                      💰
                                    </div>
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                                      🏷️
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-900 truncate">
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                                    {notif.message}
                                  </p>
                                  <span className="text-[10px] text-slate-400 mt-1 block">
                                    {notif.time}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Header Cart Button */}
                  <button
                    id="header-cart-btn"
                    onClick={() => setCustomerTab('cart')}
                    className="relative flex items-center space-x-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="hidden sm:inline">Cart</span>
                    {cartTotals.itemCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-800 text-[11px] font-extrabold text-white">
                        {cartTotals.itemCount} | ₹{cartTotals.grandTotal}
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-700/60 text-[10px]">
                        0
                      </span>
                    )}
                  </button>

                  {/* Customer Auth Button / Profile */}
                  {isCustomerLoggedIn ? (
                    <button
                      id="header-customer-profile-btn"
                      onClick={() => setCustomerTab('profile')}
                      className="flex items-center space-x-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/80"
                      title="View Profile & Account"
                    >
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={user.name}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-500/50"
                      />
                      <div className="hidden md:block text-left text-xs">
                        <p className="font-bold text-slate-800 leading-tight truncate max-w-[85px]">
                          {user.name ? user.name.split(' ')[0] : 'Account'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-semibold -mt-0.5">
                          My Account
                        </p>
                      </div>
                    </button>
                  ) : (
                    <button
                      id="header-customer-login-btn"
                      onClick={() => setCustomerTab('login')}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Sign In</span>
                    </button>
                  )}
                </>
              )}

              {/* Admin Mode Top Indicator */}
              {currentRole === 'admin' && isAdminLoggedIn && (
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-bold border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Master Admin (1/1): {adminUser.name}</span>
                  </div>
                  <button
                    id="header-admin-logout-btn"
                    onClick={logoutAdmin}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Select Your Delivery Area</h3>
              </div>
              <button
                id="close-location-modal-btn"
                onClick={() => setShowLocationModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2 mb-3">
              Enter your town, village or neighborhood to see available restaurants and delivery times.
            </p>

            {/* Paused Warning Banner */}
            {pausedWarning && (
              <div className="mb-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2 animate-in fade-in">
                <span className="text-base">⚠️</span>
                <div>
                  <p className="font-bold">Delivery Unavailable Here</p>
                  <p className="text-[11px] mt-0.5">{pausedWarning}</p>
                </div>
              </div>
            )}

            {/* Manual Location Input Field */}
            <form onSubmit={handleSaveManualLocation} className="mb-4 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
              <label className="block text-xs font-bold text-emerald-950 mb-1.5">
                Type Your Exact Town, Village or Colony:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="header-manual-location-input"
                  value={manualLocInput}
                  onChange={e => {
                    setManualLocInput(e.target.value);
                    if (pausedWarning) setPausedWarning(null);
                  }}
                  placeholder="e.g. Harishchandrapur, Station Rd, Barduary..."
                  className="flex-1 text-xs p-2.5 rounded-xl border border-emerald-300 bg-white font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="submit"
                  id="header-save-location-btn"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  Deliver Here
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] text-emerald-800 font-semibold self-center">Quick Active Areas:</span>
                {deliveryZones.filter(z => z.isDelivering).slice(0, 5).map(z => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => handleSelectZone(z)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-900 font-medium hover:bg-emerald-100 cursor-pointer"
                  >
                    {z.name.split(' - ')[0]}
                  </button>
                ))}
              </div>
            </form>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {deliveryZones.map(zone => {
                const isSelected = selectedLocation.toLowerCase() === zone.name.toLowerCase() ||
                                   selectedLocation.toLowerCase().includes(zone.name.toLowerCase());
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => handleSelectZone(zone)}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all border cursor-pointer ${
                      !zone.isDelivering
                        ? 'bg-slate-50/70 border-slate-200 text-slate-400 opacity-75'
                        : isSelected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        !zone.isDelivering
                          ? 'bg-slate-200 text-slate-500'
                          : isSelected
                          ? 'bg-emerald-200/60 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs sm:text-sm font-semibold">{zone.name}</p>
                          {zone.type === 'village' && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-amber-100 text-amber-800 font-bold">
                              Village
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {zone.distanceKm} km • Est. {zone.estimatedDeliveryMins}
                          {zone.deliveryFeeSurcharge ? ` • +₹${zone.deliveryFeeSurcharge} surcharge` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center space-x-2">
                      {zone.isDelivering ? (
                        isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            Active
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                          Paused
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>🌾 Free delivery above ₹{settings.freeDeliveryThreshold || 249} to all villages!</span>
              <span className="text-[11px] font-semibold text-emerald-700">
                {deliveryZones.filter(z => z.isDelivering).length} Areas Delivering
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
