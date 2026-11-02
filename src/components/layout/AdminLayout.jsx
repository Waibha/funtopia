import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  HelpCircle, 
  Trophy, 
  Database, 
  ArrowLeft, 
  ShieldAlert, 
  Menu, 
  X,
  Radio,
  Server
} from 'lucide-react';
import CosmicBackground from '../ui/CosmicBackground';
import Badge from '../ui/Badge';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { playArcadeSound } from '../../utilities/sound';

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const supabaseReady = isSupabaseConfigured();

  const navItems = [
    { name: 'Mission Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Participants', path: '/admin/participants', icon: Users },
    { name: 'Guess Who? Config', path: '/admin/guess-who', icon: HelpCircle, tag: 'P2' },
    { name: 'Scoring Telemetry', path: '/admin/scores', icon: Trophy, tag: 'P1' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#070714] text-slate-100 relative">
      <CosmicBackground />

      {/* Admin Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-cosmic-950/90 border-r border-purple-500/20 backdrop-blur-xl p-5 sticky top-0 h-screen z-20">
        {/* Brand */}
        <div className="pb-6 border-b border-purple-500/20">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-400 flex items-center justify-center text-purple-300">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-retro text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                MISSION CTRL
              </span>
              <span className="block text-[8px] font-mono text-cyan-400">
                ADMIN CONSOLE
              </span>
            </div>
          </div>
          <Badge variant="purple" size="sm" className="w-full justify-center">
            LEVEL 9 CLEARANCE
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-1.5">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => playArcadeSound('blip')}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? 'bg-purple-900/50 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                </div>
                {item.tag && (
                  <Badge variant={item.tag === 'P2' ? 'pink' : 'gold'} size="sm">
                    {item.tag}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Supabase Status Pill */}
        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 mb-4">
          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Database className="w-3 h-3 text-cyan-400" /> Supabase
            </span>
            <span className={supabaseReady ? 'text-emerald-400' : 'text-amber-400'}>
              {supabaseReady ? 'ONLINE' : 'OFFLINE MODE'}
            </span>
          </div>
          <p className="text-[9px] text-slate-500">
            {supabaseReady ? 'Anon key verified' : 'Check .env template to sync'}
          </p>
        </div>

        {/* Return to Public Website */}
        <Link
          to="/"
          onClick={() => playArcadeSound('blip')}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-white/5 border border-purple-500/20 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Arcade Arena
        </Link>
      </aside>

      {/* Admin Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-cosmic-950/90 border-b border-purple-500/20 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-purple-400" />
          <span className="font-retro text-xs text-purple-300">ADMIN CONTROL</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xs text-slate-400 hover:text-white px-2 py-1">
            Exit
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-purple-900/30 border border-purple-500/30 text-slate-300"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-cosmic-950 border-b border-purple-500/30 p-4 space-y-2 z-20">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-lg text-xs text-slate-300 hover:bg-purple-900/40"
            >
              <span>{item.name}</span>
              {item.tag && <Badge variant="pink" size="sm">{item.tag}</Badge>}
            </Link>
          ))}
        </div>
      )}

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-purple-500/20 bg-cosmic-950/60 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Funtopia Mainframe • Day 1 Stream</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-purple-300 bg-purple-950/40 px-2.5 py-1 rounded-md border border-purple-500/30">
              Role: Event Coordinator
            </span>
            <Link
              to="/guess-who"
              className="text-xs font-retro text-pink-400 hover:text-pink-300 transition-colors"
            >
              GUESS WHO TEST LAB →
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
