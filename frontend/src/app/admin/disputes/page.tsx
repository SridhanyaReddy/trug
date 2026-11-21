'use client';

import React from 'react';
import { useAdmin } from '@/context/AdminContext';
import {
  AlertOctagon,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export default function AdminDisputesPage() {
  const { disputes, processDisputeRefund, resolveDispute } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
          Dispute Resolution & Escrow Refunds
        </h1>
        <p className="text-xs text-[#6B5145] mt-0.5">
          Order-related claims, packaging complaints, spoiled perishable refunds, and merchant fault arbitration.
        </p>
      </div>

      {/* Disputes Cards List */}
      <div className="space-y-4">
        {disputes.map((disp) => {
          const isPending = disp.status === 'Under Investigation';
          const isRefunded = disp.status === 'Refund Approved';

          return (
            <div
              key={disp.id}
              className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs space-y-4 ${
                isPending ? 'border-amber-300' : 'border-[#F1E6DC]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1E6DC]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-sm text-[#302B28]">
                      Case #{disp.id} • Order {disp.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isRefunded
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPending
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {disp.status}
                    </span>
                  </div>
                  <span className="text-xs text-[#6B5145] font-medium">
                    Lodged on {disp.createdAt}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-lg font-black text-[#D97A5B]">₹{disp.amount}</span>
                  <span className="text-[11px] text-[#6B5145] block">Disputed Value</span>
                </div>
              </div>

              {/* Dispute Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[#6B5145] block">Claim Reason:</span>
                  <p className="font-bold text-[#302B28]">{disp.disputeReason}</p>
                  <p className="text-[#6B5145] pt-1">
                    Store: <strong className="text-[#302B28]">{disp.vendorName}</strong>
                  </p>
                  <p className="text-[#6B5145]">
                    Customer: <strong className="text-[#302B28]">{disp.customerName}</strong>
                  </p>
                </div>

                <div className="bg-[#FAF5F0] p-4 rounded-2xl border border-[#F1E6DC] space-y-1">
                  <span className="font-bold text-[#302B28] block">Operations Investigation Findings</span>
                  <p className="text-[#6B5145] leading-relaxed">{disp.evidenceNotes}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#F1E6DC] flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-[#6B5145]">
                  {disp.refundInitiated
                    ? 'Simulated refund was transmitted back to customer UPI account.'
                    : 'Customer claims a replacement or credit refund.'}
                </span>

                <div className="flex items-center gap-2">
                  {isPending && (
                    <>
                      <button
                        onClick={() => resolveDispute(disp.id, 'Refund Rejected')}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 transition"
                      >
                        Dismiss Claim
                      </button>
                      <button
                        onClick={() => processDisputeRefund(disp.id)}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#D97A5B] hover:bg-[#c2694d] shadow-xs transition flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Approve ₹{disp.amount} Refund</span>
                      </button>
                    </>
                  )}

                  {isRefunded && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                      Settled via Escrow
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

