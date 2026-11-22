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
      label: 'Shop Approvals',
      href: '/admin/vendors',
      icon: Store,
      badge: pendingVendors > 0 ? pendingVendors : undefined,
    },
    { label: 'Residents Directory', href: '/admin/customers', icon: Users },
    { label: 'Platform Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Taxonomy & Catalogue', href: '/admin/categories', icon: Layers },
    { label: 'Vendor Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    {
      label: 'Support Tickets',
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
    { label: 'Intelligence Reports', href: '/admin/reports', icon: FileBarChart },
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
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#302B28] text-[#FAF5F0] border-r border-[#6B5145]/40 flex flex-col justify-between transition-all duration-300 ease-in-out shadow-xl ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top: Admin Logo & Toggle */}
        <div className="p-4 border-b border-[#6B5145]/40">
          <div className="flex items-center justify-between">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 overflow-hidden group focus:outline-hidden"
            >
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden shrink-0 border border-[#6B5145]/40 shadow-md group-hover:scale-105 transition-transform bg-[#FAF5F0]">
                <Image
                  src="/logo.png"
                  alt="TRUG Admin"
                  fill
                  sizes="44px"
                  className="object-cover"
                  priority
                />
              </div>
              {!collapsed && (
                <div className="truncate">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-base font-black tracking-tight text-[#FAF5F0]">trug.</span>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md bg-[#D97A5B] text-white">
                      Admin
                    </span>
                  </div>
                  <div className="text-[11px] text-[#FAF5F0]/70 truncate mt-1 font-medium">
                    Control Tower
                  </div>
                </div>
              )}
            </Link>

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-7 h-7 rounded-xl bg-white/5 hover:bg-white/10 items-center justify-center text-[#FAF5F0]/70 hover:text-white transition"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Middle: Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#D97A5B] text-white shadow-sm'
                    : 'text-[#FAF5F0]/75 hover:text-white hover:bg-white/5'
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
                      <span className="bg-[#D97A5B] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Root Operator Profile Badge */}
        <div className="p-3 border-t border-[#6B5145]/40">
          {!collapsed ? (
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-[11px] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D97A5B] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <Shield className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="font-extrabold text-[#FAF5F0] truncate">Admin Operator</div>
                <div className="text-[10px] text-emerald-400 font-semibold">Superadmin Privileges</div>
              </div>
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-2xl bg-[#D97A5B] text-white mx-auto flex items-center justify-center font-bold text-xs shadow-xs"
              title="Admin Operator"
            >
              <Shield className="w-4 h-4" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
