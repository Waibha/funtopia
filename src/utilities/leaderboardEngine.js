/**
 * FUNTOPIA - Individual Leaderboard Calculation
 * Computes live rankings, individual total scores, and game breakdowns for participants.
 */

export const calculateLeaderboard = (participants = [], transactions = [], activeEventId = null, games = []) => {
  // Filter transactions for the selected event
  const eventTx = transactions.filter(
    (tx) => !activeEventId || tx.eventId === activeEventId
  );

  // Compute points for each individual participant
  const participantStats = participants.map((participant) => {
    const userTxs = eventTx.filter((tx) => tx.participantId === participant.id);
    const totalPoints = userTxs.reduce((sum, tx) => sum + Number(tx.pointsDelta || 0), 0);

    // Calculate game-wise breakdown
    const gameBreakdown = {};
    games.forEach((g) => {
      gameBreakdown[g.id] = 0;
    });

    userTxs.forEach((tx) => {
      if (tx.gameId) {
        gameBreakdown[tx.gameId] = (gameBreakdown[tx.gameId] || 0) + Number(tx.pointsDelta || 0);
      }
    });

    // Identify highest scoring game for participant
    let bestGameId = null;
    let maxGamePts = -Infinity;
    Object.entries(gameBreakdown).forEach(([gId, pts]) => {
      if (pts > maxGamePts && pts > 0) {
        maxGamePts = pts;
        bestGameId = gId;
      }
    });

    const bestGame = games.find((g) => g.id === bestGameId);

    return {
      ...participant,
      totalPoints,
      gameBreakdown,
      bestGame: bestGame ? bestGame.name : '—',
      transactionCount: userTxs.length,
      lastUpdated: userTxs.length > 0 ? userTxs[userTxs.length - 1].timestamp : null,
    };
  });

  // Sort descending by totalPoints
  participantStats.sort((a, b) => b.totalPoints - a.totalPoints);

  // Assign ranks & point difference from 1st place
  const leaderPoints = participantStats[0]?.totalPoints || 0;
  return participantStats.map((participant, index) => ({
    ...participant,
    rank: index + 1,
    diffFromFirst: index === 0 ? 0 : leaderPoints - participant.totalPoints,
  }));
};
