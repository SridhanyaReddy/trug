'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useVendor } from '@/context/VendorContext';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Clock,
  Users,
  Repeat,
  BarChart3,
  CreditCard,
  Store,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Power,
  ExternalLink,
} from 'lucide-react';

interface VendorSidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export default function VendorSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: VendorSidebarProps) {
  const pathname = usePathname();
  const { vendorProfile, toggleStoreStatus, vendorOrders } = useVendor();

  const newOrdersCount = vendorOrders.filter((o) => o.status === 'Placed').length;

  const navLinks = [
    { label: 'Overview', href: '/vendor/dashboard', icon: LayoutDashboard },
    {
      label: 'Live Orders',
      href: '/vendor/orders',
      icon: ShoppingBag,
      badge: newOrdersCount > 0 ? newOrdersCount : undefined,
    },
    { label: 'Products', href: '/vendor/products', icon: Package },
    { label: 'Inventory & Stock', href: '/vendor/inventory', icon: Boxes },
    { label: 'Delivery Slots', href: '/vendor/delivery-slots', icon: Clock },
    { label: 'Daily Subscriptions', href: '/vendor/recurring-orders', icon: Repeat },
    { label: 'Customers', href: '/vendor/customers', icon: Users },
    { label: 'Store Analytics', href: '/vendor/analytics', icon: BarChart3 },
    { label: 'My Storefront', href: `/store/${vendorProfile.slug}`, icon: Store, external: true },
    { label: 'Platform Plan', href: '/vendor/subscription', icon: CreditCard },
    { label: 'Shop Settings', href: '/vendor/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#302B28] text-[#FAF5F0] border-r border-[#6B5145]/30 flex flex-col justify-between transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top: Branding & Store Switch */}
        <div className="p-4 border-b border-[#6B5145]/30">
          <div className="flex items-center justify-between">
            <Link href="/vendor/dashboard" className="flex items-center gap-2.5 overflow-hidden group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#6B5145]/40 shadow-xs group-hover:scale-105 transition-transform">
                <Image
                  src="/logo.png"
                  alt="TRUG"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              {!collapsed && (
                <div className="truncate">
                  <div className="text-sm font-black tracking-tight flex items-center gap-1.5 leading-none">
                    <span>trug.</span>
                    <span className="text-[10px] text-[#D97A5B] uppercase font-bold tracking-widest bg-white/10 px-1.5 py-0.5 rounded">
                      Vendor
                    </span>
                  </div>
                  <div className="text-[10px] text-[#FAF5F0]/70 truncate max-w-[130px] mt-1">
                    {vendorProfile.businessName}
                  </div>
                </div>
              )}
            </Link>

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 items-center justify-center text-[#FAF5F0]/70 hover:text-white transition"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Store Open / Closed Switch */}
          {!collapsed && (
            <div className="mt-4 bg-white/5 p-2.5 rounded-2xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    vendorProfile.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                  }`}
                />
                <span className="font-semibold text-[11px]">
                  {vendorProfile.isOpen ? 'Store Accepting Orders' : 'Store Offline'}
                </span>
              </div>
              <button
                onClick={toggleStoreStatus}
                title="Toggle store open / offline"
                className={`p-1.5 rounded-lg transition ${
                  vendorProfile.isOpen
                    ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Middle: Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-none">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold text-[#FAF5F0]/80 hover:text-white hover:bg-white/5 transition group ${
                    collapsed ? 'justify-center' : ''
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 text-[#D97A5B] shrink-0" />
                  {!collapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span>{item.label}</span>
                      <ExternalLink className="w-3 h-3 text-[#FAF5F0]/40 group-hover:text-white" />
                    </div>
                  )}
                </a>
              );
            }

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
                      <span className="bg-[#302B28] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Customer Portal Link & Staff ID */}
        <div className="p-3 border-t border-[#6B5145]/30 space-y-2">
          {!collapsed ? (
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-[11px] space-y-1">
              <div className="font-bold text-[#FAF5F0] truncate">{vendorProfile.ownerName}</div>
              <div className="text-[#FAF5F0]/60 text-[10px]">Staff ID: #KR-901 • Active</div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 mx-auto flex items-center justify-center font-bold text-xs text-[#D97A5B]">
              RY
            </div>
          )}

          <Link
            href="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold text-[#FAF5F0]/70 hover:text-white hover:bg-white/5 transition ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Switch to Customer App"
          >
            <LogOut className="w-3.5 h-3.5 rotate-180 text-[#D97A5B]" />
            {!collapsed && <span>Customer Website</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}

