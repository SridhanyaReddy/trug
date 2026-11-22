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
    id: '49bfb3cc-5013-4945-9000-020000000001',
    businessName: 'Orchard Market',
    legalEntityName: 'Orchard Market Retail Pvt Ltd',
    slug: 'trug-sample-orchard-market',
    category: 'Produce & Groceries',
    ownerName: 'Orchard Market Partner',
    email: 'orchard.market@trug.in',
    phone: '+91 93924 49721',
    gstNumber: '36AAAAA0000A1Z5',
    fssaiNumber: '13623011000842',
    address: {
      line1: 'Road No. 36, Jubilee Hills',
      locality: 'Jubilee Hills',
      city: 'Hyderabad',
      pincode: '500033',
    },
    timings: '6:30 AM - 10:00 PM',
    isOpen: true,
    verificationStatus: 'Verified',
    documents: {
      fssaiDoc: 'fssai_cert.pdf',
      gstDoc: 'gstin_reg.pdf',
      storefrontPhoto: 'https://pub-cdf20c31647144a1bc202a2fe4d80867.r2.dev/v1/tomato-d498d2156b91.jpg',
    },
    deliveryRadiusKm: 5,
    minOrderValue: 50,
    deliveryFee: 25,
    currentPlan: 'Hyperlocal Scale',
    planExpiry: '2027-11-20',
  });

  const [products, setProducts] = useState<VendorManagedProduct[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [vendorOrders, setVendorOrders] = useState<Order[]>([]);
  const [recurringSubscriptions, setRecurringSubscriptions] = useState<RecurringOrder[]>([]);
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlotConfig[]>([]);
  const [customers, setCustomers] = useState<VendorCustomer[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: 'st-1', name: 'Orchard Operations Lead', role: 'Store Manager', phone: '+91 93924 49721', status: 'Active', joinedDate: '2026-11-19' },
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Fetch live products & delivery slots for vendor from TRUG DB
  const fetchVendorLiveProducts = useCallback(async () => {
    try {
      const [adminBootstrapRes, bootstrapRes] = await Promise.all([
        fetch('/api/admin-bootstrap'),
        fetch('/api/bootstrap'),
      ]);

      if (adminBootstrapRes.ok) {
        const json = await adminBootstrapRes.json();
        if (json.success && json.data && json.data.products) {
          setProducts(json.data.products);
        }
      }

      if (bootstrapRes.ok) {
        const bJson = await bootstrapRes.json();
        if (bJson.success && bJson.data) {
          if (bJson.data.deliverySlots && bJson.data.deliverySlots.length > 0) {
            setDeliverySlots(
              bJson.data.deliverySlots.map((s: any) => ({
                id: s.id,
                title: `${new Date(s.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(s.ends_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                startTime: new Date(s.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                endTime: new Date(s.ends_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                maxOrdersCapacity: s.capacity || 12,
                currentBookings: s.booked || 0,
                cutOffTime: '30 mins before window',
                isEnabled: s.enabled,
                type: 'delivery' as const,
              }))
            );
          }
          if (bJson.data.orders && bJson.data.orders.length > 0) {
            setVendorOrders(
              bJson.data.orders.map((o: any) => ({
                id: o.id,
                orderNumber: `ORD-${o.order_number || o.id.slice(0, 5)}`,
                vendorId: o.location_id || '49bfb3cc-5013-4945-9000-020000000001',
                vendorName: o.store_name || 'Orchard Market',
                vendorSlug: o.store_slug || 'trug-sample-orchard-market',
                items: (o.items || []).map((it: any, idx: number) => ({
                  id: `it-${idx}`,
                  productId: `prod-${idx}`,
                  productSlug: (it.sku_name || 'item').toLowerCase().replace(/\s+/g, '-'),
                  productName: it.sku_name || 'Item',
                  productImage: 'https://pub-cdf20c31647144a1bc202a2fe4d80867.r2.dev/v1/tomato-d498d2156b91.jpg',
                  variantId: `var-${idx}`,
                  variantName: `${it.pack_size || 1} ${it.unit || 'unit'}`,
                  price: (it.unit_price_paise || 0) / 100,
                  quantity: it.packs || 1,
                  totalPrice: (it.line_total_paise || 0) / 100,
                })),
                subtotal: (o.subtotal_paise || 0) / 100,
                deliveryFee: (o.delivery_fee_paise || 0) / 100,
                total: (o.total_paise || 0) / 100,
                status: o.status === 'delivered' ? 'Delivered' : o.status === 'cancelled' ? 'Cancelled' : 'Placed',
                createdAt: o.created_at,
                deliverySlot: 'Morning Delivery',
                deliveryAddress: {
                  id: 'addr-1',
                  tag: 'Home' as const,
                  name: o.recipient || 'Customer',
                  phone: o.recipient_phone || '+91 93924 49721',
                  addressLine: o.address_line || 'Jubilee Hills',
                  locality: 'Hyderabad',
                  pincode: o.postcode || '500033',
                  isDefault: true,
                },
                timeline: [
                  { status: 'Placed' as const, timestamp: o.created_at, note: 'Order captured in TRUG database' },
                ],
              }))
            );
          }
        }
      }
    } catch (e) {
      console.error('Failed to load vendor live data:', e);
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
