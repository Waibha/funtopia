/**
 * ============================================================================
 * GUESS WHO? SERVICE & BUSINESS LOGIC ENGINE
 * ============================================================================
 * 
 * Implements:
 * - Automatic 12-puzzle slab generation (Flags: 3, other 7 categories: 1 each, wildcards: 2)
 * - Manual 12-puzzle slab construction & editing (add, remove, replace)
 * - Individual player registration & scoring (1 pt Correct, 0 Wrong, 0 Skip)
 * - 3-tier score result calculation:
 *     7 (Max Achievable Score): Congratulations! You Won! (immediate early victory)
 *     5-6: So Close! Just a Little More! (completed up to 12 puzzles)
 *     0-4: Good Try! Better Luck Next Time! (completed up to 12 puzzles)
 * - Strict Sanitized Projector Broadcasts (No answers or metadata during play,
 *   result screen displayed only after game ends)
 * - Supabase storage image upload integration
 */

import { INITIAL_QUESTION_LIBRARY, APPROVED_CATEGORIES } from '../data/guessWhoSeedDecks.js';
import { gwSupabase as supabase, isGwSupabaseConfigured as isSupabaseConfigured, isGwSupabaseConfigured } from './guessWhoSupabaseClient.js';

const STORAGE_KEYS = {
  LIBRARY: 'funtopia_gw_library',
  PLAYERS: 'funtopia_gw_players',
  ACTIVE_SLAB: 'funtopia_gw_active_slab',
  DISPLAY_STATE: 'funtopia_gw_display_state',
  AUTHORITATIVE_STATE: 'funtopia_gw_authoritative_state',
  RUN_HISTORY: 'funtopia_gw_run_history',
};

const CHANNEL_NAME = 'funtopia_gw_live_feed';

const memoryStore = new Map();

const getStoredValue = (key) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return localStorage.getItem(key);
    } catch (e) {}
  }
  return memoryStore.get(key) || null;
};

const setStoredValue = (key, value) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }
  memoryStore.set(key, value);
};

// ----------------------------------------------------------------------------
// 1. RESULT MESSAGE TIERS & QUALIFICATION
// ----------------------------------------------------------------------------

export const getResultDetails = (score) => {
  const numericScore = Number(score) || 0;
  if (numericScore >= 7) {
    return {
      message: 'Congratulations! You Won!',
      subMessage: 'Tournament Qualifier Tier — 7 correct answers reached! Qualified for the finals!',
      isWinner: true,
      badge: 'QUALIFIED',
      tier: 'gold',
    };
  }
  if (numericScore >= 5) {
    return {
      message: 'So Close! Just a Little More!',
      subMessage: 'Challenger Tier — Just short of the 7-point qualification line.',
      isWinner: false,
      badge: 'SO CLOSE',
      tier: 'bronze',
    };
  }
  return {
    message: 'Good Try! Better Luck Next Time!',
    subMessage: 'Explorer Tier — Keep practicing your deduction skills.',
    isWinner: false,
    badge: 'PARTICIPANT',
    tier: 'default',
  };
};

