import { NextResponse } from 'next/server';
import { fetchLiveDatabaseCategories } from '@/services/liveDatabase';

export async function GET() {
  const categories = await fetchLiveDatabaseCategories();
  return NextResponse.json({
    success: true,
    source: 'live_database_home_partner_types',
    data: categories
  });
}
