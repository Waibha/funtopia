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
    <div className="relative pt-6 pb-10 px-2 sm:px-4 max-w-4xl mx-auto select-none">
      {/* 3-Column Arcade Podium */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end justify-center">
        {/* ========================================================= */}
        {/* 2ND PLACE (SILVER PEDESTAL)                               */}
        {/* ========================================================= */}
        <div
          onClick={() => handlePedestalClick(second)}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label={`2nd place: ${second.name}`}
          onKeyDown={(e) => e.key === 'Enter' && handlePedestalClick(second)}
        >
          {/* Avatar & Tag */}
          <div className="flex flex-col items-center mb-2 group-hover:-translate-y-1.5 transition-transform duration-200">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#1e1c27] border-2 border-black shadow-arcade flex items-center justify-center text-3xl sm:text-4xl relative"
            >
              <span>{second.avatar}</span>
              <div className="absolute -top-2.5 -right-2 bg-zinc-300 text-black font-arcade text-[10px] px-2 py-0.5 rounded border border-black font-bold shadow-arcade-sm">
                #2
              </div>
            </div>

            <div className="text-center mt-2">
              <span
                className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-black"
                style={{ backgroundColor: second.color, color: '#000' }}
              >
                {second.tag}
              </span>
              <p className="font-display font-bold text-xs sm:text-sm text-white truncate max-w-[95px] sm:max-w-none mt-1">
                {second.name}
              </p>
              <p className="font-mono text-xs sm:text-sm text-zinc-300 font-extrabold">
                {second.totalPoints.toLocaleString()} PTS
              </p>
            </div>
          </div>

          {/* 2nd Pedestal Body */}
          <div className="w-full h-36 sm:h-44 bg-[#1b1924] border-2 border-black border-b-4 rounded-t-xl p-3 flex flex-col items-center justify-between shadow-arcade">
            <div className="w-full text-center py-1 bg-zinc-400 text-black font-arcade text-[10px] font-bold rounded">
              2ND PLACE
            </div>
            <div className="my-auto text-center">
              <span className="font-arcade text-3xl sm:text-4xl text-zinc-300 font-black">
                2
              </span>
              <p className="text-[10px] font-mono text-zinc-400 mt-1 truncate max-w-[100px]">
                {second.bestGame}
              </p>
            </div>
            <div className="w-full text-[9px] font-mono text-zinc-500 text-center border-t border-zinc-700/60 pt-1">
              RUNNER-UP
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1ST PLACE (GOLD CHAMPIONSHIP PEDESTAL)                    */}
        {/* ========================================================= */}
        <div
          onClick={() => handlePedestalClick(first)}
          className="flex flex-col items-center cursor-pointer group z-10 -mx-1 sm:mx-0"
          role="button"
          tabIndex={0}
          aria-label={`1st place champion: ${first.name}`}
          onKeyDown={(e) => e.key === 'Enter' && handlePedestalClick(first)}
        >
          {/* Avatar & Crown Tag */}
          <div className="flex flex-col items-center mb-3 group-hover:-translate-y-2 transition-transform duration-200">
            <div className="text-arcade-yellow font-arcade text-xs mb-1 animate-bounce">
              👑 WINNER
            </div>

            <div
              className="w-20 h-20 sm:w-26 sm:h-26 rounded-xl bg-[#242132] border-3 border-black shadow-arcade-lg flex items-center justify-center text-4xl sm:text-5xl relative"
            >
              <span>{first.avatar}</span>
              <div className="absolute -top-3 -right-2 bg-arcade-yellow text-black font-arcade text-xs px-2.5 py-1 rounded border-2 border-black font-black shadow-arcade-sm">
                #1
              </div>
            </div>

            <div className="text-center mt-2">
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-black uppercase"
                style={{ backgroundColor: first.color, color: '#000' }}
              >
                {first.tag}
              </span>
              <h3 className="font-bungee text-sm sm:text-lg text-arcade-yellow truncate max-w-[120px] sm:max-w-none mt-1">
                {first.name}
              </h3>
              <p className="font-mono text-sm sm:text-base text-white font-black">
                {first.totalPoints.toLocaleString()} PTS
              </p>
            </div>
          </div>

          {/* 1st Pedestal Body (Tallest) */}
          <div className="w-full h-52 sm:h-60 bg-[#252233] border-3 border-black border-b-6 rounded-t-xl p-3 sm:p-4 flex flex-col items-center justify-between shadow-arcade-lg">
            <div className="w-full text-center py-1 bg-arcade-yellow text-black font-arcade text-xs font-black rounded border border-black">
              ★ CHAMPION ★
            </div>
            <div className="my-auto text-center">
              <span className="font-arcade text-5xl sm:text-6xl text-arcade-yellow font-black">
                1
              </span>
              <p className="text-xs font-mono text-zinc-300 mt-1 font-bold">
                {first.bestGame}
              </p>
            </div>
            <div className="w-full text-[10px] font-mono text-arcade-yellow text-center border-t border-zinc-700 pt-1.5 font-bold">
              ARCADE GRAND MASTER
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3RD PLACE (BRONZE PEDESTAL)                               */}
        {/* ========================================================= */}
        <div
          onClick={() => handlePedestalClick(third)}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label={`3rd place: ${third.name}`}
          onKeyDown={(e) => e.key === 'Enter' && handlePedestalClick(third)}
        >
          {/* Avatar & Tag */}
          <div className="flex flex-col items-center mb-2 group-hover:-translate-y-1.5 transition-transform duration-200">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#1e1c27] border-2 border-black shadow-arcade flex items-center justify-center text-3xl sm:text-4xl relative"
            >
              <span>{third.avatar}</span>
              <div className="absolute -top-2.5 -right-2 bg-amber-600 text-white font-arcade text-[10px] px-2 py-0.5 rounded border border-black font-bold shadow-arcade-sm">
                #3
              </div>
            </div>

            <div className="text-center mt-2">
              <span
                className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-black"
                style={{ backgroundColor: third.color, color: '#000' }}
              >
                {third.tag}
              </span>
              <p className="font-display font-bold text-xs sm:text-sm text-white truncate max-w-[95px] sm:max-w-none mt-1">
                {third.name}
              </p>
              <p className="font-mono text-xs sm:text-sm text-amber-400 font-extrabold">
                {third.totalPoints.toLocaleString()} PTS
              </p>
            </div>
          </div>

          {/* 3rd Pedestal Body */}
          <div className="w-full h-28 sm:h-34 bg-[#1b1924] border-2 border-black border-b-4 rounded-t-xl p-3 flex flex-col items-center justify-between shadow-arcade">
            <div className="w-full text-center py-1 bg-amber-600 text-white font-arcade text-[10px] font-bold rounded">
              3RD PLACE
            </div>
            <div className="my-auto text-center">
              <span className="font-arcade text-3xl sm:text-4xl text-amber-500 font-black">
                3
              </span>
              <p className="text-[10px] font-mono text-zinc-400 mt-0.5 truncate max-w-[100px]">
                {third.bestGame}
              </p>
            </div>
            <div className="w-full text-[9px] font-mono text-zinc-500 text-center border-t border-zinc-700/60 pt-1">
              PODIUM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
