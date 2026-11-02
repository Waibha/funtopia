import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isSupabaseConfigured,
  supabaseConfig,
  getSupabaseStatus,
  checkSupabaseConnection,
  supabase,
  SUPABASE_TABLES,
} from '../src/services/supabaseClient.js';

import {
  isGwSupabaseConfigured,
  gwSupabaseConfig,
  getGwSupabaseStatus,
  validateGwSupabaseConfig,
  gwSupabase,
  GW_SUPABASE_TABLES,
  verifyCoordinatorRole,
  signInCoordinator,
  signOutCoordinator,
  getCoordinatorSession,
  onCoordinatorAuthStateChange,
} from '../src/services/guessWhoSupabaseClient.js';

import { getSupabaseSyncStatus } from '../src/services/guessWhoService.js';

test('--- DUAL SUPABASE CLIENTS ARCHITECTURE & INDEPENDENCE ---', async (t) => {
  await t.test('1. Core Championship Platform client preserves existing interface and behavior', () => {
    assert.equal(typeof isSupabaseConfigured, 'function', 'isSupabaseConfigured must be a function');
    assert.equal(typeof isSupabaseConfigured(), 'boolean', 'isSupabaseConfigured() must return a boolean');
    assert.ok(supabaseConfig && typeof supabaseConfig === 'object', 'supabaseConfig must be an object');
    assert.ok('url' in supabaseConfig, 'supabaseConfig must have url');
    assert.ok('anonKey' in supabaseConfig, 'supabaseConfig must have anonKey');

    const status = getSupabaseStatus();
    assert.ok(status && typeof status === 'object', 'getSupabaseStatus() must return an object');
    assert.ok('configured' in status, 'status must have configured field');
    assert.ok('ready' in status, 'status must have ready field');

    assert.ok(supabase && typeof supabase === 'object', 'supabase client instance must exist');
    assert.ok(typeof supabase.from === 'function', 'supabase.from must be a function');
    assert.ok(typeof supabase.auth === 'function' || typeof supabase.auth === 'object', 'supabase.auth must exist');
    assert.ok(SUPABASE_TABLES.PROFILES === 'profiles', 'SUPABASE_TABLES must retain profiles table');
  });

  await t.test('2. Guess Who Supabase client has dedicated configuration and tables', () => {
    assert.equal(typeof isGwSupabaseConfigured, 'function', 'isGwSupabaseConfigured must be a function');
    assert.equal(typeof isGwSupabaseConfigured(), 'boolean', 'isGwSupabaseConfigured() must return a boolean');
    assert.ok(gwSupabaseConfig && typeof gwSupabaseConfig === 'object', 'gwSupabaseConfig must be an object');
    assert.ok('url' in gwSupabaseConfig, 'gwSupabaseConfig must have url');
    assert.ok('anonKey' in gwSupabaseConfig, 'gwSupabaseConfig must have anonKey');

    const gwStatus = getGwSupabaseStatus();
    assert.ok(gwStatus && typeof gwStatus === 'object', 'getGwSupabaseStatus() must return an object');
    assert.ok('configured' in gwStatus, 'gwStatus must have configured field');
    assert.ok('ready' in gwStatus, 'gwStatus must have ready field');
    assert.ok('validation' in gwStatus, 'gwStatus must include validation details');

    assert.ok(gwSupabase && typeof gwSupabase === 'object', 'gwSupabase client instance must exist');
    assert.ok(typeof gwSupabase.from === 'function', 'gwSupabase.from must be a function');
    assert.ok(typeof gwSupabase.auth === 'function' || typeof gwSupabase.auth === 'object', 'gwSupabase.auth must exist');
    assert.ok(typeof gwSupabase.storage === 'function' || typeof gwSupabase.storage === 'object', 'gwSupabase.storage must exist');

    assert.equal(GW_SUPABASE_TABLES.GW_GAME_STATE, 'gw_game_state');
    assert.equal(GW_SUPABASE_TABLES.GW_COORDINATORS, 'gw_coordinators');
    assert.equal(GW_SUPABASE_TABLES.GW_TURN_EVENTS, 'gw_turn_events');
    assert.equal(GW_SUPABASE_TABLES.GW_PLAYERS, 'gw_players');
    assert.equal(GW_SUPABASE_TABLES.GW_ATTEMPTS, 'gw_attempts');
    assert.equal(GW_SUPABASE_TABLES.GW_QUESTIONS, 'gw_questions');
  });

  await t.test('3. Clear Environment-Variable Validation diagnostics', () => {
    const validation = validateGwSupabaseConfig();
    assert.ok(validation && typeof validation === 'object', 'validateGwSupabaseConfig must return validation report');
    assert.ok(Array.isArray(validation.errors), 'validation.errors must be an array');
    assert.ok(Array.isArray(validation.warnings), 'validation.warnings must be an array');
    assert.equal(typeof validation.valid, 'boolean', 'validation.valid must be a boolean');
    assert.equal(typeof validation.hasErrors, 'boolean', 'validation.hasErrors must be a boolean');
  });

  await t.test('4. Guess Who sync telemetry reports Guess Who client status', () => {
    const syncStatus = getSupabaseSyncStatus();
    assert.ok(syncStatus && typeof syncStatus === 'object', 'getSupabaseSyncStatus must return status object');
    assert.equal(syncStatus.isConfigured, isGwSupabaseConfigured(), 'sync status isConfigured must match isGwSupabaseConfigured()');
  });

  await t.test('5. verifyCoordinatorRole strictly gates coordinator authorization', async () => {
    // Null or undefined user
    assert.equal(await verifyCoordinatorRole(null), false, 'Null user must be rejected');
    assert.equal(await verifyCoordinatorRole({}), false, 'Empty user object must be rejected');
    assert.equal(await verifyCoordinatorRole({ id: 'some-id' }), false, 'User without role or db record must be rejected');

    // Ordinary participant with role = 'participant'
    assert.equal(
      await verifyCoordinatorRole({ id: 'u1', app_metadata: { role: 'participant' } }),
      false,
      'Participant role must NOT be granted coordinator access'
    );

    // Verified coordinator in app_metadata
    assert.equal(
      await verifyCoordinatorRole({ id: 'u2', app_metadata: { role: 'coordinator' } }),
      true,
      'Coordinator role in app_metadata must be granted access'
    );

    // Verified lead coordinator in app_metadata
    assert.equal(
      await verifyCoordinatorRole({ id: 'u3', app_metadata: { role: 'lead_coordinator' } }),
      true,
      'Lead coordinator role in app_metadata must be granted access'
    );

    // Verified admin in app_metadata
    assert.equal(
      await verifyCoordinatorRole({ id: 'u4', app_metadata: { role: 'admin' } }),
      true,
      'Admin role in app_metadata must be granted access'
    );

    // Flag is_coordinator in app_metadata
    assert.equal(
      await verifyCoordinatorRole({ id: 'u5', app_metadata: { is_coordinator: true } }),
      true,
      'is_coordinator flag in app_metadata must be granted access'
    );
  });

  await t.test('6. Coordinator Auth flow handles offline safety and session lifecycle', async () => {
    // In unconfigured/offline test environment:
    const session = await getCoordinatorSession();
    assert.equal(session.user, null, 'Offline session user must be null');
    assert.equal(session.session, null, 'Offline session token must be null');

    const authSub = onCoordinatorAuthStateChange(() => {});
    assert.ok(authSub && typeof authSub.unsubscribe === 'function', 'Auth subscription must return unsubscribe');
    authSub.unsubscribe();

    const signoutResult = await signOutCoordinator();
    assert.equal(signoutResult.error, null, 'Signout in offline mode should succeed without throw');
  });
});
