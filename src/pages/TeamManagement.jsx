import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function TeamManagement({ teams, onSaveTeam, onDeleteTeam }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    color: '#FF007F',
    avatar: '🦅',
    motto: '',
    captain: '',
    membersCount: 4,
  });

  const avatarOptions = ['🦅', '⚡', '⚔️', '🌀', '🛡️', '🚀', '👾', '🔥', '🦊', '🐺', '🐉', '⭐'];
  const colorOptions = ['#FF007F', '#00F0FF', '#FFE600', '#A855F7', '#FF5E3A', '#10B981', '#EC4899', '#38BDF8'];

  const handleOpenCreate = () => {
    soundFx.play('click');
    setEditingTeam(null);
    setFormData({
      name: '',
      tag: '',
      color: '#FF007F',
      avatar: '🦅',
      motto: '',
      captain: '',
      membersCount: 4,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (team) => {
    soundFx.play('click');
    setEditingTeam(team);
    setFormData({ ...team });
    setModalOpen(true);
  };

  const handleDelete = (teamId, name) => {
    soundFx.play('scoreDown');
    if (window.confirm(`Delete crew "${name}"?`)) {
      onDeleteTeam(teamId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFx.play('coin');

    const updated = {
      ...formData,
      id: editingTeam ? editingTeam.id : `team-${Date.now()}`,
      tag: formData.tag.toUpperCase().slice(0, 4),
    };

    onSaveTeam(updated);
    setModalOpen(false);
  };

  return (
    <div className="py-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-arcade-cyan" />
            <h1 className="font-bungee text-2xl sm:text-3xl text-white">
              CREW ROSTER
            </h1>
          </div>
          <p className="text-arcade-muted font-sans text-xs sm:text-sm">
            Recruit, customize team banners, and configure competitive rosters.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="arcade-btn-cyan flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>REGISTER CREW</span>
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teams.map((team) => (
          <div
            key={team.id}
            className="rounded-xl p-5 bg-[#15141c] border-2 border-black shadow-arcade-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl border-2 border-black shadow-arcade-sm"
                  style={{ backgroundColor: team.color }}
                >
                  <span>{team.avatar}</span>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0e0d14] text-white font-bold border border-arcade-border inline-block">
                    [{team.tag}]
                  </span>
                  <p className="text-[11px] font-mono text-arcade-muted mt-1">
                    {team.membersCount} Crew Members
                  </p>
                </div>
              </div>

              <h3 className="font-display font-black text-lg text-white mb-0.5">
                {team.name}
              </h3>
              <p className="text-xs font-mono text-arcade-yellow mb-3 font-bold">
                Captain: {team.captain || 'None'}
              </p>

              <div className="p-2.5 rounded bg-[#0e0d14] border border-arcade-border mb-4 text-xs font-sans italic text-zinc-300">
                "{team.motto || 'No motto registered.'}"
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-arcade-border">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border border-black" style={{ backgroundColor: team.color }} />
                <span className="text-[10px] font-mono text-arcade-muted">{team.color}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(team)}
                  className="p-1.5 rounded bg-[#201d2a] hover:bg-[#2b2738] text-white"
                  title="Edit Team"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(team.id, team.name)}
                  className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-400"
                  title="Remove Team"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
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
              {editingTeam ? 'EDIT CREW' : 'REGISTER CREW'}
            </h2>
            <p className="text-xs text-arcade-muted font-sans mb-4">
              Set team tag, signature color, and avatar.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2">
                  <label className="block text-arcade-muted mb-1 font-bold">NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none focus:border-arcade-cyan"
                  />
                </div>
                <div>
                  <label className="block text-arcade-muted mb-1 font-bold">TAG</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white uppercase focus:outline-none focus:border-arcade-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-arcade-muted mb-1.5 font-bold">EMBLEM</label>
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setFormData({ ...formData, avatar: av })}
                      className={`w-9 h-9 rounded flex items-center justify-center text-lg border ${
                        formData.avatar === av
                          ? 'bg-arcade-yellow text-black border-black font-bold shadow-arcade-sm'
                          : 'bg-[#0e0d14] border-arcade-border'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-arcade-muted mb-1.5 font-bold">SIGNATURE COLOR</label>
                <div className="flex items-center gap-2.5">
                  {colorOptions.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-7 h-7 rounded-full border-2 border-black transition-transform ${
                        formData.color === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-arcade-muted mb-1 font-bold">CAPTAIN</label>
                  <input
                    type="text"
                    value={formData.captain}
                    onChange={(e) => setFormData({ ...formData, captain: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-arcade-muted mb-1 font-bold">MEMBERS</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.membersCount}
                    onChange={(e) => setFormData({ ...formData, membersCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded bg-[#0e0d14] border border-arcade-border text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-arcade-muted mb-1 font-bold">MOTTO</label>
                <input
                  type="text"
                  value={formData.motto}
                  onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
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
                  className="arcade-btn-cyan"
                >
                  {editingTeam ? 'SAVE CREW' : 'REGISTER CREW'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
