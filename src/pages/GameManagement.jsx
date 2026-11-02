import React, { useState } from 'react';
import { Gamepad2, Plus, Edit2, Trash2, Power, Coins, Trophy } from 'lucide-react';
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
      cost: Number(formData.cost || 0),
      defaultPoints: formData.defaultPoints !== '' && formData.defaultPoints !== null ? Number(formData.defaultPoints) : 10,
      isActive: Boolean(formData.isActive),
    };

    onSaveGame(updated);
    setModalOpen(false);
  };

  return (
    <div className="py-4 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 className="w-6 h-6 text-[#FF7A00]" />
            <h1 className="font-bungee text-2xl sm:text-4xl text-[#FFDE25] pixel-title-yellow">
              GAMES CATALOG
            </h1>
          </div>
          <p className="text-purple-200 font-mono text-xs sm:text-sm font-medium">
            Add games, rename, set coin entry costs, and toggle tournament activation.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-pixel-yellow flex items-center gap-2"
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
            className={`group rounded-3xl p-6 border-4 border-[#0D0518] flex flex-col justify-between transition-all duration-200 text-[#0D0518] ${
              game.isActive
                ? 'bg-white shadow-pixel-lg hover:-translate-y-1.5 hover:shadow-pixel-xl hover:border-[#FFDE25]'
                : 'bg-gray-100 opacity-60 border-gray-400'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel-sm flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    🕹️
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xl text-[#0D0518] leading-tight">
                      {game.name}
                    </h3>
                    <span
                      className={`inline-block mt-1 text-[9px] font-arcade font-black px-2 py-0.5 rounded border-2 border-[#0D0518] ${
                        game.isActive
                          ? 'bg-[#28C76F] text-[#0D0518]'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {game.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFx.play('click');
                    onToggleGameActive(game.id);
                  }}
                  className={`p-2 rounded-xl border-2 border-[#0D0518] font-mono text-xs font-black shadow-pixel-sm transition-all ${
                    game.isActive
                      ? 'bg-[#28C76F] text-[#0D0518]'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  title={game.isActive ? 'Deactivate Game' : 'Activate Game'}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              {/* Game Economics: Cost & Default Points */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-[#FAF7EE] p-3 rounded-2xl border-3 border-[#0D0518] text-center font-mono">
                  <span className="text-[9px] text-gray-500 block font-bold uppercase tracking-wider">
                    ENTRY COST
                  </span>
                  <span className="text-base font-black text-[#FF5FA0] flex items-center justify-center gap-1 mt-0.5">
                    <Coins className="w-4 h-4 text-[#FFDE25]" />
                    {Number(game.cost || 0).toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#FAF7EE] p-3 rounded-2xl border-3 border-[#0D0518] text-center font-mono">
                  <span className="text-[9px] text-gray-500 block font-bold uppercase tracking-wider">
                    DEFAULT POINTS
                  </span>
                  <span className="text-base font-black text-[#28C76F] flex items-center justify-center gap-1 mt-0.5">
                    <Trophy className="w-4 h-4 text-[#28C76F]" />
                    {game.defaultPoints !== undefined && game.defaultPoints !== null ? game.defaultPoints : '—'} PTS
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t-2 border-[#0D0518]/20">
              <span className="text-[11px] font-mono font-bold text-gray-500">
                ID: {game.id}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(game)}
                  className="btn-pixel-white p-2 text-xs flex items-center gap-1"
                  title="Rename / Change Coin Cost"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span className="font-bold text-[11px]">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(game.id, game.name)}
                  className="p-2 rounded-xl bg-red-100 hover:bg-red-500 hover:text-white text-red-600 border-2 border-[#0D0518] font-bold transition-colors"
                  title="Delete Game"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-20 bg-white border-4 border-[#0D0518] rounded-3xl p-8 shadow-pixel-lg">
          <Gamepad2 className="w-14 h-14 mx-auto text-[#FF7A00] mb-3 animate-bounce-subtle" />
          <h2 className="font-bungee text-2xl text-[#0D0518] mb-1">NO GAMES IN CATALOG YET</h2>
          <p className="font-mono text-xs text-gray-600 max-w-md mx-auto mb-6">
            Create your first game (for example, <strong>Game A</strong>) with its coin entry cost. No events required!
          </p>
          <button
            onClick={handleOpenCreate}
            className="btn-pixel-yellow text-sm py-3 px-6"
          >
            + ADD YOUR FIRST GAME
          </button>
        </div>
      )}

      {/* CREATE / EDIT GAME MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0518]/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 sm:p-8 shadow-pixel-xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-[#0D0518] font-mono text-lg font-black"
            >
              ✕
            </button>

            <h2 className="font-bungee text-2xl text-[#0D0518] mb-1">
              {editingGame ? 'EDIT GAME' : 'ADD NEW GAME'}
            </h2>
            <p className="text-xs text-gray-600 font-mono mb-5 font-bold">
              Simple game configuration: set the game name and coin entry cost.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#0D0518] mb-1 font-black text-sm">GAME NAME *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Game A"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold focus:outline-none focus:border-[#FF5FA0] text-sm"
                />
              </div>

              <div>
                <label className="block text-[#0D0518] mb-1 font-black text-sm flex items-center justify-between">
                  <span>COIN ENTRY COST *</span>
                  <span className="text-[10px] text-[#FF5FA0] font-black uppercase">Required</span>
                </label>
                <div className="relative">
                  <Coins className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="e.g. 50"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-mono font-black text-base focus:outline-none focus:border-[#FF5FA0]"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1 font-bold">
                  Number of arcade coins required for a participant to enter this game.
                </p>
              </div>

              <div>
                <label className="block text-[#0D0518] mb-1 font-black text-sm flex items-center justify-between">
                  <span>DEFAULT POINTS EARNED</span>
                  <span className="text-[10px] text-[#28C76F] font-black uppercase">Suggested in Scoring</span>
                </label>
                <div className="relative">
                  <Trophy className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={formData.defaultPoints}
                    onChange={(e) => setFormData({ ...formData, defaultPoints: e.target.value })}
                    placeholder="e.g. 10"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-mono font-black text-base focus:outline-none focus:border-[#FF5FA0]"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1 font-bold">
                  Points automatically pre-filled when awarding scores for this game. Can be edited at scoring time.
                </p>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="gameActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-2 border-[#0D0518] text-[#FF5FA0] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="gameActive" className="text-xs font-bold text-[#0D0518] cursor-pointer">
                  Activate game immediately in competition rotation
                </label>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-pixel-white text-center justify-center text-xs py-3"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn-pixel-yellow text-center justify-center text-xs py-3 font-bold"
                >
                  {editingGame ? 'SAVE CHANGES' : 'CREATE GAME'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
