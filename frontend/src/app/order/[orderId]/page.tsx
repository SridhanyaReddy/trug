'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Store,
  Truck,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  Share2,
} from 'lucide-react';

function OrderTrackingContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const { getOrderById, cancelOrder, showToast } = useCart();
  const order = getOrderById(orderId);

  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [supportMessage, setSupportMessage] = useState<string>('');

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-black text-[#302B28]">Order Not Found</h2>
        <p className="text-xs text-[#6B5145]">
          Could not locate order ID #{orderId}. It may have been placed under a different session.
        </p>
        <Link
          href="/account"
          className="inline-block px-5 py-2.5 rounded-full bg-[#D97A5B] text-white text-xs font-bold"
        >
          View My Orders
        </Link>
      </div>
    );
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(order.id);
    }
  };

  const handleSupportSend = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Support ticket logged with local store support desk.');
    setShowSupportModal(false);
    setSupportMessage('');
  };

  const isCancelled = order.status === 'Cancelled';
  const isDelivered = order.status === 'Delivered';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1E6DC] pb-6">
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B5145] hover:text-[#D97A5B] mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-serif font-black text-[#302B28]">
              Order #{order.orderNumber}
            </h1>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                isCancelled
                  ? 'bg-red-100 text-red-800'
                  : isDelivered
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-xs text-[#6B5145] mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()} with {order.vendorName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSupportModal(true)}
            className="px-4 py-2 bg-white hover:bg-[#F1E6DC] text-[#302B28] rounded-xl border border-[#F1E6DC] text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-[#D97A5B]" />
            <span>Store Support</span>
          </button>

          {!isDelivered && !isCancelled && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl border border-red-200 text-xs font-bold transition"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Live Status Banner */}
      <div className="bg-white rounded-3xl border border-[#F1E6DC] p-6 sm:p-8 space-y-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D97A5B]/15 text-[#D97A5B] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#302B28]">
                {isCancelled
                  ? 'Order Cancelled'
                  : isDelivered
                  ? 'Order Successfully Delivered'
                  : `Estimated Arrival: ${order.estimatedDeliveryTime}`}
              </h3>
              <p className="text-xs text-[#6B5145] mt-0.5">
                {order.fulfillmentType === 'pickup'
                  ? 'Store Pickup at counter'
                  : `Delivering to ${order.deliveryAddress.name} (${order.deliveryAddress.tag})`}
              </p>
            </div>
          </div>

          <div className="text-xs text-[#6B5145]">
            <span className="font-semibold text-[#302B28]">Slot: </span>
            {order.deliverySlot}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="relative pt-4">
          <div className="space-y-6">
            {order.timeline.map((step, idx) => {
              const isPast = step.completed;
              const isCurrent = step.current;

              return (
                <div key={idx} className="flex items-start gap-4 relative">
                  {/* Vertical connector line */}
                  {idx !== order.timeline.length - 1 && (
                    <div
                      className={`absolute left-3 top-6 w-0.5 h-10 ${
                        isPast ? 'bg-[#D97A5B]' : 'bg-[#F1E6DC]'
                      }`}
                    />
                  )}

                  {/* Icon circle */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold ${
                      isCurrent
                        ? 'bg-[#D97A5B] text-white ring-4 ring-[#D97A5B]/20'
                        : isPast
                        ? 'bg-[#302B28] text-white'
                        : 'bg-[#F1E6DC] text-[#6B5145]'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>

                  {/* Step texts */}
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-[#D97A5B]' : 'text-[#302B28]'
                        }`}
                      >
                        {step.label}
                      </h4>
                      {step.timestamp && (
                        <span className="text-[10px] text-[#6B5145] font-mono">
                          {step.timestamp}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B5145]">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Items & Store Contact */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Items List */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-[#F1E6DC] p-6 space-y-4">
          <h3 className="font-bold text-sm text-[#302B28]">Items in this Order</h3>
          <div className="divide-y divide-[#F1E6DC]/60">
            {order.items.map((item, i) => (
              <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF5F0] border border-[#F1E6DC]">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#302B28]">{item.productName}</h4>
                    <span className="text-[11px] text-[#6B5145]">
                      {item.variantName} × {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-xs text-[#302B28]">₹{item.totalPrice}</span>
              </div>
            ))}
          </div>

          {/* Pricing computation summary */}
          <div className="border-t border-[#F1E6DC] pt-3 space-y-1.5 text-xs text-[#6B5145]">
            <div className="flex justify-between">
              <span>Item Subtotal</span>
              <span className="text-[#302B28] font-bold">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-[#302B28] font-bold">
                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-[#302B28] pt-2 border-t border-[#F1E6DC]">
              <span>Total Paid ({order.paymentMethod})</span>
              <span className="text-[#D97A5B]">₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Store & Delivery Info Card */}
        <div className="md:col-span-4 space-y-4">
          {/* Store Info */}
          <div className="bg-white rounded-3xl border border-[#F1E6DC] p-5 space-y-3">
            <h4 className="font-bold text-xs text-[#302B28] uppercase tracking-wider">
              Store Partner
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5F0] flex items-center justify-center text-[#D97A5B] border border-[#F1E6DC]">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-[#302B28]">{order.vendorName}</p>
                <p className="text-[11px] text-[#6B5145]">{order.vendorPhone}</p>
              </div>
            </div>
            <Link
              href={`/store/${order.vendorSlug}`}
              className="block w-full py-2 text-center rounded-xl bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] text-xs font-bold transition"
            >
              Visit Storefront
            </Link>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-3xl border border-[#F1E6DC] p-5 space-y-2">
            <h4 className="font-bold text-xs text-[#302B28] uppercase tracking-wider">
              Delivery Address
            </h4>
            <div className="text-xs text-[#6B5145] space-y-1">
              <p className="font-bold text-[#302B28]">
                {order.deliveryAddress.name} ({order.deliveryAddress.tag})
              </p>
              <p>{order.deliveryAddress.phone}</p>
              <p className="leading-relaxed">{order.deliveryAddress.addressLine}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <form
            onSubmit={handleSupportSend}
            className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#F1E6DC] shadow-2xl space-y-4"
          >
            <h3 className="font-serif font-bold text-lg text-[#302B28]">
              Contact Store Support
            </h3>
            <p className="text-xs text-[#6B5145]">
              Have questions regarding Order #{order.orderNumber} with {order.vendorName}? The merchant responds via WhatsApp/Call within 5 minutes.
            </p>

            <textarea
              required
              rows={3}
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="e.g. Please check if milk bottles are sealed chilled, or instruct rider regarding doorbell..."
              className="w-full text-xs p-3 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] focus:outline-none focus:border-[#D97A5B]"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B5145] hover:text-[#302B28]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#D97A5B] hover:bg-[#c2694d] text-white text-xs font-bold shadow-xs"
              >
                Send Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-12 text-center text-xs text-[#6B5145]">Loading order details...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}

