import { NextResponse } from 'next/server';
import { executeTrugSql } from '@/services/liveDatabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawPhone = searchParams.get('phone') || '+919515803954';
    const cleanDigits = rawPhone.replace(/\D/g, '').slice(-10);
    const phoneE164 = `+91${cleanDigits}`;

    const sql = `
      SELECT 
        id, 
        user_id, 
        label, 
        recipient, 
        phone, 
        address_line, 
        locality, 
        landmark, 
        instructions, 
        postcode, 
        latitude, 
        longitude, 
        is_default
      FROM trug.customer_delivery_addresses
      WHERE phone = '${phoneE164}' OR phone = '${cleanDigits}' OR phone = '91${cleanDigits}'
      ORDER BY is_default DESC, created_at DESC;
    `;
    const rows = await executeTrugSql(sql);
    return NextResponse.json({ success: true, addresses: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      phone,
      recipient,
      label,
      flat,
      apartment,
      addressLine,
      locality,
      landmark,
      instructions,
      latitude,
      longitude,
      postcode,
      isDefault,
    } = body;

    const cleanDigits = (phone || '9515803954').replace(/\D/g, '').slice(-10);
    const phoneE164 = `+91${cleanDigits}`;

    // Get user id if exists
    const userSql = `
      SELECT id FROM auth.users 
      WHERE phone = '${cleanDigits}' OR phone = '91${cleanDigits}' OR phone = '${phoneE164}'
      LIMIT 1;
    `;
    const userRows = await executeTrugSql(userSql);
    const userId = userRows[0]?.id || '49bfb3cc-5013-4945-9000-020000000001';

    // Full detailed address line
    const fullAddress = [flat, apartment, addressLine].filter(Boolean).join(', ');

    // If marked default, unset existing default
    if (isDefault) {
      await executeTrugSql(`
        UPDATE trug.customer_delivery_addresses 
        SET is_default = false 
        WHERE user_id = '${userId}' OR phone = '${phoneE164}';
      `);
    }

    const insertSql = `
      INSERT INTO trug.customer_delivery_addresses (
        user_id,
        label,
        recipient,
        phone,
        address_line,
        locality,
        landmark,
        instructions,
        postcode,
        latitude,
        longitude,
        is_default
      ) VALUES (
        '${userId}',
        '${(label || 'Home').replace(/'/g, "''")}',
        '${(recipient || 'Resident').replace(/'/g, "''")}',
        '${phoneE164}',
        '${fullAddress.replace(/'/g, "''")}',
        '${(locality || 'Hyderabad').replace(/'/g, "''")}',
        ${landmark ? `'${landmark.replace(/'/g, "''")}'` : 'NULL'},
        ${instructions ? `'${instructions.replace(/'/g, "''")}'` : 'NULL'},
        '${postcode || '500033'}',
        ${latitude ? latitude : 'NULL'},
        ${longitude ? longitude : 'NULL'},
        ${isDefault ? 'true' : 'false'}
      )
      RETURNING *;
    `;

    const inserted = await executeTrugSql(insertSql);
    return NextResponse.json({ success: true, address: inserted[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
