import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    formatPrice,
    setIsCheckoutOpen,
  } = useApp();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 1000;
  const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Wholesale Cart
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 mb-1.5 font-medium">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-orange-500" />
              {cartTotal >= freeShippingThreshold ? (
                <strong className="text-emerald-500">Free Freight Unlocked!</strong>
              ) : (
                <span>Add {formatPrice(freeShippingThreshold - cartTotal)} for Free Sea/Air Freight</span>
              )}
            </span>
            <span className="text-[10px] font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Your wholesale cart is empty
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Explore catalog items, choose your wholesale tier, and request volume dispatches.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 flex gap-3"
              >
                <img
                  src={item.product.images[0]}
                  alt=""
                  className="w-16 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {item.product.title}
                    </h5>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-black text-sm text-orange-600 dark:text-orange-400">
                      {formatPrice(item.appliedUnitPrice)}
                    </span>
                    <span className="text-[10px] text-slate-400">/ unit tier price</span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-xs font-extrabold text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                      {formatPrice(item.appliedUnitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} units)</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Estimated Freight</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {cartTotal >= freeShippingThreshold ? 'FREE' : formatPrice(45.0)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total</span>
                <span className="text-orange-600 dark:text-orange-400">
                  {formatPrice(cartTotal + (cartTotal >= freeShippingThreshold ? 0 : 45.0))}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01]"
            >
              <span>Proceed to 3-Step Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Covered by Trade Assurance Escrow Protection</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
