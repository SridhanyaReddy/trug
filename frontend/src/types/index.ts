export interface Vendor {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: 'Groceries' | 'Dairy & Essentials' | 'Farm Fresh' | 'Organic Store' | 'Daily Meat & Eggs' | 'Artisan Bakery';
  rating: number;
  reviewsCount: number;
  deliveryTime: string; // e.g. "15-25 min"
  distance: string; // e.g. "0.8 km"
  minimumOrder: number;
  deliveryFee: number;
  isOpen: boolean;
  timings: string; // e.g. "6:30 AM - 10:00 PM"
  address: {
    line1: string;
    locality: string;
    city: string;
    pincode: string;
  };
  phone: string;
  coverImage: string;
  logo: string;
  featuredBadges: string[];
  notice?: string;
  qrCodeUrl: string;
  categories: string[];
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., "500g", "1kg", "Pack of 6"
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  vendorId: string;
  name: string;
  shortDescription: string;
  description: string;
  category: 'Milk & Dairy' | 'Eggs' | 'Vegetables & Fruits' | 'Groceries' | 'Meat & Other Essentials';
  subCategory?: string;
  image: string;
  gallery?: string[];
  variants: ProductVariant[];
  defaultVariantId: string;
  isPopular?: boolean;
  isOrganic?: boolean;
  badge?: string;
  rating?: number;
  vendorName: string;
  vendorSlug: string;
}

export interface CartItem {
  cartItemId: string; // generated e.g. `${product.id}-${variant.id}`
  product: Product;
  variant: ProductVariant;
  quantity: number;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  image: string;
}

export type OrderStatus = 'Placed' | 'Accepted' | 'Preparing' | 'Ready / Dispatched' | 'Delivered' | 'Cancelled';

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  vendorPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  total: number;
  fulfillmentType: 'delivery' | 'pickup';
  deliverySlot: string;
  deliveryAddress: {
    name: string;
    phone: string;
    addressLine: string;
    landmark?: string;
    tag: 'Home' | 'Work' | 'Other';
  };
  paymentMethod: 'UPI' | 'Card' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending';
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  timeline: OrderTimelineStep[];
}

export interface RecurringOrder {
  id: string;
  subscriptionNumber: string;
  vendorId: string;
  vendorName: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  frequency: 'daily' | 'alternate_days' | 'weekly' | 'custom_days';
  selectedDays?: string[]; // e.g. ['Mon', 'Wed', 'Fri']
  timeSlot: 'Morning (6:30 AM - 8:00 AM)' | 'Evening (5:00 PM - 7:00 PM)';
  startDate: string;
  status: 'active' | 'paused' | 'cancelled';
  nextDeliveryDate: string;
  address: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: {
    id: string;
    tag: 'Home' | 'Work' | 'Other';
    name: string;
    phone: string;
    addressLine: string;
    locality: string;
    landmark?: string;
    isDefault: boolean;
  }[];
  notificationPreferences: {
    orderUpdatesSms: boolean;
    orderUpdatesWhatsapp: boolean;
    promotionalOffers: boolean;
    recurringOrderReminders: boolean;
  };
}

