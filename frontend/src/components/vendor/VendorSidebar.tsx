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
  ExternalLink,
  Power,
  Sparkles,
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
    { label: 'Store Overview', href: '/vendor/dashboard', icon: LayoutDashboard },
    {
      label: 'Live Orders',
      href: '/vendor/orders',
      icon: ShoppingBag,
      badge: newOrdersCount > 0 ? newOrdersCount : undefined,
    },
    { label: 'Products Catalogue', href: '/vendor/products', icon: Package },
    { label: 'Inventory & Stock', href: '/vendor/inventory', icon: Boxes },
    { label: 'Delivery Windows', href: '/vendor/delivery-slots', icon: Clock },
    { label: 'Daily Subscriptions', href: '/vendor/recurring-orders', icon: Repeat },
    { label: 'Customer Base', href: '/vendor/customers', icon: Users },
    { label: 'Store Analytics', href: '/vendor/analytics', icon: BarChart3 },
    { label: 'Storefront Link', href: `/store/${vendorProfile.slug}`, icon: Store, external: true },
    { label: 'Platform Billing', href: '/vendor/subscription', icon: CreditCard },
    { label: 'Shop Settings', href: '/vendor/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#302B28] text-[#FAF5F0] border-r border-[#6B5145]/30 flex flex-col justify-between transition-all duration-300 ease-in-out shadow-xl ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top: Header branding & collapse */}
        <div className="p-4 border-b border-[#6B5145]/30">
          <div className="flex items-center justify-between">
            <Link
              href="/vendor/dashboard"
              className="flex items-center gap-3 overflow-hidden group focus:outline-hidden"
            >
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden shrink-0 border border-[#6B5145]/40 shadow-md group-hover:scale-105 transition-transform bg-[#FAF5F0]">
                <Image
                  src="/logo.png"
                  alt="TRUG Logo"
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
                      Vendor
                    </span>
                  </div>
                  <div className="text-[11px] text-[#FAF5F0]/70 truncate max-w-[130px] mt-1 font-medium">
                    {vendorProfile.businessName}
                  </div>
                </div>
              )}
            </Link>

            {/* Desktop Expand / Collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-7 h-7 rounded-xl bg-white/5 hover:bg-white/10 items-center justify-center text-[#FAF5F0]/70 hover:text-white transition"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Store Open Status Widget */}
          {!collapsed && (
            <div className="mt-4 bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    vendorProfile.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                  }`}
                />
                <span className="font-bold text-xs text-[#FAF5F0]">
                  {vendorProfile.isOpen ? 'Accepting Orders' : 'Store Offline'}
                </span>
              </div>
              <button
                onClick={toggleStoreStatus}
                title="Toggle Store Availability"
                className={`p-1.5 rounded-xl transition ${
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

        {/* Middle: Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-[#FAF5F0]/75 hover:text-white hover:bg-white/5 transition group ${
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
                      <span className="bg-[#302B28] text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white/20">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Merchant Profile Badge */}
        <div className="p-3 border-t border-[#6B5145]/30">
          {!collapsed ? (
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-[11px] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D97A5B]/20 text-[#D97A5B] flex items-center justify-center font-bold text-xs shrink-0">
                {(vendorProfile.ownerName || 'TR').slice(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="font-extrabold text-[#FAF5F0] truncate">{vendorProfile.businessName}</div>
                <div className="text-[10px] text-[#FAF5F0]/60">{vendorProfile.ownerName}</div>
              </div>
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-2xl bg-[#D97A5B]/20 text-[#D97A5B] mx-auto flex items-center justify-center font-bold text-xs"
              title={vendorProfile.businessName}
            >
              {(vendorProfile.ownerName || 'TR').slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
