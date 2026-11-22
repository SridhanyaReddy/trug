import { NextResponse } from 'next/server';
import { executeTrugSql } from '@/services/liveDatabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone') || '+919392449721';

    // 1. Fetch user addresses
    const addressesSql = `
      SELECT 
        id, 
        user_id, 
        label as tag, 
        recipient as name, 
        phone, 
        address_line as "addressLine", 
        locality, 
        postcode, 
        is_default as "isDefault"
      FROM trug.customer_delivery_addresses
      WHERE phone = '${phone}' OR phone = '+91${phone.replace(/\D/g, '').slice(-10)}'
      ORDER BY created_at DESC;
    `;
    const addresses = await executeTrugSql(addressesSql);

    // 2. Fetch past orders for this customer
    const ordersSql = `
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.total_paise,
        o.created_at,
        l.name as store_name,
        l.slug as store_slug,
        d.address_line,
        d.postcode
      FROM trug.orders o
      JOIN trug.locations l ON o.location_id = l.id
      LEFT JOIN trug.order_delivery d ON o.id = d.order_id
      WHERE d.phone = '${phone}' OR d.phone = '+91${phone.replace(/\D/g, '').slice(-10)}'
      ORDER BY o.created_at DESC
      LIMIT 10;
    `;
    const orders = await executeTrugSql(ordersSql);

    return NextResponse.json({
      success: true,
      profile: {
        id: addresses[0]?.user_id || 'usr-live',
        name: addresses[0]?.name || 'TRUG Resident',
        phone: phone,
        email: 'resident@withtrug.com',
        addresses: addresses || [],
      },
      orders: orders || [],
    });
  } catch (error) {
    console.error('Failed to fetch customer profile:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
