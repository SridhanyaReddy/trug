'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import { AdminCategoryRecord } from '@/types/admin';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Power,
  X,
  Search,
  ArrowUpDown,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, toggleCategoryStatus } = useAdmin();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategoryRecord | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80');
    setDisplayOrder(categories.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (cat: AdminCategoryRecord) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
    setDisplayOrder(cat.displayOrder);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name,
        slug,
        description,
        image,
        displayOrder: Number(displayOrder),
      });
    } else {
      addCategory({
        name,
        slug,
        description,
        image,
        displayOrder: Number(displayOrder),
        isEnabled: true,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
            Category Taxonomy & Catalogue Order
          </h1>
          <p className="text-xs text-[#6B5145] mt-0.5">
            Configure homepage category shelves, icons, ordering sequence, and visibility across the customer web app.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-full bg-[#D97A5B] hover:bg-[#c2694d] text-white font-bold text-xs tracking-wide shadow-md transition flex items-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...categories]
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((cat) => (
            <div
              key={cat.id}
              className={`bg-white rounded-3xl border p-5 transition shadow-xs flex flex-col justify-between space-y-4 ${
                cat.isEnabled ? 'border-[#F1E6DC]' : 'border-[#F1E6DC]/40 opacity-70 bg-[#FAF5F0]/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF5F0] border border-[#F1E6DC] shrink-0">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-[#D97A5B] bg-[#FAF5F0] px-2 py-0.5 rounded-md border border-[#F1E6DC]">
                      Order #{cat.displayOrder}
                    </span>
                    <button
                      onClick={() => toggleCategoryStatus(cat.id)}
                      className={`p-1.5 rounded-lg transition ${
                        cat.isEnabled ? 'text-emerald-700 hover:bg-emerald-50' : 'text-stone-500 hover:bg-stone-100'
                      }`}
                      title={cat.isEnabled ? 'Disable category' : 'Enable category'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-[#302B28]">{cat.name}</h3>
                  <span className="text-[10px] font-mono text-[#6B5145]">/categories/{cat.slug}</span>
                  <p className="text-xs text-[#6B5145] font-normal mt-1 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F1E6DC]/70 flex items-center justify-between text-xs text-[#6B5145]">
                <span>{cat.productCount} products • {cat.vendorCount} stores</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg text-[#6B5145] hover:text-[#302B28] hover:bg-[#FAF5F0]"
                    title="Edit category"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  {categories.length > 3 && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove category "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-[#6B5145] hover:text-red-600 hover:bg-red-50"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#F1E6DC] shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#F1E6DC]">
              <h3 className="font-extrabold text-base text-[#302B28]">
                {editingCategory ? 'Edit Product Category' : 'Create New Category Shelf'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#6B5145]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Organic Breads & Buns"
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Display Sequence Priority</label>
                <input
                  type="number"
                  required
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>

              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Image Asset URL</label>
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>

              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Category Tagline</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description displayed on category pages..."
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1E6DC]">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B5145]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white text-xs font-bold shadow-xs"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

