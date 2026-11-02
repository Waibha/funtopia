import assert from 'node:assert';

// Setup Mock Storage for Node.js test environment
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear(),
};
globalThis.sessionStorage = {
  getItem: (k) => mockStorage.get(`session:${k}`) || null,
  setItem: (k, v) => mockStorage.set(`session:${k}`, String(v)),
  removeItem: (k) => mockStorage.delete(`session:${k}`),
  clear: () => mockStorage.clear(),
};

import {
  initiateParticipantRegistration,
  completeParticipantVerification,
} from '../src/services/api/authService.js';
import {
  calculateLeaderboard,
} from '../src/utilities/leaderboardEngine.js';

console.log('=== FUNTOPIA: 12-STEP COIN SYSTEM & REGISTRATION INTEGRATION TEST ===\n');

// Simulated storage state mimicking App.jsx state and persistence
let data = {
  activeCompetition: {
    id: 'funtopia-comp-2026',
    name: 'FUNTOPIA Championship 2026',
    subtitle: 'Championship Circuit',
    status: 'active',
  },
  settings: {
    startingCoins: 5, // Step 1: Admin sets starting coins to 5
    allowNewRegistrations: true,
  },
  games: [
    { id: 'gm-pixel-pong', name: 'Pixel Pong', cost: 6, isActive: true },
    { id: 'gm-speed-run', name: 'Speed Run Arena', cost: 4, isActive: true },
    { id: 'gm-neon-stacker', name: 'Neon Stacker', cost: 2, isActive: true },
  ],
  participants: [],
  transactions: [],
  coinTransactions: [],
};

// Handlers identical to App.jsx implementation
function handleUpdateStartingCoins(amount) {
  data.settings.startingCoins = Math.max(0, parseInt(amount, 10) || 0);
}

function handleRegisterParticipant(newParticipant) {
  const allocatedCoins = Number(newParticipant.coins || 0);
  const startingAllocationTx = {
    id: `ctx-start-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    participantId: newParticipant.id,
    participantName: newParticipant.name,
    amountDelta: allocatedCoins,
    newBalance: allocatedCoins,
    type: 'starting_allocation',
    reason: 'Welcome Starting Coin Allocation',
    timestamp: new Date().toISOString(),
    admin: 'System Automation',
  };

  data.participants.push(newParticipant);
  data.coinTransactions.unshift(startingAllocationTx);
}

function handleJoinGame({ participantId, gameId }) {
  const participant = data.participants.find((p) => p.id === participantId);
  const game = data.games.find((g) => g.id === gameId);

  if (!participant) return { success: false, error: 'Participant not found.' };
  if (!game) return { success: false, error: 'Game not found.' };
  if (!game.isActive) return { success: false, error: 'This game is currently inactive.' };

  const entryCost = Number(game.cost || 0);
  const currentCoins = Number(participant.coins ?? 0);

  if (currentCoins < entryCost) {
    return {
      success: false,
      error: `Insufficient virtual coins! ${game.name} requires ${entryCost} coins, but your current balance is ${currentCoins} coins.`,
      required: entryCost,
      current: currentCoins,
    };
  }

  const newBalance = currentCoins - entryCost;

  const coinTx = {
    id: `ctx-game-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    participantId,
    participantName: participant.name,
    gameId,
    gameName: game.name,
    amountDelta: -entryCost,
    newBalance,
    type: 'game_entry',
    reason: `Entered ${game.name}`,
    timestamp: new Date().toISOString(),
    admin: 'Participant Action',
  };

  participant.coins = newBalance;
  data.coinTransactions.unshift(coinTx);

  return {
    success: true,
    newBalance,
    gameName: game.name,
    cost: entryCost,
  };
}

