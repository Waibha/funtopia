/**
 * FUNTOPIA - Supabase Integration Client
 * Manages Supabase Auth, database, and real email verification.
 */
import { createClient } from '@supabase/supabase-js';

const metaEnv = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : (typeof process !== 'undefined' && process.env ? process.env : {});

export const supabaseConfig = {
  url: metaEnv.VITE_SUPABASE_URL || '',
  anonKey: metaEnv.VITE_SUPABASE_ANON_KEY || '',
  isConfigured: Boolean(
    metaEnv.VITE_SUPABASE_URL && metaEnv.VITE_SUPABASE_ANON_KEY
  ),
};

export const supabase = supabaseConfig.isConfigured
  ? createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const SUPABASE_TABLES = {
  PROFILES: 'profiles',
  EVENTS: 'events',
  GAMES: 'games',
  SCORE_TRANSACTIONS: 'score_transactions',
  COIN_TRANSACTIONS: 'coin_transactions',
};

export const getSupabaseStatus = () => {
  return {
    configured: supabaseConfig.isConfigured,
    ready: Boolean(supabase),
    url: supabaseConfig.url || null,
    message: supabaseConfig.isConfigured
      ? 'Connected to Supabase endpoint.'
      : 'Supabase credentials missing: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be provided in .env for live email delivery and verification.',
  };
};
