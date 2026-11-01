import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  Gamepad2,
  Maximize2,
  Minimize2,
  ChevronRight,
  TrendingUp,
  Activity,
  Shield,
  Layers,
} from 'lucide-react';
import Podium from '../components/Podium';
import { soundFx } from '../utilities/soundFx';

export default function PublicLeaderboard({
  leaderboard,
  activeEvent,
  games,
  transactions,
  teams,
  triggerCelebration,
}) {
  const [broadcastMode, setBroadcastMode] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [filterGameId, setFilterGameId] = useState('all');

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  const toggleBroadcast = () => {
    soundFx.play('click');
    setBroadcastMode(!broadcastMode);
  };

  const handleTeamClick = (team) => {
    soundFx.play('switch');
    setSelectedTeam(team);
  };

  return (
    <div className={`transition-all duration-500 ${broadcastMode ? 'fixed inset-0 z-50 bg-[#05060f] overflow-y-auto p-4 sm:p-8' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* CHAMPIONSHIP HEADER MARQUEE */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#0d0f2b] via-[#151336] to-[#0d0f2b] border border-purple-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
          {/* Subtle cosmic particles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-arcade-cyan/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-arcade-pink/15 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded bg-arcade-pink/20 text-arcade-pink border border-arcade-pink/40 font-arcade text-[10px] tracking-wider uppercase animate-pulse">
                  ● LIVE BROADCAST
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-500/30 font-mono text-xs">
                  {activeEvent?.code || 'CRC-26'}
                </span>
                <span className="text-xs font-mono text-gray-400">
                  {activeEvent?.location}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bungee tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-arcade-yellow via-white to-arcade-cyan drop-shadow-md">
                {activeEvent?.name || 'COSMIC RETRO CHAMPIONSHIP'}
              </h1>
              <p className="text-gray-300 font-sans text-sm sm:text-base max-w-2xl mt-1">
                {activeEvent?.description}
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
              <button
                onClick={() => {
                  soundFx.play('fanfare');
                  triggerCelebration();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-arcade-pink to-purple-600 text-white font-display text-xs font-bold tracking-wider hover:scale-105 active:scale-95 shadow-arcade-button-pink transition-all"
              >
                <Sparkles className="w-4 h-4 text-arcade-yellow animate-spin" />
                <span>CELEBRATE WINNERS</span>
              </button>

              <button
                onClick={toggleBroadcast}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 border border-purple-500/30 text-gray-300 hover:text-white hover:bg-white/10 text-xs font-mono transition-all"
                title="Toggle Fullscreen Arena Kiosk Mode"
              >
                {broadcastMode ? (
                  <>
                    <Minimize2 className="w-4 h-4 text-arcade-cyan" />
                    <span className="hidden sm:inline">EXIT ARENA</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 text-arcade-cyan" />
                    <span className="hidden sm:inline">ARENA DISPLAY</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* WINNER PODIUM */}
        <section aria-label="Winner Podium">
          <div className="flex items-center justify-between mb-2 px-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-arcade-yellow" />
              <h2 className="font-arcade text-xs sm:text-sm text-arcade-yellow tracking-wider">
                CHAMPIONSHIP PODIUM
              </h2>
            </div>
            <span className="text-xs font-mono text-purple-300">
              Click a team to inspect stats
            </span>
          </div>

          <Podium topTeams={topThree} onSelectTeam={handleTeamClick} />
        </section>

        {/* GAME DISCIPLINE FILTER BAR */}
        <div className="flex items-center justify-between gap-4 flex-wrap bg-[#0b0c24] p-3 rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-arcade-cyan" />
            <span className="font-display text-xs font-bold text-gray-300 tracking-wider">
              DISCIPLINE BREAKDOWN:
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => {
                soundFx.play('click');
                setFilterGameId('all');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                filterGameId === 'all'
                  ? 'bg-arcade-cyan text-slate-950 font-bold shadow-neon-cyan'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              All Matches
            </button>
            {games.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  soundFx.play('click');
                  setFilterGameId(g.id);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                  filterGameId === g.id
                    ? 'bg-purple-600 text-white font-bold shadow-neon-purple'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {g.icon} {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* FULL LEADERBOARD STANDINGS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Standings List (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-mono text-gray-400">
              <span>RANK & CREW</span>
              <span>GAME MATRIX / POINTS</span>
            </div>

            {leaderboard.map((team) => {
              const isTopThree = team.rank <= 3;
              const pointsDisplay =
                filterGameId === 'all'
                  ? team.totalPoints
                  : team.gameBreakdown[filterGameId] || 0;

              return (
                <div
                  key={team.id}
                  onClick={() => handleTeamClick(team)}
                  className={`group relative rounded-xl p-4 transition-all duration-200 cursor-pointer border ${
                    team.rank === 1
                      ? 'bg-gradient-to-r from-amber-950/40 via-[#15122e] to-[#0e1028] border-arcade-yellow/60 hover:border-arcade-yellow shadow-lg'
                      : team.rank === 2
                      ? 'bg-gradient-to-r from-slate-900/50 via-[#15122e] to-[#0e1028] border-slate-400/40 hover:border-slate-300'
                      : team.rank === 3
                      ? 'bg-gradient-to-r from-stone-900/50 via-[#15122e] to-[#0e1028] border-amber-700/40 hover:border-amber-600'
                      : 'bg-[#0d0f28]/70 border-purple-500/20 hover:border-purple-500/50 hover:bg-[#111438]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Rank & Team Identity */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Rank Token */}
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center font-arcade text-xs sm:text-sm font-bold shrink-0 ${
                          team.rank === 1
                            ? 'bg-gradient-to-br from-arcade-yellow to-amber-500 text-slate-950 shadow-neon-yellow'
                            : team.rank === 2
                            ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950'
                            : team.rank === 3
                            ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
                            : 'bg-purple-950/60 border border-purple-500/30 text-purple-300'
                        }`}
                      >
                        #{team.rank}
                      </div>

                      {/* Team Avatar & Emblem */}
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border relative"
                        style={{
                          backgroundColor: `${team.color}15`,
                          borderColor: `${team.color}60`,
                        }}
                      >
                        <span>{team.avatar}</span>
                      </div>

                      {/* Name & Tag */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-xs px-1.5 py-0.5 rounded font-bold"
                            style={{
                              backgroundColor: `${team.color}20`,
                              color: team.color,
                            }}
                          >
                            [{team.tag}]
                          </span>
                          <h4 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-arcade-cyan transition-colors">
                            {team.name}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-400 font-sans hidden sm:block truncate max-w-xs">
                          {team.motto}
                        </p>
                      </div>
                    </div>

                    {/* Game-wise Breakdown Pills & Total Points */}
                    <div className="flex items-center gap-4">
                      {/* Game pills (desktop) */}
                      <div className="hidden md:flex items-center gap-1.5">
                        {games.map((g) => (
                          <div
                            key={g.id}
                            title={`${g.name}: ${team.gameBreakdown[g.id] || 0} PTS`}
                            className="text-center px-2 py-1 rounded bg-[#060818] border border-purple-500/10 text-[10px] font-mono text-gray-400"
                          >
                            <span className="block text-[9px] text-gray-500">{g.icon}</span>
                            <span className="font-bold text-purple-300">
                              {team.gameBreakdown[g.id] || 0}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total Score */}
                      <div className="text-right shrink-0">
                        <div className="font-mono text-lg sm:text-2xl font-extrabold text-white group-hover:text-arcade-yellow transition-colors tracking-tight">
                          {pointsDisplay.toLocaleString()}
                          <span className="text-xs text-purple-400 font-mono ml-1">PTS</span>
                        </div>
                        {team.diffFromFirst > 0 ? (
                          <span className="text-[11px] font-mono text-red-400/80">
                            -{team.diffFromFirst} to #1
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-emerald-400">
                            LEADER
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Event Feed & Quick Stats */}
          <div className="space-y-6">
            {/* Live Scoring Stream Card */}
            <div className="rounded-2xl bg-[#0d0f28]/90 border border-purple-500/25 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-arcade-pink" />
                  <h3 className="font-arcade text-xs text-white tracking-wider">
                    LIVE SCORE STREAM
                  </h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {transactions
                  .slice()
                  .reverse()
                  .map((tx) => {
                    const team = teams.find((t) => t.id === tx.teamId);
                    const game = games.find((g) => g.id === tx.gameId);
                    const isPositive = Number(tx.pointsDelta) >= 0;

                    return (
                      <div
                        key={tx.id}
                        className="p-3 rounded-xl bg-[#070817] border border-purple-500/10 hover:border-purple-500/30 transition-all text-xs font-mono"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span>{team?.avatar}</span>
                            <span style={{ color: team?.color }}>{team?.name}</span>
                          </div>
                          <span
                            className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                              isPositive
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                          </span>
                        </div>
                        <div className="text-gray-400 text-[11px] flex items-center justify-between">
                          <span>
                            {game?.icon} {game?.name}
                          </span>
                          <span className="text-gray-500">
                            {new Date(tx.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 italic truncate">
                          "{tx.reason}"
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Championship Discipline Card */}
            <div className="rounded-2xl bg-[#0d0f28]/90 border border-purple-500/25 p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-arcade-cyan" />
                <h3 className="font-arcade text-xs text-white tracking-wider">
                  EVENT DISCIPLINES
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-sans mb-3">
                Active games configured for the current tournament:
              </p>
              <div className="space-y-2">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#070818] border border-purple-500/15"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{game.icon}</span>
                      <div>
                        <p className="font-display font-semibold text-xs text-white">
                          {game.name}
                        </p>
                        <span className="text-[10px] font-mono text-purple-300">
                          {game.category}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-arcade-yellow font-bold">
                      {game.basePoints} BASE PTS
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TEAM INSPECTION MODAL */}
        {selectedTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg rounded-2xl bg-[#0d0f28] border-2 border-purple-500/40 p-6 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setSelectedTeam(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white font-mono text-lg"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2"
                  style={{
                    backgroundColor: `${selectedTeam.color}20`,
                    borderColor: selectedTeam.color,
                  }}
                >
                  {selectedTeam.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-xs px-2 py-0.5 rounded font-bold"
                      style={{
                        backgroundColor: `${selectedTeam.color}25`,
                        color: selectedTeam.color,
                      }}
                    >
                      [{selectedTeam.tag}]
                    </span>
                    <span className="font-arcade text-xs text-arcade-yellow">
                      Rank #{selectedTeam.rank}
                    </span>
                  </div>
                  <h3 className="font-bungee text-xl text-white mt-1">
                    {selectedTeam.name}
                  </h3>
                  <p className="text-xs text-purple-300 font-mono">
                    Captain: {selectedTeam.captain} • {selectedTeam.membersCount} Crew Members
                  </p>
                </div>
              </div>

              <div className="bg-[#070817] p-3 rounded-xl border border-purple-500/20 mb-4">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                  CREW MOTTO
                </span>
                <p className="text-sm font-sans italic text-gray-200">
                  "{selectedTeam.motto}"
                </p>
              </div>

              {/* Game matrix in modal */}
              <div className="space-y-2 mb-6">
                <span className="text-xs font-arcade text-gray-300">
                  DISCIPLINE BREAKDOWN:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {games.map((g) => (
                    <div
                      key={g.id}
                      className="p-2.5 rounded-lg bg-[#070817] border border-purple-500/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{g.icon}</span>
                        <span className="text-xs font-display text-gray-300 truncate max-w-[90px]">
                          {g.name}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-arcade-cyan">
                        {selectedTeam.gameBreakdown[g.id] || 0} PTS
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                <span className="font-mono text-xs text-gray-400">Total Score:</span>
                <span className="font-mono text-2xl font-extrabold text-arcade-yellow">
                  {selectedTeam.totalPoints.toLocaleString()} PTS
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
