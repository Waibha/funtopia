import React from 'react';

export default function LiveTicker({ activeEvent, transactions = [], participants = [], games = [] }) {
  const recent = transactions.slice(-5).reverse();

  return (
    <div className="bg-[#40186D] border-b-3 border-[#0D0518] py-2 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        {/* Ticker Tag */}
        <div className="flex items-center gap-1.5 bg-[#FF5FA0] text-white font-arcade text-[10px] px-3 py-1 rounded-lg font-black shrink-0 mr-4 border-2 border-[#0D0518] shadow-pixel-sm">
          <span className="w-2 h-2 rounded-full bg-[#FFDE25] animate-ping" />
          <span>LIVE SCORES</span>
        </div>

        {/* Marquee Content */}
        <div className="overflow-hidden whitespace-nowrap flex items-center text-xs font-mono font-bold">
          <div className="inline-flex items-center gap-8 animate-marquee">
            {recent.map((tx) => {
              const participant = participants.find((p) => p.id === tx.participantId);
              const game = games.find((g) => g.id === tx.gameId);
              const isPositive = Number(tx.pointsDelta) >= 0;

              return (
                <div key={tx.id} className="inline-flex items-center gap-2 text-white">
                  <span className="text-base">{participant?.avatar || '👾'}</span>
                  <span className="font-display font-black text-[#FFDE25]">
                    {participant?.name || 'Participant'}
                  </span>
                  <span
                    className={`font-mono text-xs px-2 py-0.5 rounded-md border border-[#0D0518] ${
                      isPositive
                        ? 'bg-[#28C76F] text-[#0D0518] font-black shadow-pixel-sm'
                        : 'bg-[#FF5FA0] text-white font-black shadow-pixel-sm'
                    }`}
                  >
                    {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                  </span>
                  <span className="text-purple-200">in</span>
                  <span className="text-[#00F0FF] font-display font-black">{game?.name || 'Game'}</span>
                  <span className="text-[#FFDE25] font-black">✦</span>
                </div>
              );
            })}

            {/* Event note */}
            <div className="inline-flex items-center gap-2 text-white">
              <span className="font-arcade text-[10px] text-[#FF5FA0] uppercase">
                CIRCUIT: {activeEvent?.name || 'MADAGASCAR TOURNAMENT'}
              </span>
              {activeEvent?.description && (
                <span className="text-purple-200">— {activeEvent.description}</span>
              )}
              <span className="text-[#FFDE25] font-black">✦</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
