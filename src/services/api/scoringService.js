/**
 * FUNTOPIA SCORING API & PERSON 2 CONTRACT
 * 
 * Person 1 owns scoring management, ledger integrity, and leaderboard calculation.
 * Person 2 (Guess Who? Game) submits scores through `submitGameScore()`.
 */

import { soundFx } from '../../utilities/soundFx';

/**
 * Official Integration Contract for Person 2 (Guess Who? Module)
 * 
 * @param {Object} params
 * @param {string} params.teamId - Identifier of the team receiving the score
 * @param {string} [params.gameId='game-guess-who'] - Identifier of the game (defaults to Guess Who)
 * @param {number} params.pointsDelta - Number of points earned or deducted
 * @param {string} params.reason - Description of achievement (e.g., "Guessed Round 3 correctly")
 * @param {Object} [params.metadata={}] - Optional game telemetry (round, hints used, timer)
 * @param {Function} [params.dispatchHandler] - Active state dispatcher
 */
export async function submitGameScore({
  teamId,
  gameId = 'game-guess-who',
  pointsDelta,
  reason = 'Game Completion Award',
  metadata = {},
  dispatchHandler = null,
}) {
  if (!teamId) {
    throw new Error('[Scoring API Error]: teamId is required.');
  }

  const delta = Number(pointsDelta);
  if (isNaN(delta) || delta === 0) {
    throw new Error('[Scoring API Error]: pointsDelta must be a non-zero number.');
  }

  const transaction = {
    id: `tx-p2-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    eventId: metadata.eventId || null,
    teamId,
    gameId,
    pointsDelta: delta,
    reason: `[Guess Who]: ${reason}`,
    adminName: 'Guess Who Game Engine',
    metadata,
    timestamp: new Date().toISOString(),
  };

  if (delta > 0) {
    soundFx.play('scoreUp');
  } else {
    soundFx.play('scoreDown');
  }

  if (dispatchHandler && typeof dispatchHandler === 'function') {
    dispatchHandler(transaction);
  }

  return {
    success: true,
    transactionId: transaction.id,
    timestamp: transaction.timestamp,
    message: `Awarded ${delta > 0 ? '+' + delta : delta} PTS to team ${teamId}`,
  };
}
