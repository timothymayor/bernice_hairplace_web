import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env?.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Browser client (publishable/anon key; data access is limited by row-level security). Null when not configured. */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
      })
    : null;
