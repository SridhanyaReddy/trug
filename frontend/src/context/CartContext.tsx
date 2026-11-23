'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Vendor,
  Product,
  ProductVariant,
  CartItem,
  Order,
  RecurringOrder,
  CustomerProfile,
} from '@/types';

interface SharedAppContextType {
  // Location
  currentLocality: string;
  setLocality: (loc: string) => void;
  availableLocalities: string[];

  // Vendors & Discovery
  vendors: Vendor[];
  refreshVendorsFromAdmin: () => void;
  getVendorById: (id: string) => Vendor | undefined;
  getVendorBySlug: (slug: string) => Vendor | undefined;

  // Products
  products: Product[];
  refreshProductsFromVendor: () => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByVendor: (vendorId: string) => Product[];
  getProductsByCategory: (category: string) => Product[];

  // Categories
  categories: any[];
  refreshCategoriesFromAdmin: () => void;

  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCartForVendor: (vendorId: string) => void;
  clearEntireCart: () => void;
  totalCartItemCount: number;
  vendorCarts: Record<string, {
    vendor: Vendor;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    isMinOrderMet: boolean;
  }>;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'timeline'>) => Order;
  cancelOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  refreshOrders: () => void;

  // Recurring Orders / Subscriptions
  recurringOrders: RecurringOrder[];
  addRecurringOrder: (sub: Omit<RecurringOrder, 'id' | 'subscriptionNumber' | 'status'>) => void;
  toggleRecurringOrderStatus: (id: string, newStatus: 'active' | 'paused' | 'cancelled') => void;

  // Customer Profile
  isLoggedIn: boolean;
  user: CustomerProfile;
  login: (phoneOrEmail: string, customData?: Partial<CustomerProfile>) => void;
  logout: () => void;
  updateProfile: (updated: Partial<CustomerProfile>) => void;
  addAddress: (address: CustomerProfile['addresses'][0]) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Loading state
  isLoadingDatabase: boolean;

  // Global Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<SharedAppContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [currentLocality, setCurrentLocality] = useState<string>('Jubilee Hills, Hyderabad');
  const [availableLocalities, setAvailableLocalities] = useState<string[]>([
    'Jubilee Hills, Hyderabad',
    'Road No. 36, Jubilee Hills',
    'Banjara Hills Road No. 12',
    'Road No. 10, Banjara Hills',
    'Madhapur Metro Corridor',
  ]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recurringOrders, setRecurringOrders] = useState<RecurringOrder[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoadingDatabase, setIsLoadingDatabase] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [user, setUser] = useState<CustomerProfile>({
    id: 'usr-default',
    name: 'Customer Account',
    phone: '+91 93924 49721',
    email: 'customer@trug.in',
    addresses: [
      {
        id: 'addr-1',
        tag: 'Home',
        name: 'Primary Address',
        phone: '+91 93924 49721',
        addressLine: 'Road No. 36, Jubilee Hills',
        locality: 'Jubilee Hills, Hyderabad',
        isDefault: true,
      },
    ],
    notificationPreferences: {
      orderUpdatesSms: true,
      orderUpdatesWhatsapp: true,
      promotionalOffers: false,
      recurringOrderReminders: true,
    },
  });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  const fetchLiveDatabase = useCallback(async () => {
    try {
      setIsLoadingDatabase(true);
      const res = await fetch('/api/bootstrap');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.vendors && json.data.vendors.length > 0) {
            setVendors(json.data.vendors);
          }
          if (json.data.products && json.data.products.length > 0) {
            setProducts(json.data.products);
          }
          if (json.data.categories && json.data.categories.length > 0) {
            setCategories(json.data.categories);
          }
          if (json.data.orders && json.data.orders.length > 0) {
            const mappedOrders: Order[] = json.data.orders.map((o: any) => ({
              id: o.id,
              orderNumber: `TRUG-${o.order_number || o.id.slice(0, 5)}`,
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
            }));
            setOrders(mappedOrders);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load database bootstrap:', e);
    } finally {
      setIsLoadingDatabase(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveDatabase();

    try {
      const savedCart = localStorage.getItem('trug_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedLocality = localStorage.getItem('trug_locality');
      if (savedLocality && savedLocality !== 'Bengaluru Core') setCurrentLocality(savedLocality);

      // Hydrate user session from localStorage so refresh preserves logged-in user
      const savedSession = localStorage.getItem('trug_user_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed.phone) {
          setIsLoggedIn(true);
          setUser((prev) => ({
            ...prev,
            phone: parsed.phone,
            ...(parsed.name ? { name: parsed.name } : {}),
            ...(parsed.email ? { email: parsed.email } : {}),
            ...(parsed.id ? { id: parsed.id } : {}),
          }));

          // Background re-fetch live profile from database to ensure fresh data
          fetch(`/api/customer?phone=${encodeURIComponent(parsed.phone)}`)
            .then((r) => r.json())
            .then((res) => {
              if (res.success && res.profile) {
                setUser((prev) => ({
                  ...prev,
                  id: res.profile.userId || prev.id,
                  name: res.profile.name || prev.name,
                  email: res.profile.email || prev.email,
                  addresses: res.profile.addresses && res.profile.addresses.length > 0 ? res.profile.addresses.map((a: any) => ({
                    id: a.id,
                    tag: a.label || 'Home',
                    name: a.recipient || res.profile.name,
                    phone: a.phone,
                    addressLine: a.address_line,
                    locality: a.locality,
                    pincode: a.postcode,
                    isDefault: a.is_default,
                  })) : prev.addresses,
                }));
              }
            })
            .catch(() => {});
        }
      }
    } catch {
      // ignore
    }
  }, [fetchLiveDatabase]);

  // Vendor Lookup
  const getVendorById = useCallback(
    (id: string) => vendors.find((v) => v.id === id),
    [vendors]
  );

  const getVendorBySlug = useCallback(
    (slug: string) => vendors.find((v) => v.slug === slug),
    [vendors]
  );

  // Product Lookup
  const getProductBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const getProductsByVendor = useCallback(
    (vendorId: string) => products.filter((p) => p.vendorId === vendorId),
    [products]
  );

  const getProductsByCategory = useCallback(
    (category: string) =>
      products.filter(
        (p) =>
          p.category.toLowerCase().includes(category.toLowerCase()) ||
          p.subCategory?.toLowerCase().includes(category.toLowerCase())
      ),
    [products]
  );

  // Cart operations
  const addToCart = useCallback(
    (product: Product, variant: ProductVariant, quantity = 1) => {
      setCartItems((prev) => {
        const vendor = vendors.find((v) => v.id === product.vendorId) || {
          id: product.vendorId,
          name: product.vendorName || 'Verified Merchant',
          slug: product.vendorSlug || product.vendorId,
        };

        const existingIdx = prev.findIndex(
          (item) => item.product.id === product.id && item.variant.id === variant.id
        );

        let nextCart: CartItem[];
        if (existingIdx >= 0) {
          nextCart = [...prev];
          nextCart[existingIdx] = {
            ...nextCart[existingIdx],
            quantity: nextCart[existingIdx].quantity + quantity,
          };
        } else {
          const newItem: CartItem = {
            cartItemId: `${product.id}-${variant.id}`,
            product,
            variant,
            quantity,
            vendorId: product.vendorId,
            vendorName: vendor.name,
            vendorSlug: vendor.slug,
            deliveryFee: 0,
            freeDeliveryThreshold: 500,
          };
          nextCart = [...prev, newItem];
        }

        try {
          localStorage.setItem('trug_cart', JSON.stringify(nextCart));
        } catch {}
        return nextCart;
      });

      showToast(`Added ${product.name} to cart`);
    },
    [vendors, showToast]
  );

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems((prev) => {
      const nextCart = prev.filter((item) => item.cartItemId !== cartItemId);
      try {
        localStorage.setItem('trug_cart', JSON.stringify(nextCart));
      } catch {}
      return nextCart;
    });
  }, []);

  const updateQuantity = useCallback(
    (cartItemId: string, newQty: number) => {
      if (newQty <= 0) {
        removeFromCart(cartItemId);
        return;
      }
      setCartItems((prev) => {
        const nextCart = prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
        );
        try {
          localStorage.setItem('trug_cart', JSON.stringify(nextCart));
        } catch {}
        return nextCart;
      });
    },
    [removeFromCart]
  );

  const clearCartForVendor = useCallback((vendorId: string) => {
    setCartItems((prev) => {
      const nextCart = prev.filter((item) => item.vendorId !== vendorId);
      try {
        localStorage.setItem('trug_cart', JSON.stringify(nextCart));
      } catch {}
      return nextCart;
    });
  }, []);

  const clearEntireCart = useCallback(() => {
    setCartItems([]);
    try {
      localStorage.removeItem('trug_cart');
    } catch {}
  }, []);

  const totalCartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Group items by vendor
  const vendorCarts = cartItems.reduce((acc, item) => {
    const vId = item.vendorId;
    if (!acc[vId]) {
      const currentVendor = vendors.find((v) => v.id === vId) || {
        id: vId,
        slug: vId,
        name: item.vendorName,
        category: 'Merchant',
        rating: 4.9,
        reviewsCount: 100,
        deliveryTime: '20-30 min',
        distance: '0.8 km',
        minimumOrder: 100,
        deliveryFee: 0,
        isOpen: true,
        timings: '9:00 AM - 9:00 PM',
        address: { line1: '', locality: 'Bengaluru', city: 'Bengaluru', pincode: '560038' },
        phone: '',
        coverImage: '',
        logo: '',
        featuredBadges: [],
        qrCodeUrl: '',
        categories: [],
      };

      acc[vId] = {
        vendor: currentVendor,
        items: [],
        subtotal: 0,
        deliveryFee: currentVendor.deliveryFee || 0,
        total: 0,
        isMinOrderMet: false,
      };
    }

    acc[vId].items.push(item);
    acc[vId].subtotal += item.variant.price * item.quantity;
    acc[vId].total = acc[vId].subtotal + acc[vId].deliveryFee;
    acc[vId].isMinOrderMet = acc[vId].subtotal >= acc[vId].vendor.minimumOrder;

    return acc;
  }, {} as Record<string, any>);

  // Orders
  const placeOrder = useCallback(
    (orderData: any) => {
      const newOrder: Order = {
        id: `TRG-${Math.floor(100000 + Math.random() * 900000)}`,
        orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
        status: 'Placed',
        createdAt: new Date().toISOString(),
        timeline: [{ status: 'Placed', timestamp: new Date().toISOString(), note: 'Order submitted to database' }],
        ...orderData,
      };

      setOrders((prev) => {
        const next = [newOrder, ...prev];
        try {
          localStorage.setItem('trug_orders', JSON.stringify(next));
        } catch {}
        return next;
      });

      clearCartForVendor(orderData.vendorId);
      return newOrder;
    },
    [clearCartForVendor]
  );

  const cancelOrder = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' as const } : o))
    );
  }, []);

  const getOrderById = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  // Profile actions
  const login = useCallback((phoneOrEmail: string, customData?: Partial<CustomerProfile>) => {
    setIsLoggedIn(true);
    setUser((prev) => ({
      ...prev,
      phone: phoneOrEmail,
      ...(customData?.name ? { name: customData.name } : {}),
      ...(customData?.email ? { email: customData.email } : {}),
      ...(customData?.id ? { id: customData.id } : {}),
    }));
    try {
      localStorage.setItem('trug_user_session', JSON.stringify({ phone: phoneOrEmail, ...customData }));
    } catch {}
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('trug_user_session');
    } catch {}
  }, []);

  const updateProfile = useCallback((updated: Partial<CustomerProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  }, []);

  const addAddress = useCallback((address: any) => {
    setUser((prev) => ({ ...prev, addresses: [...prev.addresses, address] }));
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setUser((prev) => ({ ...prev, addresses: prev.addresses.filter((a) => a.id !== id) }));
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setUser((prev) => ({
      ...prev,
      defaultAddressId: id,
      addresses: prev.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
    }));
  }, []);

  const addRecurringOrder = useCallback((sub: any) => {
    const newSub = { ...sub, id: `SUB-${Date.now()}`, subscriptionNumber: `REC-${Date.now()}`, status: 'active' };
    setRecurringOrders((prev) => [...prev, newSub]);
  }, []);

  const toggleRecurringOrderStatus = useCallback((id: string, newStatus: any) => {
    setRecurringOrders((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
  }, []);

  return (
    <CartContext.Provider
      value={{
        currentLocality,
        setLocality: setCurrentLocality,
        availableLocalities,
        vendors,
        refreshVendorsFromAdmin: fetchLiveDatabase,
        getVendorById,
        getVendorBySlug,
        products,
        refreshProductsFromVendor: fetchLiveDatabase,
        getProductBySlug,
        getProductsByVendor,
        getProductsByCategory,
        categories,
        refreshCategoriesFromAdmin: fetchLiveDatabase,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCartForVendor,
        clearEntireCart,
        totalCartItemCount,
        vendorCarts,
        orders,
        placeOrder,
        cancelOrder,
        getOrderById,
        refreshOrders: fetchLiveDatabase,
        recurringOrders,
        addRecurringOrder,
        toggleRecurringOrderStatus,
        isLoggedIn,
        user,
        login,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        isLoadingDatabase,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
