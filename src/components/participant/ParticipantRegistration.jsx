import React, { useState } from 'react';
import {
  UserPlus,
  LogIn,
  ShieldCheck,
  KeyRound,
  User,
  Hash,
  Eye,
  EyeOff,
  Coins,
  AlertTriangle,
  CheckCircle2,
  Gamepad2,
  Sparkles,
} from 'lucide-react';
import { soundFx } from '../../utilities/soundFx';
import { registerParticipantWithUSN, loginParticipantWithUSN } from '../../services/api/authService';

export default function ParticipantRegistration({
  onRegisterParticipant,
  onParticipantLogin,
  startingCoins = 5,
  registeredList = [],
}) {
  const [authMode, setAuthMode] = useState('register'); // 'register' | 'login'

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerUsn, setRegisterUsn] = useState('');
  const [registerPin, setRegisterPin] = useState('');
  const [registerConfirmPin, setRegisterConfirmPin] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👾');
  const [showRegisterPin, setShowRegisterPin] = useState(false);

  // Login form state
  const [loginUsn, setLoginUsn] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [showLoginPin, setShowLoginPin] = useState(false);

  // Status and feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    { icon: '🔥', name: 'Blaze' },
  ];

  const handleTabSwitch = (mode) => {
    soundFx.play('switch');
    setAuthMode(mode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (registerPin !== registerConfirmPin) {
      soundFx.play('scoreDown');
      setErrorMsg('PINs do not match! Please verify your secure PIN.');
      return;
    }

    setIsSubmitting(true);
    soundFx.play('click');

    try {
      const res = await registerParticipantWithUSN({
        name: registerName,
        usn: registerUsn,
        pin: registerPin,
        avatar: selectedAvatar,
        startingCoins,
        existingParticipants: registeredList,
      });

      if (!res.success) {
        soundFx.play('scoreDown');
        setIsSubmitting(false);
        setErrorMsg(res.error || 'Registration failed.');
        return;
      }

      soundFx.play('fanfare');
      setSuccessMsg(`Welcome to FUNTOPIA, ${res.participant.name}!`);

      if (onRegisterParticipant) {
        onRegisterParticipant(res.participant);
      }
      if (onParticipantLogin) {
        onParticipantLogin(res.participant);
      }
    } catch (err) {
      soundFx.play('scoreDown');
      setIsSubmitting(false);
      setErrorMsg(err.message || 'An error occurred during registration.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    soundFx.play('click');

    try {
      const res = await loginParticipantWithUSN({
        usn: loginUsn,
        pin: loginPin,
        participants: registeredList,
      });

      if (!res.success) {
        soundFx.play('scoreDown');
        setIsSubmitting(false);
        setErrorMsg(res.error || 'Sign in failed.');
        return;
      }

      soundFx.play('fanfare');
      setSuccessMsg(`Welcome back, ${res.participant.name}!`);

      if (onParticipantLogin) {
        onParticipantLogin(res.participant);
      }
    } catch (err) {
      soundFx.play('scoreDown');
      setIsSubmitting(false);
      setErrorMsg(err.message || 'An error occurred during sign in.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl shadow-pixel-xl overflow-hidden animate-fade-in font-sans">
      <div className="bg-[#40186D] p-5 border-b-4 border-[#0D0518] text-center text-white relative">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel-sm flex items-center justify-center text-2xl mb-2">
          👾
        </div>
        <h2 className="font-bungee text-2xl text-[#FFDE25] pixel-title-yellow">
          PLAYER ACCESS
        </h2>
        <p className="text-xs font-mono text-purple-200 mt-1">
          Authenticate using your University Seat Number (USN) & PIN
        </p>
      </div>

      <div className="grid grid-cols-2 p-2 bg-[#FAF7EE] border-b-3 border-[#0D0518] gap-2 select-none">
        <button
          type="button"
          onClick={() => handleTabSwitch('register')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl font-arcade text-xs font-black tracking-wider transition-all ${
            authMode === 'register'
              ? 'bg-[#FFDE25] text-[#0D0518] border-3 border-[#0D0518] shadow-pixel-sm'
              : 'text-gray-600 hover:text-[#0D0518]'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>SIGN UP</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch('login')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl font-arcade text-xs font-black tracking-wider transition-all ${
            authMode === 'login'
              ? 'bg-[#FFDE25] text-[#0D0518] border-3 border-[#0D0518] shadow-pixel-sm'
              : 'text-gray-600 hover:text-[#0D0518]'
          }`}
        >
          <LogIn className="w-4 h-4" />
          <span>SIGN IN</span>
        </button>
      </div>

      {errorMsg && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border-2 border-red-500 text-red-700 text-xs font-mono font-bold flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {authMode === 'register' ? (
        <form onSubmit={handleRegister} className="p-6 space-y-4 text-xs font-mono">
          <div>
            <label className="block text-[#0D0518] font-black text-xs uppercase mb-1">
              FULL NAME *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold text-sm focus:outline-none focus:border-[#FF5FA0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#0D0518] font-black text-xs uppercase mb-1">
              UNIVERSITY SEAT NUMBER (USN) *
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={registerUsn}
                onChange={(e) => setRegisterUsn(e.target.value.toUpperCase())}
                placeholder="e.g. 1RV21CS001"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-mono font-black text-sm uppercase tracking-wider focus:outline-none focus:border-[#FF5FA0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#0D0518] font-black text-xs uppercase mb-1.5">
              CHOOSE AVATAR
            </label>
            <div className="grid grid-cols-5 gap-2">
              {avatars.map((av) => (
                <button
                  key={av.icon}
                  type="button"
                  onClick={() => {
                    soundFx.play('click');
                    setSelectedAvatar(av.icon);
                  }}
                  className={`p-2 rounded-xl text-lg border-2 border-[#0D0518] transition-all flex items-center justify-center ${
                    selectedAvatar === av.icon
                      ? 'bg-[#FFDE25] shadow-pixel-sm scale-110'
                      : 'bg-[#FAF7EE] hover:bg-gray-100'
                  }`}
                >
                  {av.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#0D0518] font-black text-xs uppercase mb-1">
                CREATE PIN *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showRegisterPin ? 'text' : 'password'}
                  required
                  minLength={4}
                  value={registerPin}
                  onChange={(e) => setRegisterPin(e.target.value)}
                  placeholder="4-8 digits"
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold text-sm focus:outline-none focus:border-[#FF5FA0]"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPin(!showRegisterPin)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showRegisterPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#0D0518] font-black text-xs uppercase mb-1">
                REPEAT PIN *
              </label>
              <input
                type={showRegisterPin ? 'text' : 'password'}
                required
                minLength={4}
                value={registerConfirmPin}
                onChange={(e) => setRegisterConfirmPin(e.target.value)}
                placeholder="Repeat PIN"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold text-sm focus:outline-none focus:border-[#FF5FA0]"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FFFDF5] border-2 border-[#0D0518] flex items-center gap-3">
            <span className="text-xl">🪙</span>
            <div className="text-[11px] leading-tight">
              <span className="font-black text-[#0D0518] block">
                WELCOME BONUS: {startingCoins} COINS
              </span>
              <span className="text-gray-600">
                Credited automatically to join games.
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-pixel-yellow w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-arcade font-black tracking-wider disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>CREATE PLAYER ACCOUNT</span>
          </button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="p-6 space-y-4 text-xs font-mono">
          <div>
            <label className="block text-[#0D0518] font-black text-xs uppercase mb-1">
              UNIVERSITY SEAT NUMBER (USN) *
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={loginUsn}
                onChange={(e) => setLoginUsn(e.target.value.toUpperCase())}
                placeholder="e.g. 1RV21CS001"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-mono font-black text-sm uppercase tracking-wider focus:outline-none focus:border-[#FF5FA0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#0D0518] font-black text-xs uppercase mb-1">
              SECURE PIN *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showLoginPin ? 'text' : 'password'}
                required
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value)}
                placeholder="Enter your PIN"
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold text-sm focus:outline-none focus:border-[#FF5FA0]"
              />
              <button
                type="button"
                onClick={() => setShowLoginPin(!showLoginPin)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showLoginPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50 border-2 border-purple-200 text-purple-900 flex items-center gap-2 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
            <span>PIN verification prevents impersonation.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-pixel-yellow w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-arcade font-black tracking-wider disabled:opacity-50"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>SIGN IN & ENTER ARENA</span>
          </button>
        </form>
      )}
    </div>
  );
}
