'use client';

import React, { useState, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal';
import ProfileDrawer from '@/components/ProfileDrawer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useCart } from '@/context/CartContext';
import { ArrowRight } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { totalCartItemCount, cartItems, isLoggedIn } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.variant.price * item.quantity, 0);

  return (
    <>
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />

      {/* Floating Bottom Cart Bar (Zepto Style) - positioned above mobile nav */}
      {totalCartItemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-18 md:bottom-6 inset-x-3 sm:inset-x-auto sm:right-6 sm:w-96 z-40 animate-in slide-in-from-bottom-5 duration-200">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#D97A5B] hover:bg-[#c2694d] text-white p-3.5 sm:p-4 rounded-2xl shadow-xl flex items-center justify-between transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
                {totalCartItemCount}
              </div>
              <div className="text-left">
                <span className="text-sm font-black block leading-tight">₹{totalAmount}</span>
                <span className="text-[10px] text-white/80 uppercase font-bold tracking-wider">
                  {totalCartItemCount === 1 ? '1 item' : `${totalCartItemCount} items`} • View Cart
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-black/20 px-3 py-1.5 rounded-xl group-hover:translate-x-0.5 transition-transform">
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Zepto-Style Bottom Mobile Navigation Bar (Fixed for phones & small screens) */}
      <Suspense fallback={<nav className="md:hidden fixed bottom-0 inset-x-0 h-14 bg-white/95 border-t border-[#F1E6DC] z-30" />}>
        <MobileBottomNav
          totalCartItemCount={totalCartItemCount}
          isLoggedIn={isLoggedIn}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      </Suspense>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenAuth={() => {
          setIsCartOpen(false);
          setIsAuthOpen(true);
        }}
      />

      {/* Slide-over Profile Drawer (Zepto Style) */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenAuth={() => {
          setIsProfileOpen(false);
          setIsAuthOpen(true);
        }}
      />

      {/* Phone OTP Login Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
