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
import {
  MOCK_VENDORS,
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_RECURRING_ORDERS,
  MOCK_CUSTOMER,
  MOCK_LOCALITIES,
} from '@/data/mockData';
import { INITIAL_ADMIN_VENDORS, INITIAL_ADMIN_CATEGORIES } from '@/data/adminMockData';

interface SharedAppContextType {
  // Location
  currentLocality: string;
  setLocality: (loc: string) => void;
  availableLocalities: string[];

  // Vendors & Discovery
  vendors: Vendor[];
  allAdminVendors: typeof INITIAL_ADMIN_VENDORS;
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
  categories: typeof INITIAL_ADMIN_CATEGORIES;
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

  // Customer Profile & Mock Auth
  isLoggedIn: boolean;
  user: CustomerProfile;
  login: (phoneOrEmail: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<CustomerProfile>) => void;
  addAddress: (address: CustomerProfile['addresses'][0]) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Global Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<SharedAppContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [currentLocality, setCurrentLocality] = useState<string>(MOCK_LOCALITIES[0]);
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_ADMIN_CATEGORIES);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [recurringOrders, setRecurringOrders] = useState<RecurringOrder[]>(MOCK_RECURRING_ORDERS);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [user, setUser] = useState<CustomerProfile>(MOCK_CUSTOMER);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync Products from Vendor Storage if vendor published new ones
  const syncProducts = useCallback(() => {
    try {
      const vendorProdsRaw = localStorage.getItem('trug_vendor_products');
      if (vendorProdsRaw) {
        const vendorProds = JSON.parse(vendorProdsRaw);
        // Only published ones appear on customer side
        const published = vendorProds
          .filter((p: any) => p.status === 'published')
          .map((p: any) => ({
            id: p.id,
            slug: p.slug,
            vendorId: p.vendorId,
            vendorName: p.vendorName,
            vendorSlug: p.vendorSlug,
            name: p.name,
            shortDescription: p.shortDescription,
            description: p.description,
            category: p.category,
            subCategory: p.subCategory,
            image: p.image,
            variants: p.variants.map((v: any) => ({
              id: v.id,
              name: v.name,
              price: v.price,
              originalPrice: v.originalPrice,
              inStock: v.stockQty > 0,
            })),
            defaultVariantId: p.variants[0]?.id || 'v-1',
            isPopular: p.isPopular,
            isOrganic: p.isOrganic,
            badge: p.badge,
            rating: p.rating || 4.9,
          }));

        // Merge with non-conflicting default mock products
        const merged = [...published];
        MOCK_PRODUCTS.forEach((mp) => {
          if (!merged.some((p) => p.id === mp.id || p.slug === mp.slug)) {
            merged.push(mp);
          }
        });
        setProducts(merged);
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync Vendors from Admin Storage (e.g. newly approved vendors become visible)
  const syncVendors = useCallback(() => {
    try {
      const adminVendorsRaw = localStorage.getItem('trug_admin_vendors');
      if (adminVendorsRaw) {
        const adminVendors = JSON.parse(adminVendorsRaw);
        // Show only verified and active vendors on customer marketplace
        const activeVerified = adminVendors
          .filter((av: any) => av.verificationStatus === 'Verified' && av.accountStatus === 'Active')
          .map((av: any) => {
            const existing = MOCK_VENDORS.find((mv) => mv.id === av.id);
            return existing || {
              id: av.id,
              slug: av.slug,
              name: av.businessName,
              tagline: `Verified independent ${av.category.toLowerCase()} store in ${av.locality}.`,
              category: av.category as any,
              rating: av.rating || 4.9,
              reviewsCount: av.totalOrders || 120,
              deliveryTime: '20-30 min',
              distance: '0.9 km',
              minimumOrder: 100,
              deliveryFee: 15,
              isOpen: true,
              timings: '7:00 AM - 10:00 PM',
              address: {
                line1: 'Near Main Road',
                locality: av.locality,
                city: av.city,
                pincode: '560103',
              },
              phone: av.phone,
              coverImage: av.documents?.storefrontPhoto || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
              logo: av.documents?.storefrontPhoto || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
              featuredBadges: ['TRUG Verified', 'Local Store'],
              qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://trug.focsera.com/store/${av.slug}`,
              categories: ['Fresh Daily Essentials'],
            };
          });

        if (activeVerified.length > 0) {
          setVendors(activeVerified);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync Categories from Admin
  const syncCategories = useCallback(() => {
    try {
      const adminCatsRaw = localStorage.getItem('trug_admin_categories');
      if (adminCatsRaw) {
        setCategories(JSON.parse(adminCatsRaw));
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync Orders
  const syncOrders = useCallback(() => {
    try {
      const savedOrders = localStorage.getItem('trug_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch {
      // ignore
    }
  }, []);

  // Listen to cross-tab and cross-module storage updates
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('trug_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedSubs = localStorage.getItem('trug_recurring_orders');
      if (savedSubs) setRecurringOrders(JSON.parse(savedSubs));

      const savedLocality = localStorage.getItem('trug_locality');
      if (savedLocality) setCurrentLocality(savedLocality);

      const savedUser = localStorage.getItem('trug_user');
      if (savedUser) setUser(JSON.parse(savedUser));

      syncOrders();
      syncProducts();
      syncVendors();
      syncCategories();
    } catch {
      // ignore
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'trug_orders') syncOrders();
      if (e.key === 'trug_vendor_products') syncProducts();
      if (e.key === 'trug_admin_vendors') syncVendors();
      if (e.key === 'trug_admin_categories') syncCategories();
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [syncOrders, syncProducts, syncVendors, syncCategories]);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem('trug_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('trug_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('trug_recurring_orders', JSON.stringify(recurringOrders));
    } catch {
      // ignore
    }
  }, [recurringOrders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const setLocality = (loc: string) => {
    setCurrentLocality(loc);
    try {
      localStorage.setItem('trug_locality', loc);
    } catch {
      // ignore
    }
    showToast(`Delivery location set to: ${loc}`);
  };

  const getVendorById = (id: string) => vendors.find((v) => v.id === id);
  const getVendorBySlug = (slug: string) => vendors.find((v) => v.slug === slug);
  const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
  const getProductsByVendor = (vendorId: string) => products.filter((p) => p.vendorId === vendorId);
  const getProductsByCategory = (cat: string) => {
    if (!cat || cat === 'All') return products;
    return products.filter((p) => p.category.toLowerCase().includes(cat.toLowerCase()));
  };

  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    const vendor = getVendorById(product.vendorId);
    const cartItemId = `${product.id}-${variant.id}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const newItem: CartItem = {
        cartItemId,
        product,
        variant,
        quantity,
        vendorId: product.vendorId,
        vendorName: product.vendorName,
        vendorSlug: product.vendorSlug,
        deliveryFee: vendor ? vendor.deliveryFee : 20,
        freeDeliveryThreshold: 299,
      };
      return [...prev, newItem];
    });

    showToast(`Added ${quantity}x ${product.name} (${variant.name}) to cart`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from cart');
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCartForVendor = (vendorId: string) => {
    setCartItems((prev) => prev.filter((item) => item.vendorId !== vendorId));
  };

  const clearEntireCart = () => {
    setCartItems([]);
  };

  const totalCartItemCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // Group items strictly per vendor
  const vendorCarts = cartItems.reduce((acc, item) => {
    const vId = item.vendorId;
    if (!acc[vId]) {
      const vendor = getVendorById(vId) || {
        id: vId,
        slug: item.vendorSlug,
        name: item.vendorName,
        tagline: '',
        category: 'Groceries' as const,
        rating: 4.8,
        reviewsCount: 120,
        deliveryTime: '20 min',
        distance: '0.8 km',
        minimumOrder: 100,
        deliveryFee: 15,
        isOpen: true,
        timings: '7 AM - 10 PM',
        address: { line1: '', locality: currentLocality, city: 'Bengaluru', pincode: '560103' },
        phone: '+91 99999 99999',
        coverImage: '',
        logo: '',
        featuredBadges: [],
        qrCodeUrl: '',
        categories: [],
      };

      acc[vId] = {
        vendor,
        items: [],
        subtotal: 0,
        deliveryFee: vendor.deliveryFee,
        total: 0,
        isMinOrderMet: false,
      };
    }

    acc[vId].items.push(item);
    acc[vId].subtotal += item.variant.price * item.quantity;
    acc[vId].total = acc[vId].subtotal + acc[vId].deliveryFee;
    acc[vId].isMinOrderMet = acc[vId].subtotal >= acc[vId].vendor.minimumOrder;

    return acc;
  }, {} as SharedAppContextType['vendorCarts']);

  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'timeline'>): Order => {
    const newId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      orderNumber: `TRUG-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'Placed',
      timeline: [
        {
          status: 'Placed',
          label: 'Order Placed',
          description: `Order received by ${orderData.vendorName}. Store staff is preparing items.`,
          timestamp: 'Just now',
          completed: true,
          current: true,
        },
        {
          status: 'Accepted',
          label: 'Accepted by Vendor',
          description: 'Store confirmed fresh stock and readying package.',
          completed: false,
          current: false,
        },
        {
          status: 'Preparing',
          label: 'Packing Items',
          description: 'Fresh quality check and eco-friendly packing.',
          completed: false,
          current: false,
        },
        {
          status: 'Ready / Dispatched',
          label: orderData.fulfillmentType === 'pickup' ? 'Ready for Store Pickup' : 'Dispatched with Neighbourhood Partner',
          description: orderData.fulfillmentType === 'pickup' ? 'Counter ready with your order QR/ID' : 'Rider dispatched to your address',
          completed: false,
          current: false,
        },
        {
          status: 'Delivered',
          label: orderData.fulfillmentType === 'pickup' ? 'Picked Up' : 'Delivered to Doorstep',
          description: 'Transaction completed successfully.',
          completed: false,
          current: false,
        },
      ],
    };

    setOrders((prev) => {
      const next = [newOrder, ...prev];
      try {
        localStorage.setItem('trug_orders', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    clearCartForVendor(orderData.vendorId);
    showToast(`Order ${newOrder.orderNumber} placed successfully with ${orderData.vendorName}!`);
    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) => {
      const next = prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'Cancelled' as const,
            timeline: [
              ...order.timeline,
              {
                status: 'Cancelled' as const,
                label: 'Order Cancelled',
                description: 'Order cancelled upon customer request. Refund initiated to source method.',
                timestamp: 'Just now',
                completed: true,
                current: true,
              },
            ],
          };
        }
        return order;
      });
      try {
        localStorage.setItem('trug_orders', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast(`Order #${orderId} has been cancelled.`);
  };

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId || o.orderNumber === orderId);

  const addRecurringOrder = (sub: Omit<RecurringOrder, 'id' | 'subscriptionNumber' | 'status'>) => {
    const newSub: RecurringOrder = {
      ...sub,
      id: `sub-${Date.now()}`,
      subscriptionNumber: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      status: 'active',
    };
    setRecurringOrders((prev) => [newSub, ...prev]);
    showToast(`Daily schedule created for ${sub.product.name}!`);
  };

  const toggleRecurringOrderStatus = (id: string, newStatus: 'active' | 'paused' | 'cancelled') => {
    setRecurringOrders((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
    );
    showToast(`Recurring schedule set to ${newStatus}`);
  };

  const login = (phoneOrEmail: string) => {
    setIsLoggedIn(true);
    setUser((prev) => ({
      ...prev,
      phone: phoneOrEmail.includes('@') ? prev.phone : phoneOrEmail,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : prev.email,
    }));
    showToast('Signed in successfully as Aditi Sharma');
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('Signed out of TRUG account');
  };

  const updateProfile = (updated: Partial<CustomerProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('trug_user', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast('Profile updated');
  };

  const addAddress = (addr: CustomerProfile['addresses'][0]) => {
    setUser((prev) => {
      const addresses = [...prev.addresses, addr];
      const next = { ...prev, addresses };
      try {
        localStorage.setItem('trug_user', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast('New address saved');
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id),
    }));
    showToast('Address removed');
  };

  const setDefaultAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    }));
    showToast('Default delivery address updated');
  };

  return (
    <CartContext.Provider
      value={{
        currentLocality,
        setLocality,
        availableLocalities: MOCK_LOCALITIES,
        vendors,
        allAdminVendors: INITIAL_ADMIN_VENDORS,
        refreshVendorsFromAdmin: syncVendors,
        getVendorById,
        getVendorBySlug,
        products,
        refreshProductsFromVendor: syncProducts,
        getProductBySlug,
        getProductsByVendor,
        getProductsByCategory,
        categories,
        refreshCategoriesFromAdmin: syncCategories,
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
        refreshOrders: syncOrders,
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
        toastMessage,
        showToast,
      }}
    >
      {children}
      {/* Global Interactive Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#302B28] text-[#FAF5F0] px-4 py-3 rounded-2xl shadow-2xl border border-[#D97A5B]/30 animate-in fade-in slide-in-from-bottom-3 duration-200 text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97A5B] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
