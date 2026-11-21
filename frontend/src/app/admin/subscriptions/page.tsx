'use client';

import React from 'react';
import { useAdmin } from '@/context/AdminContext';
import {
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Store,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const { vendors } = useAdmin();

  const plans = [
    {
      name: 'Neighbourhood Starter',
      price: '₹799',
      period: '/mo',
      activeVendors: vendors.filter((v) => v.plan.includes('799')).length,
      revenueMonthly: vendors.filter((v) => v.plan.includes('799')).length * 799,
    },
    {
      name: 'Growth Champion',
      price: '₹1,499',
      period: '/mo',
      activeVendors: vendors.filter((v) => v.plan.includes('1,499')).length,
      revenueMonthly: vendors.filter((v) => v.plan.includes('1,499')).length * 1499,
    },
    {
      name: 'Hyperlocal Scale',
      price: '₹2,499',
      period: '/mo',
      activeVendors: vendors.filter((v) => v.plan.includes('2,499')).length,
      revenueMonthly: vendors.filter((v) => v.plan.includes('2,499')).length * 2499,
    },
  ];

  const totalSaaSMonthly = plans.reduce((sum, p) => sum + p.revenueMonthly, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
          Merchant Subscription Administration
        </h1>
        <p className="text-xs text-[#6B5145] mt-0.5">
          Software tier distribution, billing cycles, monthly recurring revenue (MRR), and license expiries.
        </p>
      </div>

      {/* Plans Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((p, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-[#F1E6DC] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[#302B28]">{p.name}</h3>
              <span className="text-xs font-bold text-[#D97A5B]">{p.price}{p.period}</span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[#6B5145]">
                <span>Active Subscribing Stores:</span>
                <strong className="text-[#302B28]">{p.activeVendors}</strong>
              </div>
              <div className="flex justify-between text-[#6B5145]">
                <span>Monthly Platform Revenue:</span>
                <strong className="text-emerald-800 font-bold">₹{p.revenueMonthly.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Subscriptions Directory */}
      <div className="bg-white rounded-3xl border border-[#F1E6DC] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#F1E6DC] flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#302B28]">Store Licenses & Next Billing Dates</h2>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Total MRR: ₹{totalSaaSMonthly.toLocaleString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF5F0] border-b border-[#F1E6DC] text-[#6B5145] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Store Name</th>
                <th className="py-3.5 px-4">Current Subscription Plan</th>
                <th className="py-3.5 px-4">Owner Contact</th>
                <th className="py-3.5 px-4">Valid Through</th>
                <th className="py-3.5 px-4">Billing AutoPay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1E6DC]/70">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-[#FAF5F0]/40 transition">
                  <td className="py-4 px-4 font-bold text-[#302B28]">
                    {v.businessName}
                    <span className="text-[10px] text-[#6B5145] block font-normal">{v.locality}</span>
                  </td>

                  <td className="py-4 px-4 font-semibold text-[#D97A5B]">
                    {v.plan}
                  </td>

                  <td className="py-4 px-4 text-[#6B5145]">
                    {v.ownerName} ({v.phone})
                  </td>

                  <td className="py-4 px-4 text-[#302B28] font-mono">
                    {v.planExpiry}
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active UPI Mandate
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

