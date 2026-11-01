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

  // Participant Handlers
  const handleRegisterParticipant = (newParticipant) => {
    setData((prev) => ({
      ...prev,
      participants: [...(prev.participants || []), newParticipant],
    }));
  };

  const handleRemoveParticipant = (participantId) => {
    setData((prev) => ({
      ...prev,
      participants: (prev.participants || []).filter((p) => p.id !== participantId),
      transactions: (prev.transactions || []).filter((tx) => tx.participantId !== participantId),
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
