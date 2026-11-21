'use client';

import React from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import {
  Menu,
  Bell,
  Search,
  Shield,
  HelpCircle,
  AlertTriangle,
  Store,
  ExternalLink,
} from 'lucide-react';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { adminUser, vendors, disputes, tickets } = useAdmin();

  const pendingApprovals = vendors.filter((v) => v.verificationStatus === 'Pending Review').length;
  const activeDisputes = disputes.filter((d) => d.status === 'Under Investigation').length;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF5F0]/95 backdrop-blur-md border-b border-[#F1E6DC] h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Trigger + Environment identifier */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-[#302B28] hover:text-[#D97A5B] transition rounded-lg"
          aria-label="Open admin menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm text-[#302B28] hidden sm:inline">
            TRUG Admin Control Tower
          </span>
          <span className="text-[10px] bg-[#302B28] text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Live Environment
          </span>
        </div>
      </div>

      {/* Right: Alerts & Admin Profile */}
      <div className="flex items-center gap-3">
        {/* Pending approvals tag */}
        {pendingApprovals > 0 && (
          <Link
            href="/admin/vendors"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold transition shadow-xs hover:bg-amber-100"
          >
            <Store className="w-3.5 h-3.5 text-amber-700" />
            <span>{pendingApprovals} Vendor Approvals Pending</span>
          </Link>
        )}

        {/* Dispute alert */}
        {activeDisputes > 0 && (
          <Link
            href="/admin/disputes"
            className="relative p-2 rounded-full bg-white hover:bg-red-50 border border-red-200 text-red-700 transition shadow-xs"
            title="Active Disputes"
          >
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {activeDisputes}
            </span>
          </Link>
        )}

        {/* Support Helpdesk Link */}
        <Link
          href="/admin/support"
          className="p-2 rounded-full bg-white hover:bg-[#F1E6DC] border border-[#F1E6DC] text-[#302B28] transition shadow-xs"
          title="Support Tickets"
        >
          <Bell className="w-4 h-4 text-[#D97A5B]" />
        </Link>

        {/* Admin Avatar */}
        <Link
          href="/admin/settings"
          className="w-8 h-8 rounded-full bg-[#D97A5B] text-white font-black text-xs flex items-center justify-center border border-white/20 hover:ring-2 hover:ring-[#302B28] transition shadow-xs"
          title={adminUser.name}
        >
          SR
        </Link>
      </div>
    </header>
  );
}

