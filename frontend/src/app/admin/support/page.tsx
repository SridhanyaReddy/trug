'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { AdminSupportTicket } from '@/types/admin';
import {
  HelpCircle,
  Search,
  MessageSquare,
  CheckCircle2,
  Clock,
  User,
  Send,
  Eye,
  X,
  AlertTriangle,
} from 'lucide-react';

export default function AdminSupportPage() {
  const {
    tickets,
    updateTicketStatus,
    addTicketResponse,
    addInternalNote,
    assignTicketAgent,
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState<AdminSupportTicket | null>(null);

  const [replyMessage, setReplyMessage] = useState('');
  const [internalNoteInput, setInternalNoteInput] = useState('');

  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.requesterName.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    addTicketResponse(selectedTicket.id, replyMessage.trim());
    setSelectedTicket((prev) =>
      prev
        ? {
            ...prev,
            conversation: [
              ...prev.conversation,
              {
                sender: 'Support Operator',
                role: 'agent',
                timestamp: 'Just now',
                message: replyMessage.trim(),
              },
            ],
          }
        : null
    );
    setReplyMessage('');
  };

  const handleSaveInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    addInternalNote(selectedTicket.id, internalNoteInput.trim());
    setSelectedTicket((prev) => (prev ? { ...prev, internalNotes: internalNoteInput.trim() } : null));
    setInternalNoteInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#302B28] tracking-tight">
          Helpdesk & Incident Management
        </h1>
        <p className="text-xs text-[#6B5145] mt-0.5">
          Triage customer inquiries, delivery delays, packaging complaints, and vendor support communications.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#F1E6DC] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket ID, requester name..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF5F0] text-xs font-medium text-[#302B28] rounded-xl border border-[#F1E6DC] focus:outline-none focus:border-[#D97A5B]"
          />
          <Search className="w-4 h-4 text-[#6B5145] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#FAF5F0] border border-[#F1E6DC] rounded-xl px-3 py-2 text-xs font-semibold text-[#302B28] focus:outline-none focus:border-[#D97A5B]"
        >
          <option value="All">All Ticket States</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-3xl border border-[#F1E6DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF5F0] border-b border-[#F1E6DC] text-[#6B5145] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Requester</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Assigned Agent</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1E6DC]/70">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-[#FAF5F0]/40 transition">
                  <td className="py-4 px-4 font-mono font-bold text-[#302B28]">
                    {t.ticketNumber}
                    <span className="text-[10px] text-[#6B5145] block font-sans font-normal">{t.createdAt}</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-[#302B28] block">{t.requesterName}</span>
                    <span className="text-[11px] text-[#6B5145]">{t.requesterType} • {t.requesterContact}</span>
                  </td>

                  <td className="py-4 px-4 font-semibold text-[#302B28]">
                    {t.issueCategory}
                    {t.relatedOrderId && <span className="block text-[10px] text-[#D97A5B]">Ref: {t.relatedOrderId}</span>}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        t.priority === 'High' || t.priority === 'Urgent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-[#6B5145]">
                    {t.assignedAgent}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedTicket(t);
                        setInternalNoteInput(t.internalNotes || '');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF5F0] hover:bg-[#F1E6DC] text-[#302B28] font-bold text-xs border border-[#F1E6DC] transition"
                    >
                      Open Case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Detailed Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#F1E6DC] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#F1E6DC]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97A5B]">
                  Incident Ticket #{selectedTicket.ticketNumber}
                </span>
                <h3 className="font-extrabold text-xl text-[#302B28]">
                  {selectedTicket.issueCategory}
                </h3>
                <p className="text-xs text-[#6B5145]">
                  Requester: {selectedTicket.requesterName} ({selectedTicket.requesterType}) • {selectedTicket.requesterContact}
                </p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 text-[#6B5145]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Timeline */}
            <div className="space-y-3 bg-[#FAF5F0] p-4 rounded-2xl border border-[#F1E6DC] max-h-60 overflow-y-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#302B28] block">
                Conversation History
              </span>
              {selectedTicket.conversation.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl text-xs space-y-0.5 ${
                    msg.role === 'agent'
                      ? 'bg-white border border-[#F1E6DC] ml-4'
                      : 'bg-[#F1E6DC] text-[#302B28] mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <span>{msg.sender} ({msg.role.toUpperCase()})</span>
                    <span className="text-[#6B5145] font-normal">{msg.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-2">
              <label className="block text-xs font-bold text-[#302B28]">Send Response</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type official support message to requester..."
                  className="w-full text-xs p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#D97A5B] hover:bg-[#c2694d] text-white font-bold text-xs transition shrink-0 flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </form>

            {/* Internal Operator Notes */}
            <form onSubmit={handleSaveInternalNote} className="space-y-2 pt-2 border-t border-[#F1E6DC]">
              <label className="block text-xs font-bold text-[#302B28]">Private Internal Operations Note</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={internalNoteInput}
                  onChange={(e) => setInternalNoteInput(e.target.value)}
                  placeholder="Notes visible only to platform admin staff..."
                  className="w-full text-xs p-2.5 rounded-xl border border-[#F1E6DC] bg-[#FAF5F0] text-[#302B28]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#302B28] text-white font-bold text-xs shrink-0"
                >
                  Save Note
                </button>
              </div>
            </form>

            {/* Resolution actions */}
            <div className="pt-3 border-t border-[#F1E6DC] flex items-center justify-between">
              <span className="text-xs text-[#6B5145]">
                Status: <strong className="text-[#302B28]">{selectedTicket.status}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateTicketStatus(selectedTicket.id, 'In Progress');
                    setSelectedTicket((prev) => (prev ? { ...prev, status: 'In Progress' } : null));
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF5F0] border border-[#F1E6DC]"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => {
                    updateTicketStatus(selectedTicket.id, 'Resolved');
                    setSelectedTicket(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 shadow-xs"
                >
                  Resolve Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

