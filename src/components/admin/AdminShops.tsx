import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shop, ShopType } from '../../types';
import { TOWN_LOCATIONS } from '../../data/mockData';
import {
  Store,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Percent,
  Power,
  Edit2,
  X,
  Star,
  ExternalLink,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export const AdminShops: React.FC = () => {
  const { shops, addShop, updateShop, deleteShop, toggleShopStatus } = useApp();

  const [typeFilter, setTypeFilter] = useState<'all' | 'restaurant' | 'grocery'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [shopToDelete, setShopToDelete] = useState<Shop | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [type, setType] = useState<ShopType>('restaurant');
  const [cuisineStr, setCuisineStr] = useState('Biryani, Mughlai, Rolls');
  const [address, setAddress] = useState('Station Road, Harishchandrapur');
  const [locationName, setLocationName] = useState('Harishchandrapur Central Market');
  const [phone, setPhone] = useState('+91 98765 00000');
  const [openingTime, setOpeningTime] = useState('09:00 AM');
  const [closingTime, setClosingTime] = useState('11:00 PM');
  const [commissionPercentage, setCommissionPercentage] = useState(15);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(12);
  const [deliveryCharge, setDeliveryCharge] = useState(25);
  const [minimumOrder, setMinimumOrder] = useState(149);
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
  );
  const [logo, setLogo] = useState(
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200'
  );

  const resetForm = () => {
    setName('');
    setType('restaurant');
    setCuisineStr('Biryani, North Indian');
    setAddress('Station Road Bazaar');
    setLocationName('Harishchandrapur Town');
    setPhone('+91 98765 44000');
    setOpeningTime('10:00 AM');
    setClosingTime('10:00 PM');
    setCommissionPercentage(15);
    setDeliveryRadiusKm(12);
    setDeliveryCharge(25);
    setMinimumOrder(149);
    setEditingShop(null);
  };

  const openEditModal = (shop: Shop) => {
    setEditingShop(shop);
    setName(shop.name);
    setType(shop.type);
    setCuisineStr(shop.cuisineOrCategory.join(', '));
    setAddress(shop.address);
    setLocationName(shop.locationName);
    setPhone(shop.phone);
    setOpeningTime(shop.openingTime || '09:00 AM');
    setClosingTime(shop.closingTime || '11:00 PM');
    setCommissionPercentage(shop.commissionPercentage ?? shop.commissionRate ?? 15);
    setDeliveryRadiusKm(shop.deliveryRadiusKm);
    setDeliveryCharge(shop.deliveryCharge);
    setMinimumOrder(shop.minimumOrder);
    setCoverImage(shop.coverImage);
    setLogo(shop.logo);
    setShowAddModal(true);
  };

  const handleSaveShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cuisines = cuisineStr.split(',').map(s => s.trim()).filter(Boolean);

    if (editingShop) {
      updateShop(editingShop.id, {
        name,
        type,
        cuisineOrCategory: cuisines,
        address,
        locationName,
        phone,
        openingTime,
        closingTime,
        openingHours: `${openingTime} - ${closingTime}`,
        commissionRate: Number(commissionPercentage),
        commissionPercentage: Number(commissionPercentage),
        deliveryRadiusKm: Number(deliveryRadiusKm),
        deliveryCharge: Number(deliveryCharge),
        minimumOrder: Number(minimumOrder),
        coverImage,
        logo,
      });
    } else {
      addShop({
        name,
        type,
        cuisineOrCategory: cuisines,
        rating: 4.8,
        reviewCount: 12,
        deliveryTimeMins: '25-35 mins',
        distanceKm: 2.1,
        address,
        locationName,
        phone,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@towndrop.in`,
        isOpen: true,
        isApproved: true,
        openingHours: `${openingTime} - ${closingTime}`,
        openingTime,
        closingTime,
        commissionRate: Number(commissionPercentage),
        commissionPercentage: Number(commissionPercentage),
        deliveryRadiusKm: Number(deliveryRadiusKm),
        minimumOrder: Number(minimumOrder),
        deliveryCharge: Number(deliveryCharge),
        coverImage,
        logo,
      });
    }

    setShowAddModal(false);
    resetForm();
  };

  const filteredShops = shops.filter(s => {
    if (typeFilter !== 'all' && s.type !== typeFilter) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.locationName.toLowerCase().includes(q) ||
      s.cuisineOrCategory.some(c => c.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Restaurant & Shop Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure local merchant profiles, commissions, opening hours & delivery radius
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Restaurant / Shop</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search shops by name, cuisine, market..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2">
          {(['all', 'restaurant', 'grocery'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                typeFilter === t
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? 'All Merchants' : t === 'restaurant' ? 'Restaurants' : 'Grocery Stores'}
            </button>
          ))}
        </div>
      </div>

      {/* Merchant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredShops.map(shop => (
          <div
            key={shop.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:border-slate-300 flex flex-col justify-between"
          >
            <div>
              {/* Image banner */}
              <div className="relative h-36 bg-slate-100">
                <img
                  src={shop.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-xs">
                  {shop.type}
                </div>

                <div className="absolute top-3 right-3 flex items-center space-x-1">
                  <button
                    onClick={() => toggleShopStatus(shop.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 ${
                      shop.isOpen
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{shop.isOpen ? 'ONLINE' : 'OFFLINE'}</span>
                  </button>
                </div>

                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="font-bold flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>{shop.openingTime} - {shop.closingTime}</span>
                  </span>
                  <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-md">
                    {shop.deliveryRadiusKm} km radius
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {shop.cuisineOrCategory.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{shop.rating}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Commission Rate:</span>
                    <strong className="text-slate-900">{shop.commissionPercentage}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Delivery Charge:</span>
                    <strong className="text-slate-900">₹{shop.deliveryCharge}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Order Value:</span>
                    <strong className="text-slate-900">₹{shop.minimumOrder}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Merchant Contact:</span>
                    <span className="text-slate-700">{shop.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  shop.isApproved
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {shop.isApproved ? 'Approved & Live' : 'Pending Review'}
              </span>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  id={`delete-shop-btn-${shop.id}`}
                  onClick={() => setShopToDelete(shop)}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-200/80 transition-colors flex items-center space-x-1"
                  title="Remove Restaurant / Shop"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(shop)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Settings</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Shop Confirmation Modal */}
      {shopToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">
              Remove Restaurant / Shop?
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-800">{shopToDelete.name}</strong> from TownDrop? All catalog items and products belonging to this merchant will also be permanently deleted.
            </p>
            <div className="mt-6 flex space-x-2">
              <button
                type="button"
                onClick={() => setShopToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-delete-shop-btn"
                onClick={() => {
                  deleteShop(shopToDelete.id);
                  setShopToDelete(null);
                  if (editingShop?.id === shopToDelete.id) {
                    setShowAddModal(false);
                    setEditingShop(null);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs"
              >
                Yes, Remove Merchant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Shop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingShop ? `Edit ${editingShop.name}` : 'Register New Merchant'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShop} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Shop / Restaurant Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Royal Biryani & Sweets"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Business Category
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as ShopType)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:outline-hidden"
                  >
                    <option value="restaurant">Restaurant / Eatery</option>
                    <option value="grocery">Grocery / Mandi / Supermarket</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Cuisines or Categories (comma separated)
                </label>
                <input
                  type="text"
                  value={cuisineStr}
                  onChange={e => setCuisineStr(e.target.value)}
                  placeholder="e.g. Biryani, North Indian, Rolls"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Market / Town Area
                  </label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={e => setLocationName(e.target.value)}
                    placeholder="e.g. Harishchandrapur Main Market"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Contact Mobile Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Opening Time
                  </label>
                  <input
                    type="text"
                    value={openingTime}
                    onChange={e => setOpeningTime(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Closing Time
                  </label>
                  <input
                    type="text"
                    value={closingTime}
                    onChange={e => setClosingTime(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Commission (%)
                  </label>
                  <input
                    type="number"
                    value={commissionPercentage}
                    onChange={e => setCommissionPercentage(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Radius (Km)
                  </label>
                  <input
                    type="number"
                    value={deliveryRadiusKm}
                    onChange={e => setDeliveryRadiusKm(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Cover Photo URL
                  </label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={e => setCoverImage(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    value={logo}
                    onChange={e => setLogo(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                {editingShop && (
                  <button
                    type="button"
                    onClick={() => setShopToDelete(editingShop)}
                    className="py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-200"
                  >
                    Delete Shop
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  {editingShop ? 'Update Merchant' : 'Register Merchant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
