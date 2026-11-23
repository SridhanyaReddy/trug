import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // 1. Check client IP from standard proxy/CDN headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    let clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '';

    // If local or empty, leave blank so ipapi uses the egress IP
    if (clientIp === '127.0.0.1' || clientIp === '::1' || clientIp.startsWith('192.168.') || clientIp.startsWith('10.')) {
      clientIp = '';
    }

    const endpoint = clientIp ? `https://ipapi.co/${clientIp}/json/` : 'https://ipapi.co/json/';
    const res = await fetch(endpoint, {
      headers: {
        'User-Agent': 'TRUG-Hyperlocal-Web/1.0',
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.latitude && data.longitude) {
        const locality = data.city ? `${data.city}, ${data.region || 'India'}` : 'Hyderabad, Telangana';
        return NextResponse.json({
          success: true,
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city || 'Hyderabad',
          region: data.region || 'Telangana',
          country: data.country_name || 'India',
          locality,
          source: 'ip',
        });
      }
    }

    // Fallback if IP lookup rate-limited or fails
    return NextResponse.json({
      success: true,
      latitude: 17.4319,
      longitude: 78.4073,
      city: 'Hyderabad',
      region: 'Telangana',
      country: 'India',
      locality: 'Jubilee Hills, Hyderabad',
      source: 'default',
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      latitude: 17.4319,
      longitude: 78.4073,
      city: 'Hyderabad',
      region: 'Telangana',
      country: 'India',
      locality: 'Jubilee Hills, Hyderabad',
      source: 'default',
    });
  }
}
