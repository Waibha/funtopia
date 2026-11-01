import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, UserCheck } from 'lucide-react';
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
    if (window.confirm(`Are you sure you want to remove team "${name}" from the tournament?`)) {
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
            <Users className="w-5 h-5 text-arcade-cyan" />
            <h1 className="font-bungee text-2xl sm:text-3xl text-white">
              TEAM MANAGEMENT
            </h1>
          </div>
          <p className="text-gray-400 font-sans text-sm">
            Recruit, customize, and configure competing crew identities and banners.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-arcade-cyan to-blue-600 text-slate-950 font-display font-bold text-xs tracking-wider shadow-arcade-button-cyan hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>REGISTER TEAM</span>
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="rounded-2xl p-6 bg-[#0c0e28] border transition-all duration-300 relative group overflow-hidden flex flex-col justify-between"
            style={{
              borderColor: `${team.color}40`,
            }}
          >
            {/* Top ambient color edge */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: team.color }}
            />

            <div>
              {/* Team Crest & Tag */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2 shadow-lg"
                  style={{
                    backgroundColor: `${team.color}15`,
                    borderColor: team.color,
                    boxShadow: `0 0 15px ${team.color}30`,
                  }}
                >
                  <span>{team.avatar}</span>
                </div>

                <div className="text-right">
                  <span
                    className="font-mono text-xs px-2 py-1 rounded-md font-bold tracking-wider inline-block"
                    style={{
                      backgroundColor: `${team.color}20`,
                      color: team.color,
                      border: `1px solid ${team.color}50`,
                    }}
                  >
                    [{team.tag}]
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400 mt-1">
                    <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>{team.membersCount} Members</span>
                  </div>
                </div>
              </div>

              {/* Team Name & Captain */}
              <h3 className="font-display font-bold text-xl text-white mb-1">
                {team.name}
              </h3>
              <p className="text-xs font-mono text-purple-300 mb-3">
                Captain: {team.captain || 'Unassigned'}
              </p>

              {/* Motto Box */}
              <div className="p-3 rounded-xl bg-[#070817] border border-purple-500/10 mb-6">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-0.5">
                  CREW MOTTO
                </span>
                <p className="text-xs font-sans italic text-gray-300 line-clamp-2">
                  "{team.motto || 'No motto registered yet.'}"
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-purple-500/15">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
                <span className="text-[10px] font-mono text-gray-400">{team.color}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(team)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                  title="Edit Team"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(team.id, team.name)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  title="Remove Team"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT TEAM MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0d0f28] border-2 border-purple-500/40 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white font-mono text-lg"
            >
              ✕
            </button>

            <h2 className="font-bungee text-xl text-white mb-1">
              {editingTeam ? 'EDIT CREW PROFILE' : 'REGISTER COMPETITIVE CREW'}
            </h2>
            <p className="text-xs text-gray-400 font-sans mb-6">
              Define team branding, signature avatar, and roster.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-gray-300 mb-1">CREW NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vapor Hawks"
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-cyan"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">TAG (MAX 4)</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="VPR"
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white font-mono uppercase focus:outline-none focus:border-arcade-cyan"
                  />
                </div>
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="block text-gray-300 mb-2">CREW EMBLEM / AVATAR</label>
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setFormData({ ...formData, avatar: av })}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                        formData.avatar === av
                          ? 'bg-purple-600 border-2 border-arcade-cyan scale-110 shadow-neon-cyan'
                          : 'bg-[#070817] border border-purple-500/20 hover:bg-white/5'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Color Selection */}
              <div>
                <label className="block text-gray-300 mb-2">SIGNATURE NEON COLOR</label>
                <div className="flex items-center gap-3">
                  {colorOptions.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        formData.color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#0d0f28]' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">CAPTAIN NAME</label>
                  <input
                    type="text"
                    value={formData.captain}
                    onChange={(e) => setFormData({ ...formData, captain: e.target.value })}
                    placeholder="e.g. Nova Chen"
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-cyan"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">MEMBER COUNT</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.membersCount}
                    onChange={(e) => setFormData({ ...formData, membersCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">CREW MOTTO</label>
                <input
                  type="text"
                  value={formData.motto}
                  onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                  placeholder="e.g. Speed of light, sharper than lasers."
                  className="w-full px-3 py-2 rounded-lg bg-[#070817] border border-purple-500/30 text-white focus:outline-none focus:border-arcade-cyan"
                />
              </div>

              {/* Submit Buttons */}
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-arcade-cyan to-blue-600 text-slate-950 font-display font-bold tracking-wider shadow-neon-cyan hover:scale-105 active:scale-95 transition-all"
                >
                  {editingTeam ? 'SAVE CHANGES' : 'REGISTER CREW'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
