import React, { useState } from 'react';
import { UserCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { soundFx } from '../../utilities/soundFx';

export default function ParticipantRegistration({
  activeEvent,
  onRegisterParticipant,
  registeredList = [],
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '👾',
  });

  const [registeredCard, setRegisteredCard] = useState(null);

  const avatars = ['👾', '🚀', '⚡', '🦅', '⚔️', '🌀', '🛡️', '🔥', '🦊', '🐺', '🐉', '⭐'];

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFx.play('coin');

    const newParticipant = {
      id: `p-${Date.now()}`,
      eventId: activeEvent?.id || 'evt-1',
      name: formData.name.trim(),
      email: formData.email.trim(),
      avatar: formData.avatar,
      registeredAt: new Date().toISOString(),
    };

    onRegisterParticipant(newParticipant);
    setRegisteredCard(newParticipant);
    soundFx.play('fanfare');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 select-none">
      {/* Registration Header */}
      <div className="bg-pop-yellow rounded-3xl border-3 border-pop-ink p-6 sm:p-8 shadow-pop-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-pop-coral text-white font-arcade text-[10px] font-black uppercase border-2 border-pop-ink shadow-pop-sm inline-block mb-2">
            PARTICIPANT REGISTRATION
          </span>
          <h2 className="font-bungee text-3xl sm:text-4xl text-pop-ink">
            JOIN THE LEADERBOARD
          </h2>
          <p className="text-pop-ink font-sans text-sm font-semibold mt-1">
            Register yourself for <span className="font-bold underline">{activeEvent?.name}</span> to earn individual points.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="font-mono text-xs text-pop-muted block font-bold">TOTAL PARTICIPANTS</span>
          <span className="font-mono text-2xl font-black text-pop-ink">
            {registeredList.length} REGISTERED
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
              REGISTRATION CONFIRMED
            </span>
            <h3 className="font-bungee text-3xl text-pop-ink">
              YOU'RE REGISTERED!
            </h3>
            <p className="text-pop-muted font-sans text-sm font-medium mt-1">
              Your profile is live on the individual leaderboard.
            </p>
          </div>

          {/* Participant Badge Preview */}
          <div className="max-w-sm mx-auto bg-pop-butter border-3 border-pop-ink rounded-2xl p-6 shadow-pop text-left space-y-3">
            <div className="flex items-center justify-between border-b-2 border-pop-ink pb-3">
              <span className="font-arcade text-xs text-pop-coral font-black">FUNTOPIA PARTICIPANT</span>
              <span className="text-3xl">{registeredCard.avatar}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-pop-muted uppercase font-bold block">PARTICIPANT NAME</span>
              <span className="font-display font-black text-2xl text-pop-ink tracking-wider">
                {registeredCard.name}
              </span>
            </div>

            <div className="text-xs font-mono font-bold pt-2 border-t border-pop-ink/20 text-pop-muted">
              Email: {registeredCard.email}
            </div>

            <div className="text-[10px] font-mono text-pop-muted">
              Participant ID: {registeredCard.id} • Active
            </div>
          </div>

          <button
            onClick={() => {
              setRegisteredCard(null);
              setFormData({ name: '', email: '', avatar: '👾' });
            }}
            className="btn-pop-yellow text-xs font-mono font-black"
          >
            Register Another Participant
          </button>
        </div>
      ) : (
        /* Registration Form */
        <div className="bg-white rounded-3xl border-3 border-pop-ink p-6 sm:p-8 shadow-pop">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs font-mono">
            <div>
              <label className="block text-pop-ink mb-1.5 font-black text-sm">
                FULL NAME *
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
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="participant@example.com"
                className="w-full px-4 py-3 rounded-xl bg-pop-canvas border-2 border-pop-ink text-pop-ink font-bold focus:outline-none focus:border-pop-coral text-sm"
              />
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-pop-ink mb-2 font-black text-sm">
                CHOOSE AVATAR
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
                ✓ Instant entry into individual standings
              </span>

              <button
                type="submit"
                className="btn-pop-coral flex items-center gap-2"
              >
                <span>REGISTER PARTICIPANT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
