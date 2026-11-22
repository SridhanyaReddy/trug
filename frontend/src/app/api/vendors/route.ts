import { NextResponse } from 'next/server';
import { getLiveVendors } from '@/services/liveDatabase';

export async function GET() {
  try {
    const vendors = await getLiveVendors();
    return NextResponse.json({ success: true, data: vendors });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
