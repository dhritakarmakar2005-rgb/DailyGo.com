import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeliveryAreaZone } from '../../types';
import {
  MapPin,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Navigation,
  Sliders,
  RotateCcw,
  Edit2,
  Trash2,
  AlertTriangle,
  Info,
  ShieldAlert,
  ArrowUpDown,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const SUGGESTED_HARISHCHANDRAPUR_VILLAGES = [
  { name: 'Barduary Gram', type: 'village' as const, distance: 3.2, time: '20-30 min' },
  { name: 'Kushida Village', type: 'village' as const, distance: 4.5, time: '25-35 min' },
  { name: 'Bhaluka Village', type: 'village' as const, distance: 5.2, time: '25-35 min' },
  { name: 'Tulshihata Village', type: 'village' as const, distance: 6.1, time: '30-40 min' },
  { name: 'Daulatpur Gram', type: 'village' as const, distance: 5.8, time: '30-40 min' },
  { name: 'Rashidpur Village', type: 'village' as const, distance: 4.0, time: '25-30 min' },
  { name: 'Malior Village', type: 'village' as const, distance: 6.5, time: '30-40 min' },
  { name: 'Boroi Village', type: 'village' as const, distance: 4.8, time: '25-35 min' },
  { name: 'Pipla Village', type: 'village' as const, distance: 7.0, time: '35-45 min' },
  { name: 'Mashaldaha Gram', type: 'village' as const, distance: 8.5, time: '35-50 min' },
  { name: 'Doulatnagar Village', type: 'village' as const, distance: 7.2, time: '35-45 min' },
  { name: 'Chandipur Gram', type: 'village' as const, distance: 6.8, time: '30-40 min' },
  { name: 'Bhikahar Village', type: 'village' as const, distance: 5.5, time: '30-40 min' },
  { name: 'Fatepur Gram', type: 'village' as const, distance: 7.8, time: '40-50 min' },
  { name: 'Station Road & Market', type: 'town' as const, distance: 0.5, time: '15-20 min' },
  { name: 'Hospital More & Bus Stand', type: 'town' as const, distance: 1.0, time: '15-20 min' },
  { name: 'Cinema Hall More', type: 'town' as const, distance: 0.8, time: '15-20 min' }
];

export const DeliveryAreasManager: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    deliveryZones,
    addDeliveryZone,
    updateDeliveryZone,
    toggleDeliveryZoneStatus,
    deleteDeliveryZone,
    resetDeliveryZonesToDefault,
    settings,
    updateSettings
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'paused'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryAreaZone | null>(null);

  // Form states
  const [zoneName, setZoneName] = useState('');
  const [zoneType, setZoneType] = useState<'village' | 'town'>('village');
  const [distanceKm, setDistanceKm] = useState<number>(4.0);
  const [estimatedDeliveryMins, setEstimatedDeliveryMins] = useState('25-35 min');
  const [isDelivering, setIsDelivering] = useState(true);
  const [deliveryFeeSurcharge, setDeliveryFeeSurcharge] = useState<number>(0);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(149);
  const [zoneNotes, setZoneNotes] = useState('');

  // Radius and Enforcement states
  const maxRadius = settings.maxDeliveryRadiusKm ?? 12;
  const strictEnforcement = settings.strictZoneEnforcement ?? true;

  const activeZonesCount = deliveryZones.filter(z => z.isDelivering).length;
  const pausedZonesCount = deliveryZones.filter(z => !z.isDelivering).length;

  const openAddModal = () => {
    setEditingZone(null);
    setZoneName('');
    setZoneType('village');
    setDistanceKm(4.0);
    setEstimatedDeliveryMins('25-35 min');
    setIsDelivering(true);
    setDeliveryFeeSurcharge(0);
    setMinOrderAmount(149);
    setZoneNotes('');
    setShowAddModal(true);
  };

  const openEditModal = (zone: DeliveryAreaZone) => {
    setEditingZone(zone);
    setZoneName(zone.name);
    setZoneType(zone.type);
    setDistanceKm(zone.distanceKm);
    setEstimatedDeliveryMins(zone.estimatedDeliveryMins);
    setIsDelivering(zone.isDelivering);
    setDeliveryFeeSurcharge(zone.deliveryFeeSurcharge || 0);
    setMinOrderAmount(zone.minOrderAmount || 0);
    setZoneNotes(zone.notes || '');
    setShowAddModal(true);
  };

  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName.trim()) return;

    if (editingZone) {
      updateDeliveryZone(editingZone.id, {
        name: zoneName.trim(),
        type: zoneType,
        distanceKm: Number(distanceKm),
        estimatedDeliveryMins: estimatedDeliveryMins.trim() || '25-35 min',
        isDelivering,
        deliveryFeeSurcharge: Number(deliveryFeeSurcharge),
        minOrderAmount: Number(minOrderAmount),
        notes: zoneNotes.trim()
      });
    } else {
      addDeliveryZone({
        name: zoneName.trim(),
        type: zoneType,
        distanceKm: Number(distanceKm),
        estimatedDeliveryMins: estimatedDeliveryMins.trim() || '25-35 min',
        isDelivering,
        deliveryFeeSurcharge: Number(deliveryFeeSurcharge),
        minOrderAmount: Number(minOrderAmount),
        notes: zoneNotes.trim()
      });
    }

    setShowAddModal(false);
  };

  const handleQuickAddSuggested = (suggested: typeof SUGGESTED_HARISHCHANDRAPUR_VILLAGES[0]) => {
    const existing = deliveryZones.find(
      z => z.name.toLowerCase() === suggested.name.toLowerCase()
    );
    if (existing) {
      // If it exists but is paused, turn it back on
      if (!existing.isDelivering) {
        toggleDeliveryZoneStatus(existing.id);
      }
      return;
    }

    addDeliveryZone({
      name: suggested.name,
      type: suggested.type,
      distanceKm: suggested.distance,
      estimatedDeliveryMins: suggested.time,
      isDelivering: true,
      deliveryFeeSurcharge: suggested.distance > 5 ? 5 : 0,
      minOrderAmount: suggested.type === 'village' ? 149 : 99,
      notes: `${suggested.name} - Harishchandrapur surrounding cluster`
    });
  };

  const handleToggleAll = (status: boolean) => {
    deliveryZones.forEach(z => {
      if (z.isDelivering !== status) {
        toggleDeliveryZoneStatus(z.id);
      }
    });
  };

  const handleTownOnlyDelivery = () => {
    deliveryZones.forEach(z => {
      if (z.type === 'village' && z.isDelivering) {
        toggleDeliveryZoneStatus(z.id);
      } else if (z.type === 'town' && !z.isDelivering) {
        toggleDeliveryZoneStatus(z.id);
      }
    });
  };

  const handleUpdateRadius = (radius: number) => {
    updateSettings({ maxDeliveryRadiusKm: radius });
  };

  const handleToggleStrictEnforcement = () => {
    updateSettings({ strictZoneEnforcement: !strictEnforcement });
  };

  const filteredZones = deliveryZones.filter(zone => {
    if (filterType === 'active' && !zone.isDelivering) return false;
    if (filterType === 'paused' && zone.isDelivering) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      zone.name.toLowerCase().includes(q) ||
      zone.type.toLowerCase().includes(q) ||
      (zone.notes && zone.notes.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Title & Top Description Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-black text-xs uppercase tracking-wider border border-emerald-500/30 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Harishchandrapur Delivery Hub Control</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Malda, WB</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Delivery Areas & Village Coverage Control
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              You decide where DailyGo delivers. Turn delivery on or off for individual villages (e.g. Barduary, Kushida, Bhaluka, Tulshihata) during rain, night hours, or rider shortages.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="admin-add-delivery-zone-btn"
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Village / Area</span>
            </button>
            <button
              type="button"
              id="admin-reset-delivery-zones-btn"
              onClick={resetDeliveryZonesToDefault}
              title="Reset all villages to default Harishchandrapur list"
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-slate-400 font-medium block text-[11px]">Total Service Zones</span>
            <span className="text-xl font-black text-white mt-0.5 block">{deliveryZones.length} Areas</span>
          </div>
          <div className="bg-emerald-950/50 p-3 rounded-2xl border border-emerald-500/30">
            <span className="text-emerald-300 font-medium block text-[11px]">Delivering Now (Active)</span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">{activeZonesCount} Zones</span>
          </div>
          <div className="bg-rose-950/40 p-3 rounded-2xl border border-rose-500/30">
            <span className="text-rose-300 font-medium block text-[11px]">Service Paused / Stopped</span>
            <span className="text-xl font-black text-rose-400 mt-0.5 block">{pausedZonesCount} Zones</span>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-slate-400 font-medium block text-[11px]">Hub Max Delivery Radius</span>
            <span className="text-xl font-black text-amber-300 mt-0.5 block">{maxRadius} km</span>
          </div>
        </div>
      </div>

      {/* Operational Controls & Quick Actions */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Bulk Delivery Operations</span>
            </h3>
            <p className="text-xs text-slate-500">
              One-click actions to switch delivery modes based on weather, demand, or fleet availability
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              id="admin-bulk-enable-all-zones-btn"
              onClick={() => handleToggleAll(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors"
            >
              ✓ Deliver to All Villages
            </button>
            <button
              type="button"
              id="admin-bulk-town-only-btn"
              onClick={handleTownOnlyDelivery}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors"
            >
              🏙️ Town Only (Pause Villages)
            </button>
            <button
              type="button"
              id="admin-bulk-pause-all-btn"
              onClick={() => handleToggleAll(false)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 transition-colors"
            >
              ⏸ Pause All Areas
            </button>
          </div>
        </div>

        {/* Radius & Boundary Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          {/* Max Delivery Radius */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>Max Delivery Radius from Harishchandrapur:</span>
              </label>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-black text-xs">
                {maxRadius} km
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="25"
              step="1"
              value={maxRadius}
              onChange={e => handleUpdateRadius(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>3 km (Town only)</span>
              <span>12 km (Standard Villages)</span>
              <span>25 km (Deep Rural Blocks)</span>
            </div>
          </div>

          {/* Strict Delivery Boundary Check */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <p className="font-bold text-slate-900 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <span>Strict Delivery Zone Enforcement</span>
              </p>
              <p className="text-[11px] text-slate-500">
                When enabled, customers can ONLY place orders if their village or area is actively delivering in this list.
              </p>
            </div>
            <button
              type="button"
              id="admin-toggle-strict-enforcement-btn"
              onClick={handleToggleStrictEnforcement}
              className={`p-2 rounded-xl border font-bold text-xs flex items-center space-x-1 transition-colors shrink-0 ${
                strictEnforcement
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {strictEnforcement ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enforced</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Off</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delivery Zones List & Filters */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="admin-search-delivery-zones-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search village (e.g. Barduary, Kushida, Bhaluka...)"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl shrink-0 text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({deliveryZones.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('active')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                filterType === 'active' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Delivering ({activeZonesCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('paused')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                filterType === 'paused' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              Paused ({pausedZonesCount})
            </button>
          </div>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {filteredZones.map(zone => {
            const isTown = zone.type === 'town';
            return (
              <div
                key={zone.id}
                className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                  zone.isDelivering
                    ? 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
                    : 'bg-slate-50/80 border-slate-300/80 opacity-80'
                }`}
              >
                <div>
                  {/* Top row: Type badge & Status Switch */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide flex items-center space-x-1 ${
                        isTown
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <span>{isTown ? '🏙️ Town Area' : '🌾 Village'}</span>
                    </span>

                    {/* Delivery Toggle Button */}
                    <button
                      type="button"
                      id={`toggle-zone-delivering-${zone.id}`}
                      onClick={() => toggleDeliveryZoneStatus(zone.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center space-x-1 transition-all cursor-pointer ${
                        zone.isDelivering
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300'
                      }`}
                      title={zone.isDelivering ? 'Click to pause deliveries' : 'Click to activate deliveries'}
                    >
                      {zone.isDelivering ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                          <span>Delivering</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-rose-600" />
                          <span>Paused</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Area Name */}
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                    {zone.name}
                  </h4>

                  {/* Meta specs */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center space-x-1">
                      <Navigation className="w-3 h-3 text-slate-400" />
                      <span>{zone.distanceKm} km from hub</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{zone.estimatedDeliveryMins}</span>
                    </span>
                  </div>

                  {/* Financial terms */}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-600">
                      Min Order: <strong className="text-slate-900">₹{zone.minOrderAmount || 0}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">
                      Extra Fee:{' '}
                      <strong className={zone.deliveryFeeSurcharge ? 'text-amber-700' : 'text-slate-900'}>
                        {zone.deliveryFeeSurcharge ? `+₹${zone.deliveryFeeSurcharge}` : '₹0 (Standard)'}
                      </strong>
                    </span>
                  </div>

                  {zone.notes && (
                    <p className="text-[10px] text-slate-400 italic mt-1.5 truncate">
                      "{zone.notes}"
                    </p>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-end space-x-1 mt-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => openEditModal(zone)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit Area details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteDeliveryZone(zone.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove from delivery coverage"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredZones.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            No delivery areas match your search filter.
          </div>
        )}

        {/* Quick Add Surrounding Villages Suggestions */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 block mb-2">
            🌾 Quick Add Harishchandrapur Surrounding Villages & Town Wards:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_HARISHCHANDRAPUR_VILLAGES.filter(
              s => !deliveryZones.some(z => z.name.toLowerCase() === s.name.toLowerCase())
            ).map(s => (
              <button
                key={s.name}
                type="button"
                onClick={() => handleQuickAddSuggested(s)}
                className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 font-semibold transition-all flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                <span>{s.name}</span>
                <span className="text-[10px] text-slate-400">({s.distance}km)</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Add or Edit Delivery Area */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>{editingZone ? 'Edit Delivery Area' : 'Add New Delivery Area'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveZone} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Area / Village Name *
                </label>
                <input
                  type="text"
                  required
                  value={zoneName}
                  onChange={e => setZoneName(e.target.value)}
                  placeholder="e.g. Barduary, Kushida, Bhaluka..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={zoneType}
                    onChange={e => setZoneType(e.target.value as 'village' | 'town')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:outline-hidden"
                  >
                    <option value="village">🌾 Rural Village</option>
                    <option value="town">🏙️ Town Hub / Ward</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={distanceKm}
                    onChange={e => setDistanceKm(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Est. Delivery Time</label>
                  <input
                    type="text"
                    value={estimatedDeliveryMins}
                    onChange={e => setEstimatedDeliveryMins(e.target.value)}
                    placeholder="e.g. 25-35 min"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Extra Surcharge (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={deliveryFeeSurcharge}
                    onChange={e => setDeliveryFeeSurcharge(Number(e.target.value))}
                    placeholder="0"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={minOrderAmount}
                  onChange={e => setMinOrderAmount(Number(e.target.value))}
                  placeholder="149"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Route / Area Notes</label>
                <input
                  type="text"
                  value={zoneNotes}
                  onChange={e => setZoneNotes(e.target.value)}
                  placeholder="e.g. Highway road, near Gram Panchayat"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-hidden"
                />
              </div>

              {/* Delivery Active Switch */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Delivery Status</p>
                  <p className="text-[11px] text-slate-500">Allow customers in this area to place orders</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDelivering(!isDelivering)}
                  className={`px-3 py-1.5 rounded-full font-bold text-xs flex items-center space-x-1 transition-colors ${
                    isDelivering
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {isDelivering ? '✓ Delivering' : '⏸ Paused'}
                </button>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md cursor-pointer"
                >
                  {editingZone ? 'Save Changes' : 'Add to Delivery Areas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
