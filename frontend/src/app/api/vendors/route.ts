import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_VENDORS } from '@/data/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locality = searchParams.get('locality');
  const category = searchParams.get('category');

  if (!isSupabaseConfigured || !supabase) {
    let vendors = [...MOCK_VENDORS];
    if (locality && locality !== 'All Areas') {
      vendors = vendors.filter(v => 
        v.address.locality.toLowerCase().includes(locality.toLowerCase())
      );
    }
    if (category && category !== 'All') {
      vendors = vendors.filter(v => 
        v.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    return NextResponse.json({
      success: true,
      mode: 'mock_standby',
      message: 'Supabase credentials pending. Serving cached data.',
      data: vendors
    });
  }

  try {
    let query = supabase.from('vendors').select('*').eq('status', 'active');
    if (locality && locality !== 'All Areas') query = query.eq('locality', locality);
    if (category && category !== 'All') query = query.eq('category', category);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true, mode: 'supabase', data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
