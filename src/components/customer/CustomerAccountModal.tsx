import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Package,
  Heart,
  MessageSquare,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ExternalLink,
  ShoppingCart,
  Building
} from 'lucide-react';

export const CustomerAccountModal: React.FC = () => {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    currentUser,
    orders,
    favorites,
    products,
    inquiries,
    formatPrice,
    addToCart,
    openProductDetail,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'inquiries' | 'addresses'>('orders');

  if (!isAccountModalOpen) return null;

  const myOrders = orders.filter((o) => o.customerEmail.toLowerCase() === currentUser.email.toLowerCase());
  const myFavorites = products.filter((p) => favorites.includes(p.id));
  const myInquiries = inquiries.filter((i) => i.customerEmail.toLowerCase() === currentUser.email.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden max-h-[88vh] flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center overflow-hidden border border-orange-500/20">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{currentUser.name}</span>
                  <span className="capitalize px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-bold">
                    {currentUser.role}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {currentUser.email} • {currentUser.companyName || 'Enterprise Procurement'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAccountModalOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-4 mt-4 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'orders'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders ({myOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'favorites'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Favorites ({myFavorites.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'inquiries'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquiries & RFQs ({myInquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'addresses'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {/* TAB 1: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {myOrders.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  You haven't placed any wholesale orders yet.
                </div>
              ) : (
                myOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                          {order.orderNumber}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : order.status === 'shipped'
                              ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="font-black text-sm text-slate-900 dark:text-white">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>

                    {/* Items in order */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <img src={it.productImage} alt="" className="w-6 h-6 rounded object-cover" />
                            <span className="truncate max-w-[280px]">{it.productTitle}</span>
                            <span className="text-slate-400">x{it.quantity}</span>
                          </div>
                          <span className="font-semibold">{formatPrice(it.totalPrice)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tracking strip */}
                    {order.trackingNumber && (
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-orange-500" />
                          Tracking: <strong className="font-mono text-slate-700 dark:text-slate-300">{order.trackingNumber}</strong>
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          Trade Assurance Protected
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Favorites */}
          {activeTab === 'favorites' && (
            <div className="space-y-2">
              {myFavorites.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No saved hardware favorites yet. Click the heart icon on any product to save it.
                </div>
              ) : (
                myFavorites.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div
                      onClick={() => {
                        setIsAccountModalOpen(false);
                        openProductDetail(p.id);
                      }}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg" />
                      <div className="truncate">
                        <h5 className="font-bold text-slate-900 dark:text-white truncate">{p.title}</h5>
                        <p className="text-[11px] text-slate-400">MOQ: {p.moq} | {p.categoryName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-extrabold text-sm text-orange-600 dark:text-orange-400">
                        {formatPrice(p.basePrice)}
                      </span>
                      <button
                        onClick={() => addToCart(p, p.moq)}
                        className="px-3 py-1.5 rounded-lg bg-orange-500 text-white font-bold flex items-center gap-1 text-xs hover:bg-orange-600"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Inquiries & RFQs */}
          {activeTab === 'inquiries' && (
            <div className="space-y-3">
              {myInquiries.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No inquiries or RFQ tickets submitted yet.
                </div>
              ) : (
                myInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {inq.productTitle || 'General Sourcing RFQ'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inq.status === 'replied'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {inq.status === 'replied' ? 'Vendor Replied' : 'Pending Review'}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      "{inq.message}"
                    </p>

                    {inq.replyMessage && (
                      <div className="mt-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300 text-[11px] mb-1">
                          <span>Manufacturer / Editor Reply ({inq.repliedBy})</span>
                          <span className="text-[10px] font-normal text-slate-400">
                            {inq.repliedAt && new Date(inq.repliedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                          {inq.replyMessage}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-1">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>Default Corporate Logistics Address</span>
                  <span className="text-emerald-600 text-[10px]">Active</span>
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  {currentUser.name} • {currentUser.companyName || 'Corporate Procurement Office'}
                </div>
                <div className="text-slate-500">
                  450 Innovation Parkway, Suite 300, Austin, TX 78701, United States
                </div>
                <div className="text-slate-500">Phone: {currentUser.phone || '+1 (555) 891-2309'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => setIsAccountModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
          >
            Close Account Hub
          </button>
        </div>
      </div>
    </div>
  );
};
