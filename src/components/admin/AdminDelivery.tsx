import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeliveryAreasManager } from './DeliveryAreasManager';
import {
  Bike,
  Plus,
  Search,
  MapPin,
  X
} from 'lucide-react';

export const AdminDelivery: React.FC = () => {
  const { deliveryPartners, addDeliveryPartner, toggleDeliveryPartnerApproval, deliveryZones } = useApp();

  const [activeDeliverySubtab, setActiveDeliverySubtab] = useState<'areas' | 'riders'>('areas');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [vehicleType, setVehicleType] = useState('Hero Splendor Bike');
  const [vehicleNumber, setVehicleNumber] = useState('WB-66-AB-1234');
  const [drivingLicense, setDrivingLicense] = useState('DL-WB66-2021008765');
  const [aadhaarNumber, setAadhaarNumber] = useState('XXXX-XXXX-9876');

  const handleAddRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) return;

    addDeliveryPartner({
      name,
      mobile,
      vehicleType,
      vehicleNumber,
      drivingLicense,
      aadhaarNumber,
      isApproved: true,
      isOnline: true,
      currentLocation: 'Harishchandrapur Station Road Hub',
      rating: 4.8,
      completedOrdersCount: 0,
      walletBalance: 0,
      totalEarnings: 0,
    });

    setName('');
    setMobile('');
    setShowAddModal(false);
  };

  const filteredPartners = deliveryPartners.filter(d => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.mobile.toLowerCase().includes(q) ||
      d.vehicleNumber.toLowerCase().includes(q)
    );
  });

  const activeZonesCount = deliveryZones.filter(z => z.isDelivering).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Delivery Management & Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Control target villages, service availability, delivery surcharge, and manage active rider fleet
          </p>
        </div>

        {/* Subtab Selector */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
          <button
            type="button"
            id="admin-delivery-subtab-areas-btn"
            onClick={() => setActiveDeliverySubtab('areas')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeDeliverySubtab === 'areas'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Delivery Areas & Villages</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
              {activeZonesCount}/{deliveryZones.length}
            </span>
          </button>

          <button
            type="button"
            id="admin-delivery-subtab-riders-btn"
            onClick={() => setActiveDeliverySubtab('riders')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeDeliverySubtab === 'riders'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bike className="w-3.5 h-3.5 text-blue-600" />
            <span>Riders & Fleet</span>
            <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
              {deliveryPartners.length}
            </span>
          </button>
        </div>
      </div>

      {/* Subtab View */}
      {activeDeliverySubtab === 'areas' ? (
        <DeliveryAreasManager />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">Active Delivery Fleet</h2>
              <p className="text-xs text-slate-500">Manage onboarded delivery boys, credentials, and live online duty status</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search riders..."
                  className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard Rider</span>
              </button>
            </div>
          </div>

          {/* Search & KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Fleet</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{deliveryPartners.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Online on Duty</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {deliveryPartners.filter(d => d.isOnline).length} Riders
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Completed Trips</span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {deliveryPartners.reduce((s, d) => s + d.completedOrdersCount, 0)}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Fleet Payouts</span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                ₹{deliveryPartners.reduce((s, d) => s + d.totalEarnings, 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Fleet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPartners.map(partner => (
              <div
                key={partner.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl">
                        🛵
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900">
                          {partner.name}
                        </h3>
                        <p className="text-xs text-slate-500">{partner.mobile}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        partner.isOnline
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {partner.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>

                  {/* KYC & Vehicle Info */}
                  <div className="pt-2 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Vehicle:</span>
                      <strong className="text-slate-900">{partner.vehicleType} ({partner.vehicleNumber})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Driving License:</span>
                      <span className="font-semibold text-slate-800">{partner.drivingLicense}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aadhaar ID:</span>
                      <span className="font-semibold text-slate-800">{partner.aadhaarNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Hub / Location:</span>
                      <span className="text-emerald-800 font-bold">{partner.currentLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Rating:</span>
                      <span className="font-bold text-amber-600">★ {partner.rating}</span>
                    </div>
                  </div>

                  {/* Earnings & Payout box */}
                  <div className="mt-3 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Total Earned</span>
                      <p className="font-black text-sm text-emerald-950">₹{partner.totalEarnings}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Wallet Pending</span>
                      <p className="font-black text-sm text-slate-900">₹{partner.walletBalance}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Deliveries</span>
                      <p className="font-black text-sm text-slate-900">{partner.completedOrdersCount}</p>
                    </div>
                  </div>
                </div>

                {/* Approval / Rejection action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      partner.isApproved ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {partner.isApproved ? '✓ Verified Partner' : 'Pending Verification'}
                  </span>

                  <button
                    onClick={() => toggleDeliveryPartnerApproval(partner.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      partner.isApproved
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {partner.isApproved ? 'Revoke Approval' : 'Approve Partner'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Delivery Partner Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-base text-slate-900">
                    Onboard Delivery Partner
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddRider} className="space-y-3 mt-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rider Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Subir Karmakar"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={e => setMobile(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Vehicle Model</label>
                      <input
                        type="text"
                        value={vehicleType}
                        onChange={e => setVehicleType(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Vehicle Number</label>
                      <input
                        type="text"
                        value={vehicleNumber}
                        onChange={e => setVehicleNumber(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Driving License</label>
                      <input
                        type="text"
                        value={drivingLicense}
                        onChange={e => setDrivingLicense(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Aadhaar Card No.</label>
                      <input
                        type="text"
                        value={aadhaarNumber}
                        onChange={e => setAadhaarNumber(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
                    >
                      Save Partner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
