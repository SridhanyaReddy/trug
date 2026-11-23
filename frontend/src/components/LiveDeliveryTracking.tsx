'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Package,
  Store,
  Navigation,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Bike,
} from 'lucide-react';

interface LiveDeliveryTrackingProps {
  order: {
    id: string;
    orderNumber: string;
    storeName?: string;
    items?: any[];
    total?: number;
    deliverySlot?: string;
    recipient?: string;
    phone?: string;
    addressLine?: string;
    lat?: number;
    lng?: number;
  };
  onClose?: () => void;
}

export default function LiveDeliveryTracking({ order, onClose }: LiveDeliveryTrackingProps) {
  const [etaMinutes, setEtaMinutes] = useState(14);
  const [currentStep, setCurrentStep] = useState(2); // 1: Accepted, 2: Packed & Dispatched, 3: Arrived

  const storeLat = 17.5890;
  const storeLng = 78.4320;
  const destLat = order.lat || 17.5878;
  const destLng = order.lng || 78.4312;

  // Real Google Maps Route Iframe
  const mapUrl = `https://maps.google.com/maps?saddr=${storeLat},${storeLng}&daddr=${destLat},${destLng}&hl=en&z=15&output=embed`;

  useEffect(() => {
    const timer = setInterval(() => {
      setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-[#F1E6DC] shadow-xl overflow-hidden max-w-xl mx-auto my-4 text-[#302B28]">
      {/* Header Banner */}
      <div className="bg-[#302B28] text-white p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
              Live Delivery in Progress
            </span>
          </div>
          <h3 className="text-xl font-black mt-1">Order #{order.orderNumber}</h3>
          <p className="text-xs text-white/80">From {order.storeName || 'Neighbourhood Store'}</p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black text-[#D97A5B] leading-none">{etaMinutes} mins</div>
          <div className="text-[10px] uppercase font-bold text-white/70 mt-0.5">Estimated Arrival</div>
        </div>
      </div>

      {/* Live Google Maps View */}
      <div className="relative w-full h-64 bg-[#E5E3DF]">
        <iframe
          title="Live Delivery Rider Tracking"
          src={mapUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          className="w-full h-full border-0 filter saturate-105"
        />

        {/* Live Rider Marker Overlay */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full border border-[#F1E6DC] text-xs font-bold shadow-md flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#D97A5B] text-white flex items-center justify-center">
            <Bike className="w-3.5 h-3.5" />
          </div>
          <span>Partner heading to doorstep</span>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="p-5 border-b border-[#F1E6DC] bg-[#FAF5F0] space-y-4">
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: 'Confirmed' },
            { step: 2, title: 'Picked & Out' },
            { step: 3, title: 'Delivered' },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center flex-1 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition ${
                  currentStep >= s.step
                    ? 'bg-[#D97A5B] text-white shadow-xs'
                    : 'bg-[#F1E6DC] text-[#6B5145]'
                }`}
              >
                {currentStep > s.step ? <CheckCircle2 className="w-4 h-4" /> : s.step}
              </div>
              <span className="text-[11px] font-bold mt-1 text-[#302B28]">{s.title}</span>
            </div>
          ))}
        </div>

        {/* Delivery Details Card */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#F1E6DC] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#D97A5B]/15 text-[#D97A5B] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-extrabold text-[#302B28] truncate">
                {order.addressLine || 'Dundigal, Hyderabad'}
              </div>
              <div className="text-[10px] text-[#6B5145]">
                {order.deliverySlot === 'morning' ? 'Scheduled: 6:30 AM - 8:00 AM' : 'Hyperlocal Priority Dispatch'}
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/919515803954"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] rounded-xl text-[11px] font-bold border border-[#F1E6DC] shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <Phone className="w-3 h-3 text-[#D97A5B]" />
            <span>Support</span>
          </a>
        </div>
      </div>
    </div>
  );
}
