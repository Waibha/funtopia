import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import CosmicBackground from './components/CosmicBackground';
import Navbar from './components/Navbar';
import LiveTicker from './components/LiveTicker';
import PublicLeaderboard from './pages/PublicLeaderboard';
import AdminDashboard from './pages/AdminDashboard';
import EventManagement from './pages/EventManagement';
import TeamManagement from './pages/TeamManagement';
import GameManagement from './pages/GameManagement';
import ScoringManagement from './pages/ScoringManagement';
import { loadStoredData, saveStoredData, INITIAL_DATA } from './services/mockData';
import { calculateLeaderboard } from './utilities/leaderboardEngine';
import { soundFx } from './utilities/soundFx';

export default function App() {
  const [data, setData] = useState(() => loadStoredData());
  const [currentView, setCurrentView] = useState('leaderboard');
  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [quickScoreTeamId, setQuickScoreTeamId] = useState(null);

  // Sync state changes to localStorage
  useEffect(() => {
    saveStoredData(data);
  }, [data]);

  // Active event object
  const activeEvent = useMemo(() => {
    return data.events.find((e) => e.id === data.activeEventId) || data.events[0];
  }, [data.events, data.activeEventId]);

  // Dynamic leaderboard computed in real-time
  const leaderboard = useMemo(() => {
    return calculateLeaderboard(data.teams, data.transactions, data.activeEventId, data.games);
  }, [data.teams, data.transactions, data.activeEventId, data.games]);

  // Confetti Blast Celebration
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FF007F', '#00F0FF', '#FFE600', '#A855F7', '#FF5E3A', '#10B981'],
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

  const handleResetData = () => {
    setData(INITIAL_DATA);
    triggerCelebration();
  };

  const handleOpenQuickScore = (teamId = null) => {
    setQuickScoreTeamId(teamId);
    setCurrentView('scoring');
  };

  return (
    <div className={`min-h-screen bg-[#0c0b10] text-arcade-white flex flex-col relative selection:bg-arcade-yellow selection:text-black ${crtEnabled ? 'crt-active' : ''}`}>
      {/* Clean Dark Arcade Chassis Texture */}
      <CosmicBackground />

      {/* Main App Content Container */}
      <div className="relative z-10 flex flex-col flex-grow">
        {/* Top Navbar */}
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          crtEnabled={crtEnabled}
          setCrtEnabled={setCrtEnabled}
          triggerCelebration={triggerCelebration}
          resetData={handleResetData}
          activeEvent={activeEvent}
        />

        {/* Live Scrolling Marquee Ticker */}
        <LiveTicker
          activeEvent={activeEvent}
          transactions={data.transactions}
          teams={data.teams}
          games={data.games}
        />

        {/* Main View Router */}
        <main className="flex-grow px-4 sm:px-6 lg:px-8">
          {currentView === 'leaderboard' && (
            <PublicLeaderboard
              leaderboard={leaderboard}
              activeEvent={activeEvent}
              games={data.games}
              transactions={data.transactions}
              teams={data.teams}
              triggerCelebration={triggerCelebration}
            />
          )}

          {currentView === 'admin' && (
            <AdminDashboard
              data={data}
              leaderboard={leaderboard}
              setCurrentView={setCurrentView}
              onOpenQuickScore={handleOpenQuickScore}
              triggerCelebration={triggerCelebration}
            />
          )}

          {currentView === 'events' && (
            <EventManagement
              events={data.events}
              activeEventId={data.activeEventId}
              setActiveEventId={handleSetActiveEvent}
              onSaveEvent={handleSaveEvent}
              teams={data.teams}
              games={data.games}
            />
          )}

          {currentView === 'teams' && (
            <TeamManagement
              teams={data.teams}
              onSaveTeam={handleSaveTeam}
              onDeleteTeam={handleDeleteTeam}
            />
          )}

          {currentView === 'games' && (
            <GameManagement
              games={data.games}
              onSaveGame={handleSaveGame}
              onDeleteGame={handleDeleteGame}
              onToggleGameActive={handleToggleGameActive}
            />
          )}

          {currentView === 'scoring' && (
            <ScoringManagement
              data={data}
              onAwardScore={handleAwardScore}
              onRollbackTransaction={handleRollbackTransaction}
              quickTeamId={quickScoreTeamId}
            />
          )}
        </main>

        {/* Arcade Studio Footer */}
        <footer className="border-t border-arcade-border py-5 bg-[#121118] mt-12 text-center text-xs font-mono text-arcade-muted select-none">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-arcade text-arcade-yellow text-[10px]">FUNTOPIA</span>
              <span>/</span>
              <span>RETRO ARCADE CHAMPIONSHIP</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-zinc-500">BRANCH: person-1/ui-foundation</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">READY PLAYER 1</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
