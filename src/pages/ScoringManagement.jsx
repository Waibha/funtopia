import React, { useState } from 'react';
import {
  Coins,
  RotateCcw,
  Search,
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
      reason: reason.trim() || (isDeduction ? 'Manual penalty deduction' : 'Score award'),
      timestamp: new Date().toISOString(),
      admin: adminName.trim() || 'Admin',
    };

    onAwardScore(tx);
    setReason('');
  };

  const handleRollback = (txId) => {
    soundFx.play('coin');
    if (window.confirm('Revert and roll back this scoring transaction?')) {
      onRollbackTransaction(txId);
    }
  };

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
    <div className="py-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Coins className="w-5 h-5 text-arcade-yellow" />
          <h1 className="font-bungee text-2xl sm:text-3xl text-white">
            SCORING TERMINAL
          </h1>
        </div>
        <p className="text-arcade-muted font-sans text-xs sm:text-sm">
          Dispatch point rewards, issue rule penalties, and audit the live verified ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DISPATCH TERMINAL (1 col) */}
        <div className="bg-[#15141c] border-2 border-black rounded-xl p-5 shadow-arcade flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-arcade-border pb-2.5">
              <span className="font-arcade text-xs text-white">SCORE DISPATCH</span>
              <div className="flex items-center gap-1 bg-[#0e0d14] p-1 rounded border border-arcade-border text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.play('click');
                    setIsDeduction(false);
                  }}
                  className={`px-2.5 py-1 rounded font-bold transition-colors ${
                    !isDeduction
                      ? 'bg-arcade-yellow text-black'
                      : 'text-arcade-muted hover:text-white'
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
                  className={`px-2.5 py-1 rounded font-bold transition-colors ${
                    isDeduction
                      ? 'bg-red-600 text-white'
                      : 'text-arcade-muted hover:text-white'
                  }`}
                >
                  DEDUCT
                </button>
              </div>
            </div>

            <form onSubmit={handleScoreSubmit} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-arcade-muted mb-1 font-bold">RECIPIENT CREW</label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none focus:border-arcade-yellow font-display font-bold"
                >
                  {data.teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.avatar} {t.name} [{t.tag}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-arcade-muted mb-1 font-bold">DISCIPLINE</label>
                <select
                  value={selectedGameId}
                  onChange={(e) => setSelectedGameId(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none focus:border-arcade-yellow font-display font-bold"
                >
                  {data.games.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.icon} {g.name} ({g.basePoints} Base PTS)
                    </option>
                  ))}
                </select>
              </div>

              {/* Point Value & Quick Chips */}
              <div>
                <label className="block text-arcade-muted mb-1 font-bold">
                  POINTS ({isDeduction ? 'PENALTY -' : 'AWARD +'})
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪙</span>
                  <input
                    type="number"
                    min={1}
                    required
                    value={pointsDelta}
                    onChange={(e) => setPointsDelta(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded bg-[#0e0d14] border text-base font-mono font-black focus:outline-none ${
                      isDeduction
                        ? 'border-red-500 text-red-400'
                        : 'border-arcade-yellow text-arcade-yellow'
                    }`}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {quickPills.map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => {
                        soundFx.play('click');
                        setPointsDelta(val);
                      }}
                      className="px-2 py-1 rounded bg-[#0e0d14] hover:bg-white/10 border border-arcade-border text-white text-[11px] font-mono font-bold"
                    >
                      {isDeduction ? `-${val}` : `+${val}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-arcade-muted mb-1 font-bold">REASON</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. 1st Place Podium Finish"
                  className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none focus:border-arcade-yellow"
                />
              </div>

              <div>
                <label className="block text-arcade-muted mb-1 font-bold">OPERATOR</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none focus:border-arcade-yellow"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded font-display font-black text-xs tracking-wider uppercase border-2 border-black shadow-arcade transition-all ${
                  isDeduction
                    ? 'bg-red-600 text-white hover:bg-red-500'
                    : 'bg-arcade-yellow text-black hover:bg-yellow-300'
                }`}
              >
                {isDeduction ? `DEDUCT -${pointsDelta} PTS` : `AWARD +${pointsDelta} PTS`}
              </button>
            </form>
          </div>
        </div>

        {/* VERIFIED LEDGER TABLE (2 cols) */}
        <div className="lg:col-span-2 bg-[#15141c] border-2 border-black rounded-xl p-5 shadow-arcade flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 border-b border-arcade-border pb-2.5">
              <div>
                <span className="font-arcade text-xs text-white">VERIFIED AUDIT LEDGER</span>
                <p className="text-[11px] font-mono text-arcade-muted mt-0.5">
                  Showing {filteredTransactions.length} of {data.transactions.length} records
                </p>
              </div>

              {/* Search & Team Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-44">
                  <Search className="w-3.5 h-3.5 text-arcade-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-8 pr-2.5 py-1.5 rounded bg-[#0e0d14] border border-arcade-border text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-[#0e0d14] border border-arcade-border text-xs font-mono text-white focus:outline-none"
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

            {/* Transaction Rows */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredTransactions.map((tx) => {
                const team = data.teams.find((t) => t.id === tx.teamId);
                const game = data.games.find((g) => g.id === tx.gameId);
                const isPositive = Number(tx.pointsDelta) >= 0;

                return (
                  <div
                    key={tx.id}
                    className="p-3 rounded-lg bg-[#100f16] border border-arcade-border flex items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 border border-black"
                        style={{ backgroundColor: team?.color || '#FF007F' }}
                      >
                        {team?.avatar}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-display">
                            {team?.name || 'Unknown'}
                          </span>
                          <span className="text-[10px] text-arcade-muted">
                            in {game?.name || 'Discipline'}
                          </span>
                        </div>
                        <p className="text-zinc-300 text-xs italic mt-0.5">
                          "{tx.reason}"
                        </p>
                        <div className="text-[10px] text-zinc-500 flex items-center gap-2 mt-0.5">
                          <span>By: {tx.admin}</span>
                          <span>•</span>
                          <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-sm font-black font-mono px-2 py-0.5 rounded ${
                          isPositive
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                      </span>

                      <button
                        onClick={() => handleRollback(tx.id)}
                        title="Rollback Transaction"
                        className="p-1.5 rounded bg-[#201d2a] hover:bg-red-950 hover:text-red-400 text-zinc-400 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-10 text-zinc-500 font-mono text-xs">
                  No matching transactions in ledger.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
