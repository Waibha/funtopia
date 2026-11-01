/**
 * FUNTOPIA - Leaderboard Calculation & Scoring Engine
 * Computes live standings, podium positions, game matrixes, and rank movements.
 */

export const calculateLeaderboard = (teams, transactions, activeEventId, games) => {
  // Filter transactions for the selected event
  const eventTx = transactions.filter(
    (tx) => !activeEventId || tx.eventId === activeEventId
  );

  // Map team points
  const teamStats = teams.map((team) => {
    const teamTxs = eventTx.filter((tx) => tx.teamId === team.id);
    const totalPoints = teamTxs.reduce((sum, tx) => sum + Number(tx.pointsDelta), 0);

    // Calculate game breakdown
    const gameBreakdown = {};
    games.forEach((g) => {
      gameBreakdown[g.id] = 0;
    });

    teamTxs.forEach((tx) => {
      if (gameBreakdown[tx.gameId] !== undefined) {
        gameBreakdown[tx.gameId] += Number(tx.pointsDelta);
      } else {
        gameBreakdown[tx.gameId] = Number(tx.pointsDelta);
      }
    });

    // Count wins / highest game
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
      ...team,
      totalPoints,
      gameBreakdown,
      bestGame: bestGame ? bestGame.name : 'Awaiting Match',
      transactionCount: teamTxs.length,
      lastUpdated: teamTxs.length > 0 ? teamTxs[teamTxs.length - 1].timestamp : null,
    };
  });

  // Sort descending by totalPoints
  teamStats.sort((a, b) => b.totalPoints - a.totalPoints);

  // Assign ranks & delta from 1st place
  const leaderPoints = teamStats[0]?.totalPoints || 0;
  return teamStats.map((team, index) => ({
    ...team,
    rank: index + 1,
    diffFromFirst: index === 0 ? 0 : leaderPoints - team.totalPoints,
  }));
};
