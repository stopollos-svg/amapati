import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Grid, FileSpreadsheet, ShoppingCart, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setSelectedCategory,
    setSearchQuery,
    cartCount,
    setIsCartOpen,
    setIsRfqModalOpen,
    setIsAccountModalOpen,
  } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg">
      <div className="grid grid-cols-5 items-center justify-items-center text-[10px] font-medium text-slate-600 dark:text-slate-400">
        {/* Home */}
        <button
          onClick={() => {
            setCurrentView('storefront');
            setSelectedCategory(null);
            setSearchQuery('');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            currentView === 'storefront' ? 'text-orange-600 dark:text-orange-400 font-bold' : ''
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        {/* Categories */}
        <button
          onClick={() => {
            setCurrentView('storefront');
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 p-1.5 hover:text-orange-500 transition-colors"
        >
          <Grid className="w-5 h-5" />
          <span>Catalog</span>
        </button>

        {/* RFQ Center */}
        <button
          onClick={() => setIsRfqModalOpen(true)}
          className="flex flex-col items-center gap-1 p-1.5 text-orange-600 dark:text-orange-400 font-bold"
        >
          <div className="w-8 h-8 -mt-4 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <span>RFQ</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 p-1.5 hover:text-orange-500 transition-colors"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-orange-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        {/* Account */}
        <button
          onClick={() => setIsAccountModalOpen(true)}
          className="flex flex-col items-center gap-1 p-1.5 hover:text-orange-500 transition-colors"
        >
          <User className="w-5 h-5" />
          <span>Account</span>
        </button>
      </div>
    </div>
  );
};
