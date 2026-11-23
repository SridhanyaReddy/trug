'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Home, Store, Repeat, User as UserIcon } from 'lucide-react';

interface MobileBottomNavProps {
  totalCartItemCount: number;
  isLoggedIn: boolean;
  onOpenCart: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
}

export default function MobileBottomNav({
  totalCartItemCount,
  isLoggedIn,
  onOpenCart,
  onOpenProfile,
  onOpenAuth,
}: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#F1E6DC] z-30 px-3 py-2 flex items-center justify-around shadow-lg safe-bottom">
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
          pathname === '/' ? 'text-[#D97A5B] font-black' : 'text-[#6B5145] font-semibold'
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="text-[10px] tracking-tight">Home</span>
      </Link>

      <Link
        href="/shops"
        className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
          pathname === '/shops' ? 'text-[#D97A5B] font-black' : 'text-[#6B5145] font-semibold'
        }`}
      >
        <Store className="w-4 h-4" />
        <span className="text-[10px] tracking-tight">Stores</span>
      </Link>

      <Link
        href="/recurring"
        className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
          pathname === '/recurring' ? 'text-[#D97A5B] font-black' : 'text-[#6B5145] font-semibold'
        }`}
      >
        <Repeat className="w-4 h-4" />
        <span className="text-[10px] tracking-tight">Daily</span>
      </Link>

      <button
        onClick={onOpenCart}
        className="relative flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[#6B5145] font-semibold cursor-pointer"
        type="button"
        aria-label="View Shopping Basket"
      >
        <ShoppingBag className="w-4 h-4 text-[#D97A5B]" />
        <span className="text-[10px] tracking-tight">Basket</span>
        {totalCartItemCount > 0 && (
          <span className="absolute -top-1 right-1 min-w-[16px] h-4 px-1 bg-[#D97A5B] text-white text-[9px] font-black rounded-full flex items-center justify-center">
            {totalCartItemCount}
          </span>
        )}
      </button>

      <button
        onClick={() => (isLoggedIn ? onOpenProfile() : onOpenAuth())}
        className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[#6B5145] font-semibold cursor-pointer"
        type="button"
        aria-label={isLoggedIn ? 'Account Profile' : 'Sign in'}
      >
        <UserIcon className="w-4 h-4" />
        <span className="text-[10px] tracking-tight">{isLoggedIn ? 'Account' : 'Login'}</span>
      </button>
    </nav>
  );
}
