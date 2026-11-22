import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 1. TRUG Database (Main database for Vendors, Products, Orders, Categories, Subscriptions)
const TRUG_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://nkqykmqyvyndikbpobkw.supabase.co';
const TRUG_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rcXlrbXF5dnluZGlrYnBvYmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUxMDg5NzgsImV4cCI6MjExMDY4NDk3OH0.myYnjyjyjIOsCO6d4li2udf4I69eWeayNU_PD5LwA0A';
const TRUG_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rcXlrbXF5dnluZGlrYnBvYmt3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NTEwODk3OCwiZXhwIjoyMTEwNjg0OTc4fQ.iNN1Bq2ZKLAPG3SirnlGu0WW16JRtjs7ficGsGJ9Em8';

export const isSupabaseConfigured = true;

/**
 * Standard Supabase client for TRUG tables & live shopping flow
 */
export const supabase: SupabaseClient = createClient(TRUG_URL, TRUG_ANON);

/**
 * Service role client for TRUG platform backend
 */
export const supabaseAdmin: SupabaseClient = createClient(TRUG_URL, TRUG_SERVICE);

// 2. FOCSERA Database (For Storage, Images, Address cache & Maps APIs)
const FOCSERA_URL = process.env.NEXT_PUBLIC_FOCSERA_SUPABASE_URL || 'https://unpbalwhranarpggvckh.supabase.co';
const FOCSERA_ANON = process.env.NEXT_PUBLIC_FOCSERA_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucGJhbHdocmFuYXJwZ2d2Y2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MzQ3MDAsImV4cCI6MjA4ODAxMDcwMH0.rHLHukj6BzpccqHn4P4-XbdPeSOqi9IBaE7Ex5e2MJo';
const FOCSERA_SERVICE = process.env.FOCSERA_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucGJhbHdocmFuYXJwZ2d2Y2toIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQzNDcwMCwiZXhwIjoyMDg4MDEwNzAwfQ.e1TmCJ_mK2muO267MYC7dZpgRnod-aTT1O3o-MEOu4M';

export const focseraSupabase: SupabaseClient = createClient(FOCSERA_URL, FOCSERA_ANON);
export const focseraAdmin: SupabaseClient = createClient(FOCSERA_URL, FOCSERA_SERVICE);

/**
 * Helper to get public image URLs from Focsera storage
 */
export function getFocseraImageUrl(bucket: string = 'mobile-catalog', path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const { data } = focseraSupabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
