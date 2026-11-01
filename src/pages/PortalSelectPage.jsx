import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ShieldCheck, ArrowRight, ArrowLeft, Users, Lock, Sparkles, Gamepad2, Cpu } from 'lucide-react';
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
    <div className="relative min-h-screen bg-[#451B75] text-white flex flex-col justify-between select-none overflow-x-hidden font-sans">
      {/* Background Graphic Grid & Layering */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#FFDE25 1px, transparent 1px), linear-gradient(90deg, #FFDE25 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute inset-0 bg-radial-at-c from-purple-700/20 via-transparent to-[#1F0738]/90 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between p-4 sm:p-6">
        <button
          onClick={handleBack}
          className="btn-pixel-white text-[11px] py-1.5 px-3 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO TITLE</span>
        </button>

        <div className="flex items-center gap-2 font-arcade text-[10px] text-[#FFDE25]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C76F] animate-ping" />
          <span>STAGE SELECT</span>
        </div>
      </div>

      {/* Main Choice Stage */}
      <main className="relative z-10 max-w-6xl mx-auto w-full my-auto py-6 px-4">
        <div className="text-center mb-8">
          <span className="px-3.5 py-1.5 rounded-full bg-[#FF5FA0] text-white font-arcade text-[10px] font-black uppercase border-3 border-[#0D0518] shadow-pixel-sm inline-block mb-3">
            SELECT ACCESS LEVEL
          </span>
          <h2 className="font-bungee text-4xl sm:text-6xl text-[#FFDE25] pixel-title-yellow tracking-wide">
            CHOOSE YOUR PORTAL
          </h2>
          <p className="text-purple-200 font-mono text-xs sm:text-sm mt-2 max-w-lg mx-auto">
            Select your destination in the Funtopia arcade universe. Compete on the public stage or operate the backend tournament console.
          </p>
        </div>

        {/* Dual High-Impact Portal Cards with Custom Illustrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* ========================================================= */}
          {/* PARTICIPANT PORTAL                                        */}
          {/* ========================================================= */}
          <div
            onClick={() => handleSelect('/participant')}
            className="group cursor-pointer rounded-3xl bg-[#FAF7EE] text-[#0D0518] border-4 border-[#0D0518] p-6 sm:p-8 shadow-pixel-xl hover:-translate-y-2 hover:shadow-pixel-lg transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Corner Decorative Ribbon */}
            <div className="absolute top-0 right-0 bg-[#28C76F] text-[#0D0518] font-arcade text-[9px] font-black px-4 py-1.5 rounded-bl-2xl border-l-3 border-b-3 border-[#0D0518] shadow-pixel-sm">
              OPEN PUBLIC ARENA
            </div>

            <div>
              {/* Illustrated Header Badge */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  👾
                </div>
                <div>
                  <span className="font-arcade text-[10px] text-[#FF5FA0] font-black block">
                    CHAMPIONSHIP STAGE
                  </span>
                  <h3 className="font-bungee text-2xl sm:text-3xl text-[#0D0518]">
                    PARTICIPANT ARENA
                  </h3>
                </div>
              </div>

              {/* Custom SVG Arcade Screen Illustration */}
              <div className="w-full h-32 rounded-2xl bg-[#5C2D91] border-3 border-[#0D0518] shadow-pixel-sm mb-5 p-3 flex items-center justify-around relative overflow-hidden">
                {/* Background stars */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FFDE25 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                
                {/* Visual sprites representation */}
                <div className="flex items-center justify-center gap-3 z-10">
                  <div className="text-center group-hover:-translate-y-1 transition-transform">
                    <span className="text-3xl block">🤠</span>
                    <span className="text-[8px] font-arcade text-[#FFDE25]">RANGER</span>
                  </div>
                  <div className="text-center -translate-y-2 group-hover:-translate-y-3 transition-transform">
                    <span className="text-4xl block">🏆</span>
                    <span className="text-[8px] font-arcade text-[#28C76F]">PODIUM</span>
                  </div>
                  <div className="text-center group-hover:-translate-y-1 transition-transform">
                    <span className="text-3xl block">🚀</span>
                    <span className="text-[8px] font-arcade text-[#00F0FF]">PILOT</span>
                  </div>
                </div>

                {/* Platform strip inside illustration */}
                <div className="absolute bottom-0 inset-x-0 h-3 pixel-brick-strip" />
              </div>

              <p className="text-gray-700 font-sans text-xs sm:text-sm font-medium mb-5 leading-relaxed">
                Enter the live championship stage! Register your player handle, view verified podium rankings, inspect game budgets, and watch score tickers in real time.
              </p>

              {/* Feature Checklist */}
              <div className="space-y-2 text-xs font-mono font-bold text-[#0D0518] mb-6 bg-[#FFFDF5] p-3.5 rounded-2xl border-2 border-[#0D0518]">
                <div className="flex items-center gap-2">
                  <span className="text-[#28C76F] font-black">✓</span>
                  <span>Individual Player Registration (No Squad Lock)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#28C76F] font-black">✓</span>
                  <span>Live 3-Tiered Podium & Score Breakdown</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#28C76F] font-black">✓</span>
                  <span>Tournament Game Costs & Points Rules</span>
                </div>
              </div>
            </div>

            <button className="btn-pixel-yellow w-full text-center justify-center text-sm py-3.5">
              <span>ENTER PARTICIPANT ARENA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ========================================================= */}
          {/* RESTRICTED ADMIN PORTAL                                   */}
          {/* ========================================================= */}
          <div
            onClick={() => handleSelect('/admin')}
            className="group cursor-pointer rounded-3xl bg-[#230C3B] text-white border-4 border-[#0D0518] shadow-pixel-xl hover:-translate-y-2 hover:shadow-pixel-lg transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Corner Decorative Ribbon */}
            <div className="absolute top-0 right-0 bg-[#FF5FA0] text-white font-arcade text-[9px] font-black px-4 py-1.5 rounded-bl-2xl border-l-3 border-b-3 border-[#0D0518] shadow-pixel-sm">
              RESTRICTED
            </div>

            {/* 90s OS Blue Titlebar Header */}
            <div className="bg-[#000080] text-white font-mono font-black text-xs px-4 py-2 flex items-center justify-between border-b-3 border-[#0D0518] -mt-1 -mx-1">
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#FFDE25]" />
                <span>OPERATOR_TERMINAL.EXE</span>
              </span>
              <span className="text-xs">✕</span>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
              <div>
                {/* Illustrated Header Badge */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF5FA0] border-3 border-[#0D0518] shadow-pixel flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    🔒
                  </div>
                  <div>
                    <span className="font-arcade text-[10px] text-[#FFDE25] font-black block">
                      MASTER OPERATOR
                    </span>
                    <h3 className="font-bungee text-2xl sm:text-3xl text-[#FFDE25]">
                      ADMIN CONSOLE
                    </h3>
                  </div>
                </div>

                {/* Custom SVG Arcade Motherboard / Master Control Illustration */}
                <div className="w-full h-32 rounded-2xl bg-[#11041F] border-3 border-[#0D0518] shadow-pixel-sm mb-5 p-3 flex items-center justify-around relative overflow-hidden">
                  {/* Glowing Circuit Lines */}
                  <div className="flex items-center justify-center gap-6 z-10 font-mono text-xs">
                    <div className="text-center">
                      <Cpu className="w-8 h-8 text-[#00F0FF] mx-auto animate-pulse" />
                      <span className="text-[8px] font-arcade text-[#00F0FF] block mt-1">RLS SECURE</span>
                    </div>
                    <div className="text-center bg-[#200B3B] px-3 py-1.5 rounded-xl border border-[#FFDE25]">
                      <span className="text-sm font-arcade text-[#FFDE25] block">ARE YOU READY ?</span>
                      <span className="text-[8px] font-mono text-purple-300">AUTHORIZED ACCESS</span>
                    </div>
                    <div className="text-center">
                      <ShieldCheck className="w-8 h-8 text-[#28C76F] mx-auto" />
                      <span className="text-[8px] font-arcade text-[#28C76F] block mt-1">VERIFIED</span>
                    </div>
                  </div>
                </div>

                <p className="text-purple-200 font-sans text-xs sm:text-sm font-medium mb-5 leading-relaxed">
                  Restricted to the Owner and authorized tournament operators. Dispatch individual points, configure game budgets, manage active events, and audit logs.
                </p>

                {/* Feature Checklist */}
                <div className="space-y-2 text-xs font-mono font-bold text-purple-100 mb-6 bg-[#160626] p-3.5 rounded-2xl border-2 border-[#0D0518]">
                  <div className="flex items-center gap-2 text-[#FFDE25]">
                    <span>🔒</span>
                    <span>Direct Score Awarding & 1-Click Rollback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00F0FF]">✦</span>
                    <span>Game Budget / Cost Configuration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00F0FF]">✦</span>
                    <span>Simple Event Name & Description Management</span>
                  </div>
                </div>
              </div>

              <button className="btn-pixel-pink w-full text-center justify-center text-sm py-3.5">
                <span>ENTER ADMIN CONSOLE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Platform */}
      <footer className="relative z-10 w-full mt-6">
        <div className="pixel-grass-strip h-3 w-full" />
        <div className="pixel-brick-strip py-3.5 px-6 text-center text-xs font-arcade text-[#FFDE25]">
          FUNTOPIA CHAMPIONSHIP CIRCUIT • CHOOSE STAGE
        </div>
      </footer>
    </div>
  );
}
