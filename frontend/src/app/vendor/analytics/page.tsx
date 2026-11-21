'use client';

import React from 'react';
import { useVendor } from '@/context/VendorContext';
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Users,
  Repeat,
  Package,
  Calendar,
  CheckCircle,
} from 'lucide-react';

export default function VendorAnalyticsPage() {
  const { products, vendorOrders, customers } = useVendor();

  const totalSales = vendorOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = vendorOrders.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  const repeatRate = '68%';
  const onTimeFulfilmentRate = '98.4%';

  const topSellingCategories = [
    { name: 'Fresh Milk & Dairy', share: '54%', revenue: '₹48,200', count: 480 },
    { name: 'Artisanal Malai Paneer', share: '24%', revenue: '₹21,400', count: 180 },
    { name: 'A2 Vedic Bilona Ghee', share: '15%', revenue: '₹13,350', count: 42 },
    { name: 'Curd & Chaas', share: '7%', revenue: '₹6,200', count: 110 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
          Store Performance & Sales Analytics
        </h1>
        <p className="text-xs text-[#6B5145] mt-0.5">
          Order volumes, customer retention metrics, and product revenue contributions.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-1">
          <span className="text-xs text-[#6B5145] font-semibold">Average Order Value</span>
          <div className="text-2xl font-black text-[#302B28]">₹{averageOrderValue}</div>
          <span className="text-[11px] text-emerald-700 font-bold">Above neighbourhood average</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-1">
          <span className="text-xs text-[#6B5145] font-semibold">Repeat Customer Rate</span>
          <div className="text-2xl font-black text-[#302B28]">{repeatRate}</div>
          <span className="text-[11px] text-emerald-700 font-bold">High local stickiness</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-1">
          <span className="text-xs text-[#6B5145] font-semibold">On-Time Fulfilment</span>
          <div className="text-2xl font-black text-[#302B28]">{onTimeFulfilmentRate}</div>
          <span className="text-[11px] text-[#6B5145]">Avg dispatch time: 14 mins</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-1">
          <span className="text-xs text-[#6B5145] font-semibold">Total Households Served</span>
          <div className="text-2xl font-black text-[#302B28]">{customers.length}</div>
          <span className="text-[11px] text-[#D97A5B] font-bold">Within 2.8 km radius</span>
        </div>
      </div>

      {/* Categories Breakdown & Revenue Shares */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-[#302B28]">Revenue by Product Category</h2>
          <div className="space-y-4 pt-2">
            {topSellingCategories.map((c, i) => (
              <div key={i} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-[#302B28]">{c.name}</span>
                  <span className="text-[#D97A5B]">{c.revenue} ({c.share})</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#FAF5F0] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#D97A5B]"
                    style={{ width: c.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fulfilment Quality Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-[#302B28]">Store Operations Quality</h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#302B28] block">Order Acceptance Speed</span>
                <span className="text-[11px] text-[#6B5145]">Time from customer placement</span>
              </div>
              <span className="font-black text-sm text-emerald-800">1.8 mins</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#302B28] block">Order Rejection Rate</span>
                <span className="text-[11px] text-[#6B5145]">Out of stock cancellations</span>
              </div>
              <span className="font-black text-sm text-emerald-800">0.4% (Minimal)</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#302B28] block">Customer Rating</span>
                <span className="text-[11px] text-[#6B5145]">Over 342 verified reviews</span>
              </div>
              <span className="font-black text-sm text-[#D97A5B]">4.9 / 5.0 ★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

