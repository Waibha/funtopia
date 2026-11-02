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
  Activity,
  Shield,
} from 'lucide-react';
import LeaderboardTableView from '../components/leaderboard/LeaderboardTableView';
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
      colorBar: 'bg-[#FFC837]',
      textColor: 'text-amber-300',
      action: () => setCurrentView('coins'),
    },
    {
      label: 'QUEST TRIALS',
      value: `${(data.games || []).length} GAMES`,
      subtext: `${activeGamesCount} Active In Rotation`,
      icon: Gamepad2,
      colorBar: 'bg-[#00F0FF]',
      textColor: 'text-cyan-300',
      action: () => setCurrentView('games'),
    },
    {
      label: 'CHAMPIONS',
      value: `${(data.participants || []).length} PLAYERS`,
      subtext: 'Verified Registered Users',
      icon: Users,
      colorBar: 'bg-emerald-400',
      textColor: 'text-emerald-300',
      action: () => setCurrentView('participants'),
    },
    {
      label: 'AWARDED RENOWN',
      value: `${totalPoints.toLocaleString()} PTS`,
      subtext: `${(data.transactions || []).length} Verified Entries`,
      icon: Trophy,
      colorBar: 'bg-purple-400',
      textColor: 'text-purple-300',
      action: () => setCurrentView('scoring'),
    },
  ];

  return (
    <div className="py-4 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Citadel Scribe Control Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0F1B38] via-[#0B152C] to-[#070D1C] border border-[#00F0FF]/30 p-6 sm:p-8 shadow-fantasy-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-cinzel text-[10px] text-[#00F0FF] tracking-widest font-bold uppercase">
              HIGH CITADEL ARCHIVE • REALM STANDINGS
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-cinzel font-black tracking-wider text-[#FFC837] fantasy-title-gold">
            LEADERBOARD
          </h1>
          <p className="text-slate-300 font-jakarta text-xs sm:text-sm mt-1 max-w-xl font-medium">
            Live kingdom participant rankings, quest-by-quest score breakdown, and master marshal scoring controls.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={() => {
              soundFx.play('coin');
              if (onOpenQuickScore) onOpenQuickScore();
            }}
            className="btn-fantasy-primary flex items-center gap-2 text-xs py-3 px-5 font-cinzel font-black"
          >
            <Trophy className="w-4 h-4 text-[#0A091A]" />
            <span>UPDATE SCORES</span>
          </button>

          <button
            onClick={() => {
              soundFx.play('click');
              setCurrentView('coins');
            }}
            className="btn-fantasy-subtle flex items-center gap-1.5 text-xs py-2.5 px-4 font-cinzel font-bold text-amber-200"
          >
            <Coins className="w-4 h-4 text-[#FFC837]" />
            <span>COIN SETTINGS</span>
          </button>

          <button
            onClick={() => {
              soundFx.play('click');
              setCurrentView('games');
            }}
            className="btn-fantasy-citadel flex items-center gap-1.5 text-xs py-2.5 px-4 font-cinzel font-bold"
          >
            <Gamepad2 className="w-4 h-4 text-[#00F0FF]" />
            <span>GAMES</span>
          </button>

          <button
            onClick={() => {
              soundFx.play('fanfare');
              triggerCelebration();
            }}
            className="btn-fantasy-subtle flex items-center gap-1.5 text-xs py-2.5 px-3 font-cinzel text-pink-300"
          >
            <Sparkles className="w-4 h-4 text-[#FFC837]" />
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
              className="rounded-2xl bg-gradient-to-b from-[#101A30] to-[#0A101E] border border-white/10 p-5 shadow-fantasy-card hover:-translate-y-1 hover:border-[#00F0FF]/40 transition-all cursor-pointer relative overflow-hidden text-slate-100"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${st.colorBar}`} />
              <div className="flex items-center justify-between mb-2 mt-1">
                <span className="font-cinzel text-[10px] text-slate-400 font-bold tracking-wider">
                  {st.label}
                </span>
                <Icon className="w-4 h-4 text-[#00F0FF]" />
              </div>
              <h3 className={`font-cinzel font-black text-2xl ${st.textColor} truncate mb-0.5`}>
                {st.value}
              </h3>
              <div className="flex items-center justify-between text-xs font-jakarta text-slate-400">
                <span className="truncate">{st.subtext}</span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0 ml-1 text-slate-300" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-Width Championship Leaderboard with All Games */}
      <section aria-label="Admin Championship Leaderboard">
        <LeaderboardTableView
          leaderboard={leaderboard}
          games={data.games || []}
          onOpenQuickScore={onOpenQuickScore}
          isAdmin={true}
        />
      </section>

      {/* Operator Activity Feed & Scoring Terminal Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Transaction Log */}
        <div className="rounded-3xl bg-gradient-to-b from-[#101B33] to-[#0A1122] border border-white/10 p-6 shadow-fantasy-card flex flex-col justify-between text-slate-100">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-cinzel text-xs text-amber-200 font-bold">
                <Activity className="w-4 h-4 text-[#00F0FF]" />
                <span>RECENT DISPATCHED SCORES</span>
              </div>
              <button
                onClick={() => {
                  soundFx.play('switch');
                  setCurrentView('scoring');
                }}
                className="text-xs font-jakarta text-cyan-300 hover:text-cyan-200 hover:underline font-bold"
              >
                Scoring Terminal →
              </button>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {(data.transactions || [])
                .slice(-6)
                .reverse()
                .map((tx) => {
                  const participant = (data.participants || []).find((p) => p.id === tx.participantId);
                  const game = (data.games || []).find((g) => g.id === tx.gameId);
                  const isPositive = Number(tx.pointsDelta) >= 0;
                  const noteText = tx.note || tx.reason || 'Points update';

                  return (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-xl bg-[#070D1B] border border-white/10 text-xs font-jakarta"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-100 truncate max-w-[150px]">
                          {participant?.avatar || '⚔️'} {participant?.name || 'Participant'}
                        </span>
                        <span
                          className={`font-bold font-mono px-2 py-0.5 rounded border text-xs ${
                            isPositive
                              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                              : 'bg-red-950/80 border-red-500/50 text-red-300'
                          }`}
                        >
                          {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        in {game?.name || 'Quest'}: "{noteText}"
                      </p>
                      <div className="text-[10px] text-slate-500 flex justify-between mt-1 font-mono">
                        <span>{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })}

              {(data.transactions || []).length === 0 && (
                <div className="text-center py-8 text-slate-400 font-jakarta text-xs">
                  No scores recorded yet.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.play('switch');
              setCurrentView('scoring');
            }}
            className="btn-fantasy-primary w-full mt-4 text-center justify-center text-xs py-3 font-cinzel font-black"
          >
            Launch Scoring Console
          </button>
        </div>

        {/* Quick Rotation Directory & System Status */}
        <div className="rounded-3xl bg-gradient-to-b from-[#101B33] to-[#0A1122] border border-white/10 p-6 shadow-fantasy-card flex flex-col justify-between text-slate-100">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-cinzel text-xs text-[#FFC837] font-bold uppercase">
                <Gamepad2 className="w-4 h-4 text-[#00F0FF]" />
                <span>ROTATING QUEST TRIALS</span>
              </div>
              <button
                onClick={() => {
                  soundFx.play('switch');
                  setCurrentView('games');
                }}
                className="text-xs font-jakarta text-cyan-300 hover:text-cyan-200 hover:underline font-bold"
              >
                Manage Games →
              </button>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {(data.games || []).map((g, idx) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#070D1B] border border-white/10 text-xs font-jakarta"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-cinzel text-slate-500 font-bold">#{idx + 1}</span>
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

              {(data.games || []).length === 0 && (
                <div className="text-center py-8 text-slate-400 font-jakarta text-xs">
                  No games configured. Click "Manage Games" to add games.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.play('switch');
              setCurrentView('games');
            }}
            className="btn-fantasy-citadel w-full mt-4 text-center justify-center text-xs py-3 font-cinzel font-bold"
          >
            Add / Edit Quest Trials
          </button>
        </div>
      </div>
    </div>
  );
}
