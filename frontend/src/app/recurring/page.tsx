'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import {
  Repeat,
  Calendar,
  Clock,
  Play,
  Pause,
  Trash2,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function RecurringOrdersPage() {
  const { recurringOrders, toggleRecurringOrderStatus, products } = useCart();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#6B5145] text-white rounded-3xl p-6 sm:p-10 border border-[#6B5145] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-[#FAF5F0] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Repeat className="w-3.5 h-3.5 text-[#D97A5B]" />
            <span>Automatic Morning Drops</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-[#FAF5F0]">
            Daily & Recurring Subscriptions
          </h1>
          <p className="text-xs text-[#FAF5F0]/80 leading-relaxed">
            Fresh milk, eggs, and bread delivered at dawn before 7:30 AM without needing to place manual orders every night. Pause, skip, or cancel anytime.
          </p>
        </div>

        <Link
          href="/categories/milk-and-dairy"
          className="px-5 py-3 rounded-full bg-[#D97A5B] hover:bg-[#c2694d] text-white font-bold text-xs tracking-wide shadow-md transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Subscription</span>
        </Link>
      </div>

      {/* Active Schedules List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-[#302B28]">
            Your Scheduled Deliveries ({recurringOrders.length})
          </h2>
          <span className="text-xs text-[#6B5145]">
            Billing occurs daily per delivery (No lock-in)
          </span>
        </div>

        {recurringOrders.length > 0 ? (
          <div className="space-y-4">
            {recurringOrders.map((sub) => {
              const isActive = sub.status === 'active';
              const isPaused = sub.status === 'paused';

              return (
                <div
                  key={sub.id}
                  className={`bg-white rounded-3xl border p-5 sm:p-6 transition shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
                    isActive
                      ? 'border-[#F1E6DC]'
                      : 'border-[#F1E6DC]/40 opacity-75 bg-[#FAF5F0]/50'
                  }`}
                >
                  {/* Left: Product & Schedule details */}
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#FAF5F0] border border-[#F1E6DC] shrink-0">
                      <Image
                        src={sub.product.image}
                        alt={sub.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPaused
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {sub.status}
                        </span>
                        <span className="text-xs font-semibold text-[#6B5145]">
                          {sub.subscriptionNumber}
                        </span>
                        <span className="text-xs text-[#6B5145]">• {sub.vendorName}</span>
                      </div>

                      <h3 className="font-bold text-base text-[#302B28]">
                        {sub.quantity}x {sub.product.name}
                      </h3>

                      <p className="text-xs text-[#6B5145]">
                        Pack: <strong className="text-[#302B28]">{sub.variant.name}</strong> • ₹{sub.variant.price * sub.quantity} per drop
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B5145] pt-1 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#D97A5B]" />
                          <span className="capitalize">
                            {sub.frequency === 'custom_days'
                              ? `Days: ${sub.selectedDays?.join(', ')}`
                              : sub.frequency.replace('_', ' ')}
                          </span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#D97A5B]" />
                          <span>{sub.timeSlot}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Next Drop & Controls */}
                  <div className="flex flex-col sm:items-end justify-between gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F1E6DC]">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-[#6B5145] block">Next Delivery:</span>
                      <span className="text-xs font-bold text-[#302B28]">{sub.nextDeliveryDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <button
                          onClick={() => toggleRecurringOrderStatus(sub.id, 'paused')}
                          className="px-3.5 py-1.5 rounded-xl bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] text-xs font-bold border border-[#F1E6DC] transition flex items-center gap-1.5"
                        >
                          <Pause className="w-3.5 h-3.5 text-amber-700" />
                          <span>Pause</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleRecurringOrderStatus(sub.id, 'active')}
                          className="px-3.5 py-1.5 rounded-xl bg-[#D97A5B] hover:bg-[#c2694d] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Resume</span>
                        </button>
                      )}

                      <button
                        onClick={() => toggleRecurringOrderStatus(sub.id, 'cancelled')}
                        className="p-2 rounded-xl text-[#6B5145] hover:text-red-600 transition"
                        title="Cancel Subscription"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#F1E6DC] p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF5F0] text-[#6B5145] flex items-center justify-center mx-auto">
              <Repeat className="w-8 h-8 text-[#D97A5B]" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#302B28]">
              No active recurring subscriptions
            </h3>
            <p className="text-xs text-[#6B5145] max-w-sm mx-auto">
              Set up recurring daily drops for fresh A2 milk, eggs, or sourdough loaf to have breakfast ready without worrying.
            </p>
            <Link
              href="/categories/milk-and-dairy"
              className="inline-block px-5 py-2.5 rounded-full bg-[#D97A5B] text-white text-xs font-bold"
            >
              Explore Daily Essentials
            </Link>
          </div>
        )}
      </div>

      {/* Subscription FAQ & Guarantee */}
      <div className="bg-[#FAF5F0] rounded-3xl border border-[#F1E6DC] p-6 sm:p-8 space-y-4">
        <h3 className="font-serif font-bold text-base text-[#302B28] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#D97A5B]" />
          <span>TRUG Neighbourhood Subscription Guarantee</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#6B5145]">
          <div className="bg-white p-4 rounded-2xl border border-[#F1E6DC]">
            <strong className="text-[#302B28] block mb-1">Pause Before 10:00 PM</strong>
            Heading out of town? Toggle pause anytime before 10 PM and you won't receive or be charged for the next day's drop.
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#F1E6DC]">
            <strong className="text-[#302B28] block mb-1">Direct from Local Mandis</strong>
            Bottled and packed fresh at 5:00 AM every morning from stores within 2 km of your location.
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#F1E6DC]">
            <strong className="text-[#302B28] block mb-1">Zero Wallet Lock-in</strong>
            Pay conveniently via saved UPI or monthly consolidated doorstep settlement.
          </div>
        </div>
      </div>
    </div>
  );
}

