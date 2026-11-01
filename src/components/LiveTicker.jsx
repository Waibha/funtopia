import React from 'react';
import { Flame, Radio, Zap } from 'lucide-react';

export default function LiveTicker({ activeEvent, transactions, teams, games }) {
  // Extract top 4 recent transactions
  const recent = transactions.slice(-4).reverse();

  return (
    <div className="bg-[#0b0c24] border-y border-purple-500/20 py-2 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        {/* Status Tag */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-arcade-pink to-arcade-purple px-2.5 py-1 rounded text-[10px] font-arcade tracking-wider text-white shrink-0 shadow-sm mr-4">
          <Radio className="w-3 h-3 animate-pulse text-white" />
          <span>CHAMPIONSHIP FEED</span>
        </div>

        {/* Marquee Content */}
        <div className="overflow-hidden whitespace-nowrap flex items-center text-xs font-mono">
          <div className="inline-flex items-center gap-8 animate-marquee">
            {recent.map((tx) => {
              const team = teams.find((t) => t.id === tx.teamId);
              const game = games.find((g) => g.id === tx.gameId);
              const isPositive = Number(tx.pointsDelta) >= 0;

              return (
                <div key={tx.id} className="inline-flex items-center gap-2 text-gray-300">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: team?.color || '#FF007F' }}
                  />
                  <span className="font-bold text-white">[{team?.tag || 'TEAM'}]</span>
                  <span className="text-purple-300 font-display">{team?.name}</span>
                  <span className="text-gray-400">scored</span>
                  <span
                    className={`font-bold font-mono px-1.5 py-0.5 rounded text-[11px] ${
                      isPositive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                  </span>
                  <span className="text-gray-400">in</span>
                  <span className="text-arcade-cyan font-display">{game?.name || 'Match'}</span>
                  <span className="text-gray-600">✦</span>
                </div>
              );
            })}

            {/* Event status note */}
            <div className="inline-flex items-center gap-2 text-gray-300">
              <Zap className="w-3.5 h-3.5 text-arcade-yellow" />
              <span className="text-arcade-yellow font-display font-semibold">
                ACTIVE ARENA: {activeEvent?.name}
              </span>
              <span className="text-gray-400">— Grand prize: {activeEvent?.prizePool}</span>
              <span className="text-gray-600">✦</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
