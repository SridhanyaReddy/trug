'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { useCart } from '@/context/CartContext';
import ShopCard from '@/components/ShopCard';
import { Search, Filter, SlidersHorizontal, MapPin, Star, Clock } from 'lucide-react';

function ShopsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { vendors, currentLocality } = useCart();

  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyOpen, setOnlyOpen] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'reviews'>('distance');

  const categories = [
    'All',
    'Dairy & Essentials',
    'Farm Fresh',
    'Groceries',
    'Daily Meat & Eggs',
    'Artisan Bakery',
  ];

  const filteredVendors = useMemo(() => {
    return vendors
      .filter((v) => {
        // Search
        const matchesSearch =
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.tagline.toLowerCase().includes(search.toLowerCase()) ||
          v.category.toLowerCase().includes(search.toLowerCase()) ||
          v.categories.some((c) => c.toLowerCase().includes(search.toLowerCase()));

        // Category filter
        const matchesCategory =
          selectedCategory === 'All' || v.category === selectedCategory;

        // Open filter
        const matchesOpen = !onlyOpen || v.isOpen;

        // Rating
        const matchesRating = v.rating >= minRating;

        return matchesSearch && matchesCategory && matchesOpen && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
        // distance default
        return parseFloat(a.distance) - parseFloat(b.distance);
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
          <h1 className="text-3xl font-serif font-black text-[#302B28] mt-1">
            Browse Nearby Shops
          </h1>
          <p className="text-xs text-[#6B5145] mt-1">
            Found {filteredVendors.length} independent local stores within walking distance
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stores or items..."
            className="w-full pl-9 pr-4 py-2 bg-white text-xs text-[#302B28] rounded-full border border-[#F1E6DC] focus:outline-none focus:border-[#D97A5B] shadow-xs"
          />
          <Search className="w-4 h-4 text-[#6B5145] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Filter and Sorting Controls */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-[#302B28] text-white shadow-xs'
                  : 'bg-white text-[#6B5145] hover:bg-[#F1E6DC] border border-[#F1E6DC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#F1E6DC]">
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#302B28]">
            {/* Open now switch */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyOpen}
                onChange={(e) => setOnlyOpen(e.target.checked)}
                className="rounded accent-[#D97A5B] w-4 h-4"
              />
              <span>Open Now Only</span>
            </label>

            <span className="text-[#F1E6DC]">|</span>

            {/* Min Rating */}
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#D97A5B]" />
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-[#FAF5F0] border border-[#F1E6DC] rounded-lg px-2 py-1 text-xs text-[#302B28] focus:outline-none focus:border-[#D97A5B]"
              >
                <option value={0}>All Ratings</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.8}>4.8+ Stars</option>
              </select>
            </div>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#6B5145]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF5F0] border border-[#F1E6DC] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#302B28] focus:outline-none focus:border-[#D97A5B]"
            >
              <option value="distance">Distance (Nearest First)</option>
              <option value="rating">Customer Rating</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Shops */}
      {filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <ShopCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-[#F1E6DC] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF5F0] text-[#6B5145] flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#302B28]">No stores found</h3>
          <p className="text-xs text-[#6B5145] max-w-sm mx-auto">
            We couldn't find any neighbourhood shops matching your filters. Try clearing your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setOnlyOpen(false);
              setMinRating(0);
            }}
            className="px-4 py-2 bg-[#D97A5B] text-white text-xs font-bold rounded-full hover:bg-[#c2694d] transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ShopsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-xs text-[#6B5145]">Finding neighbourhood shops...</div>}>
      <ShopsContent />
    </Suspense>
  );
}

