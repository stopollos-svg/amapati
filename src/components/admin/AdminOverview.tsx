import React from 'react';
import { useApp, MAX_ACTIVE_EDITORS } from '../../context/AppContext';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
  Package,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const {
    products,
    orders,
    users,
    inquiries,
    activeEditorsCount,
    formatPrice,
    setActiveAdminTab,
  } = useApp();

  const totalSalesUSD = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const lowStockProducts = products.filter((p) => p.stock < 25);
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Gross Sourcing Sales
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {formatPrice(totalSalesUSD)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% volume this week</span>
          </div>
        </div>

        {/* Orders */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Wholesale Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {totalOrdersCount}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-orange-600 dark:text-orange-400 font-semibold">
            <span>{orders.filter((o) => o.status === 'processing').length} in processing queue</span>
          </div>
        </div>

        {/* Active Users & Editors */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Registered Accounts
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {users.length}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <strong className="text-orange-600 dark:text-orange-400">{activeEditorsCount} / {MAX_ACTIVE_EDITORS}</strong> Active Editors
          </div>
        </div>

        {/* Low-Stock Alerts */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Low-Stock Alerts
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-rose-600 dark:text-rose-400">
            {lowStockProducts.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Items under minimum warehouse buffer
          </div>
        </div>
      </div>

      {/* Grid: Low Stock Warnings & Recent Sourcing Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Items List */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Low-Stock Inventory Alerts</span>
            </h4>
            <button
              onClick={() => setActiveAdminTab('products')}
              className="text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Manage Stock</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-emerald-500 font-medium">
                All inventory levels are healthy!
              </div>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3 truncate">
                    <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="truncate">
                      <div className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                        {p.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-xs">
                      {p.stock} units left
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">MOQ: {p.moq}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Inquiries & Orders summary */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-500" />
              <span>Pending Inquiries & RFQs ({newInquiriesCount})</span>
            </h4>
            <button
              onClick={() => setActiveAdminTab('orders_inquiries')}
              className="text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {inquiries.slice(0, 4).map((inq) => (
              <div
                key={inq.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                    {inq.customerName} ({inq.companyName || inq.customerEmail})
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      inq.status === 'new'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>
                <p className="text-slate-500 line-clamp-1 italic text-[11px]">"{inq.message}"</p>
                <div className="text-[10px] text-slate-400">
                  Target Qty: {inq.targetQuantity || 'N/A'} units • Received {new Date(inq.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
