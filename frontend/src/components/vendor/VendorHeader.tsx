'use client';

import React from 'react';
import Link from 'next/link';
import { useVendor } from '@/context/VendorContext';
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  Store,
  Power,
  Sparkles,
} from 'lucide-react';

interface VendorHeaderProps {
  onMenuClick: () => void;
}

export default function VendorHeader({ onMenuClick }: VendorHeaderProps) {
  const { vendorProfile, toggleStoreStatus, vendorOrders } = useVendor();
  const pendingOrders = vendorOrders.filter((o) => o.status === 'Placed').length;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF5F0]/95 backdrop-blur-md border-b border-[#F1E6DC] h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Trigger + Store name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-[#302B28] hover:text-[#D97A5B] transition rounded-lg"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="font-extrabold text-base text-[#302B28] hidden sm:inline">
            {vendorProfile.businessName}
          </span>
          <span className="text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded-full">
            {vendorProfile.verificationStatus}
          </span>
        </div>
      </div>

      {/* Right: Quick actions */}
      <div className="flex items-center gap-3">
        {/* Toggle Store State */}
        <button
          onClick={toggleStoreStatus}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
            vendorProfile.isOpen
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              vendorProfile.isOpen ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
          <span className="hidden sm:inline">
            {vendorProfile.isOpen ? 'Store Open' : 'Store Closed'}
          </span>
        </button>

        {/* View Live Storefront */}
        <a
          href={`/store/${vendorProfile.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F1E6DC] text-[#302B28] border border-[#F1E6DC] text-xs font-bold transition shadow-xs"
        >
          <Store className="w-3.5 h-3.5 text-[#D97A5B]" />
          <span>View Public Store</span>
          <ExternalLink className="w-3 h-3 text-[#6B5145]" />
        </a>

        {/* Orders Alert Pill */}
        <Link
          href="/vendor/orders"
          className="relative p-2 rounded-full bg-white hover:bg-[#F1E6DC] border border-[#F1E6DC] text-[#302B28] transition shadow-xs"
          title="Live Orders"
        >
          <Bell className="w-4 h-4 text-[#D97A5B]" />
          {pendingOrders > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#D97A5B] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {pendingOrders}
            </span>
          )}
        </Link>

        {/* User Avatar */}
        <Link
          href="/vendor/settings"
          className="w-8 h-8 rounded-full bg-[#302B28] text-white font-black text-xs flex items-center justify-center border border-white/20 hover:ring-2 hover:ring-[#D97A5B] transition shadow-xs"
          title="Account Settings"
        >
          RY
        </Link>
      </div>
    </header>
  );
}

