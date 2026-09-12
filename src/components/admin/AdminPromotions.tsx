import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Coupon, Banner, PromoBanner } from '../../types';
import { PromoBannerCard } from '../common/PromoBannerCard';
import { BannerImageAdjuster } from './BannerImageAdjuster';
import {
  Tag,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Image as ImageIcon,
  ArrowRight,
  X,
  Upload,
  Eye,
  CheckCircle2,
  Link,
  Edit3,
  Sliders,
  Palette,
  Ban
} from 'lucide-react';

const PRESET_BANNER_IMAGES = [
  {
    name: 'Biryani Special',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Fresh Vegetables & Grocery',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Pizza & Burger Feast',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Indian Sweets & Mithai',
    url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Express Village Delivery',
    url: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80',
  },
];

export const AdminPromotions: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon, banners, addBanner, updateBanner, deleteBanner, shops } = useApp();

  const [activeTab, setActiveTab] = useState<'banners' | 'coupons'>('banners');

  // Coupon state
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [discountValue, setDiscountValue] = useState(20);
  const [minimumOrder, setMinimumOrder] = useState(199);
  const [maxDiscount, setMaxDiscount] = useState(100);
  const [validTill, setValidTill] = useState('31 Dec 2026');

  // Banner draft state (Supports granular image adjustments & No-Color options)
  const DEFAULT_BANNER_DRAFT: PromoBanner = {
    id: '',
    title: '',
    subtitle: '',
    badge: 'Harishchandrapur Offer',
    image: PRESET_BANNER_IMAGES[0].url,
    bgColor: 'no-color-white',
    noColor: true,
    linkType: 'category',
    linkTarget: 'Food',
    isActive: true,
    imageFit: 'cover',
    imagePositionX: 50,
    imagePositionY: 50,
    imageZoom: 100,
    imageOpacity: 100,
    imageOverlay: 'none',
    bannerLayout: 'full',
    hideTextOnBanner: false,
  };

  const [showAddBanner, setShowAddBanner] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerDraft, setBannerDraft] = useState<PromoBanner>(DEFAULT_BANNER_DRAFT);
  const [bannerUploadError, setBannerUploadError] = useState('');

  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setBannerUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setBannerUploadError('Image size is too large (max 5MB).');
      return;
    }

    setBannerUploadError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBannerDraft(prev => ({
          ...prev,
          image: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenNewBannerModal = () => {
    setEditingBannerId(null);
    setBannerDraft({
      ...DEFAULT_BANNER_DRAFT,
      id: 'ban_' + Date.now(),
      title: '',
      subtitle: '',
    });
    setBannerUploadError('');
    setShowAddBanner(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBannerId(banner.id);
    setBannerDraft({
      ...banner,
      imageFit: banner.imageFit || 'cover',
      imagePositionX: banner.imagePositionX ?? 50,
      imagePositionY: banner.imagePositionY ?? 50,
      imageZoom: banner.imageZoom ?? 100,
      imageOpacity: banner.imageOpacity ?? 100,
      imageOverlay: banner.imageOverlay || (banner.noColor ? 'none' : 'subtle'),
      bannerLayout: banner.bannerLayout || 'full',
      noColor: banner.noColor ?? (banner.bgColor?.startsWith('no-color') || banner.bgColor === 'none'),
      hideTextOnBanner: Boolean(banner.hideTextOnBanner),
    });
    setBannerUploadError('');
    setShowAddBanner(true);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    addCoupon({
      code: code.toUpperCase().trim(),
      title,
      description,
      discountType,
      discountValue: Number(discountValue),
      minimumOrder: Number(minimumOrder),
      maxDiscount: Number(maxDiscount),
      validTill,
      isActive: true,
    });

    setCode('');
    setTitle('');
    setDescription('');
    setShowAddCoupon(false);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanTitle = bannerDraft.title.trim() || (bannerDraft.hideTextOnBanner ? 'Special Banner' : 'Exclusive Offer');

    const cleanBannerData: Omit<PromoBanner, 'id'> = {
      title: cleanTitle,
      subtitle: bannerDraft.subtitle.trim(),
      image: bannerDraft.image || PRESET_BANNER_IMAGES[0].url,
      badge: bannerDraft.badge.trim() || 'Offer',
      bgColor: bannerDraft.bgColor || (bannerDraft.noColor ? 'no-color-white' : 'from-emerald-600 to-teal-800'),
      noColor: Boolean(bannerDraft.noColor),
      linkType: bannerDraft.linkType || 'category',
      linkTarget: bannerDraft.linkTarget || 'Food',
      isActive: true,
      imageFit: bannerDraft.imageFit || 'cover',
      imagePositionX: bannerDraft.imagePositionX ?? 50,
      imagePositionY: bannerDraft.imagePositionY ?? 50,
      imageZoom: bannerDraft.imageZoom ?? 100,
      imageOpacity: bannerDraft.imageOpacity ?? 100,
      imageOverlay: bannerDraft.imageOverlay || 'none',
      bannerLayout: bannerDraft.bannerLayout || 'full',
      hideTextOnBanner: Boolean(bannerDraft.hideTextOnBanner),
    };

    if (editingBannerId) {
      updateBanner(editingBannerId, cleanBannerData);
    } else {
      addBanner(cleanBannerData);
    }

    setShowAddBanner(false);
    setEditingBannerId(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Promotions, Banners & Offers Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload custom banner images, festive offers, and discount coupon codes for Harishchandrapur & villages
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'banners' ? (
            <button
              onClick={handleOpenNewBannerModal}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Banner / Offer</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddCoupon(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setActiveTab('banners')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'banners'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          🖼️ Homepage Banners & Posters ({banners.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'coupons'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          🏷️ Discount Coupons & Offers ({coupons.length})
        </button>
      </div>

      {/* Tab 1: Banners with Image Preview & Upload Option */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-900 flex items-center justify-between">
            <span>
              💡 Banners are displayed right at the top of the customer homepage carousel in Harishchandrapur.
            </span>
            <button
              onClick={handleOpenNewBannerModal}
              className="font-bold underline text-emerald-800 hover:text-emerald-950"
            >
              + Upload New Image
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {banners.map(banner => (
              <div
                key={banner.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="p-2">
                  <PromoBannerCard
                    banner={banner}
                    isAdmin={true}
                    onEdit={() => handleEditBanner(banner)}
                    onDelete={() => deleteBanner(banner.id)}
                  />
                </div>

                {/* Banner Footer Info */}
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold text-[11px] truncate max-w-[140px]">
                      {banner.linkType.toUpperCase()}: {banner.linkTarget}
                    </span>
                    {banner.noColor && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-200 text-slate-700 font-bold">
                        No Color
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleEditBanner(banner)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer flex items-center space-x-1"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Adjust Visuals</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Coupons */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coupons.map(coupon => (
            <div
              key={coupon.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-black text-xs tracking-wider uppercase">
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => deleteCoupon(coupon.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 mt-3">
                  {coupon.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {coupon.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <strong className="text-slate-900">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% (up to ₹${coupon.maxDiscount})`
                        : `Flat ₹${coupon.discountValue} Off`}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum Order:</span>
                    <strong className="text-slate-900">₹{coupon.minimumOrder}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Expiry Date:</span>
                    <span className="text-slate-700 font-medium">{coupon.validTill}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Active & Redeemable in Harishchandrapur
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Banner Modal with Full Image Adjustments & No-Color Options */}
      {showAddBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-slate-100 my-6 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                    {editingBannerId ? 'Edit Banner & Visual Adjustments' : 'Create Banner & Adjust Image'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Adjust image zoom, focal alignment, framing, and choose pure No-Color or vivid themes
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBanner(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-6 mt-5 text-xs">
              {/* Integrated Interactive Adjuster & Live Preview */}
              <BannerImageAdjuster
                banner={bannerDraft}
                onChange={updates => setBannerDraft(prev => ({ ...prev, ...updates }))}
              />

              {/* Image Source & Upload Controls */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>Change Image Source</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Device File, URL, or Presets</span>
                </div>

                <input
                  type="file"
                  ref={bannerFileInputRef}
                  onChange={handleBannerFileUpload}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => bannerFileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image from Phone/PC</span>
                  </button>
                  <span className="text-[11px] text-slate-500">PNG, JPG, WebP (Max 5MB)</span>
                </div>

                {bannerUploadError && (
                  <p className="text-xs text-rose-600 font-semibold">{bannerUploadError}</p>
                )}

                {/* Direct URL Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Or Enter Image URL:
                  </label>
                  <input
                    type="url"
                    value={bannerDraft.image}
                    onChange={e => setBannerDraft(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-mono text-[11px] text-slate-800 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 mb-1.5">
                    Or Choose a Preset Photography Image:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRESET_BANNER_IMAGES.map(p => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setBannerDraft(prev => ({ ...prev, image: p.url }))}
                        className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                          bannerDraft.image === p.url
                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 font-bold text-emerald-950'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <img src={p.url} alt={p.name} className="w-7 h-7 rounded-lg object-cover shrink-0" />
                        <span className="truncate text-[10px]">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Banner Text & Information */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm">Banner Text & Target Action</h4>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Banner Title {bannerDraft.hideTextOnBanner && <span className="text-[10px] text-slate-400 font-normal">(Hidden on visual card)</span>}
                  </label>
                  <input
                    type="text"
                    value={bannerDraft.title}
                    onChange={e => setBannerDraft(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Harishchandrapur Special Biryani"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Subtitle / Offer Description
                  </label>
                  <input
                    type="text"
                    value={bannerDraft.subtitle}
                    onChange={e => setBannerDraft(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="e.g. Flat ₹50 off + Express village doorstep delivery"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                {/* Badge & Target Link */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={bannerDraft.badge}
                      onChange={e => setBannerDraft(prev => ({ ...prev, badge: e.target.value }))}
                      placeholder="e.g. 50% OFF"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Link Action</label>
                    <select
                      value={bannerDraft.linkType}
                      onChange={e => setBannerDraft(prev => ({ ...prev, linkType: e.target.value as any }))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden font-bold"
                    >
                      <option value="category">Open Category (Food, Grocery)</option>
                      <option value="shop">Open Specific Shop</option>
                      <option value="coupon">Open Discount Coupon</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Name</label>
                    <input
                      type="text"
                      value={bannerDraft.linkTarget}
                      onChange={e => setBannerDraft(prev => ({ ...prev, linkTarget: e.target.value }))}
                      placeholder="e.g. Food or Al-Madina Biryani"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddBanner(false)}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  {editingBannerId ? 'Save & Update Banner' : 'Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {showAddCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                Create Discount Coupon
              </h3>
              <button
                onClick={() => setShowAddCoupon(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DAILYGO50"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 uppercase font-black focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. ₹50 Off for Harishchandrapur Villagers"
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:outline-hidden"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={minimumOrder}
                    onChange={e => setMinimumOrder(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={e => setMaxDiscount(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddCoupon(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
