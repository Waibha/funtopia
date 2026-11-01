import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Gamepad2,
  Coins,
  UserCheck,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import EventManagement from './EventManagement';
import TeamManagement from './TeamManagement';
import GameManagement from './GameManagement';
import ScoringManagement from './ScoringManagement';
import ParticipantRosterManager from '../components/admin/ParticipantRosterManager';
import AdminLogin from '../components/admin/AdminLogin';
import LiveTicker from '../components/LiveTicker';
import { soundFx } from '../utilities/soundFx';

export default function AdminPortal({
  data,
  leaderboard,
  onSaveEvent,
  setActiveEventId,
  onSaveTeam,
  onDeleteTeam,
  onSaveGame,
  onDeleteGame,
  onToggleGameActive,
  onAwardScore,
  onRollbackTransaction,
  onAssignParticipantTeam,
  onRemoveParticipant,
  triggerCelebration,
}) {
  const navigate = useNavigate();
  const [adminSession, setAdminSession] = useState(() => {
    try {
      const saved = sessionStorage.getItem('funtopia_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [currentTab, setCurrentTab] = useState('overview'); // 'overview' | 'events' | 'teams' | 'games' | 'scoring' | 'participants'
  const [quickScoreTeamId, setQuickScoreTeamId] = useState(null);

  const activeEvent = data.events.find((e) => e.id === data.activeEventId) || data.events[0];

  const handleLoginSuccess = (session) => {
    setAdminSession(session);
    try {
      sessionStorage.setItem('funtopia_admin_session', JSON.stringify(session));
    } catch (e) {}
  };

  const handleLogout = () => {
    soundFx.play('click');
    setAdminSession(null);
    try {
      sessionStorage.removeItem('funtopia_admin_session');
    } catch (e) {}
  };

  const handleTabChange = (tabId) => {
    soundFx.play('switch');
    setCurrentTab(tabId);
  };

  const handleOpenQuickScore = (teamId = null) => {
    setQuickScoreTeamId(teamId);
    setCurrentTab('scoring');
  };

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
    { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
    { id: 'events', label: 'EVENTS', icon: Calendar },
    { id: 'teams', label: 'CREWS', icon: Users },
    { id: 'games', label: 'GAMES', icon: Gamepad2 },
    { id: 'scoring', label: 'SCORING', icon: Coins },
    { id: 'participants', label: 'ROSTER', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#180A28] flex flex-col justify-between selection:bg-pop-yellow selection:text-pop-ink font-sans">
      <div className="relative z-10 flex flex-col flex-grow">
        {/* Admin Header */}
        <header className="sticky top-0 z-40 bg-[#FAF7EE]/95 backdrop-blur-md border-b-3 border-pop-ink select-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-20 py-3">
              {/* Brand & Portal Switch */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/select-portal')}
                  className="w-10 h-10 rounded-xl bg-pop-butter border-2 border-pop-ink flex items-center justify-center text-pop-ink hover:bg-pop-yellow transition-colors shadow-pop-sm"
                  title="Return to Portal Selection"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bungee text-xl sm:text-2xl tracking-wide text-pop-ink">
                      FUNTOPIA
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-pop-yellow text-pop-ink font-arcade text-[9px] font-black uppercase border border-pop-ink shadow-pop-sm">
                      RESTRICTED ADMIN
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-pop-muted tracking-wider font-bold">
                    OPERATOR: {adminSession.email}
                  </p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="hidden lg:flex items-center gap-1.5 bg-pop-butter p-1.5 rounded-2xl border-2 border-pop-ink shadow-pop-sm">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-display font-black tracking-wider transition-all ${
                        isActive
                          ? 'bg-pop-yellow text-pop-ink border-2 border-pop-ink shadow-pop-sm -translate-y-0.5'
                          : 'text-pop-ink hover:bg-white/80'
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
                  onClick={() => {
                    soundFx.play('fanfare');
                    triggerCelebration();
                  }}
                  className="p-2.5 rounded-xl bg-pop-coral text-white border-2 border-pop-ink shadow-pop-sm hover:-translate-y-0.5 transition-all"
                  title="Test Winner Fanfare"
                >
                  <Sparkles className="w-4 h-4 text-pop-yellow" />
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pop-butter hover:bg-pop-coral hover:text-white border-2 border-pop-ink text-xs font-mono font-bold shadow-pop-sm transition-all"
                  title="Log out of admin station"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">LOGOUT</span>
                </button>
              </div>
            </div>

            {/* Mobile / Tablet Tab Bar */}
            <div className="flex lg:hidden items-center gap-1 py-2 border-t-2 border-pop-ink/20 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-display font-black whitespace-nowrap ${
                      isActive
                        ? 'bg-pop-yellow text-pop-ink border-2 border-pop-ink'
                        : 'text-pop-muted hover:text-pop-ink'
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
          activeEvent={activeEvent}
          transactions={data.transactions}
          teams={data.teams}
          games={data.games}
        />

        {/* Admin Modules Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-grow">
          {currentTab === 'overview' && (
            <AdminDashboard
              data={data}
              leaderboard={leaderboard}
              setCurrentView={setCurrentTab}
              onOpenQuickScore={handleOpenQuickScore}
              triggerCelebration={triggerCelebration}
            />
          )}

          {currentTab === 'events' && (
            <EventManagement
              events={data.events}
              activeEventId={data.activeEventId}
              setActiveEventId={setActiveEventId}
              onSaveEvent={onSaveEvent}
              teams={data.teams}
              games={data.games}
            />
          )}

          {currentTab === 'teams' && (
            <TeamManagement
              teams={data.teams}
              onSaveTeam={onSaveTeam}
              onDeleteTeam={onDeleteTeam}
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

          {currentTab === 'scoring' && (
            <ScoringManagement
              data={data}
              onAwardScore={onAwardScore}
              onRollbackTransaction={onRollbackTransaction}
              quickTeamId={quickScoreTeamId}
            />
          )}

          {currentTab === 'participants' && (
            <ParticipantRosterManager
              participants={data.participants || []}
              teams={data.teams}
              events={data.events}
              activeEventId={data.activeEventId}
              onAssignTeam={onAssignParticipantTeam}
              onRemoveParticipant={onRemoveParticipant}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t-3 border-pop-ink py-6 bg-pop-butter mt-16 text-center text-xs font-mono text-pop-muted select-none">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-pop-ink">
              <span className="font-bungee text-sm">FUNTOPIA</span>
              <span>•</span>
              <span>RESTRICTED OPERATOR CONSOLE</span>
            </div>
            <div className="text-xs font-bold text-pop-ink">
              SUPABASE ROW LEVEL SECURITY (RLS) ACTIVE
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
