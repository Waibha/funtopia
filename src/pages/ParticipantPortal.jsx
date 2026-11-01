import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  UserPlus,
  Gamepad2,
  ArrowLeft,
  Sparkles,
  Volume2,
  Sliders,
  Coins,
  Play,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import PublicLeaderboard from './PublicLeaderboard';
import ParticipantRegistration from '../components/participant/ParticipantRegistration';
import LiveTicker from '../components/LiveTicker';
import AudioSettingsModal from '../components/AudioSettingsModal';
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
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  // Casino-arcade participant wallet balance
  const [walletBalance, setWalletBalance] = useState(1250);
  const [lastPlayedGame, setLastPlayedGame] = useState(null);

  const activeEvent = data.events.find((e) => e.id === data.activeEventId) || data.events[0];

  const handleTabChange = (tabId) => {
    soundFx.play('switch');
    setActiveTab(tabId);
  };

  const handlePlayGameDemo = (game) => {
    if (walletBalance < game.cost) {
      soundFx.play('scoreDown');
      alert(`Insufficient arcade coins! Cost: $${game.cost}, Balance: $${walletBalance}`);
      return;
    }

    // Play coin spend mechanical sound
    soundFx.play('spend');
    setWalletBalance((prev) => prev - game.cost);
    setLastPlayedGame(game.name);

    setTimeout(() => {
      soundFx.play('coin');
      triggerCelebration();
      alert(`Played ${game.name}! Spent $${game.cost} game cost and earned ${game.points} tournament points!`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#451B75] text-white flex flex-col justify-between selection:bg-[#FFDE25] selection:text-[#0D0518] font-sans">
      {/* Background Graphic Texture */}
      <div
        className="fixed inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#FFDE25 1px, transparent 1px), linear-gradient(90deg, #FFDE25 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="fixed inset-0 bg-radial-at-t from-purple-700/20 via-transparent to-[#1F0738]/90 pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Universal Participant Header */}
        <header className="sticky top-0 z-40 bg-[#40186D]/95 backdrop-blur-md border-b-4 border-[#0D0518] select-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-20 py-3">
              {/* Brand and Breadcrumb */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    soundFx.play('transition');
                    navigate('/select-portal');
                  }}
                  className="btn-pixel-white p-2.5 rounded-xl"
                  title="Return to Portal Selection"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bungee text-xl sm:text-2xl tracking-wide text-[#FFDE25] pixel-title-yellow">
                      FUNTOPIA
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#28C76F] text-[#0D0518] font-arcade text-[9px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm">
                      PARTICIPANT LOBBY
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-purple-200 tracking-wider font-bold">
                    CIRCUIT: {activeEvent?.name}
                  </p>
                </div>
              </div>

              {/* Navigation Tabs (High-End Tactile Buttons) */}
              <nav className="hidden sm:flex items-center gap-2 bg-[#2B0E4C] p-1.5 rounded-2xl border-3 border-[#0D0518] shadow-pixel-sm">
                <button
                  onClick={() => handleTabChange('leaderboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-black tracking-wider transition-all ${
                    activeTab === 'leaderboard'
                      ? 'bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518] shadow-pixel-sm -translate-y-0.5'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>STANDINGS</span>
                </button>

                <button
                  onClick={() => handleTabChange('register')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-black tracking-wider transition-all ${
                    activeTab === 'register'
                      ? 'bg-[#FF5FA0] text-white border-2 border-[#0D0518] shadow-pixel-sm -translate-y-0.5'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>REGISTER</span>
                </button>

                <button
                  onClick={() => handleTabChange('games')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-black tracking-wider transition-all ${
                    activeTab === 'games'
                      ? 'bg-[#28C76F] text-[#0D0518] border-2 border-[#0D0518] shadow-pixel-sm -translate-y-0.5'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>GAMES CATALOG</span>
                </button>
              </nav>

              {/* Right Side: Arcade Coin Wallet & Audio Master Settings */}
              <div className="flex items-center gap-2.5">
                {/* Interactive Casino-Style Coin Wallet */}
                <div
                  title="Player Arcade Coin Wallet"
                  className="hidden md:flex items-center gap-2 bg-[#200B3B] px-3.5 py-1.5 rounded-xl border-2 border-[#FFDE25] shadow-pixel-sm text-xs font-mono"
                >
                  <span className="text-base animate-bounce-subtle">🪙</span>
                  <div>
                    <span className="text-[9px] text-[#FFDE25] block font-arcade font-black leading-none">WALLET</span>
                    <span className="font-black text-white text-xs">${walletBalance.toLocaleString()}</span>
                  </div>
                </div>

                {/* Audio Master Modal Toggle */}
                <button
                  onClick={() => setIsAudioModalOpen(true)}
                  className="btn-pixel-yellow p-2 rounded-xl flex items-center gap-1.5 text-xs"
                  title="Audio & Atmosphere Settings"
                >
                  <Sliders className="w-4 h-4" />
                  <span className="hidden lg:inline font-mono">AUDIO</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.play('fanfare');
                    triggerCelebration();
                  }}
                  className="btn-pixel-pink p-2 rounded-xl"
                  title="Celebrate"
                >
                  <Sparkles className="w-4 h-4 text-[#FFDE25]" />
                </button>
              </div>
            </div>

            {/* Mobile Tab Bar */}
            <div className="flex sm:hidden items-center justify-between py-2 border-t-2 border-[#0D0518] gap-1">
              <button
                onClick={() => handleTabChange('leaderboard')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-display font-black text-center ${
                  activeTab === 'leaderboard' ? 'bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518]' : 'text-purple-200'
                }`}
              >
                STANDINGS
              </button>
              <button
                onClick={() => handleTabChange('register')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-display font-black text-center ${
                  activeTab === 'register' ? 'bg-[#FF5FA0] text-white border-2 border-[#0D0518]' : 'text-purple-200'
                }`}
              >
                REGISTER
              </button>
              <button
                onClick={() => handleTabChange('games')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-display font-black text-center ${
                  activeTab === 'games' ? 'bg-[#28C76F] text-[#0D0518] border-2 border-[#0D0518]' : 'text-purple-200'
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
          participants={data.participants}
          games={data.games}
        />

        {/* Participant Main Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-grow py-6">
          {activeTab === 'leaderboard' && (
            <PublicLeaderboard
              leaderboard={leaderboard}
              activeEvent={activeEvent}
              games={data.games}
              transactions={data.transactions}
              participants={data.participants}
              triggerCelebration={triggerCelebration}
            />
          )}

          {activeTab === 'register' && (
            <ParticipantRegistration
              activeEvent={activeEvent}
              onRegisterParticipant={onRegisterParticipant}
              registeredList={data.participants || []}
            />
          )}

          {activeTab === 'games' && (
            <div className="space-y-6">
              {/* Rules & Format Header */}
              <div className="bg-[#40186D] text-white rounded-3xl border-4 border-[#0D0518] p-6 sm:p-8 shadow-pixel-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#FF5FA0] text-white font-arcade text-[10px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm inline-block mb-2">
                    ARCADE LOBBY CATALOG
                  </span>
                  <h2 className="font-bungee text-3xl sm:text-5xl text-[#FFDE25] pixel-title-yellow">
                    CHAMPIONSHIP GAMES
                  </h2>
                  <p className="text-purple-200 font-sans text-xs sm:text-sm mt-1 max-w-2xl font-medium">
                    Review required entry costs, point values, and active tournament rotation for {activeEvent?.name}.
                  </p>
                </div>

                {/* Player Token Bank Widget */}
                <div className="bg-[#200B3B] p-4 rounded-2xl border-3 border-[#FFDE25] shadow-pixel text-center shrink-0">
                  <span className="text-[10px] font-arcade text-[#FFDE25] block font-black">YOUR ARCADE BALANCE</span>
                  <div className="font-display font-black text-2xl text-white mt-1 flex items-center justify-center gap-1.5">
                    <span>🪙</span>
                    <span>${walletBalance.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      soundFx.play('coin');
                      setWalletBalance((prev) => prev + 500);
                    }}
                    className="mt-2 text-[10px] font-mono font-black text-[#FFDE25] hover:underline"
                  >
                    + Reload 500 Tokens
                  </button>
                </div>
              </div>

              {/* Game Cartridges Grid with Interactive Gameplay Simulation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.games.map((g) => (
                  <div
                    key={g.id}
                    className="p-6 rounded-3xl bg-[#FAF7EE] text-[#0D0518] border-4 border-[#0D0518] shadow-pixel-xl space-y-4 hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel-sm flex items-center justify-center text-3xl shrink-0">
                          {g.name.toLowerCase().includes('race') || g.name.toLowerCase().includes('racer') ? '🏎️' :
                           g.name.toLowerCase().includes('pixel') || g.name.toLowerCase().includes('blast') ? '👾' :
                           g.name.toLowerCase().includes('puzzle') ? '🧩' :
                           g.name.toLowerCase().includes('pinball') ? '⚡' : '🕹️'}
                        </div>
                        <div>
                          <h3 className="font-display font-black text-2xl text-[#0D0518]">
                            {g.name}
                          </h3>
                          {g.description && (
                            <p className="text-xs font-sans text-gray-600 font-medium mt-0.5">
                              {g.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full font-arcade text-[9px] font-black border-2 border-[#0D0518] ${
                        g.isActive ? 'bg-[#28C76F] text-[#0D0518]' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {g.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border-3 border-[#0D0518] text-center font-mono">
                      <div>
                        <span className="text-[10px] text-gray-500 block font-bold uppercase">GAME COST / BUDGET</span>
                        <span className="text-xl font-black text-[#FF5FA0] flex items-center justify-center gap-1">
                          <Coins className="w-4 h-4" />
                          ${Number(g.cost || 0).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block font-bold uppercase">POINTS VALUE</span>
                        <span className="text-xl font-black text-[#5C2D91]">
                          {Number(g.points || 0).toLocaleString()} PTS
                        </span>
                      </div>
                    </div>

                    {/* Interactive Play / Enter Game Simulation */}
                    <div className="pt-2 flex items-center justify-between border-t-2 border-[#0D0518]/20">
                      <span className="text-xs font-mono text-gray-600 font-bold">
                        Entry Fee: ${g.cost || 0}
                      </span>

                      <button
                        onClick={() => handlePlayGameDemo(g)}
                        className="btn-pixel-yellow text-xs py-2 px-4 flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-[#0D0518]" />
                        <span>ENTER MATCH (-${g.cost || 0})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Footer: Pixel Brick Platform */}
        <footer className="w-full mt-16 select-none">
          <div className="pixel-grass-strip h-3 w-full" />
          <div className="pixel-brick-strip py-4 px-6 text-center text-xs font-mono text-white">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-black text-[#FFDE25]">
                <span className="font-arcade text-xs">FUNTOPIA</span>
                <span>•</span>
                <span>PARTICIPANT EXPERIENCE</span>
              </div>
              <div className="text-xs font-arcade text-white/90">
                16-BIT CHAMPIONSHIP ENGINE • HIGH FIDELITY AUDIO ACTIVE
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Audio Settings Modal */}
      <AudioSettingsModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
      />
    </div>
  );
}
