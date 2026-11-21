'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import { Order, OrderStatus } from '@/types';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Eye,
  X,
  Truck,
  RotateCcw,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { allOrders, updatePlatformOrderStatus } = useAdmin();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return allOrders.filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.vendorName.toLowerCase().includes(search.toLowerCase()) ||
        o.deliveryAddress.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [allOrders, search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
          Platform-Wide Order Monitoring
        </h1>
        <p className="text-xs text-[#6B5145] mt-0.5">
          Real-time order surveillance across independent merchants, rider drop-offs, and live status overrides.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#F1E6DC] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="w-full md:w-72 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, vendor, or customer..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF5F0] text-xs font-medium text-[#302B28] rounded-xl border border-[#F1E6DC] focus:outline-none focus:border-[#D97A5B]"
          />
          <Search className="w-4 h-4 text-[#6B5145] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF5F0] border border-[#F1E6DC] rounded-xl px-3 py-2 text-xs font-semibold text-[#302B28] focus:outline-none focus:border-[#D97A5B]"
          >
            <option value="All">All Fulfilment States</option>
            <option value="Placed">Placed</option>
            <option value="Accepted">Accepted</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready / Dispatched">Ready / Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#F1E6DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF5F0] border-b border-[#F1E6DC] text-[#6B5145] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Merchant</th>
                <th className="py-3.5 px-4">Customer & Slot</th>
                <th className="py-3.5 px-4">Order Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Admin Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1E6DC]/70">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FAF5F0]/40 transition">
                  <td className="py-4 px-4">
                    <span className="font-extrabold text-xs text-[#302B28] block">{ord.orderNumber}</span>
                    <span className="text-[10px] text-[#6B5145]">
                      {new Date(ord.createdAt).toLocaleDateString()} • {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-bold text-[#302B28]">
                    {ord.vendorName}
                  </td>

                  <td className="py-4 px-4 text-[#6B5145]">
                    <span className="font-bold text-[#302B28] block">{ord.deliveryAddress.name}</span>
                    <span className="text-[11px] truncate block max-w-[170px]">{ord.deliverySlot}</span>
                  </td>

                  <td className="py-4 px-4 font-black text-sm text-[#302B28]">
                    ₹{ord.total}
                    <span className="text-[10px] font-normal text-[#6B5145] block">
                      {ord.paymentMethod}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : ord.status === 'Placed'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-[#FAF5F0] text-[#D97A5B] border border-[#D97A5B]/30'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] font-bold text-xs border border-[#F1E6DC] transition flex items-center gap-1 inline-flex"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D97A5B]" />
                      <span>Timeline</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Timeline Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#F1E6DC] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#F1E6DC]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97A5B]">
                  Platform Fulfilment Audit
                </span>
                <h3 className="font-extrabold text-xl text-[#302B28]">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-[#6B5145]">
                  Fulfilled by {selectedOrder.vendorName} • Total: ₹{selectedOrder.total}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-[#6B5145]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline progression view */}
            <div className="space-y-4 py-2">
              <span className="text-xs font-bold text-[#302B28] uppercase tracking-wider">
                Status History
              </span>
              <div className="space-y-4">
                {selectedOrder.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold ${
                        step.completed ? 'bg-[#302B28] text-white' : 'bg-[#FAF5F0] text-[#6B5145]'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <strong className="text-[#302B28]">{step.label}</strong>
                        {step.timestamp && <span className="text-[#6B5145] text-[10px]">{step.timestamp}</span>}
                      </div>
                      <p className="text-[#6B5145] text-[11px] mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Override Controls */}
            <div className="p-4 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC] space-y-2">
              <span className="font-bold text-xs text-[#302B28] block">Admin Status Override</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {(['Accepted', 'Preparing', 'Ready / Dispatched', 'Delivered', 'Cancelled'] as OrderStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updatePlatformOrderStatus(selectedOrder.id, st);
                        setSelectedOrder((prev) => (prev ? { ...prev, status: st } : null));
                      }}
                      className={`px-3 py-1 rounded-lg font-bold border transition ${
                        selectedOrder.status === st
                          ? 'bg-[#D97A5B] text-white border-[#D97A5B]'
                          : 'bg-white text-[#302B28] border-[#F1E6DC] hover:bg-[#F1E6DC]'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-2xl bg-[#302B28] text-white text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

