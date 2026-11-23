import { NextResponse } from 'next/server';
import { executeTrugSql } from '@/services/liveDatabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawPhone = searchParams.get('phone') || '+919515803954';
    const cleanDigits = rawPhone.replace(/\D/g, '').slice(-10);
    const phoneE164 = `+91${cleanDigits}`;

    // 1. Fetch user delivery addresses
    const addressesSql = `
      SELECT 
        id, 
        user_id, 
        label, 
        recipient, 
        phone, 
        address_line, 
        locality, 
        postcode, 
        is_default
      FROM trug.customer_delivery_addresses
      WHERE phone = '${phoneE164}' OR phone = '${cleanDigits}' OR phone = '91${cleanDigits}'
      ORDER BY is_default DESC, created_at DESC;
    `;
    const addresses = await executeTrugSql(addressesSql);

    // 2. Fetch customer profile or auth info
    const profileSql = `
      SELECT 
        p.user_id,
        p.display_name,
        p.contact_email,
        p.language,
        p.order_notifications,
        p.subscription_notifications
      FROM trug.customer_profiles p
      WHERE p.user_id IN (
        SELECT id FROM auth.users WHERE phone = '${cleanDigits}' OR phone = '91${cleanDigits}' OR phone = '${phoneE164}'
      )
      LIMIT 1;
    `;
    const profiles = await executeTrugSql(profileSql);
    const existingProfile = profiles[0] || null;

    // 3. Fetch past orders for this customer
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
      WHERE d.phone = '${phoneE164}' OR d.phone = '${cleanDigits}' OR d.phone = '91${cleanDigits}'
      ORDER BY o.created_at DESC
      LIMIT 10;
    `;
    const orders = await executeTrugSql(ordersSql);

    return NextResponse.json({
      success: true,
      profile: {
        userId: existingProfile?.user_id || addresses[0]?.user_id || null,
        name: existingProfile?.display_name || addresses[0]?.recipient || 'TRUG Resident',
        phone: phoneE164,
        email: existingProfile?.contact_email || null,
        addresses: addresses || [],
      },
      orders: orders || [],
    });
  } catch (error: any) {
    console.error('Failed to fetch customer profile:', error);
    return NextResponse.json({ success: false, error: error.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, phone, name, email, address } = body;

    const cleanDigits = (phone || '').replace(/\D/g, '').slice(-10);
    if (cleanDigits.length !== 10) {
      return NextResponse.json({ success: false, error: 'Valid phone is required' }, { status: 400 });
    }
    const phoneE164 = `+91${cleanDigits}`;

    // Update Profile Name & Email
    if (action === 'update_profile') {
      // Find auth user_id if exists
      const userLookupSql = `
        SELECT id FROM auth.users WHERE phone = '${cleanDigits}' OR phone = '91${cleanDigits}' OR phone = '${phoneE164}' LIMIT 1;
      `;
      const users = await executeTrugSql(userLookupSql);
      const userId = users[0]?.id;

      if (userId) {
        const updateSql = `
          INSERT INTO trug.customer_profiles (user_id, display_name, contact_email, language, updated_at)
          VALUES ('${userId}', '${(name || '').replace(/'/g, "''")}', ${email ? `'${email.replace(/'/g, "''")}'` : 'NULL'}, 'en', now())
          ON CONFLICT (user_id) DO UPDATE 
          SET display_name = EXCLUDED.display_name,
              contact_email = EXCLUDED.contact_email,
              updated_at = now();
        `;
        await executeTrugSql(updateSql);
      }

      return NextResponse.json({
        success: true,
        name,
        email,
        phone: phoneE164,
      });
    }

    // Add / Update Delivery Address
    if (action === 'save_address') {
      const { label, recipient, address_line, locality, postcode, is_default } = address || {};
      
      const userLookupSql = `
        SELECT id FROM auth.users WHERE phone = '${cleanDigits}' OR phone = '91${cleanDigits}' OR phone = '${phoneE164}' LIMIT 1;
      `;
      const users = await executeTrugSql(userLookupSql);
      const userId = users[0]?.id || 'a4715ae2-8c53-4f67-9d30-78616bbad4a4'; // fallback resident uuid

      if (is_default) {
        await executeTrugSql(`UPDATE trug.customer_delivery_addresses SET is_default = false WHERE phone = '${phoneE164}';`);
      }

      const insertAddressSql = `
        INSERT INTO trug.customer_delivery_addresses 
          (user_id, label, recipient, phone, address_line, locality, postcode, is_default, created_at, updated_at)
        VALUES 
          ('${userId}', '${(label || 'Home').replace(/'/g, "''")}', '${(recipient || name || 'Resident').replace(/'/g, "''")}', '${phoneE164}', '${(address_line || '').replace(/'/g, "''")}', '${(locality || 'Hyderabad').replace(/'/g, "''")}', '${(postcode || '500033').replace(/'/g, "''")}', ${is_default ? 'true' : 'false'}, now(), now())
        RETURNING id, label, recipient, phone, address_line, locality, postcode, is_default;
      `;
      const newAddr = await executeTrugSql(insertAddressSql);

      return NextResponse.json({
        success: true,
        address: newAddr[0],
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Failed to update customer data:', error);
    return NextResponse.json({ success: false, error: error.message || 'Database write error' }, { status: 500 });
  }
}
