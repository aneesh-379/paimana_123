import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase URL and Anon Key from environment variables or default configured credentials
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://qwuqufpkbphtmvfnavhx.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Ys68q8wOha45zO6PfZCbog_Ol9zZZby';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));

let clientInstance = null;

try {
  if (isSupabaseConfigured) {
    clientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'paimana_supabase_auth'
      }
    });
  }
} catch (err) {
  console.warn('[Supabase Client] Failed to initialize Supabase client:', err);
}

export const supabase = clientInstance;
