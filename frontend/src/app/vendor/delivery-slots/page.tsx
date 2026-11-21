'use client';

import React, { useState } from 'react';
import { useVendor } from '@/context/VendorContext';
import { DeliverySlotConfig } from '@/types/vendor';
import {
  Clock,
  Plus,
  Power,
  Edit,
  Trash2,
  X,
  Truck,
  Building,
  CheckCircle2,
} from 'lucide-react';

export default function VendorDeliverySlotsPage() {
  const { deliverySlots, addDeliverySlot, updateDeliverySlot, toggleSlotEnabled } = useVendor();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<DeliverySlotConfig | null>(null);

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('06:30');
  const [endTime, setEndTime] = useState('08:00');
  const [maxOrdersCapacity, setMaxOrdersCapacity] = useState(40);
  const [cutOffTime, setCutOffTime] = useState('10:00 PM previous day');
  const [type, setType] = useState<DeliverySlotConfig['type']>('both');

  const openAddModal = () => {
    setEditingSlot(null);
    setTitle('');
    setStartTime('06:30');
    setEndTime('08:00');
    setMaxOrdersCapacity(35);
    setCutOffTime('10:00 PM previous day');
    setType('both');
    setModalOpen(true);
  };

  const openEditModal = (slot: DeliverySlotConfig) => {
    setEditingSlot(slot);
    setTitle(slot.title);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setMaxOrdersCapacity(slot.maxOrdersCapacity);
    setCutOffTime(slot.cutOffTime);
    setType(slot.type);
    setModalOpen(true);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlot) {
      updateDeliverySlot(editingSlot.id, {
        title,
        startTime,
        endTime,
        maxOrdersCapacity: Number(maxOrdersCapacity),
        cutOffTime,
        type,
      });
    } else {
      addDeliverySlot({
        title,
        startTime,
        endTime,
        maxOrdersCapacity: Number(maxOrdersCapacity),
        cutOffTime,
        type,
        isEnabled: true,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
            Delivery Windows & Capacity
          </h1>
          <p className="text-xs text-[#6B5145] mt-0.5">
            Configure morning milk drops, evening kitchen batches, order limits, and ordering cut-off times.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-full bg-[#D97A5B] hover:bg-[#c2694d] text-white font-bold text-xs tracking-wide shadow-md transition flex items-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Slot</span>
        </button>
      </div>

      {/* Slots List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deliverySlots.map((slot) => {
          const percentBooked = Math.round((slot.currentBookings / slot.maxOrdersCapacity) * 100);

          return (
            <div
              key={slot.id}
              className={`bg-white rounded-3xl border p-5 sm:p-6 transition shadow-xs space-y-4 ${
                slot.isEnabled
                  ? 'border-[#F1E6DC]'
                  : 'border-[#F1E6DC]/40 opacity-70 bg-[#FAF5F0]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      slot.isEnabled
                        ? 'bg-[#D97A5B]/15 text-[#D97A5B]'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#302B28]">{slot.title}</h3>
                    <span className="text-xs font-black text-[#D97A5B] block mt-0.5">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleSlotEnabled(slot.id)}
                    className={`p-2 rounded-xl text-xs font-bold transition ${
                      slot.isEnabled
                        ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                    title={slot.isEnabled ? 'Disable slot' : 'Enable slot'}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => openEditModal(slot)}
                    className="p-2 rounded-xl bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#6B5145] hover:text-[#302B28] transition"
                    title="Edit slot details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Slot details & capacity progress */}
              <div className="space-y-2 pt-2 border-t border-[#F1E6DC]/70 text-xs">
                <div className="flex items-center justify-between text-[#6B5145]">
                  <span>Bookings Capacity:</span>
                  <span className="font-bold text-[#302B28]">
                    {slot.currentBookings} / {slot.maxOrdersCapacity} Orders ({percentBooked}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAF5F0] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      percentBooked > 85 ? 'bg-amber-600' : 'bg-[#D97A5B]'
                    }`}
                    style={{ width: `${Math.min(100, percentBooked)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[#6B5145] pt-1">
                  <span>Ordering Cut-Off:</span>
                  <span className="font-semibold text-[#302B28]">{slot.cutOffTime}</span>
                </div>

                <div className="flex items-center justify-between text-[#6B5145]">
                  <span>Fulfillment Type:</span>
                  <span className="font-bold text-[#302B28] capitalize">
                    {slot.type === 'both' ? 'Delivery & Store Pickup' : slot.type}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Slot Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <form
            onSubmit={handleSaveSlot}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#F1E6DC] shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F1E6DC]">
              <h3 className="font-extrabold text-base text-[#302B28]">
                {editingSlot ? 'Edit Delivery Slot' : 'Create New Time Window'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#6B5145] hover:text-[#302B28]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Slot Name / Tagline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Morning Fresh Milk Batch"
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B5145] font-bold mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                  />
                </div>
                <div>
                  <label className="block text-[#6B5145] font-bold mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B5145] font-bold mb-1">Max Order Capacity</label>
                  <input
                    type="number"
                    required
                    value={maxOrdersCapacity}
                    onChange={(e) => setMaxOrdersCapacity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                  />
                </div>
                <div>
                  <label className="block text-[#6B5145] font-bold mb-1">Fulfillment Mode</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                  >
                    <option value="both">Both (Delivery & Pickup)</option>
                    <option value="delivery">Delivery Only</option>
                    <option value="pickup">Pickup Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Order Cut-Off Rule</label>
                <input
                  type="text"
                  required
                  value={cutOffTime}
                  onChange={(e) => setCutOffTime(e.target.value)}
                  placeholder="e.g. 10:00 PM previous day"
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1E6DC]">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B5145]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white text-xs font-bold shadow-xs"
              >
                Save Window
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

