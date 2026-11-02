import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Sparkles, ExternalLink, Gamepad2 } from 'lucide-react';
import { soundFx } from '../utilities/soundFx';
import AuthArcadeBackground from '../components/backgrounds/AuthArcadeBackground';

function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function MeetCreatorsPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    soundFx.play('switch');
    navigate(-1);
  };

  return (
    <div className="relative min-h-screen bg-[#35105E] text-white flex flex-col justify-between select-none overflow-x-hidden font-sans arcade-page-transition">
      {/* Background Animated Arcade Elements */}
      <AuthArcadeBackground />

      {/* Decorative Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#FFDE25 1px, transparent 1px), linear-gradient(90deg, #FFDE25 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute inset-0 bg-radial-at-c from-purple-700/20 via-transparent to-[#1F0738]/90 pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between p-4 sm:p-6">
        <button
          onClick={handleBack}
          className="btn-pixel-white text-[11px] py-1.5 px-3.5 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK</span>
        </button>

        <div className="flex items-center gap-2 font-arcade text-[10px] text-[#FFDE25]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C76F] animate-ping" />
          <span>TOURNAMENT CREDITS</span>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto py-8 px-4 sm:px-6">
        {/* Title Block */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5FA0] text-white font-arcade text-[10px] font-black uppercase border-3 border-[#0D0518] shadow-pixel-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FFDE25]" />
            <span>DEVELOPMENT TEAM</span>
          </div>
          <h1 className="font-bungee text-4xl sm:text-6xl text-[#FFDE25] pixel-title-yellow tracking-wide">
            MEET THE CREATORS
          </h1>
          <p className="text-purple-200 font-mono text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            The two contributors who built the <strong className="text-[#FFDE25]">MADAGASCAR</strong> indie arcade championship platform.
          </p>
        </div>

        {/* Dual Creator Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* ========================================================= */}
          {/* CREATOR 1: Waibha                                         */}
          {/* ========================================================= */}
          <div className="rounded-3xl bg-[#FAF7EE] text-[#0D0518] border-4 border-[#0D0518] p-6 sm:p-8 shadow-pixel-xl flex flex-col justify-between relative hover:-translate-y-2 hover:shadow-[8px_12px_0px_#0D0518] transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-5 pb-4 border-b-3 border-[#0D0518]">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#5C2D91] border-3 border-[#0D0518] shadow-pixel flex items-center justify-center text-3xl text-white shrink-0">
                    👑
                  </div>
                  <div>
                    <span className="font-arcade text-[10px] text-[#5C2D91] font-black block uppercase tracking-wider">
                      FULL-STACK ARCHITECT
                    </span>
                    <h2 className="font-bungee text-3xl sm:text-4xl text-[#0D0518]">
                      Waibha
                    </h2>
                  </div>
                </div>

                <a
                  href="https://github.com/Waibha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#200B3B] text-[#FFDE25] border-2 border-[#0D0518] hover:bg-[#FF5FA0] hover:text-white transition-all text-xs font-mono font-bold flex items-center gap-1.5 shadow-pixel-sm shrink-0"
                  title="View Waibha on GitHub"
                >
                  <Github className="w-4 h-4" />
                  <span>@Waibha</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>

              <div className="mb-4">
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518] font-arcade text-[11px] font-black uppercase shadow-pixel-sm">
                  Lead Architect & Full-Stack Developer
                </span>
              </div>

              <p className="font-sans text-xs sm:text-sm text-[#2A1640] leading-relaxed mb-6 font-medium bg-[#FFFDF7] p-4 rounded-2xl border-2 border-[#0D0518]">
                Engineered the core MADAGASCAR tournament platform, including the arcade leaderboard, Admin Portal, Participant Portal, USN-based authentication, virtual coin system and Supabase integration.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t-2 border-[#0D0518]">
              <span className="font-arcade text-[9px] text-gray-500 uppercase font-black block">
                CORE CONTRIBUTIONS
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#5C2D91] text-white text-xs font-mono font-bold border border-[#0D0518]">
                  Arcade Leaderboard
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#5C2D91] text-white text-xs font-mono font-bold border border-[#0D0518]">
                  Admin Mission Control
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#5C2D91] text-white text-xs font-mono font-bold border border-[#0D0518]">
                  Participant Portal
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#FFDE25] text-[#0D0518] text-xs font-mono font-black border border-[#0D0518]">
                  USN + PIN Auth
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#28C76F] text-[#0D0518] text-xs font-mono font-black border border-[#0D0518]">
                  Virtual Coins
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#FF5FA0] text-white text-xs font-mono font-bold border border-[#0D0518]">
                  Supabase Integration
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CREATOR 2: hania                                          */}
          {/* ========================================================= */}
          <div className="rounded-3xl bg-[#FAF7EE] text-[#0D0518] border-4 border-[#0D0518] p-6 sm:p-8 shadow-pixel-xl flex flex-col justify-between relative hover:-translate-y-2 hover:shadow-[8px_12px_0px_#0D0518] transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-5 pb-4 border-b-3 border-[#0D0518]">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#FF5FA0] border-3 border-[#0D0518] shadow-pixel flex items-center justify-center text-3xl text-white shrink-0">
                    🎯
                  </div>
                  <div>
                    <span className="font-arcade text-[10px] text-[#FF5FA0] font-black block uppercase tracking-wider">
                      GAME DEVELOPER
                    </span>
                    <h2 className="font-bungee text-3xl sm:text-4xl text-[#0D0518]">
                      hania
                    </h2>
                  </div>
                </div>

                <a
                  href="https://github.com/hania"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#200B3B] text-[#FF5FA0] border-2 border-[#0D0518] hover:bg-[#FF5FA0] hover:text-white transition-all text-xs font-mono font-bold flex items-center gap-1.5 shadow-pixel-sm shrink-0"
                  title="View hania on GitHub"
                >
                  <Github className="w-4 h-4" />
                  <span>@hania</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>

              <div className="mb-4">
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#FF5FA0] text-white border-2 border-[#0D0518] font-arcade text-[11px] font-black uppercase shadow-pixel-sm">
                  Guess Who? Game Developer
                </span>
              </div>

              <p className="font-sans text-xs sm:text-sm text-[#2A1640] leading-relaxed mb-6 font-medium bg-[#FFFDF7] p-4 rounded-2xl border-2 border-[#0D0518]">
                Developed the interactive Guess Who? game, including its puzzle and deduction mechanics, question categories, visual reveal experience and scoring integration.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t-2 border-[#0D0518]">
              <span className="font-arcade text-[9px] text-gray-500 uppercase font-black block">
                CORE CONTRIBUTIONS
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#FF5FA0] text-white text-xs font-mono font-bold border border-[#0D0518]">
                  Guess Who? Game
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#FF5FA0] text-white text-xs font-mono font-bold border border-[#0D0518]">
                  Puzzle & Deduction
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#5C2D91] text-white text-xs font-mono font-bold border border-[#0D0518]">
                  Question Categories
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#00F0FF] text-[#0D0518] text-xs font-mono font-black border border-[#0D0518]">
                  Visual Reveal System
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#FFDE25] text-[#0D0518] text-xs font-mono font-black border border-[#0D0518]">
                  Scoring Integration
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#28C76F] text-[#0D0518] text-xs font-mono font-black border border-[#0D0518]">
                  Mystery Decks
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Baseline */}
      <footer className="relative z-10 w-full mt-8">
        <div className="pixel-grass-strip h-3 w-full" />
        <div className="pixel-brick-strip py-3.5 px-6 text-center text-xs font-arcade text-[#FFDE25]">
          MADAGASCAR INDIE ARCADE • MEET THE CREATORS
        </div>
      </footer>
    </div>
  );
}
