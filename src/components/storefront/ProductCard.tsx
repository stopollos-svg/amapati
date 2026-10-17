import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Star, Heart, ShoppingCart, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductDetail, addToCart, favorites, toggleFavorite, formatPrice } = useApp();

  const isFav = favorites.includes(product.id);

  // Price range calculation
  const sortedTiers = [...product.priceTiers].sort((a, b) => b.unitPrice - a.unitPrice);
  const highestPrice = sortedTiers[0]?.unitPrice || product.basePrice;
  const lowestPrice = sortedTiers[sortedTiers.length - 1]?.unitPrice || product.basePrice;

  const displayPriceString =
    lowestPrice === highestPrice
      ? `${formatPrice(lowestPrice)}`
      : `${formatPrice(lowestPrice)} - ${formatPrice(highestPrice)}`;

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-orange-500/50 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Image Container */}
      <div
        onClick={() => openProductDetail(product.id)}
        className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md shadow-sm transition-all ${
            isFav
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500'
          }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.featured && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow">
              Featured
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 rounded-md bg-sky-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
              New
            </span>
          )}
        </div>

        {/* Lead time */}
        <div className="absolute bottom-2 left-2.5 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1">
          <Clock className="w-3 h-3 text-orange-400" />
          <span>{product.leadTimeDays}d Dispatch</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Price Range (Prominent Alibaba Style) */}
          <div
            onClick={() => openProductDetail(product.id)}
            className="cursor-pointer"
          >
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {displayPriceString}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">/ unit</span>
            </div>

            {/* MOQ and Category Tag */}
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block px-1.5 py-0.5 bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 rounded font-semibold text-[11px]">
                MOQ: {product.moq} {product.moq === 1 ? 'unit' : 'units'}
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                {product.categoryName}
              </span>
            </div>

            {/* Product Title */}
            <h4 className="mt-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors">
              {product.title}
            </h4>
          </div>

          {/* Supplier details strip */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="truncate max-w-[150px] font-medium" title={product.supplier.name}>
              {product.supplier.name}
            </span>
            <div className="flex items-center gap-1 shrink-0 font-bold text-slate-700 dark:text-slate-300">
              <span>{product.supplier.countryCode}</span>
              {product.supplier.tradeAssurance && (
                <span title="Trade Assurance Protected">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions & rating */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.averageRating.toFixed(1)}</span>
            <span className="text-slate-400 text-[10px]">({product.reviewsCount})</span>
          </div>

          <button
            onClick={() => addToCart(product, product.moq)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs shadow-sm transition-all"
            title="Add MOQ to Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
