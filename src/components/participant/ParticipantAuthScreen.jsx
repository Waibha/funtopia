import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Gamepad2,
  Sparkles,
} from 'lucide-react';
import { soundFx } from '../../utilities/soundFx';
import { registerParticipantWithUSN, loginParticipantWithUSN } from '../../services/api/authService';
import AuthArcadeBackground from '../backgrounds/AuthArcadeBackground';

export default function ParticipantAuthScreen({
  onAuthSuccess,
  startingCoins = 5,
  registeredParticipants = [],
  triggerCelebration,
}) {
  const navigate = useNavigate();
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

  // Status feedback
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

  // 1. Handle Registration with USN and PIN
  const handleRegisterSubmit = async (e) => {
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
        existingParticipants: registeredParticipants,
      });

      if (!res.success) {
        soundFx.play('scoreDown');
        setIsSubmitting(false);
        setErrorMsg(res.error || 'Registration failed.');
        return;
      }

      soundFx.play('fanfare');
      if (triggerCelebration) triggerCelebration();
      setSuccessMsg(`Welcome to FUNTOPIA, ${res.participant.name}!`);

      setTimeout(() => {
        if (onAuthSuccess) {
          onAuthSuccess(res.participant, res.session, true); // true = newly registered
        }
      }, 700);
    } catch (err) {
      soundFx.play('scoreDown');
      setIsSubmitting(false);
      setErrorMsg(err.message || 'An error occurred during registration.');
    }
  };

  // 2. Handle Login with USN and PIN
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    soundFx.play('click');

    try {
      const res = await loginParticipantWithUSN({
        usn: loginUsn,
        pin: loginPin,
        participants: registeredParticipants,
      });

      if (!res.success) {
        soundFx.play('scoreDown');
        setIsSubmitting(false);
        setErrorMsg(res.error || 'Sign in failed. Please check your credentials.');
        return;
      }

      soundFx.play('fanfare');
      setSuccessMsg(`Welcome back, ${res.participant.name}!`);

      setTimeout(() => {
        if (onAuthSuccess) {
          onAuthSuccess(res.participant, res.session, false);
        }
      }, 600);
    } catch (err) {
      soundFx.play('scoreDown');
      setIsSubmitting(false);
      setErrorMsg(err.message || 'An error occurred during sign in.');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#300E54] text-white flex flex-col justify-between selection:bg-[#FFDE25] selection:text-[#0D0518] font-sans overflow-x-hidden">
      {/* Background Animation */}
      <AuthArcadeBackground />

      {/* Top Header Bar */}
      <header className="relative z-10 p-4 sm:p-6 flex items-center justify-between max-w-6xl mx-auto w-full select-none">
        <button
          onClick={() => {
            soundFx.play('click');
            navigate('/select-portal');
          }}
          className="btn-pixel-white p-2.5 rounded-xl flex items-center gap-2 text-xs font-arcade font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">RETURN TO PORTALS</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-bungee text-2xl tracking-wider text-[#FFDE25] pixel-title-yellow">
            FUNTOPIA
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#00F0FF] text-[#0D0518] font-arcade text-[9px] font-black uppercase border-2 border-[#0D0518]">
            ARENA ENTRANCE
          </span>
        </div>
      </header>

      {/* Main Authentication Window with Custom Arcade Kiosk Cabinet Silhouette */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-3 sm:p-6 py-6 sm:py-8">
        <div className="w-full max-w-lg transition-all duration-300 hover:-translate-y-1">
          {/* ========================================================================= */}
          {/* ARCADE CABINET OUTER CHASSIS                                              */}
          {/* Features custom layered borders, decorative corner rivets, and CRT bezel  */}
          {/* ========================================================================= */}
          <div className="relative bg-[#200B3B] text-[#0D0518] border-4 border-[#0D0518] rounded-[2rem] sm:rounded-[2.5rem] shadow-[10px_14px_0px_#0D0518] overflow-hidden p-2.5 sm:p-4">
            {/* Top Corner Metallic Rivets */}
            <div className="absolute top-2.5 left-3 text-[#FFDE25] text-xs font-mono select-none pointer-events-none opacity-80">✦</div>
            <div className="absolute top-2.5 right-3 text-[#FFDE25] text-xs font-mono select-none pointer-events-none opacity-80">✦</div>
            <div className="absolute bottom-2.5 left-3 text-[#FFDE25] text-xs font-mono select-none pointer-events-none opacity-80">✦</div>
            <div className="absolute bottom-2.5 right-3 text-[#FFDE25] text-xs font-mono select-none pointer-events-none opacity-80">✦</div>

            {/* Cabinet Crown Marquee */}
            <div className="bg-[#3D1466] border-3 border-[#0D0518] rounded-2xl p-4 mb-3 text-center text-white relative overflow-hidden shadow-pixel-sm">
              {/* Background Marquee Grid Glow */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#FFDE25 1.5px, transparent 1.5px)`,
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Status Header Strip */}
              <div className="flex items-center justify-between mb-2 text-[9px] font-arcade font-black select-none">
                <span className="flex items-center gap-1.5 text-[#28C76F] bg-[#11041F] px-2.5 py-0.5 rounded-full border border-[#28C76F]/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#28C76F] animate-ping" />
                  KIOSK ONLINE
                </span>
                <span className="text-[#00F0FF] tracking-wider hidden sm:inline">
                  FUNTOPIA ROM v3.2
                </span>
                <span className="text-[#FFDE25] bg-[#11041F] px-2 py-0.5 rounded border border-[#FFDE25]/40 font-mono">
                  1P READY
                </span>
              </div>

              {/* Marquee Title Plate */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel-sm flex items-center justify-center text-2xl shrink-0 hover:rotate-6 transition-transform">
                  👾
                </div>
                <div className="text-left">
                  <h1 className="font-bungee text-2xl sm:text-3xl text-[#FFDE25] pixel-title-yellow leading-tight">
                    PARTICIPANT ARENA
                  </h1>
                  <p className="text-[10px] font-mono text-purple-200 font-bold uppercase tracking-wider">
                    Competitor Card Access & Registration
                  </p>
                </div>
              </div>
            </div>

            {/* Mode Switcher: Dual Beveled Arcade Push Buttons */}
            <div className="grid grid-cols-2 p-1.5 bg-[#140526] rounded-2xl border-3 border-[#0D0518] gap-2 mb-3 select-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
              <button
                type="button"
                onClick={() => handleTabSwitch('register')}
                className={`flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl font-arcade text-xs font-black tracking-wider transition-all duration-150 ${
                  authMode === 'register'
                    ? 'bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518] shadow-pixel-sm -translate-y-0.5 scale-[1.02]'
                    : 'bg-[#250C42] text-purple-200 hover:text-white hover:bg-[#34115E]'
                }`}
              >
                <UserPlus className="w-4 h-4 text-[#FF5FA0]" />
                <span>SIGN UP</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch('login')}
                className={`flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl font-arcade text-xs font-black tracking-wider transition-all duration-150 ${
                  authMode === 'login'
                    ? 'bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518] shadow-pixel-sm -translate-y-0.5 scale-[1.02]'
                    : 'bg-[#250C42] text-purple-200 hover:text-white hover:bg-[#34115E]'
                }`}
              >
                <LogIn className="w-4 h-4 text-[#00F0FF]" />
                <span>SIGN IN</span>
              </button>
            </div>

            {/* ============================================================= */}
            {/* INNER CRT MONITOR TERMINAL SCREEN (HIGH CONTRAST FORM BEZEL)  */}
            {/* ============================================================= */}
            <div className="bg-[#FFFDF7] text-[#0D0518] border-4 border-[#0D0518] rounded-2xl shadow-[inset_0_3px_10px_rgba(0,0,0,0.08)] overflow-hidden">
              {/* Feedback Alerts */}
              {errorMsg && (
                <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-red-50 border-2 border-red-500 text-red-700 text-xs font-mono font-bold flex items-start gap-2 animate-shake">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* 1. SIGN UP FORM */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="p-4 sm:p-6 space-y-4 text-xs font-mono">
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
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold text-sm focus:outline-none focus:border-[#FF5FA0] focus:bg-white transition-colors"
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
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-mono font-black text-sm uppercase tracking-wider focus:outline-none focus:border-[#FF5FA0] focus:bg-white transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 font-bold">
                      Your USN is your permanent player tag for tournament scores.
                    </p>
                  </div>

                  {/* Avatar Selector */}
                  <div>
                    <label className="block text-[#0D0518] font-black text-xs uppercase mb-1.5">
                      CHOOSE YOUR AVATAR
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
                          className={`p-2 rounded-xl text-xl border-2 border-[#0D0518] transition-all flex items-center justify-center ${
                            selectedAvatar === av.icon
                              ? 'bg-[#FFDE25] shadow-pixel-sm scale-110 -translate-y-0.5'
                              : 'bg-[#FAF7EE] hover:bg-gray-100 hover:scale-105'
                          }`}
                          title={av.name}
                        >
                          {av.icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Secure PIN */}
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
                          className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold text-sm focus:outline-none focus:border-[#FF5FA0] focus:bg-white transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPin(!showRegisterPin)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                        >
                          {showRegisterPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#0D0518] font-black text-xs uppercase mb-1">
                        CONFIRM PIN *
                      </label>
                      <input
                        type={showRegisterPin ? 'text' : 'password'}
                        required
                        minLength={4}
                        value={registerConfirmPin}
                        onChange={(e) => setRegisterConfirmPin(e.target.value)}
                        placeholder="Repeat PIN"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold text-sm focus:outline-none focus:border-[#FF5FA0] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Starting Coins Allocation Notice */}
                  <div className="p-3 rounded-2xl bg-[#FFFDF5] border-2 border-[#0D0518] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FFDE25] border-2 border-[#0D0518] flex items-center justify-center shrink-0 shadow-pixel-sm">
                      <Coins className="w-5 h-5 text-[#0D0518]" />
                    </div>
                    <div className="text-[11px] leading-tight">
                      <span className="font-black text-[#0D0518] block">
                        WELCOME BONUS: {startingCoins} COINS
                      </span>
                      <span className="text-gray-600">
                        Credited to your balance immediately to play championship games.
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-pixel-yellow w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-arcade font-black tracking-wider disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? (
                      <span>REGISTERING PLAYER...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#FF5FA0]" />
                        <span>SIGN UP & ENTER ARENA</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* 2. SIGN IN FORM */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="p-4 sm:p-6 space-y-4 text-xs font-mono">
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
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-mono font-black text-sm uppercase tracking-wider focus:outline-none focus:border-[#FF5FA0] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#0D0518] font-black text-xs uppercase mb-1">
                      YOUR SECURE PIN *
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showLoginPin ? 'text' : 'password'}
                        required
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value)}
                        placeholder="Enter your 4-digit PIN"
                        className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold text-sm focus:outline-none focus:border-[#FF5FA0] focus:bg-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPin(!showLoginPin)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                      >
                        {showLoginPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="p-3 rounded-2xl bg-purple-50 border-2 border-purple-200 text-purple-900 flex items-center gap-2.5 text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>PIN verification prevents impersonation and protects your score records.</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-pixel-yellow w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-arcade font-black tracking-wider disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? (
                      <span>AUTHENTICATING...</span>
                    ) : (
                      <>
                        <Gamepad2 className="w-4 h-4" />
                        <span>SIGN IN & ENTER ARENA</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Cabinet Lower Deck / Speaker Grille & Coin Slot Bezel */}
            <div className="mt-3 bg-[#17052C] border-3 border-[#0D0518] rounded-2xl p-2.5 flex items-center justify-between text-purple-200 text-[10px] font-mono select-none">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFDE25] border border-[#0D0518]" />
                <span className="font-bold">INSERT 25¢ / USN</span>
              </div>
              <div className="flex items-center gap-1 opacity-40">
                <span className="w-4 h-1 rounded-full bg-[#C084FC]" />
                <span className="w-4 h-1 rounded-full bg-[#C084FC]" />
                <span className="w-4 h-1 rounded-full bg-[#C084FC]" />
              </div>
              <div className="flex items-center gap-1 text-[#28C76F] font-bold">
                <ShieldCheck className="w-3 h-3" />
                <span>SHA-256 PIN</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Retro Footer */}
      <footer className="relative z-10 py-4 px-6 text-center text-xs font-mono text-purple-200 select-none">
        FUNTOPIA 16-BIT RETRO CHAMPIONSHIP PLATFORM
      </footer>
    </div>
  );
}
