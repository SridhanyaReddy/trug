'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { INITIAL_VENDOR_CUSTOMERS } from '@/data/vendorMockData';
import {
  Users,
  Search,
  MapPin,
  Phone,
  Mail,
  Repeat,
  ShoppingBag,
  Eye,
  X,
} from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers] = useState([
    ...INITIAL_VENDOR_CUSTOMERS,
    {
      id: 'vcust-5',
      name: 'Rohan Deshmukh',
      phone: '+91 99001 44556',
      email: 'rohan.d@gmail.com',
      address: 'Tower A, Flat 902, Sobha Classic, Bellandur',
      orderCount: 12,
      totalSpent: 2840,
      lastOrderDate: 'Today at 08:30 AM',
      isRecurringCustomer: true,
      notes: 'Subscribes to whole wheat pav and milk daily.',
    },
    {
      id: 'vcust-6',
      name: 'Meera Krishnan',
      phone: '+91 98450 66221',
      email: 'meera.k@yahoo.com',
      address: 'Plot 44, 7th Cross, Indiranagar',
      orderCount: 31,
      totalSpent: 6200,
      lastOrderDate: '19 Nov 2026',
      isRecurringCustomer: true,
      notes: 'Orders unpolished pulses and cold-pressed oil.',
    },
  ]);

  const [search, setSearch] = useState('');
  const [selectedCust, setSelectedCust] = useState<any | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
          Registered Household Residents
        </h1>
        <p className="text-xs text-[#6B5145] mt-0.5">
          Directory of neighbourhood customer accounts, lifetime GMV, order volume, and daily milk routes.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#F1E6DC] flex items-center justify-between shadow-xs">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, or society..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF5F0] text-xs font-medium text-[#302B28] rounded-xl border border-[#F1E6DC] focus:outline-none focus:border-[#D97A5B]"
          />
          <Search className="w-4 h-4 text-[#6B5145] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <span className="text-xs text-[#6B5145] font-semibold hidden sm:inline">
          {filtered.length} active consumer profiles
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-[#F1E6DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF5F0] border-b border-[#F1E6DC] text-[#6B5145] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Customer Name & Contact</th>
                <th className="py-3.5 px-4">Primary Delivery Address</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Subscription</th>
                <th className="py-3.5 px-4 text-right">Profile View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1E6DC]/70">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF5F0]/40 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FAF5F0] border border-[#D97A5B]/30 flex items-center justify-center font-black text-xs text-[#D97A5B]">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#302B28] block">{c.name}</span>
                        <span className="text-[11px] text-[#6B5145]">{c.phone}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-[#6B5145] max-w-[220px] truncate">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D97A5B] shrink-0" />
                      <span className="truncate">{c.address}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-black text-sm text-[#302B28]">
                    {c.orderCount}
                  </td>

                  <td className="py-4 px-4 font-bold text-emerald-800">
                    ₹{c.totalSpent.toLocaleString()}
                  </td>

                  <td className="py-4 px-4">
                    {c.isRecurringCustomer ? (
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Repeat className="w-3 h-3" /> Daily Subscriber
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#6B5145] bg-[#FAF5F0] px-2 py-0.5 rounded-full">
                        Standard Buyer
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setSelectedCust(c)}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] font-bold text-xs border border-[#F1E6DC] transition"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#F1E6DC] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1E6DC]">
              <h3 className="font-extrabold text-base text-[#302B28]">Resident Consumer Dossier</h3>
              <button
                onClick={() => setSelectedCust(null)}
                className="p-1 text-[#6B5145]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#6B5145]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF5F0] border-2 border-[#D97A5B] flex items-center justify-center font-black text-sm text-[#D97A5B]">
                  {selectedCust.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#302B28]">{selectedCust.name}</h4>
                  <p>{selectedCust.phone}</p>
                  <p>{selectedCust.email}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC] space-y-1">
                <span className="font-bold text-[#302B28] block">Registered Delivery Address</span>
                <p className="leading-relaxed">{selectedCust.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#FAF5F0] border border-[#F1E6DC]">
                  <span className="text-[10px] block">Total Orders</span>
                  <strong className="text-base font-black text-[#302B28]">{selectedCust.orderCount}</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF5F0] border border-[#F1E6DC]">
                  <span className="text-[10px] block">Lifetime Value</span>
                  <strong className="text-base font-black text-emerald-800">₹{selectedCust.totalSpent}</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedCust(null)}
                className="px-5 py-2.5 rounded-2xl bg-[#302B28] text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

