import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://vuppljzfwkflprwwbboe.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_sPn7eP0Af7FHDjBWb-wfGg_MFCQhyya';

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  supabaseAnonKey;

// Public client for browser / client components
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Admin / Service client for server-side API routes (bypasses RLS)
export const supabaseAdmin =
  typeof window === 'undefined'
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : supabase;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

