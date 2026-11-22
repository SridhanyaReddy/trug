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

interface VendorContextType {
  // Auth
  isVendorLoggedIn: boolean;
  loginVendor: (emailOrPhone: string) => void;
  logoutVendor: () => void;

  // Profile & Business
  vendorProfile: VendorBusinessProfile;
  updateVendorProfile: (updated: Partial<VendorBusinessProfile>) => void;
  toggleStoreStatus: () => void;

  // Products
  products: VendorManagedProduct[];
  addProduct: (product: Omit<VendorManagedProduct, 'id' | 'slug' | 'vendorId' | 'vendorName' | 'vendorSlug' | 'totalSold' | 'lastUpdated'>) => void;
  updateProduct: (id: string, updated: Partial<VendorManagedProduct>) => void;
  deleteProduct: (id: string) => void;
  setProductStatus: (id: string, status: VendorManagedProduct['status']) => void;

  // Inventory
  inventoryLogs: InventoryLog[];
  updateVariantStock: (productId: string, variantId: string, newStock: number, reason: InventoryLog['reason']) => void;

  // Orders
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
  const [vendorProfile, setVendorProfile] = useState<VendorBusinessProfile>({
    id: 'af6d0f93-b67c-4d4d-8207-d69da0236331',
    businessName: 'Kiran Bose & Team',
    legalEntityName: 'Kiran Bose & Team Pvt Ltd',
    slug: 'kiran-bose-team',
    category: 'Reel Maker',
    ownerName: 'Kiran Bose',
    email: 'kiran.portfolioreel@focsera.com',
    phone: '+91 98400 40008',
    gstNumber: '29ABCDE1234F1Z5',
    fssaiNumber: '21223190000412',
    address: {
      line1: 'Studio 4B, Creators Hub',
      locality: 'Bengaluru Core',
      city: 'Bengaluru',
      pincode: '560038',
    },
    timings: '6:00 AM - 9:00 PM',
    isOpen: true,
    verificationStatus: 'Verified',
    documents: {
      fssaiDoc: 'FSSAI_Certificate.pdf',
      gstDoc: 'GSTIN_Registration.pdf',
      storefrontPhoto: 'https://unpbalwhranarpggvckh.supabase.co/storage/v1/object/public/mobile-catalog/v1/b4d52908c4e6ba40aeee012f1a2895cba23b27c692373e540d797ca7ce824981-960.webp',
    },
    deliveryRadiusKm: 5,
    minOrderValue: 80,
    deliveryFee: 0,
    currentPlan: 'Growth Champion',
    planExpiry: '2027-01-01',
  });

