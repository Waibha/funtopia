import React, { useState } from 'react';
import {
  Coins,
  PlusCircle,
  MinusCircle,
  RotateCcw,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Flame,
  Zap,
} from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function ScoringManagement({
  data,
  onAwardScore,
  onRollbackTransaction,
  quickTeamId = null,
}) {
  const [selectedTeamId, setSelectedTeamId] = useState(
    quickTeamId || (data.teams[0]?.id || '')
  );
  const [selectedGameId, setSelectedGameId] = useState(
    data.games[0]?.id || ''
  );
  const [pointsDelta, setPointsDelta] = useState(100);
  const [reason, setReason] = useState('');
  const [adminName, setAdminName] = useState('Chief Marshal Orion');
  const [isDeduction, setIsDeduction] = useState(false);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');

  const quickPills = [25, 50, 100, 150, 250, 500];

  const handleScoreSubmit = (e) => {
    e.preventDefault();
    const finalDelta = isDeduction ? -Math.abs(Number(pointsDelta)) : Math.abs(Number(pointsDelta));

    if (finalDelta > 0) {
      soundFx.play('scoreUp');
    } else {
      soundFx.play('scoreDown');
    }

    const tx = {
      id: `tx-${Date.now()}`,
      eventId: data.activeEventId,
      teamId: selectedTeamId,
      gameId: selectedGameId,
      pointsDelta: finalDelta,
      reason: reason.trim() || (isDeduction ? 'Manual penalty deduction' : 'Manual score adjustment award'),
      timestamp: new Date().toISOString(),
      admin: adminName.trim() || 'Admin',
    };

    onAwardScore(tx);
    setReason('');
  };

  const handleRollback = (txId) => {
    soundFx.play('coin');
    if (window.confirm('Roll back and revert this scoring transaction?')) {
      onRollbackTransaction(txId);
    }
  };

  // Filtered transactions
  const filteredTransactions = data.transactions
    .filter((tx) => {
      const team = data.teams.find((t) => t.id === tx.teamId);
      const matchesSearch =
        tx.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.admin.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTeam = filterTeam === 'all' || tx.teamId === filterTeam;
      return matchesSearch && matchesTeam;
    })
    .slice()
    .reverse();

  return (
    <div className="py-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Coins className="w-5 h-5 text-arcade-yellow" />
          <h1 className="font-bungee text-2xl sm:text-3xl text-white">
            SCORING MANAGEMENT DECK
          </h1>
        </div>
        <p className="text-gray-400 font-sans text-sm">
          Dispatch point rewards, issue rule deductions, and audit the live championship transaction ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* DISPATCH CONTROLS (1 col) */}
        <div className="rounded-2xl bg-[#0c0e28] border border-purple-500/30 p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-arcade text-xs sm:text-sm text-arcade-yellow tracking-wider">
              DISPATCH POINTS
            </h2>
            <div className="flex items-center gap-1 bg-[#070817] p-1 rounded-lg border border-purple-500/20 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  soundFx.play('click');
                  setIsDeduction(false);
                }}
                className={`px-2.5 py-1 rounded transition-all font-bold ${
                  !isDeduction
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                AWARD
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.play('click');
                  setIsDeduction(true);
                }}
                className={`px-2.5 py-1 rounded transition-all font-bold ${
                  isDeduction
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                DEDUCT
              </button>
            </div>
          </div>

          <form onSubmit={handleScoreSubmit} className="space-y-4 text-xs font-mono">
            {/* Target Team */}
            <div>
              <label className="block text-gray-300 mb-1">RECIPIENT CREW</label>
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-yellow font-display font-semibold"
              >
                {data.teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.avatar} {t.name} [{t.tag}]
                  </option>
                ))}
              </select>
            </div>

            {/* Target Game */}
            <div>
              <label className="block text-gray-300 mb-1">DISCIPLINE / MATCH</label>
              <select
                value={selectedGameId}
                onChange={(e) => setSelectedGameId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-yellow font-display font-semibold"
              >
                {data.games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.icon} {g.name} ({g.basePoints} Base PTS)
                  </option>
                ))}
              </select>
            </div>

            {/* Points Value & Quick Chips */}
            <div>
              <label className="block text-gray-300 mb-1">
                POINT MAGNITUDE ({isDeduction ? 'PENALTY -' : 'AWARD +'})
              </label>
              <input
                type="number"
                min={1}
                required
                value={pointsDelta}
                onChange={(e) => setPointsDelta(Number(e.target.value))}
                className={`w-full px-3 py-2.5 rounded-xl bg-[#070817] border text-lg font-mono font-extrabold focus:outline-none ${
                  isDeduction
                    ? 'border-red-500/50 text-red-400 focus:border-red-400'
                    : 'border-emerald-500/50 text-emerald-400 focus:border-emerald-400'
                }`}
              />

              {/* Quick Increment Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {quickPills.map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => {
                      soundFx.play('click');
                      setPointsDelta(val);
                    }}
                    className="px-2 py-1 rounded bg-[#070817] border border-purple-500/20 text-gray-300 hover:text-white hover:border-arcade-yellow text-[11px] font-mono"
                  >
                    {isDeduction ? `-${val}` : `+${val}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-gray-300 mb-1">JUDGE REASON / ACHIEVEMENT</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. 1st Place Podium Finish or Time Penalty"
                className="w-full px-3 py-2 rounded-xl bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-yellow"
              />
            </div>

            {/* Admin Signature */}
            <div>
              <label className="block text-gray-300 mb-1">MARSHAL / JUDGE NAME</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-yellow"
              />
            </div>

            {/* Submit Dispatch Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-display font-bold text-xs tracking-wider uppercase transition-all shadow-lg hover:scale-[1.02] active:scale-95 ${
                isDeduction
                  ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-red-900/40'
                  : 'bg-gradient-to-r from-arcade-yellow to-amber-500 text-slate-950 shadow-arcade-button-yellow'
              }`}
            >
              {isDeduction ? `DEDUCT -${pointsDelta} POINTS` : `DISPATCH +${pointsDelta} POINTS`}
            </button>
          </form>
        </div>

        {/* TRANSACTION AUDIT LEDGER (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0c0e28] border border-purple-500/30 p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-arcade text-xs sm:text-sm text-white tracking-wider">
                  VERIFIED TRANSACTION LEDGER
                </h2>
                <p className="text-xs font-mono text-gray-400 mt-0.5">
                  Showing {filteredTransactions.length} of {data.transactions.length} records
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ledger..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#070817] border border-purple-500/30 text-xs font-mono text-white focus:outline-none focus:border-arcade-cyan"
                  />
                </div>

                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#070817] border border-purple-500/30 text-xs font-mono text-white focus:outline-none"
                >
                  <option value="all">All Teams</option>
                  {data.teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredTransactions.map((tx) => {
                const team = data.teams.find((t) => t.id === tx.teamId);
                const game = data.games.find((g) => g.id === tx.gameId);
                const isPositive = Number(tx.pointsDelta) >= 0;

                return (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-xl bg-[#070817] border border-purple-500/10 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border"
                        style={{
                          backgroundColor: `${team?.color || '#FF007F'}15`,
                          borderColor: `${team?.color || '#FF007F'}50`,
                        }}
                      >
                        {team?.avatar}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-display text-sm">
                            {team?.name || 'Unknown Team'}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            in {game?.name || 'Discipline'}
                          </span>
                        </div>
                        <p className="text-gray-300 text-xs italic mt-0.5">
                          "{tx.reason}"
                        </p>
                        <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-1">
                          <span>By: {tx.admin}</span>
                          <span>•</span>
                          <span>{new Date(tx.timestamp).toLocaleString()}</span>
                          <span>•</span>
                          <span className="text-purple-400/80">{tx.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span
                        className={`text-base font-extrabold font-mono px-2.5 py-1 rounded-lg ${
                          isPositive
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                      </span>

                      <button
                        onClick={() => handleRollback(tx.id)}
                        title="Revert / Rollback Transaction"
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 border border-purple-500/20 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12 text-gray-500 font-mono text-xs">
                  No matching score transactions found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
