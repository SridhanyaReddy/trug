'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Search,
  ShoppingBag,
  User as UserIcon,
  ChevronDown,
  Clock,
  Sparkles,
  Menu,
  X,
  Repeat,
} from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
}

export default function Header({ onOpenCart, onOpenAuth }: HeaderProps) {
  const router = useRouter();
  const {
    currentLocality,
    setLocality,
    availableLocalities,
    totalCartItemCount,
    isLoggedIn,
    user,
  } = useCart();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shops?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF5F0]/95 backdrop-blur-md border-b border-[#F1E6DC] transition-all">
        {/* Top Mini Bar: Neighbourhood assurance banner */}
        <div className="bg-[#6B5145] text-[#FAF5F0] text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D97A5B]" />
          <span>Hyperlocal direct-from-neighbourhood shops. Deliveries within 15-30 minutes.</span>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Locality */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-xs border border-[#F1E6DC] bg-[#FAF5F0] shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/logo.png"
                  alt="TRUG by Focsera"
                  fill
                  sizes="48px"
                  priority
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-[#302B28] flex items-center leading-none">
                  <span className="text-[#D97A5B]">trug</span>
                  <span className="text-[#302B28]">.</span>
                </span>
                <span className="text-[10px] tracking-wider lowercase font-semibold text-[#6B5145] leading-tight mt-0.5">
                  by focsera
                </span>
              </div>
            </Link>

            {/* Location selector button */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="hidden md:flex items-center gap-2 bg-[#F1E6DC]/80 hover:bg-[#F1E6DC] px-4 py-2 rounded-full text-xs font-semibold text-[#302B28] transition border border-[#6B5145]/10 max-w-[250px]"
              title="Change Delivery Locality"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D97A5B] shrink-0" />
              <span className="truncate">{currentLocality}</span>
              <ChevronDown className="w-3 h-3 text-[#6B5145] shrink-0" />
            </button>
          </div>

          {/* Quick Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex flex-1 max-w-md mx-4 relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farm fresh milk, tomatoes, sourdough, local stores..."
              className="w-full pl-10 pr-4 py-2.5 bg-white text-xs font-medium text-[#302B28] placeholder-[#6B5145]/70 rounded-full border border-[#F1E6DC] focus:outline-none focus:border-[#D97A5B] focus:ring-1 focus:ring-[#D97A5B] transition shadow-xs"
            />
            <Search className="w-4 h-4 text-[#6B5145] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Nav Links & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/shops"
              className="hidden sm:inline-flex text-xs font-bold uppercase tracking-wider text-[#6B5145] hover:text-[#D97A5B] px-2 py-1 transition"
            >
              Explore Shops
            </Link>

            <Link
              href="/recurring"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B5145] hover:text-[#D97A5B] px-2 py-1 transition"
            >
              <Repeat className="w-3.5 h-3.5 text-[#D97A5B]" />
              Daily Subscriptions
            </Link>

            {/* Zepto-Style Cart CTA Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-[#D97A5B] hover:bg-[#c2694d] text-white px-4 py-2.5 rounded-full font-bold text-xs tracking-wide shadow-xs transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">My Basket</span>
              {totalCartItemCount > 0 && (
                <span className="bg-[#302B28] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalCartItemCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#302B28] hover:text-[#D97A5B]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Sub-bar */}
        <div className="md:hidden px-4 pb-3 flex flex-col gap-2">
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center justify-between bg-[#F1E6DC]/80 px-3.5 py-2 rounded-xl text-xs font-medium text-[#302B28]"
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#D97A5B] shrink-0" />
              <span className="truncate">{currentLocality}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-[#6B5145] shrink-0" />
          </button>

          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search local shops or products..."
              className="w-full pl-9 pr-4 py-2 bg-white text-xs text-[#302B28] rounded-xl border border-[#F1E6DC] focus:outline-none focus:border-[#D97A5B]"
            />
            <Search className="w-3.5 h-3.5 text-[#6B5145] absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF5F0] border-t border-[#F1E6DC] px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-[#302B28] hover:text-[#D97A5B]"
            >
              Home
            </Link>
            <Link
              href="/shops"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-[#302B28] hover:text-[#D97A5B]"
            >
              Browse Nearby Shops
            </Link>
            <Link
              href="/categories/milk-and-dairy"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-[#302B28] hover:text-[#D97A5B]"
            >
              Categories & Daily Essentials
            </Link>
            <Link
              href="/recurring"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-[#302B28] hover:text-[#D97A5B]"
            >
              Recurring Daily Subscriptions
            </Link>
          </div>
        )}
      </header>

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#FAF5F0] border border-[#F1E6DC] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1E6DC]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D97A5B]" />
                <h3 className="font-bold text-lg text-[#302B28]">Choose Your Neighbourhood</h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-1 text-[#6B5145] hover:text-[#302B28]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6B5145] leading-relaxed font-normal">
              TRUG connects you directly to independent mom-and-pop stores, dairy farms, and artisanal bakeries in your immediate radius.
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {availableLocalities.map((locality) => {
                const isSelected = locality === currentLocality;
                return (
                  <button
                    key={locality}
                    onClick={() => {
                      setLocality(locality);
                      setShowLocationModal(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-[#D97A5B] text-white shadow-sm'
                        : 'bg-white hover:bg-[#F1E6DC] text-[#302B28] border border-[#F1E6DC]'
                    }`}
                  >
                    <span>{locality}</span>
                    {isSelected && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Current</span>}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-[#6B5145] font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D97A5B]" />
              <span>Standard delivery radius: 2.5 km for 15-30 min arrival.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
