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
  Shield,
  Scroll,
} from 'lucide-react';
import AudioSettingsModal from '../components/AudioSettingsModal';
import AdminDashboard from './AdminDashboard';
import GameManagement from './GameManagement';
import ScoringManagement from './ScoringManagement';
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
      <div className="min-h-screen bg-[#0A091A] flex items-center justify-center text-slate-100 font-cinzel text-sm">
        <div className="p-8 rounded-3xl bg-[#0F1B38] text-center border-2 border-[#00F0FF]/40 shadow-fantasy-card">
          <div className="animate-spin text-3xl mb-3">🗝️</div>
          <p className="font-bold tracking-widest text-[#00F0FF]">VERIFYING CITADEL MARSHAL PASSKEY...</p>
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
    { id: 'participants', label: 'PARTICIPANTS', icon: Users },
    { id: 'coins', label: 'COINS', icon: Coins },
    { id: 'scoring', label: 'SCORING', icon: Trophy },
  ];

  return (
    <div className="relative min-h-screen bg-[#0A091A] text-slate-100 flex flex-col justify-between selection:bg-[#00F0FF] selection:text-[#0A091A] font-sans">
      {/* Background Animated Arcade Elements */}
      <AdminArcadeBackground />
      <div className="fixed inset-0 bg-radial-at-t from-cyan-950/20 via-transparent to-[#0A091A]/95 pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Admin Header */}
        <header className="sticky top-0 z-40 bg-[#091122]/95 backdrop-blur-md border-b border-[#00F0FF]/30 select-none shadow-fantasy-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-20 py-3">
              {/* Brand & Portal Switch */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/select-portal')}
                  className="btn-fantasy-subtle p-2.5 rounded-xl text-cyan-200"
                  title="Return to Realm Selection"
                >
                  <ArrowLeft className="w-4 h-4 text-[#00F0FF]" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-xl sm:text-2xl font-black tracking-widest text-[#FFC837] fantasy-title-gold">
                      MADAGASCAR
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-cinzel text-[9px] font-bold uppercase border border-[#00F0FF]/40 shadow-fantasy-cyan">
                      HIGH CITADEL CHAMBER
                    </span>
                  </div>
                  <p className="text-[10px] font-jakarta text-slate-400 tracking-wider">
                    OPERATOR: {adminSession.email || adminSession.operator || 'CITADEL MARSHAL'}
                  </p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center gap-1.5 bg-[#060D1E]/90 p-1.5 rounded-2xl border border-white/10 shadow-fantasy-card">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 text-white font-black shadow-fantasy-cyan -translate-y-0.5'
                          : 'text-slate-300 hover:text-white'
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
                  onClick={() => setIsAudioModalOpen(true)}
                  className="btn-fantasy-subtle p-2.5 rounded-xl text-xs"
                  title="Citadel Audio Settings"
                >
                  <Sliders className="w-4 h-4 text-[#00F0FF]" />
                </button>

                <button
                  onClick={() => {
                    soundFx.play('fanfare');
                    triggerCelebration();
                  }}
                  className="btn-fantasy-subtle p-2.5 rounded-xl text-xs"
                  title="Test Fanfare"
                >
                  <Sparkles className="w-4 h-4 text-[#FFC837]" />
                </button>

                <button
                  onClick={handleLogout}
                  className="btn-fantasy-subtle flex items-center gap-1.5 text-xs py-2 px-3 font-cinzel text-red-300 hover:text-red-200"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">LOGOUT</span>
                </button>
              </div>
            </div>

            {/* Mobile / Tablet Tab Bar */}
            <div className="flex md:hidden items-center gap-1.5 py-2 border-t border-white/10 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-cinzel font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-[#0A091A] font-black'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
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

        {/* Citadel Footer */}
        <footer className="w-full mt-16 select-none border-t border-white/10 bg-[#060B17]/90 py-5 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-jakarta text-slate-400 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏰</span>
              <span className="text-[#FFC837] font-cinzel font-bold text-xs">MADAGASCAR</span>
              <span>•</span>
              <span className="font-cinzel text-cyan-300">HIGH CITADEL MARSHAL CONSOLE</span>
            </div>
            <div className="text-xs font-cinzel text-slate-400">
              SECURE ROYAL ARCHIVE • v2.6.0
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