export const getRunHistory = () => {
  try {
    const raw = getStoredValue(STORAGE_KEYS.RUN_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading run history:', err);
  }
  return [];
};

export const archiveCompletedRun = (playerName, finalScore, slab, isEarlyWin = false) => {
  const history = getRunHistory();
  const runEntry = {
    id: `run-${Date.now()}`,
    playerName: playerName || 'Contender',
    finalScore: Number(finalScore) || 0,
    isWinner: Number(finalScore) >= 7,
    isEarlyWin: Boolean(isEarlyWin),
    completedAt: new Date().toISOString(),
    slotsPlayed: slab?.slots?.filter((s) => s.status === 'completed' || s.status === 'skipped').length || 0,
  };
  const updated = [runEntry, ...history];
  setStoredValue(STORAGE_KEYS.RUN_HISTORY, JSON.stringify(updated));

  if (isSupabaseConfigured()) {
    supabase.from('gw_attempts').insert([{
      player_name: runEntry.playerName,
      final_score: runEntry.finalScore,
      is_winner: runEntry.isWinner,
      is_early_win: runEntry.isEarlyWin,
      created_at: runEntry.completedAt,
    }]).then(({ error }) => {
      if (error) console.warn('Supabase attempt archive skipped:', error.message);
    });
  }

  return runEntry;
};

// ----------------------------------------------------------------------------
// 2. QUESTION LIBRARY MANAGEMENT & STORAGE UPLOAD
// ----------------------------------------------------------------------------

export const getQuestionLibrary = () => {
  let base = INITIAL_QUESTION_LIBRARY;
  try {
    const custom = getStoredValue(STORAGE_KEYS.LIBRARY);
    if (custom) {
      const parsedCustom = JSON.parse(custom);
      const customIds = new Set(parsedCustom.map((q) => q.id));
      base = [
        ...parsedCustom,
        ...INITIAL_QUESTION_LIBRARY.filter((q) => !customIds.has(q.id)),
      ];
    }
  } catch (err) {
    console.error('Failed reading question library:', err);
  }

  // Defensive deduplication by question ID to guarantee zero duplicates
  const seenIds = new Set();
  const deduped = [];
  base.forEach((q) => {
    if (q && q.id && !seenIds.has(q.id)) {
      seenIds.add(q.id);
      deduped.push(q);
    }
  });

  return deduped;
};

/**
 * Uploads an image file to Supabase Storage bucket 'guess-who-images'
 * Falls back to base64 data URL for local offline testing if Supabase is unconfigured.
 */
export const uploadQuestionImageFile = async (file) => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `gw-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('guess-who-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from('guess-who-images')
          .getPublicUrl(fileName);
        if (urlData && urlData.publicUrl) {
          return urlData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Supabase storage upload failed, falling back to local file reader:', err);
    }
  }

  // Local fallback reader
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};

export const saveCustomQuestion = (newQuestion) => {
  if (!newQuestion.title || !newQuestion.category || !newQuestion.correct_answer) {
    throw new Error('Title, category, and correct answer are required.');
  }

  const question = {
    id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    is_custom: true,
    created_at: new Date().toISOString(),
    reveal_type: newQuestion.reveal_type || (newQuestion.category === 'bollywood_dialogues' ? 'dialogue' : (newQuestion.subtype === 'bollywood_song_guess' ? 'song_clue' : 'crop')),
    ...newQuestion,
  };

  const currentLibrary = getQuestionLibrary();
  const updated = [question, ...currentLibrary];

  setStoredValue(STORAGE_KEYS.LIBRARY, JSON.stringify(updated));

  // Async write to Supabase if configured
  if (isSupabaseConfigured()) {
    supabase.from('gw_questions').insert([{
      category: question.category,
      title: question.title,
      prompt: question.prompt,
      correct_answer: question.correct_answer,
      clue: question.clue,
      image_url: question.image_url,
      dialogue_text: question.dialogue_text,
      is_custom: true,
    }]).then(({ error }) => {
      if (error) console.warn('Supabase questions table write skipped:', error.message);
    });
  }

  return question;
};

// ----------------------------------------------------------------------------
// 3. SLAB GENERATION: AUTOMATIC & MANUAL (EXACTLY 12 PUZZLES)
// ----------------------------------------------------------------------------

/**
 * Option A: Automatic Generation
 * - Flags: 3 questions
 * - Hollywood Celebrities: 1
 * - Bollywood Celebrities: 1
 * - Scientists: 1
 * - Objects: 1
 * - Bollywood Dialogues: 1
 * - Logos & Symbols: 1
 * - Miscellaneous: 1
 * - Random wildcards from eligible categories: 2
 * Total = exactly 12 questions
 */
export const generateAutomaticSlab = (playerName) => {
  const library = getQuestionLibrary();
  
  if (!library || library.length < 12) {
    const errorMsg = 'Insufficient questions in library. At least 12 questions are required to start a game.';
    console.warn(`[GuessWho] ${errorMsg} (${library ? library.length : 0} / 12 available).`);
    throw new Error(errorMsg);
  }

  const selectedPuzzles = [];
  const usedQuestionIds = new Set();

  const helperPickFromCategory = (catId, count) => {
    const candidates = library.filter(
      (q) => q.category === catId && !usedQuestionIds.has(q.id)
    );
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, count);
    picked.forEach((p) => {
      selectedPuzzles.push(p);
      usedQuestionIds.add(p.id);
    });
    return picked.length;
  };

  // 1. Pick 3 from Flags
  helperPickFromCategory('flags', 3);

  // 2. Pick 1 from each of the other 7 categories
  APPROVED_CATEGORIES.forEach((cat) => {
    if (cat.id !== 'flags') {
      helperPickFromCategory(cat.id, 1);
    }
  });

  // 3. Pick 2 remaining wildcard puzzles from eligible categories
  const remainingCandidates = library.filter((q) => !usedQuestionIds.has(q.id));
  const shuffledCandidates = [...remainingCandidates].sort(() => 0.5 - Math.random());
  const wildcards = shuffledCandidates.slice(0, 2);
  wildcards.forEach((w) => {
    selectedPuzzles.push(w);
    usedQuestionIds.add(w.id);
  });

  // 4. Fallback: If any category ran short, backfill until exactly 12
  if (selectedPuzzles.length < 12) {
    const anyAvailable = library.filter((q) => !usedQuestionIds.has(q.id));
    const needed = 12 - selectedPuzzles.length;
    const backfill = anyAvailable.slice(0, needed);
    backfill.forEach((p) => {
      selectedPuzzles.push(p);
      usedQuestionIds.add(p.id);
    });
  }

  const final12 = selectedPuzzles.slice(0, 12);

  const slots = final12.map((question, idx) => ({
    slotNumber: idx + 1,
    question: question,
    status: idx === 0 ? 'current' : 'unplayed',
    result: null,
  }));

  const slab = {
    id: `slab-${Date.now()}`,
    playerName: playerName || 'Contender',
    slots: slots,
    currentSlot: 1,
    status: 'review', // 'review' | 'active' | 'completed'
    createdAt: new Date().toISOString(),
  };

  saveActiveSlab(slab);
  return slab;
};

/**
 * Option B: Manual Slab Creation
 * Admin selects an array of questions directly from the library (up to 12).
 */
export const createManualSlab = (playerName, chosenQuestions = []) => {
  const slots = Array.from({ length: 12 }).map((_, idx) => {
    const question = chosenQuestions[idx] || null;
    return {
      slotNumber: idx + 1,
      question: question,
      status: question ? (idx === 0 ? 'current' : 'unplayed') : 'empty',
      result: null,
    };
  });

  const slab = {
    id: `slab-manual-${Date.now()}`,
    playerName: playerName || 'Contender',
    slots: slots,
    currentSlot: 1,
    status: 'review',
    createdAt: new Date().toISOString(),
  };

  saveActiveSlab(slab);
  return slab;
};

export const getActiveSlab = () => {
  try {
    const saved = getStoredValue(STORAGE_KEYS.ACTIVE_SLAB);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error('Failed reading active slab:', err);
  }
  return null;
};

export const saveActiveSlab = (slab) => {
  setStoredValue(STORAGE_KEYS.ACTIVE_SLAB, JSON.stringify(slab));
};

// ----------------------------------------------------------------------------
// 4. SLAB REVIEW & EDIT ACTIONS (REMOVE, REPLACE, ADD)
// ----------------------------------------------------------------------------

export const removeSlabSlot = (slab, slotNumber) => {
  if (!slab) return slab;

  const updatedSlots = slab.slots.map((slot) => {
    if (slot.slotNumber === slotNumber && slot.status !== 'completed' && slot.status !== 'skipped') {
      return {
        ...slot,
        question: null,
        status: 'empty',
      };
    }
    return slot;
  });

  const updatedSlab = { ...slab, slots: updatedSlots };
  saveActiveSlab(updatedSlab);
  return updatedSlab;
};

export const replaceSlabSlot = (slab, slotNumber, replacementQuestion) => {
  if (!slab || !replacementQuestion) return slab;

  const isDuplicate = slab.slots.some(
    (s) => s.slotNumber !== slotNumber && s.question && s.question.id === replacementQuestion.id
  );

  if (isDuplicate) {
    throw new Error('This puzzle is already selected in this slab.');
  }

  const updatedSlots = slab.slots.map((slot) => {
    if (slot.slotNumber === slotNumber) {
      return {
        ...slot,
        question: replacementQuestion,
        status: slotNumber === slab.currentSlot ? 'current' : 'unplayed',
      };
    }
    return slot;
  });

  const updatedSlab = { ...slab, slots: updatedSlots };
  saveActiveSlab(updatedSlab);
  return updatedSlab;
};

export const isSlabComplete = (slab) => {
  if (!slab || !Array.isArray(slab.slots) || slab.slots.length !== 12) return false;
  return slab.slots.every((slot) => slot.question !== null && slot.status !== 'empty');
};

// ----------------------------------------------------------------------------
// 5. INDIVIDUAL PLAYER SCORING (1 PT CORRECT, 0 WRONG, 0 SKIP)
// ----------------------------------------------------------------------------

export const getRegisteredPlayers = () => {
  try {
    const raw = getStoredValue(STORAGE_KEYS.PLAYERS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading players:', err);
  }
  return [];
};

export const savePlayers = (players) => {
  setStoredValue(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
};

export const registerPlayer = (name) => {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Player name cannot be empty.');

  const current = getRegisteredPlayers();
  const existing = current.find((p) => p.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) {
    return existing;
  }

  const newPlayer = {
    id: `player-${Date.now()}`,
    name: trimmed,
    correct: 0,
    wrong: 0,
    skipped: 0,
    points: 0,
    isQualified: false,
    createdAt: new Date().toISOString(),
  };

  const updated = [...current, newPlayer];
  savePlayers(updated);

  if (isSupabaseConfigured()) {
    supabase.from('gw_players').insert([{
      name: newPlayer.name,
      correct_count: 0,
      wrong_count: 0,
      skipped_count: 0,
      total_points: 0,
    }]).then(({ error }) => {
      if (error) console.warn('Supabase player sync skipped:', error.message);
    });
  }

  return newPlayer;
};

export const recordPlayerTurn = (playerName, slotNumber, result) => {
  const players = getRegisteredPlayers();
  const playerIdx = players.findIndex((p) => p.name === playerName);

  if (playerIdx === -1) return null;

  const player = { ...players[playerIdx] };

  if (result === 'correct') {
    player.correct += 1;
    player.points += 1;
  } else if (result === 'wrong') {
    player.wrong += 1;
  } else if (result === 'skip') {
    player.skipped += 1;
  }

  player.isQualified = player.correct >= 7;
  players[playerIdx] = player;
  savePlayers(players);

  if (isSupabaseConfigured()) {
    supabase.from('gw_players').update({
      correct_count: player.correct,
      wrong_count: player.wrong,
      skipped_count: player.skipped,
      total_points: player.points,
    }).eq('name', player.name).then(({ error }) => {
      if (error) console.warn('Supabase player update skipped:', error.message);
    });
  }

  return player;
};

// ----------------------------------------------------------------------------
// 6. SANITIZED PROJECTOR REALTIME SYNC
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// 6. AUTHORITATIVE GAME STATE & TWO-DEVICE SUPABASE REALTIME SYNC
// ----------------------------------------------------------------------------

let liveChannel = null;
let activeRealtimeChannel = null;

let syncStatus = {
  status: isSupabaseConfigured() ? 'ready' : 'offline',
  mode: isSupabaseConfigured() ? 'supabase' : 'local_fallback',
  isConfigured: isSupabaseConfigured(),
  isRealtimeConnected: false,
  isSubscribed: false,
  lastSyncTime: null,
  error: null,
};
const syncStatusListeners = new Set();
const localStateSubscribers = new Set();

const updateSyncStatus = (patch) => {
  syncStatus = { ...syncStatus, ...patch };
  syncStatusListeners.forEach((fn) => {
    try { fn(syncStatus); } catch (e) {}
  });
};

export const getSupabaseSyncStatus = () => ({ ...syncStatus, isConfigured: isSupabaseConfigured() });

export const subscribeToSyncStatus = (listener) => {
  if (typeof listener !== 'function') return () => {};
  syncStatusListeners.add(listener);
  listener(getSupabaseSyncStatus());
  return () => syncStatusListeners.delete(listener);
};

const getLiveChannel = () => {
  if (typeof window === 'undefined') return null;
  if (!liveChannel && typeof window.BroadcastChannel !== 'undefined') {
    liveChannel = new BroadcastChannel(CHANNEL_NAME);
  }
  return liveChannel;
};

const getSupabaseRealtimeChannel = () => {
  if (!isSupabaseConfigured() || !supabase) return null;
  if (!activeRealtimeChannel) {
    activeRealtimeChannel = supabase.channel('gw_game_state_sync', {
      config: {
        broadcast: { ack: false, self: true },
      },
    });
    if (typeof activeRealtimeChannel.subscribe === 'function') {
      activeRealtimeChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          updateSyncStatus({ isRealtimeConnected: true, isSubscribed: true, status: 'connected', error: null });
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          updateSyncStatus({ isRealtimeConnected: false, isSubscribed: false, status: 'error', error: `Realtime connection: ${status}` });
        }
      });
    }
  }
  return activeRealtimeChannel;
};

/**
 * Normalizes and sanitizes game state for the player/projector display.
 * CRITICAL SECURITY INVARIANT:
 * This payload strictly NEVER contains `correct_answer`, `clue`, category internal id,
 * or coordinator controls. It is safe for public websocket broadcasts and database reads.
 */
export const sanitizeGameStateForProjector = (data) => {
  if (!data) {
    return {
      id: 'active_session',
      sessionId: 'session-init',
      playerName: 'Contender',
      isGameActive: false,
      isGameEnded: false,
      isWinner: false,
      isEarlyWin: false,
      currentSlot: 1,
      score: 0,
      finalScore: 0,
      totalQuestions: 12,
      imageUrl: null,
      dialogueText: null,
      songClueText: null,
      subtype: null,
      revealType: 'crop',
      revealMetadata: null,
      revealLevel: 1,
      isDisplayed: false,
      feedback: null,
      resultMessage: null,
      updatedAt: Date.now(),
    };
  }

  const scoreVal = Number(data.final_score ?? data.finalScore ?? data.score ?? 0);

  return {
    id: 'active_session',
    sessionId: data.session_id || data.sessionId || 'session-active',
    playerName: data.player_name || data.playerName || 'Contender',
    isGameActive: Boolean(data.is_game_active ?? data.isGameActive),
    isGameEnded: Boolean(data.is_game_ended ?? data.isGameEnded),
    isWinner: Boolean(data.is_winner ?? data.isWinner),
    isEarlyWin: Boolean(data.is_early_win ?? data.isEarlyWin),
    currentSlot: Number(data.current_slot ?? data.currentSlot) || 1,
    score: scoreVal,
    finalScore: scoreVal,
    totalQuestions: Number(data.total_questions ?? data.totalQuestions) || 12,
    imageUrl: data.image_url || data.imageUrl || null,
    dialogueText: data.dialogue_text || data.dialogueText || null,
    songClueText: data.song_clue_text || data.songClueText || null,
    subtype: data.subtype || null,
    revealType: data.reveal_type || data.revealType || 'crop',
    revealMetadata: data.reveal_metadata || data.revealMetadata || null,
    revealLevel: Number(data.reveal_level ?? data.revealLevel) || 1,
    isDisplayed: Boolean(data.is_displayed ?? data.isDisplayed),
    feedback: data.feedback || null, // { type: 'correct'|'wrong', message: string, puzzleSlot: number, timestamp: number }
    resultMessage: data.result_message || data.resultMessage || null,
    updatedAt: Number(data.updated_at || data.updatedAt) || Date.now(),
  };
};

export const clearStaleProjectorCache = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEYS.DISPLAY_STATE);
      localStorage.removeItem(STORAGE_KEYS.AUTHORITATIVE_STATE);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SLAB);
      localStorage.removeItem('funtopia_guess_who_state');
    } catch (e) {}
  }
  const clean = sanitizeGameStateForProjector(null);
  localStateSubscribers.forEach((fn) => {
    try { fn(clean); } catch (e) {}
  });
  return clean;
};

export const getDisplayState = () => {
  try {
    const raw = getStoredValue(STORAGE_KEYS.AUTHORITATIVE_STATE) || getStoredValue(STORAGE_KEYS.DISPLAY_STATE);
    if (raw) {
      const parsed = JSON.parse(raw);
      const updatedTime = Number(parsed.updatedAt || parsed.updated_at || 0);
      const ageMs = Date.now() - updatedTime;
      if (updatedTime > 0 && ageMs > 3 * 60 * 60 * 1000) {
        return sanitizeGameStateForProjector(null);
      }
      return sanitizeGameStateForProjector(parsed);
    }
  } catch (err) {
    console.error('Failed reading display state:', err);
  }
  return sanitizeGameStateForProjector(null);
};

/**
 * Publishes authoritative game state updates across devices.
 * 1. Writes to Supabase Database table `gw_game_state` (enables late-joining & reconnecting laptops)
 * 2. Emits real-time broadcast via Supabase Realtime Channel (<50ms delivery)
 * 3. Persists to localStorage and local BroadcastChannel for same-origin multi-tab fallbacks.
 */
export const publishAuthoritativeState = async (updates = {}) => {
  const current = getDisplayState();
  const explicitScore = updates.score !== undefined ? updates.score : updates.finalScore;
  const merged = {
    ...current,
    ...updates,
    ...(explicitScore !== undefined ? { score: explicitScore, finalScore: explicitScore } : {}),
    updatedAt: Date.now(),
  };
  const sanitized = sanitizeGameStateForProjector(merged);

  // 1. Local fallback persistence
  try {
    const serialized = JSON.stringify(sanitized);
    setStoredValue(STORAGE_KEYS.DISPLAY_STATE, serialized);
    setStoredValue(STORAGE_KEYS.AUTHORITATIVE_STATE, serialized);
  } catch (err) {}

  // Local in-memory subscribers (SSR, testing, instant updates)
  localStateSubscribers.forEach((fn) => {
    try { fn(sanitized); } catch (e) {}
  });

  // 2. Local BroadcastChannel for same-browser testing
  const localCh = getLiveChannel();
  if (localCh) {
    try {
      localCh.postMessage({ type: 'STATE_CHANGE', payload: sanitized });
    } catch (err) {}
  }

  // 3. Supabase Realtime multi-device sync
  if (isSupabaseConfigured() && supabase) {
    const dbPayload = {
      id: 'active_session',
      session_id: sanitized.sessionId,
      player_name: sanitized.playerName,
      is_game_active: sanitized.isGameActive,
      is_game_ended: sanitized.isGameEnded,
      is_winner: sanitized.isWinner,
      current_slot: sanitized.currentSlot,
      score: sanitized.score,
      final_score: sanitized.finalScore,
      total_questions: sanitized.totalQuestions,
      image_url: sanitized.imageUrl,
      dialogue_text: sanitized.dialogueText,
      song_clue_text: sanitized.songClueText,
      subtype: sanitized.subtype,
      reveal_type: sanitized.revealType,
      reveal_metadata: sanitized.revealMetadata,
      reveal_level: sanitized.revealLevel,
      is_displayed: sanitized.isDisplayed,
      feedback: sanitized.feedback,
      result_message: sanitized.resultMessage,
      updated_at: sanitized.updatedAt,
    };

    // A) Persist in Postgres table `gw_game_state` so reconnecting laptops get latest state
    try {
      supabase
        .from('gw_game_state')
        .upsert(dbPayload, { onConflict: 'id' })
        .then(({ error }) => {
          if (error && error.code !== '42P01') {
            console.warn('gw_game_state upsert notice:', error.message);
            updateSyncStatus({ error: error.message });
          } else if (!error) {
            updateSyncStatus({ lastSyncTime: Date.now(), error: null });
          }
        });
    } catch (err) {
      console.warn('Supabase state upsert exception:', err);
      updateSyncStatus({ error: err.message });
    }

    // B) Realtime instant broadcast
    try {
      const channel = getSupabaseRealtimeChannel();
      if (channel) {
        channel.send({
          type: 'broadcast',
          event: 'STATE_CHANGE',
          payload: sanitized,
        });
      }
    } catch (err) {
      console.warn('Realtime channel broadcast exception:', err);
    }
  }

  return sanitized;
};

/**
 * Fetches the single authoritative game state.
 * Queries Supabase Postgres table `gw_game_state` first to guarantee consistency across devices.
 * Falls back to local storage if Supabase is unconfigured or unreachable.
 */
export const fetchAuthoritativeState = async () => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('gw_game_state')
        .select('*')
        .eq('id', 'active_session')
        .maybeSingle();

      if (!error && data) {
        const updatedTime = Number(data.updated_at || data.updatedAt || 0);
        const ageMs = Date.now() - updatedTime;
        if (updatedTime > 0 && ageMs > 3 * 60 * 60 * 1000) {
          const clean = sanitizeGameStateForProjector(null);
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.AUTHORITATIVE_STATE, JSON.stringify(clean));
            localStorage.setItem(STORAGE_KEYS.DISPLAY_STATE, JSON.stringify(clean));
          }
          return clean;
        }

        const sanitized = sanitizeGameStateForProjector(data);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.AUTHORITATIVE_STATE, JSON.stringify(sanitized));
          localStorage.setItem(STORAGE_KEYS.DISPLAY_STATE, JSON.stringify(sanitized));
        }
        return sanitized;
      }
    } catch (err) {
      console.warn('Failed querying Supabase gw_game_state, falling back to local state:', err);
    }
  }

  return getDisplayState();
};

/**
 * Subscribes the Player/Projector Laptop to the Authoritative Game State.
 * Handles:
 * - Supabase Realtime broadcast events (<50ms delivery)
 * - Supabase Postgres table changes
 * - Automatic catch-up on connect or reconnect after network disconnections
 * - Local BroadcastChannel / storage event fallback
 */
export const subscribeToAuthoritativeState = (callback) => {
  const notify = (raw) => {
    if (!raw) return;
    const sanitized = sanitizeGameStateForProjector(raw);
    callback(sanitized);
  };

  localStateSubscribers.add(notify);

  if (typeof window === 'undefined') {
    return () => {
      localStateSubscribers.delete(notify);
    };
  }

  // 1. Local BroadcastChannel
  const handleLocalChannel = (event) => {
    if (event.data && event.data.payload) {
      notify(event.data.payload);
    }
  };

  // 2. Local storage event (same-origin multi-tab sync)
  const handleStorage = (event) => {
    if (
      (event.key === STORAGE_KEYS.DISPLAY_STATE || event.key === STORAGE_KEYS.AUTHORITATIVE_STATE) &&
      event.newValue
    ) {
      try {
        notify(JSON.parse(event.newValue));
      } catch (err) {}
    }
  };

  const localCh = getLiveChannel();
  if (localCh) {
    localCh.addEventListener('message', handleLocalChannel);
  }
  window.addEventListener('storage', handleStorage);

  // 3. Network Online reconnect handler
  const handleOnline = () => {
    fetchAuthoritativeState().then(notify);
  };
  window.addEventListener('online', handleOnline);

  // 4. Supabase Realtime subscription
  let realtimeChannel = null;
  if (isSupabaseConfigured() && supabase) {
    realtimeChannel = supabase.channel('gw_game_state_sync', {
      config: {
        broadcast: { ack: false, self: true },
      },
    });

    realtimeChannel
      // Instant broadcast
      .on('broadcast', { event: 'STATE_CHANGE' }, ({ payload }) => {
        notify(payload);
      })
      // Postgres database row change
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gw_game_state' }, ({ new: record }) => {
        if (record) notify(record);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // Channel connected or reconnected! Fetch latest authoritative state from database
          fetchAuthoritativeState().then(notify);
        }
      });
  }

  // Initial immediate load: fetch latest authoritative state
  fetchAuthoritativeState().then(notify);

  return () => {
    localStateSubscribers.delete(notify);
    if (localCh) {
      localCh.removeEventListener('message', handleLocalChannel);
    }
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('online', handleOnline);
    if (realtimeChannel && supabase) {
      supabase.removeChannel(realtimeChannel);
    }
  };
};

// Backward compatibility wrappers
export const broadcastToProjector = (data) => {
  return publishAuthoritativeState(data);
};

export const broadcastFinalResultToProjector = ({ playerName, finalScore, resultMessage, isWinner }) => {
  return publishAuthoritativeState({
    playerName,
    score: Number(finalScore) || 0,
    resultMessage: resultMessage || 'Game Completed!',
    isWinner: Boolean(isWinner),
    isGameEnded: true,
    isGameActive: false,
    feedback: null,
  });
};

export const subscribeToProjector = (callback) => {
  return subscribeToAuthoritativeState(callback);
};

/**
 * Executes an atomic, idempotent scoring action for the active game slot.
 * 
 * BACKEND OPERATION:
 * When connected to Supabase, calls the atomic PostgreSQL RPC `gw_submit_turn`.
 * The database transaction enforces:
 * - Session validation
 * - Slot number validation
 * - Idempotency via UNIQUE (session_id, slot_number) constraint on gw_turn_events
 * - Server-side point calculation and early-win (score >= 7) checking
 * - Immediate game halt and run archiving
 * 
 * LOCAL / OFFLINE OPERATION:
 * When Supabase is offline or unconfigured, enforces identical transactional invariants
 * in memory / localStorage to prevent duplicate submissions or race conditions.
 */
export const submitAuthoritativeTurn = async ({
  sessionId,
  slotNumber,
  result, // 'correct' | 'wrong' | 'skip'
  nextQuestion = null,
}) => {
  if (!['correct', 'wrong', 'skip'].includes(result)) {
    throw new Error(`Invalid turn result: "${result}". Expected 'correct', 'wrong', or 'skip'.`);
  }

  const currentDisplay = getDisplayState();
  const effectiveSessionId = sessionId || currentDisplay.sessionId || 'session-active';

  // 1. SUPABASE SECURE ATOMIC RPC (If configured)
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.rpc('gw_submit_turn', {
        p_session_id: effectiveSessionId,
        p_slot_number: Number(slotNumber),
        p_result: result,
        p_next_image_url: nextQuestion ? nextQuestion.image_url : null,
        p_next_dialogue_text: nextQuestion ? nextQuestion.dialogue_text : null,
        p_next_reveal_type: nextQuestion ? (nextQuestion.reveal_type || 'crop') : 'crop',
        p_next_reveal_metadata: nextQuestion ? (nextQuestion.reveal_metadata || null) : null,
        p_next_song_clue_text: nextQuestion ? (nextQuestion.song_clue_text || (nextQuestion.subtype === 'bollywood_song_guess' ? nextQuestion.clue : null)) : null,
        p_next_subtype: nextQuestion ? (nextQuestion.subtype || null) : null,
      });

      if (error) {
        console.error('Supabase atomic scoring rejection:', error.message);
        updateSyncStatus({ error: error.message });
        throw new Error(error.message);
      }

      if (data) {
        updateSyncStatus({ lastSyncTime: Date.now(), error: null });
        const updatedTime = Number(data.updated_at || data.updatedAt || 0);
        const ageMs = Date.now() - updatedTime;
        if (updatedTime > 0 && ageMs > 3 * 60 * 60 * 1000) {
          const clean = sanitizeGameStateForProjector(null);
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.AUTHORITATIVE_STATE, JSON.stringify(clean));
            localStorage.setItem(STORAGE_KEYS.DISPLAY_STATE, JSON.stringify(clean));
          }
          return clean;
        }

        const sanitized = sanitizeGameStateForProjector(data);
        setStoredValue(STORAGE_KEYS.DISPLAY_STATE, JSON.stringify(sanitized));
        setStoredValue(STORAGE_KEYS.AUTHORITATIVE_STATE, JSON.stringify(sanitized));
        return sanitized;
      }
    } catch (rpcErr) {
      if (rpcErr.message && (
        rpcErr.message.includes('Duplicate submission') ||
        rpcErr.message.includes('already completed') ||
        rpcErr.message.includes('Slot mismatch') ||
        rpcErr.message.includes('Stale session ID')
      )) {
        throw rpcErr;
      }
      console.warn('Supabase RPC unavailable, processing turn in secure local fallback mode:', rpcErr);
    }
  }

  // 2. SECURE LOCAL / OFFLINE FALLBACK TRANSACTION
  const slab = getActiveSlab();
  if (!slab || !slab.slots) {
    throw new Error('No active slab found for scoring.');
  }

  if (slab.status === 'completed') {
    throw new Error('Scoring rejected: current run is already completed.');
  }

  const slotIndex = Number(slotNumber) - 1;
  const targetSlot = slab.slots[slotIndex];

  if (!targetSlot) {
    throw new Error(`Slot #${slotNumber} does not exist in slab.`);
  }

  // Idempotency: verify slot has not already been scored
  if (targetSlot.status === 'completed' || targetSlot.status === 'skipped') {
    throw new Error(`Duplicate submission rejected: Slot #${slotNumber} is already completed.`);
  }

  // Calculate points from verified completed slots in the slab
  const pointsAwarded = result === 'correct' ? 1 : 0;
  const currentScore = slab.slots.filter((s) => s.result === 'correct').length;
  const newScore = currentScore + pointsAwarded;

  // Update target slot status atomically
  const updatedSlots = slab.slots.map((s, idx) => {
    if (idx === slotIndex) {
      return {
        ...s,
        status: result === 'skip' ? 'skipped' : 'completed',
        result: result,
      };
    }
    return s;
  });

  // Evaluate victory conditions
  const isEarlyWin = newScore >= 7;
  const isFinalPuzzle = slotNumber >= (slab.slots.length || 12);
  const isRunCompleted = isEarlyWin || isFinalPuzzle;
  const isWinner = newScore >= 7;

  const updatedSlab = {
    ...slab,
    slots: updatedSlots,
    status: isRunCompleted ? 'completed' : 'active',
  };
  saveActiveSlab(updatedSlab);

  // Update registered player records
  recordPlayerTurn(slab.playerName, slotNumber, result);

  let resultDetails = null;
  if (isRunCompleted) {
    resultDetails = getResultDetails(newScore);
    archiveCompletedRun(slab.playerName, newScore, updatedSlab, isEarlyWin);
  }

  // Build feedback payload for ongoing run
  const feedbackData = (isRunCompleted || result === 'skip') ? null : {
    type: result,
    message: result === 'correct' ? "Brilliant! That's Correct!" : "Good Try! Let's Move On!",
    puzzleSlot: slotNumber,
    timestamp: Date.now(),
  };

  const nextSlotNumber = isRunCompleted ? slotNumber : slotNumber + 1;

  // Publish authoritative state
  const newState = await publishAuthoritativeState({
    sessionId: effectiveSessionId,
    playerName: slab.playerName,
    score: newScore,
    finalScore: newScore,
    currentSlot: nextSlotNumber,
    isGameActive: !isRunCompleted,
    isGameEnded: isRunCompleted,
    isWinner: isWinner,
    isEarlyWin: isEarlyWin,
    resultMessage: isRunCompleted ? resultDetails?.message : null,
    feedback: feedbackData,
    imageUrl: isRunCompleted ? null : (nextQuestion ? nextQuestion.image_url : null),
    dialogueText: isRunCompleted ? null : (nextQuestion ? nextQuestion.dialogue_text : null),
    songClueText: isRunCompleted ? null : (nextQuestion ? (nextQuestion.english_clue || nextQuestion.song_clue_text || (nextQuestion.subtype === 'bollywood_song_guess' ? nextQuestion.clue : null)) : null),
    subtype: isRunCompleted ? null : (nextQuestion ? nextQuestion.subtype : null),
    revealType: isRunCompleted ? 'crop' : (nextQuestion?.reveal_type || 'crop'),
    revealMetadata: isRunCompleted ? null : (nextQuestion?.reveal_metadata || null),
    revealLevel: 1,
    isDisplayed: !isRunCompleted,
  });

  return newState;
};