function handleAdjustParticipantCoins(participantId, deltaAmount, note = '') {
  const delta = parseInt(deltaAmount, 10);
  if (isNaN(delta) || delta === 0) return { success: false, error: 'Invalid delta amount' };

  const participant = data.participants.find((p) => p.id === participantId);
  if (!participant) return { success: false, error: 'Participant not found' };

  const currentCoins = Number(participant.coins ?? 0);
  const newBalance = Math.max(0, currentCoins + delta);
  const actualDelta = newBalance - currentCoins;

  const coinTx = {
    id: `ctx-admin-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    participantId,
    participantName: participant.name,
    amountDelta: actualDelta,
    newBalance,
    type: actualDelta >= 0 ? 'admin_grant' : 'admin_deduct',
    reason: note.trim() || (actualDelta >= 0 ? 'Admin Coin Grant' : 'Admin Coin Deduction'),
    timestamp: new Date().toISOString(),
    admin: 'Admin Operator',
  };

  participant.coins = newBalance;
  data.coinTransactions.unshift(coinTx);

  return { success: true, newBalance };
}

async function runTests() {
  // ----------------------------------------------------
  // STEP 1: Admin sets Starting Coins to 5
  // ----------------------------------------------------
  console.log('Step 1: Admin configures Starting Coins to 5...');
  handleUpdateStartingCoins(5);
  assert.strictEqual(data.settings.startingCoins, 5, 'Step 1 Failed: Starting coins setting is not 5');
  console.log('✓ Step 1 Passed: Starting coins configured to 5.\n');

  // ----------------------------------------------------
  // STEP 2: Participant Bob registers and verifies email
  // ----------------------------------------------------
  console.log('Step 2: Participant Bob initiates registration with bob@gmail.com...');
  const bobReg = await initiateParticipantRegistration({
    name: 'Bob Arcade',
    email: 'bob@gmail.com',
    password: 'Password123!',
    avatar: '🤠',
    startingCoins: data.settings.startingCoins,
    existingParticipants: data.participants,
  });
  assert.strictEqual(bobReg.success, true, 'Bob registration initiation failed');
  assert.ok(bobReg.verificationCode, 'Bob did not receive verification code');

  console.log('Completing Bob verification with OTP code...');
  const bobVerify = await completeParticipantVerification({
    email: 'bob@gmail.com',
    code: bobReg.verificationCode,
  });
  assert.strictEqual(bobVerify.success, true, 'Bob verification failed');
  handleRegisterParticipant(bobVerify.participant);
  console.log('✓ Step 2 Passed: Bob registered and verified.\n');

  // ----------------------------------------------------
  // STEP 3: Bob automatically receives 5 starting coins
  // ----------------------------------------------------
  console.log('Step 3: Checking Bob starting coins allocation...');
  const bob = data.participants.find((p) => p.email === 'bob@gmail.com');
  assert.ok(bob, 'Bob not found in participants');
  assert.strictEqual(bob.coins, 5, `Expected Bob to have 5 coins, got ${bob.coins}`);
  assert.strictEqual(data.coinTransactions.length, 1, 'Expected 1 coin transaction');
  assert.strictEqual(data.coinTransactions[0].type, 'starting_allocation');
  console.log(`✓ Step 3 Passed: Bob received exactly ${bob.coins} starting coins.\n`);

  // ----------------------------------------------------
  // STEP 4: Admin updates Starting Coins setting to 10
  // ----------------------------------------------------
  console.log('Step 4: Admin updates Starting Coins setting to 10...');
  handleUpdateStartingCoins(10);
  assert.strictEqual(data.settings.startingCoins, 10, 'Step 4 Failed: Setting not updated to 10');
  console.log('✓ Step 4 Passed: Setting updated to 10.\n');

  // ----------------------------------------------------
  // STEP 5: Bob existing balance remains untouched at 5 coins
  // ----------------------------------------------------
  console.log('Step 5: Verifying Bob balance remains 5 coins...');
  assert.strictEqual(bob.coins, 5, `Step 5 Failed: Bob balance changed to ${bob.coins} when setting changed`);
  console.log('✓ Step 5 Passed: Bob balance untouched at 5 coins.\n');

  // ----------------------------------------------------
  // STEP 6: Charlie registers and receives 10 coins
  // ----------------------------------------------------
  console.log('Step 6: Charlie registers with charlie@gmail.com...');
  const charlieReg = await initiateParticipantRegistration({
    name: 'Charlie Quest',
    email: 'charlie@gmail.com',
    password: 'Password123!',
    avatar: '🦊',
    startingCoins: data.settings.startingCoins,
    existingParticipants: data.participants,
  });
  const charlieVerify = await completeParticipantVerification({
    email: 'charlie@gmail.com',
    code: charlieReg.verificationCode,
  });
  handleRegisterParticipant(charlieVerify.participant);
  const charlie = data.participants.find((p) => p.email === 'charlie@gmail.com');
  assert.strictEqual(charlie.coins, 10, `Step 6 Failed: Charlie expected 10 coins, got ${charlie.coins}`);
  console.log('✓ Step 6 Passed: Charlie received 10 coins under new setting.\n');

  // ----------------------------------------------------
  // STEP 7: Bob attempts to join 6-coin game -> Rejected
  // ----------------------------------------------------
  console.log('Step 7: Bob attempts to join Pixel Pong (cost: 6 coins, Bob balance: 5)...');
  const pongJoin = handleJoinGame({ participantId: bob.id, gameId: 'gm-pixel-pong' });
  assert.strictEqual(pongJoin.success, false, 'Step 7 Failed: 6-coin game join should be rejected');
  assert.ok(pongJoin.error.includes('Insufficient virtual coins'), 'Step 7 Failed: Error message not returned');
  assert.strictEqual(bob.coins, 5, 'Bob balance altered on failed join');
  console.log(`✓ Step 7 Passed: Rejected with error: "${pongJoin.error}"\n`);

  // ----------------------------------------------------
  // STEP 8: Bob joins 4-coin game -> Deducts to 1 coin
  // ----------------------------------------------------
  console.log('Step 8: Bob joins Speed Run Arena (cost: 4 coins)...');
  const speedJoin = handleJoinGame({ participantId: bob.id, gameId: 'gm-speed-run' });
  assert.strictEqual(speedJoin.success, true, 'Step 8 Failed: Bob failed to join 4-coin game');
  assert.strictEqual(speedJoin.newBalance, 1, 'Expected newBalance 1');
  assert.strictEqual(bob.coins, 1, 'Step 8 Failed: Bob balance not 1 coin');
  console.log('✓ Step 8 Passed: Bob balance successfully deducted from 5 to 1 coin.\n');

  // ----------------------------------------------------
  // STEP 9: Verify competition score / points remain UNTOUCHED
  // ----------------------------------------------------
  console.log('Step 9: Verifying leaderboard scores are untouched by coin transactions...');
  assert.strictEqual(data.transactions.length, 0, 'No points transactions should exist from game entry');
  const standings = calculateLeaderboard(data.participants, data.transactions);
  const bobStanding = standings.find((s) => s.id === bob.id);
  assert.strictEqual(bobStanding.totalPoints, 0, 'Step 9 Failed: Bob score altered by coin spending');
  console.log('✓ Step 9 Passed: Coins and points are strictly separated. Leaderboard points are 0.\n');

  // ----------------------------------------------------
  // STEP 10: Repeated join attempt or rapid clicks
  // ----------------------------------------------------
  console.log('Step 10: Bob attempts to join 2-coin game with only 1 coin remaining...');
  const stackerJoin = handleJoinGame({ participantId: bob.id, gameId: 'gm-neon-stacker' });
  assert.strictEqual(stackerJoin.success, false, 'Step 10 Failed: Cannot join 2-coin game with 1 coin');
  assert.strictEqual(bob.coins, 1, 'Bob balance must not go negative');
  console.log('✓ Step 10 Passed: Negative balances prevented. Balance stays at 1.\n');

  // ----------------------------------------------------
  // STEP 11: Admin manually adjusts coins (+5 coins to Bob)
  // ----------------------------------------------------
  console.log('Step 11: Admin manually awards +5 coins to Bob with audit reason...');
  const adjustRes = handleAdjustParticipantCoins(bob.id, 5, 'Bonus for Arcade MVP');
  assert.strictEqual(adjustRes.success, true, 'Coin adjustment failed');
  assert.strictEqual(adjustRes.newBalance, 6, 'Expected Bob to have 6 coins');
  assert.strictEqual(bob.coins, 6, 'Bob balance in participant record is not 6');
  const latestTx = data.coinTransactions[0];
  assert.strictEqual(latestTx.participantId, bob.id);
  assert.strictEqual(latestTx.amountDelta, 5);
  assert.strictEqual(latestTx.reason, 'Bonus for Arcade MVP');
  console.log('✓ Step 11 Passed: Admin adjustment logged in ledger. Bob now has 6 coins.\n');

  // ----------------------------------------------------
  // STEP 12: Persistence test
  // ----------------------------------------------------
  console.log('Step 12: Testing serialized persistence simulation...');
  const serialized = JSON.stringify(data);
  const restored = JSON.parse(serialized);
  assert.strictEqual(restored.settings.startingCoins, 10);
  assert.strictEqual(restored.participants.length, 2);
  const restoredBob = restored.participants.find((p) => p.email === 'bob@gmail.com');
  assert.strictEqual(restoredBob.coins, 6);
  assert.strictEqual(restored.coinTransactions.length, 4); // 2 starting allocations + 1 game entry + 1 admin grant
  console.log('✓ Step 12 Passed: Data serializes and restores with 100% integrity.\n');

  console.log('================================================================');
  console.log('>>> ALL 12 INTEGRATION TEST STEPS PASSED SUCCESSFULLY! <<<');
  console.log('================================================================\n');
}

runTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
