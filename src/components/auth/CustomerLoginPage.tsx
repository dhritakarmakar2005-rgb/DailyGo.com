import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Phone,
  Mail,
  Lock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  ArrowLeft,
  User
} from 'lucide-react';

interface CustomerLoginPageProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialMode?: 'login' | 'register';
}

export const CustomerLoginPage: React.FC<CustomerLoginPageProps> = ({
  onSuccess,
  onCancel,
  initialMode = 'login',
}) => {
  const {
    loginCustomer,
    registerCustomer,
    setCustomerTab,
    settings,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state: Customer enters Gmail, Mobile number, and Password
  const [loginEmail, setLoginEmail] = useState('');
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  // Address is manually written by user - NO select dropdown
  const [regAddressStreet, setRegAddressStreet] = useState('');
  const [regAddressTown, setRegAddressTown] = useState('');

  // Status feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail.trim() && !loginMobile.trim()) {
      setErrorMsg('Please enter your Gmail and Mobile number');
      return;
    }
    if (!loginPassword.trim()) {
      setErrorMsg('Please enter your account password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = loginCustomer(loginEmail, loginMobile, loginPassword);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            setCustomerTab('home');
          }
        }, 500);
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Please enter your Gmail/Email address');
      return;
    }
    if (!regMobile.trim()) {
      setErrorMsg('Please enter your mobile number');
      return;
    }
    if (!regPassword.trim()) {
      setErrorMsg('Please choose a password for your account');
      return;
    }
    if (!regAddressStreet.trim() || !regAddressTown.trim()) {
      setErrorMsg('Please write your full delivery address and town/village name');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = registerCustomer({
        name: regName,
        email: regEmail,
        mobile: regMobile,
        password: regPassword,
        addressText: regAddressStreet,
        townOrVillage: regAddressTown,
      });

      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            setCustomerTab('home');
          }
        }, 600);
      } else {
        setErrorMsg(res.message);
      }
    }, 450);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in">
      <div className="max-w-md w-full mx-auto">
        {/* Top Back link */}
        <div className="flex items-center justify-between mb-4">
          <button
            id="customer-login-back-btn"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                setCustomerTab('home');
              }
            }}
            className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stores</span>
          </button>

          <button
            id="continue-as-guest-btn"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                setCustomerTab('home');
              }
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors"
          >
            Browse as Guest →
          </button>
        </div>

        {/* Card Header & Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/20 mb-3">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {mode === 'login' ? 'Customer Sign In' : 'Create Your Account'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {mode === 'login'
              ? 'Enter your Gmail, mobile number & password to access your account'
              : 'Sign up to place orders for fresh food, restaurants & groceries'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="bg-slate-200/70 p-1 rounded-2xl flex items-center mb-5">
          <button
            id="customer-tab-login-btn"
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'login'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            id="customer-tab-register-btn"
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'register'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Customer</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/80">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-bold">Check details</p>
                <p className="text-[11px] text-rose-700 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {/* MODE: SIGN IN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Gmail / Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Gmail / Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="customer-email-input"
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    required
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Mobile Number (mov no) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number (10 digits)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="customer-mobile-input"
                    type="tel"
                    value={loginMobile}
                    onChange={e => setLoginMobile(e.target.value)}
                    placeholder="+91 98765 00000"
                    required
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="customer-password-input"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                id="customer-login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to My Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="register-name-input"
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gmail / Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="register-email-input"
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (mov no)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="register-mobile-input"
                    type="tel"
                    value={regMobile}
                    onChange={e => setRegMobile(e.target.value)}
                    placeholder="+91 98765 00000"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="register-password-input"
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Create your account password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Delivery Address - Write your address, no select dropdown */}
              <div className="pt-1 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Delivery Address (Write full address)</span>
                </label>
                <input
                  id="register-street-input"
                  type="text"
                  value={regAddressStreet}
                  onChange={e => setRegAddressStreet(e.target.value)}
                  placeholder="House / Flat No., Street, Ward, or Locality"
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all font-semibold mb-2"
                />
                <input
                  id="register-town-input"
                  type="text"
                  value={regAddressTown}
                  onChange={e => setRegAddressTown(e.target.value)}
                  placeholder="Write City / Town / Village name"
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all font-semibold"
                />
              </div>

              <button
                id="register-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 mt-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account & Continue</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info banner */}
        <div className="mt-5 text-center text-slate-400 text-[11px] space-y-1">
          <p>🌾 Hyperlocal Delivery for Towns, Markets & Gram Panchayats</p>
          <p>Each customer only accesses their own verified account and order history.</p>
        </div>
      </div>
    </div>
  );
};
