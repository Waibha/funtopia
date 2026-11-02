import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  Maximize2,
  Minimize2,
  Activity,
  Gamepad2,
  User,
  Coins,
} from 'lucide-react';
import Podium from '../components/Podium';
import LeaderboardTableView from '../components/leaderboard/LeaderboardTableView';
import { soundFx } from '../utilities/soundFx';

export default function PublicLeaderboard({
  leaderboard = [],
  activeEvent,
  games = [],
  transactions = [],
  triggerCelebration,
}) {
  const [broadcastMode, setBroadcastMode] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [filterGameId, setFilterGameId] = useState('all');

  const topThree = leaderboard.slice(0, 3);

  const toggleBroadcast = () => {
    soundFx.play('click');
    setBroadcastMode(!broadcastMode);
  };

  const handleParticipantClick = (participant) => {
    soundFx.play('switch');
    setSelectedParticipant(participant);
  };

  const handleFilterClick = (gId) => {
    soundFx.play('click');
    setFilterGameId(gId);
  };

  return (
    <div
      className={`transition-all duration-300 font-sans ${
        broadcastMode
          ? 'fixed inset-0 z-50 bg-[#451B75] overflow-y-auto p-4 sm:p-8 text-white'
          : 'py-4 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ========================================================= */}
        {/* RETRO POP CHAMPIONSHIP HERO BANNER (LAYERED & GRAPHIC)   */}
        {/* ========================================================= */}
        <div className="bg-[#40186D] rounded-3xl border-4 border-[#0D0518] p-6 sm:p-8 shadow-pixel-xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle Graphic Accents */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-[#FF5FA0] rounded-full border-4 border-[#0D0518] opacity-25 pointer-events-none" />
          <div className="absolute top-2 right-40 w-16 h-16 bg-[#FFDE25] rounded-full border-3 border-[#0D0518] opacity-20 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#FFDE25] text-[#0D0518] font-arcade text-[10px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm">
                ● LIVE LEADERBOARD
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[#FFDE25] font-mono text-xs font-bold border border-white/30">
                VERIFIED SCORES
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bungee tracking-wide text-[#FFDE25] pixel-title-yellow">
              CHAMPIONSHIP LEADERBOARD
            </h1>
            <p className="text-purple-200 font-mono text-xs sm:text-base mt-2 max-w-2xl font-medium">
              {activeEvent?.name ? `${activeEvent.name} • ` : ''}Individual participant scores, live rankings, and verified game breakdown.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto justify-end relative z-10">
            <button
              onClick={() => {
                soundFx.play('fanfare');
                triggerCelebration();
              }}
              className="btn-pixel-yellow flex items-center gap-2 text-xs"
            >
              <Sparkles className="w-4 h-4 text-[#FF5FA0] fill-[#FF5FA0]" />
              <span>CELEBRATE</span>
            </button>

            <button
              onClick={toggleBroadcast}
              className="btn-pixel-white flex items-center gap-1.5 font-mono text-xs"
            >
              {broadcastMode ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>WINDOWED</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>FULLSCREEN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RETRO ARCADE PODIUM                                       */}
        {/* ========================================================= */}
        <section aria-label="Individual Podium">
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-2 font-arcade text-xs text-[#FFDE25] font-black">
              <Trophy className="w-4 h-4 text-[#FF7A00]" />
              <span>TOP PARTICIPANTS PODIUM</span>
            </div>
            <span className="text-xs font-mono text-purple-200 hidden sm:inline font-bold">
              ✦ Click any podium step to inspect participant breakdown
            </span>
          </div>

          <Podium topParticipants={topThree} onSelectParticipant={handleParticipantClick} />
        </section>

        {/* ========================================================= */}
        {/* GAME FILTER TABS                                          */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-3 flex-wrap bg-[#40186D] p-4 rounded-3xl border-4 border-[#0D0518] shadow-pixel-lg">
          <div className="flex items-center gap-2 font-arcade text-xs font-black text-[#FFDE25] tracking-wider">
            <Gamepad2 className="w-4 h-4 text-[#00F0FF]" />
            <span>FILTER BY GAME:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              onClick={() => handleFilterClick('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-black transition-all hover:-translate-y-0.5 active:translate-y-0.5 ${
                filterGameId === 'all'
                  ? 'bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518] shadow-pixel-sm -translate-y-0.5'
                  : 'bg-[#200B3B] text-purple-200 hover:text-white border border-[#0D0518]'
              }`}
            >
              All Scores
            </button>
            {games.map((g) => (
              <button
                key={g.id}
                onClick={() => handleFilterClick(g.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-black whitespace-nowrap transition-all flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0.5 ${
                  filterGameId === g.id
                    ? 'bg-[#FF5FA0] text-white border-2 border-[#0D0518] shadow-pixel-sm -translate-y-0.5'
                    : 'bg-[#200B3B] text-purple-200 hover:text-white border border-[#0D0518]'
                }`}
              >
                <span>{g.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RESPONSIVE FULL-WIDTH CHAMPIONSHIP LEADERBOARD TABLE     */}
        {/* ========================================================= */}
        <section aria-label="Championship Leaderboard Table">
          <LeaderboardTableView
            leaderboard={leaderboard}
            games={games}
            filterGameId={filterGameId}
            onSelectParticipant={handleParticipantClick}
            isAdmin={false}
          />
        </section>

        {/* ========================================================= */}
        {/* ANCILLARY INFORMATION: ACTIVITY FEED & ACTIVE GAMES       */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Live Feed Card */}
          <div className="bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-5 shadow-pixel-lg">
            <div className="flex items-center justify-between mb-4 border-b-3 border-[#0D0518] pb-3">
              <div className="flex items-center gap-2 font-arcade text-xs text-[#0D0518] font-black">
                <Activity className="w-4 h-4 text-[#FF5FA0]" />
                <span>RECENT DISPATCHED SCORES</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#28C76F] animate-ping" />
            </div>

            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {transactions
                .slice()
                .reverse()
                .map((tx) => {
                  const participant = leaderboard.find((p) => p.id === tx.participantId);
                  const game = games.find((g) => g.id === tx.gameId);
                  const isPositive = Number(tx.pointsDelta) >= 0;

                  return (
                    <div
                      key={tx.id}
                      className="p-3 rounded-xl bg-[#FAF7EE] border-2 border-[#0D0518] text-xs font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[#0D0518] flex items-center gap-1.5">
                          <span>{participant?.avatar || '👾'}</span>
                          <span className="truncate max-w-[140px]">{participant?.name || 'Participant'}</span>
                        </span>
                        <span
                          className={`font-black font-mono px-2 py-0.5 rounded border border-[#0D0518] ${
                            isPositive
                              ? 'bg-[#28C76F] text-[#0D0518]'
                              : 'bg-[#FF5FA0] text-white'
                          }`}
                        >
                          {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                        </span>
                      </div>
                      <div className="text-gray-500 text-[11px] flex justify-between mt-1 font-bold">
                        <span>{game?.name || 'General Score'}</span>
                        <span>
                          {new Date(tx.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {tx.note && (
                        <p className="text-[11px] text-[#0D0518] mt-1 italic font-medium truncate">
                          "{tx.note}"
                        </p>
                      )}
                    </div>
                  );
                })}

              {transactions.length === 0 && (
                <div className="text-center py-8 text-gray-500 font-mono text-xs font-bold">
                  No scores recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Active Tournament Games & Costs Card */}
          <div className="bg-[#40186D] rounded-3xl border-4 border-[#0D0518] p-5 shadow-pixel-lg text-white">
            <span className="font-arcade text-xs text-[#FFDE25] font-black block mb-3 uppercase tracking-wider">
              ROTATING TOURNAMENT GAMES ({games.length})
            </span>
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {games.map((g, idx) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7EE] text-[#0D0518] border-2 border-[#0D0518] text-xs font-mono font-bold"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-arcade text-gray-500 font-black">#{idx + 1}</span>
                    <div>
                      <span className="font-black text-[#0D0518] block">{g.name}</span>
                      <span className="text-[10px] text-gray-500 font-normal">Entry: {Number(g.cost || 0)} virtual coins</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded border border-[#0D0518] font-black font-arcade text-[9px] ${
                    g.isActive ? 'bg-[#28C76F] text-[#0D0518]' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {g.isActive ? 'ACTIVE' : 'OFFLINE'}
                  </span>
                </div>
              ))}
              {games.length === 0 && (
                <div className="text-center py-8 text-purple-200 font-mono text-xs">
                  No games configured yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Participant Inspection Modal */}
        {selectedParticipant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0518]/80 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 sm:p-8 shadow-pixel-xl">
              <button
                onClick={() => setSelectedParticipant(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-[#0D0518] font-mono text-lg font-black"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel flex items-center justify-center text-4xl">
                  {selectedParticipant.avatar || '👤'}
                </div>
                <div>
                  <span className="font-arcade text-xs text-[#FF5FA0] font-black">
                    Rank #{selectedParticipant.rank}
                  </span>
                  <h3 className="font-bungee text-2xl text-[#0D0518] mt-0.5">
                    {selectedParticipant.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono font-bold">
                    USN: {selectedParticipant.usn || selectedParticipant.email || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Game Breakdown */}
              <div className="space-y-2 mb-6">
                <span className="text-xs font-arcade text-[#0D0518] font-black block">
                  SCORES BY GAME:
                </span>
                <div className="grid grid-cols-2 gap-2 max-h-[48vh] overflow-y-auto pr-1">
                  {games.map((g) => (
                    <div
                      key={g.id}
                      className="p-2.5 rounded-xl bg-[#FAF7EE] border-2 border-[#0D0518] flex items-center justify-between text-xs font-mono font-bold"
                    >
                      <span className="truncate">{g.name}</span>
                      <span className="font-black text-[#5C2D91]">
                        {selectedParticipant.gameBreakdown[g.id] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-[#0D0518]">
                <span className="font-mono text-xs text-gray-500 font-bold">Total Score:</span>
                <span className="font-mono text-2xl font-black text-[#0D0518] flex items-center gap-1">
                  🪙 {selectedParticipant.totalPoints.toLocaleString()} PTS
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
