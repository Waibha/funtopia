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
  Tv,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function Navbar({
  currentView,
  setCurrentView,
  soundEnabled,
  setSoundEnabled,
  crtEnabled,
  setCrtEnabled,
  triggerCelebration,
  resetData,
}) {
  const navItems = [
    { id: 'leaderboard', label: 'LEADERBOARD', icon: Trophy, isLive: true },
    { id: 'admin', label: 'OPERATOR', icon: LayoutDashboard },
    { id: 'events', label: 'EVENTS', icon: Calendar },
    { id: 'teams', label: 'TEAMS', icon: Users },
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

  const handleCrtToggle = () => {
    soundFx.play('click');
    setCrtEnabled(!crtEnabled);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#121118] border-b-2 border-arcade-border select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo & Arcade Brand */}
          <div
            onClick={() => handleNavClick('leaderboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Bold Retro Arcade Token Box */}
            <div className="w-10 h-10 rounded-lg bg-arcade-yellow border-2 border-black shadow-arcade flex items-center justify-center font-arcade text-black font-black text-lg group-hover:-translate-y-0.5 transition-transform">
              👾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-arcade text-base sm:text-lg tracking-wider text-arcade-white group-hover:text-arcade-yellow transition-colors">
                  FUNTOPIA
                </span>
                <span className="px-1.5 py-0.5 rounded bg-arcade-pink text-white font-pixel text-[9px] font-bold tracking-widest uppercase">
                  ARCADE
                </span>
              </div>
              <p className="text-[10px] font-mono text-arcade-muted tracking-wider hidden sm:block">
                CHAMPIONSHIP LEADERBOARD
              </p>
            </div>
          </div>

          {/* Navigation Links (Tactile Solid Tabs) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#1a1923] p-1.5 rounded-lg border border-arcade-border">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-display font-bold tracking-wider transition-all ${
                    isActive
                      ? 'bg-arcade-yellow text-black border border-black shadow-arcade-sm'
                      : 'text-arcade-muted hover:text-arcade-white hover:bg-[#252332]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.isLive && (
                    <span className="w-2 h-2 rounded-full bg-arcade-pink animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Arcade Utility Deck */}
          <div className="flex items-center gap-2">
            {/* Celebration Confetti Blast */}
            <button
              onClick={() => {
                soundFx.play('fanfare');
                triggerCelebration();
              }}
              title="Trigger Winner Celebration"
              className="p-2 rounded-lg bg-[#1e1c27] border border-arcade-border text-arcade-yellow hover:bg-[#2b2838] transition-all"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* CRT Scanline Toggle */}
            <button
              onClick={handleCrtToggle}
              title={crtEnabled ? 'CRT Scanlines On' : 'CRT Scanlines Off'}
              className={`p-2 rounded-lg border transition-all ${
                crtEnabled
                  ? 'bg-arcade-cyan text-black border-black font-bold'
                  : 'bg-[#1e1c27] border-arcade-border text-arcade-muted hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleSoundToggle}
              title={soundEnabled ? '8-Bit Audio On' : '8-Bit Audio Off'}
              className={`p-2 rounded-lg border transition-all ${
                soundEnabled
                  ? 'bg-arcade-pink text-white border-black font-bold'
                  : 'bg-[#1e1c27] border-arcade-border text-arcade-muted hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reset Seed State */}
            <button
              onClick={() => {
                if (window.confirm('Reset championship data to original seed?')) {
                  soundFx.play('coin');
                  resetData();
                }
              }}
              title="Reset Sample Data"
              className="p-2 rounded-lg bg-[#1e1c27] border border-arcade-border text-arcade-muted hover:text-red-400 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Row */}
        <div className="flex md:hidden items-center gap-1 py-2 border-t border-arcade-border overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-display font-bold whitespace-nowrap ${
                  isActive
                    ? 'bg-arcade-yellow text-black'
                    : 'text-arcade-muted hover:text-white'
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
  );
}
