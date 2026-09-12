import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { downloadInvoiceFile, printInvoice } from '../../utils/invoiceGenerator';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Star,
  Download,
  ChevronRight,
  MapPin,
  X,
  FileText,
  Printer,
  Check
} from 'lucide-react';

export const OrderHistoryView: React.FC = () => {
  const {
    orders,
    user,
    addToCart,
    setCustomerTab,
    setTrackingOrderId,
    rateOrder,
    settings,
  } = useApp();

  const [selectedOrderForRating, setSelectedOrderForRating] = useState<Order | null>(null);
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const userMobileDigits = (user.mobile || '').replace(/\D/g, '');
  const myOrders = orders.filter(o => {
    if (!user.id && !user.mobile && !user.email) return false;
    if (o.customerId && user.id && o.customerId === user.id) return true;
    if (userMobileDigits && o.customerMobile) {
      const oDigits = o.customerMobile.replace(/\D/g, '');
      if (userMobileDigits.length >= 8 && (oDigits.includes(userMobileDigits) || userMobileDigits.includes(oDigits))) return true;
    }
    if (user.email && o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase()) {
      return true;
    }
    return false;
  });

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addToCart(item.product, item.selectedVariation?.id);
    });
    setCustomerTab('cart');
  };

  const submitRating = () => {
    if (!selectedOrderForRating) return;
    rateOrder(selectedOrderForRating.id, ratingVal, reviewText);
    setSelectedOrderForRating(null);
    setReviewText('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'preparing':
      case 'accepted':
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  if (myOrders.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Orders in Your Account</h2>
        <p className="text-xs text-slate-500 mt-1">
          When you place orders for delicious food or daily groceries with your account, they will appear here.
        </p>
        <button
          onClick={() => setCustomerTab('home')}
          className="mt-6 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          Start Ordering
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 animate-in fade-in">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Your Order History
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Past and active deliveries for {user.name || user.email || 'your account'}
        </p>
      </div>

      <div className="space-y-4 mt-6">
        {myOrders.map(order => (
          <div
            key={order.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
          >
            {/* Top row: Shop name, order number, status pill */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Order #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                  {order.shopName}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Items list */}
            <div className="py-3.5 space-y-1.5 text-xs text-slate-700">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    <strong className="text-slate-900">{item.quantity} ×</strong>{' '}
                    {item.product.name}
                  </span>
                  <span className="font-bold text-slate-900">
                    ₹{item.itemPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Total and actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-500">Total Paid ({order.paymentMethod.toUpperCase()}): </span>
                <strong className="text-sm font-black text-slate-900">
                  ₹{order.totalAmount}
                </strong>
                <span className="text-[11px] text-slate-400 block">
                  Delivered to: {order.deliveryAddress.townOrVillage}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Track live if not final */}
                {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                  <button
                    onClick={() => {
                      setTrackingOrderId(order.id);
                      setCustomerTab('tracking');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    Track Live 🛵
                  </button>
                )}

                {/* Reorder Button */}
                <button
                  onClick={() => handleReorder(order)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reorder</span>
                </button>

                {/* Invoice Button */}
                <button
                  onClick={() => setSelectedInvoiceOrder(order)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>

                {/* Rate Order Button */}
                {order.orderStatus === 'delivered' && !order.rating && (
                  <button
                    onClick={() => {
                      setSelectedOrderForRating(order);
                      setRatingVal(5);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center space-x-1"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Rate Experience</span>
                  </button>
                )}

                {order.rating && (
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Rated {order.rating}★</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rate Order Modal */}
      {selectedOrderForRating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Rate Order #{selectedOrderForRating.orderNumber}
              </h3>
              <button
                onClick={() => setSelectedOrderForRating(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 text-center">
              <p className="text-xs text-slate-500 mb-3">
                How was the food/items and delivery from {selectedOrderForRating.shopName}?
              </p>

              {/* Star rating picker */}
              <div className="flex justify-center space-x-2 my-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRatingVal(star)}
                    className="p-1.5 focus:outline-hidden hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= ratingVal
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Write a quick review for the shop and delivery rider..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex space-x-2">
              <button
                onClick={() => setSelectedOrderForRating(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal Simulation */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  TownDrop Tax Invoice
                </h3>
                <p className="text-[11px] text-slate-400">
                  Invoice Ref: INV-{selectedInvoiceOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Shop:</span>
                <strong className="text-slate-900">{selectedInvoiceOrder.shopName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="text-slate-900">{selectedInvoiceOrder.customerName} ({selectedInvoiceOrder.customerMobile})</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Address:</span>
                <span className="text-slate-900 text-right max-w-[240px]">
                  {selectedInvoiceOrder.deliveryAddress.street}, {selectedInvoiceOrder.deliveryAddress.townOrVillage}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="text-slate-900 uppercase font-bold">{selectedInvoiceOrder.paymentMethod}</span>
              </div>

              {/* Items */}
              <div className="pt-3 border-t border-slate-100">
                <p className="font-bold text-slate-900 mb-2">Billed Items:</p>
                {selectedInvoiceOrder.items.map(i => (
                  <div key={i.id} className="flex justify-between py-1">
                    <span>{i.quantity} × {i.product.name}</span>
                    <span>₹{i.itemPrice * i.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{selectedInvoiceOrder.itemTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>
                    {selectedInvoiceOrder.deliveryFee === 0 ? (
                      <strong className="text-emerald-600">FREE</strong>
                    ) : (
                      `₹${selectedInvoiceOrder.deliveryFee}`
                    )}
                  </span>
                </div>
                {selectedInvoiceOrder.couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount:</span>
                    <span>-₹{selectedInvoiceOrder.couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-100">
                  <span>Grand Total:</span>
                  <span className="text-emerald-700 font-black">₹{selectedInvoiceOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            {downloadSuccess && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center space-x-1.5 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Invoice downloaded successfully!</span>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  downloadInvoiceFile(selectedInvoiceOrder, settings.appName);
                  setDownloadSuccess(true);
                  setTimeout(() => setDownloadSuccess(false), 3000);
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-all active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>Download Invoice File</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  printInvoice(selectedInvoiceOrder, settings.appName);
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-all active:scale-98"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
