'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { totalCartItemCount, cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.variant.price * item.quantity, 0);

  return (
    <>
      <Header onOpenCart={() => setIsCartOpen(true)} onOpenAuth={() => setIsAuthOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Floating Bottom Cart Bar (Zepto Style) */}
      {totalCartItemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:w-96 z-40 animate-in slide-in-from-bottom-5 duration-200">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#D97A5B] hover:bg-[#c2694d] text-white p-3.5 sm:p-4 rounded-2xl shadow-xl flex items-center justify-between transition-all group"
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

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenAuth={() => {
          setIsCartOpen(false);
          setIsAuthOpen(true);
        }}
      />

      {/* Phone OTP Login Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
