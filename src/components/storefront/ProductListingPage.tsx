import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { HeroBannerCarousel } from './HeroBannerCarousel';
import { CategoryGrid } from './CategoryGrid';
import { RfqStrip } from './RfqStrip';
import { TrustedSellersStrip } from './TrustedSellersStrip';
import {
  SlidersHorizontal,
  Flame,
  Sparkles,
  Award,
  Grid3X3,
  List,
  Check,
  X,
  Filter,
  ShieldCheck,
  ArrowUpDown
} from 'lucide-react';

export const ProductListingPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    formatPrice,
  } = useApp();

  // Filter states
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [verifiedSupplierOnly, setVerifiedSupplierOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'moq_asc'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory && product.categoryId !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = product.title.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        const matchSku = product.sku.toLowerCase().includes(q);
        const matchSupplier = product.supplier.name.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchSku && !matchSupplier) {
          return false;
        }
      }
      // Price range filter
      if (product.basePrice < minPrice || product.basePrice > maxPrice) {
        return false;
      }
      // Rating filter
      if (minRating > 0 && product.averageRating < minRating) {
        return false;
      }
      // In stock
      if (inStockOnly && product.stock <= 0) {
        return false;
      }
      // Verified supplier
      if (verifiedSupplierOnly && !product.supplier.verified) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price_desc') return b.basePrice - a.basePrice;
      if (sortBy === 'rating') return b.averageRating - a.averageRating;
      if (sortBy === 'moq_asc') return a.moq - b.moq;
      // Default: featured
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, minPrice, maxPrice, minRating, inStockOnly, verifiedSupplierOnly, sortBy]);

  // Special curated sections (Featured, New Arrivals, Top Rated)
  const featuredDeals = useMemo(() => products.filter((p) => p.featured), [products]);
  const newArrivals = useMemo(() => products.filter((p) => p.isNewArrival), [products]);
  const topRated = useMemo(() => products.filter((p) => p.isTopRated), [products]);

  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(10000);
    setMinRating(0);
    setInStockOnly(false);
    setVerifiedSupplierOnly(false);
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(searchQuery) ||
    minPrice > 0 ||
    maxPrice < 10000 ||
    minRating > 0 ||
    inStockOnly ||
    verifiedSupplierOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
      {/* Hero Banner Carousel (Editor Managed) */}
      {!searchQuery && !selectedCategory && <HeroBannerCarousel />}

      {/* Category Icons Bar */}
      <CategoryGrid />

      {/* Featured Deals Row (Prompt requirement 3) */}
      {!searchQuery && !selectedCategory && featuredDeals.length > 0 && (
        <section id="featured-deals" className="py-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Featured Wholesale Deals
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Exclusive tier-pricing and guaranteed factory lead times
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featuredDeals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Request a Quote (RFQ) Strip (Prompt requirement 3) */}
      <RfqStrip />

      {/* New Arrivals Row (Prompt requirement 3) */}
      {!searchQuery && !selectedCategory && newArrivals.length > 0 && (
        <section className="py-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  New Tech Arrivals
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fresh release commercial models, edge compute nodes, and wearables
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Trusted Sellers / Brands Strip (Prompt requirement 3) */}
      <TrustedSellersStrip />

      {/* Top Rated Row (Prompt requirement 3) */}
      {!searchQuery && !selectedCategory && topRated.length > 0 && (
        <section id="top-rated" className="py-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Top Rated by Procurement Officers
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Highest verified supplier performance and minimum defect ratings
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {topRated.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Full Catalog Listing Section with Filters & Sorting (Prompt requirement 3) */}
      <section id="catalog-section" className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name || 'Filtered Products'
                : 'Complete Technology Catalog'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredProducts.length} wholesale hardware listings
            </p>
          </div>

          {/* Controls: Sort, View Toggle, Filter Drawer Trigger on Mobile */}
          <div className="flex items-center gap-3">
            {/* Filter drawer toggle button (mobile) */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
            >
              <Filter className="w-4 h-4 text-orange-500" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="moq_asc">MOQ: Low to High</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active filter badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-slate-400 font-medium">Applied:</span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-xs font-semibold">
                Category: {categories.find((c) => c.id === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory(null)}>
                  <X className="w-3 h-3 hover:text-orange-900" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-semibold">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-3 h-3 hover:text-sky-900" />
                </button>
              </span>
            )}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                Rating: {minRating}★ & up
                <button onClick={() => setMinRating(0)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                In Stock Only
                <button onClick={() => setInStockOnly(false)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {verifiedSupplierOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                Verified Suppliers Only
                <button onClick={() => setVerifiedSupplierOnly(false)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline ml-2"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Catalog layout: Filters Sidebar + Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar (Desktop) / Drawer (Mobile) */}
          <aside
            className={`space-y-6 ${
              isFilterDrawerOpen
                ? 'block fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 p-6 overflow-y-auto shadow-2xl md:relative md:inset-auto md:w-auto md:bg-transparent md:p-0 md:shadow-none'
                : 'hidden md:block'
            }`}
          >
            {isFilterDrawerOpen && (
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 md:hidden">
                <span className="font-bold text-sm">Filters</span>
                <button onClick={() => setIsFilterDrawerOpen(false)}>
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            )}

            {/* Category Filter */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
                Categories
              </h4>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left py-1 px-2 rounded-lg transition-colors flex items-center justify-between ${
                    !selectedCategory ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>All Categories</span>
                  <span>{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left py-1 px-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="text-[10px] opacity-75">
                      {products.filter((p) => p.categoryId === cat.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
                Price Range (USD)
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="number"
                    min={0}
                    max={maxPrice}
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                    placeholder="Min"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    min={minPrice}
                    max={20000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value) || 10000)}
                    placeholder="Max"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{formatPrice(minPrice)}</span>
                  <span>{formatPrice(maxPrice)}</span>
                </div>
              </div>
            </div>

            {/* Supplier & Stock Checkboxes */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                Supplier & Stock
              </h4>
              <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedSupplierOnly}
                  onChange={(e) => setVerifiedSupplierOnly(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Verified Suppliers Only
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="font-medium">In-Stock Only</span>
              </label>
            </div>

            {/* Minimum Rating */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
                Minimum Rating
              </h4>
              <div className="space-y-1.5 text-xs">
                {[0, 4.5, 4.0, 3.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`w-full text-left py-1 px-2 rounded-lg transition-colors flex items-center justify-between ${
                      minRating === rating
                        ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{rating === 0 ? 'Any Rating' : `${rating}★ & above`}</span>
                    {minRating === rating && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid / List (3 Cols) */}
          <div className="md:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8">
                <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No technology products match your filters
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try clearing your search keyword, adjusting the price bounds, or expanding categories.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full sm:w-36 h-36 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                        {product.categoryName}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {product.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {product.shortDescription}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-xs">
                        <span className="font-extrabold text-base text-orange-600 dark:text-orange-400">
                          {formatPrice(product.basePrice)}
                        </span>
                        <span className="text-slate-400">MOQ: {product.moq}</span>
                        <span className="text-slate-400">Lead: {product.leadTimeDays}d</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
