import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey));

/**
 * Standard Supabase client (respects Row-Level Security)
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Admin / Service role Supabase client for backend operations
 */
export const supabaseAdmin: SupabaseClient | null = (isSupabaseConfigured && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

if (!isSupabaseConfigured) {
  console.log('ℹ️  Supabase credentials not set yet. Running in offline/mock standby mode.');
} else {
  console.log('✅ Supabase client initialized.');
}

