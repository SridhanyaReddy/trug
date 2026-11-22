'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Clock, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export default function CartDrawer({ isOpen, onClose, onOpenAuth }: CartDrawerProps) {
  const { cartItems, removeFromCart, updateQuantity, clearEntireCart, totalCartItemCount, isLoggedIn } = useCart();

  if (!isOpen) return null;

  const itemTotal = cartItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
  const deliveryFee = itemTotal > 0 ? (itemTotal > 500 ? 0 : 25) : 0;
  const platformFee = itemTotal > 0 ? 5 : 0;
  const grandTotal = itemTotal + deliveryFee + platformFee;

  const handleCheckoutClick = () => {
    if (!isLoggedIn) {
      onOpenAuth();
    } else {
      alert('Order placed successfully! Verified neighbourhood dispatch initiated.');
      clearEntireCart();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF5F0] border-l border-[#F1E6DC] text-[#302B28] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-[#F1E6DC] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D97A5B]/15 text-[#D97A5B] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-[#302B28]">Your Basket</h2>
                <span className="text-[11px] text-[#6B5145] font-medium">
                  {totalCartItemCount} {totalCartItemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={clearEntireCart}
                  className="text-xs text-[#6B5145] hover:text-rose-600 transition font-semibold px-2 py-1"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#F1E6DC] text-[#6B5145] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Delivery Assurance Strip */}
          <div className="bg-[#6B5145] text-[#FAF5F0] px-5 py-2.5 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#D97A5B]" />
              <span>Instant Delivery: <strong>15-25 mins</strong></span>
            </div>
            <span className="text-[10px] text-[#F1E6DC]/80 font-bold uppercase tracking-wider">
              Hyperlocal Live
            </span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-white p-3.5 rounded-2xl border border-[#F1E6DC] flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#FAF5F0] shrink-0 border border-[#F1E6DC]">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#302B28] line-clamp-1">{item.product.name}</h4>
                      <p className="text-[11px] text-[#6B5145]">{item.variant.name}</p>
                      <span className="text-xs font-extrabold text-[#302B28] mt-1 block">
                        ₹{item.variant.price * item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-[#FAF5F0] border border-[#F1E6DC] rounded-xl px-2 py-1 gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-5 h-5 rounded-md bg-white hover:bg-[#F1E6DC] flex items-center justify-center text-xs font-bold shadow-2xs"
                    >
                      <Minus className="w-3 h-3 text-[#302B28]" />
                    </button>
                    <span className="text-xs font-bold text-[#302B28] min-w-3 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-5 h-5 rounded-md bg-white hover:bg-[#F1E6DC] flex items-center justify-center text-xs font-bold shadow-2xs"
                    >
                      <Plus className="w-3 h-3 text-[#302B28]" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#6B5145]/30 mx-auto" />
                <h3 className="font-extrabold text-base text-[#302B28]">Your basket is empty</h3>
                <p className="text-xs text-[#6B5145] max-w-xs mx-auto">
                  Explore fresh milk, bread, organic vegetables, and fruits from your local stores.
                </p>
                <button
                  onClick={onClose}
                  className="mt-3 px-5 py-2.5 bg-[#D97A5B] text-white rounded-full text-xs font-bold shadow-xs hover:bg-[#c2694d] transition"
                >
                  Browse Catalogue
                </button>
              </div>
            )}
          </div>

          {/* Bottom Billing & CTA */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-white border-t border-[#F1E6DC] space-y-4 shadow-lg">
              <div className="space-y-1.5 text-xs text-[#6B5145]">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-bold text-[#302B28]">₹{itemTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-[#302B28]">
                    {deliveryFee === 0 ? <span className="text-emerald-600 uppercase font-bold">Free</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-bold text-[#302B28]">₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#302B28] pt-2 border-t border-[#F1E6DC]">
                  <span>To Pay</span>
                  <span className="text-[#D97A5B]">₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-4 bg-[#D97A5B] hover:bg-[#c2694d] text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-between px-6 shadow-md"
              >
                <div className="flex flex-col text-left">
                  <span className="text-base font-black leading-tight">₹{grandTotal}</span>
                  <span className="text-[10px] text-white/80 font-semibold lowercase">total bill</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Proceed to Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
