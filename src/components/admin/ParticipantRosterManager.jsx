import React, { useState } from 'react';
import { Users, Search, Trash2, UserPlus, Filter } from 'lucide-react';
import { soundFx } from '../../utilities/soundFx';

export default function ParticipantRosterManager({
  participants = [],
  teams = [],
  events = [],
  activeEventId,
  onAssignTeam,
  onRemoveParticipant,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTeamId, setFilterTeamId] = useState('all');

  const filtered = participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.gamertag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam =
      filterTeamId === 'all'
        ? true
        : filterTeamId === 'unassigned'
        ? !p.teamId
        : p.teamId === filterTeamId;
    return matchesSearch && matchesTeam;
  });

  return (
    <div className="py-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-pop-purple" />
            <h1 className="font-bungee text-2xl sm:text-3xl text-pop-ink">
              PARTICIPANT ROSTER
            </h1>
          </div>
          <p className="text-pop-muted font-sans text-xs sm:text-sm font-medium">
            Manage incoming player registrations, assign free agents to squads, and audit passes.
          </p>
        </div>

        <div className="font-mono text-xs font-black bg-pop-yellow text-pop-ink px-4 py-2 rounded-xl border-2 border-pop-ink shadow-pop-sm">
          {participants.length} REGISTERED PILOTS
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border-3 border-pop-ink shadow-pop flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-pop-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gamertag, name, email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-xs font-mono font-bold text-pop-ink focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-pop-muted" />
          <select
            value={filterTeamId}
            onChange={(e) => setFilterTeamId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-pop-canvas border-2 border-pop-ink text-xs font-mono font-bold text-pop-ink focus:outline-none"
          >
            <option value="all">All Squads & Free Agents</option>
            <option value="unassigned">Unassigned (Free Agent Pool)</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} [{t.tag}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white border-3 border-pop-ink rounded-3xl p-6 shadow-pop">
        <div className="space-y-3">
          {filtered.map((p) => {
            const team = teams.find((t) => t.id === p.teamId);

            return (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-pop-butter border-2 border-pop-ink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border-2 border-pop-ink flex items-center justify-center text-2xl shadow-pop-sm">
                    {p.avatar || '👾'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-black text-base text-pop-ink">
                        {p.gamertag}
                      </span>
                      <span className="text-xs text-pop-muted font-sans font-bold">
                        ({p.name})
                      </span>
                    </div>
                    <div className="text-xs font-mono text-pop-muted font-medium mt-0.5">
                      {p.email} • ID: {p.id.slice(0, 8)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Crew assignment select */}
                  <select
                    value={p.teamId || 'unassigned'}
                    onChange={(e) => {
                      soundFx.play('click');
                      onAssignTeam(p.id, e.target.value === 'unassigned' ? null : e.target.value);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border-2 border-pop-ink text-xs font-mono font-bold text-pop-ink focus:outline-none shadow-pop-sm"
                  >
                    <option value="unassigned">Free Agent (Draft Pool)</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        Assign to: {t.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      soundFx.play('scoreDown');
                      if (window.confirm(`Remove participant "${p.gamertag}"?`)) {
                        onRemoveParticipant(p.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-pop-coral-light hover:bg-pop-coral hover:text-white text-pop-coral border-2 border-pop-ink shadow-pop-sm transition-all"
                    title="Remove Participant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-pop-muted font-mono text-xs font-bold">
              No participants matching query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
