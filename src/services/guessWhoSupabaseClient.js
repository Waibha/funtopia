/**
 * ============================================================================
 * FUNTOPIA - Dedicated Guess Who? Supabase Integration Client
 * ============================================================================
 * 
 * Manages Supabase Auth, database, Realtime subscriptions, and offline fallbacks
 * exclusively for the Guess Who game domain.
 * 
 * Uses independent environment variables:
 * - VITE_GW_SUPABASE_URL
 * - VITE_GW_SUPABASE_ANON_KEY
 * 
 * SECURITY NOTICE:
 * - Only the Public Anon Key (VITE_GW_SUPABASE_ANON_KEY) is used here.
 * - The Supabase Service Role Key must NEVER be placed in client-side code
 *   or prefixed with VITE_ to prevent security leaks.
 * - Database access is governed by Supabase Row Level Security (RLS) policies.
 * - Coordinator auth session uses an isolated storage key ('funtopia_gw_auth_token')
 *   to avoid colliding with the Championship Platform auth session.
 */

import { createClient } from '@supabase/supabase-js';

const metaEnv = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : (typeof process !== 'undefined' && process.env ? process.env : {});

const gwSupabaseUrl = metaEnv.VITE_GW_SUPABASE_URL || '';
const gwSupabaseAnonKey = metaEnv.VITE_GW_SUPABASE_ANON_KEY || '';

/**
 * Validates the Guess Who Supabase environment variable configuration.
 * Returns detailed diagnostic errors and warnings for setup guidance.
 */
export const validateGwSupabaseConfig = () => {
  const errors = [];
  const warnings = [];

  if (!gwSupabaseUrl || gwSupabaseUrl.trim() === '') {
    errors.push('VITE_GW_SUPABASE_URL is missing. Please set it in your .env or hosting environment.');
  } else {
    try {
      const parsed = new URL(gwSupabaseUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        errors.push(`VITE_GW_SUPABASE_URL must use http:// or https:// protocol (got "${parsed.protocol}").`);
      }
      if (parsed.hostname === 'your-project.supabase.co' || parsed.hostname.includes('your-gw-project')) {
        warnings.push('VITE_GW_SUPABASE_URL contains a template placeholder value.');
      }
    } catch {
      errors.push(`VITE_GW_SUPABASE_URL is not a valid URL: "${gwSupabaseUrl}".`);
    }
  }

  if (!gwSupabaseAnonKey || gwSupabaseAnonKey.trim() === '') {
    errors.push('VITE_GW_SUPABASE_ANON_KEY is missing. Please set it in your .env or hosting environment.');
  } else {
    if (gwSupabaseAnonKey === 'your-anon-key-here' || gwSupabaseAnonKey.includes('your-gw-anon-key')) {
      warnings.push('VITE_GW_SUPABASE_ANON_KEY contains a template placeholder value.');
    } else if (gwSupabaseAnonKey.length < 20) {
      warnings.push('VITE_GW_SUPABASE_ANON_KEY appears unusually short (expected JWT or publishable key).');
    }
  }

  return {
    valid: errors.length === 0 && warnings.length === 0,
    isConfigured: errors.length === 0 && warnings.length === 0,
    hasErrors: errors.length > 0,
    errors,
    warnings,
  };
};

/**
 * Returns true if the dedicated Guess Who Supabase project has valid, non-placeholder credentials.
 */
export const isGwSupabaseConfigured = () => {
  const validation = validateGwSupabaseConfig();
  return !validation.hasErrors && validation.warnings.length === 0;
};

export const gwSupabaseConfig = {
  url: gwSupabaseUrl,
  anonKey: gwSupabaseAnonKey,
  isConfigured: isGwSupabaseConfigured(),
};

// Fallback mock client for clean local boot before user provides their Guess Who credentials
const createGwFallbackClient = () => {
  const validation = validateGwSupabaseConfig();
  if (validation.hasErrors || validation.warnings.length > 0) {
    const hint = validation.errors[0] || validation.warnings[0] || 'Set VITE_GW_SUPABASE_URL and VITE_GW_SUPABASE_ANON_KEY in .env.';
    console.warn(`[FUNTOPIA GUESS WHO] Operating in local offline fallback mode: ${hint}`);
  }

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: new Error('Guess Who Supabase not configured. Check VITE_GW_SUPABASE_URL and VITE_GW_SUPABASE_ANON_KEY in .env.')
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: new Error('Guess Who Supabase not configured. Check .env file.')
      }),
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
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
      upsert: () => Promise.resolve({ data: null, error: null }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: new Error('Storage unavailable in offline mode.') }),
        getPublicUrl: (filePath) => ({ data: { publicUrl: filePath } }),
      }),
    },
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

