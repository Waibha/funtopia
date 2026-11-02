import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ShieldCheck, ArrowRight, ArrowLeft, Users, Lock, Sparkles, Gamepad2, Coins, Calendar, UserPlus } from 'lucide-react';
import { soundFx } from '../utilities/soundFx';
import AuthArcadeBackground from '../components/backgrounds/AuthArcadeBackground';
import MeetCreatorsModal from '../components/creators/MeetCreatorsModal';

export default function PortalSelectPage() {
  const navigate = useNavigate();
  const [isCreatorsModalOpen, setIsCreatorsModalOpen] = useState(false);

  const handleSelect = (destination) => {
    soundFx.play('coin');
    navigate(destination);
  };

  const handleBack = () => {
    soundFx.play('switch');
    navigate('/');
  };

  return (
    <div className="relative min-h-screen bg-[#451B75] text-white flex flex-col justify-between select-none overflow-x-hidden font-sans arcade-page-transition">
      {/* Background Animated Arcade Elements */}
      <AuthArcadeBackground />

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
          className="btn-pixel-white text-[11px] py-1.5 px-3.5 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO TITLE</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreatorsModalOpen(true)}
            className="btn-pixel-white text-[10px] py-1.5 px-3 flex items-center gap-1.5 font-mono font-bold"
            title="Meet the Creators"
          >
            <Trophy className="w-3.5 h-3.5 text-[#FF5FA0]" />
            <span className="hidden sm:inline">CREATORS</span>
          </button>

          <div className="flex items-center gap-2 font-arcade text-[10px] text-[#FFDE25]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C76F] animate-ping" />
            <span>STAGE SELECT</span>
          </div>
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
            Select your destination in the MADAGASCAR universe. Enter as a competitor or manage the tournament as an administrator.
          </p>
        </div>

        {/* Dual High-Impact Portal Choices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* ========================================================= */}
          {/* PORTAL CHOICE 1: PARTICIPANT PORTAL                       */}
          {/* ========================================================= */}
          <div
            onClick={() => handleSelect('/participant')}
            className="group cursor-pointer rounded-3xl bg-[#FAF7EE] text-[#0D0518] border-4 border-[#0D0518] p-6 sm:p-8 shadow-pixel-xl hover:-translate-y-2.5 hover:shadow-[8px_12px_0px_#0D0518] hover:border-[#FFDE25] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Corner Badge */}
            <div className="absolute top-0 right-0 bg-[#28C76F] text-[#0D0518] font-arcade text-[9px] font-black px-4 py-1.5 rounded-bl-2xl border-l-3 border-b-3 border-[#0D0518] shadow-pixel-sm group-hover:bg-[#FFDE25] transition-colors">
              PUBLIC ACCESS
            </div>

            <div>
              {/* Header Title with Avatar */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  👾
                </div>
                <div>
                  <span className="font-arcade text-[10px] text-[#FF5FA0] font-black block">
                    FOR COMPETITORS & PLAYERS
                  </span>
                  <h3 className="font-bungee text-2xl sm:text-3xl text-[#0D0518]">
                    PARTICIPANT PORTAL
                  </h3>
                </div>
              </div>

              {/* Graphic Scene Box */}
              <div className="w-full h-32 rounded-2xl bg-[#5C2D91] border-3 border-[#0D0518] shadow-pixel-sm mb-5 p-3 flex items-center justify-around relative overflow-hidden group-hover:border-[#FFDE25] transition-colors">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FFDE25 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                
                <div className="flex items-center justify-center gap-4 z-10">
                  <div className="text-center group-hover:-translate-y-2 transition-transform duration-200">
                    <span className="text-3xl block filter drop-shadow">🤠</span>
                    <span className="text-[8px] font-arcade text-[#FFDE25]">PROFILE</span>
                  </div>
                  <div className="text-center -translate-y-2 group-hover:-translate-y-4 transition-transform duration-200">
                    <span className="text-4xl block filter drop-shadow animate-bounce-subtle">🏆</span>
                    <span className="text-[8px] font-arcade text-[#28C76F]">LEADERBOARD</span>
                  </div>
                  <div className="text-center group-hover:-translate-y-2 transition-transform duration-200">
                    <span className="text-3xl block filter drop-shadow">🚀</span>
                    <span className="text-[8px] font-arcade text-[#00F0FF]">SCORES</span>
                  </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 h-3 pixel-brick-strip" />
              </div>

              <p className="text-gray-700 font-sans text-xs sm:text-sm font-medium mb-5 leading-relaxed">
                Join the championship circuit as an individual competitor. View live podium standings, inspect game costs/rules, and register your player handle.
              </p>

              {/* Functional Highlights */}
              <div className="space-y-2 text-xs font-mono font-bold text-[#0D0518] mb-6 bg-[#FFFDF5] p-4 rounded-2xl border-2 border-[#0D0518]">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#28C76F] shrink-0" />
                  <span>Competitor profile & virtual coin wallet</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#FFDE25] shrink-0" />
                  <span>View live individual leaderboard & podium</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-[#FF5FA0] shrink-0" />
                  <span>View games, point values & game budgets</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  <span>Track individual scores & game breakdown</span>
                </div>
              </div>
            </div>

            <button className="btn-pixel-yellow w-full text-center justify-center text-sm py-4">
              <span>ENTER PARTICIPANT PORTAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ========================================================= */}
          {/* PORTAL CHOICE 2: ADMIN PORTAL                             */}
          {/* ========================================================= */}
          <div
            onClick={() => handleSelect('/admin')}
            className="group cursor-pointer rounded-3xl bg-[#230C3B] text-white border-4 border-[#0D0518] shadow-pixel-xl hover:-translate-y-2.5 hover:shadow-[8px_12px_0px_#0D0518] hover:border-[#FF5FA0] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Corner Badge */}
            <div className="absolute top-0 right-0 bg-[#FF5FA0] text-white font-arcade text-[9px] font-black px-4 py-1.5 rounded-bl-2xl border-l-3 border-b-3 border-[#0D0518] shadow-pixel-sm group-hover:bg-[#FFDE25] group-hover:text-[#0D0518] transition-colors">
              RESTRICTED
            </div>

            {/* 90s OS Blue Titlebar Header */}
            <div className="bg-[#000080] text-white font-mono font-black text-xs px-4 py-2 flex items-center justify-between border-b-3 border-[#0D0518] -mt-1 -mx-1 group-hover:bg-[#1A1A9E] transition-colors">
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#FFDE25] group-hover:rotate-12 transition-transform" />
                <span>ADMIN_OPERATOR.EXE</span>
              </span>
              <span className="text-xs">✕</span>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
              <div>
                {/* Header Title with Lock */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF5FA0] border-3 border-[#0D0518] shadow-pixel flex items-center justify-center text-3xl group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                    🔒
                  </div>
                  <div>
                    <span className="font-arcade text-[10px] text-[#FFDE25] font-black block">
                      FOR ORGANISERS & ADMINISTRATORS
                    </span>
                    <h3 className="font-bungee text-2xl sm:text-3xl text-[#FFDE25]">
                      ADMIN PORTAL
                    </h3>
                  </div>
                </div>

                {/* Graphic Scene Box */}
                <div className="w-full h-32 rounded-2xl bg-[#11041F] border-3 border-[#0D0518] shadow-pixel-sm mb-5 p-3 flex items-center justify-around relative overflow-hidden group-hover:border-[#FF5FA0] transition-colors">
                  <div className="flex items-center justify-center gap-6 z-10 font-mono text-xs">
                    <div className="text-center group-hover:-translate-y-1.5 transition-transform duration-200">
                      <span className="text-3xl block filter drop-shadow">⚙️</span>
                      <span className="text-[8px] font-arcade text-[#00F0FF] block mt-1">CONFIG</span>
                    </div>
                    <div className="text-center bg-[#200B3B] px-3 py-1.5 rounded-xl border border-[#FFDE25] group-hover:border-[#00F0FF] transition-colors">
                      <span className="text-xs font-arcade text-[#FFDE25] block">OPERATOR ACCESS</span>
                      <span className="text-[8px] font-mono text-purple-300">AUTHORIZED MARSHALS</span>
                    </div>
                    <div className="text-center group-hover:-translate-y-1.5 transition-transform duration-200">
                      <ShieldCheck className="w-8 h-8 text-[#28C76F] mx-auto filter drop-shadow" />
                      <span className="text-[8px] font-arcade text-[#28C76F] block mt-1">SECURE</span>
                    </div>
                  </div>
                </div>

                <p className="text-purple-200 font-sans text-xs sm:text-sm font-medium mb-5 leading-relaxed">
                  Restricted to event organisers and authorized administrators. Full operational control over games, participants, and scoring transactions.
                </p>

                {/* Functional Highlights */}
                <div className="space-y-2 text-xs font-mono font-bold text-purple-100 mb-6 bg-[#160626] p-4 rounded-2xl border-2 border-[#0D0518]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#FFDE25] shrink-0" />
                    <span>Manage games, coin entry costs & active status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
                    <span>Manage games (costs/budgets, points & active status)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#28C76F] shrink-0" />
                    <span>Manage registered participant roster</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-[#FF5FA0] shrink-0" />
                    <span>Award/deduct individual scores & 1-click rollback</span>
                  </div>
                </div>
              </div>

              <button className="btn-pixel-pink w-full text-center justify-center text-sm py-4">
                <span>ACCESS ADMIN PORTAL</span>
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
          MADAGASCAR CHAMPIONSHIP CIRCUIT • TWO DISTINCT EXPERIENCES
        </div>
      </footer>

      {/* Meet the Creators Modal */}
      <MeetCreatorsModal
        isOpen={isCreatorsModalOpen}
        onClose={() => setIsCreatorsModalOpen(false)}
      />
    </div>
  );
}
