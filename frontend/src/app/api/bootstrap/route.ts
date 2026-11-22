import { NextResponse } from 'next/server';
import {
  getLiveCategories,
  getLiveVendors,
  getLiveProducts,
  getLiveHeaderVideos,
  getLiveTestimonials,
} from '@/services/liveDatabase';

export async function GET() {
  const [categories, vendors, products, headerVideos, testimonials] = await Promise.all([
    getLiveCategories(),
    getLiveVendors(),
    getLiveProducts(),
    getLiveHeaderVideos(),
    getLiveTestimonials(),
  ]);

  return NextResponse.json({
    success: true,
    source: 'live_supabase_focsera',
    counts: {
      categories: categories.length,
      vendors: vendors.length,
      products: products.length,
      videos: headerVideos.length,
      testimonials: testimonials.length,
    },
    data: {
      categories,
      vendors,
      products,
      headerVideos,
      testimonials,
    },
  });
}

