import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Truck,
  Clock,
  Building2,
  MessageSquare,
  ShoppingCart,
  Zap,
  Check,
  Heart,
  Share2,
  Package,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    setCurrentView,
    formatPrice,
    calculateAppliedPrice,
    addToCart,
    favorites,
    toggleFavorite,
    setIsContactSellerOpen,
    setContactSellerProduct,
    setIsCheckoutOpen,
  } = useApp();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [orderQuantity, setOrderQuantity] = useState<number>(product.moq || 1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'shipping' | 'reviews'>('specs');
  const [copySuccess, setCopySuccess] = useState(false);

  if (!product) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">Product not found.</p>
        <button
          onClick={() => setCurrentView('storefront')}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(product.id);
  const appliedUnitPrice = calculateAppliedPrice(product, orderQuantity);
  const subtotal = appliedUnitPrice * orderQuantity;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleInstantBuy = () => {
    addToCart(product, orderQuantity);
    setIsCheckoutOpen(true);
  };

  const handleContactSeller = () => {
    setContactSellerProduct(product);
    setIsContactSellerOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setCurrentView('storefront')}
          className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            title="Share Product"
          >
            {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copySuccess ? 'Link Copied!' : 'Share'}</span>
          </button>
          <button
            onClick={() => toggleFavorite(product.id)}
            className={`flex items-center gap-1 transition-colors ${
              isFav ? 'text-rose-500 font-bold' : 'text-slate-500 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
            <span>{isFav ? 'Favorited' : 'Favorite'}</span>
          </button>
        </div>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Gallery (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {product.featured && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded-md shadow">
                Featured Deal
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-orange-500 scale-95 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Supplier Info Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Verified Manufacturer
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Trade Assurance
              </span>
            </div>
            <h5 className="text-sm font-bold text-slate-900 dark:text-white">
              {product.supplier.name}
            </h5>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-center text-xs">
              <div>
                <div className="text-slate-400 text-[10px]">Years Gold</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{product.supplier.yearsInBusiness} Yrs</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">Response Rate</div>
                <div className="font-bold text-emerald-500">{product.supplier.responseRate}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">Country</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{product.supplier.country} ({product.supplier.countryCode})</div>
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right: Pricing, Tiers, & Purchase Panel (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            {/* Title & SKU */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
                {product.categoryName}
              </span>
              <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
              {product.title}
            </h1>

            {/* Ratings and Stock */}
            <div className="flex items-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.averageRating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount} customer reviews)</span>
              </div>
              <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
              <div className="text-slate-600 dark:text-slate-300">
                Stock: <span className="font-bold text-slate-900 dark:text-white">{product.stock} units</span>
              </div>
              <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
              <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>Lead Time: {product.leadTimeDays} days</span>
              </div>
            </div>

            {/* Wholesale Tiered Pricing Engine */}
            <div className="mt-6 p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-900/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-orange-800 dark:text-orange-300">
                  Wholesale Volume Discount Tiers
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Min Order (MOQ): <strong className="text-slate-900 dark:text-white">{product.moq} units</strong>
                </span>
              </div>

              {/* Tiers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.priceTiers.map((tier, idx) => {
                  const isCurrent =
                    orderQuantity >= tier.minQty &&
                    (tier.maxQty === null || orderQuantity <= tier.maxQty);
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border transition-all text-center ${
                        isCurrent
                          ? 'bg-white dark:bg-slate-900 border-orange-500 shadow-md ring-2 ring-orange-500/20'
                          : 'bg-white/60 dark:bg-slate-900/40 border-orange-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {tier.maxQty === null ? `${tier.minQty}+ units` : `${tier.minQty}-${tier.maxQty} units`}
                      </div>
                      <div className="text-base sm:text-lg font-black text-orange-600 dark:text-orange-400 mt-0.5">
                        {formatPrice(tier.unitPrice)}
                      </div>
                      {isCurrent && (
                        <span className="inline-block px-1.5 py-0.5 mt-1 rounded bg-orange-500 text-white text-[9px] font-bold">
                          Active Tier
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Live Calculator & Quantity Selector */}
              <div className="mt-4 pt-4 border-t border-orange-200/80 dark:border-orange-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Order Quantity:
                  </span>
                  <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                    <button
                      onClick={() => setOrderQuantity((q) => Math.max(product.moq, q - 1))}
                      disabled={orderQuantity <= product.moq}
                      className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 text-sm font-bold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={product.moq}
                      max={product.stock}
                      value={orderQuantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setOrderQuantity(Math.max(product.moq, val));
                      }}
                      className="w-16 text-center text-sm font-extrabold bg-transparent outline-none py-1.5 text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={() => setOrderQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={orderQuantity >= product.stock}
                      className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Unit Price: <span className="font-bold text-slate-800 dark:text-slate-200">{formatPrice(appliedUnitPrice)}</span>
                  </div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    Total: <span className="text-orange-600 dark:text-orange-400">{formatPrice(subtotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Sourcing Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToCart(product, orderQuantity)}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add {orderQuantity} to Cart</span>
              </button>

              <button
                onClick={handleInstantBuy}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-sm shadow hover:bg-slate-800 dark:hover:bg-slate-100 transition-transform hover:-translate-y-0.5"
              >
                <Zap className="w-4 h-4 fill-current text-amber-400 dark:text-orange-500" />
                <span>Instant Checkout</span>
              </button>

              <button
                onClick={handleContactSeller}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:border-orange-400 transition-colors"
                title="Send direct inquiry to supplier"
              >
                <MessageSquare className="w-4 h-4 text-orange-500" />
                <span>Contact Supplier</span>
              </button>
            </div>
          </div>

          {/* Protection Guarantee */}
          <div className="mt-6 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Trade Assurance covers orders until delivery
            </span>
            <span className="text-[11px] text-slate-400">Escrow Security</span>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications, Description, Shipping, Reviews */}
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'desc'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Product Overview & BOM
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Packaging & Shipping
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Buyer Reviews ({product.reviewsCount})
          </button>
        </div>

        {/* Tab content */}
        <div className="py-6">
          {activeTab === 'specs' && (
            <div className="max-w-4xl">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                Key Industrial & Engineering Specifications
              </h4>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <tbody>
                    {product.specs.map((s, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-800/30'}
                      >
                        <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300 w-1/3 border-b border-slate-200 dark:border-slate-800">
                          {s.name}
                        </td>
                        <td className="py-3 px-4 text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800">
                          {s.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'desc' && (
            <div className="max-w-4xl text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-4">
              <p>{product.description}</p>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">
                  OEM / ODM Customization Options
                </h5>
                <ul className="list-disc pl-5 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Custom logo printing, silk screening, and laser engraving (from 50 units)</li>
                  <li>Custom firmware flashing and embedded OS configuration</li>
                  <li>Retail packaging design and custom barcode labeling</li>
                  <li>Factory burn-in test reports included with every shipment</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-orange-500" />
                  Freight Terms & Delivery
                </h5>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Port of Dispatch: Shenzhen / Shanghai / Ningbo.<br />
                  Incoterms supported: FOB, CIF, DDP, DAP, EXW.<br />
                  Lead Time: {product.leadTimeDays} business days from order confirmation.<br />
                  Express Air courier (DHL / FedEx) available for sample batches.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4 text-sky-500" />
                  Industrial Export Packaging
                </h5>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Individual anti-static blister packaging packed in 5-ply export corrugated cartons. Palletized and shrink-wrapped for international container freight.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-4xl space-y-4">
              {product.reviews.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs">
                  No verified buyer reviews yet. Be the first procurement partner to leave feedback!
                </div>
              ) : (
                product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{rev.userName}</span>
                        {rev.userCompany && (
                          <span className="text-[11px] text-slate-400 font-medium">({rev.userCompany})</span>
                        )}
                        {rev.verifiedPurchase && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
