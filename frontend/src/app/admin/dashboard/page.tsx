'use client';

import React from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import {
  Store,
  Users,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export default function AdminDashboardOverview() {
  const { vendors, allOrders, disputes, tickets, categories } = useAdmin();

  // Metrics
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter((v) => v.accountStatus === 'Active' && v.verificationStatus === 'Verified').length;
  const pendingApprovals = vendors.filter((v) => v.verificationStatus === 'Pending Review').length;

  const totalOrders = allOrders.length;
  const completedOrders = allOrders.filter((o) => o.status === 'Delivered').length;
  const cancelledOrders = allOrders.filter((o) => o.status === 'Cancelled').length;

  // Platform gross merchandise value (GMV)
  const totalGMV = vendors.reduce((sum, v) => sum + v.grossSales, 0);

  // Platform SaaS Revenue (0% commission, flat monthly software subscriptions)
  const totalSaaSMonthly = vendors.reduce((sum, v) => {
    if (v.plan.includes('2,499')) return sum + 2499;
    if (v.plan.includes('1,499')) return sum + 1499;
    return sum + 799;
  }, 0);

  // Growth Chart
  const growthWeeks = [
    { week: 'Wk 1', gmv: '₹42k', height: 'h-16' },
    { week: 'Wk 2', gmv: '₹78k', height: 'h-24' },
    { week: 'Wk 3', gmv: '₹115k', height: 'h-32' },
    { week: 'Wk 4', gmv: '₹184k', height: 'h-40' },
    { week: 'Wk 5', gmv: '₹289k', height: 'h-48', current: true },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header Greeting & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
            Platform Command Center
          </h1>
          <p className="text-xs text-[#6B5145] mt-0.5 font-medium">
            Cross-neighbourhood performance metrics, active merchant monitoring, and compliance queue.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/vendors"
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#F1E6DC] text-[#302B28] font-bold text-xs border border-[#F1E6DC] transition shadow-xs flex items-center gap-1.5"
          >
            <Store className="w-3.5 h-3.5 text-[#D97A5B]" />
            <span>Review Applications ({pendingApprovals})</span>
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white font-bold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Platform Orders</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Vendors */}
        <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6B5145]">
            <span className="text-xs font-semibold">Registered Stores</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#D97A5B] flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#302B28]">{totalVendors}</span>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> {activeVendors} Active
            </span>
          </div>
          <div className="text-[11px] text-[#6B5145]">
            <strong className="text-amber-800">{pendingApprovals}</strong> pending verification
          </div>
        </div>

        {/* Total GMV */}
        <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6B5145]">
            <span className="text-xs font-semibold">Platform GMV</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#302B28]">₹{(totalGMV / 1000).toFixed(1)}k</span>
            <span className="text-[11px] text-emerald-700 font-bold">+28% MoM</span>
          </div>
          <div className="text-[11px] text-[#6B5145]">
            100% direct merchant settlements
          </div>
        </div>

        {/* Platform SaaS ARR */}
        <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6B5145]">
            <span className="text-xs font-semibold">Monthly SaaS ARR</span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-[#302B28] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#302B28]">₹{totalSaaSMonthly.toLocaleString()}</span>
            <span className="text-[11px] text-[#6B5145]">/mo</span>
          </div>
          <div className="text-[11px] text-[#6B5145]">
            Zero commission model
          </div>
        </div>

        {/* Dispute Escrow Rate */}
        <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6B5145]">
            <span className="text-xs font-semibold">Dispute Rate</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#302B28]">
              {disputes.filter((d) => d.status === 'Under Investigation').length}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold">0.3% (Very Low)</span>
          </div>
          <div className="text-[11px] text-[#6B5145]">
            {tickets.length} support tickets handled
          </div>
        </div>
      </div>

      {/* 3. Middle Section: GMV Growth & Order Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Growth Bar Visual */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#302B28]">Cluster GMV Expansion</h2>
              <p className="text-xs text-[#6B5145] mt-0.5">Aggregated weekly retail volume in Bellandur & Outer Ring Road</p>
            </div>
            <span className="text-xs font-bold text-[#D97A5B] bg-[#FAF5F0] px-3 py-1 rounded-full border border-[#F1E6DC]">
              Monthly: ₹2.89 Lakhs
            </span>
          </div>

          <div className="pt-6 pb-2 flex items-end justify-between gap-4 h-52 border-b border-[#F1E6DC]/70">
            {growthWeeks.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-[#302B28] opacity-0 group-hover:opacity-100 transition">
                  {item.gmv}
                </span>
                <div
                  className={`w-full max-w-[44px] rounded-t-xl transition-all duration-300 ${item.height} ${
                    item.current ? 'bg-[#D97A5B]' : 'bg-[#F1E6DC] hover:bg-[#6B5145]'
                  }`}
                />
                <span className={`text-[11px] font-semibold ${item.current ? 'text-[#D97A5B]' : 'text-[#6B5145]'}`}>
                  {item.week}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#6B5145] pt-1">
            <span>Leading Category: Pure A2 Milk & Artisanal Dairy</span>
            <Link href="/admin/reports" className="font-bold text-[#D97A5B] hover:underline">
              View Detailed Analytics →
            </Link>
          </div>
        </div>

        {/* Pending Approvals & Live Quick Actions */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#302B28]">Store Verification Queue</h2>
            <Link href="/admin/vendors" className="text-xs font-bold text-[#D97A5B] hover:underline">
              All Stores
            </Link>
          </div>

          <div className="space-y-3">
            {vendors.slice(0, 3).map((v) => (
              <div
                key={v.id}
                className="p-3.5 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC] flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-[#302B28]">{v.businessName}</h4>
                  <span className="text-[11px] text-[#6B5145]">
                    {v.category} • {v.locality.split(',')[0]}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      v.verificationStatus === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : v.verificationStatus === 'Pending Review'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {v.verificationStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-[#F1E6DC]/60 text-xs text-[#6B5145] leading-relaxed">
            All stores are strictly physically vetted for hygiene, genuine FSSAI registration, and local neighbourhood proximity before publishing.
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Recent Support Tickets & Live Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#302B28]">Active Support Incidents</h2>
            <Link href="/admin/support" className="text-xs font-bold text-[#D97A5B] hover:underline">
              Open Helpdesk ({tickets.length})
            </Link>
          </div>

          <div className="divide-y divide-[#F1E6DC]/70">
            {tickets.slice(0, 3).map((t) => (
              <div key={t.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#302B28]">{t.ticketNumber}</span>
                    <span className="text-[#6B5145]">({t.requesterType}: {t.requesterName})</span>
                  </div>
                  <span className="text-[11px] text-[#6B5145] block mt-0.5 line-clamp-1">
                    {t.description}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      t.priority === 'High' || t.priority === 'Urgent'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {t.priority}
                  </span>
                  <span className="text-[10px] text-[#6B5145] block mt-0.5 font-medium">
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Categories Snapshot */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#302B28]">Active Category Segments</h2>
            <Link href="/admin/categories" className="text-xs font-bold text-[#D97A5B] hover:underline">
              Manage ({categories.length})
            </Link>
          </div>

          <div className="space-y-2.5 text-xs">
            {categories.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC] flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-[#302B28]">{c.name}</span>
                  <span className="text-[11px] text-[#6B5145] block">
                    {c.productCount} products • {c.vendorCount} stores
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {c.isEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

