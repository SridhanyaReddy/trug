'use client';

import React, { useState } from 'react';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/context/CartContext';
import { X, Calendar, Clock, Check, Sparkles } from 'lucide-react';

interface RecurringModalProps {
  product: Product | null;
  variant: ProductVariant | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RecurringModal({ product, variant, isOpen, onClose }: RecurringModalProps) {
  const { addRecurringOrder, user } = useCart();

  const [frequency, setFrequency] = useState<'daily' | 'alternate_days' | 'weekly' | 'custom_days'>('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [timeSlot, setTimeSlot] = useState<'Morning (6:30 AM - 8:00 AM)' | 'Evening (5:00 PM - 7:00 PM)'>(
    'Morning (6:30 AM - 8:00 AM)'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  if (!isOpen || !product || !variant) return null;

  const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubscribe = () => {
    addRecurringOrder({
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      product,
      variant,
      quantity,
      frequency,
      selectedDays: frequency === 'custom_days' ? selectedDays : undefined,
      timeSlot,
      startDate: new Date().toISOString().split('T')[0],
      nextDeliveryDate: 'Tomorrow at 6:45 AM',
      address: user.addresses[0]?.addressLine || 'Apt 402, Oakwood Palms, Bellandur',
    });

    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF5F0] border border-[#F1E6DC] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1E6DC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#D97A5B]/20 text-[#D97A5B] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#302B28]">Daily Recurring Delivery</h3>
              <p className="text-[11px] text-[#6B5145]">Set it once, pause or edit anytime</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#6B5145] hover:text-[#302B28]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product preview */}
        <div className="bg-white p-3 rounded-2xl border border-[#F1E6DC] flex items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-sm text-[#302B28]">{product.name}</h4>
            <span className="text-xs text-[#6B5145]">
              {variant.name} • ₹{variant.price} • {product.vendorName}
            </span>
          </div>
          {/* Quantity stepper */}
          <div className="flex items-center gap-2 bg-[#FAF5F0] px-2 py-1 rounded-xl border border-[#F1E6DC]">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-6 h-6 text-sm font-bold text-[#6B5145] hover:text-[#302B28]"
            >
              -
            </button>
            <span className="text-xs font-bold w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-6 h-6 text-sm font-bold text-[#6B5145] hover:text-[#302B28]"
            >
              +
            </button>
          </div>
        </div>

        {/* Frequency selector */}
        <div>
          <label className="block text-xs font-bold text-[#302B28] mb-2 uppercase tracking-wider">
            Delivery Frequency
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'daily', label: 'Every Day' },
              { id: 'alternate_days', label: 'Alt Days' },
              { id: 'weekly', label: 'Weekly' },
              { id: 'custom_days', label: 'Custom' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFrequency(f.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition text-center ${
                  frequency === f.id
                    ? 'bg-[#D97A5B] text-white shadow-xs'
                    : 'bg-white hover:bg-[#F1E6DC] text-[#302B28] border border-[#F1E6DC]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Custom days selection */}
          {frequency === 'custom_days' && (
            <div className="flex flex-wrap gap-2 mt-3 pt-2">
              {daysList.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`w-9 h-9 rounded-full text-xs font-bold transition ${
                      isSelected
                        ? 'bg-[#302B28] text-white shadow-xs'
                        : 'bg-white text-[#6B5145] border border-[#F1E6DC]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Time Slot */}
        <div>
          <label className="block text-xs font-bold text-[#302B28] mb-2 uppercase tracking-wider">
            Preferred Time Slot
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              'Morning (6:30 AM - 8:00 AM)',
              'Evening (5:00 PM - 7:00 PM)',
            ].map((slot) => (
              <button
                key={slot}
                onClick={() => setTimeSlot(slot as any)}
                className={`py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-between text-left transition ${
                  timeSlot === slot
                    ? 'bg-[#302B28] text-white'
                    : 'bg-white hover:bg-[#F1E6DC] text-[#302B28] border border-[#F1E6DC]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{slot}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info card */}
        <div className="bg-[#F1E6DC]/70 p-3 rounded-xl text-xs text-[#6B5145] flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#D97A5B] shrink-0 mt-0.5" />
          <p>
            No advance lock-ins. You are only billed per delivery. Pause before 10 PM for the next morning.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <button
            onClick={handleSubscribe}
            disabled={confirmed}
            className="w-full py-3 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white font-bold text-sm tracking-wide shadow-md transition flex items-center justify-center gap-2"
          >
            {confirmed ? (
              <>
                <Check className="w-5 h-5" />
                <span>Schedule Created!</span>
              </>
            ) : (
              <span>Start Daily Schedule (₹{variant.price * quantity}/drop)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

