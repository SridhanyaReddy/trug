'use client';

import React from 'react';
import Image from 'next/image';
import { useVendor } from '@/context/VendorContext';
import {
  Repeat,
  Calendar,
  Clock,
  Pause,
  Play,
  Trash2,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export default function VendorRecurringOrdersPage() {
  const { recurringSubscriptions, toggleSubscriptionStatus } = useVendor();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
            Daily Milk & Grocery Subscriptions
          </h1>
          <p className="text-xs text-[#6B5145] mt-0.5">
            Manage recurring household deliveries, morning harvest batch allocation, and pause states.
          </p>
        </div>
      </div>

      {/* Subscriptions List */}
      {recurringSubscriptions.length > 0 ? (
        <div className="space-y-4">
          {recurringSubscriptions.map((sub) => {
            const isActive = sub.status === 'active';
            const isPaused = sub.status === 'paused';

            return (
              <div
                key={sub.id}
                className={`bg-white rounded-3xl border p-5 sm:p-6 transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  isActive ? 'border-[#F1E6DC]' : 'border-[#F1E6DC]/40 opacity-75 bg-[#FAF5F0]/50'
                }`}
              >
                {/* Product & Frequency Info */}
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
                    <div className="flex items-center gap-2">
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
                      <span className="text-xs font-mono font-bold text-[#6B5145]">
                        {sub.subscriptionNumber}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-[#302B28]">
                      {sub.quantity}x {sub.product.name} ({sub.variant.name})
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B5145] font-medium pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#D97A5B]" />
                        <span className="capitalize">
                          {sub.frequency === 'custom_days'
                            ? `Selected: ${sub.selectedDays?.join(', ')}`
                            : sub.frequency.replace('_', ' ')}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#D97A5B]" />
                        <span>{sub.timeSlot}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#6B5145] pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D97A5B] shrink-0" />
                      <span className="truncate max-w-sm">{sub.address}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Vendor Controls */}
                <div className="flex flex-col md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-[#F1E6DC]">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-[#6B5145] block">Next Scheduled Dawn Drop:</span>
                    <span className="text-xs font-black text-[#302B28]">{sub.nextDeliveryDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <button
                        onClick={() => toggleSubscriptionStatus(sub.id, 'paused')}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] text-xs font-bold border border-[#F1E6DC] transition flex items-center gap-1.5"
                      >
                        <Pause className="w-3.5 h-3.5 text-amber-700" />
                        <span>Pause Schedule</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleSubscriptionStatus(sub.id, 'active')}
                        className="px-3.5 py-1.5 rounded-xl bg-[#D97A5B] hover:bg-[#c2694d] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Resume Schedule</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleSubscriptionStatus(sub.id, 'cancelled')}
                      className="p-2 rounded-xl text-[#6B5145] hover:text-red-600 transition"
                      title="Cancel subscription"
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
        <div className="bg-white rounded-3xl border border-[#F1E6DC] p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-[#302B28]">No active customer subscriptions yet.</p>
          <p className="text-xs text-[#6B5145]">
            Neighbourhood households will appear here as they subscribe to morning milk, eggs, or sourdough loafs.
          </p>
        </div>
      )}
    </div>
  );
}

