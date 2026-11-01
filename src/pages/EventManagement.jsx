import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Edit2,
  CheckCircle2,
  Clock,
  MapPin,
  Trophy,
  Play,
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
      location: 'Main Arcade Arena',
      prizePool: '5,000 Arcade Tokens',
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

  return (
    <div className="py-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-arcade-pink" />
            <h1 className="font-bungee text-2xl sm:text-3xl text-white">
              EVENT TOURNAMENTS
            </h1>
          </div>
          <p className="text-arcade-muted font-sans text-xs sm:text-sm">
            Schedule tournament brackets, activate arenas, and configure prize pools.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="arcade-btn-pink flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE EVENT</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((evt) => {
          const isActive = evt.id === activeEventId;

          return (
            <div
              key={evt.id}
              className={`rounded-xl p-5 border-2 border-black flex flex-col justify-between transition-all duration-150 ${
                isActive
                  ? 'bg-[#181622] shadow-arcade-pink'
                  : 'bg-[#15141c] shadow-arcade-sm'
              }`}
            >
              <div>
                {/* Status Bar */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2 py-0.5 rounded font-arcade text-[9px] font-bold uppercase border border-black ${
                      evt.status === 'active'
                        ? 'bg-emerald-400 text-black'
                        : evt.status === 'draft'
                        ? 'bg-arcade-yellow text-black'
                        : 'bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    {evt.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-arcade-muted">
                    {evt.code}
                  </span>
                </div>

                <h3 className="font-display font-black text-lg text-white mb-1.5">
                  {evt.name}
                </h3>
                <p className="text-arcade-muted font-sans text-xs line-clamp-2 mb-4">
                  {evt.description}
                </p>

                {/* Specs Box */}
                <div className="space-y-1.5 text-xs font-mono text-zinc-300 mb-5 bg-[#0e0d14] p-3 rounded-lg border border-arcade-border">
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
                    <span className="truncate text-arcade-yellow font-bold">
                      {evt.prizePool}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-arcade-border gap-2">
                <button
                  onClick={() => handleOpenEdit(evt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#201d2a] hover:bg-[#2c283a] text-white text-xs font-mono font-bold transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>

                {!isActive ? (
                  <button
                    onClick={() => handleActivateEvent(evt.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-display font-black text-xs uppercase transition-colors"
                  >
                    <Play className="w-3 h-3 fill-black" />
                    <span>Set Active</span>
                  </button>
                ) : (
                  <span className="text-xs font-arcade text-arcade-yellow font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ACTIVE NOW</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="relative w-full max-w-xl bg-[#15141c] border-3 border-black rounded-xl p-6 shadow-arcade-lg max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-arcade-muted hover:text-white font-mono text-base"
            >
              ✕
            </button>

            <h2 className="font-bungee text-xl text-white mb-1">
              {editingEvent ? 'EDIT TOURNAMENT' : 'NEW TOURNAMENT'}
            </h2>
            <p className="text-xs text-arcade-muted font-sans mb-4">
              All settings are dynamically configurable.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs font-mono">
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
                  <label className="block text-arcade-muted mb-1 font-bold">CODE</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none focus:border-arcade-yellow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-arcade-muted mb-1 font-bold">DESCRIPTION</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none focus:border-arcade-yellow"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-arcade-muted mb-1 font-bold">STATUS</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-arcade-muted mb-1 font-bold">START DATE</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-arcade-muted mb-1 font-bold">END DATE</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-arcade-muted mb-1 font-bold">LOCATION / VENUE</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-arcade-muted mb-1 font-bold">PRIZE POOL</label>
                  <input
                    type="text"
                    value={formData.prizePool}
                    onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Assign Games */}
              <div>
                <label className="block text-arcade-muted mb-1.5 font-bold">ASSIGN DISCIPLINES</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {games.map((g) => {
                    const selected = formData.assignedGameIds.includes(g.id);
                    return (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => toggleGameAssignment(g.id)}
                        className={`p-2 rounded border text-left flex items-center gap-2 text-xs ${
                          selected
                            ? 'bg-arcade-yellow text-black border-black font-bold'
                            : 'bg-[#0e0d14] border-arcade-border text-arcade-muted'
                        }`}
                      >
                        <span>{g.icon}</span>
                        <span className="truncate">{g.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-arcade-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#201d2a] text-white font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="arcade-btn-yellow"
                >
                  {editingEvent ? 'SAVE EVENT' : 'CREATE EVENT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
