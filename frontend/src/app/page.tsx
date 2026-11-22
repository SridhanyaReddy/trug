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
                <span>Live Supabase Catalogue Connected • {currentLocality}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-[#302B28]">
                Your Neighbourhood. <br />
                <span className="text-[#D97A5B]">Everything You Need.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#6B5145] max-w-xl font-normal leading-relaxed">
                Connect with verified local merchants, service providers, and stores right in your locality.
                Instant delivery, verified ratings, and direct neighbourhood checkout.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/shops"
                  className="bg-[#D97A5B] hover:bg-[#c4694d] text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                >
                  <Store className="w-4 h-4" />
                  <span>Browse {vendors.length > 0 ? `${vendors.length} Live Merchants` : 'Shops'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/shops"
                  className="bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] border border-[#6B5145]/20 px-6 py-3.5 rounded-full text-sm font-bold transition flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D97A5B]" />
                  <span>Explore Catalogue ({products.length} Items)</span>
                </Link>
              </div>

              {/* Live Metric Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#F1E6DC] max-w-lg">
                <div>
                  <div className="text-2xl font-black text-[#302B28]">{vendors.length || '25+'}</div>
                  <div className="text-xs text-[#6B5145] font-medium">Verified Partners</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#D97A5B]">{products.length || '10+'}</div>
                  <div className="text-xs text-[#6B5145] font-medium">Live Services/Packages</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#302B28]">100%</div>
                  <div className="text-xs text-[#6B5145] font-medium">Postgres Direct</div>
                </div>
              </div>
            </div>

            {/* Right Media / Live Videos */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#302B28]">
                {headerVideos.length > 0 && headerVideos[0].thumbnail_url ? (
                  <Image
                    src={headerVideos[0].thumbnail_url}
                    alt={headerVideos[0].title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <Image
                    src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800"
                    alt="Hyperlocal Store"
                    fill
                    className="object-cover"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#D97A5B] bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full w-fit mb-2">
                    Verified Hyperlocal Network
                  </span>
                  <h3 className="text-lg font-black">{headerVideos[0]?.title || 'Neighbourhood Direct'}</h3>
                  <p className="text-xs text-[#FAF5F0]/80 mt-1">Real-time availability directly synced with database.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Categories from home_partner_types */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#302B28]">Categories from Database</h2>
            <p className="text-xs sm:text-sm text-[#6B5145] mt-1">Direct from `home_partner_types` table.</p>
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
              href={`/shops?category=${encodeURIComponent(cat.category || cat.title)}`}
              className="group bg-white rounded-2xl p-4 border border-[#F1E6DC] shadow-xs hover:shadow-md transition-all flex flex-col justify-between hover:border-[#D97A5B]/40"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-[#FAF5F0]">
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center font-bold text-white text-lg"
                    style={{ backgroundColor: cat.accent_hex || '#D97A5B' }}
                  >
                    {cat.title.slice(0, 2)}
                  </div>
                )}
                {cat.tag && (
                  <span className="absolute top-2 left-2 bg-[#302B28] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    {cat.tag}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#302B28] group-hover:text-[#D97A5B] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-[#6B5145] line-clamp-2 mt-0.5">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Live Verified Merchants from partner_profiles */}
      <section className="py-14 bg-[#F1E6DC]/40 border-y border-[#F1E6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97A5B] uppercase tracking-wider mb-1">
                <Store className="w-3.5 h-3.5" />
                <span>Live Partner Profiles</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#302B28]">Neighbourhood Merchants</h2>
              <p className="text-xs sm:text-sm text-[#6B5145] mt-1">
                Discovered in {currentLocality} from `partner_profiles`.
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.slice(0, 6).map((vendor) => (
              <ShopCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Live Catalogue from unified_packages */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97A5B] uppercase tracking-wider mb-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Unified Packages Table</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#302B28]">Popular Catalogue Items</h2>
            <p className="text-xs sm:text-sm text-[#6B5145] mt-1">Live from `unified_packages`.</p>
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

      {/* 5. Live Testimonials from home_testimonials */}
      {testimonials.length > 0 && (
        <section className="py-14 bg-white border-t border-[#F1E6DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#302B28] text-center mb-8">
              What Neighbours Are Saying
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-[#FAF5F0] rounded-2xl p-6 border border-[#F1E6DC] flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-[#302B28] italic">"{t.review_text.trim()}"</p>
                  </div>
                  <div className="pt-4 border-t border-[#F1E6DC] mt-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-[#302B28]">{t.author}</div>
                      <div className="text-[10px] text-[#6B5145]">{t.role}</div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
