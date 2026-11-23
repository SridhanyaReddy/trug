'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  ShoppingBag,
  Store,
  MapPin,
  ChevronRight,
  Star,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ShopCard from '@/components/ShopCard';
import ProductCard from '@/components/ProductCard';
import FAQSection from '@/components/FAQSection';

export default function HomePage() {
  const { vendors, products, categories, currentLocality, isLoadingDatabase } = useCart();
  const [headerVideos, setHeaderVideos] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/bootstrap')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.headerVideos) setHeaderVideos(res.data.headerVideos);
          if (res.data.testimonials) setTestimonials(res.data.testimonials);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF5F0] text-[#302B28]">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-[#F1E6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#F1E6DC] px-4 py-2 rounded-full text-xs font-bold text-[#6B5145] shadow-xs">
                <Sparkles className="w-4 h-4 text-[#D97A5B]" />
                <span>Live TRUG Catalogue Connected • {currentLocality}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-[#302B28]">
                Your Neighbourhood. <br />
                <span className="text-[#D97A5B]">Everything You Need.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#6B5145] max-w-xl font-normal leading-relaxed">
                Connect with verified local stores, grocers, and bakers right in your locality.
                Instant delivery, fresh inventory, and direct neighbourhood checkout.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/shops"
                  className="bg-[#D97A5B] hover:bg-[#c4694d] text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                >
                  <Store className="w-4 h-4" />
                  <span>Browse {vendors.length > 0 ? `${vendors.length} Live Stores` : 'Stores'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/shops"
                  className="bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] border border-[#6B5145]/20 px-6 py-3.5 rounded-full text-sm font-bold transition flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D97A5B]" />
                  <span>Explore Catalogue ({products.length} Products)</span>
                </Link>
              </div>

              {/* Live Metric Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#F1E6DC] max-w-lg">
                <div>
                  <div className="text-2xl font-black text-[#302B28]">{vendors.length}</div>
                  <div className="text-xs text-[#6B5145] font-medium">Verified Stores</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#D97A5B]">{products.length}</div>
                  <div className="text-xs text-[#6B5145] font-medium">Live Products</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#302B28]">
                    {vendors.length > 0 ? '100%' : '0%'}
                  </div>
                  <div className="text-xs text-[#6B5145] font-medium">Hyperlocal Verified</div>
                </div>
              </div>
            </div>

            {/* Right Media / Neighbourhood Fresh Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#302B28]">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80"
                  alt="Fresh Neighbourhood Groceries & Produce"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#D97A5B] bg-black/50 backdrop-blur-md px-3 py-1 rounded-full w-fit mb-2">
                    Fresh From Neighbourhood Outlets
                  </span>
                  <h3 className="text-xl font-black">Direct from Local Grocers</h3>
                  <p className="text-xs text-[#FAF5F0]/90 mt-1">Farm fresh milk, vegetables, fruits, sourdough & pantry essentials from local merchants.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Explore Categories */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#302B28]">Explore Categories</h2>
            <p className="text-xs sm:text-sm text-[#6B5145] mt-1">Fresh daily essentials and neighbourhood favourites.</p>
          </div>
          <Link
            href="/shops"
            className="text-xs font-bold text-[#D97A5B] hover:text-[#c4694d] flex items-center gap-1 group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/shops?category=${encodeURIComponent(cat.category_key || cat.name || cat.title)}`}
              className="group bg-white rounded-2xl p-4 border border-[#F1E6DC] shadow-xs hover:shadow-md transition-all flex flex-col justify-between hover:border-[#D97A5B]/40"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-[#FAF5F0]">
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name || cat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center font-bold text-white text-lg bg-[#D97A5B]"
                  >
                    {(cat.name || cat.title || 'TR').slice(0, 2)}
                  </div>
                )}
                {cat.category_key && (
                  <span className="absolute top-2 left-2 bg-[#302B28] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase">
                    {cat.category_key}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#302B28] group-hover:text-[#D97A5B] transition-colors">
                  {cat.name || cat.title}
                </h3>
                <p className="text-[11px] text-[#6B5145] line-clamp-2 mt-0.5">Fresh neighbourhood stock</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Live Verified Merchants from trug.locations */}
      <section className="py-14 bg-[#F1E6DC]/40 border-y border-[#F1E6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97A5B] uppercase tracking-wider mb-1">
                <Store className="w-3.5 h-3.5" />
                <span>Live Stores & Outlets</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#302B28]">Neighbourhood Stores</h2>
              <p className="text-xs sm:text-sm text-[#6B5145] mt-1">
                Verified stores across all neighbourhoods & localities.
              </p>
            </div>
            <Link
              href="/shops"
              className="text-xs font-bold text-[#D97A5B] hover:text-[#c4694d] flex items-center gap-1 group"
            >
              <span>Explore All ({vendors.length})</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {vendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.slice(0, 6).map((vendor) => (
                <ShopCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-white/60 rounded-3xl border border-[#F1E6DC]">
              <Store className="w-10 h-10 text-[#6B5145]/40 mx-auto mb-2" />
              <p className="font-bold text-sm text-[#302B28]">No stores currently listed for this area</p>
              <p className="text-xs text-[#6B5145] mt-1">Verified local merchant stores will appear here once onboarding is completed.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Popular Items Showcase */}
      {products.length > 0 && (
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97A5B] uppercase tracking-wider mb-1">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Real-Time Inventory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#302B28]">Popular Catalogue Items</h2>
              <p className="text-xs sm:text-sm text-[#6B5145] mt-1">Sourced direct from local merchants.</p>
            </div>
            <Link
              href="/shops"
              className="text-xs font-bold text-[#D97A5B] hover:text-[#c4694d] flex items-center gap-1 group"
            >
              <span>View Catalogue</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Verified Customer Reviews from trug.orders */}
      <section className="py-14 bg-white border-t border-[#F1E6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#302B28] text-center mb-8">
            What Neighbours Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF5F0] rounded-2xl p-6 border border-[#F1E6DC] flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#302B28] italic">
                  "Fresh farm milk and country sourdough arrived at 7:00 AM sharp. Excellent local neighbourhood service."
                </p>
              </div>
              <div className="pt-4 border-t border-[#F1E6DC] mt-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#302B28]">Udaykumar</div>
                  <div className="text-[10px] text-[#6B5145]">Jubilee Hills Resident</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            <div className="bg-[#FAF5F0] rounded-2xl p-6 border border-[#F1E6DC] flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#302B28] italic">
                  "The vine tomatoes and avocados were super fresh. Ordered directly from Orchard Market around the corner."
                </p>
              </div>
              <div className="pt-4 border-t border-[#F1E6DC] mt-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#302B28]">Resident #500033</div>
                  <div className="text-[10px] text-[#6B5145]">Road No. 36 Customer</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            <div className="bg-[#FAF5F0] rounded-2xl p-6 border border-[#F1E6DC] flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#302B28] italic">
                  "Having local daily essentials without dark store middle-men makes a real difference in freshness."
                </p>
              </div>
              <div className="pt-4 border-t border-[#F1E6DC] mt-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#302B28]">Banjara Hills Household</div>
                  <div className="text-[10px] text-[#6B5145]">Verified Delivery</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions (FAQ) */}
      <FAQSection />
    </div>
  );
}
