import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Coins,
  RotateCcw,
  Search,
  Check,
  ChevronDown,
  User,
  Gamepad2,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function ScoringManagement({
  data,
  onAwardScore,
  onRollbackTransaction,
  quickParticipantId = null,
}) {
  // Selected IDs
  const [selectedParticipantId, setSelectedParticipantId] = useState(
    quickParticipantId || (data.participants[0]?.id || '')
  );
  const [selectedGameId, setSelectedGameId] = useState(
    data.games[0]?.id || ''
  );

  // Search dropdown states
  const [participantSearch, setParticipantSearch] = useState('');
  const [isParticipantDropdownOpen, setIsParticipantDropdownOpen] = useState(false);

  const [gameSearch, setGameSearch] = useState('');
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);

  // Score action states
  const [pointsDelta, setPointsDelta] = useState(() => {
    const initialGame = data.games[0];
    if (initialGame && initialGame.defaultPoints !== undefined && initialGame.defaultPoints !== null && initialGame.defaultPoints !== '') {
      return Number(initialGame.defaultPoints);
    }
    return '';
  });
  const [note, setNote] = useState('');
  const [isDeduction, setIsDeduction] = useState(false);
  const [recentSuccessBanner, setRecentSuccessBanner] = useState(null);

  // Ledger filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterParticipant, setFilterParticipant] = useState('all');

  const participantRef = useRef(null);
  const gameRef = useRef(null);

  // Automatically populate pointsDelta with selected game's default points earned
  useEffect(() => {
    if (!selectedGameId) {
      setPointsDelta('');
      return;
    }
    const game = data.games.find((g) => g.id === selectedGameId);
    if (game && game.defaultPoints !== undefined && game.defaultPoints !== null && game.defaultPoints !== '') {
      setPointsDelta(Number(game.defaultPoints));
    } else {
      setPointsDelta('');
    }
  }, [selectedGameId, data.games]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (participantRef.current && !participantRef.current.contains(event.target)) {
        setIsParticipantDropdownOpen(false);
      }
      if (gameRef.current && !gameRef.current.contains(event.target)) {
        setIsGameDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update selection if quickParticipantId changes
  useEffect(() => {
    if (quickParticipantId) {
      setSelectedParticipantId(quickParticipantId);
    }
  }, [quickParticipantId]);

  // Fallback selection if current selection is invalid
  useEffect(() => {
    if (data.participants.length > 0 && !data.participants.some((p) => p.id === selectedParticipantId)) {
      setSelectedParticipantId(data.participants[0].id);
    }
    if (data.games.length > 0 && !data.games.some((g) => g.id === selectedGameId)) {
      setSelectedGameId(data.games[0].id);
    }
  }, [data.participants, data.games, selectedParticipantId, selectedGameId]);

  // Filtered participants list for Step 1
  const filteredParticipants = useMemo(() => {
    const q = participantSearch.toLowerCase().trim();
    if (!q) return data.participants;
    return data.participants.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.usn && p.usn.toLowerCase().includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q))
    );
  }, [data.participants, participantSearch]);

  // Filtered games list for Step 2
  const filteredGames = useMemo(() => {
    const q = gameSearch.toLowerCase().trim();
    if (!q) return data.games;
    return data.games.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        (g.description && g.description.toLowerCase().includes(q))
    );
  }, [data.games, gameSearch]);

  // Find currently selected participant and game
  const selectedParticipant = data.participants.find((p) => p.id === selectedParticipantId) || data.participants[0];
  const selectedGame = data.games.find((g) => g.id === selectedGameId) || data.games[0];

  // Calculate current score for this specific participant in this specific game
  const currentScoreForGame = useMemo(() => {
    if (!selectedParticipant || !selectedGame) return 0;
    return (data.transactions || [])
      .filter((tx) => tx.participantId === selectedParticipant.id && tx.gameId === selectedGame.id)
      .reduce((sum, tx) => sum + Number(tx.pointsDelta || 0), 0);
  }, [data.transactions, selectedParticipant, selectedGame]);

  // Calculate total tournament score for this participant
  const totalScoreForParticipant = useMemo(() => {
    if (!selectedParticipant) return 0;
    return (data.transactions || [])
      .filter((tx) => tx.participantId === selectedParticipant.id)
      .reduce((sum, tx) => sum + Number(tx.pointsDelta || 0), 0);
  }, [data.transactions, selectedParticipant]);

  const quickPills = [10, 25, 50, 100, 250, 500];

  // Step 4: Handle score submission
  const handleScoreSubmit = (e) => {
    e.preventDefault();
    if (!selectedParticipant || !selectedGame) {
      alert('Please select both a participant and a game.');
      return;
    }

    const numericDelta = Number(pointsDelta);
    if (isNaN(numericDelta) || numericDelta <= 0) {
      alert('Please enter a valid positive number of points.');
      return;
    }

    const finalDelta = isDeduction ? -Math.abs(numericDelta) : Math.abs(numericDelta);

    if (finalDelta > 0) {
      soundFx.play('scoreUp');
    } else {
      soundFx.play('scoreDown');
    }

    const tx = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      competitionId: data.activeCompetition?.id || 'madagascar-championship',
      participantId: selectedParticipant.id,
      gameId: selectedGame.id,
      pointsDelta: finalDelta,
      note: note.trim() || (isDeduction ? `Score deduction for ${selectedGame.name}` : `Points award for ${selectedGame.name}`),
      timestamp: new Date().toISOString(),
      admin: 'Admin Operator',
    };

    onAwardScore(tx);

    const updatedGameScore = currentScoreForGame + finalDelta;
    setRecentSuccessBanner({
      participantName: selectedParticipant.name,
      gameName: selectedGame.name,
      delta: finalDelta,
      newGameScore: updatedGameScore,
      timestamp: Date.now(),
    });

    setNote('');
  };

  const handleRollback = (txId) => {
    soundFx.play('coin');
    if (window.confirm('Revert and undo this score transaction?')) {
      onRollbackTransaction(txId);
    }
  };

  const filteredTransactions = (data.transactions || [])
    .filter((tx) => {
      const participant = data.participants.find((p) => p.id === tx.participantId);
      const game = data.games.find((g) => g.id === tx.gameId);
      const noteStr = tx.note || tx.reason || '';

      const matchesSearch =
        noteStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesParticipant = filterParticipant === 'all' || tx.participantId === filterParticipant;

      return matchesSearch && matchesParticipant;
    })
    .slice()
    .reverse();

  return (
    <div className="py-4 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Coins className="w-6 h-6 text-[#FF5FA0]" />
          <h1 className="font-bungee text-2xl sm:text-4xl text-[#FFDE25] pixel-title-yellow">
            UPDATE SCORES & LEDGER
          </h1>
        </div>
        <p className="text-purple-200 font-mono text-xs sm:text-sm font-medium">
          Searchable dropdown workflow: select a registered player, pick a configured game, inspect existing score, and award points.
        </p>
      </div>

      {/* Success Notification Banner */}
      {recentSuccessBanner && (
        <div className="bg-[#28C76F] border-4 border-[#0D0518] text-[#0D0518] rounded-2xl p-4 shadow-pixel flex items-center justify-between gap-3 animate-bounce-subtle">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#0D0518] shrink-0" />
            <div className="font-mono text-xs">
              <span className="font-black text-sm block">
                ✓ SCORE UPDATED SUCCESSFULLY!
              </span>
              <span>
                {recentSuccessBanner.delta > 0 ? `+${recentSuccessBanner.delta}` : recentSuccessBanner.delta} PTS recorded for{' '}
                <strong className="underline">{recentSuccessBanner.participantName}</strong> in {recentSuccessBanner.gameName}. New Game Score:{' '}
                <strong>{recentSuccessBanner.newGameScore} PTS</strong>.
              </span>
            </div>
          </div>
          <button
            onClick={() => setRecentSuccessBanner(null)}
            className="px-2.5 py-1 bg-white border-2 border-[#0D0518] rounded-lg font-bold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ========================================================================= */}
        {/* LEFT PANEL: DEDICATED SEARCHABLE DROPDOWN SCORING WORKFLOW (5 COLS)        */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 shadow-pixel-lg flex flex-col justify-between">
          <div className="space-y-6">
            <div className="border-b-3 border-[#0D0518] pb-3 flex items-center justify-between">
              <div>
                <span className="font-arcade text-xs text-[#0D0518] font-black uppercase tracking-wider">
                  SCORING DISPATCH WORKFLOW
                </span>
                <p className="text-[11px] font-mono text-gray-500 font-bold">
                  Step 1 → Step 2 → Step 3 → Live Sync
                </p>
              </div>

              {/* Award / Deduct Toggle */}
              <div className="flex items-center gap-1 bg-[#FAF7EE] p-1 rounded-xl border-2 border-[#0D0518] text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.play('click');
                    setIsDeduction(false);
                  }}
                  className={`px-3 py-1 rounded-lg font-black transition-all ${
                    !isDeduction
                      ? 'bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518] shadow-pixel-sm'
                      : 'text-gray-500 hover:text-[#0D0518]'
                  }`}
                >
                  AWARD (+)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.play('click');
                    setIsDeduction(true);
                  }}
                  className={`px-3 py-1 rounded-lg font-black transition-all ${
                    isDeduction
                      ? 'bg-[#FF5FA0] text-white border-2 border-[#0D0518] shadow-pixel-sm'
                      : 'text-gray-500 hover:text-[#0D0518]'
                  }`}
                >
                  DEDUCT (-)
                </button>
              </div>
            </div>

            <form onSubmit={handleScoreSubmit} className="space-y-5 text-xs font-mono">
              {/* =================================================================== */}
              {/* STEP 1: SEARCHABLE DROPDOWN FOR ALL REGISTERED PARTICIPANTS         */}
              {/* =================================================================== */}
              <div ref={participantRef} className="relative">
                <label className="block text-[#0D0518] mb-1 font-black uppercase tracking-wider text-[11px]">
                  STEP 1: SELECT PARTICIPANT ({data.participants.length} REGISTERED)
                </label>

                {/* Selected Trigger Button */}
                <div
                  onClick={() => {
                    soundFx.play('click');
                    setIsParticipantDropdownOpen((prev) => !prev);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] flex items-center justify-between cursor-pointer hover:border-[#FF5FA0] transition-colors shadow-pixel-sm"
                >
                  {selectedParticipant ? (
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-xl shrink-0">{selectedParticipant.avatar || '👾'}</span>
                      <div className="truncate text-left">
                        <span className="font-display font-black text-sm text-[#0D0518] block leading-tight truncate">
                          {selectedParticipant.name}
                        </span>
                        <span className="text-[10px] text-gray-500 truncate block font-bold">
                          USN: {selectedParticipant.usn || selectedParticipant.email || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500 font-bold">Select a registered participant...</span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-[#0D0518] transition-transform ${isParticipantDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Menu with Live Search Filter */}
                {isParticipantDropdownOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-2 bg-white border-3 border-[#0D0518] rounded-2xl shadow-pixel-xl p-2 max-h-64 overflow-y-auto">
                    <div className="sticky top-0 bg-white pb-2 border-b-2 border-gray-200">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          autoFocus
                          value={participantSearch}
                          onChange={(e) => setParticipantSearch(e.target.value)}
                          placeholder="Search participant name or USN..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#FAF7EE] border-2 border-[#0D0518] text-xs font-mono font-bold text-[#0D0518] focus:outline-none focus:border-[#FF5FA0]"
                        />
                      </div>
                    </div>

                    <div className="mt-1 space-y-1">
                      {filteredParticipants.map((p) => {
                        const isSelected = p.id === selectedParticipantId;
                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              soundFx.play('click');
                              setSelectedParticipantId(p.id);
                              setIsParticipantDropdownOpen(false);
                              setParticipantSearch('');
                            }}
                            className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518] font-black'
                                : 'hover:bg-purple-50 text-[#0D0518]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <span className="text-xl">{p.avatar || '👾'}</span>
                              <div className="truncate">
                                <div className="font-display font-black text-xs truncate">
                                  {p.name}
                                </div>
                                <div className="text-[10px] text-gray-600 truncate font-semibold">
                                  USN: {p.usn || p.email || 'N/A'}
                                </div>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#0D0518] shrink-0" />}
                          </div>
                        );
                      })}

                      {filteredParticipants.length === 0 && (
                        <div className="p-3 text-center text-gray-500 font-mono text-xs">
                          No matching participants found.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================================== */}
              {/* STEP 2: SEARCHABLE DROPDOWN FOR CONFIGURED GAMES                   */}
              {/* =================================================================== */}
              <div ref={gameRef} className="relative">
                <label className="block text-[#0D0518] mb-1 font-black uppercase tracking-wider text-[11px]">
                  STEP 2: SELECT GAME ({data.games.length} CONFIGURED)
                </label>

                {/* Selected Trigger Button */}
                <div
                  onClick={() => {
                    soundFx.play('click');
                    setIsGameDropdownOpen((prev) => !prev);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] flex items-center justify-between cursor-pointer hover:border-[#FF5FA0] transition-colors shadow-pixel-sm"
                >
                  {selectedGame ? (
                    <div className="flex items-center gap-2.5 truncate">
                      <Gamepad2 className="w-5 h-5 text-[#FF7A00] shrink-0" />
                      <div className="truncate text-left">
                        <span className="font-display font-black text-sm text-[#0D0518] block leading-tight truncate">
                          {selectedGame.name}
                        </span>
                        <span className="text-[10px] text-gray-500 truncate block font-bold">
                          Entry Cost: {selectedGame.cost || 0} Arcade Coins
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500 font-bold">Select a game...</span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-[#0D0518] transition-transform ${isGameDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Menu with Live Search Filter */}
                {isGameDropdownOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-2 bg-white border-3 border-[#0D0518] rounded-2xl shadow-pixel-xl p-2 max-h-64 overflow-y-auto">
                    <div className="sticky top-0 bg-white pb-2 border-b-2 border-gray-200">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          autoFocus
                          value={gameSearch}
                          onChange={(e) => setGameSearch(e.target.value)}
                          placeholder="Search game name..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#FAF7EE] border-2 border-[#0D0518] text-xs font-mono font-bold text-[#0D0518] focus:outline-none focus:border-[#FF5FA0]"
                        />
                      </div>
                    </div>

                    <div className="mt-1 space-y-1">
                      {filteredGames.map((g) => {
                        const isSelected = g.id === selectedGameId;
                        return (
                          <div
                            key={g.id}
                            onClick={() => {
                              soundFx.play('click');
                              setSelectedGameId(g.id);
                              if (g.defaultPoints !== undefined && g.defaultPoints !== null && g.defaultPoints !== '') {
                                setPointsDelta(Number(g.defaultPoints));
                              } else {
                                setPointsDelta('');
                              }
                              setIsGameDropdownOpen(false);
                              setGameSearch('');
                            }}
                            className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518] font-black'
                                : 'hover:bg-orange-50 text-[#0D0518]'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Gamepad2 className="w-4 h-4 text-[#FF7A00] shrink-0" />
                              <div className="truncate">
                                <div className="font-display font-black text-xs truncate">
                                  {g.name}
                                </div>
                                <div className="text-[10px] text-gray-600 truncate font-semibold">
                                  Entry Cost: {g.cost || 0} Arcade Coins
                                </div>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#0D0518] shrink-0" />}
                          </div>
                        );
                      })}

                      {filteredGames.length === 0 && (
                        <div className="p-3 text-center text-gray-500 font-mono text-xs">
                          No matching games found.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================================== */}
              {/* STEP 3: REAL-TIME SCORE INSPECTION & INPUT PANEL                   */}
              {/* =================================================================== */}
              <div className="bg-[#FAF7EE] border-3 border-[#0D0518] rounded-2xl p-4 space-y-3">
                <span className="font-arcade text-[10px] text-[#5C2D91] font-black block uppercase tracking-wider">
                  STEP 3: CURRENT SCORE INSPECTION & AWARD
                </span>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-white border-2 border-[#0D0518]">
                    <span className="text-[10px] font-mono text-gray-500 block font-bold">
                      IN THIS GAME ({selectedGame?.name || 'Game'})
                    </span>
                    <span className="font-arcade text-lg font-black text-[#5C2D91]">
                      {currentScoreForGame} PTS
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border-2 border-[#0D0518]">
                    <span className="text-[10px] font-mono text-gray-500 block font-bold">
                      TOTAL ALL GAMES
                    </span>
                    <span className="font-arcade text-lg font-black text-[#28C76F]">
                      {totalScoreForParticipant} PTS
                    </span>
                  </div>
                </div>

                {/* Points Delta Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[#0D0518] font-black text-[11px]">
                      POINTS TO {isDeduction ? 'DEDUCT (-)' : 'AWARD (+)'} *
                    </label>
                    <span className="text-[10px] font-bold text-gray-500">
                      Projected Game Score: {currentScoreForGame + (isDeduction ? -Number(pointsDelta || 0) : Number(pointsDelta || 0))} PTS
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🪙</span>
                    <input
                      type="number"
                      min={1}
                      required
                      value={pointsDelta}
                      onChange={(e) => setPointsDelta(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder={selectedGame?.defaultPoints !== undefined && selectedGame?.defaultPoints !== null ? `Default: ${selectedGame.defaultPoints}` : 'Enter points'}
                      className={`w-full px-3.5 py-2 rounded-xl bg-white border-3 text-xl font-mono font-black focus:outline-none ${
                        isDeduction
                          ? 'border-[#FF5FA0] text-[#FF5FA0]'
                          : 'border-[#0D0518] text-[#0D0518]'
                      }`}
                    />
                  </div>

                  {/* Preset Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {quickPills.map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => {
                          soundFx.play('click');
                          setPointsDelta(val);
                        }}
                        className={`text-[10px] py-1 px-2.5 rounded-lg border-2 border-[#0D0518] font-mono font-bold transition-all ${
                          pointsDelta === val
                            ? 'bg-[#FFDE25] text-[#0D0518] shadow-pixel-sm'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {isDeduction ? `-${val}` : `+${val}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#0D0518] mb-1 font-black text-[11px]">
                    NOTE / REASON (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Round 1 clear bonus"
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#0D0518] text-[#0D0518] font-medium focus:outline-none focus:border-[#FF5FA0]"
                  />
                </div>
              </div>

              {/* Step 4 Trigger: Save / Update Button */}
              <button
                type="submit"
                className={`w-full py-3.5 rounded-2xl font-display font-black text-sm tracking-wider uppercase border-3 border-[#0D0518] shadow-pixel transition-all hover:-translate-y-0.5 active:translate-y-1 flex items-center justify-center gap-2 ${
                  isDeduction
                    ? 'bg-[#FF5FA0] text-white hover:bg-red-600'
                    : 'bg-[#FFDE25] text-[#0D0518] hover:bg-yellow-300'
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>
                  {isDeduction
                    ? `DEDUCT -${pointsDelta} PTS (UPDATE SCORE)`
                    : `AWARD +${pointsDelta} PTS (SAVE TRANSACTION)`}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: AUDITABLE TRANSACTION LEDGER & ROLLBACK (7 COLS)             */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 shadow-pixel-lg flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 border-b-3 border-[#0D0518] pb-3">
              <div>
                <span className="font-arcade text-xs text-[#0D0518] font-black uppercase tracking-wider">
                  VERIFIED TRANSACTION LEDGER
                </span>
                <p className="text-xs font-mono text-gray-500 mt-0.5 font-bold">
                  Showing {filteredTransactions.length} of {data.transactions.length} immutable records
                </p>
              </div>

              {/* Search & Participant Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-44">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search logs..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF7EE] border-2 border-[#0D0518] text-xs font-mono text-[#0D0518] font-bold focus:outline-none"
                  />
                </div>

                <select
                  value={filterParticipant}
                  onChange={(e) => setFilterParticipant(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF7EE] border-2 border-[#0D0518] text-xs font-mono text-[#0D0518] font-bold focus:outline-none"
                >
                  <option value="all">All Players</option>
                  {data.participants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Transaction Rows */}
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredTransactions.map((tx) => {
                const participant = data.participants.find((p) => p.id === tx.participantId);
                const game = data.games.find((g) => g.id === tx.gameId);
                const isPositive = Number(tx.pointsDelta) >= 0;
                const noteText = tx.note || tx.reason || 'Score update';

                return (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-[#FFFDF5] border-3 border-[#0D0518] flex items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shrink-0 border-2 border-[#0D0518] shadow-pixel-sm">
                        {participant?.avatar || '👾'}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-black text-[#0D0518] font-display text-sm truncate">
                            {participant?.name || 'Unknown'}
                          </span>
                          <span className="text-[11px] text-gray-500 font-bold truncate">
                            in {game?.name || 'Game'}
                          </span>
                        </div>
                        <p className="text-[#0D0518] text-xs italic mt-0.5 font-medium truncate">
                          "{noteText}"
                        </p>
                        <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-0.5 font-bold">
                          <span>{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                          <span>•</span>
                          <span>By {tx.admin || 'Operator'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-sm font-black font-mono px-2.5 py-1 rounded-xl border-2 border-[#0D0518] shadow-pixel-sm ${
                          isPositive
                            ? 'bg-[#28C76F] text-[#0D0518]'
                            : 'bg-[#FF5FA0] text-white'
                        }`}
                      >
                        {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                      </span>

                      <button
                        onClick={() => handleRollback(tx.id)}
                        title="Revert Score Transaction"
                        className="btn-pixel-white text-xs py-1 px-2.5 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Undo</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-16 text-gray-500 font-mono text-xs font-bold bg-[#FAF7EE] rounded-2xl border-2 border-dashed border-gray-300">
                  <Coins className="w-8 h-8 mx-auto text-gray-400 mb-2 opacity-50" />
                  No matching score transactions recorded in ledger.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
