-- ====================================================================
-- FUNTOPIA DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Supports: USN-based Participant Authentication, Games Catalog with
-- Default Points, Performance Score Ledger, and Virtual Coin Economy.
-- ====================================================================

-- 1. Participants Table (USN-based Unique Identity with Hashed PIN)
CREATE TABLE IF NOT EXISTS public.participants (
  id TEXT PRIMARY KEY,
  usn TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  avatar TEXT DEFAULT '👾',
  coins INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Case-insensitive index for fast USN search and duplicate prevention
CREATE UNIQUE INDEX IF NOT EXISTS participants_usn_upper_idx 
  ON public.participants (UPPER(usn));

-- 2. Games Catalog Table (with Default Points Earned & Entry Cost)
CREATE TABLE IF NOT EXISTS public.games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cost INT NOT NULL DEFAULT 50,
  default_points INT DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Competition Score Transactions (Performance points for Leaderboard)
CREATE TABLE IF NOT EXISTS public.score_transactions (
  id TEXT PRIMARY KEY,
  event_id TEXT,
  participant_id TEXT NOT NULL,
  game_id TEXT NOT NULL,
  points_delta INT NOT NULL,
  note TEXT,
  admin TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS score_tx_participant_idx 
  ON public.score_transactions (participant_id);
CREATE INDEX IF NOT EXISTS score_tx_game_idx 
  ON public.score_transactions (game_id);

-- 4. Virtual Coin Transactions (Audit trail for entry fees & allocations)
CREATE TABLE IF NOT EXISTS public.coin_transactions (
  id TEXT PRIMARY KEY,
  participant_id TEXT NOT NULL,
  participant_name TEXT,
  game_id TEXT,
  game_name TEXT,
  amount_delta INT NOT NULL,
  new_balance INT NOT NULL,
  type TEXT NOT NULL,
  reason TEXT,
  admin TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS coin_tx_participant_idx 
  ON public.coin_transactions (participant_id);

-- 5. System Settings (Admin Configurable: Starting Coins, etc.)
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.score_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Transparent Public Access Policies for Tournament Operations
DO $$
BEGIN
  -- Participants policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'participants' AND policyname = 'Public read participants') THEN
    CREATE POLICY "Public read participants" ON public.participants FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'participants' AND policyname = 'Public write participants') THEN
    CREATE POLICY "Public write participants" ON public.participants FOR ALL USING (true);
  END IF;

  -- Games policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'games' AND policyname = 'Public read games') THEN
    CREATE POLICY "Public read games" ON public.games FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'games' AND policyname = 'Public write games') THEN
    CREATE POLICY "Public write games" ON public.games FOR ALL USING (true);
  END IF;

  -- Score transactions policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'score_transactions' AND policyname = 'Public read score_transactions') THEN
    CREATE POLICY "Public read score_transactions" ON public.score_transactions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'score_transactions' AND policyname = 'Public write score_transactions') THEN
    CREATE POLICY "Public write score_transactions" ON public.score_transactions FOR ALL USING (true);
  END IF;

  -- Coin transactions policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coin_transactions' AND policyname = 'Public read coin_transactions') THEN
    CREATE POLICY "Public read coin_transactions" ON public.coin_transactions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coin_transactions' AND policyname = 'Public write coin_transactions') THEN
    CREATE POLICY "Public write coin_transactions" ON public.coin_transactions FOR ALL USING (true);
  END IF;

  -- System settings policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_settings' AND policyname = 'Public read system_settings') THEN
    CREATE POLICY "Public read system_settings" ON public.system_settings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_settings' AND policyname = 'Public write system_settings') THEN
    CREATE POLICY "Public write system_settings" ON public.system_settings FOR ALL USING (true);
  END IF;
END $$;
