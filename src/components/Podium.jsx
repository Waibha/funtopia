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
    <div className="relative pt-6 pb-8 px-2 sm:px-4 max-w-4xl mx-auto select-none">
      <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end justify-center">
        {/* ========================================================= */}
        {/* 2ND PLACE PARTICIPANT                                     */}
        {/* ========================================================= */}
        <div
          onClick={() => handlePedestalClick(second)}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label={`2nd place: ${second.name}`}
          onKeyDown={(e) => e.key === 'Enter' && handlePedestalClick(second)}
        >
          <div className="flex flex-col items-center mb-2.5 group-hover:-translate-y-1.5 transition-transform duration-200">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-3 border-pop-ink shadow-pop flex items-center justify-center text-3xl sm:text-4xl relative">
              <span>{second.avatar || '⭐'}</span>
              <div className="absolute -top-3 -right-2 bg-pop-purple text-white font-arcade text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full border-2 border-pop-ink font-black shadow-pop-sm">
                #2
              </div>
            </div>

            <div className="text-center mt-2">
              <h4 className="font-display font-black text-xs sm:text-sm text-pop-ink truncate max-w-[100px] sm:max-w-none mt-1">
                {second.name}
              </h4>
              <p className="font-mono text-xs sm:text-sm text-pop-purple font-black">
                {second.totalPoints.toLocaleString()} PTS
              </p>
            </div>
          </div>

          <div className="w-full h-36 sm:h-44 bg-pop-purple-light border-3 border-pop-ink rounded-t-2xl p-3 flex flex-col items-center justify-between shadow-pop">
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
        {/* 1ST PLACE PARTICIPANT                                     */}
        {/* ========================================================= */}
        <div
          onClick={() => handlePedestalClick(first)}
          className="flex flex-col items-center cursor-pointer group z-10 -mx-1 sm:mx-0"
          role="button"
          tabIndex={0}
          aria-label={`1st place: ${first.name}`}
          onKeyDown={(e) => e.key === 'Enter' && handlePedestalClick(first)}
        >
          <div className="flex flex-col items-center mb-3 group-hover:-translate-y-2 transition-transform duration-200">
            <div className="bg-pop-coral text-white font-arcade text-[10px] sm:text-xs px-3 py-1 rounded-full border-2 border-pop-ink shadow-pop-sm font-black mb-1.5 animate-bounce">
              👑 1ST PLACE
            </div>

            <div className="w-20 h-20 sm:w-26 sm:h-26 rounded-3xl bg-pop-yellow border-3 border-pop-ink shadow-pop-lg flex items-center justify-center text-4xl sm:text-5xl relative">
              <span>{first.avatar || '🏆'}</span>
              <div className="absolute -top-3 -right-2 bg-pop-coral text-white font-arcade text-xs px-3 py-1 rounded-full border-2 border-pop-ink font-black shadow-pop-sm">
                #1
              </div>
            </div>

            <div className="text-center mt-2">
              <h3 className="font-bungee text-base sm:text-xl text-pop-ink truncate max-w-[130px] sm:max-w-none mt-1">
                {first.name}
              </h3>
              <p className="font-mono text-sm sm:text-base text-pop-coral font-black">
                {first.totalPoints.toLocaleString()} PTS
              </p>
            </div>
          </div>

          <div className="w-full h-50 sm:h-60 bg-pop-yellow border-3 border-pop-ink rounded-t-3xl p-4 flex flex-col items-center justify-between shadow-pop-lg">
            <div className="w-full text-center py-1 bg-pop-coral text-white font-arcade text-xs font-black rounded-xl border-2 border-pop-ink shadow-pop-sm">
              ★ LEADER ★
            </div>
            <div className="my-auto text-center">
              <span className="font-arcade text-5xl sm:text-6xl text-pop-ink font-black">
                1
              </span>
              <p className="text-xs font-mono text-pop-ink mt-1.5 font-black bg-white/70 px-2.5 py-0.5 rounded-full border border-pop-ink">
                Top Game: {first.bestGame}
              </p>
            </div>
            <div className="w-full text-xs font-mono text-pop-ink text-center border-t-2 border-pop-ink/30 pt-1.5 font-black">
              EVENT WINNER
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3RD PLACE PARTICIPANT                                     */}
        {/* ========================================================= */}
        <div
          onClick={() => handlePedestalClick(third)}
          className="flex flex-col items-center cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label={`3rd place: ${third.name}`}
          onKeyDown={(e) => e.key === 'Enter' && handlePedestalClick(third)}
        >
          <div className="flex flex-col items-center mb-2.5 group-hover:-translate-y-1.5 transition-transform duration-200">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-3 border-pop-ink shadow-pop flex items-center justify-center text-3xl sm:text-4xl relative">
              <span>{third.avatar || '🎮'}</span>
              <div className="absolute -top-3 -right-2 bg-pop-orange text-white font-arcade text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full border-2 border-pop-ink font-black shadow-pop-sm">
                #3
              </div>
            </div>

            <div className="text-center mt-2">
              <h4 className="font-display font-black text-xs sm:text-sm text-pop-ink truncate max-w-[100px] sm:max-w-none mt-1">
                {third.name}
              </h4>
              <p className="font-mono text-xs sm:text-sm text-pop-orange font-black">
                {third.totalPoints.toLocaleString()} PTS
              </p>
            </div>
          </div>

          <div className="w-full h-28 sm:h-36 bg-pop-orange-light border-3 border-pop-ink rounded-t-2xl p-3 flex flex-col items-center justify-between shadow-pop">
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
              3RD PLACE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
