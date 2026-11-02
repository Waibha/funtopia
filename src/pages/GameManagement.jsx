import React, { useState } from 'react';
import { Gamepad2, Plus, Edit2, Trash2, Power, Coins, Trophy, Sparkles, Swords } from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function GameManagement({ games = [], onSaveGame, onDeleteGame, onToggleGameActive }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    cost: 50,
    defaultPoints: 10,
    isActive: true,
  });

  const handleOpenCreate = () => {
    soundFx.play('click');
    setEditingGame(null);
    setFormData({
      name: '',
      cost: 50,
      defaultPoints: 10,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (game) => {
    soundFx.play('click');
    setEditingGame(game);
    setFormData({
      name: game.name || '',
      cost: game.cost !== undefined ? game.cost : 50,
      defaultPoints: game.defaultPoints !== undefined && game.defaultPoints !== null ? game.defaultPoints : 10,
      isActive: game.isActive !== undefined ? game.isActive : true,
    });
    setModalOpen(true);
  };

  const handleDelete = (gameId, name) => {
    soundFx.play('scoreDown');
    if (window.confirm(`Delete trial "${name}"?`)) {
      onDeleteGame(gameId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFx.play('coin');

    const updated = {
      id: editingGame ? editingGame.id : `game-${Date.now()}`,
      name: formData.name.trim(),
      cost: Number(formData.cost || 0),
      defaultPoints: formData.defaultPoints !== '' && formData.defaultPoints !== null ? Number(formData.defaultPoints) : 10,
      isActive: Boolean(formData.isActive),
    };

    onSaveGame(updated);
    setModalOpen(false);
  };

  return (
    <div className="py-4 space-y-8 max-w-7xl mx-auto font-sans text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Swords className="w-6 h-6 text-[#FFC837]" />
            <h1 className="font-cinzel text-2xl sm:text-4xl text-[#FFC837] fantasy-title-gold">
              QUEST TRIALS CATALOG
            </h1>
          </div>
          <p className="text-slate-300 font-jakarta text-xs sm:text-sm font-medium">
            Forge quest trials, specify gold coin entry tributes, set default renown scores, and toggle kingdom rotation.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-fantasy-primary flex items-center gap-2 text-xs py-3 px-5 font-cinzel font-black"
        >
          <Plus className="w-4 h-4 text-[#0A091A]" />
          <span>ADD QUEST TRIAL</span>
        </button>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className={`rounded-3xl p-6 border flex flex-col justify-between transition-all duration-200 text-slate-100 ${
              game.isActive
                ? 'bg-gradient-to-b from-[#111928] via-[#0E1524] to-[#0A101C] border-white/15 shadow-fantasy-card hover:-translate-y-1 hover:border-[#FFC837]/40'
                : 'bg-[#080C16] opacity-60 border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 via-emerald-500/20 to-teal-500/20 border border-[#FFC837]/40 shadow-fantasy-gold flex items-center justify-center text-2xl shrink-0">
                    ⚔️
                  </div>
                  <div>
                    <h3 className="font-cinzel font-bold text-lg text-amber-200 leading-tight">
                      {game.name}
                    </h3>
                    <span
                      className={`inline-block mt-1 text-[9px] font-cinzel font-bold px-2 py-0.5 rounded border ${
                        game.isActive
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {game.isActive ? 'ACTIVE IN ROTATION' : 'SEALED'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFx.play('click');
                    onToggleGameActive(game.id);
                  }}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    game.isActive
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title={game.isActive ? 'Deactivate Trial' : 'Activate Trial'}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              {/* Game Economics: Cost & Default Points */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="bg-[#080E1C] p-3 rounded-2xl border border-white/10 text-center font-jakarta">
                  <span className="text-[9px] text-slate-400 block font-cinzel font-bold uppercase tracking-wider">
                    ENTRY TRIBUTE
                  </span>
                  <span className="text-base font-bold text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                    <Coins className="w-4 h-4 text-[#FFC837]" />
                    {Number(game.cost || 0).toLocaleString()} GOLD
                  </span>
                </div>

                <div className="bg-[#080E1C] p-3 rounded-2xl border border-white/10 text-center font-jakarta">
                  <span className="text-[9px] text-slate-400 block font-cinzel font-bold uppercase tracking-wider">
                    DEFAULT RENOWN
                  </span>
                  <span className="text-base font-bold text-emerald-300 flex items-center justify-center gap-1 mt-0.5">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    {game.defaultPoints !== undefined && game.defaultPoints !== null ? game.defaultPoints : '—'} PTS
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-[11px] font-mono text-slate-400">
                ID: {game.id}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(game)}
                  className="btn-fantasy-subtle p-2 text-xs flex items-center gap-1 text-slate-200"
                  title="Rename / Change Coin Cost"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span className="font-bold text-[11px]">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(game.id, game.name)}
                  className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/40 font-bold transition-colors"
                  title="Delete Trial"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-20 bg-[#0F1626] border border-white/10 rounded-3xl p-8 shadow-fantasy-card text-slate-200">
          <Gamepad2 className="w-14 h-14 mx-auto text-[#FFC837] mb-3" />
          <h2 className="font-cinzel text-2xl font-bold mb-1">NO QUEST TRIALS IN CATALOG YET</h2>
          <p className="font-jakarta text-xs text-slate-400 max-w-md mx-auto mb-6">
            Forge your first quest trial with its gold token tribute. No events required!
          </p>
          <button
            onClick={handleOpenCreate}
            className="btn-fantasy-primary text-sm py-3 px-6 font-cinzel font-bold"
          >
            + ADD YOUR FIRST TRIAL
          </button>
        </div>
      )}

      {/* CREATE / EDIT GAME MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A091A]/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#111928] via-[#0E1524] to-[#0A101C] border border-[#00F0FF]/40 p-6 sm:p-8 shadow-fantasy-card text-slate-100">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white font-mono text-lg font-bold"
            >
              ✕
            </button>

            <h2 className="font-cinzel text-2xl font-bold text-amber-200 mb-1">
              {editingGame ? 'EDIT QUEST TRIAL' : 'FORGE NEW QUEST TRIAL'}
            </h2>
            <p className="text-xs text-slate-400 font-jakarta mb-5">
              Kingdom quest configuration: trial title, gold entry tribute, and default reward points.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-jakarta">
              <div>
                <label className="block text-slate-300 mb-1 font-cinzel font-bold text-xs uppercase tracking-wider">TRIAL TITLE *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Trial of the Dragon Spire"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080E1C] border border-white/15 text-slate-100 font-medium focus:outline-none focus:border-[#00F0FF] text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>GOLD ENTRY TRIBUTE *</span>
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Required</span>
                </label>
                <div className="relative">
                  <Coins className="w-5 h-5 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="e.g. 50"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#080E1C] border border-white/15 text-slate-100 font-mono font-bold text-base focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Number of gold tokens required for an adventurer to embark on this trial.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>DEFAULT RENOWN AWARDED</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Suggested in Scoring</span>
                </label>
                <div className="relative">
                  <Trophy className="w-5 h-5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={formData.defaultPoints}
                    onChange={(e) => setFormData({ ...formData, defaultPoints: e.target.value })}
                    placeholder="e.g. 10"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#080E1C] border border-white/15 text-slate-100 font-mono font-bold text-base focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Renown score pre-filled when recording glory for this trial. Can be altered at scoring time.
                </p>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="gameActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-[#080E1C] text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="gameActive" className="text-xs font-semibold text-slate-200 cursor-pointer">
                  Activate quest trial immediately in kingdom rotation
                </label>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-fantasy-subtle text-center justify-center text-xs py-3 font-cinzel font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn-fantasy-primary text-center justify-center text-xs py-3 font-cinzel font-bold"
                >
                  {editingGame ? 'SAVE CHANGES' : 'CREATE TRIAL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
