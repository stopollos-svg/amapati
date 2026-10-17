import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Category, HeroBanner } from '../../types';
import { Plus, Trash2, Edit2, Image, Sparkles, Check, X, Layers } from 'lucide-react';

export const AdminCategoriesBanners: React.FC = () => {
  const { categories, addCategory, deleteCategory, banners, addBanner, updateBanner, deleteBanner } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'banners' | 'categories'>('banners');

  // New banner state
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerTag, setBannerTag] = useState('FEATURED EXPO');
  const [bannerImageUrl, setBannerImageUrl] = useState('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80');
  const [bannerCtaText, setBannerCtaText] = useState('Explore Deals');
  const [bannerCtaLink, setBannerCtaLink] = useState('#products');
  const [bannerBadgeText, setBannerBadgeText] = useState('Verified Suppliers Only');

  // New category state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catIcon, setCatIcon] = useState('Cpu');

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    addBanner({
      title: bannerTitle,
      subtitle: bannerSubtitle,
      tag: bannerTag,
      imageUrl: bannerImageUrl,
      ctaText: bannerCtaText,
      ctaLink: bannerCtaLink,
      badgeText: bannerBadgeText,
      active: true,
    });
    setIsBannerModalOpen(false);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    addCategory({
      name: catName,
      slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: catIcon,
      description: catDescription,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    });
    setIsCategoryModalOpen(false);
    setCatName('');
  };

  return (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSubTab('banners')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'banners'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Homepage Hero Banners ({banners.length})
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'categories'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Product Categories ({categories.length})
          </button>
        </div>

        {activeSubTab === 'banners' ? (
          <button
            onClick={() => setIsBannerModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Banner</span>
          </button>
        ) : (
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {/* BANNERS SUB-TAB */}
      {activeSubTab === 'banners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="relative h-44 bg-slate-900">
                <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-orange-500 text-white font-extrabold text-[10px]">
                    {banner.tag}
                  </span>
                  {banner.badgeText && (
                    <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px]">
                      {banner.badgeText}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-white font-black text-sm drop-shadow">{banner.title}</h4>
                  <p className="text-slate-300 text-[11px] line-clamp-1">{banner.subtitle}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">CTA: <strong>{banner.ctaText}</strong></span>
                  <label className="flex items-center gap-1 text-[11px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={banner.active}
                      onChange={(e) => updateBanner(banner.id, { active: e.target.checked })}
                      className="rounded text-orange-500"
                    />
                    <span>{banner.active ? 'Active' : 'Inactive'}</span>
                  </label>
                </div>
                <button
                  onClick={() => deleteBanner(banner.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-500"
                  title="Delete Banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CATEGORIES SUB-TAB */}
      {activeSubTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-between"
            >
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">{cat.name}</h5>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{cat.description}</p>
                <div className="text-[10px] text-orange-600 font-semibold mt-1">
                  Icon: {cat.icon}
                </div>
              </div>
              <button
                onClick={() => deleteCategory(cat.id)}
                className="p-1 text-slate-400 hover:text-rose-500"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Banner Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Create Homepage Banner
              </h3>
              <button onClick={() => setIsBannerModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="mt-3 space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart IoT & Robotics Wholesale Expo"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Subtitle / Value Proposition</label>
                <input
                  type="text"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Tag</label>
                  <input
                    type="text"
                    value={bannerTag}
                    onChange={(e) => setBannerTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={bannerBadgeText}
                    onChange={(e) => setBannerBadgeText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Background Image URL</label>
                <input
                  type="text"
                  value={bannerImageUrl}
                  onChange={(e) => setBannerImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Add New Tech Category
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="mt-3 space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microcontrollers & SBCs"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Embedded development kits, ESP32, and Raspberry Pi accessories"
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Icon Representation</label>
                <select
                  value={catIcon}
                  onChange={(e) => setCatIcon(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="Cpu">Cpu (Processors & Boards)</option>
                  <option value="Smartphone">Smartphone (Handhelds)</option>
                  <option value="Radio">Radio (IoT & Wireless)</option>
                  <option value="Bot">Bot (Robotics)</option>
                  <option value="Zap">Zap (Power & Batteries)</option>
                  <option value="Layers">Layers (Components)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
