'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';

import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import RecurringModal from '@/components/RecurringModal';
import { Product, ProductVariant } from '@/types';
import { Milk, Egg, Carrot, Package, Drumstick, ArrowLeft, SlidersHorizontal } from 'lucide-react';

const CATEGORY_MAP: Record<string, { title: string; categoryName: string; icon: any; description: string }> = {
  'milk-and-dairy': {
    title: 'Milk & Dairy',
    categoryName: 'Milk & Dairy',
    icon: Milk,
    description: 'A2 raw cow milk, fresh set curd in terracotta pots, slow-cooked bilona ghee and soft malai paneer.',
  },
  'eggs': {
    title: 'Eggs',
    categoryName: 'Eggs',
    icon: Egg,
    description: 'Free-range country brown eggs with deep yellow yolks and sanitised farm fresh white table eggs.',
  },
  'vegetables-and-fruits': {
    title: 'Vegetables & Fruits',
    categoryName: 'Vegetables & Fruits',
    icon: Carrot,
    description: 'Directly sourced morning harvest: crisp palak, country vine tomatoes, and Ratnagiri Alphonso mangoes.',
  },
  'groceries': {
    title: 'Groceries & Kirana',
    categoryName: 'Groceries',
    icon: Package,
    description: 'Unpolished pulses, stone-milled flours, cold-pressed mara chekku oils and artisanal sourdough bread.',
  },
  'meat-and-other-essentials': {
    title: 'Meat & Other Essentials',
    categoryName: 'Meat & Other Essentials',
    icon: Drumstick,
    description: 'Antibiotic-free curry cuts, tender pasture-fed goat mutton, and fresh daily kitchen essentials.',
  },
};

function CategoryContent() {
  const params = useParams();
  const slug = (params.slug as string) || 'milk-and-dairy';
  const categoryInfo = CATEGORY_MAP[slug] || CATEGORY_MAP['milk-and-dairy'];

  const { products } = useCart();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [modalProduct, setModalProduct] = useState<{ product: Product; variant: ProductVariant } | null>(null);

  // Products in this category
  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category === categoryInfo.categoryName);
  }, [products, categoryInfo]);

  // Extract unique subcategories
  const subCategories = useMemo(() => {
    const list = new Set<string>();
    categoryProducts.forEach((p) => {
      if (p.subCategory) list.add(p.subCategory);
    });
    return ['All', ...Array.from(list)];
  }, [categoryProducts]);

  // Filtered and sorted products
  const displayProducts = useMemo(() => {
    return categoryProducts
      .filter((p) => {
        if (selectedSubCategory === 'All') return true;
        return p.subCategory === selectedSubCategory;
      })
      .sort((a, b) => {
        const priceA = a.variants[0]?.price || 0;
        const priceB = b.variants[0]?.price || 0;
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        // Popular
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      });
  }, [categoryProducts, selectedSubCategory, sortBy]);

  const Icon = categoryInfo.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Header Banner */}
      <div className="bg-[#F1E6DC]/60 rounded-3xl p-6 sm:p-10 border border-[#F1E6DC] relative overflow-hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B5145] hover:text-[#D97A5B] mb-4 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#D97A5B] text-white flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-serif font-black text-[#302B28]">
                {categoryInfo.title}
              </h1>
            </div>
            <p className="text-xs text-[#6B5145] leading-relaxed">
              {categoryInfo.description}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-[#F1E6DC] text-xs font-semibold text-[#302B28] shrink-0">
            <span>{categoryProducts.length} items from neighbourhood stores</span>
          </div>
        </div>
      </div>

      {/* Category Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#F1E6DC]">
        {Object.entries(CATEGORY_MAP).map(([catSlug, catData]) => {
          const isActive = catSlug === slug;
          return (
            <Link
              key={catSlug}
              href={`/categories/${catSlug}`}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition ${
                isActive
                  ? 'bg-[#D97A5B] text-white shadow-xs'
                  : 'bg-white text-[#6B5145] hover:bg-[#F1E6DC] border border-[#F1E6DC]'
              }`}
            >
              {catData.title}
            </Link>
          );
        })}
      </div>

      {/* Subcategory & Sorting Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#F1E6DC]">
        {/* Subcategories */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubCategory(sub)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
                selectedSubCategory === sub
                  ? 'bg-[#302B28] text-white'
                  : 'bg-[#FAF5F0] text-[#6B5145] hover:bg-[#F1E6DC]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Sort by */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#6B5145]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#FAF5F0] border border-[#F1E6DC] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#302B28] focus:outline-none focus:border-[#D97A5B]"
          >
            <option value="popular">Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenRecurringModal={(product, variant) => setModalProduct({ product, variant })}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#F1E6DC] p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-[#302B28]">No items found under this subcategory.</p>
          <button
            onClick={() => setSelectedSubCategory('All')}
            className="text-xs text-[#D97A5B] font-bold underline"
          >
            Show All {categoryInfo.title}
          </button>
        </div>
      )}

      {/* Recurring Modal */}
      <RecurringModal
        isOpen={!!modalProduct}
        product={modalProduct?.product || null}
        variant={modalProduct?.variant || null}
        onClose={() => setModalProduct(null)}
      />
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-xs text-[#6B5145]">Loading category...</div>}>
      <CategoryContent />
    </Suspense>
  );
}

