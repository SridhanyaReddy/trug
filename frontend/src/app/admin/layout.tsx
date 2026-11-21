'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminProvider } from '@/context/AdminContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login page, render clean auth wrapper without sidebar
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <AdminProvider>
        <div className="min-h-screen bg-[#FAF5F0] text-[#302B28]">
          {children}
        </div>
      </AdminProvider>
    );
  }

  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#FAF5F0] text-[#302B28] flex">
        {/* Admin Sidebar */}
        <AdminSidebar
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
          <AdminHeader onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}

