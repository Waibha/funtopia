import React from 'react';
import { soundFx } from '../utilities/soundFx';

export default function Podium({ topParticipants = [], onSelectParticipant }) {
  if (!topParticipants || topParticipants.length < 3) return null;

  const first = topParticipants[0];
  const second = topParticipants[1];
  const third = topParticipants[2];

  const handlePedestalClick = (participant) => {
    soundFx.play('coin');
    if (onSelectParticipant) onSelectParticipant(participant);
  };

  return (
    <div className="relative pt-4 pb-4 px-2 sm:px-4 max-w-4xl mx-auto select-none font-sans">
      {/* Decorative Title Banner */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="text-2xl filter drop-shadow">👑</span>
        <span className="font-cinzel text-xs sm:text-sm text-[#FFC837] uppercase tracking-widest font-black fantasy-title-gold">
          KINGDOM CHAMPIONS' DAIS
        </span>
        <span className="text-2xl filter drop-shadow">⚔️</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-6 items-end justify-center">
        {/* ========================================================= */}
        {/* 2ND PLACE (SILVER / MOONSTONE - LEFT)                     */}
        {/* ========================================================= */}
        <div
          onClick={() => handlePedestalClick(second)}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label={`2nd place: ${second.name}`}
          onKeyDown={(e) => e.key === 'Enter' && handlePedestalClick(second)}
        >
          {/* Character and Speech Score Bubble */}
          <div className="flex flex-col items-center mb-2.5 group-hover:-translate-y-1.5 transition-transform duration-200">
            {/* Score bubble */}
            <div className="bg-[#0E1B38] text-cyan-200 px-3 py-1 rounded-xl border border-cyan-400/40 text-[11px] font-mono font-bold mb-1 shadow-fantasy-cyan relative">
              {second.totalPoints.toLocaleString()} PTS
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-cyan-400/40" />
            </div>

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-700/60 via-cyan-900/50 to-slate-900/80 border-2 border-cyan-300/50 shadow-fantasy-cyan flex items-center justify-center text-3xl sm:text-4xl relative">
              <span>{second.avatar || '🥈'}</span>
              <div className="absolute -top-3 -right-2 bg-slate-200 text-[#0A091A] font-cinzel text-[10px] px-2 py-0.5 rounded-full border border-slate-400 font-black shadow-fantasy-card">
                🥈 #2
              </div>
            </div>

            <div className="text-center mt-2">
              <h4 className="font-cinzel font-bold text-xs sm:text-sm text-slate-100 truncate max-w-[100px] sm:max-w-none">
                {second.name}
              </h4>
              <p className="font-jakarta text-[11px] text-cyan-300/80 truncate max-w-[100px]">
                {second.bestGame}
              </p>
            </div>
          </div>

          {/* Pedestal: Moonstone Pillar */}
          <div className="w-full h-36 sm:h-44 rounded-t-2xl p-2.5 flex flex-col items-center justify-between bg-gradient-to-b from-[#16274B] via-[#0E1A33] to-[#070D1A] border-x-2 border-t-2 border-cyan-400/40 shadow-fantasy-card">
            <div className="w-full text-center py-1 bg-cyan-950/80 text-cyan-200 font-cinzel text-[9px] sm:text-[10px] font-bold rounded-lg border border-cyan-400/30">
              2ND PLACE
            </div>
            <div className="my-auto text-center">
              <span className="font-cinzel text-3xl sm:text-4xl text-cyan-200 font-black tracking-wider">
                II
              </span>
            </div>
            <div className="w-full text-[9px] font-cinzel text-cyan-300/80 text-center bg-[#070D1A]/80 py-0.5 rounded font-bold">
              GRAND RUNNER-UP
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1ST PLACE (GOLD / SUNSTONE - CENTER, TALLEST)              */}
        {/* ========================================================= */}
        <div
          onClick={() => handlePedestalClick(first)}
          className="flex flex-col items-center cursor-pointer group z-10 -mx-1 sm:mx-0"
          role="button"
          tabIndex={0}
          aria-label={`1st place: ${first.name}`}
          onKeyDown={(e) => e.key === 'Enter' && handlePedestalClick(first)}
        >
          {/* Character and Speech Score Bubble */}
          <div className="flex flex-col items-center mb-3 group-hover:-translate-y-2 transition-transform duration-200">
            {/* Crown Pill */}
            <div className="bg-gradient-to-r from-[#FFC837] to-[#FF9E1B] text-[#0A091A] font-cinzel text-[10px] px-3.5 py-1 rounded-full border border-amber-200 shadow-fantasy-gold font-black mb-1.5 animate-bounce">
              👑 REALM CHAMPION
            </div>

            {/* Score bubble */}
            <div className="bg-[#1C1608] text-[#FFC837] px-4 py-1 rounded-xl border border-[#FFC837]/60 text-xs font-mono font-bold mb-1 shadow-fantasy-gold relative">
              {first.totalPoints.toLocaleString()} PTS
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#FFC837]/60" />
            </div>

            <div className="w-20 h-20 sm:w-26 sm:h-26 rounded-3xl bg-gradient-to-br from-amber-400/30 via-yellow-500/20 to-amber-600/30 border-2 border-[#FFC837] shadow-fantasy-gold flex items-center justify-center text-4xl sm:text-5xl relative">
              <span>{first.avatar || '🏆'}</span>
              <div className="absolute -top-3 -right-2 bg-gradient-to-r from-[#FFC837] to-[#FF9E1B] text-[#0A091A] font-cinzel text-xs px-2.5 py-0.5 rounded-full border border-amber-200 font-black shadow-fantasy-gold">
                🥇 #1
              </div>
            </div>

            <div className="text-center mt-2">
              <h3 className="font-cinzel text-base sm:text-xl font-black text-[#FFC837] fantasy-title-gold truncate max-w-[140px] sm:max-w-none">
                {first.name}
              </h3>
              <p className="font-jakarta text-xs text-amber-200/80 truncate max-w-[140px]">
                Top: {first.bestGame}
              </p>
            </div>
          </div>

          {/* Pedestal: Sunstone Throne Platform */}
          <div className="w-full h-50 sm:h-60 rounded-t-3xl p-3.5 flex flex-col items-center justify-between bg-gradient-to-b from-[#2B1F08] via-[#1B1406] to-[#0D0A03] border-x-3 border-t-3 border-[#FFC837]/60 shadow-fantasy-gold">
            <div className="w-full text-center py-1.5 bg-gradient-to-r from-[#FFC837] to-[#FF9E1B] text-[#0A091A] font-cinzel text-xs font-black rounded-xl shadow-fantasy-gold">
              ★ 1ST PLACE ★
            </div>
            <div className="my-auto text-center">
              <span className="font-cinzel text-5xl sm:text-6xl text-[#FFC837] font-black fantasy-title-gold">
                I
              </span>
            </div>
            <div className="w-full text-[10px] font-cinzel text-[#FFC837] text-center bg-[#0A091A]/80 py-1 rounded-lg font-black border border-[#FFC837]/30">
              CROWN VICTOR
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3RD PLACE (BRONZE / AETHELGARD - RIGHT)                   */}
        {/* ========================================================= */}
        <div
          onClick={() => handlePedestalClick(third)}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label={`3rd place: ${third.name}`}
          onKeyDown={(e) => e.key === 'Enter' && handlePedestalClick(third)}
        >
          {/* Character and Speech Score Bubble */}
          <div className="flex flex-col items-center mb-2.5 group-hover:-translate-y-1.5 transition-transform duration-200">
            {/* Score bubble */}
            <div className="bg-[#24130A] text-amber-300 px-3 py-1 rounded-xl border border-amber-600/40 text-[11px] font-mono font-bold mb-1 shadow-fantasy-card relative">
              {third.totalPoints.toLocaleString()} PTS
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-amber-600/40" />
            </div>

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-900/40 via-yellow-950/30 to-stone-900/70 border-2 border-amber-500/40 shadow-fantasy-card flex items-center justify-center text-3xl sm:text-4xl relative">
              <span>{third.avatar || '🥉'}</span>
              <div className="absolute -top-3 -right-2 bg-amber-700 text-white font-cinzel text-[10px] px-2 py-0.5 rounded-full border border-amber-400 font-black shadow-fantasy-card">
                🥉 #3
              </div>
            </div>

            <div className="text-center mt-2">
              <h4 className="font-cinzel font-bold text-xs sm:text-sm text-slate-100 truncate max-w-[100px] sm:max-w-none">
                {third.name}
              </h4>
              <p className="font-jakarta text-[11px] text-amber-300/80 truncate max-w-[100px]">
                {third.bestGame}
              </p>
            </div>
          </div>

          {/* Pedestal: Aethelgard Pillar */}
          <div className="w-full h-28 sm:h-36 rounded-t-2xl p-2.5 flex flex-col items-center justify-between bg-gradient-to-b from-[#25150B] via-[#1A0E07] to-[#0E0704] border-x-2 border-t-2 border-amber-600/40 shadow-fantasy-card">
            <div className="w-full text-center py-1 bg-amber-950/80 text-amber-200 font-cinzel text-[9px] sm:text-[10px] font-bold rounded-lg border border-amber-600/30">
              3RD PLACE
            </div>
            <div className="my-auto text-center">
              <span className="font-cinzel text-2xl sm:text-3xl text-amber-300 font-black tracking-wider">
                III
              </span>
            </div>
            <div className="w-full text-[9px] font-cinzel text-amber-300/80 text-center bg-[#0E0704]/80 py-0.5 rounded font-bold">
              PODIUM LAUREATE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
