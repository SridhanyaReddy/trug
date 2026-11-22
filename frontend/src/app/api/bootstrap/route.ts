import { NextResponse } from 'next/server';
import {
  getLiveCategories,
  getLiveVendors,
  getLiveProducts,
  getLiveDeliverySlots,
  getLiveTrugOrders,
  getLiveAddressSuggestions,
} from '@/services/liveDatabase';

export async function GET() {
  try {
    const [categories, vendors, products, deliverySlots, orders, addressSuggestions] = await Promise.all([
      getLiveCategories(),
      getLiveVendors(),
      getLiveProducts(),
      getLiveDeliverySlots(),
      getLiveTrugOrders(),
      getLiveAddressSuggestions(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        categories,
        vendors,
        products,
        deliverySlots,
        orders,
        addressSuggestions,
      },
    });
  } catch (err: any) {
    console.error('Error bootstrapping live TRUG database:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
