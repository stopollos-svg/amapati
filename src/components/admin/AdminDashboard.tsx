import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminCategoriesBanners } from './AdminCategoriesBanners';
import { AdminOrdersInquiries } from './AdminOrdersInquiries';
import { AdminUsers } from './AdminUsers';
import { AdminAuditLog } from './AdminAuditLog';
import { AdminSettings } from './AdminSettings';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  History,
  Settings,
  ArrowLeft,
  ShieldAlert,
  Crown,
  Edit3
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    activeAdminTab,
    setActiveAdminTab,
    setCurrentView,
    setIsAuthModalOpen,
    activeEditorsCount,
  } = useApp();

  const isSuperuser = currentUser.role === 'superuser';
  const isEditor = currentUser.role === 'editor';
  const isAuthorized = isSuperuser || isEditor;

  if (!isAuthorized) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          Protected Administrative Route (/admin)
        </h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          You are currently signed in as a <strong>Customer</strong> ({currentUser.email}). Only the Superuser (<strong>stopollos@gmail.com</strong>) and invited Editors can access the management panel.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => setCurrentView('storefront')}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
          >
            Return to Storefront
          </button>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-5 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-md"
          >
            Request Editor Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={() => setCurrentView('storefront')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500 mb-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Marketplace</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isSuperuser ? 'Superuser Control Center' : 'Editor Management Portal'}
            </h1>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-extrabold flex items-center gap-1 ${
                isSuperuser
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                  : 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300'
              }`}
            >
              {isSuperuser ? <Crown className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              <span>{currentUser.role.toUpperCase()}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Signed in as <strong>{currentUser.email}</strong> • Real-time catalog & procurement operations
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-slate-200 dark:border-slate-800 text-xs font-bold no-scrollbar">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeAdminTab === 'overview'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('products')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeAdminTab === 'products'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products & Bulk CSV</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('categories')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeAdminTab === 'categories'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories & Banners</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('orders_inquiries')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeAdminTab === 'orders_inquiries'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders & RFQ Inquiries</span>
        </button>

        {/* Superuser Only Tabs */}
        {isSuperuser && (
          <>
            <button
              onClick={() => setActiveAdminTab('users')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeAdminTab === 'users'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Editors & Users ({activeEditorsCount}/20)</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('audit')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeAdminTab === 'audit'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Audit Log</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('settings')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeAdminTab === 'settings'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings & Supabase RLS</span>
            </button>
          </>
        )}
      </div>

      {/* Main Tab View */}
      <div className="py-6">
        {activeAdminTab === 'overview' && <AdminOverview />}
        {activeAdminTab === 'products' && <AdminProducts />}
        {activeAdminTab === 'categories' && <AdminCategoriesBanners />}
        {activeAdminTab === 'orders_inquiries' && <AdminOrdersInquiries />}
        {isSuperuser && activeAdminTab === 'users' && <AdminUsers />}
        {isSuperuser && activeAdminTab === 'audit' && <AdminAuditLog />}
        {isSuperuser && activeAdminTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
};
