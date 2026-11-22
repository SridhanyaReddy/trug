import { focseraAdmin } from '@/lib/supabase';
import { Vendor, Product } from '@/types';
import { MOCK_VENDORS, MOCK_PRODUCTS } from '@/data/mockData';

export interface DatabaseCategory {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  accent_hex: string;
  tag: string | null;
  icon_name: string;
}

export interface DatabasePartner {
  id: string;
  name: string;
  display_name: string;
  category: string;
  sub_category: string;
  price: number;
  price_unit: string;
  rating: number;
  reviews_count: number;
  avatar_url: string;
  is_verified: boolean;
  is_online: boolean;
  bio?: string;
}

/**
 * Fetch live categories directly from database (home_partner_types)
 */
export async function fetchLiveDatabaseCategories(): Promise<DatabaseCategory[]> {
  try {
    const { data, error } = await focseraAdmin
      .from('home_partner_types')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as DatabaseCategory[];
    }
  } catch (err) {
    console.error('Error fetching home_partner_types:', err);
  }

  // Graceful fallback
  return [
    {
      id: 'dairy',
      title: 'Milk & Dairy',
      description: 'Morning fresh desi cow A2 milk, paneer, curd & ghee',
      category: 'Milk & Dairy',
      image_url: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=600&q=80',
      accent_hex: '#D97A5B',
      tag: 'Daily Dawn Drop',
      icon_name: 'milk',
    },
    {
      id: 'eggs',
      title: 'Farm Fresh Eggs',
      description: 'Country brown and organic free-range morning eggs',
      category: 'Farm Eggs',
      image_url: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80',
      accent_hex: '#E59866',
      tag: 'High Protein',
      icon_name: 'egg',
    },
    {
      id: 'veggies',
      title: 'Vegetables & Fruits',
      description: 'Crisp green leaves and orchard picked seasonal fruits',
      category: 'Fresh Vegetables',
      image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      accent_hex: '#27AE60',
      tag: 'Farm Direct',
      icon_name: 'carrot',
    },
  ];
}

/**
 * Fetch live merchants/vendors directly from database (partner_profiles)
 */
export async function fetchLiveDatabaseVendors(): Promise<Vendor[]> {
  try {
    const { data, error } = await focseraAdmin
      .from('partner_profiles')
      .select('id, name, display_name, category, sub_category, price, price_unit, rating, reviews_count, avatar_url, is_verified, is_online')
      .limit(20);

    if (!error && data && data.length > 0) {
      return data.map((p: DatabasePartner, idx: number) => {
        const fallback = MOCK_VENDORS[idx % MOCK_VENDORS.length];
        return {
          id: p.id,
          slug: (p.display_name || p.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: p.display_name || p.name,
          tagline: `${p.sub_category} • Starting ₹${p.price}/${p.price_unit}`,
          category: (p.category as any) || fallback.category,
          rating: p.rating || 4.8,
          reviewsCount: p.reviews_count || 50,
          deliveryTime: '15-25 min',
          distance: `${(0.4 + (idx * 0.3)).toFixed(1)} km`,
          minimumOrder: 80,
          deliveryFee: 15,
          isOpen: true,
          timings: '6:30 AM - 10:00 PM',
          address: fallback.address,
          phone: '+91 98450 12341',
          coverImage: p.avatar_url || fallback.coverImage,
          logo: p.avatar_url || fallback.logo,
          featuredBadges: p.is_verified ? ['FSSAI Verified', 'Top Rated in Bellandur', 'Direct Shop'] : ['Locally Sourced'],
          notice: 'Morning batch ready for immediate dispatch.',
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://trug.focsera.com/store/${p.id}`,
          categories: [p.category, p.sub_category, 'Everyday Essentials'],
        };
      });
    }
  } catch (err) {
    console.error('Error fetching partner_profiles:', err);
  }

  return MOCK_VENDORS;
}
