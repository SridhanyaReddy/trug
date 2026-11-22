import { NextResponse } from 'next/server';
import { getLiveTrugOrders } from '@/services/liveDatabase';

export async function GET() {
  try {
    const orders = await getLiveTrugOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
