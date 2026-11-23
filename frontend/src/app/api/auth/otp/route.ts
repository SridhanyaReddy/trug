import { NextResponse } from 'next/server';

const FOCSERA_ANON_KEY =
  process.env.NEXT_PUBLIC_FOCSERA_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucGJhbHdocmFuYXJwZ2d2Y2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MzQ3MDAsImV4cCI6MjA4ODAxMDcwMH0.rHLHukj6BzpccqHn4P4-XbdPeSOqi9IBaE7Ex5e2MJo';

const FOCSERA_FUNCTIONS_BASE = 'https://unpbalwhranarpggvckh.supabase.co/functions/v1';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, phone, code } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const cleanDigits = phone.replace(/\D/g, '').slice(-10);
    if (cleanDigits.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit mobile number' },
        { status: 400 }
      );
    }
    const phoneE164 = `+91${cleanDigits}`;

    // Action 1: Send WhatsApp / SMS OTP
    if (action === 'send') {
      const response = await fetch(`${FOCSERA_FUNCTIONS_BASE}/whatsapp-auth-start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FOCSERA_ANON_KEY}`,
          'apikey': FOCSERA_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneE164 }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            error: data.message || data.error || 'Failed to dispatch OTP. Please try again.',
          },
          { status: response.status }
        );
      }

      return NextResponse.json({
        success: true,
        phone_e164: phoneE164,
        retry_after_sec: data.retry_after_sec || 30,
        expires_in_sec: data.expires_in_sec || 300,
      });
    }

    // Action 2: Verify OTP
    if (action === 'verify') {
      if (!code || code.length !== 6) {
        return NextResponse.json(
          { success: false, error: 'Please enter the 6-digit verification code' },
          { status: 400 }
        );
      }

      const response = await fetch(`${FOCSERA_FUNCTIONS_BASE}/whatsapp-auth-verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FOCSERA_ANON_KEY}`,
          'apikey': FOCSERA_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneE164, code }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok && !data.success) {
        return NextResponse.json(
          {
            success: false,
            error: data.error || data.message || 'Invalid or expired verification code.',
            attemptsRemaining: data.attempts_remaining,
          },
          { status: response.status || 400 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: data.user_id || data.profile?.id || `usr-${cleanDigits}`,
          phone: phoneE164,
          name: data.profile?.name || data.profile?.display_name || 'TRUG Resident',
          email: data.profile?.email || null,
        },
        session: data.session || null,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Error in /api/auth/otp:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal authentication error' },
      { status: 500 }
    );
  }
}
