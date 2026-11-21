import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_ADMIN_CATEGORIES } from '@/data/adminMockData';

export async function GET() {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({
      success: true,
      mode: 'mock_standby',
      message: 'Supabase credentials pending. Serving category taxonomy.',
      data: INITIAL_ADMIN_CATEGORIES
    });
  }

  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return NextResponse.json({ success: true, mode: 'supabase', data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
