import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileNav } from './components/common/MobileNav';
import { ProductListingPage } from './components/storefront/ProductListingPage';
import { ProductDetailPage } from './components/storefront/ProductDetailPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { CustomerAccountModal } from './components/customer/CustomerAccountModal';
import { AuthModal } from './components/auth/AuthModal';
import { RfqModal } from './components/storefront/RfqModal';
import { ContactSellerModal } from './components/storefront/ContactSellerModal';

const MarketplaceApp: React.FC = () => {
  const { currentView, setIsAuthModalOpen } = useApp();

  // Check URL hash for invite token e.g. #invite=amp_inv_...
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.includes('invite=')) {
        setIsAuthModalOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setIsAuthModalOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-16 md:pb-0">
      {/* Header */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'admin' ? (
          <AdminDashboard />
        ) : currentView === 'product_detail' ? (
          <ProductDetailPage />
        ) : (
          <ProductListingPage />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Modals & Slide-overs */}
      <CartDrawer />
      <CheckoutModal />
      <CustomerAccountModal />
      <AuthModal />
      <RfqModal />
      <ContactSellerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MarketplaceApp />
    </AppProvider>
  );
}
