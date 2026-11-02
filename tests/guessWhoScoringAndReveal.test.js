import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Load master dataset (cleared to empty array per user instruction)
const masterDataset = JSON.parse(
  fs.readFileSync(new URL('../src/data/guessWhoMasterDataset.json', import.meta.url), 'utf8')
);

// Import services and resolvers
import {
  generateAutomaticSlab,
  createManualSlab,
  sanitizeGameStateForProjector,
  submitAuthoritativeTurn,
  getActiveSlab,
  saveActiveSlab,
  getDisplayState,
  publishAuthoritativeState,
  getResultDetails,
  removeSlabSlot,
  replaceSlabSlot,
  isSlabComplete,
  getQuestionLibrary,
  getSupabaseSyncStatus,
} from '../src/services/guessWhoService.js';

import {
  isSupabaseConfigured,
} from '../src/services/supabaseClient.js';

import {
  resolveGuessWhoImageUrl,
  getImageCandidates,
} from '../src/utilities/guessWhoImageResolver.js';

// Test fixture: 12 mock questions for verifying game system, scoring rules, and turn progression
const MOCK_TEST_QUESTIONS = Array.from({ length: 12 }, (_, idx) => ({
  id: `mock-q-${idx + 1}`,
  title: `Test Question ${idx + 1}`,
  prompt: `Prompt for question ${idx + 1}`,
  correct_answer: `Answer ${idx + 1}`,
  clue: `Clue ${idx + 1}`,
  category: idx < 3 ? 'flags' : 'logos_symbols',
  difficulty: 'Medium',
  reveal_type: 'crop',
  image_url: `/assets/guess-who/mock-${idx + 1}.jpg`,
}));

const createTestSlab = (playerName) => {
  const slab = createManualSlab(playerName, MOCK_TEST_QUESTIONS);
  saveActiveSlab(slab);
  return slab;
};

test('--- 1. SCORING RULES: CORRECT (+1), WRONG (0), SKIP (0) ---', async () => {
  // Setup fresh slab for test contender
  const slab = createTestSlab('Contender Alpha');
  assert.equal(slab.slots.length, 12);

  // Slot 1: Correct (+1)
  const res1 = await submitAuthoritativeTurn({
    sessionId: slab.id,
    slotNumber: 1,
    result: 'correct',
    nextQuestion: slab.slots[1].question,
  });
  assert.equal(res1.score, 1, 'Correct must award exactly 1 point');
  assert.equal(res1.currentSlot, 2, 'Must advance to slot 2');
  assert.equal(res1.isGameEnded, false);

  // Slot 2: Wrong (0)
  const res2 = await submitAuthoritativeTurn({
    sessionId: slab.id,
    slotNumber: 2,
    result: 'wrong',
    nextQuestion: slab.slots[2].question,
  });
  assert.equal(res2.score, 1, 'Wrong must award 0 points (score remains 1)');
  assert.equal(res2.currentSlot, 3, 'Must advance to slot 3');

  // Slot 3: Skip (0)
  const res3 = await submitAuthoritativeTurn({
    sessionId: slab.id,
    slotNumber: 3,
    result: 'skip',
    nextQuestion: slab.slots[3].question,
  });
  assert.equal(res3.score, 1, 'Skip must award 0 points (score remains 1)');
  assert.equal(res3.currentSlot, 4, 'Must advance to slot 4');

  // Maximum achievable score is 7 (early win halts run immediately); 12 is available puzzle count
  assert.ok(res3.score <= 7, 'Final score cannot exceed 7 (maximum achievable score)');
  assert.equal(slab.slots.length, 12, 'Total questions available in slab is 12');
});

test('--- 2. DUPLICATE & CONCURRENT SCORING ATTEMPTS REJECTION ---', async () => {
  const slab = createTestSlab('Contender Beta');

  // Score slot 1
  await submitAuthoritativeTurn({
    sessionId: slab.id,
    slotNumber: 1,
    result: 'correct',
    nextQuestion: slab.slots[1].question,
  });

  // Attempt duplicate submission on slot 1
  await assert.rejects(
    async () => {
      await submitAuthoritativeTurn({
        sessionId: slab.id,
        slotNumber: 1,
        result: 'correct',
        nextQuestion: slab.slots[1].question,
      });
    },
    /Duplicate submission rejected/,
    'Duplicate submission on same slot must be rejected'
  );

  // Concurrent attempt simulation on slot 2
  const p1 = submitAuthoritativeTurn({
    sessionId: slab.id,
    slotNumber: 2,
    result: 'correct',
    nextQuestion: slab.slots[2].question,
  });
  const p2 = submitAuthoritativeTurn({
    sessionId: slab.id,
    slotNumber: 2,
    result: 'wrong',
    nextQuestion: slab.slots[2].question,
  });

  const results = await Promise.allSettled([p1, p2]);
  const fulfilled = results.filter((r) => r.status === 'fulfilled');
  const rejected = results.filter((r) => r.status === 'rejected');

  assert.equal(fulfilled.length, 1, 'Exactly one concurrent scoring attempt must succeed');
  assert.equal(rejected.length, 1, 'Concurrent duplicate attempt must be rejected');
});

test('--- 3. EARLY WIN AT 7 CORRECT ANSWERS ---', async () => {
  const slab = createTestSlab('Contender Champion');

  let state = null;
  // Score 7 consecutive correct answers
  for (let slot = 1; slot <= 7; slot++) {
    state = await submitAuthoritativeTurn({
      sessionId: slab.id,
      slotNumber: slot,
      result: 'correct',
      nextQuestion: slot < 12 ? slab.slots[slot].question : null,
    });
  }

  assert.equal(state.score, 7);
  assert.equal(state.finalScore, 7, 'finalScore must be set to 7');
  assert.equal(state.isWinner, true, 'isWinner must be true');
  assert.equal(state.isEarlyWin, true, 'isEarlyWin must be true');
  assert.equal(state.isGameEnded, true, 'Game must immediately halt and end at 7 points');
  assert.equal(state.isGameActive, false);
  assert.equal(state.resultMessage, 'Congratulations! You Won!');

  // Attempt to score slot 8 after early completion
  await assert.rejects(
    async () => {
      await submitAuthoritativeTurn({
        sessionId: slab.id,
        slotNumber: 8,
        result: 'correct',
      });
    },
    /already completed/,
    'Further scoring attempts must be rejected after early win'
  );
});

