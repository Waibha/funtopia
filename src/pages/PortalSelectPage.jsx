import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ShieldCheck, ArrowRight, ArrowLeft, Users, Lock, Sparkles, Gamepad2, Coins, Compass, KeyRound, Scroll } from 'lucide-react';
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
    <div className="relative min-h-screen bg-[#0A091A] text-slate-100 flex flex-col justify-between select-none overflow-x-hidden font-sans">
      {/* ========================================================================= */}
      {/* AMBIENT FANTASY REALM BACKDROP                                            */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060414] via-[#0E0A24] to-[#120D2E]" />
        {/* Shimmering celestial aurora */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#10B981]/15 via-[#00F0FF]/10 to-transparent blur-3xl animate-shimmer-aurora" />
        {/* Star motes */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(1.5px 1.5px at 50px 70px, #FFE484, rgba(0,0,0,0)),
                              radial-gradient(1px 1px at 180px 150px, #A5F3FC, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 320px 90px, #FFFFFF, rgba(0,0,0,0)),
                              radial-gradient(1px 1px at 560px 220px, #FDE68A, rgba(0,0,0,0))`,
            backgroundSize: '280px 280px',
          }}
        />
        {/* Bottom ambient glow */}
        <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-[#0A091A] to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* TOP HEADER: REALM BREADCRUMB                                              */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between p-4 sm:p-6">
        <button
          onClick={handleBack}
          className="btn-fantasy-subtle text-xs py-2 px-3.5 flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#FFC837]" />
          <span>RETURN TO KINGDOM</span>
        </button>

        <div className="flex items-center gap-2 font-cinzel text-xs text-[#FFC837] font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
          <span>REALM GATEWAYS • TWO DESTINATIONS</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN DESTINATIONS SELECTION STAGE                                         */}
      {/* ========================================================================= */}
      <main className="relative z-10 max-w-6xl mx-auto w-full my-auto py-6 px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#161233]/90 border border-[#FFC837]/40 shadow-fantasy-gold text-[#FFC837] font-cinzel text-[11px] font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-[#FFC837]" />
            <span>CHOOSE YOUR DESTINATION IN MADAGASCAR</span>
            <Sparkles className="w-3 h-3 text-[#00F0FF]" />
          </div>

          <h2 className="text-4xl sm:text-6xl fantasy-title-gold tracking-wide">
            THE REALM GATEWAYS
          </h2>
          <p className="text-slate-300 font-jakarta text-xs sm:text-sm mt-2 max-w-lg mx-auto font-normal leading-relaxed">
            Choose your sanctuary in the Kingdom of MADAGASCAR. Embark as an adventurer on quest trials or enter the High Citadel as an authorized royal marshal.
          </p>
        </div>

        {/* Dual Fantasy Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          {/* ========================================================= */}
          {/* DESTINATION 1: THE ADVENTURERS' GUILD (PARTICIPANT)       */}
          {/* ========================================================= */}
          <div
            onClick={() => handleSelect('/participant')}
            className="group cursor-pointer fantasy-card fantasy-card-grove fantasy-card-hover p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Corner Pill */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-[#10B981] to-[#059669] text-white font-cinzel text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl border-l border-b border-[#34D399]/40 shadow-sm">
              PUBLIC ACCESS
            </div>

            <div>
              {/* Header Title with Avatar */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#064E3B] to-[#10B981] border-2 border-[#34D399] shadow-fantasy-emerald flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  🛡️
                </div>
                <div>
                  <span className="font-cinzel text-xs text-[#34D399] font-bold tracking-widest block uppercase">
                    FOR COMPETITORS & ADVENTURERS
                  </span>
                  <h3 className="font-cinzel font-black text-2xl sm:text-3xl text-white">
                    PARTICIPANT GUILD
                  </h3>
                </div>
              </div>

              {/* Graphic Scene Box */}
              <div className="w-full h-32 rounded-2xl bg-[#091F18]/90 border border-[#10B981]/40 shadow-inner mb-5 p-3 flex items-center justify-around relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(#34D399 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}
                />

                <div className="flex items-center justify-center gap-6 z-10">
                  <div className="text-center group-hover:-translate-y-1 transition-transform">
                    <span className="text-3xl block filter drop-shadow">🤠</span>
                    <span className="text-[9px] font-cinzel text-[#FFC837] font-bold mt-1 block">HERO ID</span>
                  </div>
                  <div className="text-center -translate-y-2 group-hover:-translate-y-3 transition-transform">
                    <span className="text-4xl block filter drop-shadow">🏆</span>
                    <span className="text-[9px] font-cinzel text-[#34D399] font-bold mt-1 block">STANDINGS</span>
                  </div>
                  <div className="text-center group-hover:-translate-y-1 transition-transform">
                    <span className="text-3xl block filter drop-shadow">🪙</span>
                    <span className="text-[9px] font-cinzel text-[#00F0FF] font-bold mt-1 block">GOLD</span>
                  </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#10B981] to-transparent shadow-fantasy-emerald" />
              </div>

              <p className="text-slate-300 font-jakarta text-xs sm:text-sm font-medium mb-5 leading-relaxed">
                Join the Kingdom circuit as an individual adventurer. Check live leaderboard standings, inspect quest trial rules, and register your hero handle.
              </p>

              {/* Functional Highlights */}
              <div className="space-y-2.5 text-xs font-jakarta font-medium text-slate-200 mb-6 bg-[#081913]/90 p-4 rounded-2xl border border-[#10B981]/25">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#34D399] shrink-0" />
                  <span>Register or access adventurer profile with USN & PIN</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-4 h-4 text-[#FFC837] shrink-0" />
                  <span>Inspect live kingdom podium & verified standings</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Gamepad2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  <span>Browse trials, point values & coin requirements</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Coins className="w-4 h-4 text-[#FFC837] shrink-0" />
                  <span>Spend virtual gold tokens to join active trials</span>
                </div>
              </div>
            </div>

            <button className="btn-fantasy-emerald w-full justify-center text-sm py-4">
              <span>ENTER PARTICIPANT PORTAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ========================================================= */}
          {/* DESTINATION 2: THE HIGH CITADEL (ADMIN)                   */}
          {/* ========================================================= */}
          <div
            onClick={() => handleSelect('/admin')}
            className="group cursor-pointer fantasy-card fantasy-card-citadel fantasy-card-hover p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Corner Pill */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-[#00F0FF] to-[#0284C7] text-[#0A091A] font-cinzel text-[10px] font-black px-4 py-1.5 rounded-bl-2xl border-l border-b border-[#A5F3FC]/50 shadow-sm">
              RESTRICTED CITADEL
            </div>

            <div>
              {/* Header Title with Lock */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0A1E3F] to-[#1E3A8A] border-2 border-[#00F0FF] shadow-fantasy-cyan flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  🏰
                </div>
                <div>
                  <span className="font-cinzel text-xs text-[#00F0FF] font-bold tracking-widest block uppercase">
                    FOR MARSHALS & ADMINISTRATORS
                  </span>
                  <h3 className="font-cinzel font-black text-2xl sm:text-3xl text-white">
                    HIGH CITADEL DECK
                  </h3>
                </div>
              </div>

              {/* Graphic Scene Box */}
              <div className="w-full h-32 rounded-2xl bg-[#07132B]/90 border border-[#00F0FF]/40 shadow-inner mb-5 p-3 flex items-center justify-around relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(#00F0FF 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}
                />

                <div className="flex items-center justify-center gap-6 z-10 font-cinzel text-xs">
                  <div className="text-center">
                    <span className="text-3xl block filter drop-shadow">📜</span>
                    <span className="text-[9px] text-[#00F0FF] font-bold mt-1 block">SCRIBES</span>
                  </div>
                  <div className="text-center bg-[#0C234F] px-3.5 py-1.5 rounded-xl border border-[#00F0FF]/60 shadow-inner">
                    <span className="text-xs font-bold text-[#FFC837] block">PASSKEY VAULT</span>
                    <span className="text-[8px] text-cyan-200 uppercase font-mono">AUTHORIZED ONLY</span>
                  </div>
                  <div className="text-center">
                    <ShieldCheck className="w-8 h-8 text-[#10B981] mx-auto filter drop-shadow" />
                    <span className="text-[9px] text-[#10B981] font-bold mt-1 block">SECURE</span>
                  </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent shadow-fantasy-cyan" />
              </div>

              <p className="text-slate-300 font-jakarta text-xs sm:text-sm font-medium mb-5 leading-relaxed">
                Restricted royal command center. Configure tournament games, calibrate starting coin treasury, award points with 1-click presets, and monitor live telemetry.
              </p>

              {/* Functional Highlights */}
              <div className="space-y-2.5 text-xs font-jakarta font-medium text-slate-200 mb-6 bg-[#061226]/90 p-4 rounded-2xl border border-[#00F0FF]/25">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-[#FFC837] shrink-0" />
                  <span>Passkey protected marshal sign-in</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Gamepad2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  <span>Manage games, coin entry costs & point values</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Coins className="w-4 h-4 text-[#FFC837] shrink-0" />
                  <span>Calibrate starting gold token treasury for new adventurers</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#34D399] shrink-0" />
                  <span>Rapid score awarding console with 1-click rollback</span>
                </div>
              </div>
            </div>

            <button className="btn-fantasy-citadel w-full justify-center text-sm py-4">
              <span>ACCESS ADMIN PORTAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER PLATFORM                                                           */}
      {/* ========================================================================= */}
      <footer className="relative z-10 w-full mt-6">
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#FFC837] to-transparent shadow-fantasy-gold" />
        <div className="bg-[#080718]/95 backdrop-blur-md py-3.5 px-6 text-center text-xs font-cinzel text-[#FFC837] tracking-wider">
          MADAGASCAR CHAMPIONSHIP CIRCUIT • TWO DISTINCT EXPERIENCES
        </div>
      </footer>
    </div>
  );
}
