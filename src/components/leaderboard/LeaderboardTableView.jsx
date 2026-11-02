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
    <div className="w-full bg-white text-[#0D0518] rounded-3xl border-4 border-[#0D0518] shadow-pixel-xl overflow-hidden">
      {/* Table Subheader with Count & Horizontal Scroll Indicator */}
      <div className="px-5 py-3.5 bg-[#FAF7EE] border-b-3 border-[#0D0518] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <Trophy className="w-4 h-4 text-[#FF7A00]" />
          <span className="font-arcade text-xs text-[#0D0518] font-black uppercase tracking-wider">
            CHAMPIONSHIP STANDINGS & GAME-WISE BREAKDOWN
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#FFDE25] text-[#0D0518] font-arcade text-[9px] font-black border-2 border-[#0D0518] shadow-pixel-sm">
            {games.length} {games.length === 1 ? 'GAME' : 'GAMES'} IN ROTATION
          </span>
        </div>

        {/* Dynamic Scroll Notice when games exist */}
        {games.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-black text-[#5C2D91] bg-purple-100 px-3 py-1 rounded-xl border border-purple-300">
            <span>↔</span>
            <span>Scroll horizontally to view all {games.length} games</span>
          </div>
        )}
      </div>

      {/* Main Horizontally Scrollable Table Container */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[780px]">
          <thead>
            <tr className="bg-[#40186D] text-white text-xs font-mono font-black border-b-4 border-[#0D0518] select-none">
              {/* Sticky Rank Column */}
              <th className="py-3.5 px-3 text-center w-16 sticky left-0 bg-[#40186D] z-20 border-r-2 border-[#0D0518]">
                RANK
              </th>

              {/* Sticky Participant Column */}
              <th className="py-3.5 px-4 min-w-[210px] sm:min-w-[240px] sticky left-16 bg-[#40186D] z-20 border-r-3 border-[#0D0518] shadow-[2px_0_5px_rgba(0,0,0,0.15)]">
                PARTICIPANT
              </th>

              {/* Game Columns in exact rotation order */}
              {games.map((g, idx) => {
                const isFiltered = filterGameId === g.id;
                return (
                  <th
                    key={g.id}
                    className={`py-3 px-3 text-center min-w-[125px] max-w-[160px] border-r-2 border-[#0D0518]/30 transition-colors ${
                      isFiltered ? 'bg-[#FF5FA0] text-white' : 'bg-[#40186D] text-white'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <span className="text-[10px] font-arcade text-[#FFDE25] block truncate max-w-[140px] leading-tight font-black">
                        #{idx + 1} {g.name}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[9px] font-mono text-purple-200 bg-[#200B3B] px-1.5 py-0.2 rounded border border-[#FFDE25]/50 flex items-center gap-0.5">
                          <Coins className="w-2.5 h-2.5 text-[#FFDE25]" />
                          {Number(g.cost || 0)}c
                        </span>
                        {!g.isActive && (
                          <span className="text-[8px] bg-gray-600 text-gray-200 px-1 rounded">
                            OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </th>
                );
              })}

              {/* Total Points Column */}
              <th className="py-3.5 px-4 text-right min-w-[130px] bg-[#32125A] text-[#FFDE25] border-l-3 border-[#0D0518]">
                TOTAL PTS
              </th>

              {/* Admin Scoring Action Column */}
              {isAdmin && (
                <th className="py-3.5 px-3 text-center min-w-[95px] bg-[#32125A] text-white border-l-2 border-[#0D0518]">
                  ACTION
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y-2 divide-[#0D0518]/20 font-mono text-xs text-[#0D0518]">
            {leaderboard.map((participant) => {
              const isRank1 = participant.rank === 1;
              const isRank2 = participant.rank === 2;
              const isRank3 = participant.rank === 3;

              // Background tint based on rank
              const rowBg = isRank1
                ? 'bg-[#FFFDE5] hover:bg-[#FFF9C4]'
                : isRank2
                ? 'bg-[#F9FAFB] hover:bg-gray-100'
                : isRank3
                ? 'bg-[#FFF8F3] hover:bg-orange-50'
                : 'bg-white hover:bg-[#FAF7EE]';

              // Sticky columns background to match row
              const stickyBg = isRank1
                ? 'bg-[#FFFDE5]'
                : isRank2
                ? 'bg-[#F9FAFB]'
                : isRank3
                ? 'bg-[#FFF8F3]'
                : 'bg-white';

              const pointsDisplay =
                filterGameId === 'all'
                  ? participant.totalPoints
                  : participant.gameBreakdown?.[filterGameId] || 0;

              return (
                <tr
                  key={participant.id}
                  onClick={() => onSelectParticipant && onSelectParticipant(participant)}
                  className={`${rowBg} transition-colors cursor-pointer group arcade-table-row`}
                >
                  {/* Sticky Rank Cell */}
                  <td className={`py-3 px-2 text-center sticky left-0 ${stickyBg} z-10 border-r-2 border-[#0D0518] font-arcade font-black text-xs`}>
                    <div
                      className={`w-9 h-9 rounded-xl mx-auto flex items-center justify-center border-2 border-[#0D0518] shadow-pixel-sm transition-transform group-hover:scale-105 ${
                        isRank1
                          ? 'bg-[#FFDE25] text-[#0D0518] glow-champion-pulse'
                          : isRank2
                          ? 'bg-[#D1D5DB] text-[#0D0518]'
                          : isRank3
                          ? 'bg-[#E08552] text-white'
                          : 'bg-[#FAF7EE] text-[#0D0518]'
                      }`}
                    >
                      {isRank1 ? '👑' : `#${participant.rank}`}
                    </div>
                  </td>

                  {/* Sticky Participant Identity Cell */}
                  <td className={`py-3 px-3.5 sticky left-16 ${stickyBg} z-10 border-r-3 border-[#0D0518] shadow-[2px_0_5px_rgba(0,0,0,0.08)]`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#0D0518] shadow-pixel-sm flex items-center justify-center text-xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        {participant.avatar || '👾'}
                      </div>
                      <div className="min-w-0 pr-1">
                        <div className="font-display font-black text-sm text-[#0D0518] truncate group-hover:text-[#5C2D91] transition-colors">
                          {participant.name}
                        </div>
                        <div className="text-[11px] font-mono text-gray-500 truncate">
                          {participant.email}
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
                        className={`py-3 px-3 text-center border-r-2 border-[#0D0518]/20 transition-colors ${
                          isFiltered ? 'bg-[#FF5FA0]/10 font-black' : ''
                        }`}
                      >
                        {score > 0 ? (
                          <div className="inline-flex flex-col items-center">
                            <span
                              className={`px-2.5 py-1 rounded-lg border-2 border-[#0D0518] font-mono font-black text-xs shadow-pixel-sm ${
                                isBest
                                  ? 'bg-[#FFDE25] text-[#0D0518]'
                                  : 'bg-[#FAF7EE] text-[#5C2D91]'
                              }`}
                            >
                              {score}
                            </span>
                            {isBest && (
                              <span className="text-[8px] font-arcade text-[#FF7A00] font-black uppercase mt-0.5">
                                ★ BEST
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 font-mono text-xs font-bold">
                            0
                          </span>
                        )}
                      </td>
                    );
                  })}

                  {/* Total Points Cell */}
                  <td className="py-3 px-4 text-right border-l-3 border-[#0D0518] bg-[#FAF7EE]/50">
                    <div className="font-mono text-lg font-black text-[#0D0518] leading-none">
                      {pointsDisplay.toLocaleString()}
                      <span className="text-[10px] text-gray-500 font-bold ml-1">PTS</span>
                    </div>
                    {participant.diffFromFirst > 0 ? (
                      <span className="text-[10px] font-mono text-[#FF5FA0] font-black block mt-0.5">
                        -{participant.diffFromFirst} to #1
                      </span>
                    ) : (
                      <span className="text-[10px] font-arcade text-[#28C76F] font-black block mt-0.5">
                        ★ 1ST PLACE
                      </span>
                    )}
                  </td>

                  {/* Admin Action Cell */}
                  {isAdmin && (
                    <td className="py-3 px-2 text-center border-l-2 border-[#0D0518] bg-[#FAF7EE]/50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenQuickScore) onOpenQuickScore(participant.id);
                        }}
                        title={`Score ${participant.name}`}
                        className="btn-pixel-yellow text-[10px] py-1 px-2.5 flex items-center justify-center gap-1 mx-auto font-black"
                      >
                        <Plus className="w-3 h-3" />
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
                  className="py-12 text-center text-gray-500 font-mono text-xs font-bold bg-white"
                >
                  No participants registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
