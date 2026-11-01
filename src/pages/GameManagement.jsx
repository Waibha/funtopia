import React, { useState } from 'react';
import { Gamepad2, Plus, Edit2, Trash2, Power } from 'lucide-react';
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
      rules: 'Standard tournament rules apply.',
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
    if (window.confirm(`Delete discipline "${name}"?`)) {
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
    <div className="py-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 className="w-5 h-5 text-arcade-purple" />
            <h1 className="font-bungee text-2xl sm:text-3xl text-white">
              DISCIPLINE CATALOG
            </h1>
          </div>
          <p className="text-arcade-muted font-sans text-xs sm:text-sm">
            Configure arcade game cartridges, point weights, and rotation status.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="arcade-btn-yellow flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>NEW DISCIPLINE</span>
        </button>
      </div>

      {/* Cartridge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {games.map((game) => (
          <div
            key={game.id}
            className={`rounded-xl p-5 border-2 border-black flex flex-col justify-between transition-all duration-150 ${
              game.isActive
                ? 'bg-[#15141c] shadow-arcade-sm'
                : 'bg-[#111016] opacity-60 border-zinc-800'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#201d2a] border border-black flex items-center justify-center text-2xl">
                    <span>{game.icon}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black text-arcade-muted font-bold">
                      {game.category}
                    </span>
                    <h3 className="font-display font-black text-base text-white mt-1">
                      {game.name}
                    </h3>
                  </div>
                </div>

                {/* Active / Inactive switch */}
                <button
                  onClick={() => {
                    soundFx.play('click');
                    onToggleGameActive(game.id);
                  }}
                  className={`p-1.5 rounded border border-black font-mono text-xs font-bold ${
                    game.isActive
                      ? 'bg-emerald-500 text-black'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                  title={game.isActive ? 'Deactivate' : 'Activate'}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-arcade-muted font-sans mb-3 line-clamp-2">
                {game.description}
              </p>

              {/* Point Specs */}
              <div className="grid grid-cols-3 gap-2 bg-[#0e0d14] p-2.5 rounded border border-arcade-border mb-3 text-center font-mono">
                <div>
                  <span className="text-[9px] text-zinc-500 block">BASE PTS</span>
                  <span className="text-xs font-black text-arcade-yellow">
                    {game.basePoints}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block">MULTIPLIER</span>
                  <span className="text-xs font-black text-white">
                    {game.multiplier}x
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block">ROUNDS</span>
                  <span className="text-xs font-black text-arcade-muted">
                    {game.maxRounds}
                  </span>
                </div>
              </div>

              <p className="text-[11px] font-mono text-zinc-400 italic mb-4 truncate">
                Rule: {game.rules}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-arcade-border">
              <span
                className={`text-[10px] font-mono font-bold ${
                  game.isActive ? 'text-emerald-400' : 'text-zinc-500'
                }`}
              >
                {game.isActive ? '● IN ROTATION' : '○ BENCHED'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(game)}
                  className="p-1.5 rounded bg-[#201d2a] hover:bg-[#2c283a] text-white"
                  title="Edit Discipline"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(game.id, game.name)}
                  className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-400"
                  title="Remove Discipline"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT GAME MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="relative w-full max-w-md bg-[#15141c] border-3 border-black rounded-xl p-6 shadow-arcade-lg max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-arcade-muted hover:text-white font-mono text-base"
            >
              ✕
            </button>

            <h2 className="font-bungee text-xl text-white mb-1">
              {editingGame ? 'EDIT DISCIPLINE' : 'REGISTER DISCIPLINE'}
            </h2>
            <p className="text-xs text-arcade-muted font-sans mb-4">
              Configure base score, multiplier, and category.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-arcade-muted mb-1 font-bold">NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none focus:border-arcade-yellow"
                  />
                </div>
                <div>
                  <label className="block text-arcade-muted mb-1 font-bold">CATEGORY</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-arcade-muted mb-1 font-bold">ICON</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((ic) => (
                    <button
                      type="button"
                      key={ic}
                      onClick={() => setFormData({ ...formData, icon: ic })}
                      className={`w-9 h-9 rounded flex items-center justify-center text-lg border ${
                        formData.icon === ic
                          ? 'bg-arcade-yellow text-black border-black font-bold shadow-arcade-sm'
                          : 'bg-[#0e0d14] border-arcade-border'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-arcade-muted mb-1 font-bold">DESCRIPTION</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-arcade-muted mb-1 font-bold">BASE PTS</label>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={formData.basePoints}
                    onChange={(e) => setFormData({ ...formData, basePoints: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-arcade-muted mb-1 font-bold">MULTIPLIER</label>
                  <input
                    type="number"
                    min={0.5}
                    max={5.0}
                    step={0.25}
                    value={formData.multiplier}
                    onChange={(e) => setFormData({ ...formData, multiplier: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-arcade-muted mb-1 font-bold">MAX ROUNDS</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.maxRounds}
                    onChange={(e) => setFormData({ ...formData, maxRounds: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-arcade-muted mb-1 font-bold">RULES</label>
                <input
                  type="text"
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-arcade-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#201d2a] text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="arcade-btn-yellow"
                >
                  {editingGame ? 'SAVE DISCIPLINE' : 'REGISTER DISCIPLINE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
