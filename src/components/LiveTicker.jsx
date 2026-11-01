import React from 'react';

export default function LiveTicker({ activeEvent, transactions = [], participants = [], games = [] }) {
  const recent = transactions.slice(-5).reverse();

  return (
    <div className="bg-pop-butter border-b-2 border-pop-ink py-2 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        {/* Ticker Tag */}
        <div className="flex items-center gap-1.5 bg-pop-coral text-white font-arcade text-[10px] px-3 py-1 rounded-lg font-black shrink-0 mr-4 border-2 border-pop-ink shadow-pop-sm">
          <span className="w-2 h-2 rounded-full bg-pop-yellow animate-ping" />
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
                <div key={tx.id} className="inline-flex items-center gap-2 text-pop-ink">
                  <span className="text-base">{participant?.avatar || '👾'}</span>
                  <span className="font-display font-black text-pop-purple">
                    {participant?.name || 'Participant'}
                  </span>
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
                  <span className="text-pop-orange font-display">{game?.name || 'Game'}</span>
                  <span className="text-pop-ink font-black">✦</span>
                </div>
              );
            })}

            {/* Event note */}
            <div className="inline-flex items-center gap-2 text-pop-ink">
              <span className="font-arcade text-xs text-pop-purple uppercase">
                EVENT: {activeEvent?.name}
              </span>
              {activeEvent?.description && (
                <span className="text-pop-muted">— {activeEvent.description}</span>
              )}
              <span className="text-pop-ink font-black">✦</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
