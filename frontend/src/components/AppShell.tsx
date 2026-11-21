'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UniversalPortalSwitcher from '@/components/UniversalPortalSwitcher';

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isVendor = pathname.startsWith('/vendor');
  const isAdmin = pathname.startsWith('/admin');
  const isCustomer = !isVendor && !isAdmin;

  return (
    <>
      {isCustomer && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {isCustomer && <Footer />}
      <UniversalPortalSwitcher />
    </>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF5F0]" />}>
      <AppShellInner>{children}</AppShellInner>
    </Suspense>
  );
}
