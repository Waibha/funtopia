import React from 'react';
import {
  Calendar,
  Users,
  Gamepad2,
  Coins,
  Trophy,
  ArrowUpRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function AdminDashboard({
  data,
  leaderboard,
  setCurrentView,
  onOpenQuickScore,
  triggerCelebration,
}) {
  const activeEvent = data.events.find((e) => e.id === data.activeEventId) || data.events[0];
  const totalPoints = data.transactions.reduce((sum, tx) => sum + Number(tx.pointsDelta), 0);

  const stats = [
    {
      label: 'ACTIVE EVENT',
      value: activeEvent ? activeEvent.name : 'None Selected',
      subtext: `${activeEvent?.code || 'CRC'} • ${activeEvent?.status?.toUpperCase() || 'ACTIVE'}`,
      icon: Calendar,
      colorBar: 'bg-arcade-pink',
      action: () => setCurrentView('events'),
    },
    {
      label: 'REGISTERED CREWS',
      value: `${data.teams.length} TEAMS`,
      subtext: `${data.teams.reduce((acc, t) => acc + (t.membersCount || 4), 0)} Players Competing`,
      icon: Users,
      colorBar: 'bg-arcade-cyan',
      action: () => setCurrentView('teams'),
    },
    {
      label: 'DISCIPLINE CATALOG',
      value: `${data.games.length} GAMES`,
      subtext: `${data.games.filter((g) => g.isActive).length} Currently Active`,
      icon: Gamepad2,
      colorBar: 'bg-arcade-purple',
      action: () => setCurrentView('games'),
    },
    {
      label: 'POINTS DISPATCHED',
      value: `${totalPoints.toLocaleString()} PTS`,
      subtext: `${data.transactions.length} Verified Entries`,
      icon: Coins,
      colorBar: 'bg-arcade-yellow',
      action: () => setCurrentView('scoring'),
    },
  ];

  return (
    <div className="py-6 space-y-6 max-w-7xl mx-auto">
      {/* ========================================================= */}
      {/* ARCADE OPERATOR CONSOLE HEADER                            */}
      {/* ========================================================= */}
      <div className="bg-[#15141c] border-2 border-black rounded-xl p-5 sm:p-6 shadow-arcade flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-arcade-yellow" />
            <span className="font-arcade text-[10px] text-arcade-yellow tracking-wider">
              OPERATOR COMMAND CONSOLE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bungee tracking-wide text-white">
            ARCADE MASTER CONTROL
          </h1>
          <p className="text-arcade-muted font-sans text-xs sm:text-sm mt-1 max-w-xl">
            Dispatch points, adjust match rules, register competitive crews, and supervise live tournaments.
          </p>
        </div>

        {/* Master Control Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              soundFx.play('coin');
              if (onOpenQuickScore) onOpenQuickScore();
            }}
            className="arcade-btn-yellow flex items-center gap-2"
          >
            <Coins className="w-4 h-4 fill-black" />
            <span>DISPATCH POINTS</span>
          </button>

          <button
            onClick={() => {
              soundFx.play('click');
              setCurrentView('teams');
            }}
            className="arcade-btn-ghost flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD TEAM</span>
          </button>

          <button
            onClick={() => {
              soundFx.play('fanfare');
              triggerCelebration();
            }}
            className="arcade-btn-ghost flex items-center gap-1.5 text-arcade-pink hover:text-arcade-pink"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>TEST FANFARE</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STAT TILES (SOLID COLOR BARS)                             */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={i}
              onClick={() => {
                soundFx.play('click');
                st.action();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && st.action()}
              className="bg-[#15141c] border-2 border-black rounded-xl p-4 shadow-arcade-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-transform cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${st.colorBar}`} />
              <div className="flex items-center justify-between mb-2 mt-1">
                <span className="font-arcade text-[10px] text-arcade-muted">
                  {st.label}
                </span>
                <Icon className="w-4 h-4 text-arcade-muted" />
              </div>
              <h3 className="font-display font-black text-xl text-white truncate mb-0.5">
                {st.value}
              </h3>
              <div className="flex items-center justify-between text-[11px] font-mono text-arcade-muted">
                <span className="truncate">{st.subtext}</span>
                <ArrowUpRight className="w-3 h-3 shrink-0 ml-1" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* SNAPSHOT & RECENT TRANSACTION LOG                         */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Standings Snapshot (2 cols) */}
        <div className="lg:col-span-2 bg-[#15141c] border-2 border-black rounded-xl p-5 shadow-arcade-sm">
          <div className="flex items-center justify-between mb-4 border-b border-arcade-border pb-2">
            <div className="flex items-center gap-2 font-arcade text-xs text-white">
              <Trophy className="w-4 h-4 text-arcade-yellow" />
              <span>CURRENT RANKINGS</span>
            </div>
            <button
              onClick={() => {
                soundFx.play('switch');
                setCurrentView('leaderboard');
              }}
              className="text-xs font-mono text-arcade-cyan hover:underline flex items-center gap-1 font-bold"
            >
              <span>Public Stage View</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {leaderboard.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#100f16] border border-arcade-border hover:border-arcade-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded flex items-center justify-center font-arcade text-xs font-bold border border-black ${
                      team.rank === 1
                        ? 'bg-arcade-yellow text-black'
                        : team.rank === 2
                        ? 'bg-zinc-300 text-black'
                        : team.rank === 3
                        ? 'bg-amber-600 text-white'
                        : 'bg-[#1e1c27] text-arcade-muted'
                    }`}
                  >
                    {team.rank}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{team.avatar}</span>
                    <span className="font-display font-bold text-white text-sm">
                      {team.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/50 text-arcade-muted font-bold">
                      [{team.tag}]
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-white">
                    🪙 {team.totalPoints.toLocaleString()} PTS
                  </span>
                  <button
                    onClick={() => {
                      soundFx.play('coin');
                      if (onOpenQuickScore) onOpenQuickScore(team.id);
                    }}
                    title="Quick Score"
                    className="px-2.5 py-1 rounded bg-[#201d2a] hover:bg-arcade-yellow hover:text-black text-arcade-yellow border border-arcade-border text-xs font-mono font-bold transition-colors"
                  >
                    +Score
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Ledger Log */}
        <div className="bg-[#15141c] border-2 border-black rounded-xl p-5 shadow-arcade-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-arcade-border pb-2">
              <span className="font-arcade text-xs text-white">OPERATOR LOG</span>
              <button
                onClick={() => {
                  soundFx.play('switch');
                  setCurrentView('scoring');
                }}
                className="text-xs font-mono text-arcade-yellow hover:underline font-bold"
              >
                Full Console
              </button>
            </div>

            <div className="space-y-2">
              {data.transactions
                .slice(-5)
                .reverse()
                .map((tx) => {
                  const team = data.teams.find((t) => t.id === tx.teamId);
                  const isPositive = Number(tx.pointsDelta) >= 0;

                  return (
                    <div
                      key={tx.id}
                      className="p-2.5 rounded bg-[#100f16] border border-arcade-border text-xs font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white truncate max-w-[140px]">
                          {team?.avatar} {team?.name}
                        </span>
                        <span
                          className={`font-black ${
                            isPositive ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                        </span>
                      </div>
                      <p className="text-[11px] text-arcade-muted truncate mt-0.5">
                        {tx.reason}
                      </p>
                      <div className="text-[10px] text-zinc-500 flex justify-between mt-1">
                        <span>By: {tx.admin}</span>
                        <span>
                          {new Date(tx.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.play('switch');
              setCurrentView('scoring');
            }}
            className="w-full mt-4 py-2.5 rounded bg-[#201d2a] hover:bg-white/10 border border-arcade-border text-white text-xs font-display font-bold transition-colors"
          >
            Open Scoring Terminal
          </button>
        </div>
      </div>
    </div>
  );
}
