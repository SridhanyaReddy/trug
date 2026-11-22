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
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function UserProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user, logout, showToast } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbAddresses, setDbAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    fetch(`/api/customer?phone=${encodeURIComponent(user.phone || '+919392449721')}`)
      .then((r) => r.json())
      .then((data) => {
        setIsLoading(false);
        if (data.success) {
          if (data.orders) setDbOrders(data.orders);
          if (data.profile?.addresses) setDbAddresses(data.profile.addresses);
        }
      })
      .catch(() => setIsLoading(false));
  }, [isLoggedIn, user.phone, router]);

  const handleLogout = () => {
    logout();
    showToast('You have been logged out.');
    router.push('/');
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[#FAF5F0] text-[#302B28] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F1E6DC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#D97A5B] text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#302B28]">{user.name}</h1>
                <span className="inline-flex items-center gap-1 bg-[#F1E6DC] text-[#6B5145] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  <ShieldCheck className="w-3 h-3 text-[#D97A5B]" />
                  Verified Resident
                </span>
              </div>
              <p className="text-xs text-[#6B5145] flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-[#D97A5B]" />
                <span>{user.phone || '+91 93924 49721'}</span>
              </p>
              <p className="text-xs text-[#6B5145] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#D97A5B]" />
                <span>{user.email || 'resident@withtrug.com'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/recurring"
              className="px-4 py-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] hover:bg-[#F1E6DC] text-xs font-bold text-[#6B5145] transition flex items-center gap-1.5"
            >
              <Repeat className="w-3.5 h-3.5 text-[#D97A5B]" />
              <span>Daily Milk & Eggs</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#F1E6DC] gap-4 sm:gap-8 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 transition relative flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'text-[#D97A5B] border-b-2 border-[#D97A5B]'
                : 'text-[#6B5145] hover:text-[#302B28]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders & Deliveries ({dbOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 transition relative flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'text-[#D97A5B] border-b-2 border-[#D97A5B]'
                : 'text-[#6B5145] hover:text-[#302B28]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({dbAddresses.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {dbOrders.length > 0 ? (
              dbOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-5 rounded-2xl border border-[#F1E6DC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#302B28]">
                        Order #{order.order_number}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {order.status || 'Delivered'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B5145] font-semibold">
                      Store: <span className="text-[#302B28]">{order.store_name}</span>
                    </p>
                    <p className="text-[11px] text-[#6B5145]">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-base font-black text-[#302B28]">
                        ₹{order.total_paise ? order.total_paise / 100 : 0}
                      </span>
                      <span className="block text-[10px] text-[#6B5145]">Postgres Confirmed</span>
                    </div>
                    <Link
                      href="/shops"
                      className="px-3.5 py-1.5 rounded-xl bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#D97A5B] font-bold text-xs transition"
                    >
                      Reorder
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#F1E6DC] space-y-3">
                <Package className="w-12 h-12 text-[#6B5145]/30 mx-auto" />
                <h3 className="font-bold text-sm text-[#302B28]">No past orders found</h3>
                <p className="text-xs text-[#6B5145] max-w-sm mx-auto">
                  When you place quick deliveries from neighbourhood grocers and bakers, they will show up here.
                </p>
                <Link
                  href="/shops"
                  className="inline-block mt-2 px-5 py-2.5 bg-[#D97A5B] text-white text-xs font-bold rounded-full shadow-xs hover:bg-[#c2694d] transition"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dbAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white p-5 rounded-2xl border border-[#F1E6DC] shadow-xs space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#D97A5B]" />
                      <span className="font-bold text-sm text-[#302B28]">{addr.tag || 'Home'}</span>
                    </div>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold bg-[#F1E6DC] text-[#6B5145] px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#302B28]">{addr.name}</p>
                  <p className="text-xs text-[#6B5145]">{addr.addressLine}</p>
                  <p className="text-xs text-[#6B5145]">
                    {addr.locality} • {addr.postcode}
                  </p>
                  <p className="text-xs text-[#6B5145]">{addr.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
