import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  Maximize2,
  Minimize2,
  Activity,
  Gamepad2,
  User,
} from 'lucide-react';
import Podium from '../components/Podium';
import { soundFx } from '../utilities/soundFx';

export default function PublicLeaderboard({
  leaderboard = [],
  activeEvent,
  games = [],
  transactions = [],
  triggerCelebration,
}) {
  const [broadcastMode, setBroadcastMode] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [filterGameId, setFilterGameId] = useState('all');

  const topThree = leaderboard.slice(0, 3);

  const toggleBroadcast = () => {
    soundFx.play('click');
    setBroadcastMode(!broadcastMode);
  };

  const handleParticipantClick = (participant) => {
    soundFx.play('switch');
    setSelectedParticipant(participant);
  };

  const handleFilterClick = (gId) => {
    soundFx.play('click');
    setFilterGameId(gId);
  };

  return (
    <div
      className={`transition-all duration-300 ${
        broadcastMode
          ? 'fixed inset-0 z-50 bg-[#FAF7EE] overflow-y-auto p-4 sm:p-8'
          : 'py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ========================================================= */}
        {/* EVENT BANNER                                              */}
        {/* ========================================================= */}
        <div className="bg-pop-purple rounded-3xl border-3 border-pop-ink p-6 sm:p-8 shadow-pop-lg text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-pop-yellow text-pop-ink font-arcade text-[10px] font-black uppercase border-2 border-pop-ink shadow-pop-sm">
                ● LIVE LEADERBOARD
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bungee tracking-wide text-pop-yellow drop-shadow-[2px_2px_0px_#180A28]">
              {activeEvent?.name || 'FUNTOPIA LEADERBOARD'}
            </h1>
            <p className="text-purple-100 font-sans text-sm sm:text-base mt-1.5 max-w-2xl font-medium">
              {activeEvent?.description || 'Individual participant scores and standings.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto justify-end relative z-10">
            <button
              onClick={() => {
                soundFx.play('fanfare');
                triggerCelebration();
              }}
              className="btn-pop-yellow flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-pop-coral fill-pop-coral" />
              <span>CELEBRATE</span>
            </button>

            <button
              onClick={toggleBroadcast}
              className="btn-pop-white flex items-center gap-1.5 font-mono text-xs"
            >
              {broadcastMode ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>WINDOWED</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>FULLSCREEN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PODIUM SECTION                                            */}
        {/* ========================================================= */}
        <section aria-label="Individual Podium">
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-2 font-arcade text-xs text-pop-ink font-black">
              <Trophy className="w-4 h-4 text-pop-orange" />
              <span>TOP PARTICIPANTS</span>
            </div>
            <span className="text-xs font-mono text-pop-muted hidden sm:inline font-bold">
              ✦ Click any participant to inspect their scores
            </span>
          </div>

          <Podium topParticipants={topThree} onSelectParticipant={handleParticipantClick} />
        </section>

        {/* ========================================================= */}
        {/* GAME FILTER TABS                                          */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-3 flex-wrap bg-white p-3 rounded-2xl border-3 border-pop-ink shadow-pop">
          <div className="flex items-center gap-2 font-display text-xs font-black text-pop-ink tracking-wider">
            <Gamepad2 className="w-4 h-4 text-pop-purple" />
            <span>FILTER BY GAME:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              onClick={() => handleFilterClick('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-black transition-all ${
                filterGameId === 'all'
                  ? 'bg-pop-yellow text-pop-ink border-2 border-pop-ink shadow-pop-sm -translate-y-0.5'
                  : 'bg-pop-butter text-pop-ink hover:bg-pop-yellow-light border border-pop-ink/30'
              }`}
            >
              All Scores
            </button>
            {games.map((g) => (
              <button
                key={g.id}
                onClick={() => handleFilterClick(g.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  filterGameId === g.id
                    ? 'bg-pop-coral text-white border-2 border-pop-ink shadow-pop-sm -translate-y-0.5'
                    : 'bg-pop-butter text-pop-ink hover:bg-pop-coral-light border border-pop-ink/30'
                }`}
              >
                <span>{g.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* INDIVIDUAL STANDINGS TABLE & ACTIVITY FEED                */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Standings (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between px-3 text-xs font-mono text-pop-muted uppercase font-black">
              <span>RANK & PARTICIPANT</span>
              <span>GAME BREAKDOWN / TOTAL</span>
            </div>

            {leaderboard.map((participant) => {
              const pointsDisplay =
                filterGameId === 'all'
                  ? participant.totalPoints
                  : participant.gameBreakdown[filterGameId] || 0;

              return (
                <div
                  key={participant.id}
                  onClick={() => handleParticipantClick(participant)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleParticipantClick(participant)}
                  className={`p-4 rounded-2xl border-3 border-pop-ink shadow-pop transition-all duration-150 cursor-pointer flex items-center justify-between gap-4 ${
                    participant.rank === 1
                      ? 'bg-pop-yellow-light hover:bg-pop-yellow/30'
                      : participant.rank === 2
                      ? 'bg-pop-purple-light hover:bg-purple-100'
                      : participant.rank === 3
                      ? 'bg-pop-orange-light hover:bg-orange-100'
                      : 'bg-white hover:bg-pop-butter'
                  }`}
                >
                  {/* Rank & Participant Identity */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-arcade text-xs font-black shrink-0 border-2 border-pop-ink shadow-pop-sm ${
                        participant.rank === 1
                          ? 'bg-pop-yellow text-pop-ink'
                          : participant.rank === 2
                          ? 'bg-pop-purple text-white'
                          : participant.rank === 3
                          ? 'bg-pop-orange text-white'
                          : 'bg-pop-butter text-pop-ink'
                      }`}
                    >
                      #{participant.rank}
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-pop-ink shadow-pop-sm flex items-center justify-center text-2xl shrink-0">
                      <span>{participant.avatar || '👤'}</span>
                    </div>

                    <div>
                      <h4 className="font-display font-black text-base sm:text-lg text-pop-ink">
                        {participant.name}
                      </h4>
                      <p className="text-xs text-pop-muted font-mono font-medium">
                        {participant.email}
                      </p>
                    </div>
                  </div>

                  {/* Game Breakdown & Total Points */}
                  <div className="flex items-center gap-4">
                    {/* Game-wise breakdown tags */}
                    <div className="hidden md:flex items-center gap-1.5">
                      {games.map((g) => (
                        <div
                          key={g.id}
                          title={`${g.name}: ${participant.gameBreakdown[g.id] || 0} PTS`}
                          className="px-2.5 py-1 rounded-lg bg-white border-2 border-pop-ink text-center text-xs font-mono shadow-pop-sm"
                        >
                          <span className="block text-[10px] text-pop-muted truncate max-w-[60px]">{g.name}</span>
                          <span className="font-black text-pop-ink">
                            {participant.gameBreakdown[g.id] || 0}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total Points */}
                    <div className="text-right shrink-0">
                      <div className="font-mono text-xl sm:text-2xl font-black text-pop-ink">
                        {pointsDisplay.toLocaleString()}
                        <span className="text-xs text-pop-muted font-mono ml-1 font-bold">PTS</span>
                      </div>
                      {participant.diffFromFirst > 0 ? (
                        <span className="text-[11px] font-mono text-pop-coral font-black">
                          -{participant.diffFromFirst} to #1
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-pop-green font-black">
                          ★ 1ST PLACE
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {leaderboard.length === 0 && (
              <div className="p-12 text-center text-pop-muted font-mono text-sm bg-white rounded-3xl border-3 border-pop-ink">
                No participants registered yet.
              </div>
            )}
          </div>

          {/* Right Column: Recent Scores */}
          <div className="space-y-6">
            <div className="bg-white border-3 border-pop-ink rounded-3xl p-5 shadow-pop">
              <div className="flex items-center justify-between mb-4 border-b-2 border-pop-ink pb-3">
                <div className="flex items-center gap-2 font-arcade text-xs text-pop-ink font-black">
                  <Activity className="w-4 h-4 text-pop-coral" />
                  <span>RECENT SCORES</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-pop-green animate-ping" />
              </div>

              <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                {transactions
                  .slice()
                  .reverse()
                  .map((tx) => {
                    const participant = leaderboard.find((p) => p.id === tx.participantId);
                    const game = games.find((g) => g.id === tx.gameId);
                    const isPositive = Number(tx.pointsDelta) >= 0;

                    return (
                      <div
                        key={tx.id}
                        className="p-3 rounded-xl bg-pop-butter border-2 border-pop-ink text-xs font-mono"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-pop-ink">
                            {participant?.name || 'Participant'}
                          </span>
                          <span
                            className={`font-black font-mono px-2 py-0.5 rounded border border-pop-ink ${
                              isPositive
                                ? 'bg-pop-green text-pop-ink'
                                : 'bg-pop-coral text-white'
                            }`}
                          >
                            {isPositive ? `+${tx.pointsDelta}` : tx.pointsDelta} PTS
                          </span>
                        </div>
                        <div className="text-pop-muted text-[11px] flex justify-between mt-1 font-bold">
                          <span>{game?.name || 'General Score'}</span>
                          <span>
                            {new Date(tx.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {tx.note && (
                          <p className="text-[11px] text-pop-ink mt-1 italic font-medium truncate">
                            "{tx.note}"
                          </p>
                        )}
                      </div>
                    );
                  })}

                {transactions.length === 0 && (
                  <div className="text-center py-8 text-pop-muted font-mono text-xs">
                    No scores recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Participant Inspection Modal */}
        {selectedParticipant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pop-ink/70 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white border-4 border-pop-ink rounded-3xl p-6 sm:p-8 shadow-pop-xl">
              <button
                onClick={() => setSelectedParticipant(null)}
                className="absolute top-4 right-4 text-pop-muted hover:text-pop-ink font-mono text-lg font-black"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-pop-yellow border-3 border-pop-ink shadow-pop flex items-center justify-center text-4xl">
                  {selectedParticipant.avatar || '👤'}
                </div>
                <div>
                  <span className="font-arcade text-xs text-pop-coral font-black">
                    Rank #{selectedParticipant.rank}
                  </span>
                  <h3 className="font-bungee text-2xl text-pop-ink mt-0.5">
                    {selectedParticipant.name}
                  </h3>
                  <p className="text-xs text-pop-muted font-mono font-bold">
                    {selectedParticipant.email}
                  </p>
                </div>
              </div>

              {/* Game Breakdown */}
              <div className="space-y-2 mb-6">
                <span className="text-xs font-arcade text-pop-ink font-black block">
                  SCORES BY GAME:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {games.map((g) => (
                    <div
                      key={g.id}
                      className="p-2.5 rounded-xl bg-pop-canvas border-2 border-pop-ink flex items-center justify-between text-xs font-mono font-bold"
                    >
                      <span className="truncate">{g.name}</span>
                      <span className="font-black text-pop-purple">
                        {selectedParticipant.gameBreakdown[g.id] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-pop-ink">
                <span className="font-mono text-xs text-pop-muted font-bold">Total Score:</span>
                <span className="font-mono text-2xl font-black text-pop-ink">
                  {selectedParticipant.totalPoints.toLocaleString()} PTS
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
