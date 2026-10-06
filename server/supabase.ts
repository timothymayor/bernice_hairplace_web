import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { VercelRequest } from '@vercel/node';

let admin: SupabaseClient | null = null;

/** Service-role client: bypasses RLS, so it must only ever run server-side. Returns null when not configured. */
export const getSupabaseAdmin = (): SupabaseClient | null => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  admin ??= createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
};

/** Resolves the signed-in customer from the `Authorization: Bearer <supabase access token>` header. */
export const getUserFromRequest = async (supabase: SupabaseClient, req: VercelRequest): Promise<User | null> => {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
};