export const gwSupabase = isGwSupabaseConfigured()
  ? createClient(gwSupabaseUrl, gwSupabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'funtopia_gw_auth_token',
      },
    })
  : createGwFallbackClient();

export const GW_SUPABASE_TABLES = {
  GW_GAME_STATE: 'gw_game_state',
  GW_COORDINATORS: 'gw_coordinators',
  GW_TURN_EVENTS: 'gw_turn_events',
  GW_PLAYERS: 'gw_players',
  GW_ATTEMPTS: 'gw_attempts',
  GW_QUESTIONS: 'gw_questions',
  GW_PUBLIC_QUESTIONS: 'gw_public_questions',
};

export const getGwSupabaseStatus = () => {
  const validation = validateGwSupabaseConfig();
  return {
    configured: isGwSupabaseConfigured(),
    ready: Boolean(gwSupabase),
    url: gwSupabaseUrl || null,
    validation,
    message: isGwSupabaseConfigured()
      ? 'Connected to dedicated Guess Who Supabase endpoint.'
      : (validation.errors[0] || validation.warnings[0] || 'VITE_GW_SUPABASE_URL and VITE_GW_SUPABASE_ANON_KEY required in .env.'),
  };
};

/**
 * Checks Guess Who Supabase connection and table accessibility.
 */
export const checkGwSupabaseConnection = async () => {
  if (!isGwSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Guess Who Supabase credentials missing. Running in offline/fallback mode.',
    };
  }

  try {
    const { error } = await gwSupabase
      .from(GW_SUPABASE_TABLES.GW_GAME_STATE)
      .select('id', { count: 'exact', head: true });

    if (!error) {
      return { connected: true, note: 'Connected to Guess Who Supabase (schema verified)' };
    }
    if (error && (error.code === '42P01' || error.message?.includes('does not exist'))) {
      return { connected: true, note: 'Connected to Guess Who Supabase project (ready for schema migration)' };
    }
    return { connected: true, note: `Connected to Guess Who Supabase (${error.message || 'Ready'})` };
  } catch (err) {
    return {
      connected: false,
      message: err.message || 'Unable to connect to Guess Who Supabase.',
    };
  }
};

/**
 * Coordinator authentication helpers routed through the dedicated Guess Who client.
 */
export const signInCoordinator = async ({ email, password }) => {
  if (!isGwSupabaseConfigured()) {
    return { data: null, error: new Error('Guess Who Supabase is not configured.') };
  }
  const cleanEmail = String(email || '').trim().toLowerCase();
  return await gwSupabase.auth.signInWithPassword({ email: cleanEmail, password });
};

export const signOutCoordinator = async () => {
  if (!isGwSupabaseConfigured()) {
    return { error: null };
  }
  return await gwSupabase.auth.signOut();
};

export const getCoordinatorSession = async () => {
  if (!isGwSupabaseConfigured()) {
    return { session: null, user: null };
  }
  const { data } = await gwSupabase.auth.getSession();
  return { session: data?.session || null, user: data?.session?.user || null };
};

export const onCoordinatorAuthStateChange = (callback) => {
  if (!isGwSupabaseConfigured()) {
    return { unsubscribe: () => {} };
  }
  const { data } = gwSupabase.auth.onAuthStateChange((event, session) => {
    if (typeof callback === 'function') {
      callback(event, session);
    }
  });
  return data?.subscription || { unsubscribe: () => {} };
};

/**
 * Verifies that an authenticated Supabase user has verified coordinator privileges.
 * Checks both JWT app_metadata claims and the server-side gw_coordinators table.
 */
export const verifyCoordinatorRole = async (user) => {
  if (!user || !user.id) return false;

  // 1. Check JWT app_metadata claims (fast path, no extra network round-trip)
  const appRole = user.app_metadata?.role;
  const isCoord = user.app_metadata?.is_coordinator;
  if (appRole === 'coordinator' || appRole === 'admin' || appRole === 'lead_coordinator' || isCoord === true) {
    return true;
  }

  // 2. Query public.gw_coordinators table under RLS "Coordinators view own record"
  try {
    const { data, error } = await gwSupabase
      .from(GW_SUPABASE_TABLES.GW_COORDINATORS)
      .select('user_id, role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data && data.user_id === user.id) {
      return true;
    }
  } catch (err) {
    console.warn('Coordinator role verification exception:', err);
  }

  return false;
};
