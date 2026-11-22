import { focseraAdmin } from '@/lib/supabase';
import { Vendor, Product, ProductVariant } from '@/types';

export interface DatabaseCategory {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  accent_hex: string;
  tag: string | null;
  icon_name: string;
  route: string;
}

export interface HeaderVideo {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  action_link: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  review_text: string;
  rating: number;
  accent_hex: string;
}

/**
 * 1. Fetch live categories from home_partner_types
 */
export async function getLiveCategories(): Promise<DatabaseCategory[]> {
  const { data, error } = await focseraAdmin
    .from('home_partner_types')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (!error && data && data.length > 0) {
    return data as DatabaseCategory[];
  }
  return [];
}

/**
 * 2. Fetch live vendors from partner_profiles
 */
export async function getLiveVendors(): Promise<Vendor[]> {
  const { data, error } = await focseraAdmin
    .from('partner_profiles')
    .select('*')
    .limit(40);

  if (!error && data && data.length > 0) {
    return data.map((p: any) => {
      const slug = (p.display_name || p.name || 'partner')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      return {
        id: p.id,
        slug: `${slug}-${p.id.slice(0, 5)}`,
        name: p.display_name || p.name,
        tagline: p.bio || `${p.sub_category || p.category} • Professional Storefront`,
        category: (p.category || 'Groceries') as any,
        rating: Number(p.rating) || 4.9,
        reviewsCount: p.reviews_count || 120,
        deliveryTime: p.avg_response_time || '15-30 min',
        distance: '0.8 km',
        minimumOrder: Number(p.price) || 500,
        deliveryFee: 0,
        isOpen: p.is_online !== false,
        timings: '9:00 AM - 9:00 PM',
        address: {
          line1: p.heading || 'Verified Business Outlet',
          locality: 'Bengaluru Core',
          city: 'Bengaluru',
          pincode: '560038',
        },
        phone: p.phone || p.phone_number || '+91 98450 00000',
        coverImage: p.avatar_url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
        logo: p.avatar_url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
        featuredBadges: p.is_verified ? ['Verified Merchant', 'Top Rated'] : ['Partner'],
        notice: p.heading || 'Accepting bookings & orders now.',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://trug.focsera.com/store/${slug}-${p.id.slice(0, 5)}`,
        categories: [p.category, p.sub_category || 'General'].filter(Boolean),
      };
    });
  }
  return [];
}

/**
 * 3. Fetch live products from unified_packages
 */
export async function getLiveProducts(): Promise<Product[]> {
  const { data, error } = await focseraAdmin
    .from('unified_packages')
    .select('*')
    .eq('is_active', true)
    .limit(60);

  if (!error && data && data.length > 0) {
    return data.map((pkg: any) => {
      const slug = pkg.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const price = Number(pkg.price_min) || Number(pkg.price) || 1000;
      const originalPrice = pkg.standard_price ? Number(pkg.standard_price) : Math.round(price * 1.15);

      const variant: ProductVariant = {
        id: `${pkg.id}-std`,
        name: pkg.metadata?.pricing_mode || 'Standard Package',
        price,
        originalPrice,
        inStock: true,
      };

      return {
        id: pkg.id,
        slug: `${slug}-${pkg.id}`,
        vendorId: pkg.domain || 'focsera-network',
        vendorName: 'Verified Focsera Partner',
        vendorSlug: 'verified-focsera-partner',
        name: pkg.name,
        shortDescription: pkg.description ? pkg.description.slice(0, 100) + '...' : '',
        description: pkg.description || pkg.name,
        category: (pkg.category || 'Groceries') as any,
        subCategory: pkg.metadata?.category || pkg.domain,
        image: pkg.thumbnail || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
        gallery: [pkg.thumbnail].filter(Boolean),
        variants: [variant],
        defaultVariantId: variant.id,
        isPopular: pkg.metadata?.tag === 'Best Value' || pkg.metadata?.tag === 'Most Booked' || pkg.metadata?.tag === 'Best Seller',
        badge: pkg.metadata?.tag,
        rating: 4.9,
      };
    });
  }
  return [];
}

/**
 * 4. Fetch live header hero video cards
 */
export async function getLiveHeaderVideos(): Promise<HeaderVideo[]> {
  const { data, error } = await focseraAdmin
    .from('home_header_videos')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (!error && data) return data as HeaderVideo[];
  return [];
}

/**
 * 5. Fetch live testimonials
 */
export async function getLiveTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await focseraAdmin
    .from('home_testimonials')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (!error && data) return data as Testimonial[];
  return [];
}