  const [products, setProducts] = useState<VendorManagedProduct[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [vendorOrders, setVendorOrders] = useState<Order[]>([]);
  const [recurringSubscriptions, setRecurringSubscriptions] = useState<RecurringOrder[]>([]);
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlotConfig[]>([
    { id: 'slot-1', title: 'Morning Window', startTime: '06:30', endTime: '08:30', maxOrdersCapacity: 30, currentBookings: 8, cutOffTime: '22:00 previous day', isEnabled: true, type: 'delivery' },
    { id: 'slot-2', title: 'Evening Window', startTime: '17:00', endTime: '19:30', maxOrdersCapacity: 40, currentBookings: 14, cutOffTime: '15:00 same day', isEnabled: true, type: 'delivery' },
  ]);
  const [customers, setCustomers] = useState<VendorCustomer[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: 'st-1', name: 'Kiran Bose', role: 'Store Manager', phone: '+91 98400 40008', status: 'Active', joinedDate: '2025-01-10' },
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Fetch live products for vendor from Supabase
  const fetchVendorLiveProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin-bootstrap');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.products) {
          setProducts(json.data.products);
        }
      }
    } catch (e) {
      console.error('Failed to load vendor products:', e);
    }
  }, []);

  const syncVendorOrders = useCallback(() => {
    try {
      const customerOrdersRaw = localStorage.getItem('trug_orders');
      if (customerOrdersRaw) {
        setVendorOrders(JSON.parse(customerOrdersRaw));
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchVendorLiveProducts();
    syncVendorOrders();
  }, [fetchVendorLiveProducts, syncVendorOrders]);

  const loginVendor = useCallback((emailOrPhone: string) => {
    setIsVendorLoggedIn(true);
    showToast('Merchant logged in');
  }, [showToast]);

  const logoutVendor = useCallback(() => {
    setIsVendorLoggedIn(false);
    showToast('Signed out from Merchant Dashboard');
  }, [showToast]);

  const updateVendorProfile = useCallback((updated: Partial<VendorBusinessProfile>) => {
    setVendorProfile((prev) => ({ ...prev, ...updated }));
    showToast('Profile updated');
  }, [showToast]);

  const toggleStoreStatus = useCallback(() => {
    setVendorProfile((prev) => {
      const next = !prev.isOpen;
      showToast(next ? 'Store is now Open for orders' : 'Store is paused');
      return { ...prev, isOpen: next };
    });
  }, [showToast]);

  const addProduct = useCallback((newP: any) => {
    const created: VendorManagedProduct = {
      ...newP,
      id: `prod-${Date.now()}`,
      slug: newP.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      vendorId: vendorProfile.id,
      vendorName: vendorProfile.businessName,
      vendorSlug: vendorProfile.slug,
      totalSold: 0,
      lastUpdated: new Date().toISOString(),
    };
    setProducts((prev) => [created, ...prev]);
    showToast(`Product ${newP.name} added to live catalogue`);
  }, [vendorProfile, showToast]);

  const updateProduct = useCallback((id: string, updated: any) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated, lastUpdated: new Date().toISOString() } : p)));
    showToast('Product updated');
  }, [showToast]);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed');
  }, [showToast]);

  const setProductStatus = useCallback((id: string, status: any) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    showToast(`Product marked as ${status}`);
  }, [showToast]);

  const updateVariantStock = useCallback((productId: string, variantId: string, newStock: number, reason: any) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              variants: p.variants.map((v) => (v.id === variantId ? { ...v, stockQty: newStock } : v)),
            }
          : p
      )
    );
    showToast(`Stock updated to ${newStock}`);
  }, [showToast]);

  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setVendorOrders((prev) => {
      const next = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      try {
        localStorage.setItem('trug_orders', JSON.stringify(next));
      } catch {}
      return next;
    });
    showToast(`Order marked as ${newStatus}`);
  }, [showToast]);

  const toggleSubscriptionStatus = useCallback((subId: string, newStatus: any) => {
    setRecurringSubscriptions((prev) => prev.map((s) => (s.id === subId ? { ...s, status: newStatus } : s)));
  }, []);

  const addDeliverySlot = useCallback((slot: any) => {
    setDeliverySlots((prev) => [...prev, { ...slot, id: `slot-${Date.now()}`, currentBookings: 0 }]);
  }, []);

  const updateDeliverySlot = useCallback((id: string, updated: any) => {
    setDeliverySlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  }, []);

  const toggleSlotEnabled = useCallback((id: string) => {
    setDeliverySlots((prev) => prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s)));
  }, []);

  const addCustomerNote = useCallback((customerId: string, note: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? { ...c, notes: c.notes ? `${c.notes}\n${note}` : note }
          : c
      )
    );
  }, []);

  const addStaffMember = useCallback((staff: any) => {
    setStaffMembers((prev) => [...prev, { ...staff, id: `st-${Date.now()}` }]);
  }, []);

  const removeStaffMember = useCallback((id: string) => {
    setStaffMembers((prev) => prev.filter((s) => s.id !== id));
  }, []);

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
    </VendorContext.Provider>
  );
}

export function useVendor() {
  const context = useContext(VendorContext);
  if (!context) throw new Error('useVendor must be used within a VendorProvider');
  return context;
}
