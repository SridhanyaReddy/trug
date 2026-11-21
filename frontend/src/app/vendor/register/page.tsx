'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useVendor } from '@/context/VendorContext';
import {
  Store,
  Upload,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function VendorRegisterPage() {
  const router = useRouter();
  const { updateVendorProfile, loginVendor } = useVendor();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [businessName, setBusinessName] = useState('Green Garden Organics');
  const [category, setCategory] = useState('Farm Fresh');
  const [ownerName, setOwnerName] = useState('Kishore Kumar');
  const [phone, setPhone] = useState('+91 98450 77890');
  const [email, setEmail] = useState('kishore@greengarden.com');
  const [addressLine, setAddressLine] = useState('Shop 14, 2nd Main, Sector 4');
  const [locality, setLocality] = useState('HSR Layout Sector 2');
  const [pincode, setPincode] = useState('560102');
  const [gstNumber, setGstNumber] = useState('29AACFG8891P1ZV');
  const [fssaiNumber, setFssaiNumber] = useState('11224556000213');

  // Document mock previews
  const [fssaiFile, setFssaiFile] = useState<string | null>('fssai_license_2026.pdf');
  const [gstFile, setGstFile] = useState<string | null>('gst_registration_cert.pdf');
  const [storePhoto, setStorePhoto] = useState<string | null>('storefront_exterior.jpg');

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    updateVendorProfile({
      businessName,
      category,
      ownerName,
      phone,
      email,
      gstNumber,
      fssaiNumber,
      address: {
        line1: addressLine,
        locality,
        city: 'Bengaluru',
        pincode,
      },
      verificationStatus: 'Pending Review',
    });
    loginVendor(phone);
    router.push('/vendor/dashboard');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 bg-[#FAF5F0] flex flex-col items-center justify-center">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex flex-col items-center">
            <span className="text-4xl font-black tracking-tight text-[#302B28]">
              <span className="text-[#D97A5B]">TRUG</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#6B5145] -mt-1">
              Vendor Onboarding
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#302B28]">Register Your Neighbourhood Store</h1>
          <p className="text-xs text-[#6B5145]">
            Start selling directly to nearby residents with dedicated store ordering and zero listing commissions.
          </p>
        </div>

        {/* Stepper Bar */}
        <div className="flex items-center justify-between max-w-md mx-auto">
          {[
            { s: 1, label: 'Outlet' },
            { s: 2, label: 'Location' },
            { s: 3, label: 'Compliance' },
          ].map((st) => (
            <div key={st.s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === st.s
                    ? 'bg-[#D97A5B] text-white'
                    : step > st.s
                    ? 'bg-[#302B28] text-white'
                    : 'bg-[#F1E6DC] text-[#6B5145]'
                }`}
              >
                {st.s}
              </div>
              <span
                className={`text-xs font-semibold ${
                  step === st.s ? 'text-[#302B28]' : 'text-[#6B5145]'
                }`}
              >
                {st.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F1E6DC] shadow-lg">
          {/* Step 1: Business Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#302B28] pb-2 border-b border-[#F1E6DC]">
                Step 1: Store & Owner Information
              </h2>

              <div>
                <label className="block text-xs font-bold text-[#302B28] mb-1">
                  Shop / Business Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#302B28] mb-1">
                  Store Primary Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-medium"
                >
                  <option value="Dairy & Essentials">Dairy & Essentials (Milk, Paneer, Curd)</option>
                  <option value="Farm Fresh">Farm Fresh (Vegetables & Fruits)</option>
                  <option value="Groceries">Kirana & Daily Staples</option>
                  <option value="Daily Meat & Eggs">Daily Meat & Eggs</option>
                  <option value="Artisan Bakery">Artisan Bakery & Fresh Buns</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#302B28] mb-1">Owner Name</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#302B28] mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#302B28] mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Continue to Store Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Outlet Location */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#302B28] pb-2 border-b border-[#F1E6DC]">
                Step 2: Outlet Address & Coverage
              </h2>

              <div>
                <label className="block text-xs font-bold text-[#302B28] mb-1">
                  Shop Flat / Street / Landmark Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#302B28] mb-1">Locality / Ward</label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#302B28] mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                  />
                </div>
              </div>

              <div className="bg-[#FAF5F0] p-4 rounded-2xl border border-[#F1E6DC] text-xs text-[#6B5145] space-y-1">
                <span className="font-bold text-[#302B28] block">Neighbourhood Delivery Radius</span>
                <p>Standard TRUG courier partners will cover a 3 km radius around this location for 15-30 minute drop-offs.</p>
              </div>

              <div className="flex items-center justify-between pt-3 gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#6B5145] hover:text-[#302B28]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <span>Upload Verification Docs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Compliance & Document Previews */}
          {step === 3 && (
            <form onSubmit={handleFinish} className="space-y-4">
              <h2 className="text-base font-bold text-[#302B28] pb-2 border-b border-[#F1E6DC]">
                Step 3: Verification & Compliance
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#302B28] mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    required
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#302B28] mb-1">FSSAI / Trade License</label>
                  <input
                    type="text"
                    required
                    value={fssaiNumber}
                    onChange={(e) => setFssaiNumber(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-mono"
                  />
                </div>
              </div>

              {/* Upload Previews */}
              <div className="space-y-2.5 pt-2">
                <label className="block text-xs font-bold text-[#302B28] uppercase tracking-wider">
                  Document Previews
                </label>

                {/* FSSAI doc preview */}
                <div className="p-3 bg-[#FAF5F0] rounded-2xl border border-[#F1E6DC] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#D97A5B]" />
                    <div>
                      <span className="font-bold text-[#302B28]">FSSAI Food Certificate</span>
                      <span className="text-[10px] text-[#6B5145] block">{fssaiFile}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Ready
                  </span>
                </div>

                {/* GST doc preview */}
                <div className="p-3 bg-[#FAF5F0] rounded-2xl border border-[#F1E6DC] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#D97A5B]" />
                    <div>
                      <span className="font-bold text-[#302B28]">GST Registration Certificate</span>
                      <span className="text-[10px] text-[#6B5145] block">{gstFile}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Ready
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#6B5145] hover:text-[#302B28]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit Application & Launch Portal</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Login Link */}
        <div className="text-center text-xs text-[#6B5145]">
          <span>Already registered? </span>
          <Link href="/vendor/login" className="font-bold text-[#D97A5B] hover:underline">
            Sign in to existing store
          </Link>
        </div>
      </div>
    </div>
  );
}

