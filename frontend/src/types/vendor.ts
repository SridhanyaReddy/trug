export interface VendorProductVariant {
  id: string;
  name: string; // e.g., "500g", "1kg", "Pack of 6"
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockQty: number;
}

export type ProductPublishStatus = 'published' | 'draft' | 'paused';

export interface VendorManagedProduct {
  id: string;
  slug: string;
  vendorId: string;
  name: string;
  shortDescription: string;
  description: string;
  category: 'Milk & Dairy' | 'Eggs' | 'Vegetables & Fruits' | 'Groceries' | 'Meat & Other Essentials';
  subCategory?: string;
  image: string;
  variants: VendorProductVariant[];
  defaultVariantId: string;
  isPopular?: boolean;
  isOrganic?: boolean;
  badge?: string;
  rating?: number;
  vendorName: string;
  vendorSlug: string;
  status: ProductPublishStatus;
  totalSold: number;
  lastUpdated: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  variantName: string;
  change: number; // +10 or -5
  reason: 'Restock' | 'Sale' | 'Damaged / Expired' | 'Manual Correction';
  timestamp: string;
  newStock: number;
}

export interface DeliverySlotConfig {
  id: string;
  title: string; // e.g. "Early Morning Milk Drop"
  startTime: string; // "06:30"
  endTime: string; // "08:00"
  maxOrdersCapacity: number;
  currentBookings: number;
  cutOffTime: string; // "22:00 previous day"
  isEnabled: boolean;
  type: 'delivery' | 'pickup' | 'both';
}

export interface VendorCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  isRecurringCustomer: boolean;
  notes?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Store Manager' | 'Packing Staff' | 'Delivery Rider' | 'Cashier';
  phone: string;
  status: 'Active' | 'On Leave';
  joinedDate: string;
}

export interface VendorBusinessProfile {
  id: string;
  slug: string;
  businessName: string;
  legalEntityName: string;
  gstNumber: string;
  fssaiNumber: string;
  category: string;
  ownerName: string;
  phone: string;
  email: string;
  address: {
    line1: string;
    locality: string;
    city: string;
    pincode: string;
  };
  timings: string;
  isOpen: boolean;
  verificationStatus: 'Verified' | 'Pending Review' | 'Action Needed';
  documents: {
    fssaiDoc: string;
    gstDoc: string;
    storefrontPhoto: string;
  };
  deliveryRadiusKm: number;
  minOrderValue: number;
  deliveryFee: number;
  currentPlan: 'Neighbourhood Starter' | 'Growth Champion' | 'Hyperlocal Scale';
  planExpiry: string;
}

