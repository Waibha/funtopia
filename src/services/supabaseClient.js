/**
 * FUNTOPIA - Supabase Integration Client
 * Prepares the application for live Supabase database and real-time event streaming.
 */

// Placeholder for future supabase-js client
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  isConfigured: Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  ),
};

export const SUPABASE_TABLES = {
  EVENTS: 'events',
  TEAMS: 'teams',
  GAMES: 'games',
  SCORE_TRANSACTIONS: 'score_transactions',
  EVENT_GAMES: 'event_games',
};

// Hook or service helper ready for database integration
export const getSupabaseStatus = () => {
  return {
    ready: supabaseConfig.isConfigured,
    message: supabaseConfig.isConfigured
      ? 'Connected to Supabase endpoint.'
      : 'Running in Local Indie Studio Mode (Mock Data Store active).',
  };
};
