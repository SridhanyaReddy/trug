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
  Navigation,
  Crosshair,
  Check,
  Compass,
} from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import RealMapLocationPicker from '@/components/RealMapLocationPicker';

interface HeaderProps {
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
}

export default function Header({ onOpenCart, onOpenAuth, onOpenProfile }: HeaderProps) {
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
  const [showRealMapPicker, setShowRealMapPicker] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [manualLocationQuery, setManualLocationQuery] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const handleDetectGpsLocation = () => {
    setIsDetectingLocation(true);
    setLocationStatus('Detecting your location...');

    const fallbackToIpLocation = async (reason?: string) => {
      try {
        setLocationStatus('Device GPS restricted. Detecting city via network...');
        const res = await fetch('/api/geo/ip');
        if (res.ok) {
          const data = await res.json();
          if (data && data.locality) {
            setLocality(data.locality);
            setIsDetectingLocation(false);
            setLocationStatus(`Location detected: ${data.locality}`);
            setTimeout(() => {
              setShowLocationModal(false);
              setLocationStatus(null);
            }, 1200);
            return;
          }
        }
      } catch {}
      setIsDetectingLocation(false);
      setLocationStatus(reason || 'Could not auto-detect. Please choose below or on the map.');
    };

    if (!navigator.geolocation) {
      fallbackToIpLocation('Geolocation not supported by browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `/api/geo/geocode?action=reverse&lat=${latitude}&lon=${longitude}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.locality) {
              setLocality(data.locality);
              setIsDetectingLocation(false);
              setLocationStatus(`Detected: ${data.locality}`);
              setTimeout(() => {
                setShowLocationModal(false);
                setLocationStatus(null);
              }, 800);
              return;
            }
          }
        } catch {
          // fallback if reverse lookup fails
        }
        setLocality('Jubilee Hills, Hyderabad');
        setIsDetectingLocation(false);
        setShowLocationModal(false);
      },
      () => {
        // When device/browser permission is blocked or denied, seamlessly fallback to IP geolocation
        fallbackToIpLocation('GPS permission denied. Found your city via network.');
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  };

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
          <span>Hyperlocal direct-from-neighbourhood shops. <strong>₹0 Delivery Fee on every order</strong>.</span>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Locality */}
          <div className="flex items-center gap-2 sm:gap-6">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
              <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-xs border border-[#F1E6DC] bg-[#FAF5F0] shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/logo.png"
                  alt="TRUG by Focsera"
                  fill
                  sizes="(max-width: 640px) 36px, 48px"
                  priority
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#302B28] flex items-center leading-none">
                  <span className="text-[#D97A5B]">trug</span>
                  <span className="text-[#302B28]">.</span>
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-wider lowercase font-semibold text-[#6B5145] leading-tight mt-0.5">
                  by focsera
                </span>
              </div>
            </Link>

            {/* Zepto-Style Location Selector Pill */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-1.5 sm:gap-2 bg-[#F1E6DC]/90 hover:bg-[#F1E6DC] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-[#302B28] transition border border-[#6B5145]/15 max-w-[170px] sm:max-w-[260px] shadow-2xs cursor-pointer"
              title="Change Delivery Locality"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#D97A5B] text-white flex items-center justify-center shrink-0">
                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </div>
              <div className="flex flex-col text-left truncate">
                <span className="text-[8px] sm:text-[10px] font-black text-[#D97A5B] uppercase tracking-wider leading-none">
                  Delivering to
                </span>
                <span className="truncate text-[11px] sm:text-xs font-bold leading-tight mt-0.5">{currentLocality}</span>
              </div>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6B5145] shrink-0" />
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

            {/* Zepto-Style Login / Account Button */}
            {isLoggedIn ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 bg-[#F1E6DC]/90 hover:bg-[#F1E6DC] px-3.5 py-2 rounded-full border border-[#6B5145]/15 text-xs font-bold text-[#302B28] transition shadow-2xs cursor-pointer"
                title="Account & Addresses"
              >
                <div className="w-5 h-5 rounded-full bg-[#D97A5B] text-white flex items-center justify-center text-[10px] font-black">
                  {(user.name || 'T').slice(0, 1).toUpperCase()}
                </div>
                <span>Profile</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold tracking-wide border border-[#D97A5B] text-[#D97A5B] hover:bg-[#D97A5B] hover:text-white transition shadow-2xs cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#FAF5F0] border border-[#F1E6DC] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1E6DC]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D97A5B]" />
                <h3 className="font-black text-lg text-[#302B28]">Select Delivery Location</h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-1 text-[#6B5145] hover:text-[#302B28] rounded-full hover:bg-[#F1E6DC] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Real Map Location Picker Trigger */}
            <button
              onClick={() => {
                setShowLocationModal(false);
                setShowRealMapPicker(true);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-[#302B28] hover:bg-black text-white text-xs font-bold transition flex items-center justify-between shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-[#D97A5B]" />
                <span>Select on Live Real Map</span>
              </div>
              <span className="text-[10px] bg-[#D97A5B] text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                Real Map
              </span>
            </button>

            {/* GPS Auto-Detect Button (Zepto style) */}
            <button
              onClick={handleDetectGpsLocation}
              disabled={isDetectingLocation}
              className="w-full py-3 px-4 rounded-2xl bg-[#D97A5B] hover:bg-[#c4694d] text-white text-xs font-bold transition flex items-center justify-between shadow-sm cursor-pointer disabled:opacity-60"
            >
              <div className="flex items-center gap-2.5">
                <Crosshair className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                <span>{isDetectingLocation ? 'Detecting current GPS location...' : 'Use Current Location'}</span>
              </div>
              <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                GPS Detect
              </span>
            </button>

            {locationStatus && (
              <p className="text-[11px] text-[#D97A5B] font-semibold text-center bg-white py-1.5 px-3 rounded-xl border border-[#F1E6DC]">
                {locationStatus}
              </p>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#F1E6DC]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-[#FAF5F0] px-2 text-[#6B5145]">Or Search Manually</span>
              </div>
            </div>

            {/* Manual Location Search Bar with Form Submission & Live Auto-Suggestions */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (manualLocationQuery.trim()) {
                  setLocality(manualLocationQuery.trim());
                  try {
                    localStorage.setItem(
                      'trug_user_geo',
                      JSON.stringify({
                        locality: manualLocationQuery.trim(),
                        address: manualLocationQuery.trim(),
                        lat: 17.4319,
                        lng: 78.4073,
                      })
                    );
                  } catch {}
                  setManualLocationQuery('');
                  setShowLocationModal(false);
                }
              }}
              className="relative"
            >
              <Search className="w-4 h-4 text-[#6B5145] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={manualLocationQuery}
                onChange={(e) => setManualLocationQuery(e.target.value)}
                placeholder="Type your area, building, street, or city (Press Enter)..."
                className="w-full pl-9 pr-24 py-3 bg-white text-xs font-semibold text-[#302B28] placeholder-[#6B5145]/70 rounded-2xl border border-[#F1E6DC] focus:outline-hidden focus:border-[#D97A5B] shadow-2xs"
                autoFocus
              />
              <button
                type="submit"
                disabled={!manualLocationQuery.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-[#D97A5B] hover:bg-[#c2694d] text-white text-[11px] font-extrabold rounded-xl transition cursor-pointer disabled:opacity-40 shadow-xs"
              >
                Set Location
              </button>
            </form>

            {/* Popular Localities List */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#6B5145] block pb-1">
                Popular Neighbourhoods
              </span>
              {availableLocalities
                .filter((loc) =>
                  loc.toLowerCase().includes(manualLocationQuery.toLowerCase())
                )
                .map((locality) => {
                  const isSelected = locality === currentLocality;
                  return (
                    <button
                      key={locality}
                      onClick={() => {
                        setLocality(locality);
                        setShowLocationModal(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#302B28] text-white shadow-xs'
                          : 'bg-white hover:bg-[#F1E6DC] text-[#302B28] border border-[#F1E6DC]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#D97A5B]" />
                        <span>{locality}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#D97A5B]" />}
                    </button>
                  );
                })}
            </div>

            <div className="pt-2 text-[11px] text-[#6B5145] font-medium flex items-center gap-1.5 border-t border-[#F1E6DC]">
              <Sparkles className="w-3.5 h-3.5 text-[#D97A5B]" />
              <span>Free delivery direct from local neighbourhood merchants.</span>
            </div>
          </div>
        </div>
      )}

      {/* Real Map Location Picker Modal */}
      <RealMapLocationPicker
        isOpen={showRealMapPicker}
        onClose={() => setShowRealMapPicker(false)}
        initialLocality={currentLocality}
        onSelectLocation={(loc) => {
          setLocality(loc.locality);
          try {
            localStorage.setItem(
              'trug_user_geo',
              JSON.stringify({
                locality: loc.locality,
                address: loc.address,
                lat: loc.lat,
                lng: loc.lng,
              })
            );
          } catch {}
        }}
      />
    </>
  );
}
