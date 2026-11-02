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
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured. Check .env file.') }),
      signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured. Check .env file.') }),
      signOut: async () => ({ error: null }),
    },
    from: (table) => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        limit: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      upsert: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
    rpc: () => Promise.resolve({ data: null, error: new Error('RPC unavailable in offline mode.') }),
    channel: () => ({
      on: function() { return this; },
      subscribe: function(callback) {
        if (typeof callback === 'function') callback('SUBSCRIBED');
        return this;
      },
      send: () => Promise.resolve('ok'),
    }),
    removeChannel: () => Promise.resolve('ok'),
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

/**
 * Checks Supabase connection status and verifies whether the Guess Who schema is reachable.
 */
export const checkSupabaseConnection = async () => {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Supabase credentials missing. Running in offline/demo mode.',
    };
  }

  try {
    // Probe authoritative game state table
    const { error } = await supabase.from('gw_game_state').select('id', { count: 'exact', head: true });
    if (!error) {
      return { connected: true, note: 'Connected to Supabase (Guess Who schema verified)' };
    }
    if (error && (error.code === '42P01' || error.message?.includes('does not exist'))) {
      return { connected: true, note: 'Connected to Supabase project (ready for schema migration)' };
    }
    return { connected: true, note: `Connected to Supabase (${error.message || 'Ready'})` };
  } catch (err) {
    return {
      connected: false,
      message: err.message || 'Unable to connect to Supabase.',
    };
  }
};

/**
 * Coordinator authentication helpers for verified administrative operations.
 */
export const signInCoordinator = async ({ email, password }) => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: new Error('Supabase is not configured.') };
  }
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOutCoordinator = async () => {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }
  return await supabase.auth.signOut();
};

export const getCoordinatorSession = async () => {
  if (!isSupabaseConfigured()) {
    return { session: null, user: null };
  }
  const { data } = await supabase.auth.getSession();
  return { session: data?.session || null, user: data?.session?.user || null };
};

export const onCoordinatorAuthStateChange = (callback) => {
  if (!isSupabaseConfigured()) {
    return { unsubscribe: () => {} };
  }
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (typeof callback === 'function') {
      callback(event, session);
    }
  });
  return data?.subscription || { unsubscribe: () => {} };
};
