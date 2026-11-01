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
    const stored = loadStoredData();
    // Ensure participants array exists
    if (!stored.participants) {
      stored.participants = [
        {
          id: 'p-1',
          eventId: 'evt-cosmic-2026',
          teamId: 'team-vpr',
          name: 'Nova Chen',
          gamertag: 'NOVA_SPEED',
          email: 'nova@funtopia.arcade',
          avatar: '🦅',
          registeredAt: '2026-11-01T20:00:00Z',
        },
        {
          id: 'p-2',
          eventId: 'evt-cosmic-2026',
          teamId: 'team-pls',
          name: 'Zara Matrix',
          gamertag: 'ZARA_PULSE',
          email: 'zara@funtopia.arcade',
          avatar: '⚡',
          registeredAt: '2026-11-01T20:15:00Z',
        },
      ];
    }
    return stored;
  });

  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);

  // Sync state changes to localStorage
  useEffect(() => {
    saveStoredData(data);
  }, [data]);

  // Dynamic leaderboard computed in real-time
  const leaderboard = useMemo(() => {
    return calculateLeaderboard(data.teams, data.transactions, data.activeEventId, data.games);
  }, [data.teams, data.transactions, data.activeEventId, data.games]);

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

  // Event Handlers
  const handleSaveEvent = (updatedEvent) => {
    setData((prev) => {
      const exists = prev.events.some((e) => e.id === updatedEvent.id);
      const newEvents = exists
        ? prev.events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
        : [...prev.events, updatedEvent];
      return { ...prev, events: newEvents };
    });
  };

  const handleSetActiveEvent = (eventId) => {
    setData((prev) => ({ ...prev, activeEventId: eventId }));
  };

  const handleSaveTeam = (updatedTeam) => {
    setData((prev) => {
      const exists = prev.teams.some((t) => t.id === updatedTeam.id);
      const newTeams = exists
        ? prev.teams.map((t) => (t.id === updatedTeam.id ? updatedTeam : t))
        : [...prev.teams, updatedTeam];
      return { ...prev, teams: newTeams };
    });
  };

  const handleDeleteTeam = (teamId) => {
    setData((prev) => ({
      ...prev,
      teams: prev.teams.filter((t) => t.id !== teamId),
      transactions: prev.transactions.filter((tx) => tx.teamId !== teamId),
    }));
  };

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

  const handleRegisterParticipant = (newParticipant) => {
    setData((prev) => ({
      ...prev,
      participants: [...(prev.participants || []), newParticipant],
    }));
  };

  const handleAssignParticipantTeam = (participantId, teamId) => {
    setData((prev) => ({
      ...prev,
      participants: (prev.participants || []).map((p) =>
        p.id === participantId ? { ...p, teamId } : p
      ),
    }));
  };

  const handleRemoveParticipant = (participantId) => {
    setData((prev) => ({
      ...prev,
      participants: (prev.participants || []).filter((p) => p.id !== participantId),
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
              onSaveEvent={handleSaveEvent}
              setActiveEventId={handleSetActiveEvent}
              onSaveTeam={handleSaveTeam}
              onDeleteTeam={handleDeleteTeam}
              onSaveGame={handleSaveGame}
              onDeleteGame={handleDeleteGame}
              onToggleGameActive={handleToggleGameActive}
              onAwardScore={handleAwardScore}
              onRollbackTransaction={handleRollbackTransaction}
              onAssignParticipantTeam={handleAssignParticipantTeam}
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
