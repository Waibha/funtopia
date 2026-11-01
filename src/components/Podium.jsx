import React from 'react';
import { soundFx } from '../utilities/soundFx';

export default function Podium({ topTeams, onSelectTeam }) {
  if (!topTeams || topTeams.length < 3) return null;

  const first = topTeams[0];
  const second = topTeams[1];
  const third = topTeams[2];

  const handlePedestalClick = (team) => {
    soundFx.play('coin');
    if (onSelectTeam) onSelectTeam(team);
  };

  return (
    <div className="relative pt-6 pb-8 px-2 sm:px-4 max-w-4xl mx-auto select-none">
      <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end justify-center">
        {/* ========================================================= */}
        {/* 2ND PLACE (ELECTRIC LILAC PEDESTAL)                       */}
        {/* ========================================================= */}
        <div
          onClick={() => handlePedestalClick(second)}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label={`2nd place: ${second.name}`}
          onKeyDown={(e) => e.key === 'Enter' && handlePedestalClick(second)}
        >
          {/* Avatar and Tag */}
          <div className="flex flex-col items-center mb-2.5 group-hover:-translate-y-1.5 transition-transform duration-200">
            <div
              className="w-16 h-16 sm:w-22 sm:h-22 rounded-2xl bg-white border-3 border-pop-ink shadow-pop flex items-center justify-center text-3xl sm:text-4xl relative"
            >
              <span>{second.avatar}</span>
              <div className="absolute -top-3 -right-2 bg-pop-purple text-white font-arcade text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full border-2 border-pop-ink font-black shadow-pop-sm">
                #2
              </div>
            </div>

            <div className="text-center mt-2">
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border-2 border-pop-ink uppercase shadow-pop-sm"
                style={{ backgroundColor: second.color, color: '#fff' }}
              >
                {second.tag}
              </span>
              <h4 className="font-display font-black text-xs sm:text-sm text-pop-ink truncate max-w-[100px] sm:max-w-none mt-1">
                {second.name}
              </h4>
              <p className="font-mono text-xs sm:text-sm text-pop-purple font-black">
                🪙 {second.totalPoints.toLocaleString()} PTS
              </p>
            </div>
          </div>

          {/* 2nd Pedestal Body */}
          <div className="w-full h-36 sm:h-46 bg-pop-purple-light border-3 border-pop-ink rounded-t-2xl p-3 flex flex-col items-center justify-between shadow-pop">
            <div className="w-full text-center py-1 bg-white text-pop-purple font-arcade text-[10px] font-black rounded-lg border-2 border-pop-ink">
              2ND PLACE
            </div>
            <div className="my-auto text-center">
              <span className="font-arcade text-4xl sm:text-5xl text-pop-purple font-black">
                2
              </span>
              <p className="text-[11px] font-mono text-pop-ink font-bold mt-1 truncate max-w-[110px]">
                {second.bestGame}
              </p>
            </div>
            <div className="w-full text-[10px] font-mono text-pop-muted text-center border-t-2 border-pop-ink/20 pt-1 font-bold">
              RUNNER-UP
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1ST PLACE (ACID YELLOW CHAMPIONSHIP PEDESTAL)             */}
        {/* ========================================================= */}
        <div
          onClick={() => handlePedestalClick(first)}
          className="flex flex-col items-center cursor-pointer group z-10 -mx-1 sm:mx-0"
          role="button"
          tabIndex={0}
          aria-label={`1st place champion: ${first.name}`}
          onKeyDown={(e) => e.key === 'Enter' && handlePedestalClick(first)}
        >
          {/* Avatar and Winner Badge */}
          <div className="flex flex-col items-center mb-3 group-hover:-translate-y-2 transition-transform duration-200">
            <div className="bg-pop-coral text-white font-arcade text-[10px] sm:text-xs px-3 py-1 rounded-full border-2 border-pop-ink shadow-pop-sm font-black mb-1.5 animate-bounce">
              👑 WINNER
            </div>

            <div
              className="w-22 h-22 sm:w-28 sm:h-28 rounded-3xl bg-pop-yellow border-3 border-pop-ink shadow-pop-lg flex items-center justify-center text-4xl sm:text-5xl relative"
            >
              <span>{first.avatar}</span>
              <div className="absolute -top-3 -right-2 bg-pop-coral text-white font-arcade text-xs px-3 py-1 rounded-full border-2 border-pop-ink font-black shadow-pop-sm">
                #1
              </div>
            </div>

            <div className="text-center mt-2">
              <span
                className="text-[11px] font-mono font-black px-2.5 py-0.5 rounded-md border-2 border-pop-ink uppercase shadow-pop-sm text-white"
                style={{ backgroundColor: first.color }}
              >
                {first.tag}
              </span>
              <h3 className="font-bungee text-base sm:text-xl text-pop-ink truncate max-w-[130px] sm:max-w-none mt-1">
                {first.name}
              </h3>
              <p className="font-mono text-sm sm:text-base text-pop-coral font-black">
                🪙 {first.totalPoints.toLocaleString()} PTS
              </p>
            </div>
          </div>

          {/* 1st Pedestal Body (Tallest) */}
          <div className="w-full h-52 sm:h-64 bg-pop-yellow border-3 border-pop-ink rounded-t-3xl p-4 flex flex-col items-center justify-between shadow-pop-lg">
            <div className="w-full text-center py-1.5 bg-pop-coral text-white font-arcade text-xs font-black rounded-xl border-2 border-pop-ink shadow-pop-sm">
              ★ CHAMPION ★
            </div>
            <div className="my-auto text-center">
              <span className="font-arcade text-5xl sm:text-6xl text-pop-ink font-black">
                1
              </span>
              <p className="text-xs font-mono text-pop-ink mt-1.5 font-black bg-white/70 px-2.5 py-0.5 rounded-full border border-pop-ink">
                Peak: {first.bestGame}
              </p>
            </div>
            <div className="w-full text-xs font-mono text-pop-ink text-center border-t-2 border-pop-ink/30 pt-1.5 font-black">
              GRAND CHAMPION
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3RD PLACE (TANGERINE ORANGE PEDESTAL)                     */}
        {/* ========================================================= */}
        <div
          onClick={() => handlePedestalClick(third)}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label={`3rd place: ${third.name}`}
          onKeyDown={(e) => e.key === 'Enter' && handlePedestalClick(third)}
        >
          {/* Avatar and Tag */}
          <div className="flex flex-col items-center mb-2.5 group-hover:-translate-y-1.5 transition-transform duration-200">
            <div
              className="w-16 h-16 sm:w-22 sm:h-22 rounded-2xl bg-white border-3 border-pop-ink shadow-pop flex items-center justify-center text-3xl sm:text-4xl relative"
            >
              <span>{third.avatar}</span>
              <div className="absolute -top-3 -right-2 bg-pop-orange text-white font-arcade text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full border-2 border-pop-ink font-black shadow-pop-sm">
                #3
              </div>
            </div>

            <div className="text-center mt-2">
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border-2 border-pop-ink uppercase shadow-pop-sm text-white"
                style={{ backgroundColor: third.color }}
              >
                {third.tag}
              </span>
              <h4 className="font-display font-black text-xs sm:text-sm text-pop-ink truncate max-w-[100px] sm:max-w-none mt-1">
                {third.name}
              </h4>
              <p className="font-mono text-xs sm:text-sm text-pop-orange font-black">
                🪙 {third.totalPoints.toLocaleString()} PTS
              </p>
            </div>
          </div>

          {/* 3rd Pedestal Body */}
          <div className="w-full h-30 sm:h-38 bg-pop-orange-light border-3 border-pop-ink rounded-t-2xl p-3 flex flex-col items-center justify-between shadow-pop">
            <div className="w-full text-center py-1 bg-white text-pop-orange font-arcade text-[10px] font-black rounded-lg border-2 border-pop-ink">
              3RD PLACE
            </div>
            <div className="my-auto text-center">
              <span className="font-arcade text-3xl sm:text-4xl text-pop-orange font-black">
                3
              </span>
              <p className="text-[11px] font-mono text-pop-ink font-bold mt-0.5 truncate max-w-[110px]">
                {third.bestGame}
              </p>
            </div>
            <div className="w-full text-[10px] font-mono text-pop-muted text-center border-t-2 border-pop-ink/20 pt-1 font-bold">
              PODIUM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
