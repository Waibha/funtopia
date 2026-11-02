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
  Shield,
  X,
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
          ? 'fixed inset-0 z-50 bg-[#0A091A] overflow-y-auto p-4 sm:p-8 text-slate-100'
          : 'py-4 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ========================================================= */}
        {/* FANTASY REALM CHAMPIONSHIP HERO BANNER                    */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-gradient-to-r from-[#111928] via-[#0E1524] to-[#0A101C] border border-emerald-500/30 p-6 sm:p-8 shadow-fantasy-card text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-cinzel text-[10px] font-bold uppercase border border-emerald-500/40 shadow-fantasy-emerald">
                ● LIVE LEADERBOARD
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFC837]/15 text-[#FFC837] font-cinzel text-xs font-bold border border-[#FFC837]/40">
                VERIFIED SCORES
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-cinzel font-black tracking-wider text-[#FFC837] fantasy-title-gold">
              CHAMPIONSHIP LEADERBOARD
            </h1>
            <p className="text-slate-300 font-jakarta text-xs sm:text-base mt-2 max-w-2xl font-medium">
              {activeEvent?.name ? `${activeEvent.name} • ` : ''}Individual participant glory, live standings, and verified quest trial breakdown.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto justify-end relative z-10">
            <button
              onClick={() => {
                soundFx.play('fanfare');
                triggerCelebration();
              }}
              className="btn-fantasy-primary flex items-center gap-2 text-xs py-3 px-5 font-cinzel font-bold"
            >
              <Sparkles className="w-4 h-4 text-[#0A091A]" />
              <span>CELEBRATE</span>
            </button>

            <button
              onClick={toggleBroadcast}
              className="btn-fantasy-subtle flex items-center gap-1.5 font-cinzel text-xs py-2.5 px-4"
            >
              {broadcastMode ? (
                <>
                  <Minimize2 className="w-4 h-4 text-[#00F0FF]" />
                  <span>WINDOWED</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-[#00F0FF]" />
                  <span>FULLSCREEN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* KINGDOM CHAMPIONS PODIUM                                  */}
        {/* ========================================================= */}
        <section aria-label="Individual Podium">
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-2 font-cinzel text-xs text-[#FFC837] font-bold">
              <Trophy className="w-4 h-4 text-[#FFC837]" />
              <span>TOP CHAMPIONS PODIUM</span>
            </div>
            <span className="text-xs font-jakarta text-slate-400 hidden sm:inline">
              ✦ Click any podium step to inspect champion breakdown
            </span>
          </div>

          <Podium topParticipants={topThree} onSelectParticipant={handleParticipantClick} />
        </section>

        {/* ========================================================= */}
        {/* QUEST FILTER TABS                                         */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-3 flex-wrap bg-[#0D1527] p-4 rounded-3xl border border-white/10 shadow-fantasy-card">
          <div className="flex items-center gap-2 font-cinzel text-xs font-bold text-amber-200 tracking-wider">
            <Gamepad2 className="w-4 h-4 text-[#00F0FF]" />
            <span>FILTER BY QUEST:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              onClick={() => handleFilterClick('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-bold transition-all ${
                filterGameId === 'all'
                  ? 'bg-gradient-to-r from-[#FFC837] to-[#FF9E1B] text-[#0A091A] font-black shadow-fantasy-gold -translate-y-0.5'
                  : 'bg-[#080D1A] text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              All Scores
            </button>
            {games.map((g) => (
              <button
                key={g.id}
                onClick={() => handleFilterClick(g.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  filterGameId === g.id
                    ? 'bg-cyan-500 text-[#0A091A] font-black shadow-fantasy-cyan -translate-y-0.5'
                    : 'bg-[#080D1A] text-slate-300 hover:text-white border border-white/10'
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
          <div className="rounded-3xl bg-[#0F1626] border border-white/10 p-5 shadow-fantasy-card text-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-cinzel text-xs text-[#00F0FF] font-bold">
                <Activity className="w-4 h-4 text-[#00F0FF]" />
                <span>RECENT DISPATCHED SCORES</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
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
                      className="p-3 rounded-xl bg-[#080E1C] border border-white/10 text-xs font-jakarta"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{participant?.avatar || '⚔️'}</span>
                          <span className="truncate max-w-[140px]">{participant?.name || 'Participant'}</span>
                        </span>
                        <span
                          className={`font-bold font-mono px-2 py-0.5 rounded border text-xs ${
                            isPositive
                              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                              : 'bg-red-950/80 border-red-500/40 text-red-300'
                          }`}
                        >
                          {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px] flex justify-between mt-1 font-mono">
                        <span>{game?.name || 'General Quest'}</span>
                        <span>
                          {new Date(tx.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {tx.note && (
                        <p className="text-[11px] text-amber-200 mt-1 italic font-medium truncate">
                          "{tx.note}"
                        </p>
                      )}
                    </div>
                  );
                })}

              {transactions.length === 0 && (
                <div className="text-center py-8 text-slate-400 font-jakarta text-xs">
                  No scores recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Active Tournament Games & Costs Card */}
          <div className="rounded-3xl bg-[#0F1626] border border-white/10 p-5 shadow-fantasy-card text-slate-100">
            <span className="font-cinzel text-xs text-[#FFC837] font-bold block mb-3 uppercase tracking-wider">
              ROTATING QUEST TRIALS ({games.length})
            </span>
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {games.map((g, idx) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#080E1C] text-slate-200 border border-white/10 text-xs font-jakarta font-medium"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-cinzel text-slate-400 font-bold">#{idx + 1}</span>
                    <div>
                      <span className="font-bold text-slate-100 block">{g.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Entry: {Number(g.cost || 0)} gold coins</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded border font-cinzel text-[9px] font-bold ${
                      g.isActive ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {g.isActive ? 'ACTIVE' : 'OFFLINE'}
                    </span>
                  </div>
                </div>
              ))}

              {games.length === 0 && (
                <div className="text-center py-8 text-slate-400 font-jakarta text-xs">
                  No games configured.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* INDIVIDUAL PARTICIPANT INSPECTION MODAL                   */}
        {/* ========================================================= */}
        {selectedParticipant && (
          <div
            className="fixed inset-0 z-50 bg-[#0A091A]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setSelectedParticipant(null)}
          >
            <div
              className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#111928] via-[#0E1524] to-[#0A101C] border border-emerald-500/40 p-6 shadow-fantasy-card text-white relative animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedParticipant(null)}
                className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 via-emerald-500/20 to-teal-500/20 border border-[#FFC837]/40 shadow-fantasy-gold flex items-center justify-center text-3xl shrink-0">
                  {selectedParticipant.avatar || '⚔️'}
                </div>
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-amber-200">
                    {selectedParticipant.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-cinzel text-xs text-emerald-300 font-bold">
                      RANK #{selectedParticipant.rank}
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="font-mono text-xs text-slate-300">
                      {selectedParticipant.usn || selectedParticipant.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#080E1C] p-3.5 rounded-xl border border-[#FFC837]/30 text-center">
                  <span className="text-[10px] font-cinzel text-[#FFC837] block font-bold">TOTAL RENOWN</span>
                  <span className="font-jakarta text-xl font-bold text-white mt-0.5 block">
                    {selectedParticipant.totalPoints.toLocaleString()} PTS
                  </span>
                </div>
                <div className="bg-[#080E1C] p-3.5 rounded-xl border border-emerald-500/30 text-center">
                  <span className="text-[10px] font-cinzel text-emerald-400 block font-bold">SIGNATURE TRIAL</span>
                  <span className="font-jakarta text-xs font-bold text-slate-200 truncate mt-1 block">
                    {selectedParticipant.bestGame || 'N/A'}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-cinzel text-xs text-[#FFC837] font-bold block mb-2 uppercase">
                  QUEST BREAKDOWN
                </span>
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {games.map((g) => {
                    const sc = Number(selectedParticipant.gameBreakdown?.[g.id] || 0);
                    return (
                      <div
                        key={g.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#080E1C] border border-white/5 text-xs font-jakarta"
                      >
                        <span className="text-slate-300">{g.name}</span>
                        <span className="font-mono font-bold text-amber-200">
                          {sc > 0 ? `+${sc} PTS` : '0 PTS'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
