import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Edit2,
  CheckCircle2,
  Archive,
  Clock,
  MapPin,
  Trophy,
  Users,
  Gamepad2,
  Play,
  Layers,
} from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function EventManagement({
  events,
  activeEventId,
  setActiveEventId,
  onSaveEvent,
  teams,
  games,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    status: 'draft',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    prizePool: '',
    assignedGameIds: [],
    assignedTeamIds: [],
  });

  const handleOpenCreate = () => {
    soundFx.play('click');
    setEditingEvent(null);
    setFormData({
      name: '',
      code: `CRC-${Math.floor(Math.random() * 90 + 10)}`,
      status: 'draft',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      location: 'Grand Orbital Arena',
      prizePool: '5,000 Cosmic Tokens',
      assignedGameIds: games.map((g) => g.id),
      assignedTeamIds: teams.map((t) => t.id),
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    soundFx.play('click');
    setEditingEvent(evt);
    setFormData({
      ...evt,
      assignedGameIds: evt.assignedGameIds || [],
      assignedTeamIds: evt.assignedTeamIds || [],
    });
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    soundFx.play('coin');

    const updatedEvent = {
      ...formData,
      id: editingEvent ? editingEvent.id : `evt-${Date.now()}`,
    };

    onSaveEvent(updatedEvent);
    setModalOpen(false);
  };

  const handleActivateEvent = (evtId) => {
    soundFx.play('fanfare');
    setActiveEventId(evtId);
  };

  const toggleGameAssignment = (gameId) => {
    setFormData((prev) => {
      const exists = prev.assignedGameIds.includes(gameId);
      return {
        ...prev,
        assignedGameIds: exists
          ? prev.assignedGameIds.filter((id) => id !== gameId)
          : [...prev.assignedGameIds, gameId],
      };
    });
  };

  const toggleTeamAssignment = (teamId) => {
    setFormData((prev) => {
      const exists = prev.assignedTeamIds.includes(teamId);
      return {
        ...prev,
        assignedTeamIds: exists
          ? prev.assignedTeamIds.filter((id) => id !== teamId)
          : [...prev.assignedTeamIds, teamId],
      };
    });
  };

  return (
    <div className="py-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-arcade-pink" />
            <h1 className="font-bungee text-2xl sm:text-3xl text-white">
              EVENT MANAGEMENT
            </h1>
          </div>
          <p className="text-gray-400 font-sans text-sm">
            Configure championship schedules, activate live arenas, and coordinate tournament formats.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-arcade-pink to-purple-600 text-white font-display font-bold text-xs tracking-wider shadow-arcade-button-pink hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE EVENT</span>
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => {
          const isActive = evt.id === activeEventId;

          return (
            <div
              key={evt.id}
              className={`rounded-2xl p-6 border transition-all flex flex-col justify-between relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-br from-[#131138] via-[#101235] to-[#0b0c24] border-arcade-pink shadow-neon-pink'
                  : 'bg-[#0c0e28] border-purple-500/20 hover:border-purple-500/40'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-arcade-pink to-purple-600 text-white font-arcade text-[9px] px-3 py-1 rounded-bl-lg font-bold">
                  ★ CURRENT CHAMPIONSHIP
                </div>
              )}

              <div>
                {/* Status & Code */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-arcade uppercase tracking-wider ${
                      evt.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : evt.status === 'draft'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-purple-900/40 text-purple-300 border border-purple-500/20'
                    }`}
                  >
                    {evt.status}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {evt.code}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white mb-2">
                  {evt.name}
                </h3>
                <p className="text-gray-400 font-sans text-xs line-clamp-2 mb-4">
                  {evt.description}
                </p>

                {/* Event Details */}
                <div className="space-y-1.5 text-xs font-mono text-gray-300 mb-6 bg-[#070817] p-3 rounded-xl border border-purple-500/10">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-arcade-cyan" />
                    <span>
                      {evt.startDate} → {evt.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-arcade-pink" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-arcade-yellow" />
                    <span className="truncate text-arcade-yellow">{evt.prizePool}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-purple-500/20 gap-2">
                <button
                  onClick={() => handleOpenEdit(evt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-mono transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {!isActive ? (
                  <button
                    onClick={() => handleActivateEvent(evt.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-display font-semibold transition-all"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Set Active</span>
                  </button>
                ) : (
                  <span className="text-xs font-mono text-arcade-pink font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Broadcasting</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d0f28] border-2 border-purple-500/40 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white font-mono text-lg"
            >
              ✕
            </button>

            <h2 className="font-bungee text-xl text-white mb-1">
              {editingEvent ? 'EDIT CHAMPIONSHIP EVENT' : 'CREATE NEW CHAMPIONSHIP'}
            </h2>
            <p className="text-xs text-gray-400 font-sans mb-6">
              All settings are dynamically configurable.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">EVENT NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Cosmic Retro Masters 2026"
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-pink"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">EVENT CODE</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. CRC-26"
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-pink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">DESCRIPTION</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Championship background and match format..."
                  className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-pink"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">STATUS</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-pink"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">START DATE</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-pink"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">END DATE</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-pink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">LOCATION / STREAM</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-pink"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">PRIZE POOL</label>
                  <input
                    type="text"
                    value={formData.prizePool}
                    onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-pink"
                  />
                </div>
              </div>

              {/* Assign Games */}
              <div>
                <label className="block text-gray-300 mb-2">ASSIGN DISCIPLINES / GAMES</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {games.map((g) => {
                    const selected = formData.assignedGameIds.includes(g.id);
                    return (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => toggleGameAssignment(g.id)}
                        className={`p-2 rounded-lg border text-left transition-all flex items-center gap-2 ${
                          selected
                            ? 'bg-purple-600/30 border-purple-400 text-white'
                            : 'bg-[#070817] border-purple-500/20 text-gray-400'
                        }`}
                      >
                        <span>{g.icon}</span>
                        <span className="truncate">{g.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-arcade-pink to-purple-600 text-white font-display font-bold tracking-wider shadow-neon-pink hover:scale-105 active:scale-95 transition-all"
                >
                  {editingEvent ? 'SAVE CHANGES' : 'CREATE EVENT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
