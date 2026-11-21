import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'TRUG Hyperlocal Platform (Unified Next.js API)',
    architecture: 'Single Project Vercel Deployment',
    mode: isSupabaseConfigured ? 'database_live' : 'mock_standalone_demo',
    database: {
      provider: 'Supabase',
      configured: isSupabaseConfigured,
      note: isSupabaseConfigured
        ? 'Connected to live database.'
        : 'Running in fully autonomous standalone demo mode (zero database setup required for Vercel).'
    },
    features: {
      customerStorefronts: 'active',
      vendorDashboard: 'active',
      adminPlatformControl: 'active',
      mockOrderPlacement: 'active',
      localStorageSync: 'active'
    },
    timestamp: new Date().toISOString()
  });
}
