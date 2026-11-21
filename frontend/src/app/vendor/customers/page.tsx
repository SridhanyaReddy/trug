'use client';

import React, { useState } from 'react';
import { useVendor } from '@/context/VendorContext';
import { VendorCustomer } from '@/types/vendor';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Repeat,
  ShoppingBag,
  Edit,
  X,
  MessageSquare,
} from 'lucide-react';

export default function VendorCustomersPage() {
  const { customers, addCustomerNote } = useVendor();
  const [search, setSearch] = useState('');
  const [editingNoteCustomer, setEditingNoteCustomer] = useState<VendorCustomer | null>(null);
  const [noteText, setNoteText] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNoteCustomer) {
      addCustomerNote(editingNoteCustomer.id, noteText);
      setEditingNoteCustomer(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
            Neighbourhood Customer Directory
          </h1>
          <p className="text-xs text-[#6B5145] mt-0.5">
            Loyal buyers, recurring morning subscribers, lifetime order value, and doorstep instructions.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#F1E6DC] flex items-center justify-between shadow-xs">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, or apartment..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF5F0] text-xs font-medium text-[#302B28] rounded-xl border border-[#F1E6DC] focus:outline-none focus:border-[#D97A5B]"
          />
          <Search className="w-4 h-4 text-[#6B5145] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <span className="text-xs text-[#6B5145] font-semibold hidden sm:inline">
          {filteredCustomers.length} registered households
        </span>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-3xl border border-[#F1E6DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF5F0] border-b border-[#F1E6DC] text-[#6B5145] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Customer Name & Contact</th>
                <th className="py-3.5 px-4">Apartment / Address</th>
                <th className="py-3.5 px-4">Orders & Spend</th>
                <th className="py-3.5 px-4">Subscription Type</th>
                <th className="py-3.5 px-4">Store Notes</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1E6DC]/70">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF5F0]/40 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FAF5F0] border border-[#D97A5B]/30 flex items-center justify-center font-black text-xs text-[#D97A5B]">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#302B28] block">{c.name}</span>
                        <span className="text-[11px] text-[#6B5145] font-medium">{c.phone}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-[#6B5145] max-w-[200px] truncate">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D97A5B] shrink-0" />
                      <span className="truncate">{c.address}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-[#302B28] block">{c.orderCount} orders</span>
                    <span className="text-[11px] text-emerald-800 font-bold">
                      ₹{c.totalSpent.toLocaleString()} spent
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    {c.isRecurringCustomer ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                        <Repeat className="w-3 h-3" />
                        <span>Daily Subscriber</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-[#6B5145] bg-[#FAF5F0] px-2 py-0.5 rounded-full">
                        Regular On-Demand
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-[#6B5145] max-w-[200px]">
                    <span className="line-clamp-2 text-[11px] italic">
                      {c.notes || 'No custom instructions recorded.'}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => {
                        setEditingNoteCustomer(c);
                        setNoteText(c.notes || '');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] font-bold text-[11px] border border-[#F1E6DC] transition"
                    >
                      Edit Note
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Note Modal */}
      {editingNoteCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <form
            onSubmit={handleSaveNote}
            className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#F1E6DC] shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#F1E6DC]">
              <h3 className="font-extrabold text-base text-[#302B28]">
                Customer Doorstep Note
              </h3>
              <button
                type="button"
                onClick={() => setEditingNoteCustomer(null)}
                className="p-1 text-[#6B5145]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-[#302B28]">{editingNoteCustomer.name}</p>
              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g. Leave milk bottles on wooden crate beside door 402."
                className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingNoteCustomer(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B5145]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-[#D97A5B] text-white text-xs font-bold shadow-xs"
              >
                Save Instructions
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

