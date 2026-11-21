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
import {
  INITIAL_ADMIN_VENDORS,
  INITIAL_ADMIN_CATEGORIES,
  INITIAL_ADMIN_SUPPORT_TICKETS,
  INITIAL_ADMIN_DISPUTES,
  INITIAL_ADMIN_AUDIT_LOGS,
  INITIAL_PLATFORM_CONFIG,
} from '@/data/adminMockData';
import { MOCK_ORDERS } from '@/data/mockData';

interface AdminContextType {
  // Auth
  isAdminLoggedIn: boolean;
  adminUser: { name: string; role: string; email: string };
  loginAdmin: (email: string) => void;
  logoutAdmin: () => void;

  // Vendors (Workflow C: Approved vendors persist to localStorage and become discoverable on the customer marketplace)
  vendors: AdminVendorRecord[];
  updateVendorVerification: (vendorId: string, status: AdminVendorVerificationStatus) => void;
  updateVendorAccountStatus: (vendorId: string, status: AdminVendorAccountStatus) => void;
  getVendorById: (id: string) => AdminVendorRecord | undefined;

  // Orders
  allOrders: Order[];
  updatePlatformOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // Categories (Workflow D: Categories updated by Admin persist and update customer & vendor browsing)
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

  const [vendors, setVendors] = useState<AdminVendorRecord[]>(INITIAL_ADMIN_VENDORS);
  const [categories, setCategories] = useState<AdminCategoryRecord[]>(INITIAL_ADMIN_CATEGORIES);
  const [tickets, setTickets] = useState<AdminSupportTicket[]>(INITIAL_ADMIN_SUPPORT_TICKETS);
  const [disputes, setDisputes] = useState<AdminDispute[]>(INITIAL_ADMIN_DISPUTES);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(INITIAL_ADMIN_AUDIT_LOGS);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(INITIAL_PLATFORM_CONFIG);
  const [allOrders, setAllOrders] = useState<Order[]>(MOCK_ORDERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const syncAdminOrders = useCallback(() => {
    try {
      const customerOrdersRaw = localStorage.getItem('trug_orders');
      if (customerOrdersRaw) setAllOrders(JSON.parse(customerOrdersRaw));
    } catch {
      // ignore
    }
  }, []);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('trug_admin_auth');
      if (savedAuth !== null) setIsAdminLoggedIn(JSON.parse(savedAuth));

      const savedVendors = localStorage.getItem('trug_admin_vendors');
      if (savedVendors) setVendors(JSON.parse(savedVendors));

      const savedCategories = localStorage.getItem('trug_admin_categories');
      if (savedCategories) setCategories(JSON.parse(savedCategories));

      const savedTickets = localStorage.getItem('trug_admin_tickets');
      if (savedTickets) setTickets(JSON.parse(savedTickets));

      const savedDisputes = localStorage.getItem('trug_admin_disputes');
      if (savedDisputes) setDisputes(JSON.parse(savedDisputes));

      const savedConfig = localStorage.getItem('trug_platform_config');
      if (savedConfig) setPlatformConfig(JSON.parse(savedConfig));

      syncAdminOrders();
    } catch {
      // ignore
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'trug_orders') syncAdminOrders();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [syncAdminOrders]);

  // Persist Vendors (Workflow C)
  useEffect(() => {
    try {
      localStorage.setItem('trug_admin_vendors', JSON.stringify(vendors));
    } catch {
      // ignore
    }
  }, [vendors]);

  // Persist Categories (Workflow D)
  useEffect(() => {
    try {
      localStorage.setItem('trug_admin_categories', JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('trug_admin_auth', JSON.stringify(isAdminLoggedIn));
    } catch {
      // ignore
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem('trug_admin_tickets', JSON.stringify(tickets));
    } catch {
      // ignore
    }
  }, [tickets]);

  useEffect(() => {
    try {
      localStorage.setItem('trug_admin_disputes', JSON.stringify(disputes));
    } catch {
      // ignore
    }
  }, [disputes]);

  useEffect(() => {
    try {
      localStorage.setItem('trug_platform_config', JSON.stringify(platformConfig));
    } catch {
      // ignore
    }
  }, [platformConfig]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const loginAdmin = (email: string) => {
    setIsAdminLoggedIn(true);
    showToast(`Signed in as ${adminUser.name}`);
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    showToast('Signed out of Platform Admin');
  };

  const logAuditAction = (action: string, target: string, details: string) => {
    const newLog: AdminAuditLog = {
      id: `audit-${Date.now()}`,
      action,
      performedBy: adminUser.name,
      target,
      timestamp: 'Just now',
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Workflow C: Approving a vendor updates localStorage, enabling discovery on customer website
  const updateVendorVerification = (vendorId: string, status: AdminVendorVerificationStatus) => {
    let targetName = '';
    setVendors((prev) => {
      const next = prev.map((v) => {
        if (v.id === vendorId) {
          targetName = v.businessName;
          return { ...v, verificationStatus: status };
        }
        return v;
      });
      try {
        localStorage.setItem('trug_admin_vendors', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    logAuditAction(`Vendor Verification: ${status}`, targetName || vendorId, `Verification status updated to ${status}.`);
    showToast(`Vendor ${status.toUpperCase()}! Now updated in customer marketplace.`);
  };

  const updateVendorAccountStatus = (vendorId: string, status: AdminVendorAccountStatus) => {
    let targetName = '';
    setVendors((prev) => {
      const next = prev.map((v) => {
        if (v.id === vendorId) {
          targetName = v.businessName;
          return { ...v, accountStatus: status };
        }
        return v;
      });
      try {
        localStorage.setItem('trug_admin_vendors', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    logAuditAction(`Vendor Account: ${status}`, targetName || vendorId, `Store status set to ${status}.`);
    showToast(`Store marked as ${status}`);
  };

  const getVendorById = (id: string) => vendors.find((v) => v.id === id || v.slug === id);

  const updatePlatformOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setAllOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    try {
      const customerOrdersRaw = localStorage.getItem('trug_orders');
      if (customerOrdersRaw) {
        const all: Order[] = JSON.parse(customerOrdersRaw);
        const nextAll = all.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
        localStorage.setItem('trug_orders', JSON.stringify(nextAll));
      }
    } catch {
      // ignore
    }
    logAuditAction(`Order Status Update: ${newStatus}`, `Order #${orderId}`, `Platform admin updated order status.`);
    showToast(`Order status updated to ${newStatus}`);
  };

  // Workflow D: Category updates persist to localStorage
  const addCategory = (cat: Omit<AdminCategoryRecord, 'id' | 'productCount' | 'vendorCount'>) => {
    const newCat: AdminCategoryRecord = {
      ...cat,
      id: `cat-${Date.now()}`,
      productCount: 0,
      vendorCount: 1,
    };

    setCategories((prev) => {
      const next = [...prev, newCat];
      try {
        localStorage.setItem('trug_admin_categories', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    logAuditAction('Category Created', cat.name, 'New product category added to platform catalogue.');
    showToast(`Category "${cat.name}" added and live on customer app!`);
  };

  const updateCategory = (id: string, updated: Partial<AdminCategoryRecord>) => {
    setCategories((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updated } : c));
      try {
        localStorage.setItem('trug_admin_categories', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    logAuditAction('Category Modified', `Category #${id}`, 'Updated category details.');
    showToast('Category updated across platform');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => {
      const next = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem('trug_admin_categories', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    logAuditAction('Category Deleted', `Category #${id}`, 'Removed category.');
    showToast('Category removed');
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, isEnabled: !c.isEnabled } : c));
      try {
        localStorage.setItem('trug_admin_categories', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast('Category visibility toggled');
  };

  const updateTicketStatus = (ticketId: string, status: AdminSupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: 'Just now' } : t))
    );
    logAuditAction(`Support Ticket ${status}`, `Ticket #${ticketId}`, `Status changed to ${status}.`);
    showToast(`Ticket marked as ${status}`);
  };

  const addTicketResponse = (ticketId: string, message: string) => {
    const newMsg = {
      sender: adminUser.name,
      role: 'agent' as const,
      timestamp: 'Just now',
      message,
    };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
            ...t,
            updatedAt: 'Just now',
            conversation: [...t.conversation, newMsg],
          }
          : t
      )
    );
    showToast('Response sent to requester');
  };

  const addInternalNote = (ticketId: string, note: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, internalNotes: note } : t))
    );
    showToast('Internal note saved');
  };

  const assignTicketAgent = (ticketId: string, agent: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, assignedAgent: agent } : t))
    );
    showToast(`Assigned to ${agent}`);
  };

  const processDisputeRefund = (disputeId: string) => {
    let orderNum = '';
    let refundAmount = 0;
    setDisputes((prev) =>
      prev.map((d) => {
        if (d.id === disputeId) {
          orderNum = d.orderNumber;
          refundAmount = d.amount;
          return {
            ...d,
            status: 'Refund Approved',
            refundInitiated: true,
          };
        }
        return d;
      })
    );
    logAuditAction('Refund Processed', `Order #${orderNum}`, `Refund of ₹${refundAmount} initiated via platform escrow.`);
    showToast(`Simulated refund of ₹${refundAmount} approved & credited!`);
  };

  const resolveDispute = (disputeId: string, status: AdminDispute['status']) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status } : d))
    );
    showToast(`Dispute marked as ${status}`);
  };

  const updatePlatformConfig = (updated: Partial<PlatformConfig>) => {
    setPlatformConfig((prev) => ({ ...prev, ...updated }));
    logAuditAction('Platform Settings Updated', 'System Config', 'Global configuration changed.');
    showToast('Platform settings saved');
  };

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
      {/* Global Admin Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#302B28] text-[#FAF5F0] px-4 py-3 rounded-2xl shadow-2xl border border-[#D97A5B]/40 animate-in fade-in slide-in-from-bottom-3 duration-200 text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97A5B] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
