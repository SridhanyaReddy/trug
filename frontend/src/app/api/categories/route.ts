import { NextResponse } from 'next/server';
import { getLiveCategories } from '@/services/liveDatabase';

export async function GET() {
  const categories = await getLiveCategories();
  return NextResponse.json({
    success: true,
    source: 'live_database_home_partner_types',
    data: categories,
  });
}
