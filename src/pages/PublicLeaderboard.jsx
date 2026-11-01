import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  Maximize2,
  Minimize2,
  Activity,
  Gamepad2,
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

  const toggleBroadcast = () => {
    soundFx.play('click');
    setBroadcastMode(!broadcastMode);
  };

  const handleTeamClick = (team) => {
    soundFx.play('switch');
    setSelectedTeam(team);
  };

  const handleFilterClick = (gId) => {
    soundFx.play('click');
    setFilterGameId(gId);
  };

  return (
    <div
      className={`transition-all duration-300 ${
        broadcastMode
          ? 'fixed inset-0 z-50 bg-[#0c0b10] overflow-y-auto p-4 sm:p-8'
          : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ========================================================= */}
        {/* RETRO ARCADE ARENA MARQUEE                                */}
        {/* ========================================================= */}
        <div className="bg-[#15141c] border-2 border-black rounded-xl p-5 sm:p-6 shadow-arcade flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-arcade-pink text-white font-arcade text-[9px] font-bold tracking-widest uppercase">
                LIVE COMPETITION
              </span>
              <span className="px-2 py-0.5 rounded bg-[#201d2a] text-arcade-yellow font-mono text-xs font-bold border border-arcade-border">
                {activeEvent?.code || 'CRC-26'}
              </span>
              <span className="text-xs font-mono text-arcade-muted">
                {activeEvent?.location}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bungee tracking-wide text-arcade-white">
              {activeEvent?.name || 'ARCADE CHAMPIONSHIP 2026'}
            </h1>
            <p className="text-arcade-muted font-sans text-xs sm:text-sm mt-1 max-w-2xl">
              {activeEvent?.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto justify-end">
            <button
              onClick={() => {
                soundFx.play('fanfare');
                triggerCelebration();
              }}
              className="arcade-btn-pink flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-arcade-yellow" />
              <span>CELEBRATE</span>
            </button>

            <button
              onClick={toggleBroadcast}
              className="arcade-btn-ghost flex items-center gap-1.5 font-mono text-xs"
            >
              {broadcastMode ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>WINDOWED</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>STAGE MODE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RETRO ARCADE PODIUM                                       */}
        {/* ========================================================= */}
        <section aria-label="Winner Podium">
          <div className="flex items-center justify-between px-2 mb-1">
            <div className="flex items-center gap-2 font-arcade text-xs text-arcade-yellow">
              <Trophy className="w-4 h-4" />
              <span>CHAMPIONSHIP PODIUM</span>
            </div>
            <span className="text-[11px] font-mono text-arcade-muted hidden sm:inline">
              Select any crew to inspect match history
            </span>
          </div>

          <Podium topTeams={topThree} onSelectTeam={handleTeamClick} />
        </section>

        {/* ========================================================= */}
        {/* DISCIPLINE FILTER TABS                                    */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-3 flex-wrap bg-[#15141c] p-2.5 rounded-lg border border-arcade-border">
          <div className="flex items-center gap-2 font-display text-xs font-bold text-arcade-muted tracking-wider">
            <Gamepad2 className="w-4 h-4 text-arcade-cyan" />
            <span>FILTER:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => handleFilterClick('all')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                filterGameId === 'all'
                  ? 'bg-arcade-yellow text-black border border-black shadow-arcade-sm'
                  : 'bg-[#1e1c27] text-arcade-muted hover:text-white'
              }`}
            >
              All Matches
            </button>
            {games.map((g) => (
              <button
                key={g.id}
                onClick={() => handleFilterClick(g.id)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  filterGameId === g.id
                    ? 'bg-arcade-yellow text-black border border-black shadow-arcade-sm'
                    : 'bg-[#1e1c27] text-arcade-muted hover:text-white'
                }`}
              >
                <span>{g.icon}</span>
                <span>{g.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* ARCADE SCOREBOARD TABLE & LIVE FEED                       */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Scoreboard List (2 cols) */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="flex items-center justify-between px-3 text-xs font-mono text-arcade-muted uppercase font-bold">
              <span>RANK & COMPETITIVE CREW</span>
              <span>GAME MATRIX / TOTAL</span>
            </div>

            {leaderboard.map((team) => {
              const pointsDisplay =
                filterGameId === 'all'
                  ? team.totalPoints
                  : team.gameBreakdown[filterGameId] || 0;

              return (
                <div
                  key={team.id}
                  onClick={() => handleTeamClick(team)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleTeamClick(team)}
                  className={`p-3.5 rounded-xl border-2 border-black shadow-arcade-sm transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                    team.rank === 1
                      ? 'bg-[#1e1a14] hover:bg-[#252015]'
                      : team.rank === 2
                      ? 'bg-[#17171d] hover:bg-[#1e1e26]'
                      : team.rank === 3
                      ? 'bg-[#1a1514] hover:bg-[#221c1a]'
                      : 'bg-[#15141c] hover:bg-[#1c1b26]'
                  }`}
                >
                  {/* Rank & Team Identity */}
                  <div className="flex items-center gap-3">
                    {/* Rank Number */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-arcade text-xs font-black shrink-0 border border-black ${
                        team.rank === 1
                          ? 'bg-arcade-yellow text-black'
                          : team.rank === 2
                          ? 'bg-zinc-300 text-black'
                          : team.rank === 3
                          ? 'bg-amber-600 text-white'
                          : 'bg-[#201d2a] text-arcade-muted'
                      }`}
                    >
                      {team.rank}
                    </div>

                    {/* Team Avatar */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 border-2 border-black"
                      style={{ backgroundColor: team.color }}
                    >
                      <span>{team.avatar}</span>
                    </div>

                    {/* Team Name & Tag */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm sm:text-base text-white">
                          {team.name}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-arcade-muted font-bold">
                          [{team.tag}]
                        </span>
                      </div>
                      <p className="text-[11px] text-arcade-muted font-sans hidden sm:block truncate max-w-xs">
                        {team.motto}
                      </p>
                    </div>
                  </div>

                  {/* Discipline Pills & Score */}
                  <div className="flex items-center gap-4">
                    {/* Game-wise breakdown tags */}
                    <div className="hidden md:flex items-center gap-1">
                      {games.map((g) => (
                        <div
                          key={g.id}
                          title={`${g.name}: ${team.gameBreakdown[g.id] || 0} PTS`}
                          className="px-2 py-1 rounded bg-[#0e0d14] border border-arcade-border text-center text-[10px] font-mono"
                        >
                          <span className="text-arcade-muted block text-[9px]">{g.icon}</span>
                          <span className="font-bold text-white">
                            {team.gameBreakdown[g.id] || 0}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total Score Readout with token symbol */}
                    <div className="text-right shrink-0">
                      <div className="font-mono text-lg sm:text-xl font-black text-white flex items-center justify-end gap-1">
                        <span className="text-arcade-yellow">🪙</span>
                        <span>{pointsDisplay.toLocaleString()}</span>
                        <span className="text-xs text-arcade-muted font-mono">PTS</span>
                      </div>
                      {team.diffFromFirst > 0 ? (
                        <span className="text-[10px] font-mono text-red-400 font-bold">
                          -{team.diffFromFirst} to #1
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-arcade-yellow font-black">
                          LEADER
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Scoring Stream */}
          <div className="space-y-4">
            <div className="bg-[#15141c] border-2 border-black rounded-xl p-4 shadow-arcade-sm">
              <div className="flex items-center justify-between mb-3 border-b border-arcade-border pb-2">
                <div className="flex items-center gap-2 font-arcade text-xs text-white">
                  <Activity className="w-3.5 h-3.5 text-arcade-pink" />
                  <span>ACTIVITY LEDGER</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
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
                        className="p-2.5 rounded bg-[#100f16] border border-arcade-border text-xs font-mono"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">
                            {team?.avatar} {team?.name}
                          </span>
                          <span
                            className={`font-black font-mono text-xs ${
                              isPositive ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                          </span>
                        </div>
                        <div className="text-arcade-muted text-[11px] flex justify-between mt-0.5">
                          <span>
                            {game?.icon} {game?.name}
                          </span>
                          <span>
                            {new Date(tx.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1 italic truncate">
                          "{tx.reason}"
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Discipline Summary List */}
            <div className="bg-[#15141c] border-2 border-black rounded-xl p-4 shadow-arcade-sm">
              <span className="font-arcade text-xs text-white block mb-2">
                TOURNAMENT DISCIPLINES
              </span>
              <div className="space-y-1.5">
                {games.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between p-2 rounded bg-[#100f16] text-xs font-mono"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{g.icon}</span>
                      <span className="font-bold text-white">{g.name}</span>
                    </div>
                    <span className="text-arcade-yellow font-bold">
                      {g.basePoints} PTS
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team Inspection Modal */}
        {selectedTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
            <div className="relative w-full max-w-md bg-[#15141c] border-3 border-black rounded-xl p-6 shadow-arcade-lg">
              <button
                onClick={() => setSelectedTeam(null)}
                className="absolute top-4 right-4 text-arcade-muted hover:text-white font-mono text-base"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl border-2 border-black"
                  style={{ backgroundColor: selectedTeam.color }}
                >
                  {selectedTeam.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-black text-white font-bold">
                      [{selectedTeam.tag}]
                    </span>
                    <span className="font-arcade text-xs text-arcade-yellow">
                      Rank #{selectedTeam.rank}
                    </span>
                  </div>
                  <h3 className="font-bungee text-xl text-white mt-0.5">
                    {selectedTeam.name}
                  </h3>
                  <p className="text-xs text-arcade-muted font-mono">
                    Captain: {selectedTeam.captain}
                  </p>
                </div>
              </div>

              <div className="bg-[#0e0d14] p-3 rounded border border-arcade-border mb-4 text-xs">
                <span className="text-arcade-muted uppercase block font-mono text-[9px] mb-0.5">
                  CREW MOTTO
                </span>
                <p className="italic text-white">"{selectedTeam.motto}"</p>
              </div>

              {/* Discipline Breakdown */}
              <div className="space-y-1.5 mb-5">
                <span className="text-xs font-arcade text-arcade-muted block">
                  SCORES BY GAME:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {games.map((g) => (
                    <div
                      key={g.id}
                      className="p-2 rounded bg-[#0e0d14] border border-arcade-border flex items-center justify-between text-xs font-mono"
                    >
                      <span className="truncate">{g.name}</span>
                      <span className="font-bold text-arcade-yellow">
                        {selectedTeam.gameBreakdown[g.id] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-arcade-border">
                <span className="font-mono text-xs text-arcade-muted">Total Score:</span>
                <span className="font-mono text-2xl font-black text-arcade-yellow flex items-center gap-1">
                  🪙 {selectedTeam.totalPoints.toLocaleString()} PTS
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
