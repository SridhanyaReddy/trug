'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Smartphone, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, showToast } = useCart();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const clean = phoneNumber.replace(/\D/g, '').slice(-10);
    if (clean.length < 10) {
      showToast('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', phone: `+91${clean}` }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to dispatch verification code.');
        showToast(data.error || 'Failed to send OTP');
        return;
      }

      setStep('otp');
      showToast(`Verification code sent to +91 ${clean}`);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Network error');
      showToast('Failed to connect to authentication gateway');
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`login-page-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const entered = otp.join('');
    if (entered.length < 6) {
      showToast('Please enter the complete 6-digit code');
      return;
    }
    setIsSubmitting(true);

    try {
      const clean = phoneNumber.replace(/\D/g, '').slice(-10);
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phone: `+91${clean}`, code: entered }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Invalid verification code. Please check and try again.');
        showToast(data.error || 'Verification failed');
        return;
      }

      login(`+91${clean}`, {
        name: data.user?.name || 'Resident',
        email: data.user?.email || null,
        id: data.user?.id,
      });

      showToast('Welcome back to TRUG!');
      router.push('/profile');
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Verification error');
      showToast('Verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5F0] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white border border-[#F1E6DC] rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-xs border border-[#F1E6DC] bg-[#FAF5F0] shrink-0">
              <Image src="/logo.png" alt="TRUG by Focsera" fill priority className="object-cover" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-black tracking-tight text-[#302B28] leading-none">
                <span className="text-[#D97A5B]">trug</span>.
              </span>
              <span className="text-[10px] tracking-wider font-semibold text-[#6B5145] leading-tight">
                by focsera
              </span>
            </div>
          </Link>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#302B28]">
              {step === 'phone' ? 'Welcome to TRUG' : 'Verify Mobile'}
            </h1>
            <p className="text-xs text-[#6B5145] mt-1">
              {step === 'phone'
                ? 'Login or Sign Up with your mobile number to view profile, saved addresses & orders.'
                : `Enter the 6-digit WhatsApp/SMS OTP sent to +91 ${phoneNumber}`}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B5145]">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-bold text-[#6B5145]">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full pl-12 pr-4 py-3 bg-[#FAF5F0] border border-[#F1E6DC] rounded-2xl text-sm font-semibold text-[#302B28] placeholder-[#6B5145]/50 focus:outline-hidden focus:border-[#D97A5B] focus:ring-1 focus:ring-[#D97A5B] transition shadow-xs"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || phoneNumber.length < 10}
              className="w-full py-3.5 bg-[#D97A5B] hover:bg-[#c2694d] disabled:opacity-50 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              {isSubmitting ? (
                <span>Sending WhatsApp OTP...</span>
              ) : (
                <>
                  <span>Get OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="flex justify-between gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`login-page-otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-12 h-14 text-center text-xl font-black bg-[#FAF5F0] border border-[#F1E6DC] rounded-2xl focus:border-[#D97A5B] focus:outline-hidden shadow-xs text-[#302B28]"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-[#6B5145]">
              <span>Didn't receive code?</span>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('phone');
                }}
                className="text-[#D97A5B] font-bold hover:underline cursor-pointer"
              >
                Change Number
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otp.some((d) => !d)}
              className="w-full py-3.5 bg-[#D97A5B] hover:bg-[#c2694d] disabled:opacity-50 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              {isSubmitting ? (
                <span>Verifying Code...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Proceed</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Assurance */}
        <div className="pt-4 border-t border-[#F1E6DC] flex items-center gap-2.5 text-[11px] text-[#6B5145]">
          <ShieldCheck className="w-4 h-4 text-[#D97A5B] shrink-0" />
          <span>Secured by Focsera Identity. Real WhatsApp OTP verification enforced.</span>
        </div>
      </div>
    </div>
  );
}