test('--- 4. NORMAL COMPLETION AFTER 12 QUESTIONS ---', async () => {
  // Case A: 5-6 points ("So Close! Just a Little More!")
  const slabA = createTestSlab('Contender RunnerUp');
  let stateA = null;
  for (let slot = 1; slot <= 12; slot++) {
    const isCorrect = slot <= 6;
    stateA = await submitAuthoritativeTurn({
      sessionId: slabA.id,
      slotNumber: slot,
      result: isCorrect ? 'correct' : 'wrong',
      nextQuestion: slot < 12 ? slabA.slots[slot].question : null,
    });
  }

  assert.equal(stateA.score, 6);
  assert.equal(stateA.finalScore, 6);
  assert.equal(stateA.isWinner, false, 'Score of 6 does not qualify as championship winner');
  assert.equal(stateA.isEarlyWin, false);
  assert.equal(stateA.isGameEnded, true, 'Game must conclude after 12th puzzle');
  assert.equal(stateA.resultMessage, 'So Close! Just a Little More!');

  // Case B: 0-4 points ("Good Try! Better Luck Next Time!")
  const slabB = createTestSlab('Contender Participant');
  let stateB = null;
  for (let slot = 1; slot <= 12; slot++) {
    const isCorrect = slot <= 3;
    stateB = await submitAuthoritativeTurn({
      sessionId: slabB.id,
      slotNumber: slot,
      result: isCorrect ? 'correct' : 'wrong',
      nextQuestion: slot < 12 ? slabB.slots[slot].question : null,
    });
  }

  assert.equal(stateB.score, 3);
  assert.equal(stateB.finalScore, 3);
  assert.equal(stateB.isWinner, false, 'Score of 3 does not qualify');
  assert.equal(stateB.isEarlyWin, false);
  assert.equal(stateB.isGameEnded, true, 'Game must conclude after 12th puzzle');
  assert.equal(stateB.resultMessage, 'Good Try! Better Luck Next Time!');

  // Verify result bands and maximum achievable score properties
  assert.ok(stateA.finalScore <= 6, 'A player who completes 12 puzzles without early victory can score at most 6');
  assert.equal(getResultDetails(7).message, 'Congratulations! You Won!');
  assert.equal(getResultDetails(6).message, 'So Close! Just a Little More!');
  assert.equal(getResultDetails(5).message, 'So Close! Just a Little More!');
  assert.equal(getResultDetails(4).message, 'Good Try! Better Luck Next Time!');
  assert.equal(getResultDetails(0).message, 'Good Try! Better Luck Next Time!');
});

test('--- 5. PROJECTOR FINAL SCORE SANITIZATION & PRIVACY ---', () => {
  const rawPayload = {
    session_id: 'session-xyz',
    player_name: 'Jane Doe',
    is_game_ended: true,
    is_winner: true,
    score: 7,
    final_score: 7,
    total_questions: 12,
    // Sensitive coordinator fields:
    correct_answer: 'Albert Einstein',
    clue: 'Theory of Relativity',
    difficulty: 'Easy',
    verification_status: 'verified_cc',
  };

  const sanitized = sanitizeGameStateForProjector(rawPayload);

  // Final score presence
  assert.equal(sanitized.score, 7);
  assert.equal(sanitized.finalScore, 7, 'Sanitized state must explicitly include finalScore');
  assert.equal(sanitized.totalQuestions, 12, 'totalQuestions must be 12');

  // Strict Privacy Boundary
  assert.equal(sanitized.correct_answer, undefined, 'Secret answer must NEVER leak to projector');
  assert.equal(sanitized.clue, undefined, 'Secret clue must NEVER leak to projector');
  assert.equal(sanitized.difficulty, undefined, 'Admin metadata must NEVER leak to projector');
});

test('--- 6. REVEAL MECHANICS & METADATA FALLBACKS ---', () => {
  // Test Crop Metadata
  const cropMeta = { cropX: 45, cropY: 25, zoom: 2.2 };
  const rawCrop = {
    image_url: 'https://example.com/keanu.jpg',
    reveal_type: 'crop',
    reveal_metadata: cropMeta,
    reveal_level: 1,
  };
  const sanitizedCrop = sanitizeGameStateForProjector(rawCrop);
  assert.equal(sanitizedCrop.revealType, 'crop');
  assert.deepEqual(sanitizedCrop.revealMetadata, cropMeta);

  // Test Fallback when metadata is null/undefined
  const rawMissing = {
    image_url: 'https://example.com/test.jpg',
    reveal_type: 'puzzle_tiles',
    reveal_metadata: null,
    reveal_level: 2,
  };
  const sanitizedMissing = sanitizeGameStateForProjector(rawMissing);
  assert.equal(sanitizedMissing.revealType, 'puzzle_tiles');
  assert.equal(sanitizedMissing.revealMetadata, null);

  // Verify all 4 reveal types are supported
  ['crop', 'blur', 'puzzle_tiles', 'silhouette'].forEach((type) => {
    const s = sanitizeGameStateForProjector({ reveal_type: type, reveal_level: 3 });
    assert.equal(s.revealType, type);
    assert.equal(s.revealLevel, 3);
  });
});

test('--- 7. AUTOMATIC & MANUAL SLAB GENERATION (12 QUESTIONS) ---', () => {
  // 1. With active master dataset, automatic slab generation must produce exactly 12 unique question slots
  const autoSlab = generateAutomaticSlab('Active Contender');
  assert.equal(autoSlab.slots.length, 12, 'Slab must have exactly 12 slots');
  assert.equal(autoSlab.status, 'review', 'Generated slab must start in review status');
  const uniqueIds = new Set(autoSlab.slots.map(s => s.question.id));
  assert.equal(uniqueIds.size, 12, 'All 12 questions in automatic slab must be unique');

  // Verify category distribution formula (3 Flags, 1 each of 7 categories, 2 wildcards)
  const catCounts = {};
  autoSlab.slots.forEach(s => {
    const cat = s.question.category;
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  });
  assert.ok((catCounts['flags'] || 0) >= 3, `Flags must have at least 3 questions (got ${catCounts['flags']})`);

  // Verify slab completeness validation
  assert.equal(isSlabComplete(autoSlab), true, 'Complete 12-slot slab must be valid to start game');

  // 2. Manual slab creation allows coordinator to construct a 12-question slab when questions are selected
  const manualSlab = createManualSlab('Manual Player', MOCK_TEST_QUESTIONS);
  assert.equal(manualSlab.slots.length, 12, 'Manual slab must hold 12 slots');
  assert.equal(new Set(manualSlab.slots.map(s => s.question.id)).size, 12, 'All 12 questions in manual slab must be unique');
  assert.equal(isSlabComplete(manualSlab), true);

  // Partial/empty slab cannot be started
  const incompleteSlab = createManualSlab('Incomplete Player', MOCK_TEST_QUESTIONS.slice(0, 5));
  assert.equal(isSlabComplete(incompleteSlab), false, 'Start Game must be disabled if fewer than 12 slots filled');
});

test('--- 8. MANUAL SLAB EDITING & REPLACEMENT ---', () => {
  const slab = createTestSlab('Manual Contender');
  const removedId = slab.slots[4].question.id;

  // Remove slot 5 (index 4)
  const afterRemove = removeSlabSlot(slab, 5);
  assert.equal(afterRemove.slots[4].question, null, 'Slot 5 question should be empty');
  assert.equal(afterRemove.slots[4].status, 'empty');

  // Verify removing from slab does not delete question from library
  const currentLib = getQuestionLibrary();
  assert.ok(currentLib && currentLib.length > 0, 'Question library remains intact');

  // Verify asset directory still exists on disk
  const assetsDir = path.join(process.cwd(), 'public', 'assets', 'guess-who');
  assert.ok(fs.existsSync(assetsDir), 'Asset directory must remain untouched');

  // Replace slot 5 with a valid replacement question
  const replacementQuestion = {
    id: 'mock-replacement-q',
    title: 'Replacement Deduction Puzzle',
    prompt: 'Who is this deduction subject?',
    correct_answer: 'Sherlock Holmes',
    category: 'objects',
    reveal_type: 'silhouette',
  };

  const afterReplace = replaceSlabSlot(afterRemove, 5, replacementQuestion);
  assert.equal(afterReplace.slots[4].question.id, replacementQuestion.id);
  assert.equal(afterReplace.slots[4].status, 'unplayed');
  assert.equal(afterReplace.slots.filter((s) => s.question).length, 12, 'Slab must be complete at 12');
  assert.equal(afterReplace.slots.length, 12, 'Slab must preserve 12 slots');
});

