import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Trophy, Heart, Code2, Terminal, Sparkles, Tv, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-purple-500/30 bg-cosmic-950/90 backdrop-blur-md overflow-hidden">
      {/* Top Arcade Marquee Stripe */}
      <div className="border-b border-purple-500/20 bg-purple-950/40 py-2 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-marquee font-retro text-[9px] text-cyan-400/80 tracking-widest gap-8">
          <span>★ MADAGASCAR 2026 ARCADE CHAMPIONSHIP</span>
          <span className="text-pink-400">♦ STAGE 1: GUESS WHO? (COORDINATOR OPERATED) ♦</span>
          <span>★ 50% GUESS WHO? MODULE BY PERSON 2</span>
          <span className="text-yellow-400">★ 50% LEADERBOARD MODULE BY PERSON 1</span>
          <span>★ REAL-TIME BROADCAST SYNCHRONIZATION</span>
          <span className="text-cyan-400">★ HIGH SCORE TO BEAT: 99,990</span>
          <span>★ COSMIC RETRO PROTOCOL ACTIVE</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-pink-400" />
              </div>
              <span className="font-retro text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-300">
                MADAGASCAR
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              A Cosmic Retro-themed event management platform. Built with React, Vite, Tailwind CSS, and Supabase.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-md w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              BUILD v0.3.0 • BRANCH: feature/guess-who
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-retro text-[11px] text-pink-400 tracking-wider mb-4">
              PORTAL MAP
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> Home Overview
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-yellow-300 transition-colors flex items-center gap-1.5">
                  <Trophy className="w-3 h-3 text-yellow-400" /> Live Standings (P1)
                </Link>
              </li>
              <li>
                <Link to="/guess-who" className="hover:text-pink-300 transition-colors flex items-center gap-1.5">
                  <Tv className="w-3 h-3 text-pink-400" /> Guess Who Screen (P2)
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  Schedule & Stages
                </Link>
              </li>
              <li>
                <Link to="/rules" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  Arcade Rulebook
                </Link>
              </li>
            </ul>
          </div>

          {/* Modular Team Structure */}
          <div>
            <h4 className="font-retro text-[11px] text-yellow-400 tracking-wider mb-4">
              MODULE ARCHITECTURE
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-pink-950/20 border border-pink-500/30">
                <div className="font-retro text-[9px] text-pink-300 mb-0.5">
                  MODULE 1: GUESS WHO?
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  Person 2 Domain (Coordinator-Operated)
                </div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Projector & Console Ready
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-yellow-950/20 border border-yellow-500/30">
                <div className="font-retro text-[9px] text-yellow-300 mb-0.5">
                  MODULE 2: LEADERBOARD & SCORING
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  Person 1 Domain (50% Scope)
                </div>
                <div className="text-[10px] text-purple-300 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Modular Slot Prepared
                </div>
              </div>
            </div>
          </div>

          {/* Admin & System */}
          <div>
            <h4 className="font-retro text-[11px] text-cyan-400 tracking-wider mb-4">
              COORDINATOR TOOLS
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/admin/guess-who" className="hover:text-pink-300 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-pink-400" /> Guess Who Mission Operator
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-purple-400" /> Mission Control Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/scores" className="hover:text-yellow-300 transition-colors">
                  Scoring Logs & Ledger
                </Link>
              </li>
              <li>
                <Link to="/admin/participants" className="hover:text-purple-300 transition-colors">
                  Player Registrations
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-purple-500/20 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 MADAGASCAR. All rights reserved. Cosmic Retro Arcade System.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for the Championship.
          </p>
        </div>
      </div>
    </footer>
  );
}
