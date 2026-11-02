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
} from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function Navbar({
  currentView,
  setCurrentView,
  soundEnabled,
  setSoundEnabled,
  triggerCelebration,
}) {
  const navItems = [
    { id: 'leaderboard', label: 'LEADERBOARD', icon: Trophy, isLive: true },
    { id: 'admin', label: 'ADMIN', icon: LayoutDashboard },
    { id: 'events', label: 'EVENTS', icon: Calendar },
    { id: 'participants', label: 'PARTICIPANTS', icon: Users },
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
    <header className="sticky top-0 z-40 bg-[#40186D]/95 backdrop-blur-md border-b-4 border-[#0D0518] select-none text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 py-3">
          {/* Studio Brand Logo */}
          <div
            onClick={() => handleNavClick('leaderboard')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            {/* Chunky Pixel Mascot Tile */}
            <div className="w-12 h-12 rounded-2xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel flex items-center justify-center text-2xl font-black group-hover:-translate-y-1 transition-transform">
              👾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bungee text-xl sm:text-2xl tracking-wide text-[#FFDE25] pixel-title-yellow">
                  MADAGASCAR
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FF5FA0] text-white font-arcade text-[9px] font-black tracking-widest uppercase border border-[#0D0518] shadow-pixel-sm">
                  ARCADE
                </span>
              </div>
              <p className="text-[11px] font-mono text-purple-200 tracking-wider hidden sm:block font-bold">
                16-BIT CHAMPIONSHIP CIRCUIT
              </p>
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#2B0E4C] p-1.5 rounded-2xl border-3 border-[#0D0518] shadow-pixel-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-arcade font-black tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518] shadow-pixel-sm -translate-y-0.5'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.isLive && (
                    <span className="w-2 h-2 rounded-full bg-[#FF5FA0] animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Utility Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.play('fanfare');
                triggerCelebration();
              }}
              className="btn-pixel-pink p-2.5"
              title="Celebration"
            >
              <Sparkles className="w-4 h-4 text-[#FFDE25]" />
            </button>

            <button
              onClick={handleSoundToggle}
              className={`p-2.5 rounded-xl border-3 border-[#0D0518] shadow-pixel-sm transition-all ${
                soundEnabled ? 'bg-[#FFDE25] text-[#0D0518]' : 'bg-[#2B0E4C] text-purple-200'
              }`}
              title={soundEnabled ? 'Audio On' : 'Audio Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
