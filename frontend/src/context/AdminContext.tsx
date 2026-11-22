'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AdminVendorRecord,
  AdminCategoryRecord,
  AdminSupportTicket,
  AdminDispute,
  AdminAuditLog,
  PlatformConfig,
  AdminVendorVerificationStatus,
  AdminVendorAccountStatus,
} from '@/types/admin';
import { Order, OrderStatus } from '@/types';

interface AdminContextType {
  // Auth
  isAdminLoggedIn: boolean;
  adminUser: { name: string; role: string; email: string };
  loginAdmin: (email: string) => void;
  logoutAdmin: () => void;

  // Vendors
  vendors: AdminVendorRecord[];
  updateVendorVerification: (vendorId: string, status: AdminVendorVerificationStatus) => void;
  updateVendorAccountStatus: (vendorId: string, status: AdminVendorAccountStatus) => void;
  getVendorById: (id: string) => AdminVendorRecord | undefined;

  // Orders
  allOrders: Order[];
  updatePlatformOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // Categories
  categories: AdminCategoryRecord[];
  addCategory: (cat: Omit<AdminCategoryRecord, 'id' | 'productCount' | 'vendorCount'>) => void;
  updateCategory: (id: string, updated: Partial<AdminCategoryRecord>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryStatus: (id: string) => void;

  // Support Tickets
  tickets: AdminSupportTicket[];
  updateTicketStatus: (ticketId: string, status: AdminSupportTicket['status']) => void;
  addTicketResponse: (ticketId: string, message: string) => void;
  addInternalNote: (ticketId: string, note: string) => void;
  assignTicketAgent: (ticketId: string, agent: string) => void;

  // Disputes & Refunds
  disputes: AdminDispute[];
  processDisputeRefund: (disputeId: string) => void;
  resolveDispute: (disputeId: string, resolution: AdminDispute['status']) => void;

  // Audit Logs & Settings
  auditLogs: AdminAuditLog[];
  platformConfig: PlatformConfig;
  updatePlatformConfig: (updated: Partial<PlatformConfig>) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(true);
  const [adminUser] = useState({
    name: 'Sridhanya Reddy (Ops Lead)',
    role: 'Principal Platform Administrator',
    email: 'admin@trug.focsera.com',
  });

  const [vendors, setVendors] = useState<AdminVendorRecord[]>([]);
  const [categories, setCategories] = useState<AdminCategoryRecord[]>([]);
  const [tickets, setTickets] = useState<AdminSupportTicket[]>([]);
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([
    {
      id: 'log-1',
      action: 'SYSTEM_BOOT',
      target: 'DATABASE',
      performedBy: 'Supabase PostgREST Engine',
      timestamp: new Date().toISOString(),
      details: 'Connected to live partner_profiles and unified_packages tables.',
    },
  ]);

  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>({
    platformName: 'TRUG Platform',
    supportHelpline: '+91 98450 00000',
    supportEmail: 'support@trug.focsera.com',
    defaultDeliveryRadiusKm: 5,
    standardCommissionPercent: 0,
    maintenanceMode: false,
    autoApproveSubscriptions: true,
  });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Fetch live database for Admin
  const fetchAdminLiveDatabase = useCallback(async () => {
    try {
      const res = await fetch('/api/admin-bootstrap');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.vendors && json.data.vendors.length > 0) {
            setVendors(json.data.vendors);
          }
          if (json.data.categories && json.data.categories.length > 0) {
            setCategories(json.data.categories);
          }
          if (json.data.tickets && json.data.tickets.length > 0) {
            setTickets(json.data.tickets);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load admin live data:', e);
    }
  }, []);

  const syncAdminOrders = useCallback(() => {
    try {
      const customerOrdersRaw = localStorage.getItem('trug_orders');
      if (customerOrdersRaw) setAllOrders(JSON.parse(customerOrdersRaw));
    } catch {}
  }, []);

  useEffect(() => {
    fetchAdminLiveDatabase();
    syncAdminOrders();
  }, [fetchAdminLiveDatabase, syncAdminOrders]);

  const loginAdmin = useCallback((email: string) => {
    setIsAdminLoggedIn(true);
    showToast('Admin authenticated successfully');
  }, [showToast]);

  const logoutAdmin = useCallback(() => {
    setIsAdminLoggedIn(false);
    showToast('Signed out from Admin control tower');
  }, [showToast]);

  const updateVendorVerification = useCallback((vendorId: string, status: AdminVendorVerificationStatus) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, verificationStatus: status } : v))
    );
    showToast(`Vendor ${vendorId} status updated to ${status}`);
  }, [showToast]);

  const updateVendorAccountStatus = useCallback((vendorId: string, status: AdminVendorAccountStatus) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, accountStatus: status } : v))
    );
    showToast(`Vendor account updated to ${status}`);
  }, [showToast]);

  const getVendorById = useCallback((id: string) => vendors.find((v) => v.id === id), [vendors]);

  const updatePlatformOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setAllOrders((prev) => {
      const next = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      try {
        localStorage.setItem('trug_orders', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast(`Order ${orderId} updated to ${newStatus}`);
  }, [showToast]);

  const addCategory = useCallback((cat: any) => {
    const newCat = { ...cat, id: `cat-${Date.now()}`, productCount: 0, vendorCount: 0 };
    setCategories((prev) => [newCat, ...prev]);
    showToast(`Category ${cat.name} created`);
  }, [showToast]);

  const updateCategory = useCallback((id: string, updated: any) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    showToast(`Category updated`);
  }, [showToast]);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast(`Category removed`);
  }, [showToast]);

  const toggleCategoryStatus = useCallback((id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEnabled: !c.isEnabled } : c))
    );
  }, []);

  const updateTicketStatus = useCallback((ticketId: string, status: any) => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status } : t)));
    showToast(`Ticket status: ${status}`);
  }, [showToast]);

  const addTicketResponse = useCallback((ticketId: string, message: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              conversation: [
                ...(t.conversation || []),
                { role: 'agent' as const, sender: 'Admin', message, timestamp: new Date().toISOString() },
              ],
            }
          : t
      )
    );
  }, []);

  const addInternalNote = useCallback((ticketId: string, note: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              internalNotes: t.internalNotes ? `${t.internalNotes}\n[${new Date().toLocaleTimeString()}]: ${note}` : note,
            }
          : t
      )
    );
  }, []);

  const assignTicketAgent = useCallback((ticketId: string, agent: string) => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, assignedAgent: agent } : t)));
  }, []);

  const processDisputeRefund = useCallback((disputeId: string) => {
    setDisputes((prev) => prev.map((d) => (d.id === disputeId ? { ...d, status: 'Refund Approved' as const, refundInitiated: true } : d)));
    showToast(`Refund processed for dispute ${disputeId}`);
  }, [showToast]);

  const resolveDispute = useCallback((disputeId: string, resolution: any) => {
    setDisputes((prev) => prev.map((d) => (d.id === disputeId ? { ...d, status: resolution } : d)));
    showToast(`Dispute resolved`);
  }, [showToast]);

  const updatePlatformConfig = useCallback((updated: any) => {
    setPlatformConfig((prev) => ({ ...prev, ...updated }));
    showToast('Platform settings saved');
  }, [showToast]);

  return (
    <AdminContext.Provider
      value={{
        isAdminLoggedIn,
        adminUser,
        loginAdmin,
        logoutAdmin,
        vendors,
        updateVendorVerification,
        updateVendorAccountStatus,
        getVendorById,
        allOrders,
        updatePlatformOrderStatus,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryStatus,
        tickets,
        updateTicketStatus,
        addTicketResponse,
        addInternalNote,
        assignTicketAgent,
        disputes,
        processDisputeRefund,
        resolveDispute,
        auditLogs,
        platformConfig,
        updatePlatformConfig,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
}
