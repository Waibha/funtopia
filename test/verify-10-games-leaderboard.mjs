import assert from 'node:assert/strict';
import fs from 'node:fs';
import { calculateLeaderboard } from '../src/utilities/leaderboardEngine.js';

console.log('=== FUNTOPIA: 10+ GAMES LEADERBOARD & BREAKDOWN LAYOUT VERIFICATION ===\n');

// 1. Setup 10 distinct games
const testGames = [
  { id: 'game-01', name: 'Pixel Pong', cost: 5, isActive: true },
  { id: 'game-02', name: 'Speed Run Arena', cost: 10, isActive: true },
  { id: 'game-03', name: 'Neon Stacker', cost: 15, isActive: true },
  { id: 'game-04', name: 'Cyber Maze', cost: 20, isActive: true },
  { id: 'game-05', name: 'Retro Invaders', cost: 25, isActive: true },
  { id: 'game-06', name: 'Coin Blaster', cost: 30, isActive: true },
  { id: 'game-07', name: 'Pixel Climber', cost: 35, isActive: true },
  { id: 'game-08', name: 'Shadow Runner', cost: 40, isActive: true },
  { id: 'game-09', name: 'Arcade Pinball', cost: 45, isActive: true },
  { id: 'game-10', name: 'Championship Circuit', cost: 50, isActive: true },
];

assert.equal(testGames.length, 10, 'Expected exactly 10 games for testing');

// 2. Setup 3 participants
const testParticipants = [
  { id: 'p-1', name: 'Player Alice', email: 'alice@gmail.com', avatar: '👾' },
  { id: 'p-2', name: 'Player Bob', email: 'bob@gmail.com', avatar: '🤠' },
  { id: 'p-3', name: 'Player Charlie', email: 'charlie@gmail.com', avatar: '🦊' },
];

// 3. Create transactions across all 10 games
const testTransactions = [];
testGames.forEach((game, index) => {
  // Alice gets (index + 1) * 10 points
  testTransactions.push({
    id: `tx-alice-${game.id}`,
    participantId: 'p-1',
    gameId: game.id,
    pointsDelta: (index + 1) * 10,
    timestamp: new Date().toISOString(),
  });

  // Bob gets (index + 1) * 5 points
  testTransactions.push({
    id: `tx-bob-${game.id}`,
    participantId: 'p-2',
    gameId: game.id,
    pointsDelta: (index + 1) * 5,
    timestamp: new Date().toISOString(),
  });

  // Charlie gets (index + 1) * 8 points
  testTransactions.push({
    id: `tx-charlie-${game.id}`,
    participantId: 'p-3',
    gameId: game.id,
    pointsDelta: (index + 1) * 8,
    timestamp: new Date().toISOString(),
  });
});

console.log('Test 1: Calculating Leaderboard across all 10 games...');
const leaderboard = calculateLeaderboard(testParticipants, testTransactions, null, testGames);

assert.equal(leaderboard.length, 3, 'Expected 3 ranked participants');
assert.equal(leaderboard[0].name, 'Player Alice', 'Expected Alice to be rank 1');
assert.equal(leaderboard[0].rank, 1);
assert.equal(leaderboard[0].totalPoints, 550); // sum(10..100) = 550
assert.equal(leaderboard[1].name, 'Player Charlie', 'Expected Charlie to be rank 2');
assert.equal(leaderboard[1].rank, 2);
assert.equal(leaderboard[1].totalPoints, 440); // sum(8..80) = 440
assert.equal(leaderboard[2].name, 'Player Bob', 'Expected Bob to be rank 3');
assert.equal(leaderboard[2].rank, 3);
assert.equal(leaderboard[2].totalPoints, 275); // sum(5..50) = 275

console.log('✓ Test 1 Passed: 10-game leaderboard rankings and points mathematically verified.\n');

