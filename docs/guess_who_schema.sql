-- ============================================================================
-- FUNTOPIA GUESS WHO? SUPABASE DATABASE & REALTIME SCHEMA (v2.2 COMPLETE)
-- ============================================================================
-- 
-- Run this migration in your Supabase Project SQL Editor or via Supabase CLI to provision:
-- 1. Coordinator Registry (`gw_coordinators`) for genuine server-side authorization
-- 2. Helper function `gw_register_coordinator_by_email` to easily register coordinator UIDs
-- 3. Authoritative game state table (`gw_game_state`) for cross-laptop sync (Admin Laptop <-> Projector Laptop)
--    with full support for image puzzles, dialogues, and song clues (song_clue_text, subtype)
-- 4. Turn events table (`gw_turn_events`) with unique session/slot constraint (Prevents duplicate scoring)
-- 5. Atomic PostgreSQL RPC `gw_submit_turn` with:
--    - Genuine coordinator authorization check (checks auth.uid in gw_coordinators or JWT app_metadata)
--    - search_path = public, pg_temp hardening
--    - Row-level locking (FOR UPDATE)
--    - Idempotency via UNIQUE (session_id, slot_number)
--    - Server-side score arithmetic and early-win (>= 7 points) termination
--    - Advancement support for all puzzle types including song clues
-- 6. Player scoreboard table (`gw_players`)
-- 7. Run attempts history archive (`gw_attempts`)
-- 8. Question library table (`gw_questions`) and sanitized public view (`gw_public_questions`)
-- 9. Row Level Security (RLS) policies and Revocation of anon execute
-- 10. Supabase Realtime publication on `gw_game_state`
-- ============================================================================

