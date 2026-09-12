import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ArrowLeft,
  ShoppingBag,
  Bike,
  Store,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Play
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const {
    trackingOrderId,
    setTrackingOrderId,
    orders,
    setCustomerTab,
  } = useApp();

  const order = orders.find(o => o.id === trackingOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">No active order found</h2>
        <button
          onClick={() => setCustomerTab('orders')}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          View Order History
        </button>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'pending', label: 'Order Placed', desc: 'Received & waiting for store confirmation' },
    { key: 'accepted', label: 'Order Accepted', desc: 'Shop has confirmed your order' },
    { key: 'preparing', label: 'Preparing / Packing', desc: 'Kitchen or store is packing your items' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider is on the way to your doorstep' },
    { key: 'delivered', label: 'Delivered', desc: 'Parcel safely handed over' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'accepted': return 1;
      case 'preparing': return 2;
      case 'ready': return 2;
      case 'assigned': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      case 'refunded': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.orderStatus);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-28 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <button
            id="back-from-tracking-btn"
            onClick={() => setCustomerTab('orders')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900">
              Track Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-slate-500">
              From {order.shopName}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Dispatch Status</span>
        </div>
      </div>

      {/* Status Hero Card */}
      <div className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-xl shadow-emerald-700/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-xs font-black tracking-wider uppercase">
              {order.orderStatus.replace(/_/g, ' ')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">
              {order.orderStatus === 'delivered'
                ? 'Delivered with Success!'
                : order.orderStatus === 'cancelled'
                ? 'Order Cancelled'
                : `Arriving in ${order.estimatedDeliveryTime}`}
            </h2>
            <p className="text-xs text-emerald-100 mt-1 max-w-md">
              {order.orderStatus === 'delivered'
                ? 'Hope you loved your order! Rate your experience below.'
                : `Delivering to ${order.deliveryAddress.street}, ${order.deliveryAddress.townOrVillage}`}
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl shrink-0">
            {order.orderStatus === 'delivered'
              ? '🎉'
              : order.orderStatus === 'out_for_delivery'
              ? '🛵'
              : '🍳'}
          </div>
        </div>
      </div>

      {/* Interactive Delivery Stepper */}
      <div className="mt-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-6">
          Live Order Status Steps
        </h3>

        <div className="relative space-y-8 pl-4">
          {/* Vertical line connecting steps */}
          <div className="absolute left-[27px] top-3 bottom-5 w-0.5 bg-slate-200" />

          {steps.map((step, idx) => {
            const isCompleted = currentStepIdx >= idx;
            const isCurrent = currentStepIdx === idx;

            return (
              <div key={step.key} className="relative flex items-start space-x-4">
                {/* Step Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-4 ring-emerald-50'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                <div className="flex-1 min-w-0 -mt-0.5">
                  <div className="flex items-center space-x-2">
                    <p
                      className={`text-sm font-bold ${
                        isCurrent
                          ? 'text-emerald-700'
                          : isCompleted
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulated Live Route Map View */}
      <div className="mt-6 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Bike className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Hyperlocal Route Simulator
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            GPS Live Signal Active
          </span>
        </div>

        {/* Vector SVG Stylized Map */}
        <div className="h-44 sm:h-52 bg-slate-950 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-800">
          {/* Stylized roads grid */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6ee7b7" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Curved route line */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 60 140 Q 200 40 460 80"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          </svg>

          {/* Shop Marker */}
          <div className="absolute left-10 sm:left-14 bottom-8 flex flex-col items-center">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg text-xs font-bold">
              <Store className="w-4 h-4" />
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-semibold max-w-[120px] truncate">
              {order.shopName}
            </span>
          </div>

          {/* Delivery Rider Marker (Moving / Animated) */}
          <div className="absolute left-1/2 top-14 -translate-x-1/2 flex flex-col items-center animate-bounce">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/50 ring-4 ring-emerald-400/30">
              <Bike className="w-5 h-5" />
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-200 text-[10px] font-bold">
              {order.deliveryPartnerName || 'Rider on Route'}
            </span>
          </div>

          {/* Customer Location Marker */}
          <div className="absolute right-10 sm:right-14 top-10 flex flex-col items-center">
            <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg text-xs font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-semibold max-w-[120px] truncate">
              {order.deliveryAddress.townOrVillage}
            </span>
          </div>
        </div>

        {/* Assigned Rider Info Card */}
        {order.deliveryPartnerName && (
          <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                🛵
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">
                  {order.deliveryPartnerName}
                </p>
                <p className="text-[11px] text-slate-500">
                  TownDrop Verified Rider • 4.8★
                </p>
              </div>
            </div>

            <a
              href={`tel:${order.deliveryPartnerMobile || '+919876544101'}`}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Rider</span>
            </a>
          </div>
        )}
      </div>

      {/* Order Summary & Items List */}
      <div className="mt-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          Order Summary ({order.items.length} items)
        </h3>

        <div className="divide-y divide-slate-100">
          {order.items.map(item => (
            <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-800">{item.quantity} ×</span>
                <span className="text-slate-700 font-medium">{item.product.name}</span>
              </div>
              <span className="font-bold text-slate-900">
                ₹{item.itemPrice * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Item Subtotal</span>
            <span>₹{order.itemTotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>₹{order.deliveryFee}</span>
          </div>
          {order.couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Coupon Discount ({order.appliedCouponCode})</span>
              <span>-₹{order.couponDiscount}</span>
            </div>
          )}
          <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-100">
            <span>Total Paid ({order.paymentMethod.toUpperCase()})</span>
            <span className="text-emerald-700">₹{order.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
