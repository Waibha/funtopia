import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

// Championship Platform Pages (Person 1 Scope)
import WelcomeHomepage from './pages/WelcomeHomepage';
import PortalSelectPage from './pages/PortalSelectPage';
import ParticipantPortal from './pages/ParticipantPortal';
import AdminPortal from './pages/AdminPortal';
import MeetCreatorsPage from './pages/MeetCreatorsPage';
import ErrorBoundary from './components/ErrorBoundary';

// Guess Who Game Pages (Person 2 Scope)
import GuessWhoHubPage from './pages/guess-who/GuessWhoHubPage';
import GuessWhoLobbyPage from './pages/guess-who/GuessWhoLobbyPage';
import AdminGuessWhoPage from './pages/admin/AdminGuessWhoPage';

// Public Informational Pages
import LeaderboardPage from './pages/public/LeaderboardPage';
import SchedulePage from './pages/public/SchedulePage';
import RulesPage from './pages/public/RulesPage';

// Services and Utilities
import { dbService } from './services/api/dbService';
import { loadStoredData, saveStoredData } from './services/mockData';
import { calculateLeaderboard } from './utilities/leaderboardEngine';
import { soundFx } from './utilities/soundFx';

export default function App() {
  const [data, setData] = useState(() => {
    return loadStoredData();
  });

  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);

  // Sync state changes to localStorage
  useEffect(() => {
    saveStoredData(data);
  }, [data]);

  // Load persistent state from Supabase on application mount
  useEffect(() => {
    async function initSupabaseData() {
      const remote = await dbService.loadFromSupabase();
      if (remote) {
        setData((prev) => ({
          ...prev,
          participants: remote.participants,
          games: remote.games.length > 0 ? remote.games : prev.games,
          transactions: remote.transactions,
          coinTransactions: remote.coinTransactions,
          settings: remote.settings || prev.settings,
        }));
      }
    }
    initSupabaseData();
  }, []);

  // Dynamic individual leaderboard computed in real-time
  const leaderboard = useMemo(() => {
    return calculateLeaderboard(data.participants || [], data.transactions || [], null, data.games || []);
  }, [data.participants, data.transactions, data.games]);

  // Confetti Blast Celebration
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#F5EE00', '#FF2A6D', '#7928CA', '#FF6B00', '#00E5FF', '#180A28'],
      });
    } catch (e) {
      console.warn('Confetti trigger error', e);
    }
  };

  // Game Handlers
  const handleSaveGame = (updatedGame) => {
    dbService.saveGame(updatedGame);
    setData((prev) => {
      const exists = prev.games.some((g) => g.id === updatedGame.id);
      const newGames = exists
        ? prev.games.map((g) => (g.id === updatedGame.id ? updatedGame : g))
        : [...prev.games, updatedGame];
      return { ...prev, games: newGames };
    });
  };

  const handleDeleteGame = (gameId) => {
    dbService.deleteGame(gameId);
    setData((prev) => ({
      ...prev,
      games: prev.games.filter((g) => g.id !== gameId),
      transactions: prev.transactions.filter((tx) => tx.gameId !== gameId),
    }));
  };

  const handleToggleGameActive = (gameId) => {
    setData((prev) => {
      const updatedGames = prev.games.map((g) =>
        g.id === gameId ? { ...g, isActive: !g.isActive } : g
      );
      const target = updatedGames.find((g) => g.id === gameId);
      if (target) dbService.saveGame(target);
      return { ...prev, games: updatedGames };
    });
  };

  // Scoring Handlers (Award / Deduct / Rollback)
  const handleAwardScore = (newTransaction) => {
    dbService.saveScoreTransaction(newTransaction);
    setData((prev) => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
    }));
  };

  const handleRollbackTransaction = (txId) => {
    dbService.deleteScoreTransaction(txId);
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((tx) => tx.id !== txId),
    }));
  };

  // Starting Coins Setting Handler (Admin controlled, applies to future registrations only)
  const handleUpdateStartingCoins = (amount) => {
    const val = Math.max(0, Number(amount || 0));
    dbService.saveStartingCoinsSetting(val);
    setData((prev) => ({
      ...prev,
      settings: {
        ...(prev.settings || {}),
        startingCoins: val,
        lastUpdated: new Date().toISOString(),
      },
    }));
  };

  // Manual Coin Adjustment Handler (Admin adds/deducts coins with audit trail)
  const handleAdjustParticipantCoins = ({ participantId, amountDelta, reason, admin = 'Admin Operator' }) => {
    const delta = Number(amountDelta || 0);
    if (delta === 0) return;

    setData((prev) => {
      const participant = (prev.participants || []).find((p) => p.id === participantId);
      if (!participant) return prev;

      const newBalance = Math.max(0, Number(participant.coins || 0) + delta);
      const updatedParticipants = prev.participants.map((p) =>
        p.id === participantId ? { ...p, coins: newBalance } : p
      );

      const coinTx = {
        id: `ctx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        participantId,
        participantName: participant.name,
        amountDelta: delta,
        newBalance,
        type: delta > 0 ? 'admin_grant' : 'admin_deduction',
        reason: reason || (delta > 0 ? 'Admin Coin Grant' : 'Admin Coin Deduction'),
        timestamp: new Date().toISOString(),
        admin,
      };

      dbService.saveParticipant({ ...participant, coins: newBalance });
      dbService.saveCoinTransaction(coinTx);

      return {
        ...prev,
        participants: updatedParticipants,
        coinTransactions: [coinTx, ...(prev.coinTransactions || [])],
      };
    });
  };

  // Game Entry Handler (Deducts entry cost coins from participant)
  const handleJoinGame = ({ participantId, gameId }) => {
    const participant = (data.participants || []).find((p) => p.id === participantId);
    const game = (data.games || []).find((g) => g.id === gameId);

    if (!participant || !game) {
      return { success: false, reason: 'Participant or Game not found.' };
    }

    const currentCoins = Number(participant.coins || 0);
    const entryCost = Math.max(0, Number(game.cost !== undefined ? game.cost : (game.entryFeeCoins || 0)));

    if (currentCoins < entryCost) {
      return {
        success: false,
        reason: `Insufficient coins. Required: ${entryCost}, Available: ${currentCoins}.`,
      };
    }

    const newBalance = currentCoins - entryCost;

    const coinTx = {
      id: `ctx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      participantId,
      participantName: participant.name,
      gameId: game.id,
      gameName: game.name,
      amountDelta: -entryCost,
      newBalance,
      type: 'game_entry',
      reason: `Entered ${game.name}`,
      timestamp: new Date().toISOString(),
      admin: 'Participant Action',
    };

    dbService.saveParticipant({ ...participant, coins: newBalance });
    dbService.saveCoinTransaction(coinTx);

    setData((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.id === participantId ? { ...p, coins: newBalance } : p
      ),
      coinTransactions: [coinTx, ...(prev.coinTransactions || [])],
    }));

    return {
      success: true,
      newBalance,
      gameName: game.name,
      cost: entryCost,
    };
  };

  // Participant Handlers
  const handleRegisterParticipant = (newParticipant) => {
    setData((prev) => {
      const cleanUsn = (newParticipant.usn || '').trim().toUpperCase();
      const existingIdx = (prev.participants || []).findIndex(
        (p) => p.id === newParticipant.id || ((p.usn || '').trim().toUpperCase() === cleanUsn && cleanUsn.length > 0)
      );

      if (existingIdx !== -1) {
        const updated = [...prev.participants];
        updated[existingIdx] = {
          ...updated[existingIdx],
          ...newParticipant,
        };
        dbService.saveParticipant(updated[existingIdx]);
        return {
          ...prev,
          participants: updated,
        };
      }

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

      dbService.saveParticipant(newParticipant);
      dbService.saveCoinTransaction(startingAllocationTx);

      return {
        ...prev,
        participants: [...(prev.participants || []), newParticipant],
        coinTransactions: [startingAllocationTx, ...(prev.coinTransactions || [])],
      };
    });
  };

  const handleRemoveParticipant = (participantId) => {
    dbService.deleteParticipant(participantId);
    setData((prev) => ({
      ...prev,
      participants: (prev.participants || []).filter((p) => p.id !== participantId),
      transactions: (prev.transactions || []).filter((tx) => tx.participantId !== participantId),
      coinTransactions: (prev.coinTransactions || []).filter((tx) => tx.participantId !== participantId),
    }));
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* ================================================================= */}
          {/* CHAMPIONSHIP PLATFORM ROUTES (PERSON 1 SCOPE)                     */}
          {/* ================================================================= */}
          {/* Welcome Stage & Landing Experience */}
          <Route
            path="/"
            element={
              <WelcomeHomepage
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
                triggerCelebration={triggerCelebration}
              />
            }
          />

          {/* Portal Selection Screen */}
          <Route path="/select-portal" element={<PortalSelectPage />} />

          {/* Meet the Creators / About */}
          <Route path="/creators" element={<MeetCreatorsPage />} />
          <Route path="/about" element={<MeetCreatorsPage />} />

          {/* Legacy callback route redirects to Participant Portal */}
          <Route
            path="/auth/callback"
            element={<Navigate to="/participant" replace />}
          />

          {/* Participant Portal */}
          <Route
            path="/participant/*"
            element={
              <ParticipantPortal
                data={data}
                leaderboard={leaderboard}
                onRegisterParticipant={handleRegisterParticipant}
                onJoinGame={handleJoinGame}
                triggerCelebration={triggerCelebration}
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
              />
            }
          />

          {/* ================================================================= */}
          {/* GUESS WHO? DEDUCTION GAME ROUTES (PERSON 2 SCOPE)                 */}
          {/* ================================================================= */}
          {/* Dedicated Clean Public Projector Display Interface */}
          <Route path="/guess-who" element={<GuessWhoHubPage />} />

          {/* Staging / Fallback Match Lobby */}
          <Route path="/guess-who/lobby" element={<GuessWhoLobbyPage />} />

          {/* Guess Who Administrative Control & Scoring Hub */}
          <Route path="/admin/guess-who" element={<AdminGuessWhoPage />} />

          {/* ================================================================= */}
          {/* CHAMPIONSHIP ADMIN PORTAL                                         */}
          {/* ================================================================= */}
          <Route
            path="/admin/*"
            element={
              <AdminPortal
                data={data}
                leaderboard={leaderboard}
                onSaveGame={handleSaveGame}
                onDeleteGame={handleDeleteGame}
                onToggleGameActive={handleToggleGameActive}
                onAwardScore={handleAwardScore}
                onRollbackTransaction={handleRollbackTransaction}
                onAddParticipant={handleRegisterParticipant}
                onRemoveParticipant={handleRemoveParticipant}
                onUpdateStartingCoins={handleUpdateStartingCoins}
                onAdjustParticipantCoins={handleAdjustParticipantCoins}
                triggerCelebration={triggerCelebration}
              />
            }
          />

          {/* Public Informational Routes */}
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/rules" element={<RulesPage />} />

          {/* Fallback to Welcome Homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
