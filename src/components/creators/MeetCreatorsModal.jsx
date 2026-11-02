import React, { useEffect } from 'react';
import { X, Trophy, Gamepad2, Sparkles, Code2, ExternalLink, ShieldCheck } from 'lucide-react';
import { soundFx } from '../../utilities/soundFx';

function GithubIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function MeetCreatorsModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    soundFx.play('switch');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0D0518]/85 backdrop-blur-sm animate-fade-in select-none">
      {/* Arcade Kiosk Container */}
      <div className="relative w-full max-w-4xl bg-[#200B3B] border-4 border-[#0D0518] rounded-[2rem] sm:rounded-[2.5rem] shadow-[10px_14px_0px_#0D0518] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Decorative Corner Rivets */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-[#FFDE25] border-2 border-[#0D0518] text-[7px] flex items-center justify-center font-bold text-[#0D0518] pointer-events-none z-20">✦</div>
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#FFDE25] border-2 border-[#0D0518] text-[7px] flex items-center justify-center font-bold text-[#0D0518] pointer-events-none z-20">✦</div>
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-[#FFDE25] border-2 border-[#0D0518] text-[7px] flex items-center justify-center font-bold text-[#0D0518] pointer-events-none z-20">✦</div>
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-[#FFDE25] border-2 border-[#0D0518] text-[7px] flex items-center justify-center font-bold text-[#0D0518] pointer-events-none z-20">✦</div>

        {/* Arcade Cabinet Marquee Canopy Header */}
        <div className="relative bg-gradient-to-r from-[#2E0B55] via-[#431278] to-[#2E0B55] border-b-4 border-[#0D0518] px-6 py-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel-sm flex items-center justify-center text-xl shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#28C76F] animate-ping" />
                <span className="text-[10px] font-arcade text-[#28C76F] uppercase tracking-wider">
                  OFFICIAL TOURNAMENT CREDITS
                </span>
              </div>
              <h2 className="font-bungee text-xl sm:text-2xl text-[#FFDE25] tracking-wide leading-tight">
                MEET THE CREATORS
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-xl bg-[#FFFDF7] text-[#0D0518] border-3 border-[#0D0518] shadow-pixel-sm hover:bg-[#FF5FA0] hover:text-white transition-all flex items-center justify-center text-sm font-black"
            title="Close Credits (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-grow">
          <div className="text-center max-w-xl mx-auto">
            <p className="font-mono text-xs sm:text-sm text-purple-200">
              The architects and developers behind <strong className="text-[#FFDE25]">MADAGASCAR</strong>. Engineered for real-time arcade tournaments and interactive competition.
            </p>
          </div>

          {/* Creators Dual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* ========================================================= */}
            {/* CREATOR 1: Waibha                                         */}
            {/* ========================================================= */}
            <div className="rounded-2xl bg-[#FFFDF7] border-4 border-[#0D0518] p-5 sm:p-6 shadow-[6px_8px_0px_#0D0518] flex flex-col justify-between relative text-[#0D0518] transition-all hover:-translate-y-1 hover:shadow-[8px_10px_0px_#0D0518]">
              {/* Creator Domain Pill */}
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b-2 border-[#0D0518]">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-[#5C2D91] border-3 border-[#0D0518] shadow-pixel-sm flex items-center justify-center text-2xl text-white shrink-0">
                    👑
                  </div>
                  <div>
                    <span className="font-arcade text-[9px] text-[#5C2D91] block font-black uppercase tracking-wider">
                      FULL-STACK & ARCHITECTURE
                    </span>
                    <h3 className="font-bungee text-2xl sm:text-3xl text-[#0D0518] tracking-wide leading-tight">
                      Waibha
                    </h3>
                  </div>
                </div>

                <a
                  href="https://github.com/Waibha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#200B3B] text-[#FFDE25] border-2 border-[#0D0518] hover:bg-[#FF5FA0] hover:text-white transition-all text-[11px] font-mono font-bold flex items-center gap-1 shrink-0 shadow-pixel-sm"
                  title="View Waibha on GitHub"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>@Waibha</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                </a>
              </div>

              {/* Role Title */}
              <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518] font-arcade text-[10px] font-black uppercase shadow-pixel-sm">
                  Lead Architect & Full-Stack Developer
                </span>
              </div>

              {/* Exact Contribution Description */}
              <p className="font-sans text-xs sm:text-sm text-[#2A1640] leading-relaxed mb-4 font-medium bg-[#FAF7EE] p-3.5 rounded-xl border-2 border-[#0D0518]">
                Engineered the core MADAGASCAR tournament platform, including the arcade leaderboard, Admin Portal, Participant Portal, USN-based authentication, virtual coin system and Supabase integration.
              </p>

              {/* Key Highlights Tags */}
              <div className="space-y-1.5 pt-2 border-t-2 border-[#0D0518]">
                <span className="font-arcade text-[8px] text-gray-500 uppercase font-black block">
                  KEY CONTRIBUTIONS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-[#5C2D91] text-white text-[10px] font-mono font-bold border border-[#0D0518]">
                    Arcade Leaderboard
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#5C2D91] text-white text-[10px] font-mono font-bold border border-[#0D0518]">
                    Admin Portal
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#5C2D91] text-white text-[10px] font-mono font-bold border border-[#0D0518]">
                    Participant Portal
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FFDE25] text-[#0D0518] text-[10px] font-mono font-black border border-[#0D0518]">
                    USN + PIN Auth
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#28C76F] text-[#0D0518] text-[10px] font-mono font-black border border-[#0D0518]">
                    Virtual Coins
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FF5FA0] text-white text-[10px] font-mono font-bold border border-[#0D0518]">
                    Supabase Integration
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* CREATOR 2: hania                                          */}
            {/* ========================================================= */}
            <div className="rounded-2xl bg-[#FFFDF7] border-4 border-[#0D0518] p-5 sm:p-6 shadow-[6px_8px_0px_#0D0518] flex flex-col justify-between relative text-[#0D0518] transition-all hover:-translate-y-1 hover:shadow-[8px_10px_0px_#0D0518]">
              {/* Creator Domain Pill */}
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b-2 border-[#0D0518]">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-[#FF5FA0] border-3 border-[#0D0518] shadow-pixel-sm flex items-center justify-center text-2xl text-white shrink-0">
                    🎯
                  </div>
                  <div>
                    <span className="font-arcade text-[9px] text-[#FF5FA0] block font-black uppercase tracking-wider">
                      GAME DEVELOPMENT
                    </span>
                    <h3 className="font-bungee text-2xl sm:text-3xl text-[#0D0518] tracking-wide leading-tight">
                      hania
                    </h3>
                  </div>
                </div>

                <a
                  href="https://github.com/hania"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#200B3B] text-[#FF5FA0] border-2 border-[#0D0518] hover:bg-[#FF5FA0] hover:text-white transition-all text-[11px] font-mono font-bold flex items-center gap-1 shrink-0 shadow-pixel-sm"
                  title="View hania on GitHub"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>@hania</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                </a>
              </div>

              {/* Role Title */}
              <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FF5FA0] text-white border-2 border-[#0D0518] font-arcade text-[10px] font-black uppercase shadow-pixel-sm">
                  Guess Who? Game Developer
                </span>
              </div>

              {/* Exact Contribution Description */}
              <p className="font-sans text-xs sm:text-sm text-[#2A1640] leading-relaxed mb-4 font-medium bg-[#FAF7EE] p-3.5 rounded-xl border-2 border-[#0D0518]">
                Developed the interactive Guess Who? game, including its puzzle and deduction mechanics, question categories, visual reveal experience and scoring integration.
              </p>

              {/* Key Highlights Tags */}
              <div className="space-y-1.5 pt-2 border-t-2 border-[#0D0518]">
                <span className="font-arcade text-[8px] text-gray-500 uppercase font-black block">
                  KEY CONTRIBUTIONS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-[#FF5FA0] text-white text-[10px] font-mono font-bold border border-[#0D0518]">
                    Guess Who? Game
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FF5FA0] text-white text-[10px] font-mono font-bold border border-[#0D0518]">
                    Puzzle & Deduction
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#5C2D91] text-white text-[10px] font-mono font-bold border border-[#0D0518]">
                    Question Categories
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#00F0FF] text-[#0D0518] text-[10px] font-mono font-black border border-[#0D0518]">
                    Visual Reveal System
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FFDE25] text-[#0D0518] text-[10px] font-mono font-black border border-[#0D0518]">
                    Scoring Integration
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#28C76F] text-[#0D0518] text-[10px] font-mono font-black border border-[#0D0518]">
                    Mystery Decks
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Marquee Bar */}
        <div className="bg-[#120422] border-t-3 border-[#0D0518] px-6 py-3 flex items-center justify-between text-xs font-mono text-purple-200 shrink-0">
          <div className="flex items-center gap-2 text-[10px] font-arcade text-[#FFDE25]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MADAGASCAR 2-PERSON DEV TEAM</span>
          </div>
          <button
            onClick={handleClose}
            className="btn-pixel-yellow text-xs py-1 px-4"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
}