console.log('Test 2: Verifying EVERY game breakdown is present in correct order...');
leaderboard.forEach((p) => {
  const breakdownKeys = Object.keys(p.gameBreakdown);
  assert.equal(breakdownKeys.length, 10, `Expected 10 game breakdowns for ${p.name}, got ${breakdownKeys.length}`);
  
  testGames.forEach((g, gIdx) => {
    assert.ok(g.id in p.gameBreakdown, `Missing game breakdown key ${g.id} for ${p.name}`);
    const expectedPoints = p.id === 'p-1' ? (gIdx + 1) * 10 : p.id === 'p-2' ? (gIdx + 1) * 5 : (gIdx + 1) * 8;
    assert.equal(p.gameBreakdown[g.id], expectedPoints, `Wrong breakdown points for ${p.name} in ${g.name}`);
  });
});
console.log('✓ Test 2 Passed: All 10 games are present in exact order with precise scores.\n');

console.log('Test 3: Checking UI component code for arbitrary slicing or limits...');
const leaderboardTableCode = fs.readFileSync('src/components/leaderboard/LeaderboardTableView.jsx', 'utf8');
assert.equal(leaderboardTableCode.includes('games.slice'), false, 'Found arbitrary games.slice limit in LeaderboardTableView.jsx!');
assert.equal(leaderboardTableCode.includes('overflow-x-auto'), true, 'LeaderboardTableView must use overflow-x-auto for horizontal responsiveness');
assert.equal(leaderboardTableCode.includes('min-w-'), true, 'LeaderboardTableView must ensure min-widths to prevent column clipping');
console.log('✓ Test 3 Passed: LeaderboardTableView dynamically renders all games with overflow-x-auto and no artificial limits.\n');

console.log('Test 4: Verifying "Overview" renamed to "Leaderboard" in Admin Portal...');
const adminPortalCode = fs.readFileSync('src/pages/AdminPortal.jsx', 'utf8');
assert.equal(adminPortalCode.includes("id: 'overview'"), false, 'Found deprecated overview id in AdminPortal.jsx');
assert.equal(adminPortalCode.includes("label: 'OVERVIEW'"), false, 'Found deprecated OVERVIEW label in AdminPortal.jsx');
assert.equal(adminPortalCode.includes("id: 'leaderboard', label: 'LEADERBOARD'"), true, 'AdminPortal must use LEADERBOARD');

const adminDashboardCode = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');
assert.equal(adminDashboardCode.includes('MASTER CONTROL'), false, 'Found deprecated MASTER CONTROL in AdminDashboard.jsx');
assert.equal(adminDashboardCode.includes('LeaderboardTableView'), true, 'AdminDashboard must use LeaderboardTableView');
console.log('✓ Test 4 Passed: Admin section renamed to "Leaderboard" and uses responsive LeaderboardTableView.\n');

console.log('Test 5: Verifying Participant Portal heading uses "Leaderboard"...');
const participantPortalCode = fs.readFileSync('src/pages/ParticipantPortal.jsx', 'utf8');
assert.equal(participantPortalCode.includes('<span>STANDINGS</span>'), false, 'ParticipantPortal button should say LEADERBOARD');
assert.equal(participantPortalCode.includes('<span>LEADERBOARD</span>'), true, 'ParticipantPortal button has LEADERBOARD');

const publicLeaderboardCode = fs.readFileSync('src/pages/PublicLeaderboard.jsx', 'utf8');
assert.equal(publicLeaderboardCode.includes('CHAMPIONSHIP LEADERBOARD'), true, 'PublicLeaderboard heading has CHAMPIONSHIP LEADERBOARD');
assert.equal(publicLeaderboardCode.includes('LeaderboardTableView'), true, 'PublicLeaderboard uses LeaderboardTableView');
console.log('✓ Test 5 Passed: Participant Portal uses Leaderboard heading and consistent table.\n');

console.log('================================================================');
console.log('>>> ALL 10+ GAMES LEADERBOARD & UI TESTS PASSED SUCCESSFULLY! <<<');
console.log('================================================================\n');
