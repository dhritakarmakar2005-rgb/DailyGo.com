import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/customer/BottomNav';
import { CustomerHome } from './components/customer/CustomerHome';
import { ShopDetailView } from './components/customer/ShopDetailView';
import { SearchView } from './components/customer/SearchView';
import { CategoriesView } from './components/customer/CategoriesView';
import { CartView } from './components/customer/CartView';
import { OrderTrackingView } from './components/customer/OrderTrackingView';
import { OrderHistoryView } from './components/customer/OrderHistoryView';
import { ProfileView } from './components/customer/ProfileView';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { CustomerLoginPage } from './components/auth/CustomerLoginPage';

// Admin components
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminShops } from './components/admin/AdminShops';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminDelivery } from './components/admin/AdminDelivery';
import { AdminPromotions } from './components/admin/AdminPromotions';
import { AdminReports } from './components/admin/AdminReports';
import { AdminSettings } from './components/admin/AdminSettings';
import { PortalGateway } from './components/auth/PortalGateway';

const MainContent: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    activePortal,
    setActivePortal,
    customerTab,
    setCustomerTab,
    adminTab,
    isAdminLoggedIn,
    activeAuthModal,
    setActiveAuthModal,
  } = useApp();

  // Admin portal entry listener (Ctrl+Shift+A hotkey or #admin in URL)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Hotkey: Ctrl+Shift+A or Alt+Shift+A or Cmd+Shift+A
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActivePortal('admin');
        setCurrentRole('admin');
      }
    };

    const handleHashChange = () => {
      if (window.location.hash.includes('admin')) {
        setActivePortal('admin');
        setCurrentRole('admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [setActivePortal, setCurrentRole]);

  // Admin Section: Guarded by Single Master Administrator Authentication
  if (activePortal === 'admin' || currentRole === 'admin') {
    if (!isAdminLoggedIn) {
      return (
        <AdminLoginPage
          onSuccess={() => {}}
          onCancel={() => {
            setActivePortal('customer');
            setCurrentRole('customer');
          }}
        />
      );
    }

    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col lg:flex-row">
          <AdminSidebar />
          <main className="flex-1 bg-slate-100 min-h-[calc(100vh-65px)] overflow-y-auto">
            {adminTab === 'dashboard' && <AdminDashboard />}
            {adminTab === 'orders' && <AdminOrders />}
            {adminTab === 'shops' && <AdminShops />}
            {adminTab === 'products' && <AdminProducts />}
            {adminTab === 'delivery' && <AdminDelivery />}
            {adminTab === 'promotions' && <AdminPromotions />}
            {adminTab === 'reports' && <AdminReports />}
            {adminTab === 'settings' && <AdminSettings />}
          </main>
        </div>
      </div>
    );
  }

  // Customer role
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {customerTab === 'login' && (
          <CustomerLoginPage
            onSuccess={() => setCustomerTab('home')}
            onCancel={() => setCustomerTab('home')}
          />
        )}
        {customerTab === 'home' && <CustomerHome />}
        {customerTab === 'shop_detail' && <ShopDetailView />}
        {customerTab === 'search' && <SearchView />}
        {customerTab === 'categories' && <CategoriesView />}
        {customerTab === 'cart' && <CartView />}
        {customerTab === 'tracking' && <OrderTrackingView />}
        {customerTab === 'orders' && <OrderHistoryView />}
        {customerTab === 'profile' && <ProfileView />}
      </main>
      <BottomNav />

      {/* Global Auth Modals if triggered from anywhere */}
      {activeAuthModal === 'customer' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <CustomerLoginPage
              onSuccess={() => setActiveAuthModal('none')}
              onCancel={() => setActiveAuthModal('none')}
            />
          </div>
        </div>
      )}

      {activeAuthModal === 'admin' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950">
          <AdminLoginPage
            onSuccess={() => {
              setActiveAuthModal('none');
              setCurrentRole('admin');
            }}
            onCancel={() => setActiveAuthModal('none')}
          />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
