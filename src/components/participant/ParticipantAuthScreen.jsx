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
      setSuccessMsg(`Welcome to MADAGASCAR, ${res.participant.name}!`);

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
            MADAGASCAR
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#00F0FF] text-[#0D0518] font-arcade text-[9px] font-black uppercase border-2 border-[#0D0518]">
            ARENA ENTRANCE
          </span>
        </div>
      </header>

      {/* Main Authentication Window */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl shadow-pixel-xl overflow-hidden animate-fade-in">
          {/* Header Banner */}
          <div className="bg-[#40186D] p-5 border-b-4 border-[#0D0518] text-center text-white relative">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel-sm flex items-center justify-center text-3xl mb-2">
              👾
            </div>
            <h1 className="font-bungee text-2xl text-[#FFDE25] pixel-title-yellow">
              PARTICIPANT ARENA
            </h1>
            <p className="text-xs font-mono text-purple-200 mt-1">
              Authenticate with your University Seat Number (USN) & PIN
            </p>
          </div>

          {/* Mode Tabs: SIGN UP vs SIGN IN */}
          <div className="grid grid-cols-2 p-2 bg-[#FAF7EE] border-b-3 border-[#0D0518] gap-2 select-none">
            <button
              type="button"
              onClick={() => handleTabSwitch('register')}
              className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-arcade text-xs font-black tracking-wider transition-all ${
                authMode === 'register'
                  ? 'bg-[#FFDE25] text-[#0D0518] border-3 border-[#0D0518] shadow-pixel-sm -translate-y-0.5'
                  : 'text-gray-600 hover:text-[#0D0518]'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>SIGN UP</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('login')}
              className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-arcade text-xs font-black tracking-wider transition-all ${
                authMode === 'login'
                  ? 'bg-[#FFDE25] text-[#0D0518] border-3 border-[#0D0518] shadow-pixel-sm -translate-y-0.5'
                  : 'text-gray-600 hover:text-[#0D0518]'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>SIGN IN</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mx-6 mt-5 p-3 rounded-xl bg-red-50 border-2 border-red-500 text-red-700 text-xs font-mono font-bold flex items-start gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mx-6 mt-5 p-3 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ============================================================= */}
          {/* 1. SIGN UP FORM (FULL NAME, USN, SECURE PIN)                  */}
          {/* ============================================================= */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 text-xs font-mono">
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
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold text-sm focus:outline-none focus:border-[#FF5FA0]"
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
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-mono font-black text-sm uppercase tracking-wider focus:outline-none focus:border-[#FF5FA0]"
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
                          : 'bg-[#FAF7EE] hover:bg-gray-100'
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
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold text-sm focus:outline-none focus:border-[#FF5FA0]"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold text-sm focus:outline-none focus:border-[#FF5FA0]"
                  />
                </div>
              </div>

              {/* Starting Coins Allocation Notice */}
              <div className="p-3 rounded-2xl bg-[#FFFDF5] border-2 border-[#0D0518] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFDE25] border-2 border-[#0D0518] flex items-center justify-center shrink-0">
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
                    <Sparkles className="w-4 h-4" />
                    <span>CREATE ACCOUNT & ENTER ARENA</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ============================================================= */}
          {/* 2. SIGN IN FORM (USN & SECURE PIN)                            */}
          {/* ============================================================= */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-xs font-mono">
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
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold text-sm focus:outline-none focus:border-[#FF5FA0]"
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

          {/* Footer note */}
          <div className="p-4 bg-[#FAF7EE] border-t-3 border-[#0D0518] text-center font-mono text-[11px] text-gray-600 font-bold">
            {authMode === 'register' ? (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  className="text-purple-700 underline font-black hover:text-[#0D0518]"
                >
                  Sign In with your USN & PIN
                </button>
              </p>
            ) : (
              <p>
                First time player?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('register')}
                  className="text-purple-700 underline font-black hover:text-[#0D0518]"
                >
                  Create your Player Account
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Retro Footer */}
      <footer className="relative z-10 py-4 px-6 text-center text-xs font-mono text-purple-200 select-none">
        MADAGASCAR 16-BIT RETRO CHAMPIONSHIP PLATFORM
      </footer>
    </div>
  );
}
