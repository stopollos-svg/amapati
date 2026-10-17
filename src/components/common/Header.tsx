import React, { useState } from 'react';
import { useApp, MAX_ACTIVE_EDITORS } from '../../context/AppContext';
import { CURRENCIES } from '../../data/mockData';
import { CurrencyCode, UserRole } from '../../types';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ShieldCheck,
  Moon,
  Sun,
  LayoutDashboard,
  ChevronDown,
  Globe,
  Sparkles,
  FileSpreadsheet,
  Check,
  Menu,
  X,
  ExternalLink,
  Crown,
  Edit3,
  UserCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    isDarkMode,
    toggleDarkMode,
    currency,
    setCurrency,
    currentUser,
    switchUserRole,
    activeEditorsCount,
    cartCount,
    cartTotal,
    formatPrice,
    favorites,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    currentView,
    setCurrentView,
    setIsCartOpen,
    setIsAuthModalOpen,
    setIsRfqModalOpen,
    setIsAccountModalOpen,
    settings,
  } = useApp();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentView !== 'storefront') {
      setCurrentView('storefront');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Top utility strip */}
      <div className="bg-slate-900 dark:bg-black text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-semibold uppercase tracking-wider text-[10px]">
              <Sparkles className="w-3 h-3 text-orange-400" />
              Verified Sourcing
            </span>
            <p className="truncate text-slate-300 text-xs">
              {settings.heroAnnouncement}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-xs">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                title="Select Currency"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">{currency} ({CURRENCIES[currency]?.symbol})</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isCurrencyMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-slate-800 dark:text-slate-200">
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Display Currency
                  </div>
                  {Object.values(CURRENCIES).map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code as CurrencyCode);
                        setIsCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-orange-50 dark:hover:bg-slate-700 ${
                        currency === curr.code ? 'font-bold text-orange-600 dark:text-orange-400' : ''
                      }`}
                    >
                      <span>{curr.label}</span>
                      {currency === curr.code && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-3 w-px bg-slate-700" />

            {/* Simulated Role Quick Switcher Badge */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
                title="Active Role Simulator (Click to switch)"
              >
                {currentUser.role === 'superuser' && <Crown className="w-3 h-3 text-amber-400" />}
                {currentUser.role === 'editor' && <Edit3 className="w-3 h-3 text-sky-400" />}
                {currentUser.role === 'customer' && <UserCheck className="w-3 h-3 text-emerald-400" />}
                <span className="capitalize font-semibold text-[11px]">
                  {currentUser.role === 'superuser' ? 'Superuser (stopollos)' : currentUser.role}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3 z-50 text-slate-800 dark:text-slate-200">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Simulate Applet Role
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 rounded font-semibold">
                      {activeEditorsCount}/{MAX_ACTIVE_EDITORS} Active Editors
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {/* Superuser option */}
                    <button
                      onClick={() => {
                        switchUserRole('superuser');
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-all flex items-start gap-2.5 ${
                        currentUser.role === 'superuser'
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Crown className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          Superuser (stopollos@gmail.com)
                          {currentUser.role === 'superuser' && <Check className="w-3 h-3 text-amber-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Full control: Invites, max 20 editors cap, audit log & settings.
                        </p>
                      </div>
                    </button>

                    {/* Editor option */}
                    <button
                      onClick={() => {
                        switchUserRole('editor');
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-all flex items-start gap-2.5 ${
                        currentUser.role === 'editor'
                          ? 'bg-sky-500/10 border border-sky-500/30 text-sky-900 dark:text-sky-200'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Edit3 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          Editor (sarah.editor@amapati.com)
                          {currentUser.role === 'editor' && <Check className="w-3 h-3 text-sky-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Catalog curation: Products, tiered prices, banners, inquiries.
                        </p>
                      </div>
                    </button>

                    {/* Customer option */}
                    <button
                      onClick={() => {
                        switchUserRole('customer');
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-all flex items-start gap-2.5 ${
                        currentUser.role === 'customer'
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          Customer (alex.buyer@techcorp.com)
                          {currentUser.role === 'customer' && <Check className="w-3 h-3 text-emerald-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          B2B Buyer: RFQ, wholesale cart, orders & inquiries.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setCurrentView('storefront');
              setSelectedCategory(null);
              setSearchQuery('');
            }}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-xl tracking-tighter">A</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Amapati<span className="text-orange-500">.com</span>
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide block -mt-1">
                Technology Marketplace
              </span>
            </div>
          </button>
        </div>

        {/* Global Search Bar with Category Dropdown */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-2xl items-center">
          <div className="relative flex w-full rounded-xl border-2 border-orange-500 bg-white dark:bg-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-orange-500/30 overflow-hidden">
            {/* Category Select Inside Search */}
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs px-3 py-2.5 border-r border-slate-200 dark:border-slate-700 outline-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <option value="">All Tech Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Keyword Input */}
            <input
              type="text"
              placeholder="Search wholesale servers, 5G devices, IoT sensors, robotics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-sm bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
            />

            {/* Search Submit Button */}
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 flex items-center justify-center transition-colors font-medium text-sm gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Right Action Icons & CTAs */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* RFQ Instant CTA */}
          <button
            onClick={() => setIsRfqModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Request a Quote</span>
          </button>

          {/* Admin / Editor Dashboard Button */}
          {(currentUser.role === 'superuser' || currentUser.role === 'editor') && (
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'storefront' : 'admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                currentView === 'admin'
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-orange-400'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden sm:inline">
                {currentView === 'admin' ? 'Exit Admin' : 'Admin Hub'}
              </span>
            </button>
          )}

          {/* Account Profile / Customer Modal */}
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-orange-500 transition-colors p-1.5 rounded-lg"
            title="My Account & Orders"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <div className="hidden xl:block text-left text-xs leading-tight">
              <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[110px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">{currentUser.role}</div>
            </div>
          </button>

          {/* Favorites */}
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors hidden sm:block"
            title="Favorites"
          >
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all"
            title="Open Wholesale Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline font-bold text-xs">
              {formatPrice(cartTotal)}
            </span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-orange-600 text-xs font-extrabold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Secondary Tech Navigation Bar */}
      <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto py-2 no-scrollbar gap-6">
          <div className="flex items-center gap-5 shrink-0 font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentView('storefront');
              }}
              className={`hover:text-orange-500 transition-colors whitespace-nowrap ${
                !selectedCategory && currentView === 'storefront' ? 'text-orange-600 dark:text-orange-400 font-bold' : ''
              }`}
            >
              All Categories
            </button>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentView('storefront');
                }}
                className={`hover:text-orange-500 transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id ? 'text-orange-600 dark:text-orange-400 font-bold' : ''
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 shrink-0 text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Trade Assurance
            </span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hover:text-orange-500 transition-colors"
            >
              Become an Editor
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
