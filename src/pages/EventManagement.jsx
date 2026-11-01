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
      location: 'Grand Championship Hall',
      prizePool: '10,000 Arcade Tokens',
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
    <div className="py-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-pop-coral" />
            <h1 className="font-bungee text-2xl sm:text-3xl text-pop-ink">
              EVENT TOURNAMENTS
            </h1>
          </div>
          <p className="text-pop-muted font-sans text-xs sm:text-sm font-medium">
            Schedule tournament events, activate live circuits, and configure championship rules.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-pop-coral flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE EVENT</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => {
          const isActive = evt.id === activeEventId;

          return (
            <div
              key={evt.id}
              className={`rounded-3xl p-6 border-3 border-pop-ink flex flex-col justify-between transition-all duration-200 ${
                isActive
                  ? 'bg-pop-yellow-light shadow-pop-lg'
                  : 'bg-white shadow-pop hover:-translate-y-1'
              }`}
            >
              <div>
                {/* Status Bar */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full font-arcade text-[9px] font-black uppercase border-2 border-pop-ink shadow-pop-sm ${
                      evt.status === 'active'
                        ? 'bg-pop-yellow text-pop-ink'
                        : evt.status === 'draft'
                        ? 'bg-pop-coral text-white'
                        : 'bg-pop-purple text-white'
                    }`}
                  >
                    {evt.status}
                  </span>
                  <span className="text-xs font-mono font-black text-pop-ink px-2 py-0.5 rounded bg-white border border-pop-ink">
                    {evt.code}
                  </span>
                </div>

                <h3 className="font-display font-black text-xl text-pop-ink mb-1.5">
                  {evt.name}
                </h3>
                <p className="text-pop-muted font-sans text-xs line-clamp-2 mb-4 font-medium">
                  {evt.description}
                </p>

                {/* Details Box */}
                <div className="space-y-2 text-xs font-mono text-pop-ink mb-5 bg-pop-butter p-3.5 rounded-2xl border-2 border-pop-ink">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pop-purple" />
                    <span className="font-bold">
                      {evt.startDate} → {evt.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-pop-coral" />
                    <span className="truncate font-bold">{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-pop-orange" />
                    <span className="truncate text-pop-orange font-black">
                      {evt.prizePool}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-pop-ink/20 gap-2">
                <button
                  onClick={() => handleOpenEdit(evt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-pop-butter text-pop-ink border-2 border-pop-ink font-mono text-xs font-bold shadow-pop-sm transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {!isActive ? (
                  <button
                    onClick={() => handleActivateEvent(evt.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pop-yellow hover:bg-yellow-300 text-pop-ink font-display font-black text-xs uppercase border-2 border-pop-ink shadow-pop-sm transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-pop-ink" />
                    <span>Set Active</span>
                  </button>
                ) : (
                  <span className="text-xs font-arcade text-pop-ink font-black flex items-center gap-1 bg-pop-yellow px-2 py-1 rounded-lg border border-pop-ink">
                    <CheckCircle2 className="w-3.5 h-3.5 text-pop-coral" />
                    <span>ACTIVE</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pop-ink/70 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white border-4 border-pop-ink rounded-3xl p-6 sm:p-8 shadow-pop-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-pop-muted hover:text-pop-ink font-mono text-lg font-black"
            >
              ✕
            </button>

            <h2 className="font-bungee text-2xl text-pop-ink mb-1">
              {editingEvent ? 'EDIT TOURNAMENT' : 'CREATE TOURNAMENT'}
            </h2>
            <p className="text-xs text-pop-muted font-sans mb-5 font-bold">
              All settings are dynamically configurable.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-mono">
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
                  <label className="block text-pop-ink mb-1 font-black">CODE</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none focus:border-pop-coral"
                  />
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

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-pop-ink mb-1 font-black">STATUS</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-pop-ink mb-1 font-black">START DATE</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-pop-ink mb-1 font-black">END DATE</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-pop-ink mb-1 font-black">LOCATION</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-pop-ink mb-1 font-black">PRIZE POOL</label>
                  <input
                    type="text"
                    value={formData.prizePool}
                    onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Assign Games */}
              <div>
                <label className="block text-pop-ink mb-2 font-black">ASSIGN DISCIPLINES</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {games.map((g) => {
                    const selected = formData.assignedGameIds.includes(g.id);
                    return (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => toggleGameAssignment(g.id)}
                        className={`p-2.5 rounded-xl border-2 border-pop-ink text-left flex items-center gap-2 text-xs font-bold transition-all ${
                          selected
                            ? 'bg-pop-yellow text-pop-ink shadow-pop-sm'
                            : 'bg-pop-butter text-pop-muted hover:bg-white'
                        }`}
                      >
                        <span className="text-base">{g.icon}</span>
                        <span className="truncate">{g.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-pop-ink">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-pop-butter border-2 border-pop-ink text-pop-ink font-mono font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-pop-coral"
                >
                  {editingEvent ? 'SAVE TOURNAMENT' : 'CREATE TOURNAMENT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
