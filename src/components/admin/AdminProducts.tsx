import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, PriceTier, ProductSpec } from '../../types';
import {
  Plus,
  Upload,
  Search,
  Trash2,
  Edit2,
  FileSpreadsheet,
  Check,
  AlertCircle,
  X,
  Layers,
  DollarSign
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, bulkImportProducts, formatPrice } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for Add/Edit
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat_electronics');
  const [basePrice, setBasePrice] = useState(199);
  const [stock, setStock] = useState(100);
  const [moq, setMoq] = useState(2);
  const [leadTimeDays, setLeadTimeDays] = useState(5);
  const [imagesText, setImagesText] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([
    { minQty: 1, maxQty: 9, unitPrice: 199 },
    { minQty: 10, maxQty: 49, unitPrice: 175 },
    { minQty: 50, maxQty: null, unitPrice: 150 },
  ]);
  const [specs, setSpecs] = useState<ProductSpec[]>([
    { name: 'Quality Grade', value: 'Factory Spec A+' },
    { name: 'Warranty', value: '1 Year Manufacturer' },
  ]);

  // Bulk CSV state
  const [csvContent, setCsvContent] = useState('');
  const [csvResult, setCsvResult] = useState<{ imported: number; errors: string[] } | null>(null);

  const filtered = products.filter((p) => {
    if (selectedCat && p.categoryId !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setSku(`AMA-HW-${Math.floor(1000 + Math.random() * 9000)}`);
    setCategoryId(categories[0]?.id || 'cat_electronics');
    setBasePrice(199);
    setStock(100);
    setMoq(2);
    setLeadTimeDays(5);
    setImagesText('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80');
    setShortDescription('Enterprise wholesale hardware with manufacturer warranty.');
    setDescription('High performance electronic device built for industrial reliability and mass market procurement.');
    setPriceTiers([
      { minQty: 1, maxQty: 9, unitPrice: 199 },
      { minQty: 10, maxQty: 49, unitPrice: 175 },
      { minQty: 50, maxQty: null, unitPrice: 150 },
    ]);
    setSpecs([
      { name: 'Quality Grade', value: 'Factory Spec A+' },
      { name: 'Warranty', value: '1 Year Manufacturer' },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setSku(p.sku);
    setCategoryId(p.categoryId);
    setBasePrice(p.basePrice);
    setStock(p.stock);
    setMoq(p.moq);
    setLeadTimeDays(p.leadTimeDays);
    setImagesText(p.images.join('\n'));
    setShortDescription(p.shortDescription);
    setDescription(p.description);
    setPriceTiers(p.priceTiers || []);
    setSpecs(p.specs || []);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const catName = categories.find((c) => c.id === categoryId)?.name || 'General';
    const images = imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title,
        sku,
        categoryId,
        categoryName: catName,
        basePrice,
        stock,
        moq,
        leadTimeDays,
        images: images.length > 0 ? images : editingProduct.images,
        shortDescription,
        description,
        priceTiers,
        specs,
      });
    } else {
      addProduct({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku,
        categoryId,
        categoryName: catName,
        basePrice,
        stock,
        moq,
        leadTimeDays,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'],
        shortDescription,
        description,
        priceTiers,
        specs,
        supplier: {
          name: 'Shenzhen Apex Industrial Telecomm Co., Ltd.',
          country: 'China',
          countryCode: 'CN',
          verified: true,
          tradeAssurance: true,
          yearsInBusiness: 8,
          rating: 4.9,
          responseRate: '99%',
        },
        featured: false,
        isNewArrival: true,
        isTopRated: false,
      });
    }
    setIsModalOpen(false);
  };

  const handleCsvImport = (e: React.FormEvent) => {
    e.preventDefault();
    const result = bulkImportProducts(csvContent);
    setCsvResult(result);
    if (result.imported > 0) {
      setTimeout(() => {
        setIsCsvModalOpen(false);
        setCsvResult(null);
        setCsvContent('');
      }, 1800);
    }
  };

  const downloadSampleCsv = () => {
    const sample = `Title,SKU,BasePrice,MOQ,Stock,CategoryName,ImageUrl
"Titan Ultra 5G Tablet","AMA-TAB-9001",320,5,250,"Smart Phones & Tablets","https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80"
"Edge AI Vision Compute Stick","AMA-NPU-200",85,10,600,"Computers & AI Hardware","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80"
"Industrial LoRaWAN Gateway IP67","AMA-GW-800",240,2,80,"IoT & Smart Automation","https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"`;
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amapati_sample_products_template.csv';
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by title or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:border-orange-400 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Bulk CSV Import</span>
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-3">Category & SKU</th>
                <th className="py-3 px-3">Base Price</th>
                <th className="py-3 px-3">Stock & MOQ</th>
                <th className="py-3 px-3">Wholesale Tiers</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[200px]">
                          {prod.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Lead: {prod.leadTimeDays}d • {prod.supplier.country}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-700 dark:text-slate-300">{prod.categoryName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{prod.sku}</div>
                  </td>
                  <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">
                    {formatPrice(prod.basePrice)}
                  </td>
                  <td className="py-3 px-3">
                    <div className={prod.stock < 25 ? 'font-bold text-rose-500' : 'text-slate-700 dark:text-slate-300'}>
                      {prod.stock} units
                    </div>
                    <div className="text-[10px] text-slate-400">MOQ: {prod.moq}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-[10px] font-bold">
                      {prod.priceTiers.length} Price Tiers
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-orange-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Hardware Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto py-3 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">SKU Number *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">MOQ</label>
                  <input
                    type="number"
                    min={1}
                    value={moq}
                    onChange={(e) => setMoq(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Image URLs (one URL per line)</label>
                <textarea
                  rows={2}
                  value={imagesText}
                  onChange={(e) => setImagesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[11px] outline-none"
                />
              </div>

              {/* Price Tiers Section */}
              <div className="p-3 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-orange-900 dark:text-orange-300 text-xs">
                    Wholesale Tiered Discounts
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPriceTiers([
                        ...priceTiers,
                        { minQty: 100, maxQty: null, unitPrice: Math.round(basePrice * 0.75) },
                      ])
                    }
                    className="text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    + Add Tier
                  </button>
                </div>
                <div className="space-y-1.5">
                  {priceTiers.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">From</span>
                      <input
                        type="number"
                        value={t.minQty}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 1;
                          const copy = [...priceTiers];
                          copy[idx].minQty = val;
                          setPriceTiers(copy);
                        }}
                        className="w-16 p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center"
                      />
                      <span className="text-[11px] text-slate-500">to</span>
                      <input
                        type="text"
                        placeholder="Max (or empty for +)"
                        value={t.maxQty === null ? '' : t.maxQty}
                        onChange={(e) => {
                          const val = e.target.value.trim() === '' ? null : parseInt(e.target.value, 10);
                          const copy = [...priceTiers];
                          copy[idx].maxQty = isNaN(val as any) ? null : val;
                          setPriceTiers(copy);
                        }}
                        className="w-16 p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center"
                      />
                      <span className="text-[11px] text-slate-500">Unit Price ($):</span>
                      <input
                        type="number"
                        value={t.unitPrice}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const copy = [...priceTiers];
                          copy[idx].unitPrice = val;
                          setPriceTiers(copy);
                        }}
                        className="w-20 p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center font-bold text-orange-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Full Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Bulk CSV Product Import
                </h3>
              </div>
              <button onClick={() => setIsCsvModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCsvImport} className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Paste CSV data below:</span>
                <button
                  type="button"
                  onClick={downloadSampleCsv}
                  className="text-orange-600 dark:text-orange-400 font-bold hover:underline"
                >
                  Download Sample CSV
                </button>
              </div>

              <textarea
                required
                rows={6}
                placeholder={`Title,SKU,BasePrice,MOQ,Stock,CategoryName,ImageUrl\n"Enterprise Edge Box","BOX-101",850,2,40,"Computers & AI Hardware","https://..."`}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[11px] outline-none"
              />

              {csvResult && (
                <div
                  className={`p-3 rounded-xl ${
                    csvResult.imported > 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {csvResult.imported > 0 ? (
                    <div>Successfully imported {csvResult.imported} products!</div>
                  ) : (
                    <div>{csvResult.errors.join(' ')}</div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCsvModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
                >
                  Process CSV Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
