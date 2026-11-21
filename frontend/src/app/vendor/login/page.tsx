'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useVendor } from '@/context/VendorContext';
import {
  Store,
  ArrowRight,
  ShieldCheck,
  Phone,
  Lock,
  Sparkles,
} from 'lucide-react';

export default function VendorLoginPage() {
  const router = useRouter();
  const { loginVendor } = useVendor();
  const [identifier, setIdentifier] = useState('+91 98450 12341');
  const [otpOrPassword, setOtpOrPassword] = useState('123456');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      loginVendor(identifier);
      router.push('/vendor/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-[#FAF5F0]">
      <div className="w-full max-w-md space-y-6">
        {/* Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex flex-col items-center">
            <span className="text-4xl font-black tracking-tight text-[#302B28]">
              <span className="text-[#D97A5B]">TRUG</span>
            </span>
            <span className="text-[11px] tracking-widest uppercase font-bold text-[#6B5145] -mt-1">
              Vendor Portal
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#302B28]">Sign In to Your Store</h1>
          <p className="text-xs text-[#6B5145]">
            Manage products, incoming neighbourhood deliveries, and morning milk subscriptions.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F1E6DC] shadow-lg space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#302B28] mb-1.5 uppercase tracking-wider">
                Store Registered Mobile or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="+91 98450 12341"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-xs font-medium text-[#302B28] focus:outline-none focus:border-[#D97A5B]"
                />
                <Phone className="w-4 h-4 text-[#6B5145] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#302B28] uppercase tracking-wider">
                  Store Passcode / OTP
                </label>
                <span className="text-[11px] text-[#D97A5B] font-semibold cursor-pointer">
                  Send OTP
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={otpOrPassword}
                  onChange={(e) => setOtpOrPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-xs font-medium text-[#302B28] focus:outline-none focus:border-[#D97A5B]"
                />
                <Lock className="w-4 h-4 text-[#6B5145] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white font-bold text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <span>Entering Store Portal...</span>
              ) : (
                <>
                  <span>Open Merchant Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo account quick login box */}
          <div className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC] text-xs text-[#6B5145] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#302B28]">
              <Sparkles className="w-3.5 h-3.5 text-[#D97A5B]" />
              <span>Demo Store Pre-filled</span>
            </div>
            <p className="text-[11px]">
              Preset with <strong>Krishna Farm Fresh & Dairy</strong>. Click above to login directly with all sample products and live orders.
            </p>
          </div>
        </div>

        {/* Registration Link */}
        <div className="text-center text-xs text-[#6B5145]">
          <span>New independent store owner? </span>
          <Link
            href="/vendor/register"
            className="font-bold text-[#D97A5B] hover:underline"
          >
            Register your shop here
          </Link>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-[11px] text-[#6B5145] hover:text-[#302B28] font-semibold underline"
          >
            ← Return to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
}

