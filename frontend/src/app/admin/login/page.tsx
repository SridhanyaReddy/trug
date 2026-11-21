'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import {
  Shield,
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAdmin();
  const [email, setEmail] = useState('admin@trug.focsera.com');
  const [password, setPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      loginAdmin(email);
      router.push('/admin/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-[#FAF5F0]">
      <div className="w-full max-w-md space-y-6">
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#D97A5B] mx-auto flex items-center justify-center text-white shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-[#302B28] tracking-tight">
              TRUG <span className="text-[#D97A5B]">Platform Admin</span>
            </h1>
            <p className="text-xs text-[#6B5145] font-medium">
              Central Operations, Dispute Escrow & Vendor Governance
            </p>
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F1E6DC] shadow-xl space-y-5">
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#302B28] font-bold mb-1.5 uppercase tracking-wider">
                Admin Work Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-medium focus:outline-none focus:border-[#D97A5B]"
                />
                <Mail className="w-4 h-4 text-[#6B5145] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[#302B28] font-bold mb-1.5 uppercase tracking-wider">
                Admin Security Token / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-medium focus:outline-none focus:border-[#D97A5B]"
                />
                <Lock className="w-4 h-4 text-[#6B5145] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#302B28] hover:bg-black text-white font-bold text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <span>Authenticating Administrator...</span>
              ) : (
                <>
                  <span>Access Admin Control Tower</span>
                  <ArrowRight className="w-4 h-4 text-[#D97A5B]" />
                </>
              )}
            </button>
          </form>

          <div className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC] text-xs text-[#6B5145] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#302B28]">
              <Sparkles className="w-3.5 h-3.5 text-[#D97A5B]" />
              <span>Mock Governance Credentials</span>
            </div>
            <p className="text-[11px]">
              Pre-filled with master administrative access. Click above to view cross-store analytics, dispute queues, and vendor KYC.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-[11px] text-[#6B5145] hover:text-[#302B28] font-semibold underline"
          >
            ← Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

