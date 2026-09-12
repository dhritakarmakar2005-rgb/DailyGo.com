import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SystemSettings } from '../../types';
import { safeStorage } from '../../utils/storage';
import { DeliveryAreasManager } from './DeliveryAreasManager';
import {
  Settings,
  Save,
  CheckCircle2,
  Smartphone,
  CreditCard,
  MapPin,
  Bell,
  Truck,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';

const DEFAULT_DAILYGO_LOGO = 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=200&q=80';

const RECOMMENDED_VILLAGES = [
  'Barduary',
  'Kushida',
  'Bhaluka',
  'Tulshihata',
  'Daulatpur',
  'Rashidpur',
  'Boroi',
  'Pipla',
  'Malior',
  'Station Road',
  'Hospital More',
  'Cinema Hall More',
  'Baroi Gram',
  'Mashaldaha'
];

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [appName, setAppName] = useState(settings.appName || 'DailyGo');
  const [appLogo, setAppLogo] = useState(settings.appLogo || DEFAULT_DAILYGO_LOGO);
  const [appTagline, setAppTagline] = useState(settings.appTagline || 'Harishchandrapur & Villages Quick Delivery');
  const [supportPhone, setSupportPhone] = useState(settings.supportPhone || '+91 98765 43210');
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail || 'support@dailygo.local');
  const [businessAddress, setBusinessAddress] = useState(settings.businessAddress || 'Station Road, Harishchandrapur, Malda, WB - 732125');
  
  // Delivery Fee States
  const [isDeliveryFree, setIsDeliveryFree] = useState<boolean>(!!settings.isDeliveryFree);
  const [baseDeliveryCharge, setBaseDeliveryCharge] = useState<number>(settings.baseDeliveryCharge ?? settings.baseDeliveryFee ?? 20);
  const [deliveryChargeType, setDeliveryChargeType] = useState(settings.deliveryChargeType || 'flat');
  const [perKmCharge, setPerKmCharge] = useState<number>(settings.perKmCharge || 5);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<number>(settings.freeDeliveryThreshold ?? 249);
  
  // Payment methods
  const [enableCOD, setEnableCOD] = useState<boolean>(settings.enableCOD ?? true);
  const [enableUPI, setEnableUPI] = useState<boolean>(settings.enableUPI ?? true);
  const [enableOnline, setEnableOnline] = useState<boolean>(settings.enableOnline ?? true);
  const [enableWhatsAppAlerts, setEnableWhatsAppAlerts] = useState<boolean>(settings.enableWhatsAppAlerts ?? true);
  
  // Location & Coverage Area
  const [targetCity, setTargetCity] = useState(settings.targetCity || 'Harishchandrapur');
  const [villages, setVillages] = useState<string[]>(
    settings.targetVillages && settings.targetVillages.length > 0
      ? settings.targetVillages
      : RECOMMENDED_VILLAGES.slice(0, 12)
  );
  const [newVillageInput, setNewVillageInput] = useState('');
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAppName(settings.appName || 'DailyGo');
    setAppLogo(settings.appLogo || DEFAULT_DAILYGO_LOGO);
    setAppTagline(settings.appTagline || 'Harishchandrapur & Villages Quick Delivery');
    setSupportPhone(settings.supportPhone || '+91 98765 43210');
    setSupportEmail(settings.supportEmail || 'support@dailygo.local');
    setBusinessAddress(settings.businessAddress || 'Station Road, Harishchandrapur, Malda, WB - 732125');
    setIsDeliveryFree(!!settings.isDeliveryFree);
    setBaseDeliveryCharge(settings.baseDeliveryCharge ?? settings.baseDeliveryFee ?? 20);
    setDeliveryChargeType(settings.deliveryChargeType || 'flat');
    setPerKmCharge(settings.perKmCharge || 5);
    setFreeDeliveryThreshold(settings.freeDeliveryThreshold ?? 249);
    setEnableCOD(settings.enableCOD ?? true);
    setEnableUPI(settings.enableUPI ?? true);
    setEnableOnline(settings.enableOnline ?? true);
    setEnableWhatsAppAlerts(settings.enableWhatsAppAlerts ?? true);
    setTargetCity(settings.targetCity || 'Harishchandrapur');
    if (settings.targetVillages && settings.targetVillages.length > 0) {
      setVillages(settings.targetVillages);
    }
  }, [settings]);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLogoUploadError('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setLogoUploadError('File size is larger than 3MB. Please upload an image under 3MB.');
      return;
    }

    setLogoUploadError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAppLogo(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddVillage = () => {
    if (!newVillageInput.trim()) return;
    const name = newVillageInput.trim();
    if (!villages.includes(name)) {
      setVillages([...villages, name]);
    }
    setNewVillageInput('');
  };

  const handleQuickAddVillage = (villageName: string) => {
    if (!villages.includes(villageName)) {
      setVillages([...villages, villageName]);
    }
  };

  const handleRemoveVillage = (index: number) => {
    setVillages(villages.filter((_, i) => i !== index));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<SystemSettings> = {
      appName: appName.trim() || 'DailyGo',
      appLogo: appLogo.trim() || DEFAULT_DAILYGO_LOGO,
      appTagline: appTagline.trim(),
      supportPhone: supportPhone.trim(),
      supportEmail: supportEmail.trim(),
      businessAddress: businessAddress.trim(),
      isDeliveryFree,
      baseDeliveryCharge: isDeliveryFree ? 0 : Number(baseDeliveryCharge),
      baseDeliveryFee: isDeliveryFree ? 0 : Number(baseDeliveryCharge),
      deliveryChargeType,
      perKmCharge: Number(perKmCharge),
      freeDeliveryThreshold: Number(freeDeliveryThreshold),
      enableCOD,
      enableUPI,
      enableOnline,
      enableWhatsAppAlerts,
      targetCity: targetCity.trim() || 'Harishchandrapur',
      targetVillages: villages,
      coveredVillages: villages,
    };

    updateSettings(payload);
    const parsed = safeStorage.getJSON<Record<string, any>>('td_settings', {});
    safeStorage.setJSON('td_settings', { ...parsed, ...payload });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Settings & Operations Desk
            </h1>
            <span className="px-2 py-0.5 text-xs font-extrabold bg-emerald-100 text-emerald-800 rounded-md">
              DailyGo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure App Logo, Delivery Fees, Harishchandrapur & Villages Coverage, and Payment Rails
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved & Applied Live!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: App Logo & Branding (DailyGo) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  App Logo & Brand Identity (DailyGo)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Upload your official DailyGo logo. It will appear on the customer header, app drawer, bill invoices, and notifications.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setAppLogo(DEFAULT_DAILYGO_LOGO);
                setAppName('DailyGo');
              }}
              className="text-xs text-slate-500 hover:text-emerald-700 flex items-center space-x-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Logo Preview Card */}
            <div className="md:col-span-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Live Header & App Preview
              </span>
              
              <div className="w-24 h-24 rounded-2xl bg-white p-2 border-2 border-dashed border-emerald-300 flex items-center justify-center shadow-xs overflow-hidden group">
                {appLogo && (appLogo.startsWith('http') || appLogo.startsWith('data:')) ? (
                  <img
                    src={appLogo}
                    alt={appName}
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <span className="text-4xl">{appLogo || '🛍️'}</span>
                )}
              </div>

              <div className="mt-3">
                <p className="font-black text-sm text-slate-900">{appName}</p>
                <p className="text-[11px] text-emerald-700 font-semibold">{targetCity} & Villages</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{appTagline}</p>
              </div>
            </div>

            {/* Logo Upload Actions */}
            <div className="md:col-span-8 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Upload New App Logo File
                </label>
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoFileChange}
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-2 shadow-xs transition-all hover:scale-[1.02]"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Logo Image</span>
                  </button>

                  <span className="text-[11px] text-slate-500">
                    Supports PNG, JPG, SVG, WebP (Max 3MB)
                  </span>
                </div>

                {logoUploadError && (
                  <p className="text-xs text-rose-600 font-semibold mt-1.5">{logoUploadError}</p>
                )}
              </div>

              {/* Or Paste Direct Image URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Or Enter Image Web URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={appLogo}
                    onChange={e => setAppLogo(e.target.value)}
                    placeholder="https://example.com/dailygo-logo.png"
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                  />
                  {appLogo && (
                    <button
                      type="button"
                      onClick={() => setAppLogo('')}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Preset Icon Shortcuts */}
              <div>
                <span className="block text-[11px] font-bold text-slate-500 mb-1.5">
                  Or Choose a Ready-to-Use Icon:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Green Grocery Bag', icon: '🛍️' },
                    { label: 'Fast Express Cart', icon: '🛒' },
                    { label: 'Rocket Express', icon: '🚀' },
                    { label: 'Delicious Food', icon: '🍔' },
                    { label: 'Fresh Veggies', icon: '🥦' },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setAppLogo(preset.icon)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 font-medium flex items-center space-x-1.5 transition-colors"
                    >
                      <span>{preset.icon}</span>
                      <span className="text-[10px]">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* App Names & Tagline Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">App Display Name</label>
                  <input
                    type="text"
                    value={appName}
                    onChange={e => setAppName(e.target.value)}
                    placeholder="DailyGo"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={appTagline}
                    onChange={e => setAppTagline(e.target.value)}
                    placeholder="Harishchandrapur & Villages Quick Delivery"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Delivery Fee Settings (User Request: "admin can set delevery fee") */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  Delivery Fee Configuration
                </h2>
                <p className="text-[11px] text-slate-500">
                  Set standard delivery charge, offer 100% free delivery, or set free delivery thresholds for villagers and town customers
                </p>
              </div>
            </div>
          </div>

          {/* Quick Active Policy Card */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isDeliveryFree || baseDeliveryCharge === 0
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-blue-50 border-blue-200 text-blue-950'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                isDeliveryFree || baseDeliveryCharge === 0 ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
              }`}>
                ₹{isDeliveryFree ? 0 : baseDeliveryCharge}
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm">
                  {isDeliveryFree || baseDeliveryCharge === 0 ? (
                    <span>🎉 100% FREE Delivery Active for All Orders</span>
                  ) : (
                    <span>Standard Delivery Fee: ₹{baseDeliveryCharge} per order</span>
                  )}
                </p>
                <p className="text-[11px] opacity-80">
                  {isDeliveryFree || baseDeliveryCharge === 0
                    ? 'No delivery fee will be added to customer cart at checkout.'
                    : freeDeliveryThreshold > 0
                    ? `Customers get FREE delivery automatically on cart orders above ₹${freeDeliveryThreshold}.`
                    : 'Flat fee applied on every order regardless of cart value.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Free Delivery Master Switch */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">All-Orders Free Delivery</span>
                  <input
                    type="checkbox"
                    checked={isDeliveryFree}
                    onChange={e => {
                      setIsDeliveryFree(e.target.checked);
                      if (e.target.checked) {
                        setBaseDeliveryCharge(0);
                      } else {
                        setBaseDeliveryCharge(20);
                      }
                    }}
                    className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Enable this to make delivery completely free (₹0) across Harishchandrapur and all villages.
                </p>
              </div>
            </div>

            {/* Standard Delivery Charge Input */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <label className="block font-bold text-slate-900">
                Delivery Fee Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={isDeliveryFree ? 0 : baseDeliveryCharge}
                  disabled={isDeliveryFree}
                  onChange={e => {
                    const val = Math.max(0, Number(e.target.value));
                    setBaseDeliveryCharge(val);
                    if (val > 0) setIsDeliveryFree(false);
                  }}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 bg-white font-black text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-200 disabled:opacity-60"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[0, 10, 15, 20, 25, 30].map(fee => (
                  <button
                    key={fee}
                    type="button"
                    onClick={() => {
                      setBaseDeliveryCharge(fee);
                      setIsDeliveryFree(fee === 0);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      baseDeliveryCharge === fee && !isDeliveryFree
                        ? 'bg-blue-600 text-white border-blue-600'
                        : fee === 0 && isDeliveryFree
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {fee === 0 ? 'Free (₹0)' : `₹${fee}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Free Delivery Order Threshold */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <label className="block font-bold text-slate-900">
                Free Delivery Above Order (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={freeDeliveryThreshold}
                  onChange={e => setFreeDeliveryThreshold(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 bg-white font-black text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <p className="text-[10px] text-slate-500">
                Orders with subtotal equal or greater than this value enjoy ₹0 delivery. (Set 0 to disable).
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Harishchandrapur & Nearest Villages Coverage (User Request) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  Target Town & Village Coverage (Harishchandrapur & Surrounding Villages)
                </h2>
                <p className="text-[11px] text-slate-500">
                  App is tailored specifically for Harishchandrapur and nearest surrounding rural villages
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Central Hub / Town Name
                </label>
                <input
                  type="text"
                  value={targetCity}
                  onChange={e => setTargetCity(e.target.value)}
                  placeholder="Harishchandrapur"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Business Operation Address
                </label>
                <input
                  type="text"
                  value={businessAddress}
                  onChange={e => setBusinessAddress(e.target.value)}
                  placeholder="Station Road, Harishchandrapur, Malda, WB - 732125"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Embedded Granular Delivery Areas & Village Control Desk */}
            <div className="pt-2">
              <DeliveryAreasManager />
            </div>
          </div>
        </div>

        {/* Section 4: Helpline & Contact Desk */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Helpline & Customer Support</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Helpline Phone (Customer Calling & WhatsApp)</label>
              <input
                type="text"
                value={supportPhone}
                onChange={e => setSupportPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Payment Methods */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Customer Payment Channels</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <label className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between cursor-pointer hover:bg-slate-100/60">
              <div>
                <p className="font-bold text-slate-900">Cash on Delivery (COD)</p>
                <p className="text-[11px] text-slate-500">Collect cash at doorstep in villages</p>
              </div>
              <input
                type="checkbox"
                checked={enableCOD}
                onChange={e => setEnableCOD(e.target.checked)}
                className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500"
              />
            </label>

            <label className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between cursor-pointer hover:bg-slate-100/60">
              <div>
                <p className="font-bold text-slate-900">UPI & QR Payments</p>
                <p className="text-[11px] text-slate-500">GPay, PhonePe, Paytm, BHIM</p>
              </div>
              <input
                type="checkbox"
                checked={enableUPI}
                onChange={e => setEnableUPI(e.target.checked)}
                className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500"
              />
            </label>

            <label className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between cursor-pointer hover:bg-slate-100/60">
              <div>
                <p className="font-bold text-slate-900">Online Cards & NetBanking</p>
                <p className="text-[11px] text-slate-500">Debit / Credit cards</p>
              </div>
              <input
                type="checkbox"
                checked={enableOnline}
                onChange={e => setEnableOnline(e.target.checked)}
                className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700">
              ✓ All configurations saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-transform hover:scale-105 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
