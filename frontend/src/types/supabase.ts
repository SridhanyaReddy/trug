/**
 * TRUG Supabase Database Types
 * Maps exactly to the PostgreSQL schema and tables in public.*
 */

export interface ProfileRecord {
  id: string; // UUID references auth.users(id)
  email: string;
  full_name: string;
  phone: string | null;
  role: 'customer' | 'vendor' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface CategoryRecord {
  id: string; // e.g. 'dairy', 'eggs', 'veggies'
  name: string;
  icon: string | null;
  item_count: number;
  created_at: string;
}

export interface VendorRecord {
  id: string; // 'v-krishna-dairy'
  owner_id: string | null; // UUID references profiles(id)
  name: string;
  slug: string;
  category: string;
  locality: string;
  address: string;
  rating: number;
  rating_count: number;
  delivery_time: string;
  min_order: number;
  image: string | null;
  banner_image: string | null;
  status: 'active' | 'pending' | 'suspended';
  fssai_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  unit: string; // '500ml', '1L', '250g'
  price: number;
  originalPrice?: number;
}

export interface ProductRecord {
  id: string;
  vendor_id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  original_price: number | null;
  unit: string;
  variants: ProductVariant[];
  image: string | null;
  description: string | null;
  in_stock: boolean;
  stock_count: number;
  status: 'published' | 'draft' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface DeliveryAddressPayload {
  line1: string;
  locality: string;
  city: string;
  pincode: string;
}

export interface OrderRecord {
  id: string; // 'TRG-XXXXXX'
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  vendor_id: string;
  vendor_name: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: 'placed' | 'accepted' | 'preparing' | 'ready' | 'dispatched' | 'delivered' | 'cancelled';
  delivery_type: 'delivery' | 'pickup';
  delivery_slot: string | null;
  delivery_address: DeliveryAddressPayload | null;
  special_instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecurringSubscriptionRecord {
  id: string;
  customer_id: string;
  vendor_id: string;
  product_id: string;
  quantity: number;
  frequency: 'daily' | 'alternate_days' | 'weekly';
  time_slot: string;
  status: 'active' | 'paused' | 'cancelled';
  next_delivery: string | null;
  created_at: string;
}

export interface SupportTicketRecord {
  id: string;
  order_id: string | null;
  user_id: string | null;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}
