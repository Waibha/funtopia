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
  const totalPoints = (data.transactions || []).reduce((sum, tx) => sum + Number(tx.pointsDelta || 0), 0);
  const activeGamesCount = (data.games || []).filter((g) => g.isActive).length;

  const stats = [
    {
      label: 'STARTING COINS',
      value: `${data.settings?.startingCoins ?? 0} COINS`,
      subtext: 'Auto-granted on registration',
      icon: Coins,
      colorBar: 'bg-[#FFDE25]',
      action: () => setCurrentView('coins'),
    },
    {
      label: 'GAMES',
      value: `${(data.games || []).length} GAMES`,
      subtext: `${activeGamesCount} Active In Rotation`,
      icon: Gamepad2,
      colorBar: 'bg-[#FF7A00]',
      action: () => setCurrentView('games'),
    },
    {
      label: 'PARTICIPANTS',
      value: `${(data.participants || []).length} PLAYERS`,
      subtext: 'Verified Registered Users',
      icon: Users,
      colorBar: 'bg-[#5C2D91]',
      action: () => setCurrentView('participants'),
    },
    {
      label: 'DISPATCHED POINTS',
      value: `${totalPoints.toLocaleString()} PTS`,
      subtext: `${(data.transactions || []).length} Verified Entries`,
      icon: Trophy,
      colorBar: 'bg-[#28C76F]',
      action: () => setCurrentView('scoring'),
    },
  ];

  return (
    <div className="py-4 space-y-8 max-w-7xl mx-auto">
      {/* Master Control Hero */}
      <div className="bg-[#40186D] rounded-3xl border-4 border-[#0D0518] p-6 sm:p-8 shadow-pixel-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5FA0] animate-ping" />
            <span className="font-arcade text-[10px] text-[#FFDE25] tracking-wider font-black">
              ARCADE OPERATOR STATION • LIVE
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bungee tracking-wide text-[#FFDE25] pixel-title-yellow">
            MASTER CONTROL
          </h1>
          <p className="text-purple-200 font-mono text-xs sm:text-sm mt-1 max-w-xl font-medium">
            Dispatch points, configure game costs/budgets, register players, and audit the live ledger.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundFx.play('coin');
              if (onOpenQuickScore) onOpenQuickScore();
            }}
            className="btn-pixel-yellow flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            <span>UPDATE SCORES</span>
          </button>

          <button
            onClick={() => {
              soundFx.play('click');
              setCurrentView('coins');
            }}
            className="btn-pixel-green flex items-center gap-1.5"
          >
            <Coins className="w-4 h-4" />
            <span>COIN SETTINGS</span>
          </button>

          <button
            onClick={() => {
              soundFx.play('click');
              setCurrentView('games');
            }}
            className="btn-pixel-white flex items-center gap-1.5"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>GAMES</span>
          </button>

          <button
            onClick={() => {
              soundFx.play('fanfare');
              triggerCelebration();
            }}
            className="btn-pixel-pink flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>FANFARE</span>
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
              className="bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-2xl p-4 shadow-pixel hover:-translate-y-1 hover:shadow-pixel-lg transition-all cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-2.5 ${st.colorBar}`} />
              <div className="flex items-center justify-between mb-2 mt-1">
                <span className="font-arcade text-[9px] text-gray-500 font-black">
                  {st.label}
                </span>
                <Icon className="w-4 h-4 text-[#0D0518]" />
              </div>
              <h3 className="font-display font-black text-xl text-[#0D0518] truncate mb-0.5">
                {st.value}
              </h3>
              <div className="flex items-center justify-between text-xs font-mono text-gray-600 font-bold">
                <span className="truncate">{st.subtext}</span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0 ml-1 text-[#0D0518]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Standings Snapshot & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Standings Snapshot (2 cols) */}
        <div className="lg:col-span-2 bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 shadow-pixel-lg">
          <div className="flex items-center justify-between mb-5 border-b-3 border-[#0D0518] pb-3">
            <div className="flex items-center gap-2 font-arcade text-xs text-[#0D0518] font-black">
              <Trophy className="w-4 h-4 text-[#FF7A00]" />
              <span>CURRENT STANDINGS</span>
            </div>
            <button
              onClick={() => {
                soundFx.play('switch');
                setCurrentView('leaderboard');
              }}
              className="text-xs font-mono text-[#5C2D91] hover:underline flex items-center gap-1 font-black"
            >
              <span>Public Arena View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {leaderboard.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFDF5] border-3 border-[#0D0518] hover:bg-[#FAF7EE] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-arcade text-xs font-black border-2 border-[#0D0518] shadow-pixel-sm ${
                      participant.rank === 1
                        ? 'bg-[#FFDE25] text-[#0D0518]'
                        : participant.rank === 2
                        ? 'bg-[#5C2D91] text-white'
                        : participant.rank === 3
                        ? 'bg-[#FF7A00] text-white'
                        : 'bg-white text-[#0D0518]'
                    }`}
                  >
                    #{participant.rank}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{participant.avatar}</span>
                    <span className="font-display font-black text-[#0D0518] text-base">
                      {participant.name}
                    </span>
                    <span className="text-xs font-mono text-gray-500">
                      ({participant.email})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-black text-[#0D0518]">
                    🪙 {participant.totalPoints.toLocaleString()} PTS
                  </span>
                  <button
                    onClick={() => {
                      soundFx.play('coin');
                      if (onOpenQuickScore) onOpenQuickScore(participant.id);
                    }}
                    title="Score Participant"
                    className="btn-pixel-yellow text-[10px] py-1 px-2.5"
                  >
                    +Score
                  </button>
                </div>
              </div>
            ))}

            {leaderboard.length === 0 && (
              <div className="text-center py-8 text-gray-500 font-mono text-xs font-bold">
                No participants registered yet.
              </div>
            )}
          </div>
        </div>

        {/* Transaction Log */}
        <div className="bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 shadow-pixel-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b-3 border-[#0D0518] pb-3">
              <span className="font-arcade text-xs text-[#0D0518] font-black">ACTIVITY FEED</span>
              <button
                onClick={() => {
                  soundFx.play('switch');
                  setCurrentView('scoring');
                }}
                className="text-xs font-mono text-[#FF5FA0] hover:underline font-black"
              >
                Terminal
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
                      className="p-3 rounded-xl bg-[#FAF7EE] border-2 border-[#0D0518] text-xs font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[#0D0518] truncate max-w-[140px]">
                          {participant?.avatar} {participant?.name || 'Participant'}
                        </span>
                        <span
                          className={`font-black font-mono px-1.5 py-0.5 rounded border border-[#0D0518] ${
                            isPositive
                              ? 'bg-[#28C76F] text-[#0D0518]'
                              : 'bg-[#FF5FA0] text-white'
                          }`}
                        >
                          {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 truncate mt-0.5 font-medium">
                        in {game?.name || 'Game'}: "{noteText}"
                      </p>
                      <div className="text-[10px] text-gray-500 flex justify-between mt-1 font-bold">
                        <span>{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })}

              {(data.transactions || []).length === 0 && (
                <div className="text-center py-6 text-gray-500 font-mono text-xs font-bold">
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
            className="btn-pixel-pink w-full mt-5 text-center justify-center text-xs py-3"
          >
            Open Scoring Console
          </button>
        </div>
      </div>
    </div>
  );
}
