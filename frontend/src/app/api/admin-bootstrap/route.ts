import { NextResponse } from 'next/server';
import {
  getLiveAdminVendors,
  getLiveAdminCategories,
  getLiveAdminTickets,
  getLiveVendorProducts,
} from '@/services/adminLiveDatabase';

export async function GET() {
  const [vendors, categories, tickets, products] = await Promise.all([
    getLiveAdminVendors(),
    getLiveAdminCategories(),
    getLiveAdminTickets(),
    getLiveVendorProducts(),
  ]);

  return NextResponse.json({
    success: true,
    source: 'live_supabase_admin_focsera',
    counts: {
      vendors: vendors.length,
      categories: categories.length,
      tickets: tickets.length,
      products: products.length,
    },
    data: {
      vendors,
      categories,
      tickets,
      products,
    },
  });
}

