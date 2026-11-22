import { NextResponse } from 'next/server';
import { getLiveCategories } from '@/services/liveDatabase';

export async function GET() {
  try {
    const categories = await getLiveCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
