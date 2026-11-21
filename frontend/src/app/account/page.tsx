'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useCart } from '@/context/CartContext';
import {
  User,
  ShoppingBag,
  MapPin,
  Bell,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle,
  LogOut,
  RotateCcw,
  ExternalLink,
  Phone,
  Mail,
  Shield,
} from 'lucide-react';

function AccountContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';

  const {
    user,
    orders,
    isLoggedIn,
    login,
    logout,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    showToast,
  } = useCart();

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Address form modal state
  const [showAddAddressModal, setShowAddAddressModal] = useState<boolean>(false);
  const [newAddrTag, setNewAddrTag] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newAddrName, setNewAddrName] = useState<string>(user.name);
  const [newAddrPhone, setNewAddrPhone] = useState<string>(user.phone);
  const [newAddrLine, setNewAddrLine] = useState<string>('');
  const [newAddrLocality, setNewAddrLocality] = useState<string>('Green Glen Layout, Bellandur');
  const [newAddrLandmark, setNewAddrLandmark] = useState<string>('');

  // Login form state
  const [authIdentifier, setAuthIdentifier] = useState<string>('');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLine.trim()) return;

    addAddress({
      id: `addr-${Date.now()}`,
      tag: newAddrTag,
      name: newAddrName,
      phone: newAddrPhone,
      addressLine: newAddrLine,
      locality: newAddrLocality,
      landmark: newAddrLandmark,
      isDefault: false,
    });

    setShowAddAddressModal(false);
    setNewAddrLine('');
    setNewAddrLandmark('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authIdentifier.trim()) {
      login(authIdentifier.trim());
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / User Brief */}
      <div className="bg-white rounded-3xl border border-[#F1E6DC] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF5F0] border-2 border-[#D97A5B] flex items-center justify-center text-[#D97A5B] text-xl font-black">
            {user.name.charAt(0)}
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-serif font-black text-[#302B28]">
              {user.name}
            </h1>
            <p className="text-xs text-[#6B5145]">
              {user.phone} • {user.email}
            </p>
            <span className="inline-block text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
              TRUG Verified Resident
            </span>
          </div>
        </div>

        <div>
          {isLoggedIn ? (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B5145] hover:text-red-600 border border-[#F1E6DC] hover:border-red-200 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => login('+91 98765 43210')}
              className="px-5 py-2.5 rounded-full bg-[#D97A5B] hover:bg-[#c2694d] text-white text-xs font-bold transition shadow-xs"
            >
              Sign In to Account
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#F1E6DC] scrollbar-none">
        {[
          { id: 'orders', label: 'My Orders', icon: ShoppingBag, count: orders.length },
          { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: user.addresses.length },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'support', label: 'Support & Helpdesk', icon: HelpCircle },
          { id: 'profile', label: 'Profile Details', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                isActive
                  ? 'bg-[#302B28] text-white shadow-xs'
                  : 'bg-white text-[#6B5145] hover:bg-[#F1E6DC] border border-[#F1E6DC]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#FAF5F0] text-[#6B5145]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-[#302B28]">Order History</h2>
            <span className="text-xs text-[#6B5145]">Track live delivery or reorder instantly</span>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl border border-[#F1E6DC] p-5 sm:p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F1E6DC]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#302B28]">{ord.orderNumber}</span>
                        <span className="text-xs text-[#6B5145]">• {ord.vendorName}</span>
                      </div>
                      <span className="text-[11px] text-[#6B5145]">
                        {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {ord.status}
                      </span>
                      <span className="font-black text-sm text-[#302B28]">₹{ord.total}</span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-[#6B5145] space-y-1">
                    {ord.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{i.quantity}x {i.productName} ({i.variantName})</span>
                        <span className="font-semibold text-[#302B28]">₹{i.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#F1E6DC]/60">
                    <span className="text-[11px] text-[#6B5145]">
                      Delivery: {ord.deliveryAddress.tag} • {ord.deliverySlot}
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/order/${ord.id}`}
                        className="px-4 py-2 rounded-xl bg-[#D97A5B] hover:bg-[#c2694d] text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                      >
                        <span>Live Tracking</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#F1E6DC] p-12 text-center space-y-3">
              <p className="text-sm font-semibold text-[#302B28]">No past orders found.</p>
              <Link href="/shops" className="text-xs font-bold text-[#D97A5B] underline">
                Browse Neighbourhood Stores
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-[#302B28]">Saved Delivery Locations</h2>
            <button
              onClick={() => setShowAddAddressModal(true)}
              className="px-4 py-2 rounded-full bg-[#D97A5B] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white p-5 rounded-3xl border border-[#F1E6DC] space-y-3 relative shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5F0] text-[#302B28] text-xs font-bold border border-[#F1E6DC]">
                      {addr.tag}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[11px] text-[#D97A5B] font-bold hover:underline"
                      >
                        Set Default
                      </button>
                    )}
                    {user.addresses.length > 1 && (
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-[#6B5145] hover:text-red-600 p-1"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-[#6B5145] space-y-1">
                  <p className="font-bold text-[#302B28]">{addr.name} • {addr.phone}</p>
                  <p className="leading-relaxed">{addr.addressLine}</p>
                  <p>{addr.locality}</p>
                  {addr.landmark && <p className="text-[11px] text-[#6B5145]/70">Landmark: {addr.landmark}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl border border-[#F1E6DC] p-6 space-y-6">
          <h2 className="text-lg font-serif font-bold text-[#302B28]">Notification Preferences</h2>
          <p className="text-xs text-[#6B5145]">
            Choose how you would like to receive order dispatch alerts and morning subscription reminders.
          </p>

          <div className="space-y-4 max-w-lg divide-y divide-[#F1E6DC]/60 text-xs text-[#302B28]">
            <label className="pt-3 first:pt-0 flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-bold block">SMS Delivery Alerts</span>
                <span className="text-[11px] text-[#6B5145]">Real-time OTP & rider arrival alerts via SMS</span>
              </div>
              <input
                type="checkbox"
                checked={user.notificationPreferences.orderUpdatesSms}
                onChange={(e) =>
                  updateProfile({
                    notificationPreferences: {
                      ...user.notificationPreferences,
                      orderUpdatesSms: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 accent-[#D97A5B]"
              />
            </label>

            <label className="pt-3 flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-bold block">WhatsApp Dispatch Updates</span>
                <span className="text-[11px] text-[#6B5145]">Receive invoice and live map tracking link</span>
              </div>
              <input
                type="checkbox"
                checked={user.notificationPreferences.orderUpdatesWhatsapp}
                onChange={(e) =>
                  updateProfile({
                    notificationPreferences: {
                      ...user.notificationPreferences,
                      orderUpdatesWhatsapp: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 accent-[#D97A5B]"
              />
            </label>

            <label className="pt-3 flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-bold block">Daily Milk & Harvest Reminders</span>
                <span className="text-[11px] text-[#6B5145]">Evening 9 PM reminder to modify tomorrow's milk delivery</span>
              </div>
              <input
                type="checkbox"
                checked={user.notificationPreferences.recurringOrderReminders}
                onChange={(e) =>
                  updateProfile({
                    notificationPreferences: {
                      ...user.notificationPreferences,
                      recurringOrderReminders: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 accent-[#D97A5B]"
              />
            </label>
          </div>
        </div>
      )}

      {/* Tab 4: Support */}
      {activeTab === 'support' && (
        <div className="bg-white rounded-3xl border border-[#F1E6DC] p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-serif font-bold text-[#302B28]">Neighbourhood Commerce Support</h2>
            <p className="text-xs text-[#6B5145]">
              Direct assistance for doorstep deliveries, freshness guarantees and store settlements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#FAF5F0] p-5 rounded-2xl border border-[#F1E6DC] space-y-2">
              <Phone className="w-5 h-5 text-[#D97A5B]" />
              <h4 className="font-bold text-xs text-[#302B28]">Direct Store Helpline</h4>
              <p className="text-xs text-[#6B5145]">
                Speak to our Bellandur neighbourhood operations coordinator:
              </p>
              <p className="font-bold text-sm text-[#302B28]">+91 80 4719 2830</p>
            </div>

            <div className="bg-[#FAF5F0] p-5 rounded-2xl border border-[#F1E6DC] space-y-2">
              <Mail className="w-5 h-5 text-[#D97A5B]" />
              <h4 className="font-bold text-xs text-[#302B28]">Email Support</h4>
              <p className="text-xs text-[#6B5145]">
                Send queries or feedback to the Focsera team:
              </p>
              <p className="font-bold text-sm text-[#302B28]">support@trug.focsera.com</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Profile & Mock Auth */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-[#F1E6DC] p-6 space-y-6 max-w-xl">
          <h2 className="text-lg font-serif font-bold text-[#302B28]">Customer Profile & Authentication</h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[#6B5145] font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-medium"
              />
            </div>

            <div>
              <label className="block text-[#6B5145] font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={user.phone}
                onChange={(e) => updateProfile({ phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-medium"
              />
            </div>

            <div>
              <label className="block text-[#6B5145] font-semibold mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => updateProfile({ email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <form
            onSubmit={handleSaveAddress}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#F1E6DC] shadow-2xl space-y-4"
          >
            <h3 className="font-serif font-bold text-lg text-[#302B28]">
              Add New Delivery Address
            </h3>

            {/* Tag Selection */}
            <div className="flex items-center gap-2">
              {(['Home', 'Work', 'Other'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewAddrTag(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    newAddrTag === t
                      ? 'bg-[#302B28] text-white'
                      : 'bg-[#FAF5F0] text-[#6B5145] border border-[#F1E6DC]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B5145] font-semibold mb-1">Flat / House / Apartment Address</label>
                <textarea
                  required
                  rows={2}
                  value={newAddrLine}
                  onChange={(e) => setNewAddrLine(e.target.value)}
                  placeholder="e.g. Flat 304, Palm Heights, 12th Cross"
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>

              <div>
                <label className="block text-[#6B5145] font-semibold mb-1">Locality</label>
                <input
                  type="text"
                  value={newAddrLocality}
                  onChange={(e) => setNewAddrLocality(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>

              <div>
                <label className="block text-[#6B5145] font-semibold mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  value={newAddrLandmark}
                  onChange={(e) => setNewAddrLandmark(e.target.value)}
                  placeholder="e.g. Behind Nilgiris Supermarket"
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddAddressModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B5145]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#D97A5B] hover:bg-[#c2694d] text-white text-xs font-bold shadow-xs"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-12 text-center text-xs text-[#6B5145]">Loading customer account...</div>}>
      <AccountContent />
    </Suspense>
  );
}

