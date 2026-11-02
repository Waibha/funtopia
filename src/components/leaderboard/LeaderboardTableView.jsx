import React from 'react';
import { Trophy, Gamepad2, Coins, Plus, ChevronRight } from 'lucide-react';

export default function LeaderboardTableView({
  leaderboard = [],
  games = [],
  filterGameId = 'all',
  onSelectParticipant,
  onOpenQuickScore,
  isAdmin = false,
}) {
  return (
    <div className="w-full bg-[#0E1627]/95 text-slate-100 rounded-3xl border border-white/15 shadow-fantasy-card overflow-hidden backdrop-blur-xl font-sans">
      {/* Table Subheader with Count & Horizontal Scroll Indicator */}
      <div className="px-5 py-3.5 bg-[#09101E]/90 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <Trophy className="w-4 h-4 text-[#FFC837]" />
          <span className="font-cinzel text-xs text-amber-200 font-bold uppercase tracking-wider">
            CHAMPIONSHIP STANDINGS & GAME-WISE BREAKDOWN
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 font-cinzel text-[9px] font-bold border border-emerald-500/40 shadow-fantasy-emerald">
            {games.length} {games.length === 1 ? 'QUEST TRIAL' : 'QUEST TRIALS'} IN ROTATION
          </span>
        </div>

        {/* Dynamic Scroll Notice when games exist */}
        {games.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] font-jakarta font-medium text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-xl border border-cyan-500/30">
            <span>↔</span>
            <span>Scroll horizontally to view all {games.length} games</span>
          </div>
        )}
      </div>

      {/* Main Horizontally Scrollable Table Container */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[780px]">
          <thead>
            <tr className="bg-[#09101E] text-slate-200 text-xs font-cinzel font-bold border-b border-white/15 select-none">
              {/* Sticky Rank Column */}
              <th className="py-3.5 px-3 text-center w-16 sticky left-0 bg-[#09101E] z-20 border-r border-white/10">
                RANK
              </th>

              {/* Sticky Participant Column */}
              <th className="py-3.5 px-4 min-w-[210px] sm:min-w-[240px] sticky left-16 bg-[#09101E] z-20 border-r border-white/15 shadow-[2px_0_5px_rgba(0,0,0,0.35)]">
                CHAMPION
              </th>

              {/* Game Columns in exact rotation order */}
              {games.map((g, idx) => {
                const isFiltered = filterGameId === g.id;
                return (
                  <th
                    key={g.id}
                    className={`py-3 px-3 text-center min-w-[125px] max-w-[160px] border-r border-white/10 transition-colors ${
                      isFiltered ? 'bg-cyan-950/70 text-[#00F0FF]' : 'bg-[#09101E] text-slate-300'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <span className="text-[10px] font-cinzel text-amber-200 block truncate max-w-[140px] leading-tight font-bold">
                        #{idx + 1} {g.name}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[9px] font-mono text-amber-300 bg-[#161208] px-1.5 py-0.5 rounded border border-[#FFC837]/40 flex items-center gap-0.5">
                          <Coins className="w-2.5 h-2.5 text-[#FFC837]" />
                          {Number(g.cost || 0)}c
                        </span>
                        {!g.isActive && (
                          <span className="text-[8px] bg-slate-800 text-slate-400 px-1 rounded">
                            OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </th>
                );
              })}

              {/* Total Points Column */}
              <th className="py-3.5 px-4 text-right min-w-[130px] bg-[#070D1A] text-[#FFC837] border-l border-white/15">
                TOTAL PTS
              </th>

              {/* Admin Scoring Action Column */}
              {isAdmin && (
                <th className="py-3.5 px-3 text-center min-w-[95px] bg-[#070D1A] text-slate-200 border-l border-white/10">
                  ACTION
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 font-jakarta text-xs text-slate-200">
            {leaderboard.map((participant) => {
              const isRank1 = participant.rank === 1;
              const isRank2 = participant.rank === 2;
              const isRank3 = participant.rank === 3;

              // Background tint based on rank
              const rowBg = isRank1
                ? 'bg-amber-950/20 hover:bg-amber-950/30'
                : isRank2
                ? 'bg-cyan-950/20 hover:bg-cyan-950/30'
                : isRank3
                ? 'bg-orange-950/20 hover:bg-orange-950/30'
                : 'hover:bg-white/5';

              // Sticky columns background to match row
              const stickyBg = isRank1
                ? 'bg-[#181308]'
                : isRank2
                ? 'bg-[#0A1424]'
                : isRank3
                ? 'bg-[#170E08]'
                : 'bg-[#0E1627]';

              const pointsDisplay =
                filterGameId === 'all'
                  ? participant.totalPoints
                  : participant.gameBreakdown?.[filterGameId] || 0;

              return (
                <tr
                  key={participant.id}
                  onClick={() => onSelectParticipant && onSelectParticipant(participant)}
                  className={`${rowBg} transition-colors cursor-pointer group`}
                >
                  {/* Sticky Rank Cell */}
                  <td className={`py-3 px-2 text-center sticky left-0 ${stickyBg} z-10 border-r border-white/10 font-cinzel font-bold text-xs`}>
                    <div
                      className={`w-9 h-9 rounded-xl mx-auto flex items-center justify-center border font-bold ${
                        isRank1
                          ? 'bg-gradient-to-r from-[#FFC837] to-[#FF9E1B] text-[#0A091A] border-amber-200 shadow-fantasy-gold'
                          : isRank2
                          ? 'bg-slate-200 text-[#0A091A] border-slate-300'
                          : isRank3
                          ? 'bg-amber-700 text-white border-amber-500'
                          : 'bg-[#070D1A] text-slate-300 border-white/10'
                      }`}
                    >
                      #{participant.rank}
                    </div>
                  </td>

                  {/* Sticky Participant Identity Cell */}
                  <td className={`py-3 px-3.5 sticky left-16 ${stickyBg} z-10 border-r border-white/15 shadow-[2px_0_5px_rgba(0,0,0,0.25)]`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 via-emerald-500/20 to-teal-500/20 border border-white/15 shadow-fantasy-card flex items-center justify-center text-xl shrink-0">
                        {participant.avatar || '⚔️'}
                      </div>
                      <div className="min-w-0 pr-1">
                        <div className="font-cinzel font-bold text-sm text-slate-100 truncate group-hover:text-[#FFC837] transition-colors">
                          {participant.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 truncate">
                          {participant.usn || participant.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Individual Game Scores */}
                  {games.map((g) => {
                    const score = Number(participant.gameBreakdown?.[g.id] || 0);
                    const isFiltered = filterGameId === g.id;
                    const isBest = participant.bestGame === g.name && score > 0;

                    return (
                      <td
                        key={g.id}
                        className={`py-3 px-3 text-center border-r border-white/10 transition-colors ${
                          isFiltered ? 'bg-cyan-950/30 font-bold' : ''
                        }`}
                      >
                        {score > 0 ? (
                          <div className="inline-flex flex-col items-center">
                            <span
                              className={`px-2.5 py-1 rounded-lg border font-mono font-bold text-xs ${
                                isBest
                                  ? 'bg-[#FFC837]/20 border-[#FFC837] text-amber-200 shadow-fantasy-gold'
                                  : 'bg-[#080E1C] border-white/10 text-slate-200'
                              }`}
                            >
                              {score}
                            </span>
                            {isBest && (
                              <span className="text-[8px] font-cinzel text-amber-300 font-bold uppercase mt-0.5">
                                ★ BEST
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 font-mono text-xs">
                            0
                          </span>
                        )}
                      </td>
                    );
                  })}

                  {/* Total Points Cell */}
                  <td className="py-3 px-4 text-right border-l border-white/15 bg-[#070D1A]/50">
                    <div className="font-mono text-base font-bold text-[#FFC837] leading-none">
                      {pointsDisplay.toLocaleString()}
                      <span className="text-[10px] text-slate-400 font-normal ml-1">PTS</span>
                    </div>
                    {participant.diffFromFirst > 0 ? (
                      <span className="text-[10px] font-mono text-red-300 block mt-0.5">
                        -{participant.diffFromFirst} to #1
                      </span>
                    ) : (
                      <span className="text-[10px] font-cinzel text-emerald-400 font-bold block mt-0.5">
                        ★ 1ST PLACE
                      </span>
                    )}
                  </td>

                  {/* Admin Action Cell */}
                  {isAdmin && (
                    <td className="py-3 px-3 text-center border-l border-white/10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenQuickScore) onOpenQuickScore(participant.id);
                        }}
                        className="btn-fantasy-primary text-[10px] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 mx-auto font-cinzel font-black"
                        title="Score Participant"
                      >
                        <Plus className="w-3 h-3 text-[#0A091A]" />
                        <span>SCORE</span>
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}

            {leaderboard.length === 0 && (
              <tr>
                <td
                  colSpan={games.length + (isAdmin ? 3 : 2)}
                  className="py-12 text-center text-slate-400 font-jakarta text-xs"
                >
                  No champions registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
