import React from 'react';

export default function LiveTicker({ activeEvent, transactions, teams, games }) {
  const recent = transactions.slice(-4).reverse();

  return (
    <div className="bg-pop-butter border-b-2 border-pop-ink py-2 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        {/* Ticker Tag */}
        <div className="flex items-center gap-1.5 bg-pop-coral text-white font-arcade text-[10px] px-3 py-1 rounded-lg font-black shrink-0 mr-4 border-2 border-pop-ink shadow-pop-sm">
          <span className="w-2 h-2 rounded-full bg-pop-yellow animate-ping" />
          <span>SCORE FEED</span>
        </div>

        {/* Marquee Content */}
        <div className="overflow-hidden whitespace-nowrap flex items-center text-xs font-mono font-bold">
          <div className="inline-flex items-center gap-8 animate-marquee">
            {recent.map((tx) => {
              const team = teams.find((t) => t.id === tx.teamId);
              const game = games.find((g) => g.id === tx.gameId);
              const isPositive = Number(tx.pointsDelta) >= 0;

              return (
                <div key={tx.id} className="inline-flex items-center gap-2 text-pop-ink">
                  <span
                    className="w-3 h-3 rounded-md shrink-0 border border-pop-ink"
                    style={{ backgroundColor: team?.color || '#FF2A6D' }}
                  />
                  <span className="font-black">[{team?.tag || 'CREW'}]</span>
                  <span className="text-pop-purple font-display">{team?.name}</span>
                  <span
                    className={`font-mono text-xs px-2 py-0.5 rounded-md border border-pop-ink ${
                      isPositive
                        ? 'bg-pop-green text-pop-ink font-black shadow-pop-sm'
                        : 'bg-pop-coral text-white font-black shadow-pop-sm'
                    }`}
                  >
                    {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                  </span>
                  <span className="text-pop-muted">in</span>
                  <span className="text-pop-orange font-display">{game?.name || 'Match'}</span>
                  <span className="text-pop-ink font-black">✦</span>
                </div>
              );
            })}

            {/* Event note */}
            <div className="inline-flex items-center gap-2 text-pop-ink">
              <span className="font-arcade text-xs text-pop-purple uppercase">
                ARENA: {activeEvent?.name}
              </span>
              <span className="text-pop-muted">— Grand Prize: {activeEvent?.prizePool}</span>
              <span className="text-pop-ink font-black">✦</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
