'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { VendorProvider } from '@/context/VendorContext';
import VendorSidebar from '@/components/vendor/VendorSidebar';
import VendorHeader from '@/components/vendor/VendorHeader';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login or registration page, render clean auth wrapper without sidebar
  const isAuthPage = pathname === '/vendor/login' || pathname === '/vendor/register';

  if (isAuthPage) {
    return (
      <VendorProvider>
        <div className="min-h-screen bg-[#FAF5F0] text-[#302B28]">
          {children}
        </div>
      </VendorProvider>
    );
  }

  return (
    <VendorProvider>
      <div className="min-h-screen bg-[#FAF5F0] text-[#302B28] flex">
        {/* Sidebar */}
        <VendorSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
            collapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          <VendorHeader onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </VendorProvider>
  );
}

