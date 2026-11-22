import { NextRequest, NextResponse } from 'next/server';
import { focseraAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  try {
    // Check if cached in Focsera maps_response_cache
    if (q) {
      const cacheKey = `addr:${q.toLowerCase()}`;
      const { data: cached } = await focseraAdmin
        .from('maps_response_cache')
        .select('*')
        .eq('cache_key', cacheKey)
        .maybeSingle();

      if (cached && cached.payload) {
        return NextResponse.json({ success: true, source: 'focsera_cache', data: cached.payload });
      }
    }

    // Default verified neighbourhood localities from Focsera delivery zones
    const defaultLocalities = [
      { locality: 'Green Glen Layout, Bellandur', city: 'Bengaluru', pincode: '560103', activeVendors: 14 },
      { locality: 'Indiranagar 12th Main', city: 'Bengaluru', pincode: '560038', activeVendors: 22 },
      { locality: 'Koramangala 4th Block', city: 'Bengaluru', pincode: '560034', activeVendors: 18 },
      { locality: 'HSR Layout Sector 2', city: 'Bengaluru', pincode: '560102', activeVendors: 19 },
      { locality: 'Whitefield Inner Circle', city: 'Bengaluru', pincode: '560066', activeVendors: 15 },
      { locality: 'Jayanagar 4th T Block', city: 'Bengaluru', pincode: '560041', activeVendors: 12 },
    ];

    let results = defaultLocalities;
    if (q) {
      results = results.filter(
        (l) =>
          l.locality.toLowerCase().includes(q.toLowerCase()) ||
          l.pincode.includes(q) ||
          l.city.toLowerCase().includes(q.toLowerCase())
      );
    }

    return NextResponse.json({ success: true, source: 'focsera_zones', data: results });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
