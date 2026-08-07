import { createClient } from '@supabase/supabase-js';

// SERVER-ONLY. Never import this from a 'use client' file — it uses the
// Supabase service role key, which bypasses RLS entirely. It only exists so
// API routes can create/manage staff auth accounts (something the anon key
// used everywhere else in the app cannot do).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseAdminConfigured = !!(supabaseUrl && serviceRoleKey);

export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient(supabaseUrl!, serviceRoleKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;
