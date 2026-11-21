'use client';

import React, { useState } from 'react';
import { useVendor } from '@/context/VendorContext';
import {
  Settings,
  Store,
  Clock,
  Users,
  ShieldCheck,
  Plus,
  Trash2,
  Phone,
  Mail,
  MapPin,
  X,
} from 'lucide-react';

export default function VendorSettingsPage() {
  const {
    vendorProfile,
    updateVendorProfile,
    staffMembers,
    addStaffMember,
    removeStaffMember,
  } = useVendor();

  const [activeTab, setActiveTab] = useState<'profile' | 'hours' | 'staff' | 'delivery'>('profile');

  // Profile Form state
  const [businessName, setBusinessName] = useState(vendorProfile.businessName);
  const [ownerName, setOwnerName] = useState(vendorProfile.ownerName);
  const [phone, setPhone] = useState(vendorProfile.phone);
  const [email, setEmail] = useState(vendorProfile.email);
  const [timings, setTimings] = useState(vendorProfile.timings);
  const [minOrderValue, setMinOrderValue] = useState(vendorProfile.minOrderValue);
  const [deliveryFee, setDeliveryFee] = useState(vendorProfile.deliveryFee);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(vendorProfile.deliveryRadiusKm);

  // Staff modal
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'Store Manager' | 'Packing Staff' | 'Delivery Rider' | 'Cashier'>('Packing Staff');
  const [newStaffPhone, setNewStaffPhone] = useState('+91 98');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateVendorProfile({
      businessName,
      ownerName,
      phone,
      email,
      timings,
      minOrderValue: Number(minOrderValue),
      deliveryFee: Number(deliveryFee),
      deliveryRadiusKm: Number(deliveryRadiusKm),
    });
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;
    addStaffMember({
      name: newStaffName,
      role: newStaffRole,
      phone: newStaffPhone,
      status: 'Active',
    });
    setShowStaffModal(false);
    setNewStaffName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
          Shop Settings & Outlet Configuration
        </h1>
        <p className="text-xs text-[#6B5145] mt-0.5">
          Configure business details, operational timings, delivery parameters, and staff members.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#F1E6DC] scrollbar-none">
        {[
          { id: 'profile', label: 'Business Profile', icon: Store },
          { id: 'hours', label: 'Operating Hours', icon: Clock },
          { id: 'delivery', label: 'Delivery Coverage', icon: MapPin },
          { id: 'staff', label: 'Staff Management', icon: Users, count: staffMembers.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-[#F1E6DC] p-6 space-y-4 max-w-2xl shadow-xs">
          <h2 className="text-base font-extrabold text-[#302B28]">Store & Owner Details</h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[#6B5145] font-bold mb-1">Business Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Owner / Manager Name</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>

              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Registered Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#6B5145] font-bold mb-1">Store Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC]">
                <span className="text-[10px] text-[#6B5145] block">GST Number:</span>
                <span className="font-mono font-bold text-[#302B28]">{vendorProfile.gstNumber}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC]">
                <span className="text-[10px] text-[#6B5145] block">FSSAI License:</span>
                <span className="font-mono font-bold text-[#302B28]">{vendorProfile.fssaiNumber}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white text-xs font-bold shadow-xs transition"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Hours */}
      {activeTab === 'hours' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-[#F1E6DC] p-6 space-y-4 max-w-xl shadow-xs">
          <h2 className="text-base font-extrabold text-[#302B28]">Store Operating Hours</h2>
          <p className="text-xs text-[#6B5145]">
            Controls what customers see on your public storefront and when orders can be dispatched.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[#6B5145] font-bold mb-1">Standard Daily Timings Display</label>
              <input
                type="text"
                required
                value={timings}
                onChange={(e) => setTimings(e.target.value)}
                placeholder="e.g. 06:00 AM - 10:00 PM"
                className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-bold"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC] space-y-2">
              <span className="font-bold text-[#302B28] block">Morning Fresh Dispatch Protocol</span>
              <p className="text-[#6B5145] leading-relaxed">
                For milk dairies and bakeries, morning deliveries drop at customer doorsteps between 6:30 AM and 8:00 AM. Packing starts at 5:30 AM.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-[#D97A5B] text-white text-xs font-bold shadow-xs"
          >
            Update Timings
          </button>
        </form>
      )}

      {/* Tab 3: Delivery Parameters */}
      {activeTab === 'delivery' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-[#F1E6DC] p-6 space-y-4 max-w-xl shadow-xs">
          <h2 className="text-base font-extrabold text-[#302B28]">Delivery Radius & Order Minimums</h2>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Delivery Radius (km)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={deliveryRadiusKm}
                  onChange={(e) => setDeliveryRadiusKm(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  required
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#6B5145] font-bold mb-1">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                required
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-bold"
              />
              <span className="text-[11px] text-[#6B5145] mt-1 block">
                Set to 0 if your store offers free delivery on all neighbourhood orders.
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-[#D97A5B] text-white text-xs font-bold shadow-xs"
          >
            Save Delivery Rules
          </button>
        </form>
      )}

      {/* Tab 4: Staff Management */}
      {activeTab === 'staff' && (
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#302B28]">Staff Members & Access</h2>
              <p className="text-xs text-[#6B5145]">Assign packing staff and delivery riders.</p>
            </div>
            <button
              onClick={() => setShowStaffModal(true)}
              className="px-4 py-2 rounded-full bg-[#D97A5B] hover:bg-[#c2694d] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staff</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staffMembers.map((staff) => (
              <div
                key={staff.id}
                className="bg-white p-4 rounded-3xl border border-[#F1E6DC] flex items-center justify-between shadow-xs"
              >
                <div>
                  <span className="font-bold text-xs text-[#302B28] block">{staff.name}</span>
                  <span className="text-[11px] text-[#D97A5B] font-semibold">{staff.role}</span>
                  <span className="text-[10px] text-[#6B5145] block mt-0.5">{staff.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {staff.status}
                  </span>
                  {staffMembers.length > 1 && (
                    <button
                      onClick={() => removeStaffMember(staff.id)}
                      className="text-[#6B5145] hover:text-red-600 p-1 transition"
                      title="Remove staff"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <form
            onSubmit={handleAddStaff}
            className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#F1E6DC] shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#F1E6DC]">
              <h3 className="font-extrabold text-base text-[#302B28]">Add Staff Member</h3>
              <button
                type="button"
                onClick={() => setShowStaffModal(false)}
                className="p-1 text-[#6B5145]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Anand Gowda"
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>

              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Role in Store</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                >
                  <option value="Packing Staff">Packing Staff</option>
                  <option value="Delivery Rider">Delivery Rider</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Store Manager">Store Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-[#6B5145] font-bold mb-1">Mobile Contact</label>
                <input
                  type="text"
                  required
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1E6DC]">
              <button
                type="button"
                onClick={() => setShowStaffModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B5145]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-[#D97A5B] text-white text-xs font-bold shadow-xs"
              >
                Add Member
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

