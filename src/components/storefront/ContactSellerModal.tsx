import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, MessageSquare, CheckCircle, ShieldCheck, Send } from 'lucide-react';

export const ContactSellerModal: React.FC = () => {
  const {
    isContactSellerOpen,
    setIsContactSellerOpen,
    contactSellerProduct,
    submitInquiry,
    currentUser,
  } = useApp();

  const [message, setMessage] = useState('');
  const [targetQuantity, setTargetQuantity] = useState<number>(contactSellerProduct?.moq || 10);
  const [targetPrice, setTargetPrice] = useState<number>(contactSellerProduct?.basePrice || 100);
  const [fullName, setFullName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [companyName, setCompanyName] = useState(currentUser.companyName || '');
  const [sent, setSent] = useState(false);

  if (!isContactSellerOpen || !contactSellerProduct) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiry({
      productId: contactSellerProduct.id,
      productTitle: contactSellerProduct.title,
      productImage: contactSellerProduct.images[0],
      customerEmail: email,
      customerName: fullName,
      companyName,
      targetQuantity,
      targetPrice,
      message,
    });
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setIsContactSellerOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Contact Supplier / Inquiry
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                To: {contactSellerProduct.supplier.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsContactSellerOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Inquiry Dispatched!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              The vendor typically responds within 4–6 business hours. You can view responses in your Customer Account.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
            {/* Product summary strip */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center gap-3">
              <img
                src={contactSellerProduct.images[0]}
                alt=""
                className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                  {contactSellerProduct.title}
                </h5>
                <p className="text-[10px] text-slate-400">
                  MOQ: {contactSellerProduct.moq} units | {contactSellerProduct.supplier.country}
                </p>
              </div>
            </div>

            {/* Target Quantity & Target Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Quantity (Units) *
                </label>
                <input
                  type="number"
                  min={contactSellerProduct.moq}
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Price / Unit ($)
                </label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Message to Manufacturer *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Ask about sample units, lead times, custom labeling, or Incoterms (FOB/CIF)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Work Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Buyer Identity Protected
              </span>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
