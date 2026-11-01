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
      label: 'ACTIVE TOURNAMENT',
      value: activeEvent ? activeEvent.name : 'None Selected',
      subtext: `${activeEvent?.code || 'CRC'} • ${activeEvent?.status?.toUpperCase() || 'ACTIVE'}`,
      icon: Calendar,
      colorBar: 'bg-pop-coral',
      action: () => setCurrentView('events'),
    },
    {
      label: 'REGISTERED CREWS',
      value: `${data.teams.length} TEAMS`,
      subtext: `${data.teams.reduce((acc, t) => acc + (t.membersCount || 4), 0)} Players Competing`,
      icon: Users,
      colorBar: 'bg-pop-purple',
      action: () => setCurrentView('teams'),
    },
    {
      label: 'DISCIPLINE CATALOG',
      value: `${data.games.length} GAMES`,
      subtext: `${data.games.filter((g) => g.isActive).length} In Active Rotation`,
      icon: Gamepad2,
      colorBar: 'bg-pop-orange',
      action: () => setCurrentView('games'),
    },
    {
      label: 'DISPATCHED POINTS',
      value: `${totalPoints.toLocaleString()} PTS`,
      subtext: `${data.transactions.length} Verified Entries`,
      icon: Coins,
      colorBar: 'bg-pop-green',
      action: () => setCurrentView('scoring'),
    },
  ];

  return (
    <div className="py-8 space-y-8 max-w-7xl mx-auto">
      {/* ========================================================= */}
      {/* RETRO POP MASTER CONTROL HERO                             */}
      {/* ========================================================= */}
      <div className="bg-pop-yellow rounded-3xl border-3 border-pop-ink p-6 sm:p-8 shadow-pop-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pop-coral animate-ping" />
            <span className="font-arcade text-[10px] text-pop-ink tracking-wider font-black">
              ARCADE OPERATOR STATION • LIVE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bungee tracking-wide text-pop-ink">
            TOURNAMENT MASTER CONTROL
          </h1>
          <p className="text-pop-ink/80 font-sans text-sm sm:text-base mt-1 max-w-xl font-medium">
            Dispatch points, adjust match rules, register competitive crews, and trigger celebratory confetti for live event champions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundFx.play('coin');
              if (onOpenQuickScore) onOpenQuickScore();
            }}
            className="btn-pop-coral flex items-center gap-2"
          >
            <Coins className="w-4 h-4 fill-white" />
            <span>DISPATCH POINTS</span>
          </button>

          <button
            onClick={() => {
              soundFx.play('click');
              setCurrentView('teams');
            }}
            className="btn-pop-white flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>ADD TEAM</span>
          </button>

          <button
            onClick={() => {
              soundFx.play('fanfare');
              triggerCelebration();
            }}
            className="btn-pop-purple flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>TEST FANFARE</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STAT TILES (SOLID ACCENT BARS)                            */}
      {/* ========================================================= */}
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
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && st.action()}
              className="bg-white border-3 border-pop-ink rounded-2xl p-4 shadow-pop hover:-translate-y-1 hover:shadow-pop-lg transition-all cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-2 ${st.colorBar}`} />
              <div className="flex items-center justify-between mb-2 mt-1">
                <span className="font-arcade text-[10px] text-pop-muted font-bold">
                  {st.label}
                </span>
                <Icon className="w-4 h-4 text-pop-ink" />
              </div>
              <h3 className="font-display font-black text-xl text-pop-ink truncate mb-0.5">
                {st.value}
              </h3>
              <div className="flex items-center justify-between text-xs font-mono text-pop-muted font-bold">
                <span className="truncate">{st.subtext}</span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0 ml-1 text-pop-ink" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* RANKINGS SNAPSHOT & RECENT LEDGER                         */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Standings Snapshot (2 cols) */}
        <div className="lg:col-span-2 bg-white border-3 border-pop-ink rounded-3xl p-6 shadow-pop">
          <div className="flex items-center justify-between mb-5 border-b-2 border-pop-ink pb-3">
            <div className="flex items-center gap-2 font-arcade text-xs text-pop-ink font-black">
              <Trophy className="w-4 h-4 text-pop-orange" />
              <span>CURRENT STANDINGS</span>
            </div>
            <button
              onClick={() => {
                soundFx.play('switch');
                setCurrentView('leaderboard');
              }}
              className="text-xs font-mono text-pop-purple hover:underline flex items-center gap-1 font-black"
            >
              <span>Public Stage View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {leaderboard.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-pop-butter border-2 border-pop-ink hover:bg-pop-yellow-light transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-arcade text-xs font-black border-2 border-pop-ink shadow-pop-sm ${
                      team.rank === 1
                        ? 'bg-pop-yellow text-pop-ink'
                        : team.rank === 2
                        ? 'bg-pop-purple text-white'
                        : team.rank === 3
                        ? 'bg-pop-orange text-white'
                        : 'bg-white text-pop-ink'
                    }`}
                  >
                    #{team.rank}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{team.avatar}</span>
                    <span className="font-display font-black text-pop-ink text-base">
                      {team.name}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white border border-pop-ink font-black">
                      [{team.tag}]
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-black text-pop-ink">
                    🪙 {team.totalPoints.toLocaleString()} PTS
                  </span>
                  <button
                    onClick={() => {
                      soundFx.play('coin');
                      if (onOpenQuickScore) onOpenQuickScore(team.id);
                    }}
                    title="Quick Score"
                    className="px-3 py-1 rounded-xl bg-pop-yellow hover:bg-yellow-300 text-pop-ink border-2 border-pop-ink text-xs font-mono font-black shadow-pop-sm transition-all"
                  >
                    +Score
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operator Ledger Log */}
        <div className="bg-white border-3 border-pop-ink rounded-3xl p-6 shadow-pop flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b-2 border-pop-ink pb-3">
              <span className="font-arcade text-xs text-pop-ink font-black">OPERATOR LOG</span>
              <button
                onClick={() => {
                  soundFx.play('switch');
                  setCurrentView('scoring');
                }}
                className="text-xs font-mono text-pop-coral hover:underline font-black"
              >
                Full Console
              </button>
            </div>

            <div className="space-y-2.5">
              {data.transactions
                .slice(-5)
                .reverse()
                .map((tx) => {
                  const team = data.teams.find((t) => t.id === tx.teamId);
                  const isPositive = Number(tx.pointsDelta) >= 0;

                  return (
                    <div
                      key={tx.id}
                      className="p-3 rounded-xl bg-pop-butter border-2 border-pop-ink text-xs font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-pop-ink truncate max-w-[140px]">
                          {team?.avatar} {team?.name}
                        </span>
                        <span
                          className={`font-black font-mono px-1.5 py-0.5 rounded border border-pop-ink ${
                            isPositive
                              ? 'bg-pop-green text-pop-ink'
                              : 'bg-pop-coral text-white'
                          }`}
                        >
                          {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                        </span>
                      </div>
                      <p className="text-[11px] text-pop-muted truncate mt-0.5 font-medium">
                        "{tx.reason}"
                      </p>
                      <div className="text-[10px] text-pop-muted flex justify-between mt-1 font-bold">
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
            className="w-full mt-5 py-3 rounded-2xl bg-pop-purple text-white border-2 border-pop-ink shadow-pop text-xs font-display font-black tracking-wider hover:-translate-y-0.5 transition-all"
          >
            Open Scoring Console
          </button>
        </div>
      </div>
    </div>
  );
}
