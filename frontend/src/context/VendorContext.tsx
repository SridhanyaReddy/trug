'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  VendorManagedProduct,
  DeliverySlotConfig,
  VendorCustomer,
  StaffMember,
  VendorBusinessProfile,
  InventoryLog,
} from '@/types/vendor';
import { Order, OrderStatus, RecurringOrder } from '@/types';
import {
  INITIAL_VENDOR_PROFILE,
  INITIAL_VENDOR_PRODUCTS,
  INITIAL_INVENTORY_LOGS,
  INITIAL_DELIVERY_SLOTS,
  INITIAL_VENDOR_CUSTOMERS,
  INITIAL_STAFF_MEMBERS,
} from '@/data/vendorMockData';
import { MOCK_ORDERS, MOCK_RECURRING_ORDERS } from '@/data/mockData';

interface VendorContextType {
  // Auth
  isVendorLoggedIn: boolean;
  loginVendor: (emailOrPhone: string) => void;
  logoutVendor: () => void;

  // Profile & Business
  vendorProfile: VendorBusinessProfile;
  updateVendorProfile: (updated: Partial<VendorBusinessProfile>) => void;
  toggleStoreStatus: () => void;

  // Products (Workflow A: Added/updated products persist to localStorage and sync to customer storefront)
  products: VendorManagedProduct[];
  addProduct: (product: Omit<VendorManagedProduct, 'id' | 'slug' | 'vendorId' | 'vendorName' | 'vendorSlug' | 'totalSold' | 'lastUpdated'>) => void;
  updateProduct: (id: string, updated: Partial<VendorManagedProduct>) => void;
  deleteProduct: (id: string) => void;
  setProductStatus: (id: string, status: VendorManagedProduct['status']) => void;

  // Inventory
  inventoryLogs: InventoryLog[];
  updateVariantStock: (productId: string, variantId: string, newStock: number, reason: InventoryLog['reason']) => void;

  // Orders (Workflow B: Syncs with customer orders placed in checkout)
  vendorOrders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  refreshVendorOrders: () => void;

  // Recurring Orders / Subscriptions
  recurringSubscriptions: RecurringOrder[];
  toggleSubscriptionStatus: (subId: string, newStatus: 'active' | 'paused' | 'cancelled') => void;

  // Delivery Slots
  deliverySlots: DeliverySlotConfig[];
  addDeliverySlot: (slot: Omit<DeliverySlotConfig, 'id' | 'currentBookings'>) => void;
  updateDeliverySlot: (id: string, updated: Partial<DeliverySlotConfig>) => void;
  toggleSlotEnabled: (id: string) => void;

  // Customers
  customers: VendorCustomer[];
  addCustomerNote: (customerId: string, note: string) => void;

