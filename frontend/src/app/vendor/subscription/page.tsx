'use client';

import React from 'react';
import { useVendor } from '@/context/VendorContext';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  History,
} from 'lucide-react';

export default function VendorSubscriptionPage() {
  const { vendorProfile, updateVendorProfile } = useVendor();

  const plans = [
    {
      name: 'Neighbourhood Starter',
      price: '₹799',
      period: '/month',
      desc: 'Ideal for single-outlet independent shops starting online deliveries.',
      features: [
        'Up to 150 monthly orders',
        'Direct Storefront & QR code counter displays',
        'Standard 3km neighbourhood delivery radius',
        'Basic order and customer management',
      ],
      isCurrent: vendorProfile.currentPlan === 'Neighbourhood Starter',
    },
    {
      name: 'Growth Champion',
      price: '₹1,499',
      period: '/month',
      badge: 'Most Popular',
      desc: 'Designed for active dairies, grocery stores, and daily milk routes.',
      features: [
        'Unlimited orders & daily recurring subscriptions',
        'Dawn delivery slot scheduler (6:30 AM drops)',
        'Up to 5 staff accounts & packing roles',
        'Dedicated dispatch courier priority',
        'Advanced customer directory & notes',
      ],
      isCurrent: vendorProfile.currentPlan === 'Growth Champion',
    },
    {
      name: 'Hyperlocal Scale',
      price: '₹2,499',
      period: '/month',
      desc: 'For multi-counter supermarkets and regional farm distribution.',
      features: [
        'Everything in Growth Champion',
        'Multi-outlet inventory synchronization',
        'Custom delivery fee overrides & slots',
        'Dedicated account manager & phone support',
      ],
      isCurrent: vendorProfile.currentPlan === 'Hyperlocal Scale',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
          Platform Subscription & Billing
        </h1>
        <p className="text-xs text-[#6B5145] mt-0.5">
          TRUG operates on simple transparent software subscriptions with 0% commission on your retail transactions.
        </p>
      </div>

      {/* Current Active Plan Banner */}
      <div className="bg-[#6B5145] text-white p-6 sm:p-8 rounded-3xl border border-[#6B5145] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D97A5B]" />
            <span>Active Store License</span>
          </div>
          <h2 className="text-2xl font-black text-[#FAF5F0]">{vendorProfile.currentPlan}</h2>
          <p className="text-xs text-[#FAF5F0]/80">
            Valid until {vendorProfile.planExpiry} • Next renewal auto-settles via UPI AutoPay.
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-xs space-y-1">
          <span className="font-bold text-[#FAF5F0] block">Platform Fee Model</span>
          <p className="text-[#FAF5F0]/70 text-[11px]">
            Zero transaction percentage. 100% of product revenue remains with your shop.
          </p>
        </div>
      </div>

      {/* Plan Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-3xl p-6 border transition flex flex-col justify-between relative shadow-xs ${
              p.isCurrent
                ? 'border-[#D97A5B] ring-2 ring-[#D97A5B]/20'
                : 'border-[#F1E6DC] hover:border-[#D97A5B]/40'
            }`}
          >
            {p.badge && (
              <span className="absolute -top-3 right-6 bg-[#D97A5B] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                {p.badge}
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-[#302B28]">{p.name}</h3>
                <p className="text-xs text-[#6B5145] mt-1 leading-relaxed">{p.desc}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#302B28]">{p.price}</span>
                <span className="text-xs text-[#6B5145] font-semibold">{p.period}</span>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-[#F1E6DC] text-xs">
                {p.features.map((f, fi) => (
                  <div key={fi} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D97A5B] shrink-0 mt-0.5" />
                    <span className="text-[#302B28] font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              {p.isCurrent ? (
                <div className="w-full py-2.5 rounded-2xl bg-[#FAF5F0] text-[#6B5145] text-xs font-bold text-center border border-[#F1E6DC]">
                  Current Active Plan
                </div>
              ) : (
                <button
                  onClick={() => updateVendorProfile({ currentPlan: p.name as any })}
                  className="w-full py-2.5 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white text-xs font-bold transition shadow-xs"
                >
                  Switch to {p.name.split(' ')[0]}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Billing History Placeholder */}
      <div className="bg-white rounded-3xl border border-[#F1E6DC] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#D97A5B]" />
          <h2 className="text-base font-extrabold text-[#302B28]">Past Invoices & Billing Receipts</h2>
        </div>

        <div className="divide-y divide-[#F1E6DC]/70 text-xs">
          {[
            { id: 'INV-2026-10', date: '15 Oct 2026', amount: '₹1,499', plan: 'Growth Champion', status: 'Paid' },
            { id: 'INV-2026-09', date: '15 Sep 2026', amount: '₹1,499', plan: 'Growth Champion', status: 'Paid' },
            { id: 'INV-2026-08', date: '15 Aug 2026', amount: '₹1,499', plan: 'Growth Champion', status: 'Paid' },
          ].map((inv) => (
            <div key={inv.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#302B28]">{inv.id}</span>
                <span className="text-[#6B5145] ml-2">({inv.plan})</span>
                <span className="text-[11px] text-[#6B5145] block">{inv.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-[#302B28]">{inv.amount}</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

