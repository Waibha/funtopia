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
          ? 'fixed inset-0 z-50 bg-[#FAF7EE] overflow-y-auto p-4 sm:p-8'
          : 'py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ========================================================= */}
        {/* RETRO POP CHAMPIONSHIP HERO BANNER                        */}
        {/* ========================================================= */}
        <div className="bg-pop-purple rounded-3xl border-3 border-pop-ink p-6 sm:p-8 shadow-pop-lg text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle pop dot graphic accent */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-pop-coral rounded-full border-3 border-pop-ink opacity-30 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-pop-yellow text-pop-ink font-arcade text-[10px] font-black uppercase border-2 border-pop-ink shadow-pop-sm">
                ● LIVE CHAMPIONSHIP
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-xs font-bold border border-white/40">
                {activeEvent?.code || 'CRC-26'}
              </span>
              <span className="text-xs font-mono text-purple-200">
                {activeEvent?.location}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bungee tracking-wide text-pop-yellow drop-shadow-[2px_2px_0px_#180A28]">
              {activeEvent?.name || 'FUNTOPIA CHAMPIONSHIP'}
            </h1>
            <p className="text-purple-100 font-sans text-sm sm:text-base mt-1.5 max-w-2xl font-medium">
              {activeEvent?.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto justify-end relative z-10">
            <button
              onClick={() => {
                soundFx.play('fanfare');
                triggerCelebration();
              }}
              className="btn-pop-yellow flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-pop-coral fill-pop-coral" />
              <span>CELEBRATE</span>
            </button>

            <button
              onClick={toggleBroadcast}
              className="btn-pop-white flex items-center gap-1.5 font-mono text-xs"
            >
              {broadcastMode ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>WINDOWED</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>STAGE MODE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RETRO POP PODIUM                                          */}
        {/* ========================================================= */}
        <section aria-label="Championship Podium">
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-2 font-arcade text-xs text-pop-ink font-black">
              <Trophy className="w-4 h-4 text-pop-orange" />
              <span>CHAMPIONSHIP PODIUM</span>
            </div>
            <span className="text-xs font-mono text-pop-muted hidden sm:inline font-bold">
              ✦ Click any crew to inspect match history
            </span>
          </div>

          <Podium topTeams={topThree} onSelectTeam={handleTeamClick} />
        </section>

        {/* ========================================================= */}
        {/* DISCIPLINE FILTER TABS                                    */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-3 flex-wrap bg-white p-3 rounded-2xl border-3 border-pop-ink shadow-pop">
          <div className="flex items-center gap-2 font-display text-xs font-black text-pop-ink tracking-wider">
            <Gamepad2 className="w-4 h-4 text-pop-purple" />
            <span>DISCIPLINE:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              onClick={() => handleFilterClick('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-black transition-all ${
                filterGameId === 'all'
                  ? 'bg-pop-yellow text-pop-ink border-2 border-pop-ink shadow-pop-sm -translate-y-0.5'
                  : 'bg-pop-butter text-pop-ink hover:bg-pop-yellow-light border border-pop-ink/30'
              }`}
            >
              All Matches
            </button>
            {games.map((g) => (
              <button
                key={g.id}
                onClick={() => handleFilterClick(g.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  filterGameId === g.id
                    ? 'bg-pop-coral text-white border-2 border-pop-ink shadow-pop-sm -translate-y-0.5'
                    : 'bg-pop-butter text-pop-ink hover:bg-pop-coral-light border border-pop-ink/30'
                }`}
              >
                <span>{g.icon}</span>
                <span>{g.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SCOREBOARD TABLE & ACTIVITY RECEIPT                       */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Standings List (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between px-3 text-xs font-mono text-pop-muted uppercase font-black">
              <span>RANK & COMPETITIVE CREW</span>
              <span>GAME BREAKDOWN / POINTS</span>
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
                  className={`p-4 rounded-2xl border-3 border-pop-ink shadow-pop transition-all duration-150 cursor-pointer flex items-center justify-between gap-4 ${
                    team.rank === 1
                      ? 'bg-pop-yellow-light hover:bg-pop-yellow/30'
                      : team.rank === 2
                      ? 'bg-pop-purple-light hover:bg-purple-100'
                      : team.rank === 3
                      ? 'bg-pop-orange-light hover:bg-orange-100'
                      : 'bg-white hover:bg-pop-butter'
                  }`}
                >
                  {/* Rank & Team Identity */}
                  <div className="flex items-center gap-3.5">
                    {/* Rank Token */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-arcade text-xs font-black shrink-0 border-2 border-pop-ink shadow-pop-sm ${
                        team.rank === 1
                          ? 'bg-pop-yellow text-pop-ink'
                          : team.rank === 2
                          ? 'bg-pop-purple text-white'
                          : team.rank === 3
                          ? 'bg-pop-orange text-white'
                          : 'bg-pop-butter text-pop-ink'
                      }`}
                    >
                      #{team.rank}
                    </div>

                    {/* Team Avatar */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 border-pop-ink shadow-pop-sm"
                      style={{ backgroundColor: team.color }}
                    >
                      <span>{team.avatar}</span>
                    </div>

                    {/* Team Name & Tag */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-base sm:text-lg text-pop-ink">
                          {team.name}
                        </span>
                        <span
                          className="font-mono text-xs px-2 py-0.5 rounded-md font-black border border-pop-ink"
                          style={{ backgroundColor: `${team.color}25`, color: team.color }}
                        >
                          [{team.tag}]
                        </span>
                      </div>
                      <p className="text-xs text-pop-muted font-sans hidden sm:block truncate max-w-xs font-medium mt-0.5">
                        {team.motto}
                      </p>
                    </div>
                  </div>

                  {/* Discipline Matrix & Total Score */}
                  <div className="flex items-center gap-4">
                    {/* Game-wise breakdown tags */}
                    <div className="hidden md:flex items-center gap-1.5">
                      {games.map((g) => (
                        <div
                          key={g.id}
                          title={`${g.name}: ${team.gameBreakdown[g.id] || 0} PTS`}
                          className="px-2.5 py-1 rounded-lg bg-white border-2 border-pop-ink text-center text-xs font-mono shadow-pop-sm"
                        >
                          <span className="block text-[10px] text-pop-muted">{g.icon}</span>
                          <span className="font-black text-pop-ink">
                            {team.gameBreakdown[g.id] || 0}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total Score Readout */}
                    <div className="text-right shrink-0">
                      <div className="font-mono text-xl sm:text-2xl font-black text-pop-ink flex items-center justify-end gap-1.5">
                        <span className="text-lg">🪙</span>
                        <span>{pointsDisplay.toLocaleString()}</span>
                        <span className="text-xs text-pop-muted font-mono font-bold">PTS</span>
                      </div>
                      {team.diffFromFirst > 0 ? (
                        <span className="text-[11px] font-mono text-pop-coral font-black">
                          -{team.diffFromFirst} behind #1
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-pop-green font-black">
                          ★ CHAMPION
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Feed & Disciplines */}
          <div className="space-y-6">
            {/* Live Scoring Stream Card */}
            <div className="bg-white border-3 border-pop-ink rounded-3xl p-5 shadow-pop">
              <div className="flex items-center justify-between mb-4 border-b-2 border-pop-ink pb-3">
                <div className="flex items-center gap-2 font-arcade text-xs text-pop-ink font-black">
                  <Activity className="w-4 h-4 text-pop-coral" />
                  <span>ACTIVITY LEDGER</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-pop-green animate-ping" />
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
                        className="p-3 rounded-xl bg-pop-butter border-2 border-pop-ink text-xs font-mono"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-pop-ink">
                            {team?.avatar} {team?.name}
                          </span>
                          <span
                            className={`font-black font-mono px-2 py-0.5 rounded border border-pop-ink ${
                              isPositive
                                ? 'bg-pop-green text-pop-ink'
                                : 'bg-pop-coral text-white'
                            }`}
                          >
                            {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                          </span>
                        </div>
                        <div className="text-pop-muted text-[11px] flex justify-between mt-1 font-bold">
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
                        <p className="text-[11px] text-pop-ink mt-1 italic font-medium truncate">
                          "{tx.reason}"
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Disciplines Box */}
            <div className="bg-pop-yellow rounded-3xl border-3 border-pop-ink p-5 shadow-pop">
              <span className="font-arcade text-xs text-pop-ink font-black block mb-3">
                TOURNAMENT DISCIPLINES
              </span>
              <div className="space-y-2">
                {games.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white border-2 border-pop-ink text-xs font-mono font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{g.icon}</span>
                      <span className="text-pop-ink font-black">{g.name}</span>
                    </div>
                    <span className="bg-pop-butter px-2 py-0.5 rounded border border-pop-ink text-pop-purple font-black">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pop-ink/70 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white border-4 border-pop-ink rounded-3xl p-6 sm:p-8 shadow-pop-xl">
              <button
                onClick={() => setSelectedTeam(null)}
                className="absolute top-4 right-4 text-pop-muted hover:text-pop-ink font-mono text-lg font-black"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border-3 border-pop-ink shadow-pop"
                  style={{ backgroundColor: selectedTeam.color }}
                >
                  {selectedTeam.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-pop-ink text-white font-black">
                      [{selectedTeam.tag}]
                    </span>
                    <span className="font-arcade text-xs text-pop-coral font-black">
                      Rank #{selectedTeam.rank}
                    </span>
                  </div>
                  <h3 className="font-bungee text-2xl text-pop-ink mt-0.5">
                    {selectedTeam.name}
                  </h3>
                  <p className="text-xs text-pop-muted font-mono font-bold">
                    Captain: {selectedTeam.captain} • {selectedTeam.membersCount} Crew
                  </p>
                </div>
              </div>

              <div className="bg-pop-butter p-3.5 rounded-xl border-2 border-pop-ink mb-4 text-xs">
                <span className="text-pop-muted uppercase block font-mono text-[9px] mb-0.5 font-bold">
                  CREW MOTTO
                </span>
                <p className="italic text-pop-ink font-semibold">"{selectedTeam.motto}"</p>
              </div>

              {/* Discipline Breakdown */}
              <div className="space-y-2 mb-6">
                <span className="text-xs font-arcade text-pop-ink font-black block">
                  SCORES BY GAME:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {games.map((g) => (
                    <div
                      key={g.id}
                      className="p-2.5 rounded-xl bg-pop-canvas border-2 border-pop-ink flex items-center justify-between text-xs font-mono font-bold"
                    >
                      <span className="truncate">{g.name}</span>
                      <span className="font-black text-pop-purple">
                        {selectedTeam.gameBreakdown[g.id] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-pop-ink">
                <span className="font-mono text-xs text-pop-muted font-bold">Total Score:</span>
                <span className="font-mono text-2xl font-black text-pop-ink flex items-center gap-1">
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
