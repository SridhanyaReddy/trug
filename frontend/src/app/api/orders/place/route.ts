import { NextResponse } from 'next/server';
import { executeTrugSql } from '@/services/liveDatabase';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, deliveryAddress, phone, paymentMethod = 'cod' } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Your basket is empty.' }, { status: 400 });
    }

    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      return NextResponse.json({ success: false, error: 'Valid phone number is required.' }, { status: 400 });
    }
    const phoneE164 = `+91${cleanPhone}`;

    // 1. Resolve Customer ID (from auth.users or default resident id)
    const userLookupSql = `
      SELECT id FROM auth.users WHERE phone = '${cleanPhone}' OR phone = '91${cleanPhone}' OR phone = '${phoneE164}' LIMIT 1;
    `;
    const users = await executeTrugSql(userLookupSql);
    const customerId = users[0]?.id || 'a4715ae2-8c53-4f67-9d30-78616bbad4a4';

    // 2. Identify target location_id & city_id from SKUs or items
    const sampleSkuId = items[0].product?.id || items[0].productId;
    const skuQuerySql = `
      SELECT s.location_id, l.city_id, l.delivery_fee_paise
      FROM trug.location_skus s
      JOIN trug.locations l ON s.location_id = l.id
      WHERE s.id = '${sampleSkuId}'
      LIMIT 1;
    `;
    const skuMeta = await executeTrugSql(skuQuerySql);

    const locationId = skuMeta[0]?.location_id || '49bfb3cc-5013-4945-9000-020000000001';
    const cityId = skuMeta[0]?.city_id || '9de246e6-a325-4154-971d-7e4630939943';
    const baseDeliveryFee = skuMeta[0]?.delivery_fee_paise || 2500;

    // 3. Get next active slot or fallback slot
    const slotSql = `
      SELECT id, starts_at, ends_at 
      FROM trug.delivery_slots 
      WHERE location_id = '${locationId}' AND enabled = true
      ORDER BY starts_at DESC
      LIMIT 1;
    `;
    const slots = await executeTrugSql(slotSql);
    const slotId = slots[0]?.id || 'd2cd260a-f289-4710-9a85-f0fb92da318d';
    const slotStartsAt = slots[0]?.starts_at || new Date(Date.now() + 3600000).toISOString();
    const slotEndsAt = slots[0]?.ends_at || new Date(Date.now() + 7200000).toISOString();

    // 4. Calculate Subtotal & Total
    let subtotalPaise = 0;
    const parsedItems = items.map((item: any) => {
      const pricePaise = Math.round((item.variant?.price || item.price || 0) * 100);
      const qty = item.quantity || 1;
      const lineTotalPaise = pricePaise * qty;
      subtotalPaise += lineTotalPaise;

      return {
        sku_id: item.product?.id || item.productId || '49bfb3cc-5013-4945-9000-030000000003',
        sku_name: item.product?.name || item.name || 'Produce Item',
        unit: item.product?.unit || 'pack',
        pack_size: item.product?.pack_size || 1,
        packs: qty,
        unit_price_paise: pricePaise,
        line_total_paise: lineTotalPaise,
        location_id: locationId,
      };
    });

    // Delivery fee is 0 if order > ₹500
    const deliveryFeePaise = subtotalPaise > 50000 ? 0 : baseDeliveryFee;
    const totalPaise = subtotalPaise + deliveryFeePaise;

    // 5. Compute order_number (Max + 1)
    const maxOrderNumSql = `SELECT COALESCE(MAX(order_number), 16) + 1 as next_ord FROM trug.orders;`;
    const nextOrderNumRes = await executeTrugSql(maxOrderNumSql);
    const nextOrderNumber = nextOrderNumRes[0]?.next_ord || Math.floor(Math.random() * 9000) + 1000;

    // 6. UUIDs and Hashes
    const orderId = crypto.randomUUID();
    const checkoutKey = crypto.randomUUID();
    const checkoutFingerprintHex = '\\x' + crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 86400000).toISOString(); // 24h

    // 7. Insert into trug.orders
    const insertOrderSql = `
      INSERT INTO trug.orders (
        id, 
        city_id, 
        location_id, 
        slot_id, 
        customer_id, 
        checkout_key, 
        checkout_fingerprint, 
        status, 
        subtotal_paise, 
        delivery_fee_paise, 
        total_paise, 
        currency, 
        payment_method, 
        payment_status, 
        slot_starts_at, 
        slot_ends_at, 
        expires_at, 
        order_number, 
        created_at, 
        updated_at
      ) VALUES (
        '${orderId}',
        '${cityId}',
        '${locationId}',
        '${slotId}',
        '${customerId}',
        '${checkoutKey}',
        '${checkoutFingerprintHex}',
        'placed',
        ${subtotalPaise},
        ${deliveryFeePaise},
        ${totalPaise},
        'INR',
        '${paymentMethod}',
        'pending',
        '${slotStartsAt}',
        '${slotEndsAt}',
        '${expiresAt}',
        ${nextOrderNumber},
        now(),
        now()
      ) RETURNING id, order_number, total_paise, status, created_at;
    `;
    const orderResult = await executeTrugSql(insertOrderSql);

    if (!orderResult || orderResult.length === 0) {
      throw new Error('Failed to create order record in TRUG database.');
    }

    // 8. Insert into trug.order_items
    for (const it of parsedItems) {
      const insertItemSql = `
        INSERT INTO trug.order_items (
          order_id, location_id, sku_id, sku_name, unit, pack_size, packs, unit_price_paise, line_total_paise
        ) VALUES (
          '${orderId}',
          '${it.location_id}',
          '${it.sku_id}',
          '${it.sku_name.replace(/'/g, "''")}',
          '${it.unit}',
          ${it.pack_size},
          ${it.packs},
          ${it.unit_price_paise},
          ${it.line_total_paise}
        );
      `;
      await executeTrugSql(insertItemSql);
    }

    // 9. Insert into trug.order_delivery
    const recipient = deliveryAddress?.recipient || deliveryAddress?.name || 'Resident';
    const addressLine = deliveryAddress?.address_line || deliveryAddress?.addressLine || 'Jubilee Hills';
    const postcode = deliveryAddress?.postcode || deliveryAddress?.pincode || '500033';

    const insertDeliverySql = `
      INSERT INTO trug.order_delivery (
        order_id, recipient, phone, address_line, postcode
      ) VALUES (
        '${orderId}',
        '${recipient.replace(/'/g, "''")}',
        '${phoneE164}',
        '${addressLine.replace(/'/g, "''")}',
        '${postcode.replace(/'/g, "''")}'
      );
    `;
    await executeTrugSql(insertDeliverySql);

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        orderNumber: nextOrderNumber,
        status: 'placed',
        subtotal: subtotalPaise / 100,
        deliveryFee: deliveryFeePaise / 100,
        total: totalPaise / 100,
        itemCount: parsedItems.reduce((acc: number, cur: any) => acc + cur.packs, 0),
        recipient,
        phone: phoneE164,
        address: `${addressLine}, ${postcode}`,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error placing order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to place order in TRUG database' },
      { status: 500 }
    );
  }
}
