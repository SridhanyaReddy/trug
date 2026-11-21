'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import { AdminVendorRecord } from '@/types/admin';
import {
  Store,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Star,
  MapPin,
  Phone,
  Mail,
  Shield,
  Eye,
  X,
  CreditCard,
} from 'lucide-react';

export default function AdminVendorsPage() {
  const { vendors, updateVendorVerification, updateVendorAccountStatus } = useAdmin();

  const [search, setSearch] = useState('');
  const [localityFilter, setLocalityFilter] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Vendor Details Modal
  const [selectedVendor, setSelectedVendor] = useState<AdminVendorRecord | null>(null);

  // Confirmation Modal state
  const [confirmAction, setConfirmAction] = useState<{
    vendorId: string;
    actionName: string;
    actionFn: () => void;
  } | null>(null);

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchSearch =
        v.businessName.toLowerCase().includes(search.toLowerCase()) ||
        v.ownerName.toLowerCase().includes(search.toLowerCase()) ||
        v.phone.includes(search);
      const matchLocality = localityFilter === 'All' || v.locality.includes(localityFilter);
      const matchVerif = verificationFilter === 'All' || v.verificationStatus === verificationFilter;
      const matchStatus = statusFilter === 'All' || v.accountStatus === statusFilter;
      return matchSearch && matchLocality && matchVerif && matchStatus;
    });
  }, [vendors, search, localityFilter, verificationFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
            Neighbourhood Store Governance
          </h1>
          <p className="text-xs text-[#6B5145] mt-0.5">
            Audit store applications, verify FSSAI/GST certificates, suspend or reactivate merchant accounts.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-3xl border border-[#F1E6DC] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="w-full md:w-72 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by store or owner..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF5F0] text-xs font-medium text-[#302B28] rounded-xl border border-[#F1E6DC] focus:outline-none focus:border-[#D97A5B]"
          />
          <Search className="w-4 h-4 text-[#6B5145] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-xs">
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="bg-[#FAF5F0] border border-[#F1E6DC] rounded-xl px-3 py-2 text-xs font-semibold text-[#302B28] focus:outline-none focus:border-[#D97A5B]"
          >
            <option value="All">All Verification</option>
            <option value="Verified">Verified</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Action Needed">Action Needed</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF5F0] border border-[#F1E6DC] rounded-xl px-3 py-2 text-xs font-semibold text-[#302B28] focus:outline-none focus:border-[#D97A5B]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-3xl border border-[#F1E6DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF5F0] border-b border-[#F1E6DC] text-[#6B5145] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Store Name & Category</th>
                <th className="py-3.5 px-4">Owner Contact</th>
                <th className="py-3.5 px-4">Locality</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Account</th>
                <th className="py-3.5 px-4">Volume & GMV</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1E6DC]/70">
              {filteredVendors.map((v) => (
                <tr key={v.id} className="hover:bg-[#FAF5F0]/40 transition">
                  <td className="py-4 px-4">
                    <div>
                      <span className="font-extrabold text-xs text-[#302B28] block">{v.businessName}</span>
                      <span className="text-[11px] text-[#6B5145] font-medium">{v.category}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-[#6B5145]">
                    <span className="font-bold text-[#302B28] block">{v.ownerName}</span>
                    <span className="text-[11px]">{v.phone}</span>
                  </td>

                  <td className="py-4 px-4 text-[#6B5145]">
                    <div className="flex items-center gap-1.5 max-w-[170px] truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#D97A5B] shrink-0" />
                      <span className="truncate">{v.locality}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        v.verificationStatus === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : v.verificationStatus === 'Pending Review'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {v.verificationStatus}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        v.accountStatus === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {v.accountStatus}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-[#302B28] block">{v.totalOrders} orders</span>
                    <span className="text-[11px] text-[#D97A5B] font-bold">
                      ₹{v.grossSales.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedVendor(v)}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] font-bold text-xs border border-[#F1E6DC] transition flex items-center gap-1"
                        title="View Complete KYC"
                      >
                        <Eye className="w-3 h-3 text-[#D97A5B]" />
                        <span>Inspect</span>
                      </button>

                      {v.verificationStatus !== 'Verified' && (
                        <button
                          onClick={() => {
                            setConfirmAction({
                              vendorId: v.id,
                              actionName: `Approve "${v.businessName}" as Verified Store`,
                              actionFn: () => updateVendorVerification(v.id, 'Verified'),
                            });
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                          title="Approve Store"
                        >
                          Approve
                        </button>
                      )}

                      {v.accountStatus === 'Active' ? (
                        <button
                          onClick={() => {
                            setConfirmAction({
                              vendorId: v.id,
                              actionName: `Suspend account for "${v.businessName}"`,
                              actionFn: () => updateVendorAccountStatus(v.id, 'Suspended'),
                            });
                          }}
                          className="p-1.5 rounded-lg text-[#6B5145] hover:text-red-700 hover:bg-red-50 transition"
                          title="Suspend Store"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setConfirmAction({
                              vendorId: v.id,
                              actionName: `Reactivate account for "${v.businessName}"`,
                              actionFn: () => updateVendorAccountStatus(v.id, 'Active'),
                            });
                          }}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition font-bold"
                          title="Reactivate Store"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor KYC Inspector Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#F1E6DC] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#F1E6DC]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97A5B]">
                  Merchant Compliance File
                </span>
                <h3 className="font-extrabold text-xl text-[#302B28]">
                  {selectedVendor.businessName}
                </h3>
                <p className="text-xs text-[#6B5145]">
                  {selectedVendor.category} • Onboarded on {selectedVendor.joinedDate}
                </p>
              </div>
              <button
                onClick={() => setSelectedVendor(null)}
                className="p-1 text-[#6B5145] hover:text-[#302B28]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#FAF5F0] p-4 rounded-2xl border border-[#F1E6DC] space-y-1.5">
                <span className="font-bold text-[#302B28] block uppercase tracking-wider text-[11px]">
                  Owner Information
                </span>
                <p>Name: <strong className="text-[#302B28]">{selectedVendor.ownerName}</strong></p>
                <p>Phone: <strong className="text-[#302B28]">{selectedVendor.phone}</strong></p>
                <p>Email: <strong className="text-[#302B28]">{selectedVendor.email}</strong></p>
                <p>Address: {selectedVendor.locality}, {selectedVendor.city}</p>
              </div>

              <div className="bg-[#FAF5F0] p-4 rounded-2xl border border-[#F1E6DC] space-y-1.5">
                <span className="font-bold text-[#302B28] block uppercase tracking-wider text-[11px]">
                  Legal Registration
                </span>
                <p>GSTIN: <strong className="font-mono text-[#302B28]">{selectedVendor.gstNumber}</strong></p>
                <p>FSSAI Food License: <strong className="font-mono text-[#302B28]">{selectedVendor.fssaiNumber}</strong></p>
                <p>Current Plan: <strong className="text-[#D97A5B]">{selectedVendor.plan}</strong></p>
                <p>Rating: ★ {selectedVendor.rating} (Verified)</p>
              </div>
            </div>

            {/* Mock Verification Documents */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#302B28] uppercase tracking-wider text-[11px]">
                Submitted Verification Documents
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl border border-[#F1E6DC] bg-[#FAF5F0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D97A5B]" />
                    <span className="font-bold text-[#302B28]">{selectedVendor.documents.fssaiDoc}</span>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    Passed
                  </span>
                </div>

                <div className="p-3 rounded-2xl border border-[#F1E6DC] bg-[#FAF5F0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D97A5B]" />
                    <span className="font-bold text-[#302B28]">{selectedVendor.documents.gstDoc}</span>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    Passed
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#F1E6DC] flex items-center justify-between">
              <span className="text-xs text-[#6B5145]">
                Account Status: <strong className="text-[#302B28]">{selectedVendor.accountStatus}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateVendorVerification(selectedVendor.id, 'Action Needed');
                    setSelectedVendor(null);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100"
                >
                  Request Info
                </button>
                <button
                  onClick={() => {
                    updateVendorVerification(selectedVendor.id, 'Verified');
                    setSelectedVendor(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs"
                >
                  Confirm Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#F1E6DC] shadow-2xl space-y-4 text-center">
            <AlertTriangle className="w-10 h-10 text-[#D97A5B] mx-auto" />
            <h3 className="font-extrabold text-base text-[#302B28]">Confirm Governance Action</h3>
            <p className="text-xs text-[#6B5145] leading-relaxed">
              Are you sure you want to proceed with: <br />
              <strong>{confirmAction.actionName}</strong>?
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B5145] hover:text-[#302B28]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmAction.actionFn();
                  setConfirmAction(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#D97A5B] hover:bg-[#c2694d] text-white text-xs font-bold shadow-xs"
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

