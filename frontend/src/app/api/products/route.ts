import { NextResponse } from 'next/server';
import { getLiveProducts } from '@/services/liveDatabase';

export async function GET() {
  try {
    const products = await getLiveProducts();
    return NextResponse.json({ success: true, data: products });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
