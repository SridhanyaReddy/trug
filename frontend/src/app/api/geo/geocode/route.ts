import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'reverse'; // 'reverse' | 'search'
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon') || searchParams.get('lng');
    const q = searchParams.get('q');

    if (action === 'reverse') {
      const latitude = parseFloat(lat || '17.4319');
      const longitude = parseFloat(lon || '78.4073');

      // 1. Query Nominatim with official compliant User-Agent headers
      try {
        const osmRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'TRUG-Hyperlocal-Store-App/1.0 (support@withtrug.com)',
              'Accept': 'application/json',
              'Accept-Language': 'en',
            },
            next: { revalidate: 3600 },
          }
        );

        if (osmRes.ok) {
          const data = await osmRes.json();
          const addr = data.address || {};
          const road = addr.road || addr.pedestrian || addr.suburb || '';
          const suburb =
            addr.suburb ||
            addr.neighbourhood ||
            addr.residential ||
            addr.city_district ||
            '';
          const city = addr.city || addr.town || addr.state_district || 'Hyderabad';
          const locality = suburb ? `${suburb}, ${city}` : city;
          const display = data.display_name
            ? data.display_name.split(',').slice(0, 4).join(', ')
            : locality;

          return NextResponse.json({
            success: true,
            display,
            locality,
            road,
            suburb,
            city,
            lat: latitude,
            lng: longitude,
          });
        }
      } catch (err) {
        console.warn('Nominatim reverse failed:', err);
      }

      // 2. High-speed Fallback via BigDataCloud client-safe reverse geocoding API
      try {
        const bdcRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        if (bdcRes.ok) {
          const bdc = await bdcRes.json();
          const locality = bdc.locality || bdc.city || 'Hyderabad';
          const display = [bdc.locality, bdc.city, bdc.principalSubdivision]
            .filter(Boolean)
            .join(', ');
          return NextResponse.json({
            success: true,
            display: display || 'Jubilee Hills, Hyderabad',
            locality: locality ? `${locality}, ${bdc.principalSubdivision || 'Hyderabad'}` : 'Jubilee Hills, Hyderabad',
            city: bdc.city || 'Hyderabad',
            lat: latitude,
            lng: longitude,
          });
        }
      } catch {}

      return NextResponse.json({
        success: true,
        display: 'Jubilee Hills, Hyderabad',
        locality: 'Jubilee Hills, Hyderabad',
        city: 'Hyderabad',
        lat: latitude,
        lng: longitude,
      });
    }

    if (action === 'search' && q) {
      // Forward search location
      try {
        const searchRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            q
          )}&limit=5&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'TRUG-Hyperlocal-Store-App/1.0 (support@withtrug.com)',
              'Accept': 'application/json',
              'Accept-Language': 'en',
            },
          }
        );

        if (searchRes.ok) {
          const results = await searchRes.json();
          if (Array.isArray(results) && results.length > 0) {
            return NextResponse.json({
              success: true,
              results: results.map((r: any) => ({
                display: r.display_name,
                lat: parseFloat(r.lat),
                lng: parseFloat(r.lon),
              })),
            });
          }
        }
      } catch (err) {
        console.warn('Nominatim search failed:', err);
      }

      return NextResponse.json({
        success: true,
        results: [
          {
            display: q,
            lat: 17.4319,
            lng: 78.4073,
          },
        ],
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid parameters' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
