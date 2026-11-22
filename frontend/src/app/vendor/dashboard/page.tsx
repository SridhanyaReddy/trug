'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useVendor } from '@/context/VendorContext';
import {
  ShoppingBag,
  TrendingUp,
  Package,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Users,
  Repeat,
  Plus,
  ArrowUpRight,
  BarChart2,
} from 'lucide-react';

export default function VendorDashboardOverview() {
  const { vendorProfile, products, vendorOrders, recurringSubscriptions } = useVendor();

  // Metrics
  const todayOrders = vendorOrders.length;
  const pendingOrders = vendorOrders.filter((o) => o.status === 'Placed').length;
  const preparingOrders = vendorOrders.filter((o) => o.status === 'Preparing' || o.status === 'Accepted').length;
  const completedOrders = vendorOrders.filter((o) => o.status === 'Delivered').length;

  // Real 7-day orders breakdown from vendorOrders
  const totalRevenue = vendorOrders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const totalProducts = products.length;

  // Low stock products (any variant has <= 10 units)
  const lowStockProducts = products.filter((p) =>
    p.variants.some((v) => v.stockQty <= 10)
  );

  // Best selling products
  const bestSellers = [...products].sort((a, b) => b.totalSold - a.totalSold).slice(0, 3);

  // Live weekly sales aggregated from vendorOrders
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = new Date().getDay();
  const salesDays = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const dIndex = (todayIndex - 6 + offset + 7) % 7;
    const dayLabel = offset === 6 ? `${days[dIndex]} (Today)` : days[dIndex];
    const dayTotal = vendorOrders
      .filter((o) => new Date(o.createdAt).getDay() === dIndex && o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    const height = dayTotal > 500 ? 'h-40' : dayTotal > 200 ? 'h-28' : dayTotal > 0 ? 'h-20' : 'h-10';
    return {
      day: dayLabel,
      sales: Math.round(dayTotal),
      height,
      current: offset === 6,
    };
  });

  return (
    <div className="space-y-8">
      {/* 1. Header greeting & quick CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
            Store Command Center
          </h1>
          <p className="text-xs text-[#6B5145] mt-1 font-medium">
            Welcome back, {vendorProfile.ownerName}. Here is your live shop activity for {vendorProfile.address.locality}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/vendor/products"
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#F1E6DC] text-[#302B28] font-bold text-xs border border-[#F1E6DC] transition shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#D97A5B]" />
            <span>Add New Item</span>
          </Link>
          <Link
            href="/vendor/orders"
            className="px-4 py-2.5 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white font-bold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Manage Orders ({pendingOrders})</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Orders */}
        <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6B5145]">
            <span className="text-xs font-semibold">Today's Orders</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#D97A5B] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#302B28]">{todayOrders}</span>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +14% vs yday
            </span>
          </div>
          <div className="text-[11px] text-[#6B5145] font-medium">
            <strong className="text-[#302B28]">{pendingOrders}</strong> pending acceptance
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6B5145]">
            <span className="text-xs font-semibold">Gross Store Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#302B28]">₹{totalRevenue.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-[#6B5145] font-medium">
            Settled directly via UPI & Cash
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6B5145]">
            <span className="text-xs font-semibold">Morning Subscriptions</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#302B28]">
              {recurringSubscriptions.filter((s) => s.status === 'active').length}
            </span>
            <span className="text-[11px] text-[#6B5145]">households</span>
          </div>
          <div className="text-[11px] text-[#6B5145] font-medium">
            Recurring dawn delivery drops
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white p-5 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6B5145]">
            <span className="text-xs font-semibold">Live Products</span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-[#302B28] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#302B28]">{totalProducts}</span>
            {lowStockProducts.length > 0 && (
              <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                {lowStockProducts.length} low stock
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#6B5145] font-medium">
            Published on customer storefront
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Weekly Sales Chart & Order Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#302B28]">Weekly Store Revenue</h2>
              <p className="text-xs text-[#6B5145] mt-0.5">Neighbourhood orders over the last 7 days</p>
            </div>
            <span className="text-xs font-bold text-[#D97A5B] bg-[#FAF5F0] px-3 py-1 rounded-full border border-[#F1E6DC]">
              Live Store Total: ₹{totalRevenue.toFixed(0)}
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6 pb-2 flex items-end justify-between gap-2 h-52 border-b border-[#F1E6DC]/70">
            {salesDays.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-[#302B28] opacity-0 group-hover:opacity-100 transition">
                  ₹{item.sales}
                </span>
                <div
                  className={`w-full max-w-[38px] rounded-t-xl transition-all duration-300 ${item.height} ${
                    item.current
                      ? 'bg-[#D97A5B] shadow-md'
                      : 'bg-[#F1E6DC] hover:bg-[#6B5145]'
                  }`}
                />
                <span className={`text-[11px] font-semibold ${item.current ? 'text-[#D97A5B]' : 'text-[#6B5145]'}`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#6B5145] pt-1">
            <span>Peak ordering hour: 06:30 AM - 08:00 AM (Dawn Milk)</span>
            <Link href="/vendor/analytics" className="font-bold text-[#D97A5B] hover:underline">
              Full Analytics Report →
            </Link>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#302B28]">Active Order Funnel</h2>
            <Link href="/vendor/orders" className="text-xs font-bold text-[#D97A5B] hover:underline">
              View All ({vendorOrders.length})
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { label: 'New Unaccepted Orders', count: pendingOrders, color: 'bg-amber-500', text: 'text-amber-800' },
              { label: 'Preparing in Store', count: preparingOrders, color: 'bg-[#D97A5B]', text: 'text-[#D97A5B]' },
              { label: 'Dispatched / Ready for Pickup', count: vendorOrders.filter((o) => o.status === 'Ready / Dispatched').length, color: 'bg-blue-500', text: 'text-blue-800' },
              { label: 'Completed Deliveries', count: completedOrders, color: 'bg-emerald-600', text: 'text-emerald-800' },
            ].map((st, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                  <span className="text-xs font-bold text-[#302B28]">{st.label}</span>
                </div>
                <span className={`text-sm font-black ${st.text}`}>{st.count}</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-[#F1E6DC]/60 text-xs text-[#6B5145] leading-relaxed">
            Quick tip: Mark orders <strong>Ready for Dispatch</strong> at least 10 minutes prior to delivery window so riders pick up on time.
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Low Stock Warnings & Recent Live Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#302B28]">Recent Neighbourhood Orders</h2>
            <Link href="/vendor/orders" className="text-xs font-bold text-[#D97A5B] hover:underline">
              Live Orders View
            </Link>
          </div>

          {vendorOrders.length > 0 ? (
            <div className="divide-y divide-[#F1E6DC]/70 overflow-x-auto">
              {vendorOrders.slice(0, 3).map((ord) => (
                <div key={ord.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#302B28]">{ord.orderNumber}</span>
                      <span className="text-[10px] text-[#6B5145] font-medium">
                        {ord.deliverySlot.split(' (')[0]}
                      </span>
                    </div>
                    <div className="text-xs text-[#6B5145] mt-0.5">
                      {ord.deliveryAddress.name} ({ord.deliveryAddress.tag}) • {ord.items.length} items
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-sm text-[#302B28] block">₹{ord.total}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'Placed'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-[#FAF5F0] text-[#D97A5B] border border-[#D97A5B]/30'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-[#6B5145] py-4 text-center">No orders received yet today.</div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#302B28] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Low-Stock Alerts</span>
            </h2>
            <Link href="/vendor/inventory" className="text-xs font-bold text-[#D97A5B] hover:underline">
              Inventory
            </Link>
          </div>

          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 3).map((p) => {
                const lowestVariant = p.variants.reduce((prev, curr) => (curr.stockQty < prev.stockQty ? curr : prev));
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC] flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-[#302B28]">{p.name}</h4>
                      <span className="text-[11px] text-[#6B5145]">{lowestVariant.name}</span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                          lowestVariant.stockQty === 0
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {lowestVariant.stockQty === 0 ? 'Out of stock' : `${lowestVariant.stockQty} left`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold text-center">
              All product lines are comfortably stocked!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

