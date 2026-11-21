'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Store,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    vendorCarts,
    updateQuantity,
    removeFromCart,
    clearCartForVendor,
    totalCartItemCount,
  } = useCart();

  const vendorIds = Object.keys(vendorCarts);

  if (totalCartItemCount === 0 || vendorIds.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-[#F1E6DC] text-[#6B5145] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-serif font-black text-[#302B28]">Your Cart is Empty</h2>
          <p className="text-xs text-[#6B5145] max-w-sm mx-auto">
            Explore trusted neighbourhood grocers, dairies, and bakeries around your street to add items.
          </p>
        </div>
        <Link
          href="/shops"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D97A5B] hover:bg-[#c2694d] text-white text-xs font-bold transition shadow-md"
        >
          <span>Discover Local Stores</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97A5B]" />
          <h1 className="text-3xl font-serif font-black text-[#302B28]">
            Neighbourhood Shopping Bag
          </h1>
        </div>
        <p className="text-xs text-[#6B5145] mt-1">
          TRUG guarantees separate checkouts per vendor for uncompromised fresh packaging and direct store dispatch.
        </p>
      </div>

      {/* Explanatory Multi-Vendor Notice */}
      <div className="bg-[#F1E6DC]/70 border border-[#F1E6DC] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#6B5145]">
        <Sparkles className="w-4 h-4 text-[#D97A5B] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#302B28]">Why separate checkouts? </span>
          Independent shops prepare their orders independently. Each cart represents a dedicated trip from that merchant straight to your gate in 15-30 minutes.
        </div>
      </div>

      {/* Vendor Specific Carts */}
      <div className="space-y-8">
        {vendorIds.map((vId) => {
          const group = vendorCarts[vId];
          const { vendor, items, subtotal, deliveryFee, total, isMinOrderMet } = group;

          return (
            <div
              key={vId}
              className="bg-white rounded-3xl border border-[#F1E6DC] overflow-hidden shadow-sm"
            >
              {/* Store header in cart */}
              <div className="bg-[#FAF5F0] p-4 sm:p-5 border-b border-[#F1E6DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#F1E6DC] bg-white shrink-0">
                    <Image
                      src={vendor.logo}
                      alt={vendor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/store/${vendor.slug}`}
                      className="font-bold text-base text-[#302B28] hover:text-[#D97A5B] transition flex items-center gap-1.5"
                    >
                      <span>{vendor.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-[#6B5145] mt-0.5">
                      <Clock className="w-3 h-3 text-[#D97A5B]" />
                      <span>{vendor.deliveryTime} arrival</span>
                      <span>•</span>
                      <span>{vendor.distance}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => clearCartForVendor(vId)}
                  className="text-xs text-[#6B5145] hover:text-red-600 transition flex items-center gap-1 self-start sm:self-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear store items</span>
                </button>
              </div>

              {/* Items List */}
              <div className="p-4 sm:p-6 divide-y divide-[#F1E6DC]/60">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF5F0] border border-[#F1E6DC] shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#302B28]">
                          {item.product.name}
                        </h4>
                        <span className="text-xs text-[#6B5145] font-medium block">
                          Unit: {item.variant.name} • ₹{item.variant.price} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 bg-[#FAF5F0] px-2 py-1 rounded-xl border border-[#F1E6DC]">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white text-[#302B28] flex items-center justify-center font-bold text-xs shadow-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-white text-[#302B28] flex items-center justify-center font-bold text-xs shadow-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-right">
                        <span className="font-bold text-sm text-[#302B28] block">
                          ₹{item.variant.price * item.quantity}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[#6B5145] hover:text-red-600 p-1 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vendor Order Summary Footer */}
              <div className="bg-[#FAF5F0]/60 p-4 sm:p-6 border-t border-[#F1E6DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs text-[#6B5145]">
                  <div className="flex items-center gap-4">
                    <span>Store Subtotal: <strong className="text-[#302B28]">₹{subtotal}</strong></span>
                    <span>Delivery: <strong className="text-[#302B28]">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</strong></span>
                    <span>Total: <strong className="text-sm font-black text-[#D97A5B]">₹{total}</strong></span>
                  </div>
                  {!isMinOrderMet && (
                    <div className="text-amber-800 flex items-center gap-1 font-medium text-[11px]">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      <span>Minimum order for this shop is ₹{vendor.minimumOrder}. Add ₹{vendor.minimumOrder - subtotal} more.</span>
                    </div>
                  )}
                </div>

                <button
                  disabled={!isMinOrderMet}
                  onClick={() => router.push(`/checkout/${vId}`)}
                  className={`px-6 py-3 rounded-2xl font-bold text-xs tracking-wide transition shadow-md flex items-center gap-2 ${
                    isMinOrderMet
                      ? 'bg-[#D97A5B] hover:bg-[#c2694d] text-white'
                      : 'bg-[#F1E6DC] text-[#6B5145] cursor-not-allowed'
                  }`}
                >
                  <span>Checkout {vendor.name.split(' ')[0]} (₹{total})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

