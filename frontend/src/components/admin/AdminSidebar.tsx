'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import {
  LayoutDashboard,
  Store,
  Users,
  ShoppingBag,
  Layers,
  CreditCard,
  HelpCircle,
  AlertOctagon,
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  Shield,
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { vendors, tickets, disputes } = useAdmin();

  const pendingVendors = vendors.filter((v) => v.verificationStatus === 'Pending Review').length;
  const openTickets = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;
  const activeDisputes = disputes.filter((d) => d.status === 'Under Investigation').length;

  const navLinks = [
    { label: 'Admin Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    {
      label: 'Neighbourhood Vendors',
      href: '/admin/vendors',
      icon: Store,
      badge: pendingVendors > 0 ? pendingVendors : undefined,
    },
    { label: 'Residents Directory', href: '/admin/customers', icon: Users },
    { label: 'Platform Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Categories & Catalogue', href: '/admin/categories', icon: Layers },
    { label: 'Vendor Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    {
      label: 'Support Helpdesk',
      href: '/admin/support',
      icon: HelpCircle,
      badge: openTickets > 0 ? openTickets : undefined,
    },
    {
      label: 'Disputes & Refunds',
      href: '/admin/disputes',
      icon: AlertOctagon,
      badge: activeDisputes > 0 ? activeDisputes : undefined,
    },
    { label: 'Intelligence & Reports', href: '/admin/reports', icon: FileBarChart },
    { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Admin Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#302B28] text-[#FAF5F0] border-r border-[#6B5145]/40 flex flex-col justify-between transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top: Admin Logo & Toggle */}
        <div className="p-4 border-b border-[#6B5145]/40">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5 overflow-hidden group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#6B5145]/40 shadow-xs group-hover:scale-105 transition-transform">
                <Image
                  src="/logo.png"
                  alt="TRUG Platform Admin"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              {!collapsed && (
                <div className="truncate">
                  <div className="text-sm font-black tracking-tight flex items-center gap-1.5 leading-none">
                    <span>trug.</span>
                    <span className="text-[10px] text-white uppercase font-extrabold tracking-widest bg-[#D97A5B] px-1.5 py-0.5 rounded">
                      Admin
                    </span>
                  </div>
                  <div className="text-[10px] text-[#FAF5F0]/65 truncate mt-1">
                    Platform Control Tower
                  </div>
                </div>
              )}
            </Link>

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 items-center justify-center text-[#FAF5F0]/70 hover:text-white transition"
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-none">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#D97A5B] text-white shadow-sm'
                    : 'text-[#FAF5F0]/80 hover:text-white hover:bg-white/5'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-[#D97A5B]'
                  }`}
                />
                {!collapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="bg-[#FAF5F0] text-[#302B28] text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Quick Links */}
        <div className="p-3 border-t border-[#6B5145]/40 space-y-2">
          {!collapsed && (
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-[11px] space-y-0.5">
              <div className="font-bold text-[#FAF5F0]">Sridhanya Reddy</div>
              <div className="text-[#FAF5F0]/60 text-[10px]">Operations Lead • Bellandur Cluster</div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Link
              href="/vendor/dashboard"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-[#FAF5F0]/70 hover:text-white hover:bg-white/5 transition ${
                collapsed ? 'justify-center' : ''
              }`}
              title="Open Vendor Dashboard"
            >
              <Store className="w-3.5 h-3.5 text-[#D97A5B]" />
              {!collapsed && <span>Vendor Portal</span>}
            </Link>

            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-[#FAF5F0]/70 hover:text-white hover:bg-white/5 transition ${
                collapsed ? 'justify-center' : ''
              }`}
              title="Open Customer Website"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#D97A5B]" />
              {!collapsed && <span>Customer Website</span>}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

