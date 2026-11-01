import React, { useState } from 'react';
import { Calendar, Plus, Edit2, CheckCircle2, Play } from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function EventManagement({
  events = [],
  activeEventId,
  setActiveEventId,
  onSaveEvent,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleOpenCreate = () => {
    soundFx.play('click');
    setEditingEvent(null);
    setFormData({
      name: '',
      description: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    soundFx.play('click');
    setEditingEvent(evt);
    setFormData({
      name: evt.name || '',
      description: evt.description || '',
    });
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    soundFx.play('coin');

    const updatedEvent = {
      id: editingEvent ? editingEvent.id : `evt-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    onSaveEvent(updatedEvent);
    setModalOpen(false);
  };

  const handleActivateEvent = (evtId) => {
    soundFx.play('fanfare');
    setActiveEventId(evtId);
  };

  return (
    <div className="py-4 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-[#FF5FA0]" />
            <h1 className="font-bungee text-2xl sm:text-4xl text-[#FFDE25] pixel-title-yellow">
              EVENTS
            </h1>
          </div>
          <p className="text-purple-200 font-mono text-xs sm:text-sm font-medium">
            Create and manage events. The active event sets the stage for scores and standings.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-pixel-pink flex items-center gap-2"
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
              className={`rounded-3xl p-6 border-4 border-[#0D0518] flex flex-col justify-between transition-all duration-200 text-[#0D0518] ${
                isActive
                  ? 'bg-[#FFDE25] shadow-pixel-xl'
                  : 'bg-white shadow-pixel-lg hover:-translate-y-1'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-full font-arcade text-[9px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm ${
                      isActive
                        ? 'bg-[#0D0518] text-[#FFDE25]'
                        : 'bg-[#FAF7EE] text-gray-600'
                    }`}
                  >
                    {isActive ? 'ACTIVE EVENT' : 'TOURNAMENT'}
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl text-[#0D0518] mb-2">
                  {evt.name}
                </h3>
                {evt.description && (
                  <p className="text-gray-700 font-mono text-xs font-medium mb-4">
                    {evt.description}
                  </p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-[#0D0518]/30 gap-2">
                <button
                  onClick={() => handleOpenEdit(evt)}
                  className="btn-pixel-white text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {!isActive ? (
                  <button
                    onClick={() => handleActivateEvent(evt.id)}
                    className="btn-pixel-yellow text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-[#0D0518]" />
                    <span>Set Active</span>
                  </button>
                ) : (
                  <span className="text-xs font-arcade text-[#0D0518] font-black flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border-2 border-[#0D0518] shadow-pixel-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#28C76F]" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0518]/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 sm:p-8 shadow-pixel-xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-[#0D0518] font-mono text-lg font-black"
            >
              ✕
            </button>

            <h2 className="font-bungee text-2xl text-[#0D0518] mb-1">
              {editingEvent ? 'EDIT EVENT' : 'CREATE EVENT'}
            </h2>
            <p className="text-xs text-gray-600 font-mono mb-5 font-bold">
              Enter the event name and an optional short description.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#0D0518] mb-1.5 font-black text-sm">
                  EVENT NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Summer Championship 2026"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold focus:outline-none focus:border-[#FF5FA0] text-sm"
                />
              </div>

              <div>
                <label className="block text-[#0D0518] mb-1.5 font-black text-sm">
                  SHORT DESCRIPTION (OPTIONAL)
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Annual competitive tournament across all games."
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-medium focus:outline-none focus:border-[#FF5FA0] text-sm"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-[#0D0518]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-pixel-white text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-pixel-pink text-xs py-2 px-4"
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
