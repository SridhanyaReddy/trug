'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  MapPin,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Home,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export default function CartDrawer({ isOpen, onClose, onOpenAuth }: CartDrawerProps) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearEntireCart,
    totalCartItemCount,
    isLoggedIn,
    user,
    showToast,
  } = useCart();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  // Fetch user addresses from live DB when logged in
  useEffect(() => {
    if (isLoggedIn && user.phone) {
      fetch(`/api/customer?phone=${encodeURIComponent(user.phone)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.profile?.addresses) {
            setAddresses(data.profile.addresses);
            const def = data.profile.addresses.find((a: any) => a.is_default);
            if (def) setSelectedAddressId(def.id);
            else if (data.profile.addresses.length > 0) setSelectedAddressId(data.profile.addresses[0].id);
          }
        })
        .catch(() => {});
    }
  }, [isLoggedIn, user.phone, isOpen]);

  if (!isOpen) return null;

  const itemTotal = cartItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
  const deliveryFee = 0; // TRUG Special Feature: Zero Delivery Fee Always
  const platformFee = 0; // Zero hidden fees
  const grandTotal = itemTotal;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0] || null;

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      onOpenAuth();
      return;
    }

    if (cartItems.length === 0) {
      showToast('Your basket is empty');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const payload = {
        items: cartItems,
        phone: user.phone,
        paymentMethod,
        deliveryAddress: selectedAddress || {
          recipient: user.name || 'Resident',
          address_line: 'Jubilee Hills, Hyderabad',
          postcode: '500033',
        },
      };

      const res = await fetch('/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIsPlacingOrder(false);

      if (data.success && data.order) {
        setOrderSuccess(data.order);
        clearEntireCart();
        showToast(`Order #${data.order.orderNumber} placed successfully!`);
      } else {
        showToast(data.error || 'Failed to place order.');
      }
    } catch (err: any) {
      setIsPlacingOrder(false);
      showToast('Network error while placing order');
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
          <div className="p-4 sm:p-5 border-b border-[#F1E6DC] flex items-center justify-between bg-white">
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
              {cartItems.length > 0 && !orderSuccess && (
                <button
                  onClick={clearEntireCart}
                  className="text-xs text-[#6B5145] hover:text-rose-600 transition font-semibold px-2 py-1 cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  onClose();
                }}
                className="p-1.5 rounded-full hover:bg-[#F1E6DC] text-[#6B5145] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ORDER SUCCESS SCREEN */}
          {orderSuccess ? (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-5 bg-white">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-wider uppercase bg-[#F1E6DC] text-[#6B5145] px-3 py-1 rounded-full">
                  Confirmed & Dispatched
                </span>
                <h3 className="text-2xl font-black text-[#302B28]">Order Placed!</h3>
                <p className="text-xs text-[#6B5145]">
                  Order <strong className="text-[#302B28]">#{orderSuccess.orderNumber}</strong> has been created in TRUG.
                </p>
              </div>

              <div className="w-full bg-[#FAF5F0] rounded-2xl p-4 border border-[#F1E6DC] text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-[#F1E6DC] pb-2">
                  <span className="text-[#6B5145]">Recipient:</span>
                  <span className="font-bold text-[#302B28]">{orderSuccess.recipient}</span>
                </div>
                <div className="flex justify-between border-b border-[#F1E6DC] pb-2">
                  <span className="text-[#6B5145]">Delivery Address:</span>
                  <span className="font-bold text-[#302B28] truncate max-w-[200px]">{orderSuccess.address}</span>
                </div>
                <div className="flex justify-between border-b border-[#F1E6DC] pb-2">
                  <span className="text-[#6B5145]">Payment:</span>
                  <span className="font-bold uppercase text-[#302B28]">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Instant'}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-[#302B28]">Total Amount Paid:</span>
                  <span className="font-black text-sm text-[#D97A5B]">₹{orderSuccess.total}</span>
                </div>
              </div>

              <div className="w-full space-y-2">
                <Link
                  href="/profile"
                  onClick={() => {
                    setOrderSuccess(null);
                    onClose();
                  }}
                  className="w-full block py-3 bg-[#D97A5B] hover:bg-[#c4694d] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md"
                >
                  View in My Orders
                </Link>
                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl border border-[#F1E6DC] text-xs font-bold text-[#6B5145] hover:bg-[#FAF5F0] transition cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {cartItems.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={item.cartItemId}
                          className="bg-white p-3.5 rounded-2xl border border-[#F1E6DC] flex items-center justify-between gap-3 shadow-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF5F0] shrink-0 border border-[#F1E6DC]">
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-xs text-[#302B28] line-clamp-1">
                                {item.product.name}
                              </h4>
                              <p className="text-[11px] text-[#6B5145] font-medium">
                                {item.variant.name} • ₹{item.variant.price}
                              </p>
                            </div>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center gap-2 bg-[#FAF5F0] border border-[#F1E6DC] px-2 py-1 rounded-xl">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="text-[#6B5145] hover:text-[#D97A5B] transition p-0.5 cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold text-[#302B28] min-w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="text-[#6B5145] hover:text-[#D97A5B] transition p-0.5 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Address Selector */}
                    <div className="bg-white p-4 rounded-2xl border border-[#F1E6DC] shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#6B5145] flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-[#D97A5B]" />
                          Delivery Address
                        </span>
                        {!isLoggedIn && (
                          <button
                            onClick={onOpenAuth}
                            className="text-xs font-bold text-[#D97A5B] hover:underline cursor-pointer"
                          >
                            Login to Select
                          </button>
                        )}
                      </div>

                      {isLoggedIn ? (
                        addresses.length > 0 ? (
                          <div className="space-y-1.5">
                            {addresses.map((addr) => (
                              <label
                                key={addr.id}
                                className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                                  (selectedAddressId === addr.id || (!selectedAddressId && addr.is_default))
                                    ? 'bg-[#FAF5F0] border-[#D97A5B]'
                                    : 'bg-white border-[#F1E6DC]'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="selected_delivery_addr"
                                  checked={selectedAddressId === addr.id || (!selectedAddressId && addr.is_default)}
                                  onChange={() => setSelectedAddressId(addr.id)}
                                  className="mt-0.5 text-[#D97A5B] focus:ring-[#D97A5B]"
                                />
                                <div className="text-xs">
                                  <p className="font-bold text-[#302B28] flex items-center gap-1">
                                    <span>{addr.label || 'Home'}</span>
                                    <span className="text-[#6B5145] font-normal">({addr.recipient})</span>
                                  </p>
                                  <p className="text-[#6B5145] text-[11px] mt-0.5">{addr.address_line}, {addr.locality}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[#6B5145]">
                            No saved address found. Standard neighbourhood delivery will be dispatched to your locality.
                          </p>
                        )
                      ) : (
                        <p className="text-xs text-[#6B5145]">
                          Sign in to deliver to your saved flat, house or landmark.
                        </p>
                      )}
                    </div>

                    {/* Payment Mode Selector */}
                    <div className="bg-white p-4 rounded-2xl border border-[#F1E6DC] shadow-xs space-y-2.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#6B5145]">
                        Payment Option
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cod')}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                            paymentMethod === 'cod'
                              ? 'bg-[#D97A5B] text-white border-[#D97A5B] shadow-xs'
                              : 'bg-[#FAF5F0] text-[#6B5145] border-[#F1E6DC]'
                          }`}
                        >
                          Cash on Delivery
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi')}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                            paymentMethod === 'upi'
                              ? 'bg-[#D97A5B] text-white border-[#D97A5B] shadow-xs'
                              : 'bg-[#FAF5F0] text-[#6B5145] border-[#F1E6DC]'
                          }`}
                        >
                          UPI / QR Code
                        </button>
                      </div>
                    </div>

                    {/* Bill Summary */}
                    <div className="bg-white p-4 rounded-2xl border border-[#F1E6DC] space-y-2 shadow-xs text-xs">
                      <div className="flex justify-between text-[#6B5145]">
                        <span>Item Total</span>
                        <span className="font-semibold text-[#302B28]">₹{itemTotal}</span>
                      </div>
                      <div className="flex justify-between text-[#6B5145] items-center">
                        <span className="flex items-center gap-1.5 font-medium">
                          Delivery Partner Fee
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider">
                            Special Feature
                          </span>
                        </span>
                        <span className="text-emerald-600 font-black text-xs">
                          FREE (₹0)
                        </span>
                      </div>
                      <div className="border-t border-[#F1E6DC] pt-2 flex justify-between font-extrabold text-sm text-[#302B28]">
                        <span>To Pay</span>
                        <span className="text-[#D97A5B]">₹{grandTotal}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#F1E6DC] text-[#6B5145] flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 opacity-40" />
                    </div>
                    <p className="font-black text-base text-[#302B28]">Your basket is empty</p>
                    <p className="text-xs text-[#6B5145] max-w-xs">
                      Add fresh produce, milk, sourdough or snacks from your neighbourhood stores.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-4 px-6 py-2.5 rounded-full bg-[#D97A5B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c2694d] transition shadow-xs cursor-pointer"
                    >
                      Browse Catalogue
                    </button>
                  </div>
                )}
              </div>

              {/* Checkout Bar */}
              {cartItems.length > 0 && (
                <div className="p-4 sm:p-5 bg-white border-t border-[#F1E6DC] space-y-3 shadow-lg">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="w-full py-4 bg-[#D97A5B] hover:bg-[#c2694d] text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-between px-5 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-black leading-tight">₹{grandTotal}</span>
                      <span className="text-[10px] text-white/80 lowercase">
                        {isLoggedIn ? `${paymentMethod.toUpperCase()} • 1-click place order` : 'Sign in & place order'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-extrabold">
                      <span>{isPlacingOrder ? 'Confirming Order...' : isLoggedIn ? 'Place Order' : 'Login & Place Order'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-[#6B5145] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D97A5B]" />
                    <span>Real-time order dispatched directly to store inventory in TRUG database</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
