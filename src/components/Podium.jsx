import React from 'react';
import { Crown, Trophy, Medal, Sparkles } from 'lucide-react';
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
    <div className="relative pt-8 pb-12 px-4 max-w-5xl mx-auto">
      {/* Cosmic background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 bg-arcade-pink/15 blur-[100px] rounded-full pointer-events-none" />

      {/* Podium Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end justify-center">
        {/* 2ND PLACE (SILVER) */}
        <div
          onClick={() => handlePedestalClick(second)}
          className="flex flex-col items-center cursor-pointer group"
        >
          {/* Avatar & Floating Badge */}
          <div className="relative mb-3 transform group-hover:-translate-y-2 transition-transform duration-300">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-lg border-2 border-slate-300/80 bg-slate-900/90 relative"
              style={{
                boxShadow: `0 0 20px ${second.color}40`,
              }}
            >
              <span>{second.avatar}</span>
              <div className="absolute -top-3 -right-2 bg-slate-200 text-slate-950 font-arcade text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold shadow-md">
                #2
              </div>
            </div>
          </div>

          <div className="text-center mb-2">
            <p className="font-arcade text-xs sm:text-sm text-white truncate max-w-[120px] sm:max-w-none">
              {second.name}
            </p>
            <p className="font-mono text-xs text-slate-300 font-bold tracking-wider">
              {second.totalPoints.toLocaleString()} PTS
            </p>
          </div>

          {/* Pedestal Structure */}
          <div className="w-full h-36 sm:h-44 rounded-t-xl bg-gradient-to-t from-slate-900 via-slate-800 to-slate-700/80 border-t-4 border-x border-slate-300/60 p-3 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-retro-grid opacity-20 pointer-events-none" />
            <div className="flex items-center gap-1 text-slate-300 font-bungee text-sm sm:text-base">
              <Medal className="w-4 h-4" />
              <span>SILVER</span>
            </div>
            <div className="text-center z-10">
              <span className="font-arcade text-2xl sm:text-3xl text-slate-200/90 drop-shadow">
                2ND
              </span>
              <p className="text-[10px] font-mono text-slate-400 mt-1">
                {second.bestGame}
              </p>
            </div>
            <div className="w-full h-1 bg-slate-400/40 rounded-full" />
          </div>
        </div>

        {/* 1ST PLACE (GOLD - CENTERPIECE) */}
        <div
          onClick={() => handlePedestalClick(first)}
          className="flex flex-col items-center cursor-pointer group z-20"
        >
          {/* Animated Crown & Floating Trophy */}
          <div className="relative mb-3 transform group-hover:-translate-y-3 transition-transform duration-300">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-arcade-yellow animate-bounce">
              <Crown className="w-8 h-8 fill-arcade-yellow drop-shadow-[0_0_12px_rgba(255,230,0,0.8)]" />
            </div>

            <div
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shadow-neon-yellow border-4 border-arcade-yellow bg-[#12112e] relative"
              style={{
                boxShadow: `0 0 35px ${first.color}70, 0 0 15px #FFE600`,
              }}
            >
              <span>{first.avatar}</span>
              <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-gradient-to-r from-arcade-yellow to-amber-500 text-slate-950 font-arcade text-xs font-bold shadow-lg">
                #1 CHAMPION
              </div>
            </div>
          </div>

          <div className="text-center mb-2 mt-1">
            <h3 className="font-bungee text-base sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-arcade-yellow via-amber-200 to-amber-400 drop-shadow">
              {first.name}
            </h3>
            <p className="font-mono text-sm sm:text-base text-arcade-yellow font-extrabold tracking-widest glow-text-yellow">
              {first.totalPoints.toLocaleString()} PTS
            </p>
          </div>

          {/* Pedestal Structure */}
          <div className="w-full h-48 sm:h-60 rounded-t-2xl bg-gradient-to-t from-[#1b1502] via-[#2d2204] to-[#453608] border-t-4 border-x border-arcade-yellow p-4 flex flex-col items-center justify-between shadow-neon-yellow relative overflow-hidden">
            <div className="absolute inset-0 bg-retro-grid opacity-30 pointer-events-none" />
            <div className="flex items-center gap-1.5 text-arcade-yellow font-bungee text-sm sm:text-lg">
              <Trophy className="w-5 h-5 fill-arcade-yellow text-arcade-yellow" />
              <span>CHAMPION</span>
            </div>
            <div className="text-center z-10">
              <span className="font-arcade text-3xl sm:text-5xl text-arcade-yellow drop-shadow-[0_0_15px_rgba(255,230,0,0.6)]">
                1ST
              </span>
              <p className="text-[11px] font-mono text-amber-300/80 mt-1">
                Dominating in: {first.bestGame}
              </p>
            </div>
            <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-arcade-yellow to-transparent rounded-full" />
          </div>
        </div>

        {/* 3RD PLACE (BRONZE) */}
        <div
          onClick={() => handlePedestalClick(third)}
          className="flex flex-col items-center cursor-pointer group"
        >
          {/* Avatar & Floating Badge */}
          <div className="relative mb-3 transform group-hover:-translate-y-2 transition-transform duration-300">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-lg border-2 border-amber-600/80 bg-stone-950 relative"
              style={{
                boxShadow: `0 0 20px ${third.color}40`,
              }}
            >
              <span>{third.avatar}</span>
              <div className="absolute -top-3 -right-2 bg-amber-600 text-amber-50 font-arcade text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold shadow-md">
                #3
              </div>
            </div>
          </div>

          <div className="text-center mb-2">
            <p className="font-arcade text-xs sm:text-sm text-white truncate max-w-[120px] sm:max-w-none">
              {third.name}
            </p>
            <p className="font-mono text-xs text-amber-400 font-bold tracking-wider">
              {third.totalPoints.toLocaleString()} PTS
            </p>
          </div>

          {/* Pedestal Structure */}
          <div className="w-full h-32 sm:h-36 rounded-t-xl bg-gradient-to-t from-stone-950 via-stone-900 to-amber-950/80 border-t-4 border-x border-amber-600/70 p-3 flex flex-col items-center justify-between shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-retro-grid opacity-20 pointer-events-none" />
            <div className="flex items-center gap-1 text-amber-400 font-bungee text-sm sm:text-base">
              <Medal className="w-4 h-4" />
              <span>BRONZE</span>
            </div>
            <div className="text-center z-10">
              <span className="font-arcade text-2xl sm:text-3xl text-amber-500 drop-shadow">
                3RD
              </span>
              <p className="text-[10px] font-mono text-amber-300/70 mt-1">
                {third.bestGame}
              </p>
            </div>
            <div className="w-full h-1 bg-amber-600/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
