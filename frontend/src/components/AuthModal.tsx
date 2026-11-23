'use client';

import React, { useState } from 'react';
import { X, Smartphone, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { login, showToast } = useCart();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

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
        setErrorMessage(data.error || 'Failed to dispatch OTP. Please check the number.');
        showToast(data.error || 'Failed to send OTP');
        return;
      }

      setStep('otp');
      showToast(`Verification code sent to +91 ${clean}`);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Network error');
      showToast('Network error while requesting OTP');
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`modal-otp-box-${index + 1}`);
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
        setErrorMessage(data.error || 'Invalid verification code. Please check and retry.');
        showToast(data.error || 'Verification failed');
        return;
      }

      login(`+91${clean}`, {
        name: data.user?.name || 'Resident',
        email: data.user?.email || null,
        id: data.user?.id,
      });

      showToast('Successfully signed in to TRUG!');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Verification error');
      showToast('Verification failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF5F0] border border-[#F1E6DC] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-[#302B28]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F1E6DC] text-[#6B5145] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {step === 'phone' ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97A5B] bg-[#F1E6DC] px-2.5 py-1 rounded-full">
                Instant Login
              </span>
              <h2 className="text-2xl font-black text-[#302B28] tracking-tight">
                Enter Mobile Number
              </h2>
              <p className="text-xs text-[#6B5145]">
                We will send an OTP via WhatsApp or SMS to verify your mobile number.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
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
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#F1E6DC] rounded-2xl text-sm font-semibold text-[#302B28] placeholder-[#6B5145]/50 focus:outline-hidden focus:border-[#D97A5B] focus:ring-1 focus:ring-[#D97A5B] transition shadow-xs"
                  autoFocus
                />
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
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-2 text-[11px] text-[#6B5145]/80 pt-2 border-t border-[#F1E6DC]">
              <ShieldCheck className="w-4 h-4 text-[#D97A5B] shrink-0" />
              <span>By continuing, you agree to TRUG's Terms of Service & Privacy Policy.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97A5B] bg-[#F1E6DC] px-2.5 py-1 rounded-full">
                Verify OTP
              </span>
              <h2 className="text-2xl font-black text-[#302B28] tracking-tight">
                Enter 6-Digit Code
              </h2>
              <p className="text-xs text-[#6B5145]">
                Sent to +91 {phoneNumber}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setStep('phone');
                  }}
                  className="text-[#D97A5B] font-bold underline ml-1 cursor-pointer"
                >
                  Edit
                </button>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`modal-otp-box-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-bold bg-white border border-[#F1E6DC] rounded-xl focus:border-[#D97A5B] focus:outline-hidden shadow-xs text-[#302B28]"
                  />
                ))}
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
                    <span>Verify & Login</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
