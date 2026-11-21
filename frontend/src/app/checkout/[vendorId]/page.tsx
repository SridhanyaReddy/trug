'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import {
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  ShoppingBag,
  CreditCard,
  Banknote,
  QrCode,
  ArrowLeft,
  ShieldCheck,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';

function CheckoutContent() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.vendorId as string;

  const {
    vendorCarts,
    user,
    placeOrder,
  } = useCart();

  const cartGroup = vendorCarts[vendorId];

  // Form State
  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user.addresses.find((a) => a.isDefault)?.id || user.addresses[0]?.id || 'addr-1'
  );
  const [deliverySlot, setDeliverySlot] = useState<string>('Standard Delivery (15-25 mins)');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash on Delivery'>('UPI');
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>('Please leave at the door and ring bell.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!cartGroup || cartGroup.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-black text-[#302B28]">No Items to Checkout</h2>
        <p className="text-xs text-[#6B5145]">
          Your bag for this store is empty.
        </p>
        <Link
          href="/cart"
          className="inline-block px-5 py-2.5 rounded-full bg-[#D97A5B] text-white text-xs font-bold"
        >
          Return to Cart
        </Link>
      </div>
    );
  }

  const { vendor, items, subtotal, deliveryFee, total } = cartGroup;
  const currentAddress = user.addresses.find((a) => a.id === selectedAddressId) || user.addresses[0];
  const finalDeliveryFee = fulfillmentType === 'pickup' ? 0 : deliveryFee;
  const finalTotal = subtotal + finalDeliveryFee;

  const handleSimulateOrder = () => {
    setIsSubmitting(true);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      const placed = placeOrder({
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorSlug: vendor.slug,
        vendorPhone: vendor.phone,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          variantName: i.variant.name,
          unitPrice: i.variant.price,
          quantity: i.quantity,
          totalPrice: i.variant.price * i.quantity,
          image: i.product.image,
        })),
        subtotal,
        deliveryFee: finalDeliveryFee,
        taxes: 0,
        discount: 0,
        total: finalTotal,
        fulfillmentType,
        deliverySlot,
        deliveryAddress: {
          name: currentAddress.name,
          phone: currentAddress.phone,
          addressLine: currentAddress.addressLine,
          landmark: currentAddress.landmark,
          tag: currentAddress.tag,
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
        estimatedDeliveryTime: fulfillmentType === 'pickup' ? 'Ready in 15 mins' : 'Arriving in 20-30 mins',
      });

      router.push(`/order/${placed.id}`);
    }, 900);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B5145] hover:text-[#D97A5B] mb-2 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
        <h1 className="text-3xl font-serif font-black text-[#302B28]">
          Checkout • {vendor.name}
        </h1>
        <p className="text-xs text-[#6B5145] mt-0.5">
          Order directly fulfilled by {vendor.name} in {vendor.address.locality}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Fulfillment, Address, Delivery Slot, Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Fulfillment Type Toggle */}
          <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] space-y-3">
            <h3 className="font-bold text-sm text-[#302B28]">Delivery or Store Pickup</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillmentType('delivery')}
                className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                  fulfillmentType === 'delivery'
                    ? 'border-[#D97A5B] bg-[#FAF5F0]'
                    : 'border-[#F1E6DC] bg-white hover:bg-[#FAF5F0]'
                }`}
              >
                <Truck className="w-5 h-5 text-[#D97A5B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-[#302B28]">Neighbourhood Delivery</h4>
                  <p className="text-[11px] text-[#6B5145] mt-0.5">
                    Rider dispatched from {vendor.name.split(' ')[0]} straight to your door.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('pickup')}
                className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                  fulfillmentType === 'pickup'
                    ? 'border-[#D97A5B] bg-[#FAF5F0]'
                    : 'border-[#F1E6DC] bg-white hover:bg-[#FAF5F0]'
                }`}
              >
                <Building className="w-5 h-5 text-[#D97A5B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-[#302B28]">Self Pickup from Store</h4>
                  <p className="text-[11px] text-[#6B5145] mt-0.5">
                    Save delivery fees. Walk in with order ID in 15 mins.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Delivery Address (or Pickup counter details) */}
          {fulfillmentType === 'delivery' ? (
            <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#302B28]">Delivery Address</h3>
                <Link
                  href="/account?tab=addresses"
                  className="text-xs font-bold text-[#D97A5B] hover:underline"
                >
                  Manage Addresses
                </Link>
              </div>

              <div className="space-y-2">
                {user.addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-[#D97A5B] bg-[#FAF5F0]'
                          : 'border-[#F1E6DC] hover:border-[#D97A5B]/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#D97A5B] shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#302B28]">
                              {addr.tag} • {addr.name}
                            </span>
                            <span className="text-[10px] text-[#6B5145]">{addr.phone}</span>
                          </div>
                          <p className="text-xs text-[#6B5145] mt-1 leading-relaxed">
                            {addr.addressLine}, {addr.locality}
                          </p>
                          {addr.landmark && (
                            <p className="text-[11px] text-[#6B5145]/80 mt-0.5">
                              Landmark: {addr.landmark}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="w-5 h-5 rounded-full border border-[#D97A5B] flex items-center justify-center shrink-0">
                        {isSelected && <div className="w-3 h-3 rounded-full bg-[#D97A5B]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery instructions */}
              <div>
                <label className="block text-xs font-semibold text-[#302B28] mb-1">
                  Delivery note for rider:
                </label>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Leave with security / Ring bell twice"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] focus:outline-none focus:border-[#D97A5B]"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] space-y-3">
              <h3 className="font-bold text-sm text-[#302B28]">Store Pickup Counter</h3>
              <div className="p-4 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC] space-y-1 text-xs">
                <p className="font-bold text-[#302B28]">{vendor.name}</p>
                <p className="text-[#6B5145]">{vendor.address.line1}, {vendor.address.locality}</p>
                <p className="text-[#6B5145]">Store Contact: {vendor.phone}</p>
                <p className="text-[11px] text-[#D97A5B] pt-1 font-semibold">
                  Show your Order ID at the counter to collect packed bags.
                </p>
              </div>
            </div>
          )}

          {/* 3. Delivery Slot */}
          <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] space-y-3">
            <h3 className="font-bold text-sm text-[#302B28]">Choose Preferred Slot</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                'Standard Delivery (15-25 mins)',
                'Evening Batch (5:00 - 6:30 PM)',
                'Tomorrow Morning (6:30 - 8:00 AM)',
              ].map((slot) => {
                const isSelected = deliverySlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setDeliverySlot(slot)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                      isSelected
                        ? 'border-[#302B28] bg-[#302B28] text-white shadow-xs'
                        : 'border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] hover:bg-[#F1E6DC]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot.split(' (')[0]}</span>
                    </div>
                    <span className="text-[10px] opacity-80 block">
                      {slot.includes('(') ? slot.split('(')[1].replace(')', '') : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Payment Methods */}
          <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] space-y-3">
            <h3 className="font-bold text-sm text-[#302B28]">Payment Option</h3>
            <div className="space-y-2">
              {[
                { id: 'UPI', label: 'Instant UPI (Google Pay, PhonePe, Paytm, BHIM)', icon: QrCode },
                { id: 'Card', label: 'Credit / Debit Card (Visa, Mastercard, RuPay)', icon: CreditCard },
                { id: 'Cash on Delivery', label: 'Cash / Pay on Delivery', icon: Banknote },
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                const Icon = m.icon;
                return (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-[#D97A5B] bg-[#FAF5F0]'
                        : 'border-[#F1E6DC] hover:border-[#D97A5B]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#D97A5B]" />
                      <span className="text-xs font-bold text-[#302B28]">{m.label}</span>
                    </div>
                    <div className="w-4 h-4 rounded-full border border-[#D97A5B] flex items-center justify-center">
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#D97A5B]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Summary: Store Order Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#F1E6DC] shadow-sm space-y-5 sticky top-28">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F1E6DC]">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#F1E6DC] bg-[#FAF5F0]">
                <Image
                  src={vendor.logo}
                  alt={vendor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#302B28]">{vendor.name}</h3>
                <p className="text-[11px] text-[#6B5145]">{items.length} items to be fulfilled</p>
              </div>
            </div>

            {/* Items review */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-[#F1E6DC]/50">
              {items.map((i) => (
                <div key={i.cartItemId} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#302B28]">{i.quantity}x {i.product.name}</span>
                    <span className="text-[11px] text-[#6B5145] block">{i.variant.name}</span>
                  </div>
                  <span className="font-bold text-[#302B28]">₹{i.variant.price * i.quantity}</span>
                </div>
              ))}
            </div>

            {/* Bill computation */}
            <div className="space-y-2 pt-3 border-t border-[#F1E6DC] text-xs text-[#6B5145]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-[#302B28] font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Fulfillment ({fulfillmentType})</span>
                <span className="text-[#302B28] font-bold">
                  {finalDeliveryFee === 0 ? 'FREE' : `₹${finalDeliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Handling</span>
                <span className="text-emerald-700 font-bold">₹0 (Included)</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#302B28] pt-2 border-t border-[#F1E6DC]">
                <span>Total to Pay</span>
                <span className="text-[#D97A5B]">₹{finalTotal}</span>
              </div>
            </div>

            {/* Simulation button */}
            <button
              onClick={handleSimulateOrder}
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white font-black text-sm tracking-wide shadow-lg transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Placing Neighbourhood Order...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Place Order • ₹{finalTotal}</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-[#6B5145] text-center">
              100% direct payment to local store. Immediate status tracking available.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-12 text-center text-xs text-[#6B5145]">Preparing checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

