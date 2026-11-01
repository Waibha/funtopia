import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import WelcomeHomepage from './pages/WelcomeHomepage';
import PortalSelectPage from './pages/PortalSelectPage';
import ParticipantPortal from './pages/ParticipantPortal';
import AdminPortal from './pages/AdminPortal';
import { loadStoredData, saveStoredData, INITIAL_DATA } from './services/mockData';
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
    setData((prev) => {
      const exists = prev.games.some((g) => g.id === updatedGame.id);
      const newGames = exists
        ? prev.games.map((g) => (g.id === updatedGame.id ? updatedGame : g))
        : [...prev.games, updatedGame];
      return { ...prev, games: newGames };
    });
  };

  const handleDeleteGame = (gameId) => {
    setData((prev) => ({
      ...prev,
      games: prev.games.filter((g) => g.id !== gameId),
      transactions: prev.transactions.filter((tx) => tx.gameId !== gameId),
    }));
  };

  const handleToggleGameActive = (gameId) => {
    setData((prev) => ({
      ...prev,
      games: prev.games.map((g) =>
        g.id === gameId ? { ...g, isActive: !g.isActive } : g
      ),
    }));
  };

  // Scoring Handlers (Award / Deduct / Rollback)
  const handleAwardScore = (newTransaction) => {
    setData((prev) => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
    }));
  };

  const handleRollbackTransaction = (txId) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((tx) => tx.id !== txId),
    }));
  };

  // Starting Coins Setting Handler (Admin controlled, applies to future registrations only)
  const handleUpdateStartingCoins = (amount) => {
    const val = Math.max(0, Number(amount || 0));
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
        type: 'admin_adjustment',
        reason: reason || (delta > 0 ? 'Admin bonus credit' : 'Admin manual debit'),
        timestamp: new Date().toISOString(),
        admin,
      };

      return {
        ...prev,
        participants: updatedParticipants,
        coinTransactions: [coinTx, ...(prev.coinTransactions || [])],
      };
    });
  };

  // Participant Join Game Handler (Atomic coin deduction, validation, duplicate protection)
  const handleJoinGame = ({ participantId, gameId }) => {
    const participant = (data.participants || []).find((p) => p.id === participantId);
    const game = (data.games || []).find((g) => g.id === gameId);

    if (!participant) {
      return { success: false, error: 'Participant profile not found. Please log in.' };
    }
    if (!game) {
      return { success: false, error: 'Game not found in tournament rotation.' };
    }

    const currentCoins = Number(participant.coins || 0);
    const entryCost = Number(game.cost || 0);

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

    setData((prev) => ({
      ...prev,
      participants: [...(prev.participants || []), newParticipant],
      coinTransactions: [startingAllocationTx, ...(prev.coinTransactions || [])],
    }));
  };

  const handleRemoveParticipant = (participantId) => {
    setData((prev) => ({
      ...prev,
      participants: (prev.participants || []).filter((p) => p.id !== participantId),
      transactions: (prev.transactions || []).filter((tx) => tx.participantId !== participantId),
      coinTransactions: (prev.coinTransactions || []).filter((tx) => tx.participantId !== participantId),
    }));
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Experience 1: Animated Public Welcome Homepage */}
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

        {/* Experience 2: Participant Portal */}
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

        {/* Experience 3: Restricted Admin Portal */}
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

        {/* Fallback to Welcome Homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
