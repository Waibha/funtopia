import React, { useState } from 'react';
import { Gamepad2, Plus, Edit2, Trash2, Power, Coins } from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function GameManagement({ games = [], onSaveGame, onDeleteGame, onToggleGameActive }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: 100,
    points: 100,
    isActive: true,
  });

  const handleOpenCreate = () => {
    soundFx.play('click');
    setEditingGame(null);
    setFormData({
      name: '',
      description: '',
      cost: 100,
      points: 100,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (game) => {
    soundFx.play('click');
    setEditingGame(game);
    setFormData({
      name: game.name || '',
      description: game.description || '',
      cost: game.cost !== undefined ? game.cost : 100,
      points: game.points !== undefined ? game.points : 100,
      isActive: game.isActive !== undefined ? game.isActive : true,
    });
    setModalOpen(true);
  };

  const handleDelete = (gameId, name) => {
    soundFx.play('scoreDown');
    if (window.confirm(`Delete game "${name}"?`)) {
      onDeleteGame(gameId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFx.play('coin');

    const updated = {
      id: editingGame ? editingGame.id : `game-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      cost: Number(formData.cost || 0),
      points: Number(formData.points || 0),
      isActive: Boolean(formData.isActive),
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
              GAMES
            </h1>
          </div>
          <p className="text-pop-muted font-sans text-xs sm:text-sm font-medium">
            Manage games, costs/budgets, point values, and active tournament status.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-pop-yellow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>ADD GAME</span>
        </button>
      </div>

      {/* Game Cards Grid */}
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
                <div>
                  <h3 className="font-display font-black text-xl text-pop-ink">
                    {game.name}
                  </h3>
                  <span
                    className={`inline-block mt-1 text-[10px] font-mono font-black px-2 py-0.5 rounded border border-pop-ink ${
                      game.isActive
                        ? 'bg-pop-green text-[#180A28]'
                        : 'bg-pop-butter text-pop-muted'
                    }`}
                  >
                    {game.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
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
                  title={game.isActive ? 'Deactivate Game' : 'Activate Game'}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              {game.description && (
                <p className="text-xs text-pop-muted font-sans mb-4 font-medium line-clamp-2">
                  {game.description}
                </p>
              )}

              {/* Simplified Game Cost & Points */}
              <div className="grid grid-cols-2 gap-3 bg-pop-butter p-3.5 rounded-2xl border-2 border-pop-ink mb-4 text-center font-mono">
                <div>
                  <span className="text-[10px] text-pop-muted block font-bold">GAME COST / BUDGET</span>
                  <span className="text-base font-black text-pop-coral flex items-center justify-center gap-1">
                    <Coins className="w-4 h-4" />
                    ${Number(game.cost || 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-pop-muted block font-bold">POINTS VALUE</span>
                  <span className="text-base font-black text-pop-purple">
                    {Number(game.points || 0).toLocaleString()} PTS
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t-2 border-pop-ink/20">
              <span className="text-xs font-mono font-bold text-pop-muted">
                ID: {game.id}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(game)}
                  className="p-2 rounded-xl bg-pop-butter hover:bg-pop-yellow-light text-pop-ink border border-pop-ink font-bold transition-colors"
                  title="Edit Game"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(game.id, game.name)}
                  className="p-2 rounded-xl bg-pop-coral-light hover:bg-pop-coral hover:text-white text-pop-coral border border-pop-ink font-bold transition-colors"
                  title="Remove Game"
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
              {editingGame ? 'EDIT GAME' : 'ADD NEW GAME'}
            </h2>
            <p className="text-xs text-pop-muted font-sans mb-4 font-bold">
              Specify game name, cost/budget, points value, and active status.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-pop-ink mb-1 font-black text-sm">GAME NAME *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Retro Racer"
                  className="w-full px-3 py-2.5 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none focus:border-pop-coral text-sm"
                />
              </div>

              <div>
                <label className="block text-pop-ink mb-1 font-black text-sm">DESCRIPTION (OPTIONAL)</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description of the game format..."
                  className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-medium focus:outline-none focus:border-pop-coral text-sm"
                />
              </div>

              {/* CRITICAL REQUIREMENT: GAME COST / BUDGET */}
              <div>
                <label className="block text-pop-ink mb-1 font-black text-sm flex items-center justify-between">
                  <span>GAME COST / BUDGET ($) *</span>
                  <span className="text-[10px] text-pop-coral font-bold uppercase">Required</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pop-muted font-bold">$</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-mono font-black text-sm focus:outline-none focus:border-pop-coral"
                  />
                </div>
              </div>

              <div>
                <label className="block text-pop-ink mb-1 font-black text-sm">POINTS VALUE *</label>
                <input
                  type="number"
                  min={0}
                  step={10}
                  required
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-mono font-black text-sm focus:outline-none focus:border-pop-coral"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-pop-coral focus:ring-0 border-2 border-pop-ink"
                />
                <label htmlFor="isActiveToggle" className="text-xs font-mono font-bold text-pop-ink cursor-pointer">
                  Active in current rotation
                </label>
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
                  {editingGame ? 'SAVE GAME' : 'CREATE GAME'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
