'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import RecurringModal from '@/components/RecurringModal';
import { ProductVariant } from '@/types';
import {
  Star,
  ShieldCheck,
  Truck,
  Repeat,
  Plus,
  Minus,
  Check,
  ArrowLeft,
  Store,
  Clock,
  Sparkles,
} from 'lucide-react';

function ProductDetailContent() {
  const params = useParams();
  const slug = params.slug as string;
  const { getProductBySlug, addToCart, getVendorById } = useCart();

  const product = getProductBySlug(slug);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants.find((v) => v.id === product.defaultVariantId) || product?.variants[0] || null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedEffect, setAddedEffect] = useState<boolean>(false);
  const [showRecurringModal, setShowRecurringModal] = useState<boolean>(false);

  if (!product || !selectedVariant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#302B28]">Product Not Found</h2>
        <p className="text-xs text-[#6B5145]">This everyday essential is currently not listed.</p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-full bg-[#D97A5B] text-white text-xs font-bold"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const vendor = getVendorById(product.vendorId);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#6B5145]">
        <Link href="/" className="hover:text-[#D97A5B]">Home</Link>
        <span>/</span>
        <Link href={`/store/${product.vendorSlug}`} className="hover:text-[#D97A5B]">{product.vendorName}</Link>
        <span>/</span>
        <span className="text-[#302B28] font-semibold truncate">{product.name}</span>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Product Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#F1E6DC] shadow-sm">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#6B5145] text-xs font-bold px-3 py-1 rounded-full border border-[#F1E6DC]">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Right: Info, Variants, Add to cart */}
        <div className="lg:col-span-6 space-y-6">
          {/* Vendor banner */}
          <Link
            href={`/store/${product.vendorSlug}`}
            className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#F1E6DC] hover:border-[#D97A5B] transition shadow-xs text-xs"
          >
            <Store className="w-4 h-4 text-[#D97A5B]" />
            <span className="font-semibold text-[#302B28]">{product.vendorName}</span>
            <span className="text-[#6B5145]">• {vendor?.distance || '0.8 km'}</span>
          </Link>

          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#302B28] leading-tight">
              {product.name}
            </h1>
            <p className="text-sm text-[#6B5145] mt-2 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Rating & Availability */}
          <div className="flex items-center gap-4 text-xs font-medium">
            {product.rating && (
              <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-[#F1E6DC]">
                <Star className="w-3.5 h-3.5 fill-[#D97A5B] text-[#D97A5B]" />
                <span className="font-bold text-[#302B28]">{product.rating}</span>
                <span className="text-[#6B5145]">neighbourhood rating</span>
              </div>
            )}
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 font-bold">
              In Stock & Ready for Dispatch
            </span>
          </div>

          {/* Price */}
          <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#302B28]">
                ₹{selectedVariant.price * quantity}
              </span>
              {selectedVariant.originalPrice && (
                <span className="text-base text-[#6B5145]/60 line-through">
                  ₹{selectedVariant.originalPrice * quantity}
                </span>
              )}
              <span className="text-xs text-[#6B5145] font-medium">
                (₹{selectedVariant.price} per {selectedVariant.name})
              </span>
            </div>

            {/* Variants options */}
            <div>
              <label className="block text-xs font-bold text-[#302B28] mb-2 uppercase tracking-wider">
                Select Pack / Unit:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#302B28] text-white shadow-xs'
                          : 'bg-[#FAF5F0] text-[#6B5145] hover:bg-[#F1E6DC] border border-[#F1E6DC]'
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className={isSelected ? 'text-[#FAF5F0]/80' : 'text-[#302B28]'}>
                        ₹{v.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available At Store */}
            <div className="pt-2">
              <Link
                href={`/store/${product.vendorSlug}`}
                className="w-full py-3.5 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 bg-[#D97A5B] hover:bg-[#c2694d] text-white shadow-md"
              >
                <Store className="w-4 h-4" />
                <span>Available at {product.vendorName}</span>
              </Link>
            </div>
          </div>

          {/* Detailed description */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-sm text-[#302B28]">Product Highlights & Sourcing</h3>
            <p className="text-xs text-[#6B5145] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Hyperlocal guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-[#FAF5F0] p-3 rounded-2xl border border-[#F1E6DC] flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-[#D97A5B] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#302B28]">Delivered in 15-25m</h4>
                <p className="text-[10px] text-[#6B5145]">Straight from {product.vendorName}</p>
              </div>
            </div>

            <div className="bg-[#FAF5F0] p-3 rounded-2xl border border-[#F1E6DC] flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#D97A5B] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#302B28]">Freshness Guaranteed</h4>
                <p className="text-[10px] text-[#6B5145]">No-questions-asked doorstep replacement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription modal */}
      <RecurringModal
        isOpen={showRecurringModal}
        product={product}
        variant={selectedVariant}
        onClose={() => setShowRecurringModal(false)}
      />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-xs text-[#6B5145]">Loading product details...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}

