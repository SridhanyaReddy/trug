'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, ShoppingBag, Shield, Repeat, ExternalLink } from 'lucide-react';

export default function UniversalPortalSwitcher() {
  const pathname = usePathname();

  const isCustomer = !pathname.startsWith('/vendor') && !pathname.startsWith('/admin');
  const isVendor = pathname.startsWith('/vendor');
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden sm:flex items-center gap-1.5 bg-[#302B28]/90 backdrop-blur-md text-white p-1.5 rounded-full border border-white/10 shadow-2xl text-[11px] font-semibold">
      <Link
        href="/"
        className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${
          isCustomer
            ? 'bg-[#D97A5B] text-white shadow-xs'
            : 'text-[#FAF5F0]/70 hover:text-white hover:bg-white/10'
        }`}
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>Customer</span>
      </Link>

      <Link
        href="/vendor/dashboard"
        className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${
          isVendor
            ? 'bg-[#D97A5B] text-white shadow-xs'
            : 'text-[#FAF5F0]/70 hover:text-white hover:bg-white/10'
        }`}
      >
        <Store className="w-3.5 h-3.5" />
        <span>Vendor</span>
      </Link>

      <Link
        href="/admin/dashboard"
        className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${
          isAdmin
            ? 'bg-[#D97A5B] text-white shadow-xs'
            : 'text-[#FAF5F0]/70 hover:text-white hover:bg-white/10'
        }`}
      >
        <Shield className="w-3.5 h-3.5" />
        <span>Admin</span>
      </Link>
    </div>
  );
}

