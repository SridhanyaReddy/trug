'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, ShoppingBag, Shield, ChevronDown, Check, ArrowRight } from 'lucide-react';

export default function UniversalPortalSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isCustomer = !pathname.startsWith('/vendor') && !pathname.startsWith('/admin');
  const isVendor = pathname.startsWith('/vendor');
  const isAdmin = pathname.startsWith('/admin');

  const currentRole = isVendor
    ? { name: 'Vendor Portal', icon: Store, color: 'bg-[#D97A5B]', desc: 'Store management & orders' }
    : isAdmin
    ? { name: 'Admin Tower', icon: Shield, color: 'bg-[#302B28]', desc: 'Platform control & KYC' }
    : { name: 'Customer Web', icon: ShoppingBag, color: 'bg-emerald-600', desc: 'Shop everyday essentials' };

  const portals = [
    {
      id: 'customer',
      name: 'Customer Website',
      href: '/',
      icon: ShoppingBag,
      active: isCustomer,
      badge: 'Public Store',
      tagline: 'Discover local neighbourhood shops',
    },
    {
      id: 'vendor',
      name: 'Vendor Dashboard',
      href: '/vendor/dashboard',
      icon: Store,
      active: isVendor,
      badge: 'Merchant App',
      tagline: 'Orders, inventory & catalog',
    },
    {
      id: 'admin',
      name: 'Admin Control Tower',
      href: '/admin/dashboard',
      icon: Shield,
      active: isAdmin,
      badge: 'Platform Root',
      tagline: 'Approvals, disputes & analytics',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Popover Menu */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-16 right-0 z-50 w-72 sm:w-80 rounded-3xl bg-[#FAF5F0] border border-[#F1E6DC] p-3 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="px-3 py-2 border-b border-[#F1E6DC] mb-2 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#6B5145]">
                  Switch TRUG Environment
                </p>
                <p className="text-xs font-bold text-[#302B28]">Instant Portal Navigation</p>
              </div>
              <span className="text-[9px] bg-[#D97A5B]/15 text-[#D97A5B] font-extrabold px-2 py-0.5 rounded-full">
                Demo Ready
              </span>
            </div>

            <div className="space-y-1.5">
              {portals.map((p) => {
                const Icon = p.icon;
                return (
                  <Link
                    key={p.id}
                    href={p.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl transition border ${
                      p.active
                        ? 'bg-[#302B28] text-white border-[#302B28] shadow-md'
                        : 'bg-white hover:bg-[#F1E6DC]/60 text-[#302B28] border-[#F1E6DC]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          p.active ? 'bg-[#D97A5B] text-white' : 'bg-[#FAF5F0] text-[#6B5145]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold leading-none">{p.name}</span>
                          {p.active && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <span
                          className={`text-[10px] block mt-0.5 ${
                            p.active ? 'text-[#FAF5F0]/70' : 'text-[#6B5145]'
                          }`}
                        >
                          {p.tagline}
                        </span>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-3.5 h-3.5 ${
                        p.active ? 'text-[#D97A5B]' : 'text-[#6B5145]/40'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Floating Pill Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 bg-[#302B28] hover:bg-[#24201E] text-white pl-2.5 pr-4 py-2 rounded-full shadow-xl border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
        title="Switch between Customer, Vendor, and Admin platforms"
      >
        <div
          className={`w-7 h-7 rounded-full ${currentRole.color} text-white flex items-center justify-center shrink-0 shadow-xs`}
        >
          <currentRole.icon className="w-3.5 h-3.5" />
        </div>
        <div className="text-left">
          <div className="text-[9px] uppercase tracking-wider text-[#FAF5F0]/60 font-semibold leading-tight">
            Active Portal
          </div>
          <div className="text-xs font-extrabold tracking-tight flex items-center gap-1 leading-tight text-[#FAF5F0]">
            <span>{currentRole.name}</span>
            <ChevronDown
              className={`w-3 h-3 text-[#D97A5B] transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </button>
    </div>
  );
}