-- 1. COORDINATOR REGISTRY TABLE
-- Defines authorized coordinator identities for server-side RPC access control
CREATE TABLE IF NOT EXISTS public.gw_coordinators (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'coordinator' CHECK (role IN ('coordinator', 'lead_coordinator', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Explicitly drop any existing overloads to guarantee no insecure signature remains
DROP FUNCTION IF EXISTS public.gw_register_coordinator_by_email(TEXT);
DROP FUNCTION IF EXISTS public.gw_register_coordinator_by_email(TEXT, TEXT);

-- Server-side helper function strictly for administrative / service_role provisioning
CREATE OR REPLACE FUNCTION public.gw_register_coordinator_by_email(
  p_email TEXT,
  p_role TEXT DEFAULT 'coordinator'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_uid UUID;
  v_normalized_role TEXT;
BEGIN
  -- 1. STRICT CALLER CHECK: Only service_role or database administrator may execute coordinator provisioning
  -- Note: We check SESSION_USER because inside a SECURITY DEFINER function, CURRENT_USER switches to the owner (postgres).
  -- SESSION_USER remains 'authenticator' for PostgREST calls and 'postgres' for Supabase Dashboard SQL Editor calls.
  IF NOT (
    COALESCE(auth.role(), '') = 'service_role' OR
    SESSION_USER IN ('postgres', 'supabase_admin')
  ) THEN
    RAISE EXCEPTION 'Authorization denied: service_role required.';
  END IF;

  -- 2. EXPLICIT ROLE ALLOWLIST VALIDATION: Prevent arbitrary or unrecognized privileges
  v_normalized_role := lower(trim(p_role));
  IF v_normalized_role NOT IN ('coordinator', 'lead_coordinator', 'admin') THEN
    RAISE EXCEPTION 'Invalid role: %. Permitted roles are coordinator, lead_coordinator, admin.', p_role;
  END IF;

  -- 3. SCHEMA-QUALIFIED USER LOOKUP
  SELECT id INTO v_uid FROM auth.users WHERE email = lower(trim(p_email));
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'User with email % not found in auth.users. Please create the user in Supabase Auth first.', p_email;
  END IF;

  -- 4. INSERT OR UPDATE IN COORDINATOR REGISTRY
  INSERT INTO public.gw_coordinators (user_id, role)
  VALUES (v_uid, v_normalized_role)
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
END;
$$;

-- COMPLETE PRIVILEGE LOCKDOWN: Revoke execute from PUBLIC, anon, and authenticated
REVOKE ALL ON FUNCTION public.gw_register_coordinator_by_email(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.gw_register_coordinator_by_email(TEXT, TEXT) FROM anon;
REVOKE ALL ON FUNCTION public.gw_register_coordinator_by_email(TEXT, TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.gw_register_coordinator_by_email(TEXT, TEXT) TO service_role, postgres;

-- 2. AUTHORITATIVE GAME STATE TABLE (Single active row: id = 'active_session')
-- Used by Supabase Realtime to synchronize Admin Laptop to Player/Projector Laptop
CREATE TABLE IF NOT EXISTS public.gw_game_state (
  id TEXT PRIMARY KEY DEFAULT 'active_session',
  session_id TEXT NOT NULL DEFAULT 'session-default',
  player_name TEXT NOT NULL DEFAULT 'Contender',
  is_game_active BOOLEAN NOT NULL DEFAULT false,
  is_game_ended BOOLEAN NOT NULL DEFAULT false,
  is_winner BOOLEAN NOT NULL DEFAULT false,
  current_slot INTEGER NOT NULL DEFAULT 1,
  score INTEGER NOT NULL DEFAULT 0,
  final_score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 12,
  image_url TEXT,
  dialogue_text TEXT,
  song_clue_text TEXT,
  subtype TEXT,
  reveal_type TEXT NOT NULL DEFAULT 'crop',
  reveal_metadata JSONB,
  reveal_level INTEGER NOT NULL DEFAULT 1,
  is_displayed BOOLEAN NOT NULL DEFAULT false,
  feedback JSONB,
  result_message TEXT,
  updated_at BIGINT NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint
);

-- Ensure newly added columns exist if updating an existing schema
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gw_game_state' AND column_name = 'song_clue_text') THEN
    ALTER TABLE public.gw_game_state ADD COLUMN song_clue_text TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gw_game_state' AND column_name = 'subtype') THEN
    ALTER TABLE public.gw_game_state ADD COLUMN subtype TEXT;
  END IF;
END $$;

-- Seed initial default authoritative state row
INSERT INTO public.gw_game_state (
  id, session_id, player_name, is_game_active, is_game_ended, is_winner,
  current_slot, score, final_score, total_questions, reveal_type, reveal_level, is_displayed, updated_at
)
VALUES (
  'active_session', 'session-init', 'Contender', false, false, false,
  1, 0, 0, 12, 'crop', 1, false, (extract(epoch from now()) * 1000)::bigint
)
ON CONFLICT (id) DO NOTHING;

-- 3. TURN EVENTS TABLE (ATOMIC SCORING LOG & IDEMPOTENCY KEY)
-- Enforces UNIQUE (session_id, slot_number) at the database layer.
CREATE TABLE IF NOT EXISTS public.gw_turn_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  slot_number INTEGER NOT NULL,
  player_name TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('correct', 'wrong', 'skip')),
  points_awarded INTEGER NOT NULL CHECK (points_awarded IN (0, 1)),
  running_score INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_gw_session_slot UNIQUE (session_id, slot_number)
);

CREATE INDEX IF NOT EXISTS idx_gw_turn_events_session_slot 
  ON public.gw_turn_events (session_id, slot_number);

-- 4. PLAYERS TABLE
CREATE TABLE IF NOT EXISTS public.gw_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  correct_count INTEGER NOT NULL DEFAULT 0,
  wrong_count INTEGER NOT NULL DEFAULT 0,
  skipped_count INTEGER NOT NULL DEFAULT 0,
  total_points INTEGER NOT NULL DEFAULT 0,
  is_qualified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. ATTEMPTS / RUNS ARCHIVE TABLE
CREATE TABLE IF NOT EXISTS public.gw_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  final_score INTEGER NOT NULL DEFAULT 0,
  is_winner BOOLEAN NOT NULL DEFAULT false,
  is_early_win BOOLEAN NOT NULL DEFAULT false,
  slots_played INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. QUESTIONS TABLE (RAW DATABASE - PROTECTED)
CREATE TABLE IF NOT EXISTS public.gw_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  prompt TEXT,
  correct_answer TEXT NOT NULL,
  clue TEXT,
  image_url TEXT,
  dialogue_text TEXT,
  song_clue_text TEXT,
  subtype TEXT,
  reveal_type TEXT NOT NULL DEFAULT 'crop',
  reveal_metadata JSONB,
  is_custom BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.gw_coordinators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gw_game_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gw_turn_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gw_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gw_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gw_questions ENABLE ROW LEVEL SECURITY;

-- 1. gw_coordinators Policies
DROP POLICY IF EXISTS "Coordinators view own record" ON public.gw_coordinators;
CREATE POLICY "Coordinators view own record" ON public.gw_coordinators
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- 2. gw_game_state Policies
-- Public / Projector reads sanitized state
DROP POLICY IF EXISTS "Public read sanitized game state" ON public.gw_game_state;
CREATE POLICY "Public read sanitized game state" ON public.gw_game_state
  FOR SELECT USING (true);

-- Authenticated coordinators or service role write authoritative state
DROP POLICY IF EXISTS "Coordinator write authoritative game state" ON public.gw_game_state;
CREATE POLICY "Coordinator write authoritative game state" ON public.gw_game_state
  FOR ALL USING (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.gw_coordinators c WHERE c.user_id = auth.uid()) OR
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('coordinator', 'admin')
  )
  WITH CHECK (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.gw_coordinators c WHERE c.user_id = auth.uid()) OR
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('coordinator', 'admin')
  );

-- 3. gw_turn_events Policies (Immutable Audit Log)
-- Ordinary users and players cannot insert, modify, or delete turn events directly
DROP POLICY IF EXISTS "Public read turn events" ON public.gw_turn_events;
CREATE POLICY "Public read turn events" ON public.gw_turn_events
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Coordinator insert turn events" ON public.gw_turn_events;
CREATE POLICY "Coordinator insert turn events" ON public.gw_turn_events
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.gw_coordinators c WHERE c.user_id = auth.uid()) OR
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('coordinator', 'admin')
  );

