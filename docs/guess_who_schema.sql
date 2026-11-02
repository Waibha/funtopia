-- ============================================================================
-- FUNTOPIA GUESS WHO? SUPABASE DATABASE & REALTIME SCHEMA (v2.1 SECURE SCORING)
-- ============================================================================
-- 
-- Run this SQL in your Supabase Project SQL Editor to provision:
-- 1. Coordinator Registry (`gw_coordinators`) for genuine server-side authorization
-- 2. Authoritative game state table for cross-device sync (Admin Laptop <-> Player Laptop)
-- 3. Turn events table with unique session/slot constraint (Prevents duplicate scoring)
-- 4. Atomic PostgreSQL RPC `gw_submit_turn` with:
--    - Genuine coordinator authorization check
--    - search_path = public, pg_temp hardening
--    - Row-level locking (FOR UPDATE)
--    - Idempotency via UNIQUE (session_id, slot_number)
--    - Server-side score arithmetic and early-win (>= 7 points) termination
-- 5. Player scoreboard table
-- 6. Run attempts history archive
-- 7. Question library table and sanitized public view
-- 8. Row Level Security (RLS) policies and Revocation of anon execute
-- 9. Supabase Realtime publication
-- ============================================================================

-- 1. COORDINATOR REGISTRY TABLE
-- Defines authorized coordinator identities for server-side RPC access control
CREATE TABLE IF NOT EXISTS public.gw_coordinators (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'coordinator' CHECK (role IN ('coordinator', 'lead_coordinator', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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
  reveal_type TEXT NOT NULL DEFAULT 'crop',
  reveal_metadata JSONB,
  reveal_level INTEGER NOT NULL DEFAULT 1,
  is_displayed BOOLEAN NOT NULL DEFAULT false,
  feedback JSONB,
  result_message TEXT,
  updated_at BIGINT NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint
);

-- Seed initial default authoritative state row
INSERT INTO public.gw_game_state (
  id, session_id, player_name, is_game_active, is_game_ended, is_winner,
  current_slot, score, final_score, total_questions, reveal_type, reveal_level, is_displayed, updated_at
)
VALUES (
  'active_session', 'session-init', 'Contender', false, false, false,
  1, 0, 0, 12, 'crop', 1, false, (extract(epoch from now()) * 1000)::bigint
)
ON CONFLICT (id) DO UPDATE SET
  final_score = COALESCE(public.gw_game_state.final_score, 0),
  reveal_type = COALESCE(public.gw_game_state.reveal_type, 'crop');

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

-- 6. CUSTOM / MASTER QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.gw_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  prompt TEXT,
  correct_answer TEXT NOT NULL,
  clue TEXT,
  image_url TEXT,
  dialogue_text TEXT,
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
CREATE POLICY "Coordinators view own record" ON public.gw_coordinators
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- 2. gw_game_state Policies
CREATE POLICY "Public read sanitized game state" ON public.gw_game_state
  FOR SELECT USING (true);

CREATE POLICY "Coordinator write authoritative game state" ON public.gw_game_state
  FOR ALL USING (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.gw_coordinators c WHERE c.user_id = auth.uid()) OR
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('coordinator', 'admin')
  )
  WITH CHECK (
    updated_at >= COALESCE((SELECT s.updated_at FROM public.gw_game_state s WHERE s.id = 'active_session'), 0)
  );

-- 3. gw_turn_events Policies (Immutable Audit Log)
-- Ordinary users and players cannot insert, modify, or delete turn events directly
CREATE POLICY "Public read turn events" ON public.gw_turn_events
  FOR SELECT USING (true);

CREATE POLICY "Coordinator insert turn events" ON public.gw_turn_events
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.gw_coordinators c WHERE c.user_id = auth.uid()) OR
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('coordinator', 'admin')
  );

-- 4. gw_players Policies
CREATE POLICY "Public read player leaderboard" ON public.gw_players
  FOR SELECT USING (true);

CREATE POLICY "Coordinator update player scores" ON public.gw_players
  FOR ALL USING (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.gw_coordinators c WHERE c.user_id = auth.uid()) OR
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('coordinator', 'admin')
  );

-- 5. gw_attempts Policies
CREATE POLICY "Public read attempts archive" ON public.gw_attempts
  FOR SELECT USING (true);

CREATE POLICY "Coordinator archive completed runs" ON public.gw_attempts
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.gw_coordinators c WHERE c.user_id = auth.uid()) OR
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('coordinator', 'admin')
  );

-- 6. gw_questions Security Policy
CREATE POLICY "Restrict raw questions access to coordinators" ON public.gw_questions
  FOR ALL USING (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM public.gw_coordinators c WHERE c.user_id = auth.uid()) OR
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('coordinator', 'admin')
  );

-- Public sanitized view for questions (omits correct_answer and clue)
CREATE OR REPLACE VIEW public.gw_public_questions AS
  SELECT id, category, title, prompt, image_url, dialogue_text, reveal_type, reveal_metadata, is_custom, created_at
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
  p_next_reveal_metadata JSONB DEFAULT NULL
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
  -- Explicitly validates that the caller has coordinator privileges.
  -- Ordinary authenticated users and anonymous clients are REJECTED.
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

  -- 10. Check victory & completion conditions server-side
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

    -- Update authoritative state
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
REVOKE ALL ON FUNCTION public.gw_submit_turn(TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.gw_submit_turn(TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, JSONB) FROM anon;

-- GRANT EXECUTE EXCLUSIVELY TO AUTHENTICATED AND SERVICE ROLE
GRANT EXECUTE ON FUNCTION public.gw_submit_turn(TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, JSONB) TO authenticated, service_role;

-- ============================================================================
-- SUPABASE REALTIME CONFIGURATION
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'gw_game_state'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.gw_game_state;
  END IF;
END $$;