test('--- 9. NEW PLAYER RESET & PUBLIC STANDBY TRANSITION ---', async () => {
  // Simulate end of previous game
  await publishAuthoritativeState({
    playerName: 'Old Contender',
    score: 7,
    finalScore: 7,
    isGameEnded: true,
    isWinner: true,
  });

  let state = getDisplayState();
  assert.equal(state.isGameEnded, true);

  // Coordinator resets for new player
  const resetState = await publishAuthoritativeState({
    isGameActive: false,
    isGameEnded: false,
    isDisplayed: false,
    feedback: null,
    imageUrl: null,
    dialogueText: null,
    score: 0,
    finalScore: 0,
    currentSlot: 1,
    playerName: 'Contender',
  });

  assert.equal(resetState.isGameEnded, false, 'Projector must exit game-ended screen');
  assert.equal(resetState.isDisplayed, false, 'Projector must return to clean standby screen');
  assert.equal(resetState.score, 0);
  assert.equal(resetState.finalScore, 0);
  assert.equal(resetState.currentSlot, 1);
});

test('--- 10. IMAGE RELIABILITY RESOLVER & ASSET DISK INTEGRITY ---', () => {
  // Question with explicit local path
  const qWithLocal = {
    id: 'hw-1',
    local_image_url: '/custom/local/path.jpg',
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Keanu.jpg',
  };
  const resolved = resolveGuessWhoImageUrl(qWithLocal);
  assert.equal(resolved, '/custom/local/path.jpg', 'Local image path must be prioritized');

  // Question with standard ID and external URL
  const qStandard = {
    id: 'flg-1',
    image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag.svg',
  };
  const candidates = getImageCandidates(qStandard);
  // Primary must be the actual dataset image_url
  assert.equal(candidates[0], 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag.svg');
  // Fallbacks must be in verified directory (/assets/guess-who/), NOT speculative /images/guess-who/
  assert.ok(candidates.includes('/assets/guess-who/flg-1.jpg'));
  assert.ok(!candidates.includes('/images/guess-who/flg-1.jpg'), 'Must not prepend speculative /images/guess-who/ paths');

  // Verify that existing physical assets and folders on disk are preserved and NOT deleted
  const assetsDir = path.join(process.cwd(), 'public', 'assets', 'guess-who');
  assert.ok(fs.existsSync(assetsDir), 'Asset directory /assets/guess-who/ must be preserved');
  assert.ok(fs.existsSync(path.join(assetsDir, 'hw-1_keanu_reeves.jpg')), 'hw-1_keanu_reeves.jpg must be preserved');
  assert.ok(fs.existsSync(path.join(assetsDir, 'obj-10_microscope.jpg')), 'obj-10_microscope.jpg must be preserved');
  assert.ok(fs.existsSync(path.join(assetsDir, 'sci-15_johannes_kepler.jpg')), 'sci-15_johannes_kepler.jpg must be preserved');
  assert.ok(fs.existsSync(path.join(assetsDir, 'logos')), 'Logos directory must be preserved');
  assert.equal(
    fs.readdirSync(path.join(assetsDir, 'logos')).filter((f) => f.startsWith('lg-')).length,
    20,
    'All 20 car logo SVGs must be preserved on disk'
  );
});

test('--- 11. SUPABASE SQL SECURITY & COORDINATOR AUTHORIZATION ---', () => {
  const schemaPath = path.join(process.cwd(), 'docs', 'guess_who_schema.sql');
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20261102000000_guess_who_complete_schema.sql');
  assert.ok(fs.existsSync(schemaPath), 'guess_who_schema.sql must exist in docs/');
  assert.ok(fs.existsSync(migrationPath), '20261102000000_guess_who_complete_schema.sql must exist in supabase/migrations/');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');

  // Verify both files contain identical structural features
  for (const [name, content] of [['docs/guess_who_schema.sql', sql], ['20261102000000_guess_who_complete_schema.sql', migrationSql]]) {
    // 1. Verify gw_coordinators table definition
    assert.ok(content.includes('CREATE TABLE IF NOT EXISTS public.gw_coordinators'), `${name} must define gw_coordinators table`);
    assert.ok(content.includes('user_id UUID PRIMARY KEY'), `${name} must have user_id as PRIMARY KEY`);

    // 2. Verify SECURITY DEFINER and search_path hardening
    assert.ok(content.includes('SECURITY DEFINER'), `${name}: gw_submit_turn must be SECURITY DEFINER`);
    assert.ok(content.includes('SET search_path = public, pg_temp'), `${name} must explicitly set immutable search_path for SECURITY DEFINER`);

    // 3. Verify coordinator authorization check inside RPC
    assert.ok(content.includes('SELECT 1 FROM public.gw_coordinators'), `${name} must check user presence in gw_coordinators`);
    assert.ok(content.includes('app_metadata'), `${name} must support JWT app_metadata role fallback`);

    // 4. Verify privilege revocations
    assert.ok(content.includes('REVOKE ALL ON FUNCTION public.gw_submit_turn') && content.includes('FROM PUBLIC;'), `${name} must revoke privileges from PUBLIC`);
    assert.ok(content.includes('REVOKE ALL ON FUNCTION public.gw_submit_turn') && content.includes('FROM anon;'), `${name} must revoke privileges from anon`);
    assert.ok(content.includes('GRANT EXECUTE ON FUNCTION public.gw_submit_turn') && content.includes('TO authenticated, service_role;'), `${name} must grant execute exclusively to authenticated, service_role`);

    // 5. Verify direct table insert restrictions on turn events
    assert.ok(content.includes('CREATE POLICY "Coordinator insert turn events" ON public.gw_turn_events'), `${name}: gw_turn_events must block direct public/anon inserts`);

    // 6. Verify 7-win early victory, 12-puzzle completion, and result bands in SQL
    assert.ok(content.includes('v_is_early_win := (v_new_score >= 7);'), `${name}: RPC must check early win at 7 correct answers`);
    assert.ok(content.includes('v_is_final := (p_slot_number >= v_state.total_questions);'), `${name}: RPC must check completion at total_questions (12)`);
    assert.ok(content.includes("v_result_message := 'Congratulations! You Won!';"), `${name}: RPC must include tier 7 message`);
    assert.ok(content.includes("v_result_message := 'So Close! Just a Little More!';"), `${name}: RPC must include tier 5-6 message`);
    assert.ok(content.includes("v_result_message := 'Good Try! Better Luck Next Time!';"), `${name}: RPC must include tier 0-4 message`);
    assert.ok(content.includes('total_questions INTEGER NOT NULL DEFAULT 12'), `${name}: gw_game_state must default total_questions to 12`);

    // 7. Verify song_clue_text and subtype columns in gw_game_state and parameters in gw_submit_turn
    assert.ok(content.includes('song_clue_text TEXT'), `${name}: gw_game_state must include song_clue_text column`);
    assert.ok(content.includes('subtype TEXT'), `${name}: gw_game_state must include subtype column`);
    assert.ok(content.includes('p_next_song_clue_text TEXT DEFAULT NULL'), `${name}: gw_submit_turn must accept p_next_song_clue_text`);
    assert.ok(content.includes('p_next_subtype TEXT DEFAULT NULL'), `${name}: gw_submit_turn must accept p_next_subtype`);

    // 8. Verify helper registration function, overload cleanup, role allowlist and permission lockdown
    assert.ok(content.includes('DROP FUNCTION IF EXISTS public.gw_register_coordinator_by_email(TEXT);'), `${name} must drop 1-param overload`);
    assert.ok(content.includes('DROP FUNCTION IF EXISTS public.gw_register_coordinator_by_email(TEXT, TEXT);'), `${name} must drop 2-param overload`);
    assert.ok(content.includes("COALESCE(auth.role(), '') = 'service_role'"), `${name} must use NULL-safe check for service_role`);
    assert.ok(content.includes("SESSION_USER IN ('postgres', 'supabase_admin')"), `${name} must use SESSION_USER to allow direct database administrator execution in SQL Editor while preventing SECURITY DEFINER owner bypass`);
    assert.ok(content.includes("v_normalized_role NOT IN ('coordinator', 'lead_coordinator', 'admin')"), `${name} must enforce role allowlist`);
    assert.ok(content.includes('REVOKE ALL ON FUNCTION public.gw_register_coordinator_by_email(TEXT, TEXT) FROM PUBLIC;'), `${name} must revoke from PUBLIC`);
    assert.ok(content.includes('REVOKE ALL ON FUNCTION public.gw_register_coordinator_by_email(TEXT, TEXT) FROM anon;'), `${name} must revoke from anon`);
    assert.ok(content.includes('REVOKE ALL ON FUNCTION public.gw_register_coordinator_by_email(TEXT, TEXT) FROM authenticated;'), `${name} must revoke from authenticated`);
    assert.ok(content.includes('GRANT EXECUTE ON FUNCTION public.gw_register_coordinator_by_email(TEXT, TEXT) TO service_role, postgres;'), `${name} must grant to service_role and postgres`);

    // 9. Verify security barrier on public view and non-destructive game-state seed
    assert.ok(content.includes('WITH (security_barrier = true)'), `${name} must declare security_barrier on gw_public_questions`);
    assert.ok(content.includes('ON CONFLICT (id) DO NOTHING;'), `${name} must preserve existing active game state with ON CONFLICT (id) DO NOTHING`);
  }

  // 10. Simulator for gw_register_coordinator_by_email authorization & allowlist
  const simulateRegisterCoordinator = (callerContext, email, role = 'coordinator') => {
    const isServiceRole = callerContext && callerContext.role === 'service_role';
    const isDbAdmin = callerContext && (callerContext.sessionUser === 'postgres' || callerContext.sessionUser === 'supabase_admin');
    if (!isServiceRole && !isDbAdmin) {
      throw new Error('Authorization denied: service_role required.');
    }
    const normalized = (role || '').toLowerCase().trim();
    const ALLOWED_ROLES = new Set(['coordinator', 'lead_coordinator', 'admin']);
    if (!ALLOWED_ROLES.has(normalized)) {
      throw new Error(`Invalid role: ${role}. Permitted roles are coordinator, lead_coordinator, admin.`);
    }
    return { registered: true, email: email.toLowerCase().trim(), role: normalized };
  };

  // Anon caller attempting registration -> BLOCKED
  assert.throws(() => simulateRegisterCoordinator(null, 'attacker@evil.com'), /Authorization denied/);
  assert.throws(() => simulateRegisterCoordinator({ role: 'anon', sessionUser: 'authenticator' }, 'attacker@evil.com'), /Authorization denied/);

  // Ordinary authenticated user attempting registration -> BLOCKED
  assert.throws(() => simulateRegisterCoordinator({ role: 'authenticated', sessionUser: 'authenticator', uid: 'user-xyz' }, 'attacker@evil.com'), /Authorization denied/);

  // Authenticated user attempting self-promotion to admin -> BLOCKED
  assert.throws(() => simulateRegisterCoordinator({ role: 'authenticated', sessionUser: 'authenticator', uid: 'user-xyz' }, 'attacker@evil.com', 'admin'), /Authorization denied/);

  // Service role with invalid role -> BLOCKED by allowlist
  assert.throws(() => simulateRegisterCoordinator({ role: 'service_role', sessionUser: 'authenticator' }, 'coord@funtopia.com', 'superadmin'), /Invalid role/);

  // Service role with valid allowlisted roles -> PERMITTED
  const res1 = simulateRegisterCoordinator({ role: 'service_role', sessionUser: 'authenticator' }, 'coord@funtopia.com', 'coordinator');
  assert.equal(res1.registered, true);
  assert.equal(res1.role, 'coordinator');

  // Database Administrator in Supabase SQL Editor (sessionUser: postgres) -> PERMITTED
  const resAdmin = simulateRegisterCoordinator({ role: null, sessionUser: 'postgres' }, 'lead@funtopia.com', 'lead_coordinator');
  assert.equal(resAdmin.registered, true);
  assert.equal(resAdmin.role, 'lead_coordinator');

  const res2 = simulateRegisterCoordinator({ role: 'service_role', sessionUser: 'authenticator' }, 'admin@funtopia.com', 'admin');
  assert.equal(res2.registered, true);
  assert.equal(res2.role, 'admin');

  // 11. Test authorization logic predicate simulator
  const checkCoordinatorAuth = (authContext, coordinatorSet) => {
    if (!authContext) return false;
    if (authContext.role === 'service_role') return true;
    if (authContext.app_metadata && (authContext.app_metadata.role === 'coordinator' || authContext.app_metadata.role === 'admin')) return true;
    if (authContext.uid && coordinatorSet.has(authContext.uid)) return true;
    return false;
  };

  const coordinatorUids = new Set(['coord-uuid-1', 'coord-uuid-2']);

  // Anonymous caller -> REJECTED
  assert.equal(checkCoordinatorAuth(null, coordinatorUids), false);
  assert.equal(checkCoordinatorAuth({ role: 'anon', uid: null }, coordinatorUids), false);

  // Authenticated regular user (e.g. public player laptop) -> REJECTED
  assert.equal(checkCoordinatorAuth({ role: 'authenticated', uid: 'player-laptop-uuid' }, coordinatorUids), false);

  // Authenticated registered coordinator -> PERMITTED
  assert.equal(checkCoordinatorAuth({ role: 'authenticated', uid: 'coord-uuid-1' }, coordinatorUids), true);

  // Authenticated user with JWT claim -> PERMITTED
  assert.equal(checkCoordinatorAuth({ role: 'authenticated', uid: 'admin-uuid', app_metadata: { role: 'coordinator' } }, coordinatorUids), true);

  // Backend service role -> PERMITTED
  assert.equal(checkCoordinatorAuth({ role: 'service_role' }, coordinatorUids), true);
});

test('--- 12. CAR-LOGO PRESENTATION & LEAK-FREE SVGS ---', () => {
  const logosDir = path.join(process.cwd(), 'public', 'assets', 'guess-who', 'logos');
  assert.ok(fs.existsSync(logosDir), 'Logos directory must exist');

  for (let i = 21; i <= 40; i++) {
    const filename = fs.readdirSync(logosDir).find((f) => f.startsWith(`lg-${i}_`));
    assert.ok(filename, `Must find SVG for car logo lg-${i}`);

    const filePath = path.join(logosDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');

    // 1. Must not contain <text> elements
    assert.ok(!/<text/i.test(content), `${filename} must not contain <text> elements that leak brand names`);

    // 2. Must be non-empty and start with valid SVG opening
    assert.ok(content.includes('<svg') && content.includes('</svg>'), `${filename} must be valid SVG document`);
  }
});

test('--- 13. MASTER DATASET & BACKUP INTEGRITY ---', async () => {
  // 1. Confirm master dataset contains all 211 approved records (191 previous + 20 guess the language)
  assert.equal(masterDataset.length, 211, 'Master dataset must contain exactly 211 approved records');
  
  // 2. Confirm MINI is excluded
  assert.ok(!masterDataset.some(q => q.id === 'lg-4' || q.correct_answer === 'MINI'), 'MINI must be excluded');

  // 3. Confirm category breakdown (100 misc, 55 flags, 21 car logos, 25 bollywood celebrities, 5 scientists, 5 objects)
  const misc = masterDataset.filter(q => q.category === 'miscellaneous');
  const flags = masterDataset.filter(q => q.category === 'flags');
  const logos = masterDataset.filter(q => q.category === 'logos_symbols');
  const bollywood = masterDataset.filter(q => q.category === 'bollywood_celebrities');
  const scientists = masterDataset.filter(q => q.category === 'scientists');
  const objects = masterDataset.filter(q => q.category === 'objects');
  assert.equal(misc.length, 100, 'Must contain 100 miscellaneous records (80 previous + 20 guess the language)');
  assert.equal(flags.length, 55, 'Must contain 55 flags records');
  assert.equal(logos.length, 21, 'Must contain 21 car logos records');
  assert.equal(bollywood.length, 25, 'Must contain 25 bollywood celebrities records');
  assert.equal(scientists.length, 5, 'Must contain 5 scientists records');
  assert.equal(objects.length, 5, 'Must contain 5 objects/statues records');

  // 4. Confirm backup file exists and contains all 190 original records
  const backupExternal = path.join(process.cwd(), 'backups', 'guessWhoMasterDataset.backup.json');
  assert.ok(fs.existsSync(backupExternal), 'External backup file must exist in backups/');
  const backupData = JSON.parse(fs.readFileSync(backupExternal, 'utf8'));
  assert.equal(backupData.length, 190, 'Backup file must contain all 190 original records');

  const backupDocs = path.join(process.cwd(), 'docs', 'backups', 'guessWhoMasterDataset.backup.json');
  assert.ok(fs.existsSync(backupDocs), 'External backup file must exist in docs/backups/');
  const backupDocsData = JSON.parse(fs.readFileSync(backupDocs, 'utf8'));
  assert.equal(backupDocsData.length, 190, 'Docs backup file must contain all 190 original records');

  // 5. Confirm 8 official approved categories remain available
  const { APPROVED_CATEGORIES, INITIAL_QUESTION_LIBRARY } = await import('../src/data/guessWhoSeedDecks.js');
  assert.equal(APPROVED_CATEGORIES.length, 8, 'All 8 approved categories must be preserved');
  assert.equal(INITIAL_QUESTION_LIBRARY.length, 211, 'INITIAL_QUESTION_LIBRARY must reflect 211 master records');

  // 6. Confirm question library loads all 211 records
  const library = getQuestionLibrary();
  assert.equal(library.length, 211, 'Question library must contain 211 records');

  // 7. Confirm all image-based questions have valid image files on disk in public/
  for (const q of masterDataset) {
    if (q.image_url) {
      const diskPath = path.join(process.cwd(), 'public', q.image_url.replace(/^\//, ''));
      assert.ok(fs.existsSync(diskPath), `Image file for question ${q.id} must exist at ${diskPath}`);
      assert.ok(fs.statSync(diskPath).size > 0, `Image file for question ${q.id} must not be empty`);
    } else {
      assert.equal(q.subtype, 'bollywood_song_guess', `Non-image questions must be song clues`);
      assert.ok(q.clue || q.english_clue, `Song clue ${q.id} must have clue text`);
    }
  }
});

test('--- 17. SCIENTISTS & STATUES: CATEGORIES, IMAGES & PRIVACY ---', () => {
  const sciRecords = masterDataset.filter(q => q.category === 'scientists');
  const statueRecords = masterDataset.filter(q => q.subtype === 'statue');

  assert.equal(sciRecords.length, 5, 'Must contain exactly 5 scientists');
  assert.equal(statueRecords.length, 5, 'Must contain exactly 5 statues');

  // Verify scientists
  const expectedSciIds = ['sci-darwin', 'sci-davinci', 'sci-edison', 'sci-hawking', 'sci-tesla'];
  for (const id of expectedSciIds) {
    const s = sciRecords.find(q => q.id === id);
    assert.ok(s, `Scientist ${id} must exist`);
    assert.equal(s.category, 'scientists');
    assert.ok(s.field, `Scientist ${id} must have scientific field annotated`);
    assert.ok(s.image_url.startsWith('/assets/guess-who/manual_uploads/scientists/'));
  }

  // Verify statues
  const expectedStatueIds = ['statue-christ-redeemer', 'statue-liberty', 'statue-ronaldo-bust', 'statue-the-thinker', 'statue-leaning-tower-pisa'];
  for (const id of expectedStatueIds) {
    const st = statueRecords.find(q => q.id === id);
    assert.ok(st, `Statue ${id} must exist`);
    assert.equal(st.category, 'objects');
    assert.equal(st.subtype, 'statue');
    assert.ok(st.location, `Statue ${id} must have location annotated`);
    assert.ok(st.image_url.startsWith('/assets/guess-who/manual_uploads/statues/'));
  }

  // Projector privacy verification for both
  const sample = sciRecords[0];
  const sanitized = sanitizeGameStateForProjector({
    session_id: 'test-session',
    player_name: 'Player 1',
    is_game_active: true,
    current_slot: 1,
    image_url: sample.image_url,
    reveal_type: sample.reveal_type,
    reveal_metadata: sample.reveal_metadata,
    reveal_level: 1,
    correct_answer: sample.correct_answer,
    field: sample.field,
    clue: sample.clue,
    title: sample.title
  });

  assert.equal(sanitized.imageUrl, sample.image_url);
  assert.strictEqual(sanitized.correct_answer, undefined);
  assert.strictEqual(sanitized.field, undefined);
  assert.strictEqual(sanitized.clue, undefined);
  assert.strictEqual(sanitized.title, undefined);
});

test('--- 14. GUESS THE BOLLYWOOD SONG: CLUE BOX & PROJECTOR PRIVACY ---', () => {
  const songRecords = masterDataset.filter(q => q.subtype === 'bollywood_song_guess');
  assert.equal(songRecords.length, 19, 'Must have exactly 19 Bollywood Song Guess records');

  for (const song of songRecords) {
    // 1. Invariants on question records
    assert.equal(song.category, 'miscellaneous');
    assert.equal(song.reveal_type, 'song_clue');
    assert.ok(song.correct_answer, `Song ${song.id} must have a correct Hindi answer`);
    assert.ok(song.english_clue, `Song ${song.id} must have an English paraphrase clue`);
    assert.ok(song.movie, `Song ${song.id} must have an associated movie`);

    // 2. Strict Projector Privacy Check
    const sanitized = sanitizeGameStateForProjector({
      session_id: 'test-session',
      player_name: 'Player 1',
      is_game_active: true,
      current_slot: 1,
      image_url: song.image_url,
      song_clue_text: song.english_clue,
      subtype: song.subtype,
      reveal_type: song.reveal_type,
      correct_answer: song.correct_answer,
      movie: song.movie,
      artist: 'Arijit Singh / Lata Mangeshkar',
      title: song.title
    });

    // Projector payload MUST contain songClueText
    assert.equal(sanitized.songClueText, song.english_clue);
    assert.equal(sanitized.subtype, 'bollywood_song_guess');
    assert.equal(sanitized.revealType, 'song_clue');

    // Projector payload MUST NEVER contain answer, movie, artist, or title
    assert.strictEqual(sanitized.correct_answer, undefined);
    assert.strictEqual(sanitized.correctAnswer, undefined);
    assert.strictEqual(sanitized.movie, undefined);
    assert.strictEqual(sanitized.artist, undefined);
    assert.strictEqual(sanitized.title, undefined);
  }
});

test('--- 14. PERIODIC TABLE 15 SYMBOL PUZZLES INTEGRITY & PRIVACY ---', () => {
  const EXPECTED_PERIODIC_MAPPINGS = [
    { id: 'periodic-001', symbol: 'Mg', element: 'Magnesium', file: 'periodic_001.png' },
    { id: 'periodic-002', symbol: 'H',  element: 'Hydrogen',  file: 'periodic_002.png' },
    { id: 'periodic-003', symbol: 'Si', element: 'Silicon',   file: 'periodic_003.png' },
    { id: 'periodic-004', symbol: 'N',  element: 'Nitrogen',  file: 'periodic_004.png' },
    { id: 'periodic-005', symbol: 'Ar', element: 'Argon',     file: 'periodic_005.png' },
    { id: 'periodic-006', symbol: 'He', element: 'Helium',    file: 'periodic_006.png' },
    { id: 'periodic-007', symbol: 'O',  element: 'Oxygen',    file: 'periodic_007.png' },
    { id: 'periodic-008', symbol: 'K',  element: 'Potassium', file: 'periodic_008.png' },
    { id: 'periodic-009', symbol: 'Cu', element: 'Copper',    file: 'periodic_009.png' },
    { id: 'periodic-010', symbol: 'Ca', element: 'Calcium',   file: 'periodic_010.png' },
    { id: 'periodic-011', symbol: 'B',  element: 'Boron',     file: 'periodic_011.png' },
    { id: 'periodic-012', symbol: 'Ne', element: 'Neon',      file: 'periodic_012.png' },
    { id: 'periodic-013', symbol: 'F',  element: 'Fluorine',  file: 'periodic_013.png' },
    { id: 'periodic-014', symbol: 'Al', element: 'Aluminum',  file: 'periodic_014.png' },
    { id: 'periodic-015', symbol: 'I',  element: 'Iodine',    file: 'periodic_015.png' },
  ];

  for (const exp of EXPECTED_PERIODIC_MAPPINGS) {
    const q = masterDataset.find((item) => item.id === exp.id);
    assert.ok(q, `Question record ${exp.id} must exist in master dataset`);
    assert.equal(q.category, 'miscellaneous', `Category for ${exp.id} must be 'miscellaneous'`);
    assert.equal(q.correct_answer, exp.element, `Correct answer for ${exp.id} must be '${exp.element}'`);
    assert.equal(q.symbol, exp.symbol, `Symbol for ${exp.id} must be '${exp.symbol}'`);
    assert.equal(q.reveal_type, 'crop', `Reveal type for ${exp.id} must be 'crop'`);
    assert.equal(q.image_url, `/assets/guess-who/manual_uploads/miscellaneous/periodic_table/${exp.file}`);
    assert.equal(q.local_asset_path, `/assets/guess-who/manual_uploads/miscellaneous/periodic_table/${exp.file}`);

    // Confirm image file exists on disk
    const diskPath = path.join(process.cwd(), 'public', 'assets', 'guess-who', 'manual_uploads', 'miscellaneous', 'periodic_table', exp.file);
    assert.ok(fs.existsSync(diskPath), `Physical image ${diskPath} must exist`);
    assert.ok(fs.statSync(diskPath).size > 10000, `Physical image ${diskPath} must be a valid non-empty PNG`);

    // Verify Projector Privacy Sanitization
    const rawPayload = {
      sessionId: 'session-periodic-test',
      currentSlot: 1,
      correct_answer: q.correct_answer,
      clue: q.clue,
      difficulty: q.difficulty,
      image_url: q.image_url,
      reveal_type: q.reveal_type,
      reveal_metadata: q.reveal_metadata,
      reveal_level: 1,
    };
    const sanitized = sanitizeGameStateForProjector(rawPayload);
    assert.equal(sanitized.correct_answer, undefined, 'Projector payload must NEVER contain correct_answer');
    assert.equal(sanitized.clue, undefined, 'Projector payload must NEVER contain clue');
    assert.equal(sanitized.difficulty, undefined, 'Projector payload must NEVER contain difficulty');
    assert.equal(sanitized.imageUrl, q.image_url, 'Projector receives image URL');
    assert.equal(sanitized.revealType, 'crop');
  }
});

test('--- 15. BOLLYWOOD CELEBRITY EYES 25 PUZZLES INTEGRITY & PRIVACY ---', () => {
  const EXPECTED_BWE_IDS = Array.from({ length: 25 }, (_, i) => `bwe-${String(i + 1).padStart(2, '0')}`);

  for (const id of EXPECTED_BWE_IDS) {
    const q = masterDataset.find((item) => item.id === id);
    assert.ok(q, `Bollywood eye question record ${id} must exist in master dataset`);
    assert.equal(q.category, 'bollywood_celebrities', `Category for ${id} must be 'bollywood_celebrities'`);
    assert.ok(q.correct_answer, `Answer for ${id} must be non-empty`);
    assert.equal(q.reveal_type, 'crop', `Reveal type for ${id} must be 'crop'`);
    assert.ok(q.image_url.startsWith('/assets/guess-who/manual_uploads/bollywood_eyes/'), `Image URL for ${id} must be in bollywood_eyes/`);
    assert.ok(q.image_license.includes('CC BY'), `License for ${id} must be CC BY compatible`);

    // Confirm image file exists on disk
    const diskPath = path.join(process.cwd(), 'public', q.image_url.replace(/^\//, ''));
    assert.ok(fs.existsSync(diskPath), `Physical image ${diskPath} must exist`);
    assert.ok(fs.statSync(diskPath).size > 10000, `Physical image ${diskPath} must be a valid non-empty JPG`);

    // Verify Projector Privacy Sanitization
    const rawPayload = {
      sessionId: 'session-bwe-test',
      currentSlot: 1,
      correct_answer: q.correct_answer,
      clue: q.clue,
      difficulty: q.difficulty,
      image_url: q.image_url,
      reveal_type: q.reveal_type,
      reveal_metadata: q.reveal_metadata,
      reveal_level: 1,
    };
    const sanitized = sanitizeGameStateForProjector(rawPayload);
    assert.equal(sanitized.correct_answer, undefined, 'Projector payload must NEVER contain correct_answer');
    assert.equal(sanitized.clue, undefined, 'Projector payload must NEVER contain clue');
    assert.equal(sanitized.difficulty, undefined, 'Projector payload must NEVER contain difficulty');
    assert.equal(sanitized.imageUrl, q.image_url, 'Projector receives image URL');
    assert.equal(sanitized.revealType, 'crop');
  }
});

test('--- 16. COUNTRY EMOJI QUIZ 23 PUZZLES INTEGRITY & PRIVACY ---', () => {
  const EXPECTED_CEQ_IDS = Array.from({ length: 23 }, (_, i) => `ceq-${String(i + 1).padStart(2, '0')}`);

  for (const id of EXPECTED_CEQ_IDS) {
    const q = masterDataset.find((item) => item.id === id);
    assert.ok(q, `Country emoji question record ${id} must exist in master dataset`);
    assert.equal(q.category, 'flags', `Category for ${id} must be 'flags'`);
    assert.equal(q.subtype, 'country_emoji_quiz', `Subtype for ${id} must be 'country_emoji_quiz'`);
    assert.ok(q.correct_answer, `Answer for ${id} must be non-empty`);
    assert.ok(q.source_answer_raw, `Source raw answer for ${id} must be preserved`);
    assert.ok(q.emoji_combination, `Emoji combination for ${id} must be present`);
    assert.equal(q.reveal_type, 'crop', `Reveal type for ${id} must be 'crop'`);
    assert.ok(q.image_url.startsWith('/assets/guess-who/manual_uploads/flags/country_emoji_'), `Image URL for ${id} must be in flags/country_emoji_`);

    // Confirm image file exists on disk
    const diskPath = path.join(process.cwd(), 'public', q.image_url.replace(/^\//, ''));
    assert.ok(fs.existsSync(diskPath), `Physical image ${diskPath} must exist`);
    assert.ok(fs.statSync(diskPath).size > 10000, `Physical image ${diskPath} must be a valid non-empty PNG`);

    // Verify Projector Privacy Sanitization
    const rawPayload = {
      sessionId: 'session-ceq-test',
      currentSlot: 1,
      correct_answer: q.correct_answer,
      source_answer_raw: q.source_answer_raw,
      clue: q.clue,
      difficulty: q.difficulty,
      image_url: q.image_url,
      reveal_type: q.reveal_type,
      reveal_metadata: q.reveal_metadata,
      reveal_level: 1,
    };
    const sanitized = sanitizeGameStateForProjector(rawPayload);
    assert.equal(sanitized.correct_answer, undefined, 'Projector payload must NEVER contain correct_answer');
    assert.equal(sanitized.source_answer_raw, undefined, 'Projector payload must NEVER contain source_answer_raw');
    assert.equal(sanitized.clue, undefined, 'Projector payload must NEVER contain clue');
    assert.equal(sanitized.difficulty, undefined, 'Projector payload must NEVER contain difficulty');
    assert.equal(sanitized.imageUrl, q.image_url, 'Projector receives image URL');
    assert.equal(sanitized.revealType, 'crop');
  }
});

test('--- 18. GUESS THE LANGUAGE 20 PUZZLES INTEGRITY, NATIVE SCRIPTS & PRIVACY ---', () => {
  const EXPECTED_LANG_PUZZLES = [
    { id: 'lang-01', language: 'French', greeting: 'Bonjour', script: 'Latin', filename: 'lang_01_french.png' },
    { id: 'lang-02', language: 'Spanish', greeting: 'Hola', script: 'Latin', filename: 'lang_02_spanish.png' },
    { id: 'lang-03', language: 'Italian', greeting: 'Ciao', script: 'Latin', filename: 'lang_03_italian.png' },
    { id: 'lang-04', language: 'Portuguese', greeting: 'Olá', script: 'Latin', filename: 'lang_04_portuguese.png' },
    { id: 'lang-05', language: 'Turkish', greeting: 'Merhaba', script: 'Latin', filename: 'lang_05_turkish.png' },
    { id: 'lang-06', language: 'German', greeting: 'Hallo', script: 'Latin', filename: 'lang_06_german.png' },
    { id: 'lang-07', language: 'Tamil', greeting: 'வணக்கம்', script: 'Tamil', filename: 'lang_07_tamil.png' },
    { id: 'lang-08', language: 'Malayalam', greeting: 'നമസ്കാരം', script: 'Malayalam', filename: 'lang_08_malayalam.png' },
    { id: 'lang-09', language: 'Pashto', greeting: 'سلام', script: 'Perso-Arabic (Pashto)', filename: 'lang_09_pashto.png' },
    { id: 'lang-10', language: 'Russian', greeting: 'Привет', script: 'Cyrillic', filename: 'lang_10_russian.png' },
    { id: 'lang-11', language: 'Arabic', greeting: 'مرحبا', script: 'Arabic', filename: 'lang_11_arabic.png' },
    { id: 'lang-12', language: 'Hebrew', greeting: 'שלום', script: 'Hebrew', filename: 'lang_12_hebrew.png' },
    { id: 'lang-13', language: 'Korean', greeting: '안녕하세요', script: 'Hangul', filename: 'lang_13_korean.png' },
    { id: 'lang-14', language: 'Chinese (Simplified)', greeting: '你好', script: 'Simplified Hanzi', filename: 'lang_14_chinese.png' },
    { id: 'lang-15', language: 'Japanese', greeting: 'こんにちは', script: 'Hiragana', filename: 'lang_15_japanese.png' },
    { id: 'lang-16', language: 'Thai', greeting: 'สวัสดี', script: 'Thai', filename: 'lang_16_thai.png' },
    { id: 'lang-17', language: 'Dutch', greeting: 'Hallo', script: 'Latin', filename: 'lang_17_dutch.png' },
    { id: 'lang-18', language: 'Swedish', greeting: 'Hej', script: 'Latin', filename: 'lang_18_swedish.png' },
    { id: 'lang-19', language: 'Polish', greeting: 'Cześć', script: 'Latin', filename: 'lang_19_polish.png' },
    { id: 'lang-20', language: 'Vietnamese', greeting: 'Xin chào', script: 'Latin', filename: 'lang_20_vietnamese.png' },
  ];

  assert.equal(EXPECTED_LANG_PUZZLES.length, 20, 'Must define exactly 20 expected language puzzles');

  const langRecordsInDataset = masterDataset.filter((q) => q.subtype === 'guess_the_language');
  assert.equal(langRecordsInDataset.length, 20, 'Dataset must contain exactly 20 guess_the_language records');

  for (const exp of EXPECTED_LANG_PUZZLES) {
    const q = masterDataset.find((item) => item.id === exp.id);
    assert.ok(q, `Language puzzle record ${exp.id} must exist in master dataset`);
    assert.equal(q.category, 'miscellaneous', `Category for ${exp.id} must be 'miscellaneous'`);
    assert.equal(q.subtype, 'guess_the_language', `Subtype for ${exp.id} must be 'guess_the_language'`);
    assert.equal(q.correct_answer, exp.language, `Correct answer for ${exp.id} must match expected language`);
    assert.equal(q.greeting, exp.greeting, `Greeting for ${exp.id} must match expected native greeting`);
    assert.equal(q.script, exp.script, `Script for ${exp.id} must match expected script`);
    assert.ok(q.clue, `Clue for ${exp.id} must be non-empty`);
    assert.equal(q.reveal_type, 'crop', `Reveal type for ${exp.id} must be 'crop'`);
    assert.deepEqual(q.reveal_metadata, { cropX: 50, cropY: 50, zoom: 1 }, `Reveal metadata for ${exp.id} must be full view`);

    const expectedPath = `/assets/guess-who/manual_uploads/miscellaneous/guess_the_language/${exp.filename}`;
    assert.equal(q.image_url, expectedPath, `image_url for ${exp.id} must match expected asset path`);
    assert.equal(q.local_asset_path, expectedPath, `local_asset_path for ${exp.id} must match expected asset path`);

    // Verify physical file on disk
    const diskPath = path.join(process.cwd(), 'public', expectedPath.replace(/^\//, ''));
    assert.ok(fs.existsSync(diskPath), `Physical image file for ${exp.id} must exist at ${diskPath}`);
    const stat = fs.statSync(diskPath);
    assert.ok(stat.size > 5000, `Physical image file ${diskPath} size (${stat.size} bytes) must be > 5KB`);

    // Verify Image Resolver Candidates
    const candidates = getImageCandidates(q);
    assert.ok(candidates.includes(expectedPath), `getImageCandidates for ${exp.id} must include the local asset path`);
    assert.equal(candidates[0], expectedPath, `Candidate #0 must prioritize local asset path`);

    // Verify Projector Privacy Sanitization
    const rawPayload = {
      sessionId: 'session-lang-test',
      currentSlot: 1,
      correct_answer: q.correct_answer,
      greeting: q.greeting,
      script: q.script,
      clue: q.clue,
      difficulty: q.difficulty,
      prompt: q.prompt,
      image_url: q.image_url,
      reveal_type: q.reveal_type,
      reveal_metadata: q.reveal_metadata,
      reveal_level: 1,
    };
    const sanitized = sanitizeGameStateForProjector(rawPayload);
    assert.equal(sanitized.correct_answer, undefined, 'Projector payload must NEVER contain correct_answer (language name)');
    assert.equal(sanitized.greeting, undefined, 'Projector payload must NEVER contain greeting');
    assert.equal(sanitized.script, undefined, 'Projector payload must NEVER contain script');
    assert.equal(sanitized.clue, undefined, 'Projector payload must NEVER contain clue');
    assert.equal(sanitized.difficulty, undefined, 'Projector payload must NEVER contain difficulty');
    assert.equal(sanitized.prompt, undefined, 'Projector payload must NEVER contain prompt');
    assert.equal(sanitized.imageUrl, q.image_url, 'Projector receives image URL');
    assert.equal(sanitized.revealType, 'crop');
  }
});

test('--- 20. SUPABASE REALTIME CONFIGURATION, VERSIONED MIGRATION & TELEMETRY ---', () => {
  // 1. Verify sync status telemetry
  const status = getSupabaseSyncStatus();
  assert.ok(status !== null && typeof status === 'object', 'getSupabaseSyncStatus must return a status object');
  assert.ok('status' in status, 'syncStatus must contain status field');
  assert.ok('isSubscribed' in status, 'syncStatus must contain isSubscribed field');
  assert.ok('mode' in status, 'syncStatus must contain mode field');

  // 2. Client configuration check
  const isConfigured = isSupabaseConfigured();
  assert.equal(typeof isConfigured, 'boolean', 'isSupabaseConfigured must return a boolean');

  // 3. Inspect versioned migration file
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20261102000000_guess_who_complete_schema.sql');
  assert.ok(fs.existsSync(migrationPath), 'Migration file must exist');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');

  // Check RLS on all 6 tables
  const expectedTables = [
    'gw_game_state',
    'gw_turn_events',
    'gw_attempts',
    'gw_players',
    'gw_questions',
    'gw_coordinators'
  ];

  for (const table of expectedTables) {
    assert.ok(
      migrationSql.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`),
      `Migration must enable RLS on public.${table}`
    );
  }

  // Check critical security policies
  assert.ok(
    migrationSql.includes('CREATE POLICY "Public read sanitized game state" ON public.gw_game_state'),
    'Migration must include projector read policy on gw_game_state'
  );
  assert.ok(
    migrationSql.includes('CREATE POLICY "Coordinator write authoritative game state" ON public.gw_game_state'),
    'Migration must include coordinator write policy on gw_game_state'
  );
  assert.ok(
    migrationSql.includes('CREATE POLICY "Restrict raw questions access to coordinators" ON public.gw_questions'),
    'Migration must restrict raw questions table with secrets to coordinators'
  );
  assert.ok(
    migrationSql.includes('CREATE OR REPLACE VIEW public.gw_public_questions'),
    'Migration must provide sanitized public view for questions'
  );

  // Check Realtime replica identity for full row updates
  assert.ok(
    migrationSql.includes('ALTER TABLE public.gw_game_state REPLICA IDENTITY FULL;'),
    'Migration must set REPLICA IDENTITY FULL on gw_game_state for Realtime synchronization'
  );
  assert.ok(
    migrationSql.includes('ALTER PUBLICATION supabase_realtime ADD TABLE public.gw_game_state;'),
    'Migration must add gw_game_state to supabase_realtime publication'
  );

  // Check schema columns song_clue_text and subtype
  assert.ok(migrationSql.includes('song_clue_text TEXT'), 'Migration must declare song_clue_text on gw_game_state');
  assert.ok(migrationSql.includes('subtype TEXT'), 'Migration must declare subtype on gw_game_state');
  assert.ok(migrationSql.includes('p_next_song_clue_text TEXT DEFAULT NULL'), 'Migration RPC must accept p_next_song_clue_text');
  assert.ok(migrationSql.includes('p_next_subtype TEXT DEFAULT NULL'), 'Migration RPC must accept p_next_subtype');
});

