'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useVendor } from '@/context/VendorContext';
import { VendorManagedProduct } from '@/types/vendor';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  Pause,
  Play,
  X,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function VendorProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, setProductStatus } = useVendor();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<VendorManagedProduct | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VendorManagedProduct['category']>('Milk & Dairy');
  const [subCategory, setSubCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80');
  const [variantName, setVariantName] = useState('500g');
  const [variantPrice, setVariantPrice] = useState(120);
  const [variantOriginalPrice, setVariantOriginalPrice] = useState(140);
  const [variantStockQty, setVariantStockQty] = useState(25);
  const [isOrganic, setIsOrganic] = useState(false);
  const [badge, setBadge] = useState('');

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setShortDescription('');
    setDescription('');
    setCategory('Milk & Dairy');
    setSubCategory('Fresh Milk');
    setImageUrl('https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80');
    setVariantName('1 Litre');
    setVariantPrice(80);
    setVariantOriginalPrice(90);
    setVariantStockQty(30);
    setIsOrganic(true);
    setBadge('Fresh Morning Drop');
    setModalOpen(true);
  };

  const openEditModal = (p: VendorManagedProduct) => {
    setEditingProduct(p);
    setName(p.name);
    setShortDescription(p.shortDescription);
    setDescription(p.description);
    setCategory(p.category);
    setSubCategory(p.subCategory || '');
    setImageUrl(p.image);
    const defVariant = p.variants[0];
    setVariantName(defVariant.name);
    setVariantPrice(defVariant.price);
    setVariantOriginalPrice(defVariant.originalPrice || defVariant.price);
    setVariantStockQty(defVariant.stockQty);
    setIsOrganic(!!p.isOrganic);
    setBadge(p.badge || '');
    setModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        shortDescription,
        description,
        category,
        subCategory,
        image: imageUrl,
        isOrganic,
        badge,
        variants: [
          {
            ...editingProduct.variants[0],
            name: variantName,
            price: Number(variantPrice),
            originalPrice: Number(variantOriginalPrice),
            stockQty: Number(variantStockQty),
            inStock: Number(variantStockQty) > 0,
          },
          ...editingProduct.variants.slice(1),
        ],
      });
    } else {
      addProduct({
        name,
        shortDescription,
        description,
        category,
        subCategory,
        image: imageUrl,
        isOrganic,
        badge,
        status: 'published',
        rating: 4.9,
        defaultVariantId: 'v-1',
        variants: [
          {
            id: `v-${Date.now()}`,
            name: variantName,
            price: Number(variantPrice),
            originalPrice: Number(variantOriginalPrice),
            stockQty: Number(variantStockQty),
            inStock: Number(variantStockQty) > 0,
          },
        ],
      });
    }

    setModalOpen(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchStatus = selectedStatus === 'All' || p.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, search, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
            Store Product Catalogue
          </h1>
          <p className="text-xs text-[#6B5145] mt-0.5">
            Manage product variants, live customer pricing, and published visibility.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-full bg-[#D97A5B] hover:bg-[#c2694d] text-white font-bold text-xs tracking-wide shadow-md transition flex items-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#F1E6DC] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-72 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF5F0] text-xs font-medium text-[#302B28] rounded-xl border border-[#F1E6DC] focus:outline-none focus:border-[#D97A5B]"
          />
          <Search className="w-4 h-4 text-[#6B5145] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#FAF5F0] border border-[#F1E6DC] rounded-xl px-3 py-2 text-xs font-semibold text-[#302B28] focus:outline-none focus:border-[#D97A5B]"
          >
            <option value="All">All Categories</option>
            <option value="Milk & Dairy">Milk & Dairy</option>
            <option value="Eggs">Eggs</option>
            <option value="Vegetables & Fruits">Vegetables & Fruits</option>
            <option value="Groceries">Groceries</option>
            <option value="Meat & Other Essentials">Meat & Other Essentials</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#FAF5F0] border border-[#F1E6DC] rounded-xl px-3 py-2 text-xs font-semibold text-[#302B28] focus:outline-none focus:border-[#D97A5B]"
          >
            <option value="All">All States</option>
            <option value="published">Published</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#F1E6DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF5F0] border-b border-[#F1E6DC] text-[#6B5145] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price & Variants</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4">Store State</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1E6DC]/70">
              {filteredProducts.map((p) => {
                const totalStock = p.variants.reduce((acc, curr) => acc + curr.stockQty, 0);

                return (
                  <tr key={p.id} className="hover:bg-[#FAF5F0]/40 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF5F0] border border-[#F1E6DC] shrink-0">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-xs text-[#302B28]">{p.name}</h3>
                          <span className="text-[11px] text-[#6B5145] line-clamp-1">
                            {p.shortDescription}
                          </span>
                          <span className="text-[10px] text-[#6B5145] block font-mono">
                            {p.totalSold} sold • updated {p.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-[#6B5145]">
                      {p.category}
                      {p.subCategory && <span className="block text-[10px] font-normal">{p.subCategory}</span>}
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {p.variants.map((v) => (
                          <div key={v.id} className="flex items-center gap-1.5 font-medium">
                            <span className="font-bold text-[#302B28]">₹{v.price}</span>
                            <span className="text-[#6B5145] text-[11px]">({v.name})</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`font-black text-xs px-2.5 py-0.5 rounded-full inline-block ${
                          totalStock > 10
                            ? 'bg-emerald-100 text-emerald-800'
                            : totalStock > 0
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          p.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'paused'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.status === 'published' ? (
                          <button
                            onClick={() => setProductStatus(p.id, 'paused')}
                            className="p-1.5 rounded-lg text-[#6B5145] hover:text-amber-800 hover:bg-[#FAF5F0] transition"
                            title="Pause product (hide from storefront)"
                          >
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setProductStatus(p.id, 'published')}
                            className="p-1.5 rounded-lg text-[#6B5145] hover:text-emerald-800 hover:bg-[#FAF5F0] transition"
                            title="Publish product"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-[#6B5145] hover:text-[#302B28] hover:bg-[#FAF5F0] transition"
                          title="Edit details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Remove "${p.name}" from store?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-[#6B5145] hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#F1E6DC] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F1E6DC]">
              <h3 className="font-extrabold text-base text-[#302B28]">
                {editingProduct ? 'Edit Product Catalogue Item' : 'Add New Item to Shop'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#6B5145] hover:text-[#302B28]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pure Buffalo Fresh Curd"
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-semibold"
                />
              </div>

              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-semibold"
                >
                  <option value="Milk & Dairy">Milk & Dairy</option>
                  <option value="Eggs">Eggs</option>
                  <option value="Vegetables & Fruits">Vegetables & Fruits</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Meat & Other Essentials">Meat & Other Essentials</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B5145] font-bold mb-1">Default Unit / Variant</label>
                  <input
                    type="text"
                    required
                    value={variantName}
                    onChange={(e) => setVariantName(e.target.value)}
                    placeholder="e.g. 500g / 1 Litre"
                    className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                  />
                </div>
                <div>
                  <label className="block text-[#6B5145] font-bold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={variantPrice}
                    onChange={(e) => setVariantPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B5145] font-bold mb-1">Original Price (₹ MRP)</label>
                  <input
                    type="number"
                    value={variantOriginalPrice}
                    onChange={(e) => setVariantOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                  />
                </div>
                <div>
                  <label className="block text-[#6B5145] font-bold mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    required
                    value={variantStockQty}
                    onChange={(e) => setVariantStockQty(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Image URL Preview</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>

              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Short Tagline Description</label>
                <input
                  type="text"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Creamy traditional set dahi in clay pot."
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>

              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Detailed Description & Sourcing</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell customers about farm origins or artisanal methods..."
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1E6DC]">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B5145]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white text-xs font-bold shadow-xs"
              >
                {editingProduct ? 'Save Changes' : 'Publish Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

