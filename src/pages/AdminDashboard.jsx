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
  Zap,
  Radio,
  Flame,
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
      label: 'ACTIVE TOURNAMENT',
      value: activeEvent ? activeEvent.name : 'None Selected',
      subtext: `${activeEvent?.code || 'CRC'} • ${activeEvent?.status?.toUpperCase() || 'ACTIVE'}`,
      icon: Calendar,
      color: 'border-arcade-pink/40 text-arcade-pink',
      bgGlow: 'bg-arcade-pink/5',
      action: () => setCurrentView('events'),
    },
    {
      label: 'TEAMS COMPETING',
      value: `${data.teams.length} CREWS`,
      subtext: `${data.teams.reduce((acc, t) => acc + (t.membersCount || 4), 0)} Total Challengers`,
      icon: Users,
      color: 'border-arcade-cyan/40 text-arcade-cyan',
      bgGlow: 'bg-arcade-cyan/5',
      action: () => setCurrentView('teams'),
    },
    {
      label: 'DISCIPLINE CATALOG',
      value: `${data.games.length} GAMES`,
      subtext: `${data.games.filter((g) => g.isActive).length} Currently Active`,
      icon: Gamepad2,
      color: 'border-arcade-purple/40 text-arcade-violet',
      bgGlow: 'bg-purple-600/5',
      action: () => setCurrentView('games'),
    },
    {
      label: 'DISPATCHED POINTS',
      value: `${totalPoints.toLocaleString()} PTS`,
      subtext: `${data.transactions.length} Verified Transactions`,
      icon: Coins,
      color: 'border-arcade-yellow/40 text-arcade-yellow',
      bgGlow: 'bg-yellow-500/5',
      action: () => setCurrentView('scoring'),
    },
  ];

  return (
    <div className="py-8 space-y-8 max-w-7xl mx-auto">
      {/* MISSION CONTROL BANNER */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#090b24] via-[#12133a] to-[#090b24] border border-purple-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-arcade text-[11px] text-emerald-400 tracking-wider">
                ADMIN MISSION CONTROL • ONLINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bungee tracking-wide text-white">
              EVENT MASTER CONSOLE
            </h1>
            <p className="text-gray-300 font-sans text-sm sm:text-base max-w-xl mt-1">
              Configure tournaments, register competitive crews, manage game rules, and dispatch points with real-time leaderboard broadcast updates.
            </p>
          </div>

          {/* Quick Actions Deck */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                soundFx.play('coin');
                if (onOpenQuickScore) onOpenQuickScore();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-arcade-yellow to-amber-500 text-slate-950 font-display font-bold text-xs tracking-wider shadow-arcade-button-yellow hover:scale-105 active:scale-95 transition-all"
            >
              <Coins className="w-4 h-4" />
              <span>AWARD POINTS</span>
            </button>

            <button
              onClick={() => {
                soundFx.play('click');
                setCurrentView('teams');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-purple-500/30 text-white font-display text-xs font-semibold hover:bg-white/10 transition-all"
            >
              <Plus className="w-4 h-4 text-arcade-cyan" />
              <span>ADD TEAM</span>
            </button>

            <button
              onClick={() => {
                soundFx.play('fanfare');
                triggerCelebration();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-arcade-pink/15 border border-arcade-pink/40 text-arcade-pink font-display text-xs font-semibold hover:bg-arcade-pink/25 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>TEST FANFARE</span>
            </button>
          </div>
        </div>
      </div>

      {/* STAT TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={i}
              onClick={() => {
                soundFx.play('click');
                st.action();
              }}
              className={`p-5 rounded-xl bg-[#0c0e28] border ${st.color} ${st.bgGlow} hover:scale-[1.02] transition-all cursor-pointer shadow-lg group relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-arcade text-[10px] text-gray-400 tracking-wider">
                  {st.label}
                </span>
                <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white truncate mb-1">
                {st.value}
              </h3>
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>{st.subtext}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>

      {/* TWO COLUMN GRID: LIVE STANDINGS PREVIEW & RECENT AUDIT LOG */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Standings Preview (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0c0e28] border border-purple-500/20 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-arcade-yellow" />
              <h2 className="font-arcade text-xs sm:text-sm text-white tracking-wider">
                STANDINGS SNAPSHOT
              </h2>
            </div>
            <button
              onClick={() => {
                soundFx.play('switch');
                setCurrentView('leaderboard');
              }}
              className="text-xs font-mono text-arcade-cyan hover:underline flex items-center gap-1"
            >
              <span>View Public Display</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {leaderboard.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#070817] border border-purple-500/10 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded flex items-center justify-center font-arcade text-xs font-bold ${
                      team.rank === 1
                        ? 'bg-arcade-yellow text-slate-950'
                        : team.rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : team.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-purple-950 text-purple-300'
                    }`}
                  >
                    #{team.rank}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{team.avatar}</span>
                    <span className="font-display font-bold text-white text-sm">
                      {team.name}
                    </span>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold"
                      style={{ color: team.color, backgroundColor: `${team.color}15` }}
                    >
                      [{team.tag}]
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold text-white">
                    {team.totalPoints.toLocaleString()} PTS
                  </span>
                  <button
                    onClick={() => {
                      soundFx.play('coin');
                      if (onOpenQuickScore) onOpenQuickScore(team.id);
                    }}
                    title="Quick Score Award"
                    className="p-1.5 rounded-lg bg-arcade-yellow/10 border border-arcade-yellow/30 text-arcade-yellow hover:bg-arcade-yellow/20 text-xs font-mono"
                  >
                    +Score
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Score Transactions Audit Stream */}
        <div className="rounded-2xl bg-[#0c0e28] border border-purple-500/20 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-arcade-pink" />
                <h3 className="font-arcade text-xs text-white tracking-wider">
                  SCORE AUDIT LOG
                </h3>
              </div>
              <button
                onClick={() => {
                  soundFx.play('switch');
                  setCurrentView('scoring');
                }}
                className="text-[11px] font-mono text-arcade-pink hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {data.transactions
                .slice(-5)
                .reverse()
                .map((tx) => {
                  const team = data.teams.find((t) => t.id === tx.teamId);
                  const isPositive = Number(tx.pointsDelta) >= 0;

                  return (
                    <div
                      key={tx.id}
                      className="p-2.5 rounded-lg bg-[#070817] border border-purple-500/10 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">
                          {team?.avatar} {team?.name}
                        </span>
                        <span
                          className={`font-bold ${
                            isPositive ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {tx.reason}
                      </p>
                      <div className="text-[10px] text-gray-500 flex justify-between mt-1">
                        <span>By {tx.admin}</span>
                        <span>{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-purple-500/20 text-center">
            <button
              onClick={() => {
                soundFx.play('switch');
                setCurrentView('scoring');
              }}
              className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-display font-semibold transition-all"
            >
              Open Full Scoring Deck
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
