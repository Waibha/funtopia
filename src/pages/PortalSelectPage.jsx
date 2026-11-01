import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ShieldCheck, ArrowRight, ArrowLeft, Users, Lock } from 'lucide-react';
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
    <div className="relative min-h-screen bg-[#150A26] text-white flex flex-col justify-between p-4 sm:p-8 select-none">
      {/* Background Graphic Grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#F5EE00 1px, transparent 1px), linear-gradient(90deg, #F5EE00 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#26123D] border-2 border-black text-xs font-mono font-bold text-purple-200 hover:bg-pop-purple hover:text-white shadow-pop-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO TITLE</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-pop-yellow font-bold">
          <span className="w-2 h-2 rounded-full bg-pop-green animate-ping" />
          <span>SELECT ACCESS LEVEL</span>
        </div>
      </div>

      {/* Main Choice Stage */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto py-8">
        <div className="text-center mb-10">
          <span className="px-3 py-1 rounded-full bg-pop-purple text-white font-arcade text-[10px] font-black uppercase border-2 border-black shadow-pop-sm inline-block mb-3">
            STAGE SELECT
          </span>
          <h2 className="font-bungee text-3xl sm:text-5xl text-pop-yellow tracking-wide drop-shadow-[2px_2px_0px_#180A28]">
            CHOOSE YOUR PORTAL
          </h2>
          <p className="text-purple-200 font-sans text-sm sm:text-base mt-2 max-w-md mx-auto">
            Select your destination in the Funtopia championship universe.
          </p>
        </div>

        {/* Dual Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* ========================================================= */}
          {/* PARTICIPANT PORTAL                                        */}
          {/* ========================================================= */}
          <div
            onClick={() => handleSelect('/participant')}
            className="group cursor-pointer rounded-3xl bg-[#FAF7EE] text-[#180A28] border-4 border-black p-8 shadow-pop-lg hover:-translate-y-2 hover:shadow-pop-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-full bg-pop-green text-[#180A28] font-arcade text-[9px] font-black uppercase border-2 border-black">
                  OPEN PUBLIC ACCESS
                </span>
                <span className="w-10 h-10 rounded-xl bg-pop-yellow border-2 border-black shadow-pop-sm flex items-center justify-center text-xl">
                  👾
                </span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-pop-coral border-3 border-black shadow-pop flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-pop-yellow fill-pop-yellow" />
              </div>

              <h3 className="font-bungee text-2xl sm:text-3xl text-pop-ink mb-2">
                PARTICIPANT PORTAL
              </h3>

              <p className="text-pop-muted font-sans text-sm font-medium mb-6">
                Join the championship circuit! Register your player profile, view tournament standings, check game schedules, and track live scores in real time.
              </p>

              <div className="space-y-2 text-xs font-mono font-bold text-pop-ink mb-8 bg-pop-butter p-4 rounded-2xl border-2 border-pop-ink">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Player & Crew Registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Live Championship Leaderboard & Podium</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Game Rules & Point Schedules</span>
                </div>
              </div>
            </div>

            <button className="w-full py-4 rounded-2xl bg-pop-coral text-white font-display font-black text-sm uppercase tracking-wider border-3 border-black shadow-pop group-hover:bg-pop-yellow group-hover:text-pop-ink transition-colors flex items-center justify-center gap-2">
              <span>ENTER AS PARTICIPANT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ========================================================= */}
          {/* RESTRICTED ADMIN PORTAL                                   */}
          {/* ========================================================= */}
          <div
            onClick={() => handleSelect('/admin')}
            className="group cursor-pointer rounded-3xl bg-[#26123D] text-white border-4 border-black p-8 shadow-pop-lg hover:-translate-y-2 hover:shadow-pop-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-full bg-pop-coral text-white font-arcade text-[9px] font-black uppercase border-2 border-black">
                  RESTRICTED / AUTHORIZED
                </span>
                <span className="w-10 h-10 rounded-xl bg-pop-purple border-2 border-black shadow-pop-sm flex items-center justify-center text-xl">
                  🔒
                </span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-pop-yellow border-3 border-black shadow-pop flex items-center justify-center text-pop-ink mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8 text-pop-ink" />
              </div>

              <h3 className="font-bungee text-2xl sm:text-3xl text-pop-yellow mb-2">
                ADMIN PORTAL
              </h3>

              <p className="text-purple-200 font-sans text-sm font-medium mb-6">
                Owner & tournament administrator operating console. Requires Supabase authentication and verified server-side invitation clearance.
              </p>

              <div className="space-y-2 text-xs font-mono font-bold text-purple-200 mb-8 bg-[#180A28] p-4 rounded-2xl border-2 border-pop-ink">
                <div className="flex items-center gap-2 text-pop-yellow">
                  <span>🔒</span>
                  <span>Invitation Hash / Server-Side RLS Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✦</span>
                  <span>Event, Crew & Game Catalog Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✦</span>
                  <span>Live Point Dispatch & Score Transaction Ledger</span>
                </div>
              </div>
            </div>

            <button className="w-full py-4 rounded-2xl bg-pop-yellow text-pop-ink font-display font-black text-sm uppercase tracking-wider border-3 border-black shadow-pop group-hover:bg-pop-purple group-hover:text-white transition-colors flex items-center justify-center gap-2">
              <span>ACCESS ADMIN STATION</span>
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full text-center text-xs font-mono text-purple-400">
        FUNTOPIA GAMING CIRCUIT • PROTECTED BY SUPABASE ROW LEVEL SECURITY
      </footer>
    </div>
  );
}
