import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Gamepad2, 
  Trophy, 
  Calendar, 
  BookOpen, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  Sparkles,
  Tv
} from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { isAudioEnabled, setAudioEnabled, initAudioPreferences, playArcadeSound } from '../../utilities/sound';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setAudioOn(initAudioPreferences());
  }, []);

  const toggleAudio = () => {
    const next = !audioOn;
    setAudioOn(next);
    setAudioEnabled(next);
    if (next) playArcadeSound('coin');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Sparkles },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy, tag: 'Live' },
    { name: 'Guess Who? Screen', path: '/guess-who', icon: Tv, highlight: true, tag: 'Display' },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'Rules', path: '/rules', icon: BookOpen },
    { name: 'Admin', path: '/admin', icon: ShieldCheck, admin: true },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-cosmic-950/80 border-b border-purple-500/20">
      {/* Live Event Ticker Bar */}
      <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-cyan-900/40 border-b border-white/5 py-1 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="font-retro text-[9px] text-cyan-300">STAGE 1 ACTIVE</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-[11px] font-mono text-slate-400">
              Cosmic Retro Championship 2026 • Coordinator-Operated Tournament
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleAudio}
              className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 hover:text-cyan-300 transition-colors p-1"
              title={audioOn ? 'Mute 8-bit sound fx' : 'Enable 8-bit sound fx'}
            >
              {audioOn ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              <span className="hidden md:inline">{audioOn ? 'SFX ON' : 'SFX OFF'}</span>
            </button>
            <span className="text-slate-600">|</span>
            <Link
              to="/admin"
              className="text-[10px] font-retro text-purple-400 hover:text-pink-400 transition-colors"
            >
              ADMIN PORTAL
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => playArcadeSound('blip')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-400 p-[2px] shadow-[0_0_15px_rgba(236,72,153,0.5)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] transition-all">
              <div className="w-full h-full bg-cosmic-950 rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-cyan-400 group-hover:scale-110 group-hover:text-pink-400 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-retro text-lg sm:text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300">
                FUNTOPIA
              </span>
              <span className="block text-[8px] font-retro tracking-widest text-slate-400 -mt-1 group-hover:text-cyan-300 transition-colors">
                ARCADE CHAMPIONSHIP
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;

              if (link.highlight) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => playArcadeSound('coin')}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                      active
                        ? 'bg-pink-600/20 text-pink-300 border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.4)]'
                        : 'bg-pink-950/40 text-pink-300/90 border-pink-500/40 hover:bg-pink-900/30 hover:border-pink-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-pink-400" />
                    <span>{link.name}</span>
                    <Badge variant="pink" size="sm" pulse={true}>
                      {link.tag}
                    </Badge>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => playArcadeSound('blip')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    active
                      ? 'bg-purple-900/40 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{link.name}</span>
                  {link.tag && (
                    <Badge variant={link.path === '/leaderboard' ? 'gold' : 'cyan'} size="sm">
                      {link.tag}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link to="/admin/guess-who" className="hidden lg:block">
              <Button variant="cyan" size="sm" sound="laser">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Operator Console
              </Button>
            </Link>

            <button
              onClick={() => {
                playArcadeSound('blip');
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white bg-purple-950/50 border border-purple-500/30"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-500/30 bg-cosmic-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => {
                  playArcadeSound('blip');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-purple-900/50 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </div>
                {link.tag && (
                  <Badge variant={link.highlight ? 'pink' : 'cyan'} size="sm">
                    {link.tag}
                  </Badge>
                )}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              to="/admin/guess-who"
              onClick={() => setMobileMenuOpen(false)}
              className="block"
            >
              <Button variant="cyan" size="md" className="w-full">
                🛡️ Open Operator Console
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
