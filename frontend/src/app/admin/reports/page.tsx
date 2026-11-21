'use client';

import React from 'react';
import { useAdmin } from '@/context/AdminContext';
import {
  FileBarChart,
  TrendingUp,
  MapPin,
  Layers,
  Users,
  Repeat,
  Store,
  ArrowUpRight,
} from 'lucide-react';

export default function AdminReportsPage() {
  const { vendors, allOrders, categories } = useAdmin();

  const localityBreakdown = [
    { locality: 'Green Glen Layout, Bellandur', orders: 1840, gmv: '₹1,56,400', share: '54%' },
    { locality: 'Indiranagar 12th Main', orders: 690, gmv: '₹58,600', share: '21%' },
    { locality: 'HSR Layout Sector 2', orders: 480, gmv: '₹41,200', share: '15%' },
    { locality: 'Koramangala 4th Block', orders: 310, gmv: '₹26,800', share: '10%' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
          Cluster Intelligence & Reports
        </h1>
        <p className="text-xs text-[#6B5145] mt-0.5">
          Locality density analysis, category volumes, fulfillment latency, and merchant reliability rankings.
        </p>
      </div>

      {/* Locality Performance Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#302B28]">Neighbourhood Orders by Locality</h2>
            <p className="text-xs text-[#6B5145] mt-0.5">Order density within 3 km hyperlocal radiuses</p>
          </div>
          <span className="text-xs font-bold text-[#D97A5B] bg-[#FAF5F0] px-3 py-1 rounded-full border border-[#F1E6DC]">
            4 Active Micro-Clusters
          </span>
        </div>

        <div className="space-y-4 pt-2">
          {localityBreakdown.map((loc, i) => (
            <div key={i} className="space-y-1.5 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-[#302B28]">{loc.locality}</span>
                <span className="text-[#D97A5B]">{loc.gmv} ({loc.orders} orders • {loc.share})</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#FAF5F0] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#D97A5B]"
                  style={{ width: loc.share }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-2">
          <span className="text-xs text-[#6B5145] font-semibold">Average Delivery Latency</span>
          <div className="text-3xl font-black text-[#302B28]">18.4 mins</div>
          <p className="text-[11px] text-emerald-700 font-bold">
            94% of drops delivered within under 25 minutes
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-2">
          <span className="text-xs text-[#6B5145] font-semibold">Platform Cancellation Rate</span>
          <div className="text-3xl font-black text-[#302B28]">0.8%</div>
          <p className="text-[11px] text-emerald-700 font-bold">
            Industry standard is ~4.5%. Direct stores prevent stockouts.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-2">
          <span className="text-xs text-[#6B5145] font-semibold">30-Day Household Retention</span>
          <div className="text-3xl font-black text-[#302B28]">72.6%</div>
          <p className="text-[11px] text-emerald-700 font-bold">
            High retention driven by daily fresh milk recurring schedules
          </p>
        </div>
      </div>
    </div>
  );
}

