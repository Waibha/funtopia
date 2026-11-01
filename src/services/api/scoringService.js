/**
 * FUNTOPIA SCORING API & PERSON 2 CONTRACT
 * 
 * Person 1 owns scoring management, ledger integrity, and individual leaderboard calculation.
 * Person 2 (Guess Who? Game) submits scores through `submitGameScore()`.
 */

import { soundFx } from '../../utilities/soundFx.js';

/**
 * Official Integration Contract for Person 2 (Guess Who? Module)
 * 
 * @param {Object} params
 * @param {string} [params.participantId] - Identifier of the individual participant receiving the score
 * @param {string} [params.teamId] - Fallback identifier if legacy integration passed teamId
 * @param {string} [params.gameId='game-guess-who'] - Identifier of the game (defaults to Guess Who)
 * @param {number} params.pointsDelta - Number of points earned or deducted
 * @param {string} [params.note] - Description of achievement (e.g., "Guessed Round 3 correctly")
 * @param {string} [params.reason] - Alternate parameter for note
 * @param {Object} [params.metadata={}] - Optional game telemetry (round, hints used, timer)
 * @param {Function} [params.dispatchHandler] - Active state dispatcher
 */
export async function submitGameScore({
  participantId,
  teamId,
  gameId = 'game-guess-who',
  pointsDelta,
  note = 'Game Completion Award',
  reason,
  metadata = {},
  dispatchHandler = null,
}) {
  const pId = participantId || teamId;
  if (!pId) {
    throw new Error('[Scoring API Error]: participantId is required.');
  }

  const delta = Number(pointsDelta);
  if (isNaN(delta) || delta === 0) {
    throw new Error('[Scoring API Error]: pointsDelta must be a non-zero number.');
  }

  const finalNote = note || reason || 'Game Award';

  const transaction = {
    id: `tx-p2-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    eventId: metadata.eventId || null,
    participantId: pId,
    gameId,
    pointsDelta: delta,
    note: `[Guess Who]: ${finalNote}`,
    admin: 'Guess Who Engine',
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
    message: `Awarded ${delta > 0 ? '+' + delta : delta} PTS to participant ${pId}`,
  };
}
