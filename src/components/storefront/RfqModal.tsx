import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, FileSpreadsheet, CheckCircle, Upload, ShieldCheck, Sparkles } from 'lucide-react';

export const RfqModal: React.FC = () => {
  const { isRfqModalOpen, setIsRfqModalOpen, submitInquiry, currentUser, categories } = useApp();

  const [productTitle, setProductTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Smart Phones & Tablets');
  const [targetQuantity, setTargetQuantity] = useState<number>(50);
  const [targetPrice, setTargetPrice] = useState<number>(250);
  const [message, setMessage] = useState('');
  const [companyName, setCompanyName] = useState(currentUser.companyName || '');
  const [fullName, setFullName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [submitted, setSubmitted] = useState(false);

  if (!isRfqModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiry({
      productTitle: `[RFQ] ${productTitle || category + ' Custom Spec'}`,
      customerName: fullName,
      customerEmail: email,
      companyName,
      targetQuantity,
      targetPrice,
      message: `Category: ${category}\nDetails: ${message}`,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsRfqModalOpen(false);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Request for Quotation (Bulk RFQ)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Receive 3 factory-direct competitive quotes with Trade Assurance
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRfqModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">RFQ Successfully Submitted!</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2">
              Our verified factory suppliers are preparing detailed pricing and lead times. Check your email or customer dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            {/* Product requirement */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Product Name or Custom Description *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 500x Rugged 5G Tablets with NFC & Barcode Scanner"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Category & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Quantity (Units) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Unit Price (USD)
                </label>
                <input
                  type="number"
                  min={1}
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            {/* Specs / Requirements Details */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Specifications & Packaging Requirements *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Include desired chipsets, certifications (CE/FCC), OEM private-label branding, destination port, or expected delivery timeline."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Buyer Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Tech Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-3 flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Covered by Amapati Trade Assurance
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all"
              >
                Submit RFQ to Suppliers
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
