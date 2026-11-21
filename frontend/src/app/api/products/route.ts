import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_PRODUCTS } from '@/data/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const vendorId = searchParams.get('vendorId');

  if (!isSupabaseConfigured || !supabase) {
    let products = [...MOCK_PRODUCTS];
    if (category) {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (vendorId) {
      products = products.filter(p => p.vendorId === vendorId);
    }
    return NextResponse.json({
      success: true,
      mode: 'mock_standby',
      message: 'Supabase credentials pending. Serving cached data.',
      data: products
    });
  }

  try {
    let query = supabase.from('products').select('*').eq('status', 'published');
    if (category) query = query.eq('category', category);
    if (vendorId) query = query.eq('vendor_id', vendorId);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true, mode: 'supabase', data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
