import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ShieldCheck, ArrowRight, ArrowLeft, Users, Lock, Sparkles } from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function PortalSelectPage() {
  const navigate = useNavigate();

  const handleSelect = (destination) => {
    soundFx.play('coin');
    navigate(destination);
  };

  const handleBack = () => {
    soundFx.play('switch');
    navigate('/');
  };

  return (
    <div className="relative min-h-screen bg-[#5C2D91] text-white flex flex-col justify-between select-none overflow-x-hidden">
      {/* Background Graphic Grid */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#FFDE25 1px, transparent 1px), linear-gradient(90deg, #FFDE25 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between p-4 sm:p-6">
        <button
          onClick={handleBack}
          className="btn-pixel-white text-[11px] py-1.5 px-3 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>TITLE</span>
        </button>

        <div className="flex items-center gap-2 font-arcade text-[10px] text-[#FFDE25]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C76F] animate-ping" />
          <span>STAGE SELECT</span>
        </div>
      </div>

      {/* Main Choice Stage */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto py-6 px-4">
        <div className="text-center mb-8">
          <span className="px-3 py-1 rounded-full bg-[#FF5FA0] text-white font-arcade text-[10px] font-black uppercase border-3 border-[#0D0518] shadow-pixel-sm inline-block mb-3">
            SELECT ACCESS LEVEL
          </span>
          <h2 className="font-bungee text-4xl sm:text-6xl text-[#FFDE25] pixel-title-yellow tracking-wide">
            CHOOSE YOUR PORTAL
          </h2>
          <p className="text-purple-200 font-mono text-xs sm:text-sm mt-2 max-w-md mx-auto">
            Choose whether to join the tournament as an individual participant or operate as tournament admin.
          </p>
        </div>

        {/* Dual Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* ========================================================= */}
          {/* PARTICIPANT PORTAL (Character Card Style - Screen 5)       */}
          {/* ========================================================= */}
          <div
            onClick={() => handleSelect('/participant')}
            className="group cursor-pointer rounded-3xl bg-white text-[#0D0518] border-4 border-[#0D0518] p-6 sm:p-8 shadow-pixel-lg hover:-translate-y-2 hover:shadow-pixel-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-[#28C76F] text-[#0D0518] font-arcade text-[9px] font-black uppercase border-2 border-[#0D0518]">
                  OPEN PUBLIC ARENA
                </span>
                <span className="w-10 h-10 rounded-xl bg-[#FFDE25] border-2 border-[#0D0518] shadow-pixel-sm flex items-center justify-center text-xl">
                  👾
                </span>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-[#FF5FA0] border-3 border-[#0D0518] shadow-pixel flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-[#FFDE25] fill-[#FFDE25]" />
              </div>

              <h3 className="font-bungee text-2xl sm:text-3xl text-[#0D0518] mb-2">
                PARTICIPANT PORTAL
              </h3>

              <p className="text-[#6B5E78] font-sans text-xs sm:text-sm font-medium mb-5">
                Register your individual player handle, view verified podium standings, track active games, and earn points.
              </p>

              {/* Character Sprites Preview (Direct tribute to screen 5: Choose your character) */}
              <div className="bg-[#FFFDF5] p-3 rounded-2xl border-2 border-[#0D0518] mb-6">
                <span className="font-arcade text-[9px] text-[#6B5E78] uppercase block mb-2 font-black">
                  AVAILABLE SPRITES
                </span>
                <div className="flex items-center justify-around text-2xl">
                  <span>👾</span>
                  <span>🚀</span>
                  <span>⚡</span>
                  <span>⭐</span>
                  <span>🔥</span>
                  <span>🎯</span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono font-bold text-[#0D0518] mb-6 bg-[#FAF7EE] p-3.5 rounded-2xl border-2 border-[#0D0518]">
                <div className="flex items-center gap-2">
                  <span className="text-[#28C76F]">✓</span>
                  <span>Individual Registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#28C76F]">✓</span>
                  <span>Podium Standings & Leaderboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#28C76F]">✓</span>
                  <span>Game Costs & Point Values</span>
                </div>
              </div>
            </div>

            <button className="btn-pixel-yellow w-full text-center justify-center">
              <span>ENTER AS PARTICIPANT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ========================================================= */}
          {/* RESTRICTED ADMIN PORTAL (Classic 90s OS Window - Screen 2) */}
          {/* ========================================================= */}
          <div
            onClick={() => handleSelect('/admin')}
            className="group cursor-pointer rounded-3xl bg-[#D1D5DB] text-[#0D0518] border-4 border-[#0D0518] shadow-pixel-lg hover:-translate-y-2 hover:shadow-pixel-xl transition-all duration-200 flex flex-col justify-between overflow-hidden"
          >
            {/* Classic 90s Titlebar matching Screen 2 */}
            <div className="bg-[#000080] text-white font-mono font-black text-xs px-4 py-2 flex items-center justify-between border-b-3 border-[#0D0518]">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>ADMIN_GATEWAY.EXE</span>
              </span>
              <span className="text-xs">✕</span>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#FF5FA0] text-white font-arcade text-[9px] font-black uppercase border-2 border-[#0D0518]">
                    RESTRICTED
                  </span>
                  <span className="w-10 h-10 rounded-xl bg-[#40186D] border-2 border-[#0D0518] shadow-pixel-sm flex items-center justify-center text-xl text-[#FFDE25]">
                    🔒
                  </span>
                </div>

                {/* "ARE YOU READY?" dialogue box recreation */}
                <div className="bg-white border-3 border-[#0D0518] p-4 text-center rounded-xl mb-4 shadow-pixel-sm">
                  <span className="font-arcade text-xs text-[#0D0518] block font-black mb-1">
                    ARE YOU READY ?
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 font-bold">
                    AUTHORIZED OPERATORS ONLY
                  </span>
                </div>

                <h3 className="font-bungee text-2xl sm:text-3xl text-[#0D0518] mb-2">
                  ADMIN CONSOLE
                </h3>

                <p className="text-gray-700 font-sans text-xs sm:text-sm font-medium mb-5">
                  Restricted to the Owner and authorized tournament operators. Requires verified authentication.
                </p>

                <div className="space-y-2 text-xs font-mono font-bold text-[#0D0518] mb-6 bg-white p-3.5 rounded-2xl border-2 border-[#0D0518]">
                  <div className="flex items-center gap-2 text-[#000080]">
                    <span>🔒</span>
                    <span>Protected Operator Console</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✦</span>
                    <span>Event & Game Budget Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✦</span>
                    <span>Direct Score Dispatch & Reversals</span>
                  </div>
                </div>
              </div>

              <button className="btn-pixel-pink w-full text-center justify-center">
                <span>ENTER ADMIN CONSOLE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Brick Platform */}
      <footer className="relative z-10 w-full mt-6">
        <div className="pixel-grass-strip h-3 w-full" />
        <div className="pixel-brick-strip py-3 px-6 text-center text-xs font-arcade text-[#FFDE25]">
          FUNTOPIA CHAMPIONSHIP CIRCUIT
        </div>
      </footer>
    </div>
  );
}
