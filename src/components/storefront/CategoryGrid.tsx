import React from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, Cpu, Radio, Bot, Headphones, Zap, Layers, Sparkles } from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-6 h-6 text-orange-500" />,
  Cpu: <Cpu className="w-6 h-6 text-sky-500" />,
  Radio: <Radio className="w-6 h-6 text-emerald-500" />,
  Bot: <Bot className="w-6 h-6 text-purple-500" />,
  Headphones: <Headphones className="w-6 h-6 text-amber-500" />,
  Zap: <Zap className="w-6 h-6 text-yellow-500" />,
  Layers: <Layers className="w-6 h-6 text-rose-500" />,
};

export const CategoryGrid: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, setCurrentView } = useApp();

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(selectedCategory === catId ? null : catId);
    setCurrentView('storefront');
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Explore Technology Categories</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Source factory-direct electronics, AI hardware, robotics, and verified components
          </p>
        </div>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
          >
            Clear Filter (Show All)
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`group flex flex-col items-center text-center p-3.5 rounded-2xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 shadow-md shadow-orange-500/10'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-orange-400 hover:shadow-md'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 ${
                  isSelected ? 'bg-white dark:bg-slate-900 shadow-inner' : 'bg-slate-100 dark:bg-slate-700/60'
                }`}
              >
                {ICON_MAP[cat.icon] || <Sparkles className="w-6 h-6 text-orange-500" />}
              </div>
              <span
                className={`text-xs font-bold leading-snug line-clamp-2 ${
                  isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {cat.name}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                {cat.productCount}+ items
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
