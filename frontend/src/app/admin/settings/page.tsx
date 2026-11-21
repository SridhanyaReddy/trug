'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import {
  Settings,
  Shield,
  FileText,
  History,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const {
    adminUser,
    platformConfig,
    updatePlatformConfig,
    auditLogs,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'profile' | 'platform' | 'audit'>('profile');

  // Config state
  const [supportPhone, setSupportPhone] = useState(platformConfig.supportHelpline);
  const [supportEmail, setSupportEmail] = useState(platformConfig.supportEmail);
  const [defaultRadius, setDefaultRadius] = useState(platformConfig.defaultDeliveryRadiusKm);
  const [autoApprove, setAutoApprove] = useState(platformConfig.autoApproveSubscriptions);

  const handleSavePlatform = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformConfig({
      supportHelpline: supportPhone,
      supportEmail,
      defaultDeliveryRadiusKm: Number(defaultRadius),
      autoApproveSubscriptions: autoApprove,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
          Admin Governance & Platform Settings
        </h1>
        <p className="text-xs text-[#6B5145] mt-0.5">
          Platform-wide configuration, administrator credentials, and complete audit trail.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#F1E6DC] scrollbar-none">
        {[
          { id: 'profile', label: 'Admin Profile', icon: Shield },
          { id: 'platform', label: 'Platform Parameters', icon: Settings },
          { id: 'audit', label: 'System Audit Trail', icon: History, count: auditLogs.length },
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

      {/* Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-[#F1E6DC] p-6 max-w-xl space-y-4 shadow-xs text-xs">
          <h2 className="text-base font-extrabold text-[#302B28]">Administrator Identification</h2>

          <div className="space-y-3">
            <div>
              <span className="text-[#6B5145] font-bold block mb-1">Operator Name</span>
              <div className="p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] font-bold text-[#302B28]">
                {adminUser.name}
              </div>
            </div>

            <div>
              <span className="text-[#6B5145] font-bold block mb-1">System Role</span>
              <div className="p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] font-bold text-[#D97A5B]">
                {adminUser.role}
              </div>
            </div>

            <div>
              <span className="text-[#6B5145] font-bold block mb-1">Access Email</span>
              <div className="p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] font-mono text-[#302B28]">
                {adminUser.email}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF5F0] border border-[#F1E6DC] text-[#6B5145] space-y-1">
              <span className="font-bold text-[#302B28] block">Security Policy</span>
              <p>Two-factor authentication token enforced for all dispute refunds and vendor suspensions.</p>
            </div>
          </div>
        </div>
      )}

      {/* Platform Configuration */}
      {activeTab === 'platform' && (
        <form onSubmit={handleSavePlatform} className="bg-white rounded-3xl border border-[#F1E6DC] p-6 max-w-xl space-y-4 shadow-xs text-xs">
          <h2 className="text-base font-extrabold text-[#302B28]">Global Hyperlocal Rules</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-[#6B5145] font-bold mb-1">Support Helpline (Displayed across customer app)</label>
              <input
                type="text"
                required
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-bold"
              />
            </div>

            <div>
              <label className="block text-[#6B5145] font-bold mb-1">Support Email</label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-bold"
              />
            </div>

            <div>
              <label className="block text-[#6B5145] font-bold mb-1">Default Locality Radius (km)</label>
              <input
                type="number"
                step="0.1"
                required
                value={defaultRadius}
                onChange={(e) => setDefaultRadius(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28] font-bold"
              />
            </div>

            <label className="flex items-center gap-2 pt-2 cursor-pointer font-bold text-[#302B28]">
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={(e) => setAutoApprove(e.target.checked)}
                className="w-4 h-4 accent-[#D97A5B]"
              />
              <span>Auto-approve new recurring morning subscriptions</span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-[#D97A5B] hover:bg-[#c2694d] text-white font-bold text-xs shadow-xs"
            >
              Save Configuration
            </button>
          </div>
        </form>
      )}

      {/* Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-[#F1E6DC] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-[#302B28]">Immutable Operations Audit Log</h2>
          <div className="divide-y divide-[#F1E6DC]/70 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#302B28]">{log.action}</span>
                  <span className="text-[#D97A5B] ml-2 font-semibold">[{log.target}]</span>
                  <p className="text-[11px] text-[#6B5145] mt-0.5">{log.details}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[#6B5145] block font-mono">{log.timestamp}</span>
                  <span className="text-[10px] text-[#302B28] font-bold">{log.performedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

