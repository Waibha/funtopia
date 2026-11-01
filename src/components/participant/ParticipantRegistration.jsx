import React, { useState } from 'react';
import { UserCheck, Sparkles, Trophy, CheckCircle2, ArrowRight } from 'lucide-react';
import { soundFx } from '../../utilities/soundFx';

export default function ParticipantRegistration({
  activeEvent,
  teams,
  onRegisterParticipant,
  registeredList = [],
}) {
  const [formData, setFormData] = useState({
    name: '',
    gamertag: '',
    email: '',
    teamId: 'unassigned', // Configurable team selection or free-agent
    avatar: '👾',
    discordTag: '',
  });

  const [registeredCard, setRegisteredCard] = useState(null);

  const avatars = ['👾', '🚀', '⚡', '🦅', '⚔️', '🌀', '🛡️', '🔥', '🦊', '🐺', '🐉', '⭐'];

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFx.play('coin');

    const newParticipant = {
      id: `p-${Date.now()}`,
      eventId: activeEvent?.id || 'evt-cosmic-2026',
      name: formData.name.trim(),
      gamertag: formData.gamertag.trim().toUpperCase(),
      email: formData.email.trim(),
      teamId: formData.teamId === 'unassigned' ? null : formData.teamId,
      avatar: formData.avatar,
      discordTag: formData.discordTag.trim(),
      registeredAt: new Date().toISOString(),
    };

    onRegisterParticipant(newParticipant);
    setRegisteredCard(newParticipant);
    soundFx.play('fanfare');
  };

  const assignedTeam = teams.find((t) => t.id === registeredCard?.teamId);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 select-none">
      {/* Registration Header */}
      <div className="bg-pop-yellow rounded-3xl border-3 border-pop-ink p-6 sm:p-8 shadow-pop-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-pop-coral text-white font-arcade text-[10px] font-black uppercase border-2 border-pop-ink shadow-pop-sm inline-block mb-2">
            PILOT ONBOARDING
          </span>
          <h2 className="font-bungee text-3xl sm:text-4xl text-pop-ink">
            CHAMPIONSHIP REGISTRATION
          </h2>
          <p className="text-pop-ink font-sans text-sm font-semibold mt-1">
            Register your player handle for <span className="font-bold underline">{activeEvent?.name}</span>.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="font-mono text-xs text-pop-muted block font-bold">TOTAL REGISTERED</span>
          <span className="font-mono text-2xl font-black text-pop-ink">
            {registeredList.length + 24} PLAYERS
          </span>
        </div>
      </div>

      {/* Confirmation Badge Card if registered */}
      {registeredCard ? (
        <div className="bg-white rounded-3xl border-4 border-pop-ink p-8 shadow-pop-xl text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-pop-green border-3 border-pop-ink shadow-pop mx-auto flex items-center justify-center text-4xl">
            ✓
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-pop-purple text-white font-arcade text-[10px] font-black uppercase border-2 border-pop-ink shadow-pop-sm inline-block mb-2">
              PLAYER PASS ISSUED
            </span>
            <h3 className="font-bungee text-3xl text-pop-ink">
              REGISTRATION CONFIRMED!
            </h3>
            <p className="text-pop-muted font-sans text-sm font-medium mt-1">
              Your official tournament badge is live in the championship roster.
            </p>
          </div>

          {/* Physical Tournament Badge Preview */}
          <div className="max-w-sm mx-auto bg-pop-butter border-3 border-pop-ink rounded-2xl p-6 shadow-pop text-left space-y-3">
            <div className="flex items-center justify-between border-b-2 border-pop-ink pb-3">
              <span className="font-arcade text-xs text-pop-coral font-black">FUNTOPIA ARENA PASS</span>
              <span className="text-2xl">{registeredCard.avatar}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-pop-muted uppercase font-bold block">PILOT GAMERTAG</span>
              <span className="font-display font-black text-2xl text-pop-ink tracking-wider">
                {registeredCard.gamertag}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs font-mono font-bold pt-2 border-t border-pop-ink/20">
              <span className="text-pop-muted">Squad / Crew:</span>
              <span className="font-black text-pop-purple">
                {assignedTeam ? `${assignedTeam.name} [${assignedTeam.tag}]` : 'Unassigned (Draft Pool)'}
              </span>
            </div>

            <div className="text-[10px] font-mono text-pop-muted">
              Pass ID: {registeredCard.id} • Verified
            </div>
          </div>

          <button
            onClick={() => setRegisteredCard(null)}
            className="btn-pop-yellow text-xs font-mono font-black"
          >
            Register Another Participant
          </button>
        </div>
      ) : (
        /* Registration Form */
        <div className="bg-white rounded-3xl border-3 border-pop-ink p-6 sm:p-8 shadow-pop">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-pop-ink mb-1.5 font-black text-sm">
                  FULL NAME / CALLSIGN *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-3 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none focus:border-pop-coral text-sm"
                />
              </div>

              <div>
                <label className="block text-pop-ink mb-1.5 font-black text-sm">
                  GAMERTAG / HANDLE *
                </label>
                <input
                  type="text"
                  required
                  maxLength={12}
                  value={formData.gamertag}
                  onChange={(e) => setFormData({ ...formData, gamertag: e.target.value })}
                  placeholder="e.g. CYBER_NOVA"
                  className="w-full px-4 py-3 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-mono font-black uppercase focus:outline-none focus:border-pop-coral text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-pop-ink mb-1.5 font-black text-sm">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="player@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none focus:border-pop-coral text-sm"
                />
              </div>

              <div>
                <label className="block text-pop-ink mb-1.5 font-black text-sm">
                  DISCORD / SOCIAL HANDLE (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={formData.discordTag}
                  onChange={(e) => setFormData({ ...formData, discordTag: e.target.value })}
                  placeholder="@handle"
                  className="w-full px-4 py-3 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none focus:border-pop-coral text-sm"
                />
              </div>
            </div>

            {/* Crew Selection (Configurable: choose crew or remain unassigned) */}
            <div>
              <label className="block text-pop-ink mb-1.5 font-black text-sm">
                PREFERRED CREW / TEAM ASSIGNMENT
              </label>
              <select
                value={formData.teamId}
                onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-display font-black text-sm focus:outline-none focus:border-pop-coral"
              >
                <option value="unassigned">✦ Free Agent / Unassigned (Administrator will assign squad)</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.avatar} {t.name} [{t.tag}]
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-pop-muted mt-1 font-bold">
                Note: Team selection is optional. Unassigned participants enter the open draft pool.
              </p>
            </div>

            {/* Mascot Avatar Selection */}
            <div>
              <label className="block text-pop-ink mb-2 font-black text-sm">
                CHOOSE PILOT EMBLEM
              </label>
              <div className="flex flex-wrap gap-2.5">
                {avatars.map((av) => (
                  <button
                    type="button"
                    key={av}
                    onClick={() => setFormData({ ...formData, avatar: av })}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 border-pop-ink transition-transform ${
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

            <div className="pt-4 border-t-2 border-pop-ink flex items-center justify-between">
              <span className="text-xs text-pop-muted font-bold">
                ✓ Instant tournament credential issuance
              </span>

              <button
                type="submit"
                className="btn-pop-coral flex items-center gap-2"
              >
                <span>CONFIRM REGISTRATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
