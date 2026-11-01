import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, UserPlus, Gamepad2, ArrowLeft, Sparkles, Volume2, VolumeX } from 'lucide-react';
import PublicLeaderboard from './PublicLeaderboard';
import ParticipantRegistration from '../components/participant/ParticipantRegistration';
import LiveTicker from '../components/LiveTicker';
import { soundFx } from '../utilities/soundFx';

export default function ParticipantPortal({
  data,
  leaderboard,
  onRegisterParticipant,
  triggerCelebration,
  soundEnabled,
  setSoundEnabled,
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'register' | 'games'

  const activeEvent = data.events.find((e) => e.id === data.activeEventId) || data.events[0];

  const handleTabChange = (tabId) => {
    soundFx.play('switch');
    setActiveTab(tabId);
  };

  const handleSoundToggle = () => {
    const newState = soundFx.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#180A28] flex flex-col justify-between selection:bg-pop-yellow selection:text-pop-ink font-sans">
      {/* Background Graphic Texture */}
      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#180A28 1px, transparent 1px), linear-gradient(90deg, #180A28 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Universal Participant Header */}
        <header className="sticky top-0 z-40 bg-[#FAF7EE]/95 backdrop-blur-md border-b-3 border-pop-ink select-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-20 py-3">
              {/* Brand and Breadcrumb */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/select-portal')}
                  className="w-10 h-10 rounded-xl bg-pop-butter border-2 border-pop-ink flex items-center justify-center text-pop-ink hover:bg-pop-yellow transition-colors shadow-pop-sm"
                  title="Switch Portal"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bungee text-xl sm:text-2xl tracking-wide text-pop-ink">
                      FUNTOPIA
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-pop-green text-[#180A28] font-arcade text-[9px] font-black uppercase border border-pop-ink shadow-pop-sm">
                      PARTICIPANT ARENA
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-pop-muted tracking-wider font-bold">
                    EVENT: {activeEvent?.name}
                  </p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="hidden sm:flex items-center gap-2 bg-pop-butter p-1.5 rounded-2xl border-2 border-pop-ink shadow-pop-sm">
                <button
                  onClick={() => handleTabChange('leaderboard')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-display font-black tracking-wider transition-all ${
                    activeTab === 'leaderboard'
                      ? 'bg-pop-yellow text-pop-ink border-2 border-pop-ink shadow-pop-sm -translate-y-0.5'
                      : 'text-pop-ink hover:bg-white/80'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>STANDINGS</span>
                </button>

                <button
                  onClick={() => handleTabChange('register')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-display font-black tracking-wider transition-all ${
                    activeTab === 'register'
                      ? 'bg-pop-coral text-white border-2 border-pop-ink shadow-pop-sm -translate-y-0.5'
                      : 'text-pop-ink hover:bg-white/80'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>REGISTER</span>
                </button>

                <button
                  onClick={() => handleTabChange('games')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-display font-black tracking-wider transition-all ${
                    activeTab === 'games'
                      ? 'bg-pop-purple text-white border-2 border-pop-ink shadow-pop-sm -translate-y-0.5'
                      : 'text-pop-ink hover:bg-white/80'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>DISCIPLINES</span>
                </button>
              </nav>

              {/* Utility Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSoundToggle}
                  className={`p-2.5 rounded-xl border-2 border-pop-ink shadow-pop-sm transition-all ${
                    soundEnabled ? 'bg-pop-purple text-white' : 'bg-white text-pop-muted'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    soundFx.play('fanfare');
                    triggerCelebration();
                  }}
                  className="p-2.5 rounded-xl bg-pop-coral text-white border-2 border-pop-ink shadow-pop-sm hover:-translate-y-0.5 transition-all"
                  title="Celebrate"
                >
                  <Sparkles className="w-4 h-4 text-pop-yellow" />
                </button>
              </div>
            </div>

            {/* Mobile Tab Bar */}
            <div className="flex sm:hidden items-center justify-between py-2 border-t-2 border-pop-ink/20 gap-1">
              <button
                onClick={() => handleTabChange('leaderboard')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-display font-black text-center ${
                  activeTab === 'leaderboard' ? 'bg-pop-yellow text-pop-ink border-2 border-pop-ink' : 'text-pop-muted'
                }`}
              >
                STANDINGS
              </button>
              <button
                onClick={() => handleTabChange('register')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-display font-black text-center ${
                  activeTab === 'register' ? 'bg-pop-coral text-white border-2 border-pop-ink' : 'text-pop-muted'
                }`}
              >
                REGISTER
              </button>
              <button
                onClick={() => handleTabChange('games')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-display font-black text-center ${
                  activeTab === 'games' ? 'bg-pop-purple text-white border-2 border-pop-ink' : 'text-pop-muted'
                }`}
              >
                GAMES
              </button>
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

        {/* Participant Main Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-grow">
          {activeTab === 'leaderboard' && (
            <PublicLeaderboard
              leaderboard={leaderboard}
              activeEvent={activeEvent}
              games={data.games}
              transactions={data.transactions}
              teams={data.teams}
              triggerCelebration={triggerCelebration}
            />
          )}

          {activeTab === 'register' && (
            <ParticipantRegistration
              activeEvent={activeEvent}
              teams={data.teams}
              onRegisterParticipant={onRegisterParticipant}
              registeredList={data.participants || []}
            />
          )}

          {activeTab === 'games' && (
            <div className="py-8 space-y-6">
              <div className="bg-pop-purple text-white rounded-3xl border-3 border-pop-ink p-6 sm:p-8 shadow-pop-lg">
                <span className="px-3 py-1 rounded-full bg-pop-yellow text-pop-ink font-arcade text-[10px] font-black uppercase border-2 border-pop-ink shadow-pop-sm inline-block mb-2">
                  RULEBOOK & FORMAT
                </span>
                <h2 className="font-bungee text-3xl sm:text-4xl text-pop-yellow">
                  CHAMPIONSHIP DISCIPLINES
                </h2>
                <p className="text-purple-100 font-sans text-sm mt-1 max-w-2xl font-medium">
                  Review base scores, difficulty multipliers, and competitive rules for all active games in {activeEvent?.name}.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.games.map((g) => (
                  <div
                    key={g.id}
                    className="p-6 rounded-3xl bg-white border-3 border-pop-ink shadow-pop space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-pop-butter border-2 border-pop-ink shadow-pop-sm flex items-center justify-center text-3xl">
                          {g.icon}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-pop-ink text-white font-black">
                            {g.category}
                          </span>
                          <h3 className="font-display font-black text-xl text-pop-ink mt-1">
                            {g.name}
                          </h3>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-pop-green text-[#180A28] font-arcade text-[9px] font-black border-2 border-pop-ink">
                        {g.isActive ? 'ACTIVE' : 'OFFLINE'}
                      </span>
                    </div>

                    <p className="text-sm font-sans text-pop-muted font-medium">
                      {g.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 bg-pop-butter p-3 rounded-2xl border-2 border-pop-ink text-center font-mono">
                      <div>
                        <span className="text-[9px] text-pop-muted block font-bold">BASE PTS</span>
                        <span className="text-base font-black text-pop-coral">{g.basePoints}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-pop-muted block font-bold">MULTIPLIER</span>
                        <span className="text-base font-black text-pop-ink">{g.multiplier}x</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-pop-muted block font-bold">MAX ROUNDS</span>
                        <span className="text-base font-black text-pop-purple">{g.maxRounds}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-pop-canvas border-2 border-pop-ink text-xs font-mono font-bold text-pop-ink">
                      Rule Note: {g.rules}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t-3 border-pop-ink py-6 bg-pop-butter mt-16 text-center text-xs font-mono text-pop-muted select-none">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-pop-ink">
              <span className="font-bungee text-sm">FUNTOPIA</span>
              <span>•</span>
              <span>PARTICIPANT EXPERIENCE</span>
            </div>
            <div className="text-xs font-bold text-pop-ink">
              LIVE ARENA SYSTEM
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
