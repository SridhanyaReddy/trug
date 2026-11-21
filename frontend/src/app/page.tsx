'use client';

import React, { useState } from 'react';
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
  Milk,
  Egg,
  Carrot,
  Package,
  Drumstick,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ShopCard from '@/components/ShopCard';
import ProductCard from '@/components/ProductCard';
import RecurringModal from '@/components/RecurringModal';
import { Product, ProductVariant } from '@/types';

export default function HomePage() {
  const { vendors, products, currentLocality } = useCart();
  const [modalProduct, setModalProduct] = useState<{ product: Product; variant: ProductVariant } | null>(null);

  const categories = [
    {
      name: 'Milk & Dairy',
      slug: 'milk-and-dairy',
      icon: Milk,
      count: '4+ Local Dairies',
      color: 'bg-amber-50 text-amber-800 border-amber-200/80',
    },
    {
      name: 'Eggs',
      slug: 'eggs',
      icon: Egg,
      count: 'Country & Free Range',
      color: 'bg-orange-50 text-orange-800 border-orange-200/80',
    },
    {
      name: 'Vegetables & Fruits',
      slug: 'vegetables-and-fruits',
      icon: Carrot,
      count: 'Direct from Mandi',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    },
    {
      name: 'Groceries',
      slug: 'groceries',
      icon: Package,
      count: 'Kirana & Staples',
      color: 'bg-stone-100 text-stone-800 border-stone-200/80',
    },
    {
      name: 'Meat & Other Essentials',
      slug: 'meat-and-other-essentials',
      icon: Drumstick,
      count: 'Freshly Cut & Packed',
      color: 'bg-red-50 text-red-800 border-red-200/80',
    },
  ];

  const popularProducts = products.filter((p) => p.isPopular);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF5F0] via-[#F1E6DC]/40 to-[#FAF5F0] pt-12 sm:pt-20 pb-14 border-b border-[#F1E6DC]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2.5 bg-white border border-[#D97A5B]/35 px-4 py-1.5 rounded-full text-xs font-semibold text-[#D97A5B] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D97A5B]" />
                <span className="tracking-wide">Hyperlocal Commerce • {currentLocality}</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#302B28] tracking-tight leading-[1.12]">
                  Your Neighbourhood. <br />
                  <span className="text-[#D97A5B] font-black">Everything You Need.</span>
                </h1>
                <p className="text-base sm:text-lg text-[#6B5145] font-normal leading-relaxed max-w-xl">
                  Order morning fresh A2 milk, garden harvest vegetables, unpolished pulses, and oven-baked sourdough directly from trusted independent neighbourhood merchants.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href="/shops"
                  className="px-7 py-3.5 rounded-full bg-[#D97A5B] hover:bg-[#c2694d] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center gap-2.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Nearby Shops</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/recurring"
                  className="px-7 py-3.5 rounded-full bg-white hover:bg-[#F1E6DC] text-[#302B28] font-bold text-sm tracking-wide border border-[#F1E6DC] transition-all shadow-xs flex items-center gap-2"
                >
                  <span>Daily Morning Schedules</span>
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-7 grid grid-cols-3 gap-6 border-t border-[#F1E6DC]/80">
                <div>
                  <div className="font-extrabold text-2xl text-[#302B28] tracking-tight">15-30m</div>
                  <div className="text-xs text-[#6B5145] font-medium mt-0.5">Rapid Local Delivery</div>
                </div>
                <div>
                  <div className="font-extrabold text-2xl text-[#302B28] tracking-tight">100%</div>
                  <div className="text-xs text-[#6B5145] font-medium mt-0.5">Independent Stores</div>
                </div>
                <div>
                  <div className="font-extrabold text-2xl text-[#302B28] tracking-tight">₹0 Fee</div>
                  <div className="text-xs text-[#6B5145] font-medium mt-0.5">On orders above ₹199</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
                  alt="Neighbourhood local grocer"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                {/* Floating pill: Store status */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-[#F1E6DC] flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#D97A5B]/15 text-[#D97A5B] flex items-center justify-center shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#302B28]">Krishna Farm Fresh & Dairy</h4>
                      <p className="text-[11px] text-[#6B5145] font-medium mt-0.5">0.4 km away • 15 min delivery</p>
                    </div>
                  </div>
                  <Link
                    href="/store/krishna-dairy-farm"
                    className="p-2.5 rounded-xl bg-[#D97A5B] text-white hover:bg-[#c2694d] transition shrink-0 shadow-xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Offers & Promotional Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Banner 1 */}
          <div className="relative overflow-hidden rounded-3xl bg-[#6B5145] text-white p-7 sm:p-9 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-[#FAF5F0] px-3 py-1 rounded-full inline-block">
                Neighbourhood Special
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FAF5F0] tracking-tight">
                Fresh A2 Milk Subscription
              </h3>
              <p className="text-xs sm:text-sm text-[#FAF5F0]/85 font-normal leading-relaxed max-w-sm">
                Get morning farm milk delivered by 7:00 AM every day. Enjoy 10% off on your first month with Krishna Dairy.
              </p>
            </div>
            <div className="pt-7 relative z-10">
              <Link
                href="/store/krishna-dairy-farm"
                className="inline-flex items-center gap-2 text-xs font-bold bg-[#D97A5B] hover:bg-[#c2694d] text-white px-5 py-2.5 rounded-full transition shadow-xs tracking-wide"
              >
                <span>Subscribe Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none">
              <Image
                src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80"
                alt="Fresh Milk"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Banner 2 */}
          <div className="relative overflow-hidden rounded-3xl bg-[#D97A5B] text-white p-7 sm:p-9 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 text-white px-3 py-1 rounded-full inline-block">
                Zero Middlemen
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Farm Greens Harvested Today
              </h3>
              <p className="text-xs sm:text-sm text-white/90 font-normal leading-relaxed max-w-sm">
                Organic spinach, desi tomatoes and sweet Alphonso mangoes brought directly from local farms.
              </p>
            </div>
            <div className="pt-7 relative z-10">
              <Link
                href="/categories/vegetables-and-fruits"
                className="inline-flex items-center gap-2 text-xs font-bold bg-[#302B28] hover:bg-black text-white px-5 py-2.5 rounded-full transition shadow-xs tracking-wide"
              >
                <span>Shop Fresh Produce</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none">
              <Image
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80"
                alt="Fresh Vegetables"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5145] font-normal mt-0.5">
              Everyday household essentials from verified stores
            </p>
          </div>
          <Link
            href="/categories/milk-and-dairy"
            className="text-xs font-bold text-[#D97A5B] hover:underline flex items-center gap-1 tracking-wide"
          >
            <span>All Categories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group bg-white rounded-3xl p-5 border border-[#F1E6DC] hover:border-[#D97A5B] hover:shadow-md transition text-center flex flex-col items-center justify-between"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition duration-300 border ${cat.color}`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#302B28] group-hover:text-[#D97A5B] transition">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#6B5145] font-medium mt-1">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Nearby Independent Shops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
                Nearby Independent Stores
              </h2>
              <span className="text-[11px] bg-white text-[#6B5145] px-2.5 py-0.5 rounded-full border border-[#F1E6DC] font-semibold">
                Within 2 km
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6B5145] font-normal mt-0.5">
              Order directly from your local neighbourhood retail champions
            </p>
          </div>
          <Link
            href="/shops"
            className="text-xs font-bold text-[#D97A5B] hover:underline flex items-center gap-1 tracking-wide"
          >
            <span>View All ({vendors.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.slice(0, 3).map((vendor) => (
            <ShopCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </section>

      {/* 5. Popular Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
              Popular in Your Neighbourhood
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5145] font-normal mt-0.5">
              Frequently ordered by households around {currentLocality.split(',')[0]}
            </p>
          </div>
          <Link
            href="/categories/groceries"
            className="text-xs font-bold text-[#D97A5B] hover:underline flex items-center gap-1 tracking-wide"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {popularProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenRecurringModal={(product, variant) => setModalProduct({ product, variant })}
            />
          ))}
        </div>
      </section>

      {/* 6. How TRUG Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF5F0] rounded-3xl border border-[#F1E6DC] p-8 sm:p-12 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97A5B] bg-white px-3.5 py-1 rounded-full border border-[#D97A5B]/25">
              The Hyperlocal Model
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#302B28] mt-3 tracking-tight">
              How TRUG Works
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5145] font-normal mt-2 leading-relaxed">
              Unlike warehouse dark stores, TRUG champions your actual street-side shops with separate orders, fair prices and instant neighbourhood delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-7 border border-[#F1E6DC] shadow-xs text-center space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#D97A5B]/15 text-[#D97A5B] mx-auto flex items-center justify-center font-extrabold text-lg">
                1
              </div>
              <h3 className="font-bold text-sm text-[#302B28]">Choose Your Local Store</h3>
              <p className="text-xs text-[#6B5145] font-normal leading-relaxed">
                Scan store QR code or select a nearby shop from your area. Browse live stock and prices.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-7 border border-[#F1E6DC] shadow-xs text-center space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#D97A5B]/15 text-[#D97A5B] mx-auto flex items-center justify-center font-extrabold text-lg">
                2
              </div>
              <h3 className="font-bold text-sm text-[#302B28]">Dedicated Vendor Cart</h3>
              <p className="text-xs text-[#6B5145] font-normal leading-relaxed">
                Orders are checked out per vendor ensuring freshly prepared cuts, unadulterated milk and crisp produce.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-7 border border-[#F1E6DC] shadow-xs text-center space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#D97A5B]/15 text-[#D97A5B] mx-auto flex items-center justify-center font-extrabold text-lg">
                3
              </div>
              <h3 className="font-bold text-sm text-[#302B28]">15-30 Min Doorstep or Pickup</h3>
              <p className="text-xs text-[#6B5145] font-normal leading-relaxed">
                A nearby partner brings the order right to your gate, or walk in to pickup ready-packed bags.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Modal Helper */}
      <RecurringModal
        isOpen={!!modalProduct}
        product={modalProduct?.product || null}
        variant={modalProduct?.variant || null}
        onClose={() => setModalProduct(null)}
      />
    </div>
  );
}
