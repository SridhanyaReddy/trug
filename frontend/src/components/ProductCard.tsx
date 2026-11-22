'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/context/CartContext';
import { Plus, Minus, Check, Star, Repeat } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenRecurringModal?: (product: Product, variant: ProductVariant) => void;
}

export default function ProductCard({ product, onOpenRecurringModal }: ProductCardProps) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants.find((v) => v.id === product.defaultVariantId) || product.variants[0]
  );

  const cartItem = cartItems.find(
    (item) => item.product.id === product.id && item.variant.id === selectedVariant.id
  );
  const currentQty = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedVariant, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) updateQuantity(cartItem.cartItemId, currentQty + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) updateQuantity(cartItem.cartItemId, currentQty - 1);
  };

  return (
    <div className="group bg-white rounded-3xl p-3.5 sm:p-4 border border-[#F1E6DC] hover:border-[#D97A5B]/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between relative">
      {/* Badges */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-1 items-start">
        {product.badge && (
          <span className="bg-[#FAF5F0]/95 backdrop-blur-xs text-[#6B5145] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#F1E6DC] shadow-xs">
            {product.badge}
          </span>
        )}
        {product.isOrganic && (
          <span className="bg-[#FAF5F0]/95 backdrop-blur-xs text-[#D97A5B] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#D97A5B]/20">
            Organic
          </span>
        )}
      </div>

      {/* Image and link */}
      <div>
        <Link href={`/product/${product.slug}`} className="block relative aspect-4/3 rounded-2xl overflow-hidden bg-[#FAF5F0] mb-3">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </Link>

        {/* Vendor tag */}
        <div className="flex items-center justify-between text-[11px] mb-1">
          <Link
            href={`/store/${product.vendorSlug}`}
            className="text-[#6B5145] hover:text-[#D97A5B] font-semibold truncate max-w-[180px]"
          >
            {product.vendorName}
          </Link>
          {product.rating && (
            <div className="flex items-center gap-1 text-[#302B28] font-bold text-[11px]">
              <Star className="w-3 h-3 fill-[#D97A5B] text-[#D97A5B]" />
              <span>{product.rating}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="font-bold text-sm text-[#302B28] group-hover:text-[#D97A5B] transition line-clamp-1 leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-[#6B5145] font-normal line-clamp-2 mt-1 min-h-[32px] leading-relaxed">
            {product.shortDescription}
          </p>
        </Link>

        {/* Variants Selector */}
        {product.variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariant(v);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition ${
                  selectedVariant.id === v.id
                    ? 'bg-[#302B28] text-white shadow-xs'
                    : 'bg-[#FAF5F0] text-[#6B5145] hover:bg-[#F1E6DC] border border-[#F1E6DC]'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pricing & Store Details */}
      <div className="mt-4 pt-3.5 border-t border-[#F1E6DC]/70 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-base text-[#302B28]">₹{selectedVariant.price}</span>
            {selectedVariant.originalPrice && (
              <span className="text-xs text-[#6B5145]/60 font-medium line-through">
                ₹{selectedVariant.originalPrice}
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#6B5145] block font-semibold">
            {selectedVariant.name}
          </span>
        </div>

        {/* Zepto-Style Stepper / Add Button */}
        <div>
          {currentQty > 0 ? (
            <div className="flex items-center bg-[#D97A5B] text-white rounded-xl px-2 py-1 gap-2 shadow-xs">
              <button
                onClick={handleDecrement}
                className="w-5 h-5 rounded-md hover:bg-black/15 flex items-center justify-center font-black"
                title="Decrease"
              >
                <Minus className="w-3 h-3 text-white" />
              </button>
              <span className="text-xs font-black min-w-3 text-center">{currentQty}</span>
              <button
                onClick={handleIncrement}
                className="w-5 h-5 rounded-md hover:bg-black/15 flex items-center justify-center font-black"
                title="Increase"
              >
                <Plus className="w-3 h-3 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-[#FAF5F0] hover:bg-[#D97A5B] text-[#D97A5B] hover:text-white border border-[#D97A5B] shadow-2xs tracking-wide uppercase"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
