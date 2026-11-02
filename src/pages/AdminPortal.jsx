import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  Coins,
  Trophy,
  LogOut,
  ArrowLeft,
  Sparkles,
  Sliders,
  Tv,
} from 'lucide-react';
import AudioSettingsModal from '../components/AudioSettingsModal';
import AdminDashboard from './AdminDashboard';
import GameManagement from './GameManagement';
import ScoringManagement from './ScoringManagement';
import AdminGuessWhoPage from './admin/AdminGuessWhoPage';
import ParticipantRosterManager from '../components/admin/ParticipantRosterManager';
import CoinEconomyManager from '../components/admin/CoinEconomyManager';
import AdminLogin from '../components/admin/AdminLogin';
import LiveTicker from '../components/LiveTicker';
import AdminArcadeBackground from '../components/backgrounds/AdminArcadeBackground';
import { soundFx } from '../utilities/soundFx';
import { getAdminSession, validateAdminSession, revokeAdminSession } from '../services/api/authService';

export default function AdminPortal({
  data,
  leaderboard,
  onSaveGame,
  onDeleteGame,
  onToggleGameActive,
  onAwardScore,
  onRollbackTransaction,
  onAddParticipant,
  onRemoveParticipant,
  onUpdateStartingCoins,
  onAdjustParticipantCoins,
  triggerCelebration,
}) {
  const navigate = useNavigate();
  const [adminSession, setAdminSession] = useState(() => getAdminSession());
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);

  const [currentTab, setCurrentTab] = useState('leaderboard'); // 'leaderboard' | 'games' | 'participants' | 'coins' | 'scoring'
  const [quickScoreParticipantId, setQuickScoreParticipantId] = useState(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  // Validate session integrity on mount and prevent spoofing
  useEffect(() => {
    let isMounted = true;
    async function verify() {
      const current = getAdminSession();
      if (!current) {
        if (isMounted) {
          setAdminSession(null);
          setIsVerifyingSession(false);
        }
        return;
      }
      const isValid = await validateAdminSession(current);
      if (isMounted) {
        if (!isValid) {
          revokeAdminSession();
          setAdminSession(null);
        } else {
          setAdminSession(current);
        }
        setIsVerifyingSession(false);
      }
    }
    verify();
    return () => {
      isMounted = false;
    };
  }, []);

  const competition = data.activeCompetition || { name: 'MADAGASCAR Tournament' };

  const handleLoginSuccess = (session) => {
    setAdminSession(session);
  };

  const handleLogout = () => {
    soundFx.play('click');
    revokeAdminSession();
    setAdminSession(null);
  };

  const handleTabChange = (tabId) => {
    soundFx.play('switch');
    setCurrentTab(tabId);
  };

  const handleOpenQuickScore = (participantId = null) => {
    setQuickScoreParticipantId(participantId);
    setCurrentTab('scoring');
  };

  // If verifying active session token, display brief secure loader
  if (isVerifyingSession && getAdminSession()) {
    return (
      <div className="min-h-screen bg-[#5C2D91] flex items-center justify-center text-white font-mono text-sm">
        <div className="retro-os-window p-6 rounded-2xl bg-[#D1D5DB] text-[#0D0518] text-center border-3 border-[#0D0518] shadow-pixel">
          <div className="animate-bounce text-3xl mb-2">👾</div>
          <p className="font-arcade text-xs font-black">VERIFYING OPERATOR PASSKEY...</p>
        </div>
      </div>
    );
  }

  // If not logged in as admin, show the restricted login screen
  if (!adminSession) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onReturnToPortals={() => navigate('/select-portal')}
      />
    );
  }

  const navItems = [
    { id: 'leaderboard', label: 'LEADERBOARD', icon: Trophy },
    { id: 'games', label: 'GAMES', icon: Gamepad2 },
    { id: 'guess-who', label: 'GUESS WHO?', icon: Sparkles },
    { id: 'participants', label: 'PARTICIPANTS', icon: Users },
    { id: 'coins', label: 'COINS', icon: Coins },
    { id: 'scoring', label: 'SCORING', icon: Trophy },
  ];

  return (
    <div className="relative min-h-screen bg-[#5C2D91] text-white flex flex-col justify-between selection:bg-[#FFDE25] selection:text-[#0D0518] font-sans arcade-page-transition">
      {/* Background Animated Arcade Elements */}
      <AdminArcadeBackground />

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Admin Header */}
        <header className="sticky top-0 z-40 bg-[#40186D]/95 backdrop-blur-md border-b-4 border-[#0D0518] select-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-20 py-3">
              {/* Brand & Portal Switch */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/select-portal')}
                  className="btn-pixel-white p-2.5 rounded-xl"
                  title="Return to Portal Selection"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bungee text-xl sm:text-2xl tracking-wide text-[#FFDE25] pixel-title-yellow">
                      MADAGASCAR
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FFDE25] text-[#0D0518] font-arcade text-[9px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm">
                      RESTRICTED ADMIN
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-purple-200 tracking-wider font-bold">
                    OPERATOR: {adminSession.email || adminSession.operator || 'ADMIN'}
                  </p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center gap-1.5 bg-[#2B0E4C] p-1.5 rounded-2xl border-3 border-[#0D0518] shadow-pixel-sm">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-arcade font-black tracking-wider transition-all ${
                        isActive
                          ? 'bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518] shadow-pixel-sm -translate-y-0.5'
                          : 'text-purple-200 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Action Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open('/guess-who', '_blank')}
                  className="btn-pixel-pink py-1.5 px-3 rounded-xl flex items-center gap-1.5 text-xs font-mono font-bold"
                  title="Open Guess Who Projector Display in new window"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PROJECTOR</span>
                </button>

                <button
                  onClick={() => setIsAudioModalOpen(true)}
                  className="btn-pixel-yellow p-2.5 rounded-xl flex items-center gap-1.5 text-xs"
                  title="Audio Settings"
                >
                  <Sliders className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    soundFx.play('fanfare');
                    triggerCelebration();
                  }}
                  className="btn-pixel-pink p-2.5"
                  title="Test Fanfare"
                >
                  <Sparkles className="w-4 h-4 text-[#FFDE25]" />
                </button>

                <button
                  onClick={handleLogout}
                  className="btn-pixel-white flex items-center gap-1.5 text-xs py-2 px-3"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-mono">LOGOUT</span>
                </button>
              </div>
            </div>

            {/* Mobile / Tablet Tab Bar */}
            <div className="flex md:hidden items-center gap-1 py-2 border-t-2 border-[#0D0518] overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-arcade font-black whitespace-nowrap ${
                      isActive
                        ? 'bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518]'
                        : 'text-purple-200 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Live Score Ticker Tape */}
        <LiveTicker
          activeEvent={competition}
          transactions={data.transactions}
          participants={data.participants}
          games={data.games}
        />

        {/* Admin Modules Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-grow py-6">
          {currentTab === 'leaderboard' && (
            <AdminDashboard
              data={data}
              leaderboard={leaderboard}
              setCurrentView={setCurrentTab}
              onOpenQuickScore={handleOpenQuickScore}
              triggerCelebration={triggerCelebration}
            />
          )}

          {currentTab === 'participants' && (
            <ParticipantRosterManager
              participants={data.participants || []}
              onAddParticipant={onAddParticipant}
              onRemoveParticipant={onRemoveParticipant}
            />
          )}

          {currentTab === 'games' && (
            <GameManagement
              games={data.games}
              onSaveGame={onSaveGame}
              onDeleteGame={onDeleteGame}
              onToggleGameActive={onToggleGameActive}
            />
          )}

          {currentTab === 'guess-who' && (
            <AdminGuessWhoPage />
          )}

          {currentTab === 'coins' && (
            <CoinEconomyManager
              data={data}
              onUpdateStartingCoins={onUpdateStartingCoins}
              onAdjustParticipantCoins={onAdjustParticipantCoins}
            />
          )}

          {currentTab === 'scoring' && (
            <ScoringManagement
              data={data}
              onAwardScore={onAwardScore}
              onRollbackTransaction={onRollbackTransaction}
              quickParticipantId={quickScoreParticipantId}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="w-full mt-16 select-none">
          <div className="pixel-grass-strip h-3 w-full" />
          <div className="pixel-brick-strip py-4 px-6 text-center text-xs font-mono text-white">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-black text-[#FFDE25]">
                <span className="font-arcade text-xs">MADAGASCAR</span>
                <span>•</span>
                <span>ADMIN CONSOLE</span>
              </div>
              <div className="text-xs font-arcade text-white/90">
                16-BIT RETRO CONTROLLER
              </div>
            </div>
          </div>
        </footer>
        {/* Audio Settings Modal */}
        <AudioSettingsModal
          isOpen={isAudioModalOpen}
          onClose={() => setIsAudioModalOpen(false)}
        />
      </div>
    </div>
  );
}
