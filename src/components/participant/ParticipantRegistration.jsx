import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
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

  // Diverse pixel adventure character sprites referencing Screen 5: "CHOOSE YOUR CHARACTER"
  const avatars = [
    { icon: '👾', name: 'Alien Pixel' },
    { icon: '🤠', name: 'Ranger' },
    { icon: '🧕', name: 'Mystic' },
    { icon: '🦊', name: 'Fox Pilot' },
    { icon: '🧑‍🎤', name: 'Arcade Punk' },
    { icon: '🐻', name: 'Bruin' },
    { icon: '🚀', name: 'Cosmonaut' },
    { icon: '⚡', name: 'Volt Striker' },
    { icon: '⚔️', name: 'Knight' },
    { icon: '🐉', name: 'Dragon' },
    { icon: '🔥', name: 'Blaze' },
    { icon: '⭐', name: 'Starlight' },
  ];

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
      {/* Header Banner - Directly Inspired by Screen 5: "CHOOSE YOUR CHARACTER" */}
      <div className="bg-[#40186D] rounded-3xl border-4 border-[#0D0518] p-6 sm:p-8 shadow-pixel-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#FF5FA0] text-white font-arcade text-[10px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm inline-block mb-2">
            PLAYER ONBOARDING
          </span>
          <h2 className="font-bungee text-3xl sm:text-4xl text-[#FFDE25] pixel-title-yellow">
            CHOOSE YOUR CHARACTER
          </h2>
          <p className="text-purple-200 font-mono text-xs sm:text-sm mt-1">
            Register your player profile for <span className="text-[#FFDE25] font-black underline">{activeEvent?.name}</span>.
          </p>
        </div>

        <div className="text-right shrink-0 bg-[#0D0518]/50 p-3 rounded-2xl border-2 border-[#0D0518]">
          <span className="font-arcade text-[9px] text-[#FF5FA0] block font-black">REGISTERED</span>
          <span className="font-arcade text-xl text-[#FFDE25] font-black">
            {registeredList.length} PLAYERS
          </span>
        </div>
      </div>

      {/* Confirmation Card if registered */}
      {registeredCard ? (
        <div className="bg-white text-[#0D0518] rounded-3xl border-4 border-[#0D0518] p-8 shadow-pixel-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#28C76F] border-3 border-[#0D0518] shadow-pixel mx-auto flex items-center justify-center text-4xl text-white">
            ✓
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-[#5C2D91] text-white font-arcade text-[10px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm inline-block mb-2">
              CHARACTER CREATED
            </span>
            <h3 className="font-bungee text-3xl text-[#0D0518]">
              REGISTRATION CONFIRMED!
            </h3>
            <p className="text-gray-600 font-mono text-xs mt-1">
              Your player pass is active on the championship leaderboard.
            </p>
          </div>

          {/* Player Badge Styled as Retro Dialogue Pass */}
          <div className="max-w-sm mx-auto bg-[#FFFDF5] border-3 border-[#0D0518] rounded-2xl p-6 shadow-pixel text-left space-y-3">
            <div className="flex items-center justify-between border-b-2 border-[#0D0518] pb-3">
              <span className="font-arcade text-xs text-[#FF5FA0] font-black">PLAYER CARD</span>
              <span className="text-4xl">{registeredCard.avatar}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase font-black block">PLAYER NAME</span>
              <span className="font-display font-black text-2xl text-[#0D0518] tracking-wider">
                {registeredCard.name}
              </span>
            </div>

            <div className="text-xs font-mono font-bold pt-2 border-t border-[#0D0518]/20 text-gray-600">
              Email: {registeredCard.email}
            </div>

            <div className="text-[10px] font-mono text-gray-500">
              Player ID: {registeredCard.id} • Active
            </div>
          </div>

          <button
            onClick={() => {
              setRegisteredCard(null);
              setFormData({ name: '', email: '', avatar: '👾' });
            }}
            className="btn-pixel-yellow text-xs"
          >
            Register Another Participant
          </button>
        </div>
      ) : (
        /* Registration Form */
        <div className="bg-white text-[#0D0518] rounded-3xl border-4 border-[#0D0518] p-6 sm:p-8 shadow-pixel-lg">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs font-mono">
            {/* Character Sprite Selection Row (Screen 5 Tribute) */}
            <div>
              <label className="block text-[#0D0518] mb-2 font-black text-sm">
                1. SELECT YOUR SPRITE / AVATAR
              </label>

              {/* Character selection tiles on pixel grass footing */}
              <div className="bg-[#FAF7EE] p-4 rounded-2xl border-3 border-[#0D0518]">
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                  {avatars.map((av) => (
                    <button
                      type="button"
                      key={av.icon}
                      onClick={() => {
                        soundFx.play('click');
                        setFormData({ ...formData, avatar: av.icon });
                      }}
                      className={`p-3 rounded-2xl flex flex-col items-center justify-center border-3 border-[#0D0518] transition-all ${
                        formData.avatar === av.icon
                          ? 'bg-[#FFDE25] scale-105 shadow-pixel -translate-y-1'
                          : 'bg-white hover:bg-[#FFFDF5]'
                      }`}
                    >
                      <span className="text-3xl mb-1">{av.icon}</span>
                      <span className="text-[9px] font-arcade truncate max-w-full font-black text-[#0D0518]">
                        {formData.avatar === av.icon ? 'READY' : ''}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pixel-grass-strip h-3 w-full mt-3 rounded" />
              </div>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-[#0D0518] mb-1 font-black text-sm">
                  2. FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold focus:outline-none focus:border-[#FF5FA0] text-sm"
                />
              </div>

              <div>
                <label className="block text-[#0D0518] mb-1 font-black text-sm">
                  3. EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="player@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold focus:outline-none focus:border-[#FF5FA0] text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t-3 border-[#0D0518] flex items-center justify-between">
              <span className="text-xs text-gray-500 font-bold">
                ✓ Ready for immediate tournament entry
              </span>

              <button
                type="submit"
                className="btn-pixel-pink flex items-center gap-2"
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
