'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Clock,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Plus,
  Repeat,
  Sparkles,
  Edit2,
  Check,
  X,
  Building,
  Home,
  Briefcase,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function UserProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user, logout, showToast, login } = useCart();

  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbAddresses, setDbAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Profile Details Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // New Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newRecipient, setNewRecipient] = useState('');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newLocality, setNewLocality] = useState('Jubilee Hills');
  const [newPostcode, setNewPostcode] = useState('500033');
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  useEffect(() => {
    // Check if session exists in localStorage before redirecting to avoid kicking out during refresh
    let sessionPhone = user.phone;
    try {
      const saved = localStorage.getItem('trug_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.phone) sessionPhone = parsed.phone;
      }
    } catch {}

    if (!isLoggedIn && !sessionPhone) {
      router.push('/login');
      return;
    }

    setNameInput(user.name || '');
    setEmailInput(user.email || '');
    setNewRecipient(user.name || '');

    setIsLoading(true);
    fetch(`/api/customer?phone=${encodeURIComponent(sessionPhone || '+919515803954')}`)
      .then((r) => r.json())
      .then((data) => {
        setIsLoading(false);
        if (data.success) {
          if (data.orders) setDbOrders(data.orders);
          if (data.profile?.addresses) setDbAddresses(data.profile.addresses);
          if (data.profile?.name && data.profile.name !== 'TRUG Resident') {
            setNameInput(data.profile.name);
          }
          if (data.profile?.email) {
            setEmailInput(data.profile.email);
          }
        }
      })
      .catch(() => setIsLoading(false));
  }, [isLoggedIn, user.phone, router]);

  const handleLogout = () => {
    logout();
    showToast('You have been logged out.');
    router.push('/');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      showToast('Name is required');
      return;
    }
    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          phone: user.phone,
          name: nameInput.trim(),
          email: emailInput.trim() || null,
        }),
      });
      const data = await res.json();
      setIsSavingProfile(false);
      if (data.success) {
        setIsEditingProfile(false);
        login(user.phone, { name: nameInput.trim(), email: emailInput.trim() || undefined });
        showToast('Profile updated successfully');
      } else {
        showToast(data.error || 'Failed to update profile');
      }
    } catch {
      setIsSavingProfile(false);
      showToast('Network error updating profile');
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLine.trim() || !newLocality.trim() || !newPostcode.trim()) {
      showToast('Please fill in complete address details');
      return;
    }
    setIsSavingAddress(true);
    try {
      const res = await fetch('/api/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_address',
          phone: user.phone,
          address: {
            label: newLabel,
            recipient: newRecipient.trim() || user.name || 'Resident',
            address_line: newAddressLine.trim(),
            locality: newLocality.trim(),
            postcode: newPostcode.trim(),
            is_default: dbAddresses.length === 0,
          },
        }),
      });
      const data = await res.json();
      setIsSavingAddress(false);
      if (data.success && data.address) {
        setDbAddresses((prev) => [data.address, ...prev]);
        setShowAddressModal(false);
        setNewAddressLine('');
        showToast('New delivery address saved');
      } else {
        showToast(data.error || 'Failed to save address');
      }
    } catch {
      setIsSavingAddress(false);
      showToast('Network error saving address');
    }
  };

  const hasSession = isLoggedIn || (typeof window !== 'undefined' && !!localStorage.getItem('trug_user_session'));
  if (!hasSession && !isLoading) return null;

  return (
    <div className="min-h-screen bg-[#FAF5F0] text-[#302B28] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F1E6DC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#D97A5B] text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
              {(nameInput || user.name || 'T').slice(0, 1).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#302B28]">
                  {nameInput || user.name || 'TRUG Resident'}
                </h1>
                <span className="inline-flex items-center gap-1 bg-[#F1E6DC] text-[#6B5145] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  <ShieldCheck className="w-3 h-3 text-[#D97A5B]" />
                  Verified Resident
                </span>
              </div>
              <p className="text-xs text-[#6B5145] font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#D97A5B]" />
                <span>{user.phone || '+91 93924 49721'}</span>
              </p>
              {emailInput && (
                <p className="text-xs text-[#6B5145] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#D97A5B]" />
                  <span>{emailInput}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/recurring"
              className="px-4 py-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] hover:bg-[#F1E6DC] text-xs font-bold text-[#6B5145] transition flex items-center gap-1.5"
            >
              <Repeat className="w-3.5 h-3.5 text-[#D97A5B]" />
              <span>Daily Subscriptions</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* CUSTOMER PROFILE DETAILS SECTION: Name -> Email -> Phone Number -> Saved Addresses */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#F1E6DC] pb-3">
            <div>
              <h2 className="text-lg font-black text-[#302B28]">Customer Profile & Identity</h2>
              <p className="text-xs text-[#6B5145]">
                Your personal details, contact authentication, and delivery destinations.
              </p>
            </div>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97A5B] bg-white border border-[#F1E6DC] px-3.5 py-1.5 rounded-xl hover:bg-[#FAF5F0] transition cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
            )}
          </div>

          {/* Profile Details Form or Summary Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F1E6DC] shadow-xs">
            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1. Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#6B5145]">
                      1. Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B5145]">
                        <User className="w-4 h-4 text-[#D97A5B]" />
                      </div>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="e.g. Udaykumar Reddy"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF5F0] border border-[#F1E6DC] rounded-xl text-xs font-semibold text-[#302B28] focus:outline-hidden focus:border-[#D97A5B]"
                        required
                      />
                    </div>
                  </div>

                  {/* 2. Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#6B5145]">
                      2. Contact Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B5145]">
                        <Mail className="w-4 h-4 text-[#D97A5B]" />
                      </div>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="e.g. resident@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF5F0] border border-[#F1E6DC] rounded-xl text-xs font-semibold text-[#302B28] focus:outline-hidden focus:border-[#D97A5B]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Phone Number (Read-only / Verified) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6B5145]">
                    3. Phone Number (Verified via WhatsApp OTP)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B5145]">
                        <Phone className="w-4 h-4 text-[#D97A5B]" />
                      </div>
                      <input
                        type="text"
                        value={user.phone || '+91 93924 49721'}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border border-[#F1E6DC] rounded-xl text-xs font-bold text-[#6B5145] cursor-not-allowed"
                      />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                      <Check className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-xl border border-[#F1E6DC] text-xs font-bold text-[#6B5145] hover:bg-[#FAF5F0] transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-5 py-2 rounded-xl bg-[#D97A5B] hover:bg-[#c4694d] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    {isSavingProfile ? 'Saving Changes...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Name */}
                <div className="p-4 rounded-2xl bg-[#FAF5F0]/60 border border-[#F1E6DC] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5145]">
                    1. Customer Name
                  </span>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#D97A5B]" />
                    <p className="font-extrabold text-sm text-[#302B28]">
                      {nameInput || user.name || 'TRUG Resident'}
                    </p>
                  </div>
                </div>

                {/* 2. Email */}
                <div className="p-4 rounded-2xl bg-[#FAF5F0]/60 border border-[#F1E6DC] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5145]">
                    2. Email Address
                  </span>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#D97A5B]" />
                    <p className="font-extrabold text-sm text-[#302B28] truncate">
                      {emailInput || 'Not specified (tap edit to add)'}
                    </p>
                  </div>
                </div>

                {/* 3. Phone Number */}
                <div className="p-4 rounded-2xl bg-[#FAF5F0]/60 border border-[#F1E6DC] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5145]">
                    3. Mobile Phone Number
                  </span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#D97A5B]" />
                      <p className="font-extrabold text-sm text-[#302B28]">
                        {user.phone || '+91 93924 49721'}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      OTP Verified
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. SAVED ADDRESSES SECTION */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#302B28]">4. Saved Delivery Addresses</h3>
                <p className="text-xs text-[#6B5145]">
                  Loaded directly from TRUG live database for this phone number.
                </p>
              </div>
              <button
                onClick={() => setShowAddressModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#D97A5B] hover:bg-[#c4694d] px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Address Cards Grid */}
            {dbAddresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dbAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-2xl bg-white border border-[#F1E6DC] shadow-xs relative space-y-2 hover:border-[#D97A5B]/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-[#FAF5F0] rounded-lg text-[#D97A5B]">
                          {addr.label === 'Work' ? (
                            <Briefcase className="w-3.5 h-3.5" />
                          ) : (
                            <Home className="w-3.5 h-3.5" />
                          )}
                        </span>
                        <span className="font-black text-sm text-[#302B28]">{addr.label || 'Home'}</span>
                      </div>
                      {addr.is_default && (
                        <span className="text-[10px] font-bold text-[#D97A5B] bg-[#FAF5F0] border border-[#F1E6DC] px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#6B5145] space-y-0.5">
                      <p className="font-bold text-[#302B28]">{addr.recipient || user.name}</p>
                      <p>{addr.address_line}</p>
                      <p>
                        {addr.locality}, {addr.postcode}
                      </p>
                      <p className="text-[11px] text-[#6B5145]/80 pt-1">Phone: {addr.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4 bg-white rounded-3xl border border-[#F1E6DC]">
                <MapPin className="w-8 h-8 text-[#6B5145]/40 mx-auto mb-2" />
                <p className="font-bold text-sm text-[#302B28]">No saved addresses yet</p>
                <p className="text-xs text-[#6B5145] mt-1 mb-4">
                  Add your home or work address for one-click checkout.
                </p>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97A5B] bg-[#FAF5F0] hover:bg-[#F1E6DC] px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Address</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 5. Past Order History */}
        <div className="space-y-4 pt-6 border-t border-[#F1E6DC]">
          <div>
            <h3 className="text-base font-black text-[#302B28]">Past Order History</h3>
            <p className="text-xs text-[#6B5145]">
              Real-time orders linked to your phone number in `trug.orders`.
            </p>
          </div>

          {dbOrders.length > 0 ? (
            <div className="space-y-3">
              {dbOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#F1E6DC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#302B28]">
                        Order #{order.order_number || order.id.slice(0, 8)}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        {order.status || 'Delivered'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B5145]">
                      From <span className="font-bold text-[#302B28]">{order.store_name}</span> •{' '}
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    {order.address_line && (
                      <p className="text-[11px] text-[#6B5145]/80">
                        Delivered to: {order.address_line}, {order.postcode}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-base font-black text-[#302B28]">
                      ₹{((order.total_paise || 0) / 100).toFixed(0)}
                    </span>
                    <Link
                      href={`/shops`}
                      className="px-3.5 py-1.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] hover:bg-[#F1E6DC] text-xs font-bold text-[#6B5145] transition"
                    >
                      Reorder
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4 bg-white rounded-3xl border border-[#F1E6DC]">
              <Package className="w-8 h-8 text-[#6B5145]/40 mx-auto mb-2" />
              <p className="font-bold text-sm text-[#302B28]">No orders found for this number</p>
              <p className="text-xs text-[#6B5145] mt-1 mb-4">
                Explore neighbourhood stores to place your first quick order.
              </p>
              <Link
                href="/shops"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#D97A5B] hover:bg-[#c4694d] px-5 py-2.5 rounded-xl transition shadow-xs"
              >
                <span>Browse Local Shops</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#F1E6DC] shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowAddressModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#FAF5F0] text-[#6B5145] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-[#302B28]">Add Delivery Address</h3>
              <p className="text-xs text-[#6B5145]">Saves to your live TRUG customer profile.</p>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="flex gap-2">
                {['Home', 'Work', 'Other'].map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setNewLabel(lbl)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      newLabel === lbl
                        ? 'bg-[#D97A5B] text-white border-[#D97A5B]'
                        : 'bg-[#FAF5F0] text-[#6B5145] border-[#F1E6DC]'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B5145]">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  placeholder="e.g. Udaykumar"
                  className="w-full px-3.5 py-2.5 bg-[#FAF5F0] border border-[#F1E6DC] rounded-xl text-xs font-semibold text-[#302B28] focus:outline-hidden focus:border-[#D97A5B]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B5145]">
                  House / Flat / Building / Street *
                </label>
                <input
                  type="text"
                  value={newAddressLine}
                  onChange={(e) => setNewAddressLine(e.target.value)}
                  placeholder="e.g. Flat 402, Sri Valle Enclave, Road 36"
                  className="w-full px-3.5 py-2.5 bg-[#FAF5F0] border border-[#F1E6DC] rounded-xl text-xs font-semibold text-[#302B28] focus:outline-hidden focus:border-[#D97A5B]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B5145]">
                    Locality *
                  </label>
                  <input
                    type="text"
                    value={newLocality}
                    onChange={(e) => setNewLocality(e.target.value)}
                    placeholder="e.g. Jubilee Hills"
                    className="w-full px-3.5 py-2.5 bg-[#FAF5F0] border border-[#F1E6DC] rounded-xl text-xs font-semibold text-[#302B28] focus:outline-hidden focus:border-[#D97A5B]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B5145]">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    value={newPostcode}
                    onChange={(e) => setNewPostcode(e.target.value)}
                    placeholder="500033"
                    className="w-full px-3.5 py-2.5 bg-[#FAF5F0] border border-[#F1E6DC] rounded-xl text-xs font-semibold text-[#302B28] focus:outline-hidden focus:border-[#D97A5B]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingAddress}
                className="w-full py-3 bg-[#D97A5B] hover:bg-[#c4694d] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
              >
                {isSavingAddress ? 'Saving Address...' : 'Save & Select Address'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
