import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, Inquiry } from '../../types';
import {
  Package,
  MessageSquare,
  Truck,
  CheckCircle,
  Clock,
  Send,
  Eye,
  X,
  ShieldCheck
} from 'lucide-react';

export const AdminOrdersInquiries: React.FC = () => {
  const { orders, updateOrderStatus, inquiries, replyInquiry, formatPrice } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'inquiries'>('orders');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter((o) => (statusFilter === 'all' ? true : o.status === statusFilter));

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !replyText.trim()) return;
    replyInquiry(selectedInquiry.id, replyText);
    setSelectedInquiry(null);
    setReplyText('');
  };

  return (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'orders'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders Management ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('inquiries')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'inquiries'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Buyer Inquiries & RFQs ({inquiries.length})</span>
          </button>
        </div>

        {activeSubTab === 'orders' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        )}
      </div>

      {/* ORDERS TAB */}
      {activeSubTab === 'orders' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order / Customer</th>
                  <th className="py-3 px-3">Items & Quantity</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {ord.orderNumber}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {ord.customerName} ({ord.customerEmail})
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[200px]">
                        {ord.items[0]?.productTitle}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {ord.items.reduce((s, i) => s + i.quantity, 0)} units total
                      </div>
                    </td>

                    <td className="py-3 px-3 font-extrabold text-orange-600 dark:text-orange-400">
                      {formatPrice(ord.total)}
                    </td>

                    <td className="py-3 px-3">
                      <span className="capitalize text-[11px] text-slate-600 dark:text-slate-300">
                        {ord.paymentMethod.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : ord.status === 'shipped'
                            ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INQUIRIES TAB */}
      {activeSubTab === 'inquiries' && (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-sm space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {inq.productTitle || 'General RFQ'}
                  </h4>
                  <div className="text-[11px] text-slate-500">
                    From: <strong>{inq.customerName}</strong> ({inq.customerEmail}) • {inq.companyName || 'Buyer Corp'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      inq.status === 'replied'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {inq.status}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedInquiry(inq);
                      setReplyText(inq.replyMessage || '');
                    }}
                    className="px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
                  >
                    {inq.status === 'replied' ? 'Edit Reply' : 'Reply to Buyer'}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                "{inq.message}"
              </div>

              {inq.replyMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                  <div className="font-bold text-[11px] mb-1">
                    Sent Reply by {inq.repliedBy}:
                  </div>
                  <div>{inq.replyMessage}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Respond to Inquiry / RFQ
              </h3>
              <button onClick={() => setSelectedInquiry(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSendReply} className="mt-3 space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px]">
                <div><strong>Inquiry:</strong> {selectedInquiry.productTitle}</div>
                <div><strong>From:</strong> {selectedInquiry.customerName} ({selectedInquiry.customerEmail})</div>
              </div>

              <div>
                <label className="block font-bold mb-1">Official Response / Quotation *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide MOQ confirmation, volume discount offer, factory lead time, and shipping terms..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 rounded-xl border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
