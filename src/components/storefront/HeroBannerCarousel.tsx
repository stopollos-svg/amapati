import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const HeroBannerCarousel: React.FC = () => {
  const { banners, setIsRfqModalOpen } = useApp();
  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate every 6 seconds
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex] || activeBanners[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-slate-900 border border-slate-200 dark:border-slate-800 my-4">
      {/* Background image with high tech overlay */}
      <div className="relative min-h-[380px] sm:min-h-[440px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
          style={{ backgroundImage: `url(${current.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-black/60 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-10">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current" />
              {current.tag}
            </span>
            {current.badgeText && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {current.badgeText}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-md">
            {current.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-xl font-normal">
            {current.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {current.ctaLink === '#rfq' ? (
              <button
                onClick={() => setIsRfqModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5"
              >
                <span>{current.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <a
                href={current.ctaLink}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5"
              >
                <span>{current.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={() => setIsRfqModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-sm border border-white/20 transition-all"
            >
              Post Bulk RFQ
            </button>
          </div>
        </div>

        {/* Carousel controls */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-colors z-20"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-colors z-20"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicators */}
        <div className="absolute bottom-4 left-6 sm:left-12 flex items-center gap-2 z-20">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-8 bg-orange-500' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
