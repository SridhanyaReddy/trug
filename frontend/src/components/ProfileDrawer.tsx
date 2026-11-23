'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Plus,
  Repeat,
  ShieldCheck,
  LogOut,
  Edit2,
  Check,
  ChevronRight,
  Home,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

export default function ProfileDrawer({ isOpen, onClose, onOpenAuth }: ProfileDrawerProps) {
  const { isLoggedIn, user, logout, showToast, login } = useCart();

  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbAddresses, setDbAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [nameVal, setNameVal] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Address Add State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrRecipient, setAddrRecipient] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrLocality, setAddrLocality] = useState('Jubilee Hills');
  const [addrPostcode, setAddrPostcode] = useState('500033');
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  useEffect(() => {
    if (isOpen && isLoggedIn && user.phone) {
      setNameVal(user.name || '');
      setEmailVal(user.email || '');
      setAddrRecipient(user.name || '');

      setIsLoading(true);
      fetch(`/api/customer?phone=${encodeURIComponent(user.phone)}`)
        .then((r) => r.json())
        .then((data) => {
          setIsLoading(false);
          if (data.success) {
            if (data.orders) setDbOrders(data.orders);
            if (data.profile?.addresses) setDbAddresses(data.profile.addresses);
            if (data.profile?.name && data.profile.name !== 'TRUG Resident') {
              setNameVal(data.profile.name);
            }
            if (data.profile?.email) {
              setEmailVal(data.profile.email);
            }
          }
        })
        .catch(() => setIsLoading(false));
    }
  }, [isOpen, isLoggedIn, user.phone]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVal.trim()) {
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
          name: nameVal.trim(),
          email: emailVal.trim() || null,
        }),
      });
      const data = await res.json();
      setIsSavingProfile(false);
      if (data.success) {
        setIsEditing(false);
        login(user.phone, { name: nameVal.trim(), email: emailVal.trim() || undefined });
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
    if (!addrLine.trim() || !addrLocality.trim() || !addrPostcode.trim()) {
      showToast('Please fill in complete address');
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
            label: addrLabel,
            recipient: addrRecipient.trim() || user.name || 'Resident',
            address_line: addrLine.trim(),
            locality: addrLocality.trim(),
            postcode: addrPostcode.trim(),
            is_default: dbAddresses.length === 0,
          },
        }),
      });
      const data = await res.json();
      setIsSavingAddress(false);
      if (data.success && data.address) {
        setDbAddresses((prev) => [data.address, ...prev]);
        setShowAddAddress(false);
        setAddrLine('');
        showToast('Address saved');
      } else {
        showToast(data.error || 'Failed to save address');
      }
    } catch {
      setIsSavingAddress(false);
      showToast('Network error saving address');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF5F0] border-l border-[#F1E6DC] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-[#302B28]">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#F1E6DC] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-[#302B28]">
                <span className="text-[#D97A5B]">trug</span> account
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#FAF5F0] text-[#6B5145] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {!isLoggedIn ? (
              <div className="text-center py-12 px-4 bg-white rounded-3xl border border-[#F1E6DC] space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF5F0] text-[#D97A5B] flex items-center justify-center mx-auto">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#302B28]">Login to your TRUG account</h3>
                  <p className="text-xs text-[#6B5145] mt-1">
                    Access saved addresses, past orders, and instant 15-minute checkout.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className="w-full py-3 bg-[#D97A5B] hover:bg-[#c4694d] text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
                >
                  Login with Mobile Number
                </button>
              </div>
            ) : (
              <>
                {/* 1. Header Profile Banner */}
                <div className="bg-white rounded-2xl p-4 border border-[#F1E6DC] shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#D97A5B] text-white flex items-center justify-center font-black text-lg shadow-xs shrink-0">
                      {(nameVal || user.name || 'T').slice(0, 1).toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm text-[#302B28] leading-tight">
                          {nameVal || user.name || 'TRUG Resident'}
                        </span>
                        <span className="text-[9px] font-bold bg-[#F1E6DC] text-[#6B5145] px-1.5 py-0.5 rounded-full uppercase">
                          Verified
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B5145] font-medium">{user.phone}</p>
                      {emailVal && <p className="text-[11px] text-[#6B5145] truncate">{emailVal}</p>}
                    </div>
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-[#D97A5B] hover:bg-[#FAF5F0] rounded-xl transition cursor-pointer"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* 2. Customer Profile Details (Name -> Email -> Phone) */}
                <div className="bg-white rounded-2xl p-4 border border-[#F1E6DC] shadow-xs space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#6B5145] block border-b border-[#F1E6DC] pb-2">
                    Profile Details
                  </span>

                  {isEditing ? (
                    <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-[#6B5145]">
                          1. Full Name *
                        </label>
                        <input
                          type="text"
                          value={nameVal}
                          onChange={(e) => setNameVal(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FAF5F0] border border-[#F1E6DC] rounded-xl text-xs font-semibold text-[#302B28] focus:outline-hidden focus:border-[#D97A5B]"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-[#6B5145]">
                          2. Contact Email
                        </label>
                        <input
                          type="email"
                          value={emailVal}
                          onChange={(e) => setEmailVal(e.target.value)}
                          placeholder="e.g. resident@withtrug.com"
                          className="w-full px-3 py-2 bg-[#FAF5F0] border border-[#F1E6DC] rounded-xl text-xs font-semibold text-[#302B28] focus:outline-hidden focus:border-[#D97A5B]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-[#6B5145]">
                          3. Phone Number (Verified)
                        </label>
                        <input
                          type="text"
                          value={user.phone}
                          disabled
                          className="w-full px-3 py-2 bg-neutral-100 border border-[#F1E6DC] rounded-xl text-xs font-bold text-[#6B5145] cursor-not-allowed"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-3 py-1.5 rounded-xl border border-[#F1E6DC] text-xs font-bold text-[#6B5145] hover:bg-[#FAF5F0]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingProfile}
                          className="px-4 py-1.5 rounded-xl bg-[#D97A5B] text-white text-xs font-bold hover:bg-[#c4694d]"
                        >
                          {isSavingProfile ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-[#FAF5F0]">
                        <span className="text-[#6B5145] font-medium">1. Name</span>
                        <span className="font-bold text-[#302B28]">{nameVal || user.name || 'TRUG Resident'}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-[#FAF5F0]">
                        <span className="text-[#6B5145] font-medium">2. Email</span>
                        <span className="font-bold text-[#302B28] truncate max-w-[200px]">
                          {emailVal || 'Not added'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-[#6B5145] font-medium">3. Phone Number</span>
                        <span className="font-bold text-[#302B28] flex items-center gap-1">
                          {user.phone}
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Saved Delivery Addresses */}
                <div className="bg-white rounded-2xl p-4 border border-[#F1E6DC] shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#F1E6DC] pb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#6B5145]">
                      4. Saved Addresses ({dbAddresses.length})
                    </span>
                    <button
                      onClick={() => setShowAddAddress(!showAddAddress)}
                      className="text-xs font-bold text-[#D97A5B] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showAddAddress ? 'Cancel' : 'Add'}</span>
                    </button>
                  </div>

                  {showAddAddress && (
                    <form onSubmit={handleSaveAddress} className="space-y-3 p-3 bg-[#FAF5F0] rounded-xl border border-[#F1E6DC]">
                      <div className="flex gap-2">
                        {['Home', 'Work', 'Other'].map((l) => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => setAddrLabel(l)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                              addrLabel === l
                                ? 'bg-[#D97A5B] text-white border-[#D97A5B]'
                                : 'bg-white text-[#6B5145] border-[#F1E6DC]'
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        value={addrRecipient}
                        onChange={(e) => setAddrRecipient(e.target.value)}
                        placeholder="Recipient Name"
                        className="w-full px-3 py-2 bg-white border border-[#F1E6DC] rounded-xl text-xs font-semibold"
                        required
                      />

                      <input
                        type="text"
                        value={addrLine}
                        onChange={(e) => setAddrLine(e.target.value)}
                        placeholder="House / Flat / Street address"
                        className="w-full px-3 py-2 bg-white border border-[#F1E6DC] rounded-xl text-xs font-semibold"
                        required
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={addrLocality}
                          onChange={(e) => setAddrLocality(e.target.value)}
                          placeholder="Locality"
                          className="w-full px-3 py-2 bg-white border border-[#F1E6DC] rounded-xl text-xs font-semibold"
                          required
                        />
                        <input
                          type="text"
                          value={addrPostcode}
                          onChange={(e) => setAddrPostcode(e.target.value)}
                          placeholder="Postcode"
                          className="w-full px-3 py-2 bg-white border border-[#F1E6DC] rounded-xl text-xs font-semibold"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingAddress}
                        className="w-full py-2 bg-[#D97A5B] text-white text-xs font-bold rounded-xl hover:bg-[#c4694d]"
                      >
                        {isSavingAddress ? 'Saving...' : 'Save Address'}
                      </button>
                    </form>
                  )}

                  {dbAddresses.length > 0 ? (
                    <div className="space-y-2.5">
                      {dbAddresses.map((a) => (
                        <div
                          key={a.id}
                          className="p-3 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0]/50 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[#302B28] flex items-center gap-1.5">
                              {a.label === 'Work' ? <Briefcase className="w-3 h-3 text-[#D97A5B]" /> : <Home className="w-3 h-3 text-[#D97A5B]" />}
                              {a.label || 'Home'}
                            </span>
                            {a.is_default && (
                              <span className="text-[9px] font-bold text-[#D97A5B] bg-white px-2 py-0.5 rounded-full border border-[#F1E6DC]">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[#6B5145]">{a.address_line}, {a.locality} - {a.postcode}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#6B5145] text-center py-2">No saved addresses yet.</p>
                  )}
                </div>

                {/* 4. Past Orders Quick Preview */}
                <div className="bg-white rounded-2xl p-4 border border-[#F1E6DC] shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#F1E6DC] pb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#6B5145]">
                      Past Orders ({dbOrders.length})
                    </span>
                    <Link
                      href="/profile"
                      onClick={onClose}
                      className="text-xs font-bold text-[#D97A5B] hover:underline"
                    >
                      View All
                    </Link>
                  </div>

                  {dbOrders.length > 0 ? (
                    <div className="space-y-2">
                      {dbOrders.slice(0, 3).map((o) => (
                        <div
                          key={o.id}
                          className="p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0]/50 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-[#302B28] block">Order #{o.order_number || o.id.slice(0, 6)}</span>
                            <span className="text-[11px] text-[#6B5145]">{o.store_name}</span>
                          </div>
                          <span className="font-black text-sm text-[#302B28]">₹{((o.total_paise || 0) / 100).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#6B5145] text-center py-2">No past orders yet.</p>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    logout();
                    onClose();
                    showToast('Logged out successfully');
                  }}
                  className="w-full py-3 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
