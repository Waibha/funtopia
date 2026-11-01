import React from 'react';
import {
  Trophy,
  LayoutDashboard,
  Calendar,
  Users,
  Gamepad2,
  Coins,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function Navbar({
  currentView,
  setCurrentView,
  soundEnabled,
  setSoundEnabled,
  triggerCelebration,
  resetData,
}) {
  const navItems = [
    { id: 'leaderboard', label: 'LEADERBOARD', icon: Trophy, isLive: true },
    { id: 'admin', label: 'OPERATOR', icon: LayoutDashboard },
    { id: 'events', label: 'EVENTS', icon: Calendar },
    { id: 'teams', label: 'CREWS', icon: Users },
    { id: 'games', label: 'GAMES', icon: Gamepad2 },
    { id: 'scoring', label: 'SCORING', icon: Coins },
  ];

  const handleNavClick = (id) => {
    soundFx.play('switch');
    setCurrentView(id);
  };

  const handleSoundToggle = () => {
    const newState = soundFx.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7EE]/95 backdrop-blur-md border-b-3 border-pop-ink select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 py-3">
          {/* Studio Brand Logo */}
          <div
            onClick={() => handleNavClick('leaderboard')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            {/* Chunky Pop Mascot Tile */}
            <div className="w-12 h-12 rounded-2xl bg-pop-yellow border-3 border-pop-ink shadow-pop flex items-center justify-center text-2xl font-black group-hover:-translate-y-1 group-hover:rotate-3 transition-transform">
              👾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bungee text-xl sm:text-2xl tracking-wide text-pop-ink group-hover:text-pop-purple transition-colors">
                  FUNTOPIA
                </span>
                <span className="px-2 py-0.5 rounded-full bg-pop-coral text-white font-arcade text-[9px] font-black tracking-widest uppercase border border-pop-ink shadow-pop-sm">
                  ARCADE
                </span>
              </div>
              <p className="text-[11px] font-mono text-pop-muted tracking-wider hidden sm:block font-bold">
                CHAMPIONSHIP CIRCUIT • INDIE EDITION
              </p>
            </div>
          </div>

          {/* Navigation Pills (Color-blocked) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-pop-butter p-1.5 rounded-2xl border-2 border-pop-ink shadow-pop-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-display font-black tracking-wider transition-all ${
                    isActive
                      ? 'bg-pop-yellow text-pop-ink border-2 border-pop-ink shadow-pop-sm -translate-y-0.5'
                      : 'text-pop-ink hover:bg-white/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.isLive && (
                    <span className="w-2 h-2 rounded-full bg-pop-coral animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Utility Controls */}
          <div className="flex items-center gap-2">
            {/* Celebration Confetti */}
            <button
              onClick={() => {
                soundFx.play('fanfare');
                triggerCelebration();
              }}
              title="Winner Celebration Fanfare"
              className="p-2.5 rounded-xl bg-pop-coral text-white border-2 border-pop-ink shadow-pop-sm hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-pop-yellow" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleSoundToggle}
              title={soundEnabled ? '8-Bit Synth SFX Enabled' : 'Muted'}
              className={`p-2.5 rounded-xl border-2 border-pop-ink shadow-pop-sm transition-all ${
                soundEnabled
                  ? 'bg-pop-purple text-white'
                  : 'bg-white text-pop-muted hover:bg-pop-butter'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reset Data */}
            <button
              onClick={() => {
                if (window.confirm('Reset championship data to original seed?')) {
                  soundFx.play('coin');
                  resetData();
                }
              }}
              title="Reset Sample Data"
              className="p-2.5 rounded-xl bg-white border-2 border-pop-ink shadow-pop-sm text-pop-muted hover:text-pop-coral transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center gap-1 py-2 border-t-2 border-pop-ink/20 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
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
  );
}
