import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_ORDERS } from '@/data/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!isSupabaseConfigured || !supabase) {
    if (id) {
      const found = MOCK_ORDERS.find(o => o.id === id);
      return NextResponse.json({
        success: true,
        mode: 'mock_standby',
        order: found || {
          id,
          status: 'Placed',
          customerName: 'Aarav Sharma',
          vendorName: 'Krishna Farm Fresh & Dairy',
          total: 285,
          createdAt: new Date().toISOString()
        }
      });
    }
    return NextResponse.json({
      success: true,
      mode: 'mock_standby',
      data: MOCK_ORDERS
    });
  }

  try {
    if (id) {
      const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
      if (error) throw error;
      return NextResponse.json({ success: true, mode: 'supabase', order: data });
    }
    const { data, error } = await supabase.from('orders').select('*');
    if (error) throw error;
    return NextResponse.json({ success: true, mode: 'supabase', data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({
        success: true,
        mode: 'mock_standby',
        message: 'Order simulated successfully. Instant checkout ready without database.',
        order: {
          id: `TRG-${Math.floor(100000 + Math.random() * 900000)}`,
          ...body,
          createdAt: new Date().toISOString()
        }
      });
    }

    const { data, error } = await supabase.from('orders').insert([body]).select().single();
    if (error) throw error;

    return NextResponse.json({ success: true, mode: 'supabase', order: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
