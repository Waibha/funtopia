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
  leaderboard = [],
  setCurrentView,
  onOpenQuickScore,
  triggerCelebration,
}) {
  const activeEvent = data.events.find((e) => e.id === data.activeEventId) || data.events[0];
  const totalPoints = (data.transactions || []).reduce((sum, tx) => sum + Number(tx.pointsDelta || 0), 0);

  const stats = [
    {
      label: 'ACTIVE EVENT',
      value: activeEvent ? activeEvent.name : 'None Selected',
      subtext: `${activeEvent?.description || 'Active Tournament'}`,
      icon: Calendar,
      colorBar: 'bg-pop-coral',
      action: () => setCurrentView('events'),
    },
    {
      label: 'REGISTERED PARTICIPANTS',
      value: `${(data.participants || []).length} PARTICIPANTS`,
      subtext: 'Individual Competitors',
      icon: Users,
      colorBar: 'bg-pop-purple',
      action: () => setCurrentView('participants'),
    },
    {
      label: 'GAMES IN ROTATION',
      value: `${(data.games || []).length} GAMES`,
      subtext: `${(data.games || []).filter((g) => g.isActive).length} Active Games`,
      icon: Gamepad2,
      colorBar: 'bg-pop-orange',
      action: () => setCurrentView('games'),
    },
    {
      label: 'TOTAL SCORES AWARDED',
      value: `${totalPoints.toLocaleString()} PTS`,
      subtext: `${(data.transactions || []).length} Total Transactions`,
      icon: Coins,
      colorBar: 'bg-pop-green',
      action: () => setCurrentView('scoring'),
    },
  ];

  return (
    <div className="py-8 space-y-8 max-w-7xl mx-auto">
      {/* Master Control Hero */}
      <div className="bg-pop-yellow rounded-3xl border-3 border-pop-ink p-6 sm:p-8 shadow-pop-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pop-coral animate-ping" />
            <span className="font-arcade text-[10px] text-pop-ink tracking-wider font-black">
              ADMIN CONTROL PANEL • LIVE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bungee tracking-wide text-pop-ink">
            EVENT MANAGEMENT CONSOLE
          </h1>
          <p className="text-pop-ink/80 font-sans text-sm sm:text-base mt-1 max-w-xl font-medium">
            Award and deduct individual points, manage event games with costs, and monitor real-time rankings.
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
            <span>AWARD POINTS</span>
          </button>

          <button
            onClick={() => {
              soundFx.play('click');
              setCurrentView('participants');
            }}
            className="btn-pop-white flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>PARTICIPANTS</span>
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

      {/* Stat Tiles */}
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

      {/* Standings Snapshot & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Standings Snapshot (2 cols) */}
        <div className="lg:col-span-2 bg-white border-3 border-pop-ink rounded-3xl p-6 shadow-pop">
          <div className="flex items-center justify-between mb-5 border-b-2 border-pop-ink pb-3">
            <div className="flex items-center gap-2 font-arcade text-xs text-pop-ink font-black">
              <Trophy className="w-4 h-4 text-pop-orange" />
              <span>INDIVIDUAL STANDINGS</span>
            </div>
            <button
              onClick={() => {
                soundFx.play('switch');
                setCurrentView('leaderboard');
              }}
              className="text-xs font-mono text-pop-purple hover:underline flex items-center gap-1 font-black"
            >
              <span>Public View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {leaderboard.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-pop-butter border-2 border-pop-ink hover:bg-pop-yellow-light transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-arcade text-xs font-black border-2 border-pop-ink shadow-pop-sm ${
                      participant.rank === 1
                        ? 'bg-pop-yellow text-pop-ink'
                        : participant.rank === 2
                        ? 'bg-pop-purple text-white'
                        : participant.rank === 3
                        ? 'bg-pop-orange text-white'
                        : 'bg-white text-pop-ink'
                    }`}
                  >
                    #{participant.rank}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{participant.avatar}</span>
                    <span className="font-display font-black text-pop-ink text-base">
                      {participant.name}
                    </span>
                    <span className="text-xs font-mono text-pop-muted">
                      ({participant.email})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-black text-pop-ink">
                    🪙 {participant.totalPoints.toLocaleString()} PTS
                  </span>
                  <button
                    onClick={() => {
                      soundFx.play('coin');
                      if (onOpenQuickScore) onOpenQuickScore(participant.id);
                    }}
                    title="Score Participant"
                    className="px-3 py-1 rounded-xl bg-pop-yellow hover:bg-yellow-300 text-pop-ink border-2 border-pop-ink text-xs font-mono font-black shadow-pop-sm transition-all"
                  >
                    +Score
                  </button>
                </div>
              </div>
            ))}

            {leaderboard.length === 0 && (
              <div className="text-center py-8 text-pop-muted font-mono text-xs font-bold">
                No participants registered yet.
              </div>
            )}
          </div>
        </div>

        {/* Transaction Log */}
        <div className="bg-white border-3 border-pop-ink rounded-3xl p-6 shadow-pop flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b-2 border-pop-ink pb-3">
              <span className="font-arcade text-xs text-pop-ink font-black">RECENT ACTIVITY</span>
              <button
                onClick={() => {
                  soundFx.play('switch');
                  setCurrentView('scoring');
                }}
                className="text-xs font-mono text-pop-coral hover:underline font-black"
              >
                Scoring Terminal
              </button>
            </div>

            <div className="space-y-2.5">
              {(data.transactions || [])
                .slice(-5)
                .reverse()
                .map((tx) => {
                  const participant = (data.participants || []).find((p) => p.id === tx.participantId);
                  const game = (data.games || []).find((g) => g.id === tx.gameId);
                  const isPositive = Number(tx.pointsDelta) >= 0;
                  const noteText = tx.note || tx.reason || 'Points update';

                  return (
                    <div
                      key={tx.id}
                      className="p-3 rounded-xl bg-pop-butter border-2 border-pop-ink text-xs font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-pop-ink truncate max-w-[140px]">
                          {participant?.avatar} {participant?.name || 'Participant'}
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
                        in {game?.name || 'Game'}: "{noteText}"
                      </p>
                      <div className="text-[10px] text-pop-muted flex justify-between mt-1 font-bold">
                        <span>{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })}

              {(data.transactions || []).length === 0 && (
                <div className="text-center py-6 text-pop-muted font-mono text-xs font-bold">
                  No recent activity.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.play('switch');
              setCurrentView('scoring');
            }}
            className="w-full mt-5 py-3 rounded-2xl bg-pop-purple text-white border-2 border-pop-ink shadow-pop text-xs font-display font-black tracking-wider hover:-translate-y-0.5 transition-all"
          >
            Open Scoring Terminal
          </button>
        </div>
      </div>
    </div>
  );
}
