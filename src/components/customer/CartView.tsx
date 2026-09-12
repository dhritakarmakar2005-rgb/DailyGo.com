import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAddress, PaymentMethod } from '../../types';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  MapPin,
  CheckCircle2,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  Percent,
  X,
  User,
  Phone,
  Mail,
  Edit3
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotals,
    user,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    placeOrder,
    setCustomerTab,
    selectedLocation,
    isCustomerLoggedIn,
    addAddress,
    checkAreaDelivering,
    deliveryZones,
    settings,
  } = useApp();

  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // 1. Auto-fill customer's name, gmail, and mobile number each time he orders
  const [customerName, setCustomerName] = useState(user.name || '');
  const [customerEmail, setCustomerEmail] = useState(user.email || '');
  const [customerMobile, setCustomerMobile] = useState(user.mobile || '');

  // 2. Only address is empty each time he puts it!
  // NO select dropdown - customer types/writes his address
  const [addressMode, setAddressMode] = useState<'write' | 'saved'>('write');
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryTown, setDeliveryTown] = useState('');
  const [deliveryLandmark, setDeliveryLandmark] = useState('');
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);

  // Fallback if choosing a saved address
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string>(
    user.addresses.find(a => a.isDefault)?.id || user.addresses[0]?.id || ''
  );

  const activeDeliveryArea = addressMode === 'write'
    ? deliveryTown.trim()
    : (user.addresses.find(a => a.id === selectedSavedAddressId)?.townOrVillage ||
       user.addresses.find(a => a.id === selectedSavedAddressId)?.area || '');

  const deliveryEligibility = activeDeliveryArea.length >= 2
    ? checkAreaDelivering(activeDeliveryArea)
    : null;

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('upi');
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [showCouponDrawer, setShowCouponDrawer] = useState(false);
  const [deliveryTip, setDeliveryTip] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleApplyCoupon = (code: string) => {
    const res = applyCoupon(code);
    if (res.success) {
      setCouponMessage({ text: res.message, isError: false });
      setShowCouponDrawer(false);
      setCouponCodeInput('');
    } else {
      setCouponMessage({ text: res.message, isError: true });
    }
  };

  const handlePlaceOrder = () => {
    setCheckoutError(null);

    if (!isCustomerLoggedIn) {
      setCheckoutError('Please sign in with your Gmail, Mobile & Password to place your order.');
      setTimeout(() => {
        setCustomerTab('login');
      }, 1200);
      return;
    }

    if (!customerName.trim()) {
      setCheckoutError('Please enter your full name');
      return;
    }

    if (!customerMobile.trim() || customerMobile.trim().length < 8) {
      setCheckoutError('Please enter a valid 10-digit mobile number');
      return;
    }

    let finalAddress: UserAddress;

    if (addressMode === 'write') {
      if (!deliveryStreet.trim() || !deliveryTown.trim()) {
        setCheckoutError('Please write your delivery address and Town/Village name.');
        return;
      }

      finalAddress = {
        id: 'addr_' + Date.now(),
        label: 'Home',
        street: deliveryStreet.trim(),
        area: deliveryTown.trim(),
        landmark: deliveryLandmark.trim(),
        townOrVillage: deliveryTown.trim(),
        isDefault: true,
      };

      if (saveAddressToProfile) {
        addAddress({
          label: 'Home',
          street: deliveryStreet.trim(),
          area: deliveryTown.trim(),
          landmark: deliveryLandmark.trim(),
          townOrVillage: deliveryTown.trim(),
        });
      }
    } else {
      const found = user.addresses.find(a => a.id === selectedSavedAddressId) || user.addresses[0];
      if (!found) {
        setCheckoutError('Please write or select a delivery address.');
        return;
      }
      finalAddress = found;
    }

    // Strict validation: Check whether Admin allows deliveries to this town/village
    const destinationArea = addressMode === 'write' ? deliveryTown : (finalAddress.townOrVillage || finalAddress.area || finalAddress.street);
    const areaCheck = checkAreaDelivering(destinationArea);
    if (!areaCheck.allowed) {
      setCheckoutError(`Cannot deliver to ${destinationArea}: ${areaCheck.reason}`);
      return;
    }

    setIsSubmitting(true);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      placeOrder(
        selectedPayment,
        finalAddress,
        deliveryInstructions,
        {
          name: customerName.trim(),
          mobile: customerMobile.trim(),
          email: customerEmail.trim(),
        }
      );
      setIsSubmitting(false);
    }, 600);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center animate-in fade-in">
        <div className="w-24 h-24 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
          Explore delicious meals from local restaurants or order daily fresh groceries and essentials.
        </p>
        <button
          id="empty-cart-browse-btn"
          onClick={() => setCustomerTab('home')}
          className="mt-6 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
        >
          Explore Food & Groceries
        </button>
      </div>
    );
  }

  const grandTotalWithTip = cartTotals.grandTotal + deliveryTip;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 animate-in fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Order Checkout
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Delivering to {selectedLocation}
          </p>
        </div>
        <button
          id="clear-cart-btn"
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Cart Items + Customer Info + Address + Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cart Items List */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Items in Order ({cart.length})</span>
              <span className="text-xs font-semibold text-emerald-700">
                {cart[0]?.product.shopName}
              </span>
            </h2>

            <div className="divide-y divide-slate-100">
              {cart.map(item => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <span
                      className={`w-3.5 h-3.5 rounded-xs border shrink-0 flex items-center justify-center ${
                        item.product.isVeg ? 'border-emerald-600' : 'border-rose-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.product.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {item.product.name}
                      </p>
                      {item.selectedVariation && (
                        <p className="text-[11px] text-slate-500">
                          {item.selectedVariation.name}
                        </p>
                      )}
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <p className="text-[10px] text-emerald-700">
                          + {item.selectedAddOns.map(a => a.name).join(', ')}
                        </p>
                      )}
                      <p className="text-xs font-bold text-slate-800 mt-0.5">
                        ₹{item.itemPrice} × {item.quantity} = ₹{item.itemPrice * item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
                    <button
                      id={`cart-decrease-${item.id}`}
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center shadow-xs hover:bg-slate-50"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      id={`cart-increase-${item.id}`}
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center shadow-xs hover:bg-slate-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Instruction text */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <input
                type="text"
                id="cart-delivery-instructions-input"
                value={deliveryInstructions}
                onChange={e => setDeliveryInstructions(e.target.value)}
                placeholder="Add cooking or delivery note (e.g., Near school, call when arriving)..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Customer Details Section (Auto-filled from account) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Customer Contact Details</span>
            </h2>
            <p className="text-[11px] text-slate-500 mb-3">
              Auto-filled from your registered account.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="checkout-customer-name"
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (mov no)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="checkout-customer-mobile"
                    type="tel"
                    value={customerMobile}
                    onChange={e => setCustomerMobile(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gmail / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="checkout-customer-email"
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address Section (Empty by default for user to write, NO select option) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Delivery Address</span>
              </h2>

              {user.addresses && user.addresses.length > 0 && (
                <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setAddressMode('write')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      addressMode === 'write'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Write Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressMode('saved')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      addressMode === 'saved'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Saved ({user.addresses.length})
                  </button>
                </div>
              )}
            </div>

            {addressMode === 'write' ? (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-500">
                  Write your delivery address below. No hardcoded select list.
                </p>

                {/* Town or Village Name - Text input with real-time validation */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      City / Town / Village Name (Write here)
                    </label>
                    <span className="text-[10px] text-emerald-800 font-semibold">
                      Harishchandrapur & Neighboring Villages
                    </span>
                  </div>
                  <input
                    id="checkout-address-town"
                    type="text"
                    value={deliveryTown}
                    onChange={e => {
                      setDeliveryTown(e.target.value);
                      if (checkoutError) setCheckoutError(null);
                    }}
                    placeholder="e.g. Harishchandrapur, Barduary, Kushida, Bhaluka, Tulshihata..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                    required
                  />

                  {/* Quick Active Village Tag Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-400 font-bold">Quick Select:</span>
                    {deliveryZones.filter(z => z.isDelivering).slice(0, 5).map(z => (
                      <button
                        key={z.id}
                        type="button"
                        onClick={() => {
                          setDeliveryTown(z.name);
                          if (checkoutError) setCheckoutError(null);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors cursor-pointer"
                      >
                        {z.name.split(' - ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Real-time Zone Eligibility Feedback */}
                  {deliveryEligibility && (
                    <div className={`mt-2.5 p-2.5 rounded-xl text-xs flex items-start space-x-2 animate-in fade-in ${
                      deliveryEligibility.allowed
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      <span className="text-sm shrink-0">
                        {deliveryEligibility.allowed ? '✓' : '⚠️'}
                      </span>
                      <div>
                        {deliveryEligibility.allowed ? (
                          <>
                            <p className="font-extrabold text-[11px]">
                              Delivering to {deliveryEligibility.zone ? deliveryEligibility.zone.name : deliveryTown}!
                            </p>
                            <p className="text-[10px] text-emerald-700 mt-0.5">
                              Estimated Arrival: {deliveryEligibility.zone?.estimatedDeliveryMins || '15-25 mins'}
                              {deliveryEligibility.zone?.deliveryFeeSurcharge ? ` • +₹${deliveryEligibility.zone.deliveryFeeSurcharge} village transit fee` : ''}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-extrabold text-[11px]">Delivery Paused / Unavailable</p>
                            <p className="text-[10px] text-rose-700 mt-0.5">
                              {deliveryEligibility.reason}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Street / House / Building address - Text input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    House / Flat / Building / Street Address
                  </label>
                  <input
                    id="checkout-address-street"
                    type="text"
                    value={deliveryStreet}
                    onChange={e => setDeliveryStreet(e.target.value)}
                    placeholder="House No., Ward, Lane, or Building name"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Landmark / Locality (optional)
                  </label>
                  <input
                    id="checkout-address-landmark"
                    type="text"
                    value={deliveryLandmark}
                    onChange={e => setDeliveryLandmark(e.target.value)}
                    placeholder="e.g. Near Government School / Near Kali Mandir / Main Market"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="pt-1 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="save-address-check"
                    checked={saveAddressToProfile}
                    onChange={e => setSaveAddressToProfile(e.target.checked)}
                    className="w-4 h-4 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <label htmlFor="save-address-check" className="text-xs text-slate-600 font-medium cursor-pointer">
                    Save this address to my account for future orders
                  </label>
                </div>
              </div>
            ) : (
              /* Saved addresses picker if customer wants to reuse an existing one */
              <div className="space-y-2.5">
                {user.addresses.map(addr => {
                  const isSelected = addr.id === selectedSavedAddressId;
                  return (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => setSelectedSavedAddressId(addr.id)}
                      className={`w-full p-3.5 rounded-2xl flex items-start justify-between text-left transition-all border ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-400 text-slate-900 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-xs px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-800">
                              {addr.label}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {addr.townOrVillage}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            {addr.street} {addr.area ? `, ${addr.area}` : ''}
                          </p>
                          {addr.landmark && (
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Landmark: {addr.landmark}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3">
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* UPI */}
              <button
                id="select-payment-upi-btn"
                type="button"
                onClick={() => setSelectedPayment('upi')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center text-center transition-all ${
                  selectedPayment === 'upi'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Smartphone className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-xs font-bold">UPI / QR Code</span>
                <span className="text-[10px] text-slate-500">
                  GPay, PhonePe, Paytm
                </span>
              </button>

              {/* Cash on Delivery */}
              <button
                id="select-payment-cod-btn"
                type="button"
                onClick={() => setSelectedPayment('cod')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center text-center transition-all ${
                  selectedPayment === 'cod'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Banknote className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-xs font-bold">Cash on Delivery</span>
                <span className="text-[10px] text-slate-500">Pay cash at doorstep</span>
              </button>

              {/* Online Payment */}
              <button
                id="select-payment-online-btn"
                type="button"
                onClick={() => setSelectedPayment('online')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center text-center transition-all ${
                  selectedPayment === 'online'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-xs font-bold">Online Card/NetBanking</span>
                <span className="text-[10px] text-slate-500">All banks & cards</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Coupons & Bill Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Percent className="w-4 h-4 text-emerald-600" />
                <span>Offers & Coupons</span>
              </span>
              <button
                id="view-all-coupons-btn"
                type="button"
                onClick={() => setShowCouponDrawer(true)}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                View All
              </button>
            </div>

            {appliedCoupon ? (
              <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                    %
                  </div>
                  <div>
                    <span className="font-black text-xs text-emerald-950">
                      {appliedCoupon.code} APPLIED
                    </span>
                    <p className="text-[11px] text-emerald-800">
                      You save ₹{cartTotals.couponDiscount} on this order!
                    </p>
                  </div>
                </div>
                <button
                  id="remove-applied-coupon-btn"
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    id="coupon-code-input"
                    value={couponCodeInput}
                    onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 uppercase font-bold focus:outline-hidden focus:border-emerald-500 bg-slate-50"
                  />
                  <button
                    id="apply-coupon-btn"
                    type="button"
                    onClick={() => handleApplyCoupon(couponCodeInput)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`text-[11px] mt-2 font-medium ${
                      couponMessage.isError ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Delivery Rider Tip Section */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                🛵 Tip Local Village/Town Rider
              </span>
              <span className="text-[11px] text-slate-400">100% goes to rider</span>
            </div>
            <div className="flex items-center space-x-2">
              {[0, 10, 20, 30, 50].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDeliveryTip(amt)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    deliveryTip === amt
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {amt === 0 ? 'None' : `₹${amt}`}
                </button>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Bill Details
            </h2>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ₹{cartTotals.subtotal}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                {cartTotals.deliveryFee === 0 ? (
                  <span className="font-bold text-emerald-700">FREE</span>
                ) : (
                  <span className="font-semibold text-slate-900">
                    ₹{cartTotals.deliveryFee}
                  </span>
                )}
              </div>

              {cartTotals.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{cartTotals.couponDiscount}</span>
                </div>
              )}

              {deliveryTip > 0 && (
                <div className="flex justify-between text-slate-800 font-semibold">
                  <span>Rider Tip</span>
                  <span>+₹{deliveryTip}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between text-slate-900">
              <div>
                <span className="text-sm font-black uppercase">To Pay</span>
                <p className="text-[10px] text-slate-400">Inclusive of all taxes</p>
              </div>
              <span className="text-xl sm:text-2xl font-black text-emerald-700">
                ₹{grandTotalWithTip}
              </span>
            </div>

            {/* Checkout Validation Error */}
            {checkoutError && (
              <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in fade-in flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}

            {/* Place Order CTA */}
            <button
              id="confirm-place-order-btn"
              type="button"
              disabled={isSubmitting || Boolean(deliveryEligibility && !deliveryEligibility.allowed)}
              onClick={handlePlaceOrder}
              className={`w-full mt-4 py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center space-x-2 transition-all ${
                deliveryEligibility && !deliveryEligibility.allowed
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer'
              }`}
            >
              <span>
                {isSubmitting
                  ? 'Placing Order...'
                  : deliveryEligibility && !deliveryEligibility.allowed
                  ? 'Delivery Unavailable in this Area'
                  : 'Place Order Now'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Safe & Contactless Hyperlocal Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Coupons Drawer/Modal */}
      {showCouponDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Available Offers & Coupons</h3>
              </div>
              <button
                id="close-coupon-drawer-btn"
                type="button"
                onClick={() => setShowCouponDrawer(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto mt-4 pr-1 flex-1">
              {coupons.filter(c => c.isActive).map(coupon => {
                const isApplicable = cartTotals.subtotal >= coupon.minimumOrder;
                return (
                  <div
                    key={coupon.id}
                    className="border border-dashed border-emerald-300 rounded-2xl p-4 bg-emerald-50/40 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-700 text-white font-black text-xs tracking-wider">
                          {coupon.code}
                        </div>
                        <h4 className="font-extrabold text-xs text-slate-900 mt-2">
                          {coupon.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {coupon.description}
                        </p>
                      </div>

                      <button
                        id={`apply-drawer-coupon-${coupon.code}`}
                        type="button"
                        disabled={!isApplicable}
                        onClick={() => handleApplyCoupon(coupon.code)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                          isApplicable
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Apply
                      </button>
                    </div>

                    <div className="mt-3 pt-2 border-t border-emerald-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Min Order: ₹{coupon.minimumOrder}</span>
                      <span>Valid till: {coupon.validTill}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
