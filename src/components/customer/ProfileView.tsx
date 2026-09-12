import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  MapPin,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Phone,
  LogOut,
  Shield,
  X,
  UserCheck
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUserProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    setCustomerTab,
    setCurrentRole,
    settings,
    isCustomerLoggedIn,
    logoutCustomer,
    adminUser,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'addresses' | 'support'>('profile');

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState(user.email);
  const [mobileInput, setMobileInput] = useState(user.mobile);

  // New address state - User manually writes their address, NO select dropdown
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addrLabel, setAddrLabel] = useState<'Home' | 'Work' | 'Village Home' | 'Other'>('Home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrArea, setAddrArea] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrTownOrVillage, setAddrTownOrVillage] = useState('');

  // Support complaint state
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintMessage, setComplaintMessage] = useState('');
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: nameInput,
      email: emailInput,
      mobile: mobileInput,
    });
    setIsEditingProfile(false);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet.trim() || !addrTownOrVillage.trim()) return;

    addAddress({
      label: addrLabel,
      street: addrStreet.trim(),
      area: addrArea.trim() || addrTownOrVillage.trim(),
      landmark: addrLandmark.trim(),
      townOrVillage: addrTownOrVillage.trim(),
    });

    setAddrStreet('');
    setAddrArea('');
    setAddrLandmark('');
    setAddrTownOrVillage('');
    setShowAddAddressModal(false);
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintSubject.trim() || !complaintMessage.trim()) return;
    setComplaintSubmitted(true);
    setTimeout(() => {
      setComplaintSubject('');
      setComplaintMessage('');
      setComplaintSubmitted(false);
    }, 4000);
  };

  if (!isCustomerLoggedIn && !user.id) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">You are browsing as Guest</h2>
        <p className="text-xs text-slate-500 mt-1">
          Please sign in with your Gmail, Mobile Number and Password to access your personal account.
        </p>
        <button
          onClick={() => setCustomerTab('login')}
          className="mt-5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
        >
          Sign In to My Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 animate-in fade-in">
      {/* Top Profile Summary Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user.name}
            className="w-18 h-18 rounded-2xl object-cover border-2 border-white/80 shadow-md"
          />
          <div>
            <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 w-fit">
              <UserCheck className="w-3 h-3" />
              <span>Verified Customer</span>
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-1">
              {user.name || 'My Customer Account'}
            </h1>
            <p className="text-xs text-emerald-100 mt-0.5">
              {user.mobile || 'No mobile linked'} • {user.email || 'No Gmail linked'}
            </p>
          </div>
        </div>

        {/* Customer Logout button */}
        <button
          onClick={() => {
            logoutCustomer();
            setCustomerTab('login');
          }}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-2xl cursor-pointer border border-white/20 flex items-center space-x-2 text-xs font-bold text-white transition-colors self-end sm:self-center"
        >
          <LogOut className="w-4 h-4 text-emerald-200" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto mt-6 pb-2 no-scrollbar">
        {[
          { id: 'profile', label: 'My Account', icon: User },
          { id: 'addresses', label: `Saved Addresses (${user.addresses.length})`, icon: MapPin },
          { id: 'support', label: 'Help & Complaints', icon: HelpCircle },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile Details */}
      {activeSubTab === 'profile' && (
        <div className="mt-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Account Details
              </h2>
              <p className="text-[11px] text-slate-500">
                Only your personal profile and registered contact details are displayed
              </p>
            </div>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              {isEditingProfile ? 'Cancel' : 'Edit Details'}
            </button>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-emerald-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (mov no)
                </label>
                <input
                  type="tel"
                  value={mobileInput}
                  onChange={e => setMobileInput(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-emerald-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gmail / Email Address
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-emerald-500 font-semibold"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <span className="text-slate-400">Full Name:</span>
                <span className="font-bold text-slate-900">{user.name || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <span className="text-slate-400">Mobile Number:</span>
                <span className="font-bold text-slate-900">{user.mobile || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <span className="text-slate-400">Gmail / Email Address:</span>
                <span className="font-bold text-slate-900">{user.email || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <span className="text-slate-400">Target Area / Region:</span>
                <span className="font-bold text-slate-900">{settings.targetCity}</span>
              </div>
            </div>
          )}

          {/* Account session control */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Signed in securely as <strong className="text-slate-700">{user.name}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                logoutCustomer();
                setCustomerTab('login');
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Saved Addresses */}
      {activeSubTab === 'addresses' && (
        <div className="mt-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Saved Delivery Addresses
              </h2>
              <p className="text-[11px] text-slate-500">
                Write and save your home, work, or village addresses for 1-click delivery
              </p>
            </div>
            <button
              onClick={() => setShowAddAddressModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {user.addresses.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700">No saved addresses yet</p>
              <p className="text-slate-400 mt-0.5">Click &quot;Add New Address&quot; to write your address.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {user.addresses.map(addr => (
                <div
                  key={addr.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between ${
                    addr.isDefault
                      ? 'bg-emerald-50/50 border-emerald-400'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {addr.label}
                      </span>
                      {addr.isDefault ? (
                        <span className="text-[11px] font-bold text-emerald-800 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Default</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-[11px] font-bold text-slate-500 hover:text-emerald-700"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 mt-2">
                      {addr.townOrVillage}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {addr.street} {addr.area ? `, ${addr.area}` : ''}
                    </p>
                    {addr.landmark && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Landmark: {addr.landmark}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Help Center & Complaints */}
      {activeSubTab === 'support' && (
        <div className="mt-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
              Frequently Asked Questions (FAQ)
            </h2>

            <div className="space-y-3">
              {[
                {
                  q: 'Do you deliver to villages outside Rampur town?',
                  a: 'Yes! TownDrop delivers to Chandpur, Shampur, Jalalpur, Kishanpur and surrounding rural wards in 25-35 minutes using local dedicated riders.'
                },
                {
                  q: 'What are the delivery charges?',
                  a: 'Delivery starts at ₹20-25 for local town orders and is 100% FREE on all food and grocery orders above ₹299.'
                },
                {
                  q: 'Can I pay with Cash on Delivery (COD)?',
                  a: 'Yes, we accept Cash on Delivery, UPI (Google Pay, PhonePe, Paytm, QR Code), and Online NetBanking/Cards.'
                },
                {
                  q: 'How do I cancel an order or report an issue?',
                  a: 'You can cancel an order while it is in "Pending" status directly from the tracker. For issues with delivered food or groceries, submit the form below or message our helpline.'
                }
              ].map((faq, i) => (
                <details key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 group">
                  <summary className="font-bold text-xs sm:text-sm text-slate-900 cursor-pointer list-none flex justify-between items-center">
                    <span>{faq.q}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Report an Issue Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2">
              Report an Issue or Complaint
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Our local customer care desk reviews all complaints within 15 minutes.
            </p>

            {complaintSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Ticket registered! Our support team will call or message your mobile shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitComplaint} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Issue Subject
                  </label>
                  <input
                    type="text"
                    value={complaintSubject}
                    onChange={e => setComplaintSubject(e.target.value)}
                    placeholder="e.g. Missing item in Biryani order, Delayed delivery..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description & Order Details
                  </label>
                  <textarea
                    value={complaintMessage}
                    onChange={e => setComplaintMessage(e.target.value)}
                    rows={3}
                    placeholder="Provide order number or describe what went wrong..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                  >
                    Submit Complaint
                  </button>

                  <div className="flex items-center space-x-4 text-xs">
                    <a
                      href={`tel:${settings.supportPhone}`}
                      className="text-emerald-700 font-bold flex items-center space-x-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{settings.supportPhone}</span>
                    </a>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add Address Modal - NO select option, customer writes their address */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Write & Save Delivery Address
              </h3>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAddress} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Address Label
                </label>
                <div className="flex space-x-2">
                  {(['Home', 'Work', 'Village Home', 'Other'] as const).map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setAddrLabel(l)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        addrLabel === l
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* City / Town / Village - Written text input, NO select option */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City / Town / Village Name (Write here)
                </label>
                <input
                  type="text"
                  value={addrTownOrVillage}
                  onChange={e => setAddrTownOrVillage(e.target.value)}
                  placeholder="Write your Town or Village name (e.g. Rampur, Chandpur Village)"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  House / Flat / Building / Street Address
                </label>
                <input
                  type="text"
                  value={addrStreet}
                  onChange={e => setAddrStreet(e.target.value)}
                  placeholder="e.g. House 14, Ward 3, Near Old Water Tank"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-emerald-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Area / Locality / Mohalla
                </label>
                <input
                  type="text"
                  value={addrArea}
                  onChange={e => setAddrArea(e.target.value)}
                  placeholder="e.g. North Gram / Main Bazaar / Station Chowk"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Landmark (optional)
                </label>
                <input
                  type="text"
                  value={addrLandmark}
                  onChange={e => setAddrLandmark(e.target.value)}
                  placeholder="e.g. Opposite Government High School / Near Shiva Mandir"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