-- 4. gw_players Policies
DROP POLICY IF EXISTS "Public read player leaderboard" ON public.gw_players;
CREATE POLICY "Public read player leaderboard" ON public.gw_players
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Coordinator update player scores" ON public.gw_players;
CREATE POLICY "Coordinator update player scores" ON public.gw_players
  FOR ALL USING (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.gw_coordinators c WHERE c.user_id = auth.uid()) OR
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('coordinator', 'admin')
  );

-- 5. gw_attempts Policies
DROP POLICY IF EXISTS "Public read attempts archive" ON public.gw_attempts;
CREATE POLICY "Public read attempts archive" ON public.gw_attempts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Coordinator archive completed runs" ON public.gw_attempts;
CREATE POLICY "Coordinator archive completed runs" ON public.gw_attempts
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.gw_coordinators c WHERE c.user_id = auth.uid()) OR
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('coordinator', 'admin')
  );

-- 6. gw_questions Security Policy
DROP POLICY IF EXISTS "Restrict raw questions access to coordinators" ON public.gw_questions;
CREATE POLICY "Restrict raw questions access to coordinators" ON public.gw_questions
  FOR ALL USING (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.gw_coordinators c WHERE c.user_id = auth.uid()) OR
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('coordinator', 'admin')
  );

-- Public sanitized view for questions (omits correct_answer and clue)
-- Uses security_barrier = true to prevent query planner optimization pushdown leaks
-- Uses security_invoker = false (default) so anonymous/authenticated players can query
-- public question metadata through the view without needing direct access to gw_questions
CREATE OR REPLACE VIEW public.gw_public_questions
WITH (security_barrier = true) AS
  SELECT id, category, title, prompt, image_url, dialogue_text, song_clue_text, subtype, reveal_type, reveal_metadata, is_custom, created_at
  FROM public.gw_questions;

