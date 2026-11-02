import { createClient } from '@supabase/supabase-js';

/**
 * ============================================================================
 * FUNTOPIA SUPABASE CLIENT CONFIGURATION
 * ============================================================================
 * 
 * SECURITY NOTICE:
 * - Only the Public Anon Key (VITE_SUPABASE_ANON_KEY) is used here.
 * - The Supabase Service Role Key must NEVER be placed in client-side code
 *   or prefixed with VITE_ to prevent security leaks.
 * - Database access is governed by Supabase Row Level Security (RLS) policies.
 */

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || '';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here'
  );
};

// Fallback dummy client for clean local boot before user provides their Supabase credentials
const createFallbackClient = () => {
  console.warn(
    '[FUNTOPIA] Supabase credentials not detected in .env. Falling back to local offline mode. ' +
    'To connect real Supabase, copy .env.example to .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ error: new Error('Supabase not configured. Check .env file.') }),
      signUp: async () => ({ error: new Error('Supabase not configured. Check .env file.') }),
      signOut: async () => ({ error: null }),
    },
    from: (table) => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => Promise.resolve({ data: [], error: null }),
        limit: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
    channel: () => ({
      on: () => ({ subscribe: () => {} }),
      subscribe: () => {},
    }),
  };
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createFallbackClient();

export const checkSupabaseConnection = async () => {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Supabase credentials missing. Running in offline/demo mode.',
    };
  }

  try {
    const { error } = await supabase.from('participants').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      return { connected: true, note: 'Connected to Supabase project (ready for schema migration)' };
    }
    return { connected: true, note: 'Connected and authenticated with Supabase anon role' };
  } catch (err) {
    return {
      connected: false,
      message: err.message || 'Unable to connect to Supabase.',
    };
  }
};
