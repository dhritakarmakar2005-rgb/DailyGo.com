import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Server,
  HelpCircle,
  X
} from 'lucide-react';

interface AdminLoginPageProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onCancel }) => {
  const { loginAdmin, setCurrentRole, adminUser, adminCount } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // Attempt to create another admin feedback
  const [showForbiddenModal, setShowForbiddenModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginAdmin(identifier, password);
      setIsLoading(false);

      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          setCurrentRole('admin');
          if (onSuccess) onSuccess();
        }, 400);
      } else {
        setErrorMsg(res.message);
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Ambient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Navigation */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between">
        <button
          id="admin-login-back-btn"
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else {
              setCurrentRole('customer');
            }
          }}
          className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 px-3.5 py-2 rounded-xl border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customer App</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5" />
            SINGLE ADMIN AUTHORITY (1/1)
          </span>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="relative z-10 max-w-md w-full mx-auto my-auto pt-6 pb-10">
        {/* Brand Icon Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-500/25 mb-3 border border-emerald-400/30">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Admin Master Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Centralized Command Hub for Orders, Merchants, Delivery Fleet & Rural Operations
          </p>
        </div>

        {/* Policy Notice Callout */}
        <div className="mb-5 bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-3.5 shadow-lg backdrop-blur-md">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300">Single Administrator Constraint</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {adminCount} Authorized
                </span>
              </div>
              <p className="text-slate-400 mt-0.5 text-[11px] leading-relaxed">
                TownDrop enforces strictly <strong>1 Master Administrator</strong>. Secondary admin registration is permanently locked.
              </p>
              <button
                type="button"
                onClick={() => setShowPolicyModal(true)}
                className="mt-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 flex items-center space-x-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Why is admin restricted to only 1?</span>
              </button>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Failed</p>
                <p className="text-[11px] mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Master Admin Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email-input"
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="admin@towndrop.in, ankit, or admin"
                  required
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Master Credentials...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Authenticate as Master Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Attempt to Register 2nd Admin Button -> Triggers explicit policy rejection */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setShowForbiddenModal(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-colors flex items-center justify-center space-x-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Create New Admin Account (Test 1-Admin Guard)</span>
            </button>
          </div>
        </div>

        {/* Single Admin Verification Badge footer */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-[11px] text-slate-500">
          <Server className="w-3.5 h-3.5 text-emerald-500" />
          <span>Master Server: Rampur Hub Cluster</span>
          <span>•</span>
          <span>Role: Super Admin (1 of 1)</span>
        </div>
      </div>

      {/* Policy Modal: Why Only 1 Admin? */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Single Admin Architectural Rule</h3>
              </div>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <p className="font-bold text-emerald-400 mb-1">
                  1. Zero Conflict Fleet & Commission Authority
                </p>
                <p className="text-slate-400">
                  In regional towns and surrounding village networks, grocery Mandi rates and rider incentives require unified, non-conflicting single leadership.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <p className="font-bold text-emerald-400 mb-1">
                  2. Authorized Master Admin
                </p>
                <p className="text-slate-400">
                  Currently assigned to <strong>{adminUser.name}</strong> ({adminUser.email}). No other person can override or register a secondary admin account.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <p className="font-bold text-emerald-400 mb-1">
                  3. Full Security Isolation
                </p>
                <p className="text-slate-400">
                  Customer and merchant accounts are isolated from the admin core, ensuring zero privilege escalation.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPolicyModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Forbidden Second Admin Modal */}
      {showForbiddenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl text-slate-200">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Action Denied: Policy Enforced</h3>
                <p className="text-xs text-rose-400 font-medium">Single Administrator Limit Reached (1/1)</p>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                TownDrop has an architectural constraint configured: <strong>admin should be only 1</strong>.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400">
                Current Registered Admin: <span className="text-emerald-400">{adminUser.name} ({adminUser.email})</span><br />
                System Status: <span className="text-rose-400">NEW_ADMIN_REGISTRATION_DISABLED</span><br />
                Allowed Total: <span className="text-amber-400">1</span>
              </div>
              <p className="text-slate-400">
                To access the admin dashboard, please authenticate using the credentials of the 1 registered Master Admin.
              </p>
            </div>

            <div className="mt-5">
              <button
                onClick={() => setShowForbiddenModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer copyright */}
      <div className="relative z-10 text-center text-slate-500 text-xs">
        TownDrop Hyperlocal Delivery Operating System • Master Authority
      </div>
    </div>
  );
};
