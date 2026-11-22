import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import {
  VendorRecord,
  ProductRecord,
  CategoryRecord,
  OrderRecord,
} from '@/types/supabase';
import { MOCK_VENDORS, MOCK_PRODUCTS } from '@/data/mockData';
import { INITIAL_ADMIN_CATEGORIES } from '@/data/adminMockData';

/**
 * 1. Vendors Service
 */
export async function getPublicVendors(locality?: string, category?: string): Promise<VendorRecord[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('vendors').select('*').eq('status', 'active');
    if (locality && locality !== 'All Areas') query = query.ilike('locality', `%${locality}%`);
    if (category && category !== 'All') query = query.ilike('category', `%${category}%`);
    const { data, error } = await query;
    if (!error && data) return data as VendorRecord[];
  }

  return MOCK_VENDORS.map((v) => ({
    id: v.id,
    owner_id: null,
    name: v.name,
    slug: v.slug,
    category: v.category,
    locality: v.address.locality,
    address: `${v.address.line1}, ${v.address.locality}, ${v.address.city} - ${v.address.pincode}`,
    rating: v.rating,
    rating_count: v.reviewsCount,
    delivery_time: v.deliveryTime,
    min_order: v.minimumOrder,
    image: v.logo,
    banner_image: v.coverImage,
    status: 'active',
    fssai_number: '21223190000412',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

/**
 * 2. Products Service
 */
export async function getProducts(options?: {
  vendorId?: string;
  category?: string;
  slug?: string;
}): Promise<ProductRecord[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('products').select('*');
    if (options?.vendorId) query = query.eq('vendor_id', options.vendorId);
    if (options?.category) query = query.ilike('category', `%${options.category}%`);
    if (options?.slug) query = query.eq('slug', options.slug);
    const { data, error } = await query;
    if (!error && data) return data as ProductRecord[];
  }

  let filtered = [...MOCK_PRODUCTS];
  if (options?.vendorId) filtered = filtered.filter((p) => p.vendorId === options.vendorId);
  if (options?.category) filtered = filtered.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase());
  if (options?.slug) filtered = filtered.filter((p) => p.slug === options.slug);

  return filtered.map((p) => {
    const primaryVariant = p.variants[0] || { price: 99, originalPrice: 110, name: 'Standard', inStock: true };
    return {
      id: p.id,
      vendor_id: p.vendorId,
      name: p.name,
      slug: p.slug,
      category: p.category,
      price: primaryVariant.price,
      original_price: primaryVariant.originalPrice || null,
      unit: primaryVariant.name,
      variants: p.variants.map((v) => ({ unit: v.name, price: v.price, originalPrice: v.originalPrice })),
      image: p.image,
      description: p.description,
      in_stock: primaryVariant.inStock,
      stock_count: primaryVariant.inStock ? 50 : 0,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
}

/**
 * 3. Orders Service
 */
export async function insertOrder(order: Omit<OrderRecord, 'created_at' | 'updated_at'>): Promise<OrderRecord> {
  const now = new Date().toISOString();
  const fullOrder: OrderRecord = {
    ...order,
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured && (supabaseAdmin || supabase)) {
    const client = supabaseAdmin || supabase!;
    const { data, error } = await client.from('orders').insert([fullOrder]).select().single();
    if (!error && data) return data as OrderRecord;
  }

  return fullOrder;
}

/**
 * 4. Categories Service
 */
export async function getCategories(): Promise<CategoryRecord[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('categories').select('*');
    if (!error && data) return data as CategoryRecord[];
  }

  return INITIAL_ADMIN_CATEGORIES.map((c) => ({
    id: c.id,
    name: c.name,
    icon: '📦',
    item_count: c.productCount,
    created_at: new Date().toISOString(),
  }));
}
