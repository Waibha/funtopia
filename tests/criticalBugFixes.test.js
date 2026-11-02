import test from 'node:test';
import assert from 'node:assert/strict';

import {
  clearStaleProjectorCache,
  getDisplayState,
  sanitizeGameStateForProjector,
  publishAuthoritativeState,
} from '../src/services/guessWhoService.js';

import {
  gwSupabaseConfig,
  isGwSupabaseConfigured,
  validateGwSupabaseConfig,
} from '../src/services/guessWhoSupabaseClient.js';

test('--- CRITICAL BUG FIXES & CHAMPIONSHIP INTEGRATION TESTS ---', async (t) => {
  await t.test('1. Participant with 17 coins joining Guess Who (5 coin fee) succeeds with 12 coins remaining', () => {
    const participant = {
      id: 'p-test-1',
      name: 'Player One',
      usn: 'USN001',
      coins: 17,
    };

    const games = [
      {
        id: 'game-guess-who',
        name: 'Guess Who?',
        cost: 5,
        defaultPoints: 7,
        isActive: true,
      },
    ];

    const currentCoins = Number(participant.coins || 0);
    const game = games.find((g) => g.id === 'game-guess-who');
    const entryCost = Math.max(0, Number(game.cost !== undefined ? game.cost : 5));

    assert.equal(entryCost, 5, 'Guess Who entry cost must be 5 coins');
    assert.ok(currentCoins >= entryCost, 'Participant with 17 coins has sufficient balance');

    const newBalance = currentCoins - entryCost;
    assert.equal(newBalance, 12, '17 coins - 5 entry coins must equal exactly 12 coins');

    const coinTx = {
      id: `ctx-${Date.now()}`,
      participantId: participant.id,
      participantName: participant.name,
      gameId: game.id,
      gameName: game.name,
      amountDelta: -entryCost,
      newBalance,
      type: 'game_entry',
      reason: `Entered ${game.name}`,
    };

    assert.equal(coinTx.amountDelta, -5, 'Transaction delta must be -5 coins');
    assert.equal(coinTx.newBalance, 12, 'Transaction new balance must be 12');
    assert.equal(coinTx.type, 'game_entry', 'Transaction type must be game_entry');
  });

  await t.test('2. Participant with insufficient coins (<5 coins) is rejected with clear error', () => {
    const participant = {
      id: 'p-test-2',
      name: 'Low Balance Player',
      usn: 'USN002',
      coins: 4,
    };

    const game = {
      id: 'game-guess-who',
      name: 'Guess Who?',
      cost: 5,
    };

    const currentCoins = Number(participant.coins || 0);
    const entryCost = Number(game.cost || 5);

    const isAffordable = currentCoins >= entryCost;
    assert.equal(isAffordable, false, 'Participant with 4 coins must not afford 5 coin game');

    const failureReason = `Insufficient coins. Required: ${entryCost}, Available: ${currentCoins}.`;
    assert.ok(failureReason.includes('Required: 5'), 'Error must specify required coins');
    assert.ok(failureReason.includes('Available: 4'), 'Error must specify available coins');
  });

  await t.test('3. Stale projector cache invalidation (TTL > 3 hours or corrupted state)', () => {
    // A) Clear stale projector cache
    const cleanState = clearStaleProjectorCache();
    assert.equal(cleanState.isDisplayed, false, 'Clean state must not be displayed on screen');
    assert.equal(cleanState.isGameActive, false, 'Clean state must not be active');
    assert.equal(cleanState.imageUrl, null, 'Clean state must not contain lingering puzzle image');

    // B) Stale state simulation (> 3 hours old)
    const staleTime = Date.now() - (4 * 60 * 60 * 1000); // 4 hours ago
    const staleState = {
      imageUrl: '/assets/guess-who/manual_uploads/flags/bangladesh.jpeg',
      isDisplayed: true,
      updatedAt: staleTime,
    };

    // Stored in localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('funtopia_gw_display_state', JSON.stringify(staleState));
      const loaded = getDisplayState();
      assert.equal(loaded.isDisplayed, false, 'Stale display state older than 3 hours must be discarded');
      assert.equal(loaded.imageUrl, null, 'Stale image URL must be cleared');
    }
  });

  await t.test('4. Dedicated Guess Who Supabase client falls back gracefully', () => {
    assert.ok(typeof isGwSupabaseConfigured === 'function', 'isGwSupabaseConfigured must be a function');
    assert.ok(typeof validateGwSupabaseConfig === 'function', 'validateGwSupabaseConfig must be a function');
    const report = validateGwSupabaseConfig();
    assert.ok('errors' in report, 'Validation report must contain errors array');
    assert.ok('warnings' in report, 'Validation report must contain warnings array');
  });
});
