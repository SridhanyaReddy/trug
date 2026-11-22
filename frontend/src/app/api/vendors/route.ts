import { NextRequest, NextResponse } from 'next/server';
import { getLiveVendors } from '@/services/liveDatabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locality = searchParams.get('locality');
  const category = searchParams.get('category');

  let vendors = await getLiveVendors();

  if (locality && locality !== 'All Areas') {
    vendors = vendors.filter((v) =>
      v.address.locality.toLowerCase().includes(locality.toLowerCase())
    );
  }
  if (category && category !== 'All') {
    vendors = vendors.filter((v) =>
      v.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  return NextResponse.json({
    success: true,
    source: 'live_database_partner_profiles',
    count: vendors.length,
    data: vendors,
  });
}
