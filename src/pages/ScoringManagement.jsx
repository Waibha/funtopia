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
    <div className="py-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Coins className="w-5 h-5 text-pop-coral" />
          <h1 className="font-bungee text-2xl sm:text-3xl text-pop-ink">
            SCORING TERMINAL
          </h1>
        </div>
        <p className="text-pop-muted font-sans text-xs sm:text-sm font-medium">
          Dispatch point rewards, issue rule deductions, and audit the live verified ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* DISPATCH TERMINAL (1 col) */}
        <div className="bg-white border-3 border-pop-ink rounded-3xl p-6 shadow-pop flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 border-b-2 border-pop-ink pb-3">
              <span className="font-arcade text-xs text-pop-ink font-black">DISPATCH PANEL</span>
              <div className="flex items-center gap-1 bg-pop-butter p-1 rounded-xl border-2 border-pop-ink text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.play('click');
                    setIsDeduction(false);
                  }}
                  className={`px-3 py-1 rounded-lg font-black transition-all ${
                    !isDeduction
                      ? 'bg-pop-yellow text-pop-ink border border-pop-ink shadow-pop-sm'
                      : 'text-pop-muted hover:text-pop-ink'
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
                  className={`px-3 py-1 rounded-lg font-black transition-all ${
                    isDeduction
                      ? 'bg-pop-coral text-white border border-pop-ink shadow-pop-sm'
                      : 'text-pop-muted hover:text-pop-ink'
                  }`}
                >
                  DEDUCT
                </button>
              </div>
            </div>

            <form onSubmit={handleScoreSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-pop-ink mb-1 font-black">RECIPIENT CREW</label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-display font-black text-sm focus:outline-none focus:border-pop-coral"
                >
                  {data.teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.avatar} {t.name} [{t.tag}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-pop-ink mb-1 font-black">DISCIPLINE</label>
                <select
                  value={selectedGameId}
                  onChange={(e) => setSelectedGameId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-display font-black text-sm focus:outline-none focus:border-pop-coral"
                >
                  {data.games.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.icon} {g.name} ({g.basePoints} Base PTS)
                    </option>
                  ))}
                </select>
              </div>

              {/* Point Value & Quick Increment Chips */}
              <div>
                <label className="block text-pop-ink mb-1 font-black">
                  POINTS ({isDeduction ? 'PENALTY -' : 'AWARD +'})
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🪙</span>
                  <input
                    type="number"
                    min={1}
                    required
                    value={pointsDelta}
                    onChange={(e) => setPointsDelta(Number(e.target.value))}
                    className={`w-full px-3.5 py-2 rounded-xl bg-pop-canvas border-2 text-xl font-mono font-black focus:outline-none ${
                      isDeduction
                        ? 'border-pop-coral text-pop-coral'
                        : 'border-pop-ink text-pop-ink'
                    }`}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {quickPills.map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => {
                        soundFx.play('click');
                        setPointsDelta(val);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-pop-butter hover:bg-pop-yellow-light border-2 border-pop-ink text-pop-ink text-xs font-mono font-black shadow-pop-sm transition-all"
                    >
                      {isDeduction ? `-${val}` : `+${val}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-pop-ink mb-1 font-black">REASON</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. 1st Place Podium Finish"
                  className="w-full px-3 py-2.5 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-medium focus:outline-none focus:border-pop-coral"
                />
              </div>

              <div>
                <label className="block text-pop-ink mb-1 font-black">OPERATOR</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-2xl font-display font-black text-xs sm:text-sm tracking-wider uppercase border-3 border-pop-ink shadow-pop transition-all hover:-translate-y-0.5 active:translate-y-1 ${
                  isDeduction
                    ? 'bg-pop-coral text-white hover:bg-red-600'
                    : 'bg-pop-yellow text-pop-ink hover:bg-yellow-300'
                }`}
              >
                {isDeduction ? `DEDUCT -${pointsDelta} PTS` : `DISPATCH +${pointsDelta} PTS`}
              </button>
            </form>
          </div>
        </div>

        {/* VERIFIED LEDGER TABLE (2 cols) */}
        <div className="lg:col-span-2 bg-white border-3 border-pop-ink rounded-3xl p-6 shadow-pop flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 border-b-2 border-pop-ink pb-3">
              <div>
                <span className="font-arcade text-xs text-pop-ink font-black">VERIFIED AUDIT LEDGER</span>
                <p className="text-xs font-mono text-pop-muted mt-0.5 font-bold">
                  Showing {filteredTransactions.length} of {data.transactions.length} entries
                </p>
              </div>

              {/* Search & Team Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-pop-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ledger..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-pop-canvas border-2 border-pop-ink text-xs font-mono text-pop-ink font-bold focus:outline-none"
                  />
                </div>

                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-pop-canvas border-2 border-pop-ink text-xs font-mono text-pop-ink font-bold focus:outline-none"
                >
                  <option value="all">All Crews</option>
                  {data.teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Transaction Rows */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredTransactions.map((tx) => {
                const team = data.teams.find((t) => t.id === tx.teamId);
                const game = data.games.find((g) => g.id === tx.gameId);
                const isPositive = Number(tx.pointsDelta) >= 0;

                return (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-pop-butter border-2 border-pop-ink flex items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border-2 border-pop-ink shadow-pop-sm"
                        style={{ backgroundColor: team?.color || '#FF2A6D' }}
                      >
                        {team?.avatar}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-pop-ink font-display text-sm">
                            {team?.name || 'Unknown'}
                          </span>
                          <span className="text-[11px] text-pop-muted font-bold">
                            in {game?.name || 'Discipline'}
                          </span>
                        </div>
                        <p className="text-pop-ink text-xs italic mt-0.5 font-medium">
                          "{tx.reason}"
                        </p>
                        <div className="text-[10px] text-pop-muted flex items-center gap-2 mt-0.5 font-bold">
                          <span>By: {tx.admin}</span>
                          <span>•</span>
                          <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-sm font-black font-mono px-2.5 py-1 rounded-xl border-2 border-pop-ink shadow-pop-sm ${
                          isPositive
                            ? 'bg-pop-green text-pop-ink'
                            : 'bg-pop-coral text-white'
                        }`}
                      >
                        {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                      </span>

                      <button
                        onClick={() => handleRollback(tx.id)}
                        title="Revert Transaction"
                        className="p-2 rounded-xl bg-white hover:bg-pop-coral hover:text-white text-pop-ink border-2 border-pop-ink shadow-pop-sm transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12 text-pop-muted font-mono text-xs font-bold">
                  No matching transactions found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
