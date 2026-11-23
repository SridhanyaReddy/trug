import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // 1. Check client IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    let clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '';

    if (
      !clientIp ||
      clientIp === '127.0.0.1' ||
      clientIp === '::1' ||
      clientIp.startsWith('192.168.') ||
      clientIp.startsWith('10.') ||
      clientIp.startsWith('172.16.')
    ) {
      clientIp = '';
    }

    // Try ipinfo or ipwho
    try {
      const endpoint = clientIp ? `https://ipinfo.io/${clientIp}/json` : 'https://ipinfo.io/json';
      const res = await fetch(endpoint, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const d = await res.json();
        if (d && d.loc) {
          const [latStr, lonStr] = d.loc.split(',');
          const lat = parseFloat(latStr);
          const lng = parseFloat(lonStr);
          const city = d.city || 'Hyderabad';
          return NextResponse.json({
            success: true,
            latitude: lat,
            longitude: lng,
            city,
            region: d.region || 'Telangana',
            country: 'India',
            locality: `${city}, Telangana`,
            source: 'ipinfo',
          });
        }
      }
    } catch {}

    // Default to Hyderabad - Dundigal / ORR Corridor
    return NextResponse.json({
      success: true,
      latitude: 17.5878,
      longitude: 78.4312,
      city: 'Hyderabad',
      region: 'Telangana',
      country: 'India',
      locality: 'Dundigal, Hyderabad',
      source: 'default',
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      latitude: 17.5878,
      longitude: 78.4312,
      city: 'Hyderabad',
      region: 'Telangana',
      country: 'India',
      locality: 'Dundigal, Hyderabad',
      source: 'default',
    });
  }
}