GRANT SELECT ON public.gw_public_questions TO anon, authenticated;

-- ============================================================================
-- ATOMIC POSTGRESQL SCORING RPC: gw_submit_turn
-- ============================================================================

CREATE OR REPLACE FUNCTION public.gw_submit_turn(
  p_session_id TEXT,
  p_slot_number INTEGER,
  p_result TEXT,
  p_next_image_url TEXT DEFAULT NULL,
  p_next_dialogue_text TEXT DEFAULT NULL,
  p_next_reveal_type TEXT DEFAULT 'crop',
  p_next_reveal_metadata JSONB DEFAULT NULL,
  p_next_song_clue_text TEXT DEFAULT NULL,
  p_next_subtype TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_state public.gw_game_state%ROWTYPE;
  v_points INTEGER := 0;
  v_new_score INTEGER := 0;
  v_is_early_win BOOLEAN := false;
  v_is_final BOOLEAN := false;
  v_is_ended BOOLEAN := false;
  v_is_winner BOOLEAN := false;
  v_result_message TEXT := NULL;
  v_feedback JSONB := NULL;
  v_next_slot INTEGER := 1;
  v_now BIGINT;
BEGIN
  v_now := (extract(epoch from now()) * 1000)::bigint;

  -- 1. SERVER-SIDE COORDINATOR AUTHORIZATION CHECK
  -- Validates that the caller has coordinator privileges.
  -- Anonymous callers and regular authenticated users without coordinator role are REJECTED.
  IF NOT (
    auth.role() = 'service_role' OR
    (
      auth.role() = 'authenticated' AND (
        COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('coordinator', 'admin') OR
        COALESCE(auth.jwt() -> 'app_metadata' ->> 'is_coordinator', 'false') = 'true' OR
        EXISTS (
          SELECT 1 FROM public.gw_coordinators c 
          WHERE c.user_id = auth.uid()
        )
      )
    )
  ) THEN
    RAISE EXCEPTION 'Authorization denied: only authenticated event coordinators can score turns.';
  END IF;

  -- 2. Validate result input
  IF p_result NOT IN ('correct', 'wrong', 'skip') THEN
    RAISE EXCEPTION 'Invalid result: %. Must be correct, wrong, or skip.', p_result;
  END IF;

  -- 3. Row lock on active session to serialize scoring transactions
  SELECT * INTO v_state
  FROM public.gw_game_state
  WHERE id = 'active_session'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Active session row not found.';
  END IF;

  -- 4. Validate active session ID (Rejects stale requests from prior sessions)
  IF v_state.session_id <> p_session_id THEN
    RAISE EXCEPTION 'Stale session ID: expected %, got %', v_state.session_id, p_session_id;
  END IF;

  -- 5. Reject if game is already ended
  IF v_state.is_game_ended THEN
    RAISE EXCEPTION 'Scoring rejected: session % is already completed.', p_session_id;
  END IF;

  -- 6. Validate slot number matches current slot
  IF v_state.current_slot <> p_slot_number THEN
    RAISE EXCEPTION 'Slot mismatch: active slot is %, requested scoring for %', v_state.current_slot, p_slot_number;
  END IF;

  -- 7. Check slot has not already been scored (Idempotency protection)
  IF EXISTS (
    SELECT 1 FROM public.gw_turn_events
    WHERE session_id = p_session_id AND slot_number = p_slot_number
  ) THEN
    RAISE EXCEPTION 'Duplicate submission: slot % in session % has already been scored.', p_slot_number, p_session_id;
  END IF;

  -- 8. Calculate points
  IF p_result = 'correct' THEN
    v_points := 1;
  ELSE
    v_points := 0;
  END IF;
  v_new_score := v_state.score + v_points;

  -- 9. Record turn event in log table
  INSERT INTO public.gw_turn_events (
    session_id, slot_number, player_name, result, points_awarded, running_score, created_at
  ) VALUES (
    p_session_id, p_slot_number, v_state.player_name, p_result, v_points, v_new_score, now()
  );

  -- 10. Check victory & completion conditions server-side (12/7 rules)
  v_is_early_win := (v_new_score >= 7);
  v_is_final := (p_slot_number >= v_state.total_questions);
  v_is_ended := (v_is_early_win OR v_is_final);
  v_is_winner := (v_new_score >= 7);

  -- 11. Update player records in gw_players
  UPDATE public.gw_players
  SET
    correct_count = correct_count + (CASE WHEN p_result = 'correct' THEN 1 ELSE 0 END),
    wrong_count = wrong_count + (CASE WHEN p_result = 'wrong' THEN 1 ELSE 0 END),
    skipped_count = skipped_count + (CASE WHEN p_result = 'skip' THEN 1 ELSE 0 END),
    total_points = total_points + v_points,
    is_qualified = (v_is_winner OR is_qualified),
    updated_at = now()
  WHERE name = v_state.player_name;

  -- 12. Branch: Game Completed vs Advance to Next Puzzle
  IF v_is_ended THEN
    IF v_new_score >= 7 THEN
      v_result_message := 'Congratulations! You Won!';
    ELSIF v_new_score >= 5 THEN
      v_result_message := 'So Close! Just a Little More!';
    ELSE
      v_result_message := 'Good Try! Better Luck Next Time!';
    END IF;

    -- Archive completed run in gw_attempts
    INSERT INTO public.gw_attempts (
      player_name, final_score, is_winner, is_early_win, slots_played, created_at
    ) VALUES (
      v_state.player_name, v_new_score, v_is_winner, v_is_early_win, p_slot_number, now()
    );

    -- Update authoritative state to ended
    UPDATE public.gw_game_state
    SET
      score = v_new_score,
      final_score = v_new_score,
      is_game_active = false,
      is_game_ended = true,
      is_winner = v_is_winner,
      result_message = v_result_message,
      feedback = NULL,
      image_url = NULL,
      dialogue_text = NULL,
      song_clue_text = NULL,
      subtype = NULL,
      is_displayed = false,
      updated_at = v_now
    WHERE id = 'active_session'
    RETURNING * INTO v_state;

  ELSE
    -- Next puzzle advancement
    v_next_slot := p_slot_number + 1;

    -- Build sanitized feedback
    IF p_result = 'skip' THEN
      v_feedback := NULL;
    ELSE
      v_feedback := jsonb_build_object(
        'type', p_result,
        'message', CASE WHEN p_result = 'correct' THEN 'Brilliant! That''s Correct!' ELSE 'Good Try! Let''s Move On!' END,
        'puzzleSlot', p_slot_number,
        'timestamp', v_now
      );
    END IF;

    UPDATE public.gw_game_state
    SET
      score = v_new_score,
      final_score = v_new_score,
      current_slot = v_next_slot,
      image_url = p_next_image_url,
      dialogue_text = p_next_dialogue_text,
      song_clue_text = p_next_song_clue_text,
      subtype = p_next_subtype,
      reveal_type = COALESCE(p_next_reveal_type, 'crop'),
      reveal_metadata = p_next_reveal_metadata,
      reveal_level = 1,
      is_displayed = true,
      feedback = v_feedback,
      updated_at = v_now
    WHERE id = 'active_session'
    RETURNING * INTO v_state;
  END IF;

  RETURN to_jsonb(v_state);
END;
$$;

-- SECURITY HARDENING: REVOKE FROM PUBLIC & ANON
REVOKE ALL ON FUNCTION public.gw_submit_turn(TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.gw_submit_turn(TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT) FROM anon;

-- GRANT EXECUTE EXCLUSIVELY TO AUTHENTICATED AND SERVICE ROLE
GRANT EXECUTE ON FUNCTION public.gw_submit_turn(TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT) TO authenticated, service_role;

-- ============================================================================
-- SUPABASE REALTIME CONFIGURATION
-- ============================================================================

ALTER TABLE public.gw_game_state REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'gw_game_state'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.gw_game_state;
  END IF;
END $$;
