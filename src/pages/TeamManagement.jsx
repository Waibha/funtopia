import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function TeamManagement({ teams, onSaveTeam, onDeleteTeam }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    color: '#FF2A6D',
    avatar: '🦅',
    motto: '',
    captain: '',
    membersCount: 4,
  });

  const avatarOptions = ['🦅', '⚡', '⚔️', '🌀', '🛡️', '🚀', '👾', '🔥', '🦊', '🐺', '🐉', '⭐'];
  const colorOptions = ['#FF2A6D', '#00E5FF', '#F5EE00', '#7928CA', '#FF6B00', '#05D179', '#EC4899', '#38BDF8'];

  const handleOpenCreate = () => {
    soundFx.play('click');
    setEditingTeam(null);
    setFormData({
      name: '',
      tag: '',
      color: '#FF2A6D',
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
    <div className="py-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-pop-purple" />
            <h1 className="font-bungee text-2xl sm:text-3xl text-pop-ink">
              CREW ROSTER
            </h1>
          </div>
          <p className="text-pop-muted font-sans text-xs sm:text-sm font-medium">
            Register competitive squads, customize team emblems, and assign captains.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-pop-yellow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>REGISTER CREW</span>
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="rounded-3xl p-6 bg-white border-3 border-pop-ink shadow-pop hover:-translate-y-1 hover:shadow-pop-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-3 border-pop-ink shadow-pop-sm"
                  style={{ backgroundColor: team.color }}
                >
                  <span>{team.avatar}</span>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-pop-ink text-white font-black inline-block">
                    [{team.tag}]
                  </span>
                  <p className="text-[11px] font-mono text-pop-muted mt-1 font-bold">
                    {team.membersCount} Crew Members
                  </p>
                </div>
              </div>

              <h3 className="font-display font-black text-xl text-pop-ink mb-1">
                {team.name}
              </h3>
              <p className="text-xs font-mono text-pop-purple mb-3 font-black">
                Captain: {team.captain || 'None Assigned'}
              </p>

              <div className="p-3 rounded-xl bg-pop-butter border-2 border-pop-ink mb-5 text-xs font-sans italic text-pop-ink font-medium">
                "{team.motto || 'No motto registered.'}"
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t-2 border-pop-ink/20">
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border-2 border-pop-ink"
                  style={{ backgroundColor: team.color }}
                />
                <span className="text-xs font-mono font-bold text-pop-muted">{team.color}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(team)}
                  className="p-2 rounded-xl bg-pop-butter hover:bg-pop-yellow-light text-pop-ink border border-pop-ink font-bold transition-colors"
                  title="Edit Team"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(team.id, team.name)}
                  className="p-2 rounded-xl bg-pop-coral-light hover:bg-pop-coral hover:text-white text-pop-coral border border-pop-ink font-bold transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pop-ink/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border-4 border-pop-ink rounded-3xl p-6 sm:p-8 shadow-pop-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-pop-muted hover:text-pop-ink font-mono text-lg font-black"
            >
              ✕
            </button>

            <h2 className="font-bungee text-2xl text-pop-ink mb-1">
              {editingTeam ? 'EDIT CREW' : 'REGISTER CREW'}
            </h2>
            <p className="text-xs text-pop-muted font-sans mb-4 font-bold">
              Set team tag, signature color, and mascot emblem.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
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
                  <label className="block text-pop-ink mb-1 font-black">TAG</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink uppercase font-black focus:outline-none focus:border-pop-coral"
                  />
                </div>
              </div>

              <div>
                <label className="block text-pop-ink mb-1.5 font-black">MASCOT EMBLEM</label>
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setFormData({ ...formData, avatar: av })}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border-2 border-pop-ink transition-transform ${
                        formData.avatar === av
                          ? 'bg-pop-yellow scale-110 shadow-pop-sm font-black'
                          : 'bg-pop-butter hover:bg-white'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-pop-ink mb-1.5 font-black">SIGNATURE COLOR</label>
                <div className="flex items-center gap-3">
                  {colorOptions.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-7 h-7 rounded-full border-2 border-pop-ink transition-transform ${
                        formData.color === c ? 'scale-125 ring-3 ring-pop-ink' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-pop-ink mb-1 font-black">CAPTAIN</label>
                  <input
                    type="text"
                    value={formData.captain}
                    onChange={(e) => setFormData({ ...formData, captain: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-pop-ink mb-1 font-black">MEMBERS</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.membersCount}
                    onChange={(e) => setFormData({ ...formData, membersCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-pop-ink mb-1 font-black">CREW MOTTO</label>
                <input
                  type="text"
                  value={formData.motto}
                  onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
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
