import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { printInvoice, downloadInvoiceFile } from '../../utils/invoiceGenerator';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Bike,
  Printer,
  Phone,
  MapPin,
  Clock,
  User,
  ChevronDown,
  Eye,
  X,
  Download,
  AlertCircle,
  Truck,
  TrendingUp,
  PackageCheck,
  RotateCcw
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const {
    orders,
    deliveryPartners,
    updateOrderStatus,
    assignDeliveryPartner,
    cancelOrder,
    settings,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [villageFilter, setVillageFilter] = useState<string>('all');
  const [shopTypeFilter, setShopTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Extract unique villages from orders & settings
  const uniqueVillages = Array.from(
    new Set([
      ...(settings.targetVillages || []),
      'Harishchandrapur',
      ...orders.map(o => o.deliveryAddress.townOrVillage)
    ])
  ).filter(Boolean);

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.orderStatus !== statusFilter) return false;
    if (villageFilter !== 'all' && order.deliveryAddress.townOrVillage !== villageFilter) return false;
    if (shopTypeFilter !== 'all' && order.shopType !== shopTypeFilter) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    return (
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerMobile.toLowerCase().includes(q) ||
      order.shopName.toLowerCase().includes(q) ||
      order.deliveryAddress.townOrVillage.toLowerCase().includes(q) ||
      order.deliveryAddress.street.toLowerCase().includes(q) ||
      order.items.some(i => i.product.name.toLowerCase().includes(q))
    );
  });

  const availableRiders = deliveryPartners.filter(r => r.isApproved);

  // Summary Metrics
  const totalCount = orders.length;
  const pendingCount = orders.filter(o => o.orderStatus === 'pending').length;
  const inProgressCount = orders.filter(o => ['accepted', 'preparing', 'ready'].includes(o.orderStatus)).length;
  const outForDeliveryCount = orders.filter(o => o.orderStatus === 'out_for_delivery').length;
  const deliveredCount = orders.filter(o => o.orderStatus === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.orderStatus !== 'cancelled' ? o.totalAmount : 0), 0);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'preparing':
      case 'accepted':
      case 'ready':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'pending':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              All Orders Dispatch & Management
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-lg">
              {settings.appName || 'DailyGo'} Master Console
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time control over all customer orders across Harishchandrapur town and surrounding villages
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold">
            Total Orders: {orders.length}
          </span>
        </div>
      </div>

      {/* Summary KPI Cards for Full Visibility */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500">All Orders</p>
          <p className="text-xl font-black text-slate-900 mt-1">{totalCount}</p>
        </div>

        <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 shadow-xs">
          <p className="text-[11px] font-bold text-purple-700">Pending</p>
          <p className="text-xl font-black text-purple-900 mt-1">{pendingCount}</p>
        </div>

        <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 shadow-xs">
          <p className="text-[11px] font-bold text-amber-700">In Prep / Packing</p>
          <p className="text-xl font-black text-amber-900 mt-1">{inProgressCount}</p>
        </div>

        <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 shadow-xs">
          <p className="text-[11px] font-bold text-blue-700">Out for Delivery</p>
          <p className="text-xl font-black text-blue-900 mt-1">{outForDeliveryCount}</p>
        </div>

        <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
          <p className="text-[11px] font-bold text-emerald-700">Delivered</p>
          <p className="text-xl font-black text-emerald-900 mt-1">{deliveredCount}</p>
        </div>

        <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xs">
          <p className="text-[11px] font-bold text-slate-300">Total Sales Value</p>
          <p className="text-xl font-black text-emerald-400 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Filter, Search & Village Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Order #, Customer, Phone, Shop, Village..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Village and Shop Type Selectors */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center space-x-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <select
                value={villageFilter}
                onChange={e => setVillageFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Villages & Areas</option>
                {uniqueVillages.map(v => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
              <select
                value={shopTypeFilter}
                onChange={e => setShopTypeFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Shop Types</option>
                <option value="restaurant">Restaurants & Food</option>
                <option value="grocery">Grocery & Mandi</option>
              </select>
            </div>

            {(statusFilter !== 'all' || villageFilter !== 'all' || shopTypeFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setVillageFilter('all');
                  setShopTypeFilter('all');
                  setSearchQuery('');
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full no-scrollbar pt-1">
          {[
            { id: 'all', label: `All (${orders.length})` },
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'accepted', label: 'Accepted' },
            { id: 'preparing', label: `Preparing (${orders.filter(o => o.orderStatus === 'preparing').length})` },
            { id: 'out_for_delivery', label: `Out for Delivery (${outForDeliveryCount})` },
            { id: 'delivered', label: `Delivered (${deliveredCount})` },
            { id: 'cancelled', label: `Cancelled (${orders.filter(o => o.orderStatus === 'cancelled').length})` },
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-bold text-sm">No orders found</p>
            <p className="text-slate-400 text-xs mt-1">
              Try adjusting your search query, status filter, or village filter.
            </p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              {/* Row 1: Order header, ID, Shop, and Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs">
                    #{order.orderNumber.replace(/[^0-9]/g, '').slice(-3) || '00'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-sm text-slate-900">
                        Order #{order.orderNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(order.createdAt).toLocaleDateString()})
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      From: <strong>{order.shopName}</strong> ({order.shopType})
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusBadge(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus.replace(/_/g, ' ')}
                  </span>

                  {/* Print & Download Invoice Buttons */}
                  <button
                    onClick={() => printInvoice(order, settings.appName)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Print Bill Invoice"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => downloadInvoiceFile(order, settings.appName)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Download Invoice HTML"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setSelectedOrderDetails(order)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
                    title="View Full Order Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Customer, Destination Village & Items */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Customer info */}
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Customer Info
                  </span>
                  <p className="font-bold text-slate-900">{order.customerName}</p>
                  <a
                    href={`tel:${order.customerMobile}`}
                    className="text-emerald-700 font-semibold hover:underline flex items-center space-x-1 mt-0.5"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{order.customerMobile}</span>
                  </a>
                </div>

                {/* Delivery location */}
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Village / Destination
                  </span>
                  <p className="font-bold text-emerald-800 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{order.deliveryAddress.townOrVillage}</span>
                    <span className="text-[10px] text-slate-500 font-normal">({order.deliveryAddress.label})</span>
                  </p>
                  <p className="text-slate-600 truncate mt-0.5">
                    {order.deliveryAddress.street}, {order.deliveryAddress.area}
                  </p>
                  {order.deliveryInstructions && (
                    <p className="text-[10px] text-amber-800 italic mt-1">
                      Note: {order.deliveryInstructions}
                    </p>
                  )}
                </div>

                {/* Bill Amount & Payment Status */}
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Bill & Payment
                  </span>
                  <div className="flex items-center justify-between">
                    <p className="font-black text-sm text-slate-900">
                      ₹{order.totalAmount}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      order.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.paymentMethod.toUpperCase()} • {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    {order.items.length} items • Delivery: {order.deliveryFee === 0 ? 'FREE (₹0)' : `₹${order.deliveryFee}`}
                  </p>
                </div>
              </div>

              {/* Items summary chip list */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {order.items.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium"
                  >
                    <span className="font-bold text-slate-900">{item.quantity}x</span>
                    <span>{item.product.name}</span>
                    <span className="text-slate-400">₹{item.itemPrice * item.quantity}</span>
                  </span>
                ))}
              </div>

              {/* Row 3: Dispatch, Rider Assignment & Direct Status Override */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                {/* Rider Assignment Dropdown */}
                <div className="flex items-center space-x-2">
                  <Bike className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">Rider:</span>
                  <select
                    value={
                      availableRiders.find(r => r.name === order.deliveryPartnerName)?.id || ''
                    }
                    onChange={e => {
                      if (e.target.value) {
                        assignDeliveryPartner(order.id, e.target.value);
                      }
                    }}
                    className="text-xs p-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:outline-hidden"
                  >
                    <option value="">-- Assign Delivery Rider --</option>
                    {availableRiders.map(rider => (
                      <option key={rider.id} value={rider.id}>
                        {rider.name} ({rider.vehicleNumber}) - {rider.isOnline ? '🟢 Online' : '⚪ Offline'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Admin Direct Status Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Step quick actions */}
                  {order.orderStatus === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'accepted')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                    >
                      Accept Order
                    </button>
                  )}

                  {order.orderStatus === 'accepted' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs"
                    >
                      Mark Preparing / Packing
                    </button>
                  )}

                  {order.orderStatus === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                    >
                      Dispatch (Out for Delivery)
                    </button>
                  )}

                  {order.orderStatus === 'out_for_delivery' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                    >
                      Confirm Delivered
                    </button>
                  )}

                  {/* Direct Status Selector for Admin Override */}
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] font-bold text-slate-400">Set Status:</span>
                    <select
                      value={order.orderStatus}
                      onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="text-xs py-1 px-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 focus:outline-hidden"
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready for Pickup</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detailed Order Modal with Bill Printing */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Order Details #{selectedOrderDetails.orderNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  {new Date(selectedOrderDetails.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4 text-xs">
              {/* Order Status & Direct Override */}
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Status</span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border mt-1 ${getStatusBadge(
                      selectedOrderDetails.orderStatus
                    )}`}
                  >
                    {selectedOrderDetails.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={selectedOrderDetails.orderStatus}
                    onChange={e => {
                      const newStatus = e.target.value as OrderStatus;
                      updateOrderStatus(selectedOrderDetails.id, newStatus);
                      setSelectedOrderDetails({
                        ...selectedOrderDetails,
                        orderStatus: newStatus,
                      });
                    }}
                    className="p-2 rounded-xl border border-slate-300 bg-white font-bold text-xs"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer & Destination Village */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="font-bold text-slate-400 text-[10px] uppercase">Customer</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedOrderDetails.customerName}</p>
                  <p className="text-slate-600">{selectedOrderDetails.customerMobile}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="font-bold text-slate-400 text-[10px] uppercase">Destination Village</p>
                  <p className="font-bold text-emerald-800 text-sm mt-0.5">{selectedOrderDetails.deliveryAddress.townOrVillage}</p>
                  <p className="text-slate-600">{selectedOrderDetails.deliveryAddress.street}</p>
                </div>
              </div>

              {/* Shop info */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-400 text-[10px] uppercase">Store / Merchant</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedOrderDetails.shopName}</p>
                  <p className="text-slate-500 capitalize">{selectedOrderDetails.shopType}</p>
                </div>
                {selectedOrderDetails.deliveryPartnerName && (
                  <div className="text-right">
                    <p className="font-bold text-slate-400 text-[10px] uppercase">Assigned Rider</p>
                    <p className="font-bold text-emerald-700 text-sm mt-0.5">{selectedOrderDetails.deliveryPartnerName}</p>
                    <p className="text-slate-500">{selectedOrderDetails.deliveryPartnerMobile}</p>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-100 p-2.5 font-bold text-slate-700 text-[11px] flex justify-between">
                  <span>Item Name</span>
                  <span>Qty × Price</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {selectedOrderDetails.items.map((it, i) => (
                    <div key={i} className="p-2.5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{it.product.name}</p>
                        {it.selectedVariation && (
                          <p className="text-[10px] text-slate-500">Variant: {it.selectedVariation.name}</p>
                        )}
                      </div>
                      <span className="font-black text-slate-900">
                        {it.quantity} × ₹{it.itemPrice} = ₹{it.quantity * it.itemPrice}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Totals Breakdown */}
              <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-slate-900">₹{selectedOrderDetails.itemTotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span className="font-bold text-slate-900">
                    {selectedOrderDetails.deliveryFee === 0 ? 'FREE (₹0)' : `₹${selectedOrderDetails.deliveryFee}`}
                  </span>
                </div>
                {selectedOrderDetails.couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount ({selectedOrderDetails.appliedCouponCode}):</span>
                    <span className="font-bold">-₹{selectedOrderDetails.couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Payable:</span>
                  <span className="text-emerald-700">₹{selectedOrderDetails.totalAmount}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Payment Mode:</span>
                  <span className="font-semibold uppercase">{selectedOrderDetails.paymentMethod} ({selectedOrderDetails.paymentStatus})</span>
                </div>
              </div>
            </div>

            {/* Modal Actions: Print & Download Invoice */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => printInvoice(selectedOrderDetails, settings.appName)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => downloadInvoiceFile(selectedOrderDetails, settings.appName)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download HTML</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
