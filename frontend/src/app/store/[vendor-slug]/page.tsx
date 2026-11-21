'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Image from 'next/image';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import RecurringModal from '@/components/RecurringModal';
import { Product, ProductVariant } from '@/types';
import {
  MapPin,
  Clock,
  Phone,
  Share2,
  QrCode,
  Star,
  Search,
  ShieldCheck,
  Check,
  Sparkles,
  ArrowLeft,
  X,
} from 'lucide-react';

function StoreFrontContent() {
  const params = useParams();
  const slug = params['vendor-slug'] as string;
  const { getVendorBySlug, getProductsByVendor, showToast } = useCart();

  const vendor = getVendorBySlug(slug);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [inStoreSearch, setInStoreSearch] = useState<string>('');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [modalProduct, setModalProduct] = useState<{ product: Product; variant: ProductVariant } | null>(null);

  if (!vendor) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#302B28]">Store Not Found</h2>
        <p className="text-xs text-[#6B5145]">
          The neighbourhood shop you are looking for does not exist or has relocated.
        </p>
        <Link
          href="/shops"
          className="inline-block px-5 py-2.5 rounded-full bg-[#D97A5B] text-white text-xs font-bold"
        >
          Browse Active Shops
        </Link>
      </div>
    );
  }

  const products = getProductsByVendor(vendor.id);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(inStoreSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(inStoreSearch.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' ||
        p.subCategory === activeCategory ||
        p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, inStoreSearch, activeCategory]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Store link copied to clipboard!');
    }
  };

  return (
    <div className="pb-16 space-y-8">
      {/* 1. Cover & Header Banner */}
      <div className="relative bg-[#302B28] text-white">
        {/* Cover Photo */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden opacity-45">
          <Image
            src={vendor.coverImage}
            alt={vendor.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#302B28] via-[#302B28]/60 to-transparent" />

        {/* Back Link */}
        <div className="absolute top-4 left-4 sm:left-8 z-10">
          <Link
            href="/shops"
            className="bg-black/40 hover:bg-black/60 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Stores</span>
          </Link>
        </div>

        {/* Store Profile Floating Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 sm:-mt-28 z-20 pb-6">
          <div className="bg-[#FAF5F0] rounded-3xl p-6 sm:p-8 border border-[#F1E6DC] text-[#302B28] shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left: Logo & Details */}
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white shrink-0">
                  <Image
                    src={vendor.logo}
                    alt={vendor.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        vendor.isOpen
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {vendor.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                    <span className="text-xs text-[#6B5145] font-semibold">
                      {vendor.category}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#302B28]">
                    {vendor.name}
                  </h1>

                  <p className="text-xs text-[#6B5145] max-w-xl">
                    {vendor.tagline}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B5145] pt-1 font-medium">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#D97A5B] text-[#D97A5B]" />
                      <span className="font-bold text-[#302B28]">{vendor.rating}</span>
                      <span>({vendor.reviewsCount} reviews)</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D97A5B]" />
                      <span>{vendor.deliveryTime}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#D97A5B]" />
                      <span>{vendor.address.locality} ({vendor.distance})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                <button
                  onClick={handleShare}
                  className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#F1E6DC] text-[#302B28] font-bold text-xs border border-[#F1E6DC] transition flex items-center gap-1.5 shadow-xs"
                >
                  <Share2 className="w-4 h-4 text-[#D97A5B]" />
                  <span>Share Store</span>
                </button>

                <button
                  onClick={() => setShowQrModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-[#302B28] hover:bg-black text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                >
                  <QrCode className="w-4 h-4 text-[#D97A5B]" />
                  <span>Store QR</span>
                </button>
              </div>
            </div>

            {/* Timings and Notice Banner */}
            <div className="mt-6 pt-5 border-t border-[#F1E6DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#6B5145]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#302B28]">Operating Hours:</span>
                <span>{vendor.timings}</span>
                <span className="text-[#F1E6DC]">|</span>
                <span className="font-semibold text-[#302B28]">Phone:</span>
                <span>{vendor.phone}</span>
              </div>

              {vendor.notice && (
                <div className="bg-[#F1E6DC] text-[#302B28] px-3 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D97A5B]" />
                  <span>{vendor.notice}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. In-Store Product Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategory('All')}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition ${
                activeCategory === 'All'
                  ? 'bg-[#D97A5B] text-white shadow-xs'
                  : 'bg-white text-[#6B5145] hover:bg-[#F1E6DC] border border-[#F1E6DC]'
              }`}
            >
              All Items ({products.length})
            </button>
            {vendor.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition ${
                  activeCategory === cat
                    ? 'bg-[#D97A5B] text-white shadow-xs'
                    : 'bg-white text-[#6B5145] hover:bg-[#F1E6DC] border border-[#F1E6DC]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search inside this store */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              value={inStoreSearch}
              onChange={(e) => setInStoreSearch(e.target.value)}
              placeholder={`Search in ${vendor.name.split(' ')[0]}...`}
              className="w-full pl-9 pr-4 py-2 bg-white text-xs text-[#302B28] rounded-full border border-[#F1E6DC] focus:outline-none focus:border-[#D97A5B] shadow-xs"
            />
            <Search className="w-3.5 h-3.5 text-[#6B5145] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onOpenRecurringModal={(product, variant) =>
                  setModalProduct({ product, variant })
                }
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#F1E6DC] p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-[#302B28]">
              No products found matching &quot;{inStoreSearch}&quot;.
            </p>
            <button
              onClick={() => {
                setInStoreSearch('');
                setActiveCategory('All');
              }}
              className="text-xs text-[#D97A5B] font-bold underline"
            >
              View Full Store Catalogue
            </button>
          </div>
        )}
      </div>

      {/* QR Code Modal for Storefront Sharing */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 border border-[#F1E6DC] shadow-2xl relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1 text-[#6B5145] hover:text-[#302B28]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97A5B]">
                Storefront QR Code
              </span>
              <h3 className="text-lg font-serif font-bold text-[#302B28]">{vendor.name}</h3>
              <p className="text-xs text-[#6B5145]">
                Customers scan this in-store to view live menu, order online, or set up subscriptions.
              </p>
            </div>

            <div className="p-4 bg-[#FAF5F0] rounded-2xl border border-[#F1E6DC] inline-block mx-auto">
              {/* QR visual placeholder */}
              <div className="relative w-44 h-44 mx-auto">
                <Image
                  src={vendor.qrCodeUrl}
                  alt={`${vendor.name} QR Code`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="text-[11px] text-[#6B5145] space-y-1">
              <p className="font-mono break-all text-[10px] bg-[#FAF5F0] p-2 rounded-lg border border-[#F1E6DC]">
                https://trug.focsera.com/store/{vendor.slug}
              </p>
              <p>Printable high-resolution counter display ready.</p>
            </div>
          </div>
        </div>
      )}

      {/* Daily recurring modal */}
      <RecurringModal
        isOpen={!!modalProduct}
        product={modalProduct?.product || null}
        variant={modalProduct?.variant || null}
        onClose={() => setModalProduct(null)}
      />
    </div>
  );
}

export default function StoreFrontPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-xs text-[#6B5145]">Loading storefront...</div>}>
      <StoreFrontContent />
    </Suspense>
  );
}

