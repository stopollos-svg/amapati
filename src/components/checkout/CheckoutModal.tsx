import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShippingAddress } from '../../types';
import {
  X,
  CheckCircle,
  Truck,
  CreditCard,
  ShieldCheck,
  Building,
  Smartphone,
  Landmark,
  ArrowRight,
  ArrowLeft,
  PackageCheck
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    formatPrice,
    placeOrder,
    currentUser,
    settings,
    setIsAccountModalOpen,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: currentUser.name || 'Alex Rivera',
    companyName: currentUser.companyName || 'Rivera Systems Ltd',
    phone: currentUser.phone || '+1 (555) 891-2309',
    addressLine1: '450 Innovation Parkway, Suite 300',
    city: 'Austin',
    stateOrRegion: 'TX',
    country: 'United States',
    postalCode: '78701',
  });

  const [paymentMethod, setPaymentMethod] = useState<'pay_on_delivery' | 'mobile_money' | 'card_escrow' | 'wire_transfer'>('pay_on_delivery');
  const [mobileProvider, setMobileProvider] = useState('M-Pesa');
  const [mobileNumber, setMobileNumber] = useState('+254 712 345678');
  const [cardHolder, setCardHolder] = useState('Alex Rivera');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [notes, setNotes] = useState('');
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  if (!isCheckoutOpen) return null;

  const shippingFee = cartTotal >= 1000 ? 0 : 45.0;
  const tax = cartTotal * (settings.taxRatePercent / 100);
  const grandTotal = cartTotal + shippingFee + tax;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((s) => (s + 1) as 1 | 2 | 3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => (s - 1) as 1 | 2 | 3);
    }
  };

  const handleConfirmOrder = () => {
    const order = placeOrder({
      shippingAddress: address,
      paymentMethod,
      notes,
    });
    setPlacedOrder(order);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col justify-between">
        {/* Header with Step Indicator */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Wholesale Checkout
              </h3>
              <p className="text-xs text-slate-500">
                Amapati Global Sourcing Escrow Protection
              </p>
            </div>
            <button
              onClick={() => {
                setIsCheckoutOpen(false);
                setPlacedOrder(null);
                setCurrentStep(1);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!placedOrder && (
            <div className="flex items-center justify-between my-4 px-4 text-xs font-bold">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 1 ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  1
                </div>
                <span>Shipping Address</span>
              </div>
              <div className="h-0.5 flex-1 mx-3 bg-slate-200 dark:bg-slate-700" />
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 2 ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  2
                </div>
                <span>Payment Method</span>
              </div>
              <div className="h-0.5 flex-1 mx-3 bg-slate-200 dark:bg-slate-700" />
              <div className={`flex items-center gap-2 ${currentStep === 3 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep === 3 ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  3
                </div>
                <span>Confirmation</span>
              </div>
            </div>
          )}
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto py-2 pr-1">
          {placedOrder ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <PackageCheck className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Order Confirmed!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Order Number: <strong className="text-slate-800 dark:text-slate-200 font-mono">{placedOrder.orderNumber}</strong>
                </p>
                <p className="text-xs text-slate-500">
                  Tracking Code: <strong className="text-orange-600 dark:text-orange-400 font-mono">{placedOrder.trackingNumber}</strong>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-left max-w-md mx-auto space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Selected:</span>
                  <span className="font-bold capitalize">{placedOrder.paymentMethod.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Authorized:</span>
                  <span className="font-extrabold text-orange-600 dark:text-orange-400">{formatPrice(placedOrder.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Address:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                    {placedOrder.shippingAddress.addressLine1}, {placedOrder.shippingAddress.city}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setPlacedOrder(null);
                    setCurrentStep(1);
                    setIsAccountModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all"
                >
                  View in My Orders
                </button>
              </div>
            </div>
          ) : currentStep === 1 ? (
            /* STEP 1: Address & Company */
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Full Name *
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name / Entity *
                  </label>
                  <input
                    type="text"
                    value={address.companyName}
                    onChange={(e) => setAddress({ ...address, companyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number for Logistics *
                  </label>
                  <input
                    type="text"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Destination Country *
                  </label>
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Address (Building, Suite, Street) *
                </label>
                <input
                  type="text"
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={address.stateOrRegion}
                    onChange={(e) => setAddress({ ...address, stateOrRegion: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Postal / ZIP Code
                  </label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>
          ) : currentStep === 2 ? (
            /* STEP 2: Payment Method */
            <div className="space-y-3 text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Sourcing Payment Method:
              </label>

              {/* Pay on Delivery */}
              <div
                onClick={() => setPaymentMethod('pay_on_delivery')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'pay_on_delivery'
                    ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Pay on Delivery (Trade Assurance)
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      Default & Recommended
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Inspect your shipment at port or delivery terminal before final funds release.
                  </p>
                </div>
              </div>

              {/* Mobile Money Integration */}
              <div
                onClick={() => setPaymentMethod('mobile_money')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'mobile_money'
                    ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Mobile Money Integration
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Instant STK Push</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    M-Pesa, MTN MoMo, Airtel Money for fast pan-African and regional clearance.
                  </p>

                  {paymentMethod === 'mobile_money' && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2">
                      <select
                        value={mobileProvider}
                        onChange={(e) => setMobileProvider(e.target.value)}
                        className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      >
                        <option>M-Pesa (Kenya / TZ)</option>
                        <option>MTN MoMo (Ghana / Uganda)</option>
                        <option>Airtel Money</option>
                      </select>
                      <input
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="Mobile Money Number"
                        className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Card Escrow */}
              <div
                onClick={() => setPaymentMethod('card_escrow')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'card_escrow'
                    ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Corporate Card (Escrow Hold)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Visa / Mastercard / Amex</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Funds are secured in Amapati Escrow vault until factory dispatch verification.
                  </p>
                </div>
              </div>

              {/* Wire Transfer */}
              <div
                onClick={() => setPaymentMethod('wire_transfer')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'wire_transfer'
                    ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Telegraphic Transfer (Bank TT Wire)
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Proforma Invoice with SWIFT routing instructions generated immediately.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 3: Order Confirmation & Review */
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>Ship to: {address.fullName} ({address.companyName})</span>
                  <span className="text-orange-600 dark:text-orange-400 underline cursor-pointer" onClick={() => setCurrentStep(1)}>
                    Edit
                  </span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {address.addressLine1}, {address.city}, {address.country} | Phone: {address.phone}
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                  <span className="text-slate-500">Payment:</span>
                  <span className="font-bold capitalize">{paymentMethod.replace(/_/g, ' ')}</span>
                </div>
              </div>

              {/* Order items overview */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <img src={item.product.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                      <div>
                        <div className="font-bold line-clamp-1">{item.product.title}</div>
                        <div className="text-[10px] text-slate-400">Qty: {item.quantity} × {formatPrice(item.appliedUnitPrice)}</div>
                      </div>
                    </div>
                    <div className="font-black text-slate-900 dark:text-white">
                      {formatPrice(item.appliedUnitPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Customs & Logistics Remarks (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Include Certificate of Origin and HS Code on commercial invoice"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              {/* Financial Totals */}
              <div className="p-3 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 space-y-1.5">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Items Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Freight / Logistics</span>
                  <span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Estimated VAT / Tax ({settings.taxRatePercent}%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-1.5 border-t border-orange-200 dark:border-orange-900/60">
                  <span>Grand Total</span>
                  <span className="text-orange-600 dark:text-orange-400">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {!placedOrder && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition-all"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleConfirmOrder}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize & Place Order</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
