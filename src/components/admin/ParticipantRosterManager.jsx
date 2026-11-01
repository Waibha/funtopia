import React, { useState } from 'react';
import { Users, Search, Trash2, Plus } from 'lucide-react';
import { soundFx } from '../../utilities/soundFx';

export default function ParticipantRosterManager({
  participants = [],
  activeEventId,
  onAddParticipant,
  onRemoveParticipant,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '👾',
  });

  const avatars = ['👾', '🤠', '🧕', '🦊', '🧑‍🎤', '🐻', '🚀', '⚡', '⚔️', '🐉', '🔥', '⭐'];

  const filtered = participants.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    soundFx.play('coin');

    const newP = {
      id: `p-${Date.now()}`,
      eventId: activeEventId || 'evt-1',
      name: formData.name.trim(),
      email: formData.email.trim(),
      avatar: formData.avatar,
      registeredAt: new Date().toISOString(),
    };

    if (onAddParticipant) onAddParticipant(newP);
    setFormData({ name: '', email: '', avatar: '👾' });
    setModalOpen(false);
  };

  return (
    <div className="py-4 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-[#FF5FA0]" />
            <h1 className="font-bungee text-2xl sm:text-4xl text-[#FFDE25] pixel-title-yellow">
              PARTICIPANTS ROSTER
            </h1>
          </div>
          <p className="text-purple-200 font-mono text-xs sm:text-sm font-medium">
            Manage individual registered participants competing in events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="font-arcade text-[10px] font-black bg-[#FFDE25] text-[#0D0518] px-4 py-2 rounded-xl border-3 border-[#0D0518] shadow-pixel-sm">
            {participants.length} REGISTERED
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-pixel-pink flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>ADD PLAYER</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white text-[#0D0518] p-4 rounded-2xl border-4 border-[#0D0518] shadow-pixel-lg flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search participant name or email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF7EE] border-2 border-[#0D0518] text-xs font-mono font-bold text-[#0D0518] focus:outline-none"
          />
        </div>
      </div>

      {/* Roster Cards List */}
      <div className="bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 shadow-pixel-lg">
        <div className="space-y-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-[#FFFDF5] border-3 border-[#0D0518] flex items-center justify-between gap-4 hover:bg-[#FAF7EE] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#0D0518] flex items-center justify-center text-2xl shadow-pixel-sm">
                  {p.avatar || '👾'}
                </div>

                <div>
                  <h3 className="font-display font-black text-base text-[#0D0518]">
                    {p.name}
                  </h3>
                  <div className="text-xs font-mono text-gray-500 font-medium mt-0.5">
                    {p.email} • ID: {p.id}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.play('scoreDown');
                  if (window.confirm(`Remove participant "${p.name}"?`)) {
                    onRemoveParticipant(p.id);
                  }
                }}
                className="p-2.5 rounded-xl bg-red-100 hover:bg-red-500 hover:text-white text-red-600 border-2 border-[#0D0518] shadow-pixel-sm transition-all"
                title="Remove Participant"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500 font-mono text-xs font-bold">
              No participants found matching "{searchQuery}".
            </div>
          )}
        </div>
      </div>

      {/* ADD PARTICIPANT MODAL */}
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
              ADD PARTICIPANT
            </h2>
            <p className="text-xs text-gray-600 font-mono mb-4 font-bold">
              Add a new individual participant directly to the roster.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#0D0518] mb-1 font-black text-sm">FULL NAME *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jordan Lee"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold focus:outline-none focus:border-[#FF5FA0] text-sm"
                />
              </div>

              <div>
                <label className="block text-[#0D0518] mb-1 font-black text-sm">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jordan@example.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold focus:outline-none focus:border-[#FF5FA0] text-sm"
                />
              </div>

              <div>
                <label className="block text-[#0D0518] mb-2 font-black text-sm">CHOOSE AVATAR</label>
                <div className="flex flex-wrap gap-2">
                  {avatars.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setFormData({ ...formData, avatar: av })}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border-2 border-[#0D0518] transition-transform ${
                        formData.avatar === av
                          ? 'bg-[#FFDE25] scale-110 shadow-pixel-sm font-black'
                          : 'bg-[#FFFDF5] hover:bg-white'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

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
                  ADD PARTICIPANT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