  // Staff
  staffMembers: StaffMember[];
  addStaffMember: (staff: Omit<StaffMember, 'id' | 'joinedDate'>) => void;
  removeStaffMember: (id: string) => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const VendorContext = createContext<VendorContextType | null>(null);

export function VendorProvider({ children }: { children: React.ReactNode }) {
  const [isVendorLoggedIn, setIsVendorLoggedIn] = useState<boolean>(true);
  const [vendorProfile, setVendorProfile] = useState<VendorBusinessProfile>(INITIAL_VENDOR_PROFILE);
  const [products, setProducts] = useState<VendorManagedProduct[]>(INITIAL_VENDOR_PRODUCTS);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(INITIAL_INVENTORY_LOGS);
  const [vendorOrders, setVendorOrders] = useState<Order[]>([]);
  const [recurringSubscriptions, setRecurringSubscriptions] = useState<RecurringOrder[]>([]);
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlotConfig[]>(INITIAL_DELIVERY_SLOTS);
  const [customers, setCustomers] = useState<VendorCustomer[]>(INITIAL_VENDOR_CUSTOMERS);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(INITIAL_STAFF_MEMBERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const syncVendorOrders = useCallback(() => {
    try {
      const customerOrdersRaw = localStorage.getItem('trug_orders');
      const allOrders: Order[] = customerOrdersRaw ? JSON.parse(customerOrdersRaw) : MOCK_ORDERS;
      // Filter for this store or show all if demo
      const relevant = allOrders.filter(
        (o) => o.vendorId === 'v-krishna-dairy' || o.vendorSlug === 'krishna-dairy-farm'
      );
      setVendorOrders(relevant.length > 0 ? relevant : allOrders);
    } catch {
      // ignore
    }
  }, []);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('trug_vendor_auth');
      if (savedAuth !== null) setIsVendorLoggedIn(JSON.parse(savedAuth));

      const savedProfile = localStorage.getItem('trug_vendor_profile');
      if (savedProfile) setVendorProfile(JSON.parse(savedProfile));

      const savedProducts = localStorage.getItem('trug_vendor_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedSlots = localStorage.getItem('trug_vendor_slots');
      if (savedSlots) setDeliverySlots(JSON.parse(savedSlots));

      syncVendorOrders();

      const customerSubsRaw = localStorage.getItem('trug_recurring_orders');
      const allSubs: RecurringOrder[] = customerSubsRaw ? JSON.parse(customerSubsRaw) : MOCK_RECURRING_ORDERS;
      setRecurringSubscriptions(allSubs.filter((s) => s.vendorId === 'v-krishna-dairy'));
    } catch {
      // ignore
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'trug_orders') syncVendorOrders();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [syncVendorOrders]);

  // Persist Products to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('trug_vendor_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  // Persist Profile & Slots
  useEffect(() => {
    try {
      localStorage.setItem('trug_vendor_profile', JSON.stringify(vendorProfile));
    } catch {
      // ignore
    }
  }, [vendorProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('trug_vendor_slots', JSON.stringify(deliverySlots));
    } catch {
      // ignore
    }
  }, [deliverySlots]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const loginVendor = (id: string) => {
    setIsVendorLoggedIn(true);
    showToast(`Signed in to ${vendorProfile.businessName}`);
  };

  const logoutVendor = () => {
    setIsVendorLoggedIn(false);
    showToast('Signed out of Vendor Portal');
  };

  const updateVendorProfile = (updated: Partial<VendorBusinessProfile>) => {
    setVendorProfile((prev) => ({ ...prev, ...updated }));
    showToast('Store settings updated');
  };

  const toggleStoreStatus = () => {
    setVendorProfile((prev) => {
      const nextOpen = !prev.isOpen;
      showToast(`Store is now ${nextOpen ? 'OPEN for online orders' : 'TEMPORARILY CLOSED'}`);
      return { ...prev, isOpen: nextOpen };
    });
  };

  // Workflow A: Creating a product saves to localStorage for immediate customer visibility
  const addProduct = (p: Omit<VendorManagedProduct, 'id' | 'slug' | 'vendorId' | 'vendorName' | 'vendorSlug' | 'totalSold' | 'lastUpdated'>) => {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct: VendorManagedProduct = {
      ...p,
      id: `prod-${Date.now()}`,
      slug,
      vendorId: vendorProfile.id,
      vendorName: vendorProfile.businessName,
      vendorSlug: vendorProfile.slug,
      totalSold: 0,
      lastUpdated: 'Just now',
    };

    setProducts((prev) => {
      const next = [newProduct, ...prev];
      try {
        localStorage.setItem('trug_vendor_products', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    showToast(`Added "${newProduct.name}" to store catalogue!`);
  };

  const updateProduct = (id: string, updated: Partial<VendorManagedProduct>) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updated, lastUpdated: 'Just now' } : p));
      try {
        localStorage.setItem('trug_vendor_products', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast('Product updated successfully');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('trug_vendor_products', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast('Product removed from store');
  };

  const setProductStatus = (id: string, status: VendorManagedProduct['status']) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, status, lastUpdated: 'Just now' } : p));
      try {
        localStorage.setItem('trug_vendor_products', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast(`Product set to ${status.toUpperCase()}`);
  };

  const updateVariantStock = (productId: string, variantId: string, newStock: number, reason: InventoryLog['reason']) => {
    let changedProductName = '';
    let changedVariantName = '';
    let oldStock = 0;

    setProducts((prev) => {
      const next = prev.map((p) => {
        if (p.id !== productId) return p;
        changedProductName = p.name;
        return {
          ...p,
          variants: p.variants.map((v) => {
            if (v.id !== variantId) return v;
            changedVariantName = v.name;
            oldStock = v.stockQty;
            return {
              ...v,
              stockQty: newStock,
              inStock: newStock > 0,
            };
          }),
        };
      });
      try {
        localStorage.setItem('trug_vendor_products', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    const log: InventoryLog = {
      id: `log-${Date.now()}`,
      productId,
      productName: changedProductName || 'Product',
      variantName: changedVariantName || 'Variant',
      change: newStock - oldStock,
      reason,
      timestamp: 'Just now',
      newStock,
    };

    setInventoryLogs((prev) => [log, ...prev]);
    showToast(`Updated stock to ${newStock} units`);
  };

  // Workflow B: Updating order status updates both vendor state and global customer storage
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setVendorOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedTimeline = order.timeline.map((step) => {
          if (step.status === newStatus) {
            return { ...step, completed: true, current: true, timestamp: now };
          }
          if (step.current) {
            return { ...step, current: false };
          }
          return step;
        });

        return {
          ...order,
          status: newStatus,
          timeline: updatedTimeline,
        };
      })
    );

    // Sync to global customer storage so tracking screen reflects the update
    try {
      const customerOrdersRaw = localStorage.getItem('trug_orders');
      if (customerOrdersRaw) {
        const all: Order[] = JSON.parse(customerOrdersRaw);
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const nextAll = all.map((o) => {
          if (o.id !== orderId) return o;
          const updatedTimeline = o.timeline.map((step) => {
            if (step.status === newStatus) {
              return { ...step, completed: true, current: true, timestamp: now };
            }
            if (step.current) {
              return { ...step, current: false };
            }
            return step;
          });
          return { ...o, status: newStatus, timeline: updatedTimeline };
        });
        localStorage.setItem('trug_orders', JSON.stringify(nextAll));
      }
    } catch {
      // ignore
    }

    showToast(`Order marked as ${newStatus}`);
  };

  const toggleSubscriptionStatus = (subId: string, newStatus: 'active' | 'paused' | 'cancelled') => {
    setRecurringSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: newStatus } : s))
    );
    showToast(`Subscription status changed to ${newStatus}`);
  };

  const addDeliverySlot = (slot: Omit<DeliverySlotConfig, 'id' | 'currentBookings'>) => {
    const newSlot: DeliverySlotConfig = {
      ...slot,
      id: `slot-${Date.now()}`,
      currentBookings: 0,
    };
    setDeliverySlots((prev) => [...prev, newSlot]);
    showToast(`Slot "${slot.title}" created!`);
  };

  const updateDeliverySlot = (id: string, updated: Partial<DeliverySlotConfig>) => {
    setDeliverySlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    showToast('Delivery slot modified');
  };

  const toggleSlotEnabled = (id: string) => {
    setDeliverySlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
    showToast('Slot status toggled');
  };

  const addCustomerNote = (customerId: string, note: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, notes: note } : c))
    );
    showToast('Customer notes saved');
  };

  const addStaffMember = (staff: Omit<StaffMember, 'id' | 'joinedDate'>) => {
    const newStaff: StaffMember = {
      ...staff,
      id: `staff-${Date.now()}`,
      joinedDate: 'Nov 2026',
    };
    setStaffMembers((prev) => [...prev, newStaff]);
    showToast(`Added staff member ${staff.name}`);
  };

  const removeStaffMember = (id: string) => {
    setStaffMembers((prev) => prev.filter((s) => s.id !== id));
    showToast('Staff member removed');
  };

  return (
    <VendorContext.Provider
      value={{
        isVendorLoggedIn,
        loginVendor,
        logoutVendor,
        vendorProfile,
        updateVendorProfile,
        toggleStoreStatus,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        setProductStatus,
        inventoryLogs,
        updateVariantStock,
        vendorOrders,
        updateOrderStatus,
        refreshVendorOrders: syncVendorOrders,
        recurringSubscriptions,
        toggleSubscriptionStatus,
        deliverySlots,
        addDeliverySlot,
        updateDeliverySlot,
        toggleSlotEnabled,
        customers,
        addCustomerNote,
        staffMembers,
        addStaffMember,
        removeStaffMember,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {/* Global Vendor Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#302B28] text-[#FAF5F0] px-4 py-3 rounded-2xl shadow-2xl border border-[#D97A5B]/30 animate-in fade-in slide-in-from-bottom-3 duration-200 text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97A5B] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </VendorContext.Provider>
  );
}

export function useVendor() {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
}
