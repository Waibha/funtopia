import React, { useState } from 'react';
import { Coins, Plus, Minus, Search, ShieldCheck, History, Sliders, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { soundFx } from '../../utilities/soundFx';

export default function CoinEconomyManager({
  data,
  onUpdateStartingCoins,
  onAdjustParticipantCoins,
}) {
  const currentStartingCoins = data.settings?.startingCoins ?? 0;
  const [newStartingCoinsInput, setNewStartingCoinsInput] = useState(currentStartingCoins);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Manual Adjustment Modal state
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState(data.participants[0]?.id || '');
  const [adjustAmount, setAdjustAmount] = useState(5);
  const [isDeduction, setIsDeduction] = useState(false);
  const [adjustReason, setAdjustReason] = useState('');

  // Ledger Search state
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [filterParticipant, setFilterParticipant] = useState('all');

  const handleSaveStartingCoins = (e) => {
    e.preventDefault();
    soundFx.play('coin');
    const val = Math.max(0, Number(newStartingCoinsInput || 0));
    onUpdateStartingCoins(val);
    setSettingsSavedSuccess(true);
    setTimeout(() => setSettingsSavedSuccess(false), 3000);
  };

  const handleOpenAdjust = (pId = null) => {
    soundFx.play('click');
    if (pId) setSelectedParticipantId(pId);
    else if (data.participants.length > 0) setSelectedParticipantId(data.participants[0].id);
    setAdjustAmount(5);
    setIsDeduction(false);
    setAdjustReason('');
    setAdjustModalOpen(true);
  };

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    const amount = Number(adjustAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a positive coin amount.');
      return;
    }

    const finalDelta = isDeduction ? -amount : amount;
    if (finalDelta > 0) soundFx.play('scoreUp');
    else soundFx.play('scoreDown');

    onAdjustParticipantCoins({
      participantId: selectedParticipantId,
      amountDelta: finalDelta,
      reason: adjustReason.trim() || (isDeduction ? 'Manual Coin Deduction' : 'Manual Coin Credit'),
      admin: 'Admin Operator',
    });

    setAdjustModalOpen(false);
  };

  const selectedParticipant = (data.participants || []).find((p) => p.id === selectedParticipantId);

  // Filtered Coin Transactions
  const filteredCoinTxs = (data.coinTransactions || []).filter((tx) => {
    const matchesParticipant = filterParticipant === 'all' || tx.participantId === filterParticipant;
    const q = ledgerSearch.toLowerCase().trim();
    const matchesSearch = !q ||
      (tx.participantName && tx.participantName.toLowerCase().includes(q)) ||
      (tx.reason && tx.reason.toLowerCase().includes(q)) ||
      (tx.gameName && tx.gameName.toLowerCase().includes(q));
    return matchesParticipant && matchesSearch;
  });

  return (
    <div className="py-4 space-y-8 max-w-7xl mx-auto font-sans select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Coins className="w-6 h-6 text-[#FFDE25]" />
          <h1 className="font-bungee text-2xl sm:text-4xl text-[#FFDE25] pixel-title-yellow">
            COIN ECONOMY & STARTING BALANCES
          </h1>
        </div>
        <p className="text-purple-200 font-mono text-xs sm:text-sm font-medium">
          Configure initial starting coins for new registrations, view player wallets, make adjustments, and audit all transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: STARTING COINS SETTING & QUICK ADJUSTMENT (5 COLS)           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. STARTING COINS SETTING CARD */}
          <div className="bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 shadow-pixel-lg">
            <div className="flex items-center justify-between border-b-3 border-[#0D0518] pb-3 mb-4">
              <span className="font-arcade text-xs text-[#0D0518] font-black uppercase tracking-wider">
                REGISTRATION SETTING
              </span>
              <span className="text-[10px] font-mono text-gray-500 font-bold">
                SYSTEM CONFIG
              </span>
            </div>

            <div className="mb-4 bg-[#FAF7EE] border-3 border-[#0D0518] rounded-2xl p-4 text-center">
              <span className="text-[10px] font-mono text-gray-500 uppercase font-bold block mb-1">
                CURRENT STARTING COIN ALLOCATION
              </span>
              <div className="font-bungee text-4xl text-[#FF7A00] flex items-center justify-center gap-2">
                <span>🪙</span>
                <span>{currentStartingCoins} COINS</span>
              </div>
              <p className="text-[11px] font-mono text-gray-600 font-medium mt-1">
                Allocated automatically to each participant when they verify their email.
              </p>
            </div>

            {settingsSavedSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-[#28C76F] border-2 border-[#0D0518] text-[#0D0518] text-xs font-mono font-bold flex items-center gap-2 animate-bounce-subtle">
                <CheckCircle2 className="w-4 h-4 text-[#0D0518]" />
                <span>Starting coin setting saved! Applies to future registrations.</span>
              </div>
            )}

            <form onSubmit={handleSaveStartingCoins} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#0D0518] mb-1 font-black">
                  SET STARTING COINS FOR NEW PLAYERS *
                </label>
                <div className="relative">
                  <Coins className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={newStartingCoinsInput}
                    onChange={(e) => setNewStartingCoinsInput(e.target.value)}
                    placeholder="Enter starting coins (e.g. 5, 10, 20)"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-mono font-black text-lg focus:outline-none focus:border-[#FF5FA0]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border-2 border-[#5C2D91] text-xs text-[#5C2D91] font-medium">
                <strong>Important:</strong> Changing this setting does <em>not</em> alter existing participants' balances. Each participant retains their own balance.
              </div>

              <button
                type="submit"
                className="btn-pixel-yellow w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>SAVE STARTING COINS SETTING</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* 2. PLAYER WALLET BALANCES SUMMARY */}
          <div className="bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 shadow-pixel-lg">
            <div className="flex items-center justify-between border-b-3 border-[#0D0518] pb-3 mb-4">
              <div>
                <span className="font-arcade text-xs text-[#0D0518] font-black uppercase tracking-wider">
                  PARTICIPANT WALLETS
                </span>
                <span className="text-[10px] font-mono text-gray-500 font-bold block">
                  {data.participants.length} Active Players
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenAdjust()}
                disabled={data.participants.length === 0}
                className={`btn-pixel-pink text-xs py-1.5 px-3 flex items-center gap-1.5 ${
                  data.participants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>ADJUST COINS</span>
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs font-mono">
              {data.participants.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-[#FAF7EE] border-2 border-[#0D0518] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-xl">{p.avatar || '👾'}</span>
                    <div className="truncate">
                      <span className="font-display font-black text-[#0D0518] text-xs block truncate">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-gray-500 truncate block">
                        {p.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-black text-sm text-[#FF7A00] bg-white px-2.5 py-1 rounded-xl border border-[#0D0518] shadow-pixel-sm">
                      🪙 {p.coins ?? 0}
                    </span>
                    <button
                      onClick={() => handleOpenAdjust(p.id)}
                      className="px-2 py-1 rounded-lg bg-[#FFDE25] border border-[#0D0518] font-bold text-[10px] text-[#0D0518] hover:bg-yellow-300"
                      title="Adjust coins for this player"
                    >
                      ±
                    </button>
                  </div>
                </div>
              ))}

              {data.participants.length === 0 && (
                <div className="text-center py-8 text-gray-500 font-mono text-xs">
                  No participants registered yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: COIN TRANSACTION AUDIT LEDGER (7 COLS)                      */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 shadow-pixel-lg flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-3 border-[#0D0518] pb-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[#FF7A00]" />
                  <span className="font-arcade text-xs text-[#0D0518] font-black uppercase tracking-wider">
                    COIN AUDIT TRAIL
                  </span>
                </div>
                <p className="text-xs font-mono text-gray-500 mt-0.5 font-bold">
                  Immutable record of starting allocations, game entry deductions, and manual adjustments
                </p>
              </div>

              {/* Filter by player */}
              <select
                value={filterParticipant}
                onChange={(e) => setFilterParticipant(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#FAF7EE] border-2 border-[#0D0518] text-xs font-mono font-bold text-[#0D0518] focus:outline-none"
              >
                <option value="all">All Players</option>
                {data.participants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredCoinTxs.map((tx) => {
                const isPositive = Number(tx.amountDelta) >= 0;
                return (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-[#FFFDF5] border-3 border-[#0D0518] flex items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="truncate">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-[#0D0518] font-display text-sm">
                          {tx.participantName || 'Player'}
                        </span>
                        <span
                          className={`text-[9px] font-arcade font-black px-2 py-0.5 rounded border ${
                            tx.type === 'game_entry'
                              ? 'bg-purple-100 text-[#5C2D91] border-[#5C2D91]'
                              : tx.type === 'starting_allocation'
                              ? 'bg-blue-100 text-blue-800 border-blue-800'
                              : 'bg-yellow-100 text-yellow-900 border-yellow-800'
                          }`}
                        >
                          {tx.type === 'game_entry'
                            ? 'GAME ENTRY FEE'
                            : tx.type === 'starting_allocation'
                            ? 'STARTING ALLOCATION'
                            : 'ADMIN ADJUSTMENT'}
                        </span>
                      </div>

                      <p className="text-[#0D0518] text-xs font-medium mt-0.5">
                        {tx.reason || (tx.gameName ? `Entered ${tx.gameName}` : 'Coin adjustment')}
                      </p>

                      <div className="text-[10px] text-gray-500 font-bold mt-0.5 flex items-center gap-2">
                        <span>{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        <span>•</span>
                        <span>Balance after: {tx.newBalance ?? '—'} coins</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`text-sm font-black font-mono px-2.5 py-1 rounded-xl border-2 border-[#0D0518] shadow-pixel-sm ${
                          isPositive
                            ? 'bg-[#28C76F] text-[#0D0518]'
                            : 'bg-[#FF5FA0] text-white'
                        }`}
                      >
                        {isPositive ? `+${tx.amountDelta}` : tx.amountDelta} COINS
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredCoinTxs.length === 0 && (
                <div className="text-center py-20 text-gray-500 font-mono text-xs bg-[#FAF7EE] rounded-2xl border-2 border-dashed border-gray-300">
                  <Coins className="w-8 h-8 mx-auto text-gray-400 mb-2 opacity-50" />
                  No virtual coin transactions recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MANUAL COIN ADJUSTMENT MODAL                                              */}
      {/* ========================================================================= */}
      {adjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0518]/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 sm:p-8 shadow-pixel-xl">
            <button
              onClick={() => setAdjustModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-[#0D0518] font-mono text-lg font-black"
            >
              ✕
            </button>

            <h2 className="font-bungee text-2xl text-[#0D0518] mb-1">
              ADJUST PLAYER COINS
            </h2>
            <p className="text-xs text-gray-600 font-mono mb-5 font-bold">
              Manually add or deduct virtual arcade coins for an individual player.
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#0D0518] mb-1 font-black">
                  SELECT PARTICIPANT *
                </label>
                <select
                  value={selectedParticipantId}
                  onChange={(e) => setSelectedParticipantId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold focus:outline-none focus:border-[#FF5FA0]"
                >
                  {data.participants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.avatar} {p.name} ({p.email}) — Balance: {p.coins ?? 0} Coins
                    </option>
                  ))}
                </select>
              </div>

              {selectedParticipant && (
                <div className="bg-[#FAF7EE] p-3 rounded-xl border-2 border-[#0D0518] text-xs">
                  <span className="text-gray-500 font-bold">Current Balance:</span>{' '}
                  <strong className="text-[#FF7A00] font-black">{selectedParticipant.coins ?? 0} Coins</strong>
                </div>
              )}

              {/* Action Type Toggle */}
              <div>
                <label className="block text-[#0D0518] mb-1 font-black">ACTION TYPE *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.play('click');
                      setIsDeduction(false);
                    }}
                    className={`py-2 rounded-xl border-2 border-[#0D0518] font-black flex items-center justify-center gap-1.5 transition-all ${
                      !isDeduction
                        ? 'bg-[#28C76F] text-[#0D0518] shadow-pixel-sm'
                        : 'bg-white text-gray-600'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD COINS (+)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.play('click');
                      setIsDeduction(true);
                    }}
                    className={`py-2 rounded-xl border-2 border-[#0D0518] font-black flex items-center justify-center gap-1.5 transition-all ${
                      isDeduction
                        ? 'bg-[#FF5FA0] text-white shadow-pixel-sm'
                        : 'bg-white text-gray-600'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                    <span>DEDUCT COINS (-)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#0D0518] mb-1 font-black">
                  COIN AMOUNT ({isDeduction ? 'DEDUCT' : 'ADD'}) *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-mono font-black text-lg focus:outline-none focus:border-[#FF5FA0]"
                />
              </div>

              <div>
                <label className="block text-[#0D0518] mb-1 font-black">
                  REASON / AUDIT NOTE (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Tournament check-in bonus"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7EE] border-2 border-[#0D0518] text-[#0D0518] font-medium focus:outline-none"
                />
              </div>

              <div className="pt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="btn-pixel-white text-center justify-center text-xs py-3"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn-pixel-yellow text-center justify-center text-xs py-3 font-bold"
                >
                  {isDeduction ? `DEDUCT -${adjustAmount} COINS` : `ADD +${adjustAmount} COINS`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
