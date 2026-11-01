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
  activeEvent,
}) {
  const navItems = [
    { id: 'leaderboard', label: 'LEADERBOARD', icon: Trophy, publicBadge: 'LIVE' },
    { id: 'admin', label: 'OVERVIEW', icon: LayoutDashboard },
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
    <header className="sticky top-0 z-40 bg-[#060714]/90 backdrop-blur-md border-b border-purple-500/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Universe Branding */}
          <div
            onClick={() => handleNavClick('leaderboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-lg bg-gradient-to-br from-arcade-pink via-arcade-purple to-arcade-cyan p-[2px] shadow-neon-pink group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#070817] rounded-md flex items-center justify-center">
                <span className="text-xl">👾</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-arcade text-lg sm:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-arcade-pink via-arcade-yellow to-arcade-cyan drop-shadow">
                  FUNTOPIA
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-pixel tracking-widest bg-arcade-pink/20 text-arcade-pink border border-arcade-pink/40">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] font-mono tracking-widest text-purple-300/70 hidden sm:block">
                COSMIC RETRO CHAMPIONSHIP
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#0a0c24]/80 p-1.5 rounded-xl border border-purple-500/20">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-display font-semibold tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-700/80 to-pink-600/80 text-white shadow-neon-purple border border-pink-400/40'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-arcade-cyan' : 'text-purple-400'}`} />
                  <span>{item.label}</span>
                  {item.publicBadge && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Arcade Controls */}
          <div className="flex items-center gap-2">
            {/* Celebration Confetti */}
            <button
              onClick={() => {
                soundFx.play('fanfare');
                triggerCelebration();
              }}
              title="Trigger Winner Fanfare & Confetti"
              className="p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-arcade-yellow hover:bg-yellow-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* CRT Toggle */}
            <button
              onClick={handleCrtToggle}
              title={crtEnabled ? 'Disable CRT Scanlines' : 'Enable CRT Scanlines'}
              className={`p-2.5 rounded-lg border transition-all ${
                crtEnabled
                  ? 'bg-cyan-500/20 border-cyan-400 text-arcade-cyan shadow-neon-cyan'
                  : 'bg-white/5 border-purple-500/20 text-gray-400 hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4" />
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={handleSoundToggle}
              title={soundEnabled ? 'Mute 8-bit Audio' : 'Unmute 8-bit Audio'}
              className={`p-2.5 rounded-lg border transition-all ${
                soundEnabled
                  ? 'bg-purple-600/20 border-purple-500/40 text-arcade-pink'
                  : 'bg-white/5 border-purple-500/20 text-gray-500 hover:text-gray-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reset Seed State */}
            <button
              onClick={() => {
                if (window.confirm('Reset all sample data to default Indie Studio state?')) {
                  soundFx.play('coin');
                  resetData();
                }
              }}
              title="Reset sample data"
              className="p-2.5 rounded-lg bg-white/5 border border-purple-500/20 text-gray-400 hover:text-red-400 hover:border-red-500/40 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-purple-500/10 overflow-x-auto gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-display whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-gray-400 hover:text-white'
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
