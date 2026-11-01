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
    <div className="relative pt-4 pb-4 px-2 sm:px-4 max-w-4xl mx-auto select-none">
      {/* Decorative Trophy & Medal Banner directly referencing Screen 10 */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <span className="text-3xl filter drop-shadow">🏆</span>
        <span className="font-arcade text-xs sm:text-sm text-[#FFDE25] uppercase tracking-widest font-black">
          CHAMPIONSHIP PODIUM
        </span>
        <span className="text-3xl filter drop-shadow">🥇</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-6 items-end justify-center">
        {/* ========================================================= */}
        {/* 2ND PLACE (SILVER - LEFT)                                 */}
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
            {/* Speech bubble displaying score */}
            <div className="bg-white text-[#0D0518] px-3 py-1 rounded-xl border-2 border-[#0D0518] text-[10px] font-mono font-black mb-1 shadow-pixel-sm relative">
              {second.totalPoints.toLocaleString()} PTS
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#0D0518]" />
            </div>

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-3 border-[#0D0518] shadow-pixel flex items-center justify-center text-3xl sm:text-4xl relative">
              <span>{second.avatar || '⭐'}</span>
              <div className="absolute -top-3 -right-2 bg-[#D1D5DB] text-[#0D0518] font-arcade text-[10px] px-2 py-0.5 rounded-full border-2 border-[#0D0518] font-black shadow-pixel-sm">
                🥈 #2
              </div>
            </div>

            <div className="text-center mt-2">
              <h4 className="font-display font-black text-xs sm:text-sm text-white truncate max-w-[100px] sm:max-w-none">
                {second.name}
              </h4>
              <p className="font-mono text-[11px] text-purple-200 truncate max-w-[100px]">
                {second.bestGame}
              </p>
            </div>
          </div>

          {/* Pedestal: Pixel Brick Block */}
          <div className="w-full h-36 sm:h-44 pixel-brick-strip rounded-t-2xl p-2.5 flex flex-col items-center justify-between shadow-pixel border-x-3 border-t-3 border-[#0D0518]">
            <div className="w-full text-center py-1 bg-white text-[#0D0518] font-arcade text-[9px] sm:text-[10px] font-black rounded-lg border-2 border-[#0D0518] shadow-pixel-sm">
              2ND PLACE
            </div>
            <div className="my-auto text-center">
              <span className="font-arcade text-3xl sm:text-4xl text-[#FFDE25] font-black pixel-title-yellow">
                2
              </span>
            </div>
            <div className="w-full text-[9px] font-arcade text-white text-center bg-[#0D0518]/60 py-0.5 rounded font-bold">
              RUNNER-UP
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1ST PLACE (GOLD - CENTER, TALLEST)                        */}
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
            <div className="bg-[#FF5FA0] text-white font-arcade text-[10px] px-3 py-1 rounded-full border-2 border-[#0D0518] shadow-pixel-sm font-black mb-1.5 animate-bounce">
              👑 CHAMPION
            </div>

            {/* Speech bubble */}
            <div className="bg-[#FFDE25] text-[#0D0518] px-3.5 py-1 rounded-xl border-2 border-[#0D0518] text-xs font-mono font-black mb-1 shadow-pixel-sm relative">
              {first.totalPoints.toLocaleString()} PTS
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#0D0518]" />
            </div>

            <div className="w-20 h-20 sm:w-26 sm:h-26 rounded-3xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel-lg flex items-center justify-center text-4xl sm:text-5xl relative">
              <span>{first.avatar || '🏆'}</span>
              <div className="absolute -top-3 -right-2 bg-[#FF5FA0] text-white font-arcade text-xs px-2.5 py-0.5 rounded-full border-2 border-[#0D0518] font-black shadow-pixel-sm">
                🥇 #1
              </div>
            </div>

            <div className="text-center mt-2">
              <h3 className="font-bungee text-base sm:text-xl text-[#FFDE25] truncate max-w-[130px] sm:max-w-none">
                {first.name}
              </h3>
              <p className="font-mono text-xs text-purple-200 truncate max-w-[130px]">
                Top: {first.bestGame}
              </p>
            </div>
          </div>

          {/* Pedestal: Highest Brick Platform */}
          <div className="w-full h-50 sm:h-60 pixel-brick-strip rounded-t-3xl p-3.5 flex flex-col items-center justify-between shadow-pixel-lg border-x-4 border-t-4 border-[#0D0518]">
            <div className="w-full text-center py-1.5 bg-[#FFDE25] text-[#0D0518] font-arcade text-xs font-black rounded-xl border-2 border-[#0D0518] shadow-pixel-sm">
              ★ 1ST PLACE ★
            </div>
            <div className="my-auto text-center">
              <span className="font-arcade text-5xl sm:text-6xl text-[#FFDE25] font-black pixel-title-yellow">
                1
              </span>
            </div>
            <div className="w-full text-[10px] font-arcade text-[#FFDE25] text-center bg-[#0D0518]/70 py-1 rounded-lg font-black">
              EVENT WINNER
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3RD PLACE (BRONZE - RIGHT)                                */}
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
            {/* Speech bubble */}
            <div className="bg-white text-[#0D0518] px-3 py-1 rounded-xl border-2 border-[#0D0518] text-[10px] font-mono font-black mb-1 shadow-pixel-sm relative">
              {third.totalPoints.toLocaleString()} PTS
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#0D0518]" />
            </div>

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-3 border-[#0D0518] shadow-pixel flex items-center justify-center text-3xl sm:text-4xl relative">
              <span>{third.avatar || '🎮'}</span>
              <div className="absolute -top-3 -right-2 bg-[#E08552] text-white font-arcade text-[10px] px-2 py-0.5 rounded-full border-2 border-[#0D0518] font-black shadow-pixel-sm">
                🥉 #3
              </div>
            </div>

            <div className="text-center mt-2">
              <h4 className="font-display font-black text-xs sm:text-sm text-white truncate max-w-[100px] sm:max-w-none">
                {third.name}
              </h4>
              <p className="font-mono text-[11px] text-purple-200 truncate max-w-[100px]">
                {third.bestGame}
              </p>
            </div>
          </div>

          {/* Pedestal: Pixel Brick Block */}
          <div className="w-full h-28 sm:h-36 pixel-brick-strip rounded-t-2xl p-2.5 flex flex-col items-center justify-between shadow-pixel border-x-3 border-t-3 border-[#0D0518]">
            <div className="w-full text-center py-1 bg-white text-[#0D0518] font-arcade text-[9px] sm:text-[10px] font-black rounded-lg border-2 border-[#0D0518] shadow-pixel-sm">
              3RD PLACE
            </div>
            <div className="my-auto text-center">
              <span className="font-arcade text-2xl sm:text-3xl text-[#FFDE25] font-black pixel-title-yellow">
                3
              </span>
            </div>
            <div className="w-full text-[9px] font-arcade text-white text-center bg-[#0D0518]/60 py-0.5 rounded font-bold">
              PODIUM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
