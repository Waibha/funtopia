import React, { useState } from 'react';
import { Gamepad2, Plus, Edit2, Trash2, Power, Zap, Award, Target, HelpCircle } from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function GameManagement({ games, onSaveGame, onDeleteGame, onToggleGameActive }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Reflex Arcade',
    icon: '🕹️',
    description: '',
    basePoints: 150,
    multiplier: 1.5,
    maxRounds: 3,
    isActive: true,
    rules: '',
  });

  const iconOptions = ['🕹️', '💻', '🏎️', '🌌', '🛰️', '⚡', '🎯', '🧩', '🚀', '🥊', '👾', '🔥'];
  const categoryOptions = [
    'Reflex Arcade',
    'Puzzle Strategy',
    'Cosmic Racing',
    'Platformer',
    'Defense Tactics',
    'Trivia Duel',
  ];

  const handleOpenCreate = () => {
    soundFx.play('click');
    setEditingGame(null);
    setFormData({
      name: '',
      category: 'Reflex Arcade',
      icon: '🕹️',
      description: '',
      basePoints: 150,
      multiplier: 1.5,
      maxRounds: 3,
      isActive: true,
      rules: 'Standard scoring applies.',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (game) => {
    soundFx.play('click');
    setEditingGame(game);
    setFormData({ ...game });
    setModalOpen(true);
  };

  const handleDelete = (gameId, name) => {
    soundFx.play('scoreDown');
    if (window.confirm(`Delete discipline "${name}"? Existing scores will still be retained.`)) {
      onDeleteGame(gameId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFx.play('coin');

    const updated = {
      ...formData,
      id: editingGame ? editingGame.id : `game-${Date.now()}`,
      basePoints: Number(formData.basePoints),
      multiplier: Number(formData.multiplier),
      maxRounds: Number(formData.maxRounds),
    };

    onSaveGame(updated);
    setModalOpen(false);
  };

  return (
    <div className="py-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 className="w-5 h-5 text-arcade-violet" />
            <h1 className="font-bungee text-2xl sm:text-3xl text-white">
              GAME MANAGEMENT
            </h1>
          </div>
          <p className="text-gray-400 font-sans text-sm">
            Configure arcade disciplines, multipliers, scoring rules, and active status.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-arcade-purple to-purple-600 text-white font-display font-bold text-xs tracking-wider shadow-arcade-button hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>NEW DISCIPLINE</span>
        </button>
      </div>

      {/* Games Grid (Arcade Cartridges) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className={`rounded-2xl p-6 border transition-all duration-300 relative flex flex-col justify-between ${
              game.isActive
                ? 'bg-[#0c0e28] border-purple-500/30 hover:border-arcade-cyan/60 shadow-lg'
                : 'bg-[#08091a]/80 border-gray-800 opacity-60'
            }`}
          >
            <div>
              {/* Cartridge Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-3xl shadow-inner">
                    <span>{game.icon}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-500/20">
                      {game.category}
                    </span>
                    <h3 className="font-display font-bold text-lg text-white mt-1">
                      {game.name}
                    </h3>
                  </div>
                </div>

                {/* Status Toggle */}
                <button
                  onClick={() => {
                    soundFx.play('click');
                    onToggleGameActive(game.id);
                  }}
                  title={game.isActive ? 'Deactivate Discipline' : 'Activate Discipline'}
                  className={`p-1.5 rounded-lg border transition-all ${
                    game.isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-400 font-sans mb-4 line-clamp-2">
                {game.description}
              </p>

              {/* Scoring Specs Box */}
              <div className="grid grid-cols-3 gap-2 bg-[#070817] p-3 rounded-xl border border-purple-500/15 mb-4 text-center font-mono">
                <div>
                  <span className="text-[9px] text-gray-500 block">BASE PTS</span>
                  <span className="text-xs font-bold text-arcade-yellow">
                    {game.basePoints}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 block">MULTIPLIER</span>
                  <span className="text-xs font-bold text-arcade-cyan">
                    {game.multiplier}x
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 block">MAX ROUNDS</span>
                  <span className="text-xs font-bold text-purple-300">
                    {game.maxRounds}
                  </span>
                </div>
              </div>

              {/* Rules Note */}
              <div className="text-[11px] font-mono text-gray-400 mb-4 bg-purple-950/20 p-2.5 rounded-lg border border-purple-500/10 flex items-start gap-1.5">
                <Target className="w-3.5 h-3.5 text-arcade-pink shrink-0 mt-0.5" />
                <span className="line-clamp-2 italic">{game.rules}</span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-purple-500/15">
              <span
                className={`text-[10px] font-mono uppercase font-bold ${
                  game.isActive ? 'text-emerald-400' : 'text-gray-500'
                }`}
              >
                {game.isActive ? '● ACTIVE IN ROTATION' : '○ BENCHED'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(game)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                  title="Edit Discipline"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(game.id, game.name)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  title="Remove Discipline"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT GAME MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0d0f28] border-2 border-purple-500/40 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white font-mono text-lg"
            >
              ✕
            </button>

            <h2 className="font-bungee text-xl text-white mb-1">
              {editingGame ? 'EDIT ARCADE DISCIPLINE' : 'REGISTER NEW DISCIPLINE'}
            </h2>
            <p className="text-xs text-gray-400 font-sans mb-6">
              Configure point rewards, multipliers, and special victory rules.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">DISCIPLINE NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Astro Blitz 3000"
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-violet"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">CATEGORY</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-violet"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-gray-300 mb-2">ARCADE ICON</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((ic) => (
                    <button
                      type="button"
                      key={ic}
                      onClick={() => setFormData({ ...formData, icon: ic })}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                        formData.icon === ic
                          ? 'bg-purple-600 border-2 border-arcade-violet scale-110 shadow-neon-purple'
                          : 'bg-[#070817] border border-purple-500/20 hover:bg-white/5'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">DESCRIPTION</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Gameplay synopsis..."
                  className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-violet"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">BASE PTS</label>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={formData.basePoints}
                    onChange={(e) => setFormData({ ...formData, basePoints: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-violet"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">MULTIPLIER</label>
                  <input
                    type="number"
                    min={0.5}
                    max={5.0}
                    step={0.25}
                    value={formData.multiplier}
                    onChange={(e) => setFormData({ ...formData, multiplier: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-violet"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">MAX ROUNDS</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.maxRounds}
                    onChange={(e) => setFormData({ ...formData, maxRounds: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-violet"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">SCORING RULES & NOTES</label>
                <input
                  type="text"
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  placeholder="e.g. Clean run bonus +25 PTS, penalty -10 PTS."
                  className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-violet"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-500/20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-arcade-purple to-purple-600 text-white font-display font-bold tracking-wider shadow-neon-purple hover:scale-105 active:scale-95 transition-all"
                >
                  {editingGame ? 'SAVE CHANGES' : 'REGISTER DISCIPLINE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
