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
    <div className="py-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 className="w-5 h-5 text-pop-orange" />
            <h1 className="font-bungee text-2xl sm:text-3xl text-pop-ink">
              DISCIPLINE CATALOG
            </h1>
          </div>
          <p className="text-pop-muted font-sans text-xs sm:text-sm font-medium">
            Configure arcade match cartridges, point weight multipliers, and active rotation status.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-pop-yellow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>NEW DISCIPLINE</span>
        </button>
      </div>

      {/* Cartridge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className={`rounded-3xl p-6 border-3 border-pop-ink flex flex-col justify-between transition-all duration-200 ${
              game.isActive
                ? 'bg-white shadow-pop hover:-translate-y-1'
                : 'bg-pop-butter/60 opacity-60 border-pop-ink/40'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-pop-butter border-2 border-pop-ink shadow-pop-sm flex items-center justify-center text-3xl">
                    <span>{game.icon}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-pop-ink text-white font-black">
                      {game.category}
                    </span>
                    <h3 className="font-display font-black text-lg text-pop-ink mt-1">
                      {game.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFx.play('click');
                    onToggleGameActive(game.id);
                  }}
                  className={`p-2 rounded-xl border-2 border-pop-ink font-mono text-xs font-black shadow-pop-sm transition-all ${
                    game.isActive
                      ? 'bg-pop-green text-pop-ink'
                      : 'bg-pop-butter text-pop-muted'
                  }`}
                  title={game.isActive ? 'Deactivate' : 'Activate'}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-pop-muted font-sans mb-4 line-clamp-2 font-medium">
                {game.description}
              </p>

              {/* Point Specs */}
              <div className="grid grid-cols-3 gap-2 bg-pop-butter p-3 rounded-2xl border-2 border-pop-ink mb-4 text-center font-mono">
                <div>
                  <span className="text-[9px] text-pop-muted block font-bold">BASE PTS</span>
                  <span className="text-sm font-black text-pop-coral">
                    {game.basePoints}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-pop-muted block font-bold">MULTIPLIER</span>
                  <span className="text-sm font-black text-pop-ink">
                    {game.multiplier}x
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-pop-muted block font-bold">ROUNDS</span>
                  <span className="text-sm font-black text-pop-purple">
                    {game.maxRounds}
                  </span>
                </div>
              </div>

              <p className="text-xs font-mono text-pop-ink italic mb-4 truncate font-medium">
                Rule: {game.rules}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t-2 border-pop-ink/20">
              <span
                className={`text-xs font-mono font-black ${
                  game.isActive ? 'text-pop-green' : 'text-pop-muted'
                }`}
              >
                {game.isActive ? '● IN ROTATION' : '○ BENCHED'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(game)}
                  className="p-2 rounded-xl bg-pop-butter hover:bg-pop-yellow-light text-pop-ink border border-pop-ink font-bold transition-colors"
                  title="Edit Discipline"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(game.id, game.name)}
                  className="p-2 rounded-xl bg-pop-coral-light hover:bg-pop-coral hover:text-white text-pop-coral border border-pop-ink font-bold transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pop-ink/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border-4 border-pop-ink rounded-3xl p-6 sm:p-8 shadow-pop-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-pop-muted hover:text-pop-ink font-mono text-lg font-black"
            >
              ✕
            </button>

            <h2 className="font-bungee text-2xl text-pop-ink mb-1">
              {editingGame ? 'EDIT DISCIPLINE' : 'NEW DISCIPLINE'}
            </h2>
            <p className="text-xs text-pop-muted font-sans mb-4 font-bold">
              Configure base points, multiplier, and category.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-pop-ink mb-1 font-black">NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none focus:border-pop-coral"
                  />
                </div>
                <div>
                  <label className="block text-pop-ink mb-1 font-black">CATEGORY</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none"
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
                <label className="block text-pop-ink mb-1.5 font-black">ARCADE ICON</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((ic) => (
                    <button
                      type="button"
                      key={ic}
                      onClick={() => setFormData({ ...formData, icon: ic })}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border-2 border-pop-ink transition-transform ${
                        formData.icon === ic
                          ? 'bg-pop-yellow scale-110 shadow-pop-sm font-black'
                          : 'bg-pop-butter hover:bg-white'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-pop-ink mb-1 font-black">DESCRIPTION</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-medium focus:outline-none focus:border-pop-coral"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-pop-ink mb-1 font-black">BASE PTS</label>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={formData.basePoints}
                    onChange={(e) => setFormData({ ...formData, basePoints: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-pop-ink mb-1 font-black">MULTIPLIER</label>
                  <input
                    type="number"
                    min={0.5}
                    max={5.0}
                    step={0.25}
                    value={formData.multiplier}
                    onChange={(e) => setFormData({ ...formData, multiplier: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-pop-ink mb-1 font-black">ROUNDS</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.maxRounds}
                    onChange={(e) => setFormData({ ...formData, maxRounds: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-pop-ink mb-1 font-black">RULES</label>
                <input
                  type="text"
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-pop-ink">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-pop-butter border-2 border-pop-ink text-pop-ink font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-pop-yellow"
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
