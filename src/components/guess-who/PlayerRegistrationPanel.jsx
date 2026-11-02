import React, { useState } from 'react';
import { UserPlus, Trophy, Award, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { registerPlayer } from '../../services/guessWhoService';
import { playArcadeSound } from '../../utilities/sound';

export default function PlayerRegistrationPanel({
  players = [],
  activePlayerName,
  onSelectActivePlayer,
  onPlayerRegistered,
}) {
  const [newName, setNewName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const player = registerPlayer(newName);
      playArcadeSound('coin');
      setNewName('');
      if (onPlayerRegistered) onPlayerRegistered(player);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    }
  };

  return (
    <Card variant="default" brackets={true} className="p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <h3 className="font-retro text-xs text-yellow-300">
              INDIVIDUAL PLAYER SCOREBOARD
            </h3>
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            First to 7 correct answers wins immediately (Max Score: 7; up to 12 puzzles played)
          </p>
        </div>

        <Badge variant="purple" size="sm">
          {players.length} REGISTERED PLAYERS
        </Badge>
      </div>

      {/* Registration Input Form */}
      <form onSubmit={handleRegister} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Enter player name (e.g. Aarav, Priya)..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-cosmic-950 border border-purple-500/40 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <Button variant="cyan" size="sm" type="submit">
          <UserPlus className="w-3.5 h-3.5 mr-1" /> Register Player
        </Button>
      </form>

      {errorMsg && (
        <p className="text-xs font-mono text-rose-400">{errorMsg}</p>
      )}

      {/* Scoreboard Table */}
      <div className="overflow-x-auto rounded-lg border border-purple-500/20">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-purple-950/40 text-slate-400 uppercase font-retro text-[9px] border-b border-purple-500/20">
            <tr>
              <th className="py-2.5 px-3">Player</th>
              <th className="py-2.5 px-3 text-center">Correct</th>
              <th className="py-2.5 px-3 text-center">Wrong</th>
              <th className="py-2.5 px-3 text-center">Skipped</th>
              <th className="py-2.5 px-3 text-right">Score (Max 7)</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {players.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-slate-500">
                  No players registered yet. Register a player to generate a 12-puzzle run.
                </td>
              </tr>
            ) : (
              players.map((p) => {
                const isActive = p.name === activePlayerName;
                const attempts = p.correct + p.wrong + p.skipped;
                return (
                  <tr
                    key={p.id || p.name}
                    className={`transition-colors ${
                      isActive ? 'bg-cyan-950/30' : 'hover:bg-purple-950/20'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-white">
                      <div className="flex items-center gap-1.5">
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                        <span>{p.name}</span>
                        {isActive && (
                          <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/40">
                            ACTIVE TURN
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">
                      {p.correct}
                    </td>

                    <td className="py-2.5 px-3 text-center text-rose-400">
                      {p.wrong}
                    </td>

                    <td className="py-2.5 px-3 text-center text-amber-400">
                      {p.skipped}
                    </td>

                    <td className="py-2.5 px-3 text-right font-retro text-yellow-300">
                      {p.points} / 7
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      {p.isQualified ? (
                        <Badge variant="green" size="sm">
                          QUALIFIED (7/7 WON)
                        </Badge>
                      ) : attempts >= 12 ? (
                        <Badge variant="red" size="sm">
                          NOT QUALIFIED
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          {p.correct}/7 needed ({attempts}/12 played)
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      {!isActive ? (
                        <button
                          type="button"
                          onClick={() => {
                            playArcadeSound('blip');
                            onSelectActivePlayer(p.name);
                          }}
                          className="text-[10px] text-cyan-400 hover:text-white underline font-mono"
                        >
                          Select for Run
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Current</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
