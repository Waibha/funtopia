import React from 'react';
import { Radio } from 'lucide-react';

export default function LiveTicker({ activeEvent, transactions, teams, games }) {
  const recent = transactions.slice(-4).reverse();

  return (
    <div className="bg-[#121118] border-b border-arcade-border py-2 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        {/* Status Badge */}
        <div className="flex items-center gap-1.5 bg-arcade-yellow text-black font-arcade text-[10px] px-2.5 py-1 rounded font-bold shrink-0 mr-4 border border-black shadow-arcade-sm">
          <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
          <span>SCORE FEED</span>
        </div>

        {/* Ticker Stream */}
        <div className="overflow-hidden whitespace-nowrap flex items-center text-xs font-mono">
          <div className="inline-flex items-center gap-8 animate-marquee">
            {recent.map((tx) => {
              const team = teams.find((t) => t.id === tx.teamId);
              const game = games.find((g) => g.id === tx.gameId);
              const isPositive = Number(tx.pointsDelta) >= 0;

              return (
                <div key={tx.id} className="inline-flex items-center gap-2 text-arcade-white">
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0 border border-black"
                    style={{ backgroundColor: team?.color || '#FF007F' }}
                  />
                  <span className="font-bold">[{team?.tag || 'CREW'}]</span>
                  <span className="text-arcade-muted">{team?.name}</span>
                  <span
                    className={`font-bold font-mono px-1.5 py-0.2 rounded text-[11px] ${
                      isPositive
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                  </span>
                  <span className="text-arcade-muted">in</span>
                  <span className="text-arcade-cyan font-bold">{game?.name || 'Match'}</span>
                  <span className="text-arcade-border">/</span>
                </div>
              );
            })}

            {/* Event status note */}
            <div className="inline-flex items-center gap-2 text-arcade-white">
              <span className="text-arcade-yellow font-bold uppercase">
                ARENA: {activeEvent?.name}
              </span>
              <span className="text-arcade-muted">— Prize: {activeEvent?.prizePool}</span>
              <span className="text-arcade-border">/</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
