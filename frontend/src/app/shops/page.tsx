'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import ShopCard from '@/components/ShopCard';
import { Search, Filter, SlidersHorizontal, MapPin, Star, Clock, Store } from 'lucide-react';

function ShopsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const { vendors, categories: dbCategories, currentLocality } = useCart();

  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [onlyOpen, setOnlyOpen] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'reviews'>('rating');

  // Derive unique categories dynamically from live database vendors and categories
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    vendors.forEach((v) => {
      if (v.category) set.add(v.category);
    });
    dbCategories.forEach((c: any) => {
      if (c.title) set.add(c.title);
      if (c.category) set.add(c.category);
    });
    return ['All', ...Array.from(set)];
  }, [vendors, dbCategories]);

  const filteredVendors = useMemo(() => {
    return vendors
      .filter((v) => {
        const matchesSearch =
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.tagline.toLowerCase().includes(search.toLowerCase()) ||
          v.category.toLowerCase().includes(search.toLowerCase()) ||
          (v.categories && v.categories.some((c) => c.toLowerCase().includes(search.toLowerCase())));

        const matchesCategory =
          selectedCategory === 'All' ||
          v.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          (v.categories && v.categories.some((c) => c.toLowerCase().includes(selectedCategory.toLowerCase())));

        const matchesOpen = !onlyOpen || v.isOpen;
        const matchesRating = v.rating >= minRating;

        return matchesSearch && matchesCategory && matchesOpen && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
        return parseFloat(a.distance || '0.5') - parseFloat(b.distance || '0.5');
      });
  }, [vendors, search, selectedCategory, onlyOpen, minRating, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F1E6DC] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D97A5B]">
            <MapPin className="w-3.5 h-3.5" />
            <span>Serving {currentLocality}</span>
          </div>
          <h1 className="text-3xl font-black text-[#302B28] mt-1">
            Live Partner Storefronts
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5145] mt-1">
            Displaying live merchant profiles directly from Supabase `partner_profiles`.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B5145]/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stores or category..."
            className="w-full bg-white border border-[#F1E6DC] rounded-full pl-10 pr-4 py-2 text-xs font-semibold focus:outline-hidden focus:border-[#D97A5B] transition shadow-xs text-[#302B28]"
          />
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition shrink-0 ${
              selectedCategory === cat
                ? 'bg-[#D97A5B] text-white shadow-xs'
                : 'bg-white hover:bg-[#F1E6DC] text-[#6B5145] border border-[#F1E6DC]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters & Results Counter */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#F1E6DC] shadow-xs">
        <div className="text-xs font-bold text-[#302B28]">
          Found <span className="text-[#D97A5B]">{filteredVendors.length}</span> live merchants
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          {/* Min Rating */}
          <div className="flex items-center gap-1.5 bg-[#FAF5F0] px-3 py-1.5 rounded-xl border border-[#F1E6DC]">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="bg-transparent focus:outline-hidden text-[#302B28] cursor-pointer"
            >
              <option value={0}>All Ratings</option>
              <option value={4.5}>4.5+ Stars</option>
              <option value={4.8}>4.8+ Stars</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5 bg-[#FAF5F0] px-3 py-1.5 rounded-xl border border-[#F1E6DC]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B5145]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-hidden text-[#302B28] cursor-pointer"
            >
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="distance">Nearest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Store Cards */}
      {filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <ShopCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#F1E6DC] space-y-3">
          <Store className="w-10 h-10 text-[#6B5145]/40 mx-auto" />
          <h3 className="font-extrabold text-base text-[#302B28]">No merchants found</h3>
          <p className="text-xs text-[#6B5145] max-w-sm mx-auto">
            Try adjusting your search or selected category filter.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ShopsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF5F0] p-8 text-center text-xs font-bold">Loading live shops from database...</div>}>
      <ShopsContent />
    </Suspense>
  );
}
