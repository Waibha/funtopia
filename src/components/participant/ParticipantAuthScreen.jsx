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
  Sparkles,
  Compass,
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
  const [selectedAvatar, setSelectedAvatar] = useState('⚔️');
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
    { icon: '⚔️', name: 'Paladin Champion' },
    { icon: '🧙‍♂️', name: 'Grand Archmage' },
    { icon: '🧝‍♀️', name: 'Verdant Ranger' },
    { icon: '🗡️', name: 'Shadowblade Rogue' },
    { icon: '🦉', name: 'Ancient Druid' },
    { icon: '🐉', name: 'Dragon Rider' },
    { icon: '👑', name: 'High Monarch' },
    { icon: '🦊', name: 'Spirit Fox' },
    { icon: '⚡', name: 'Stormcaller' },
    { icon: '🛡️', name: 'Aegis Sentinel' },
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
      setSuccessMsg(`Welcome to the Kingdom of Madagascar, ${res.participant.name}!`);

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
      setSuccessMsg(`Welcome back to the realm, ${res.participant.name}!`);

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
    <div className="relative min-h-screen bg-[#0A091A] text-slate-100 flex flex-col justify-between selection:bg-[#FFC837] selection:text-[#0A091A] font-sans overflow-x-hidden">
      {/* Background Ambience & Motifs */}
      <AuthArcadeBackground />
      <div className="fixed inset-0 bg-radial-at-t from-emerald-900/15 via-transparent to-[#0A091A]/95 pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 p-4 sm:p-6 flex items-center justify-between max-w-6xl mx-auto w-full select-none">
        <button
          onClick={() => {
            soundFx.play('click');
            navigate('/select-portal');
          }}
          className="btn-fantasy-subtle flex items-center gap-2 text-xs font-cinzel font-bold text-amber-200"
        >
          <ArrowLeft className="w-4 h-4 text-[#FFC837]" />
          <span className="hidden sm:inline">RETURN TO REALM SELECTION</span>
          <span className="sm:hidden">RETURN</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="font-cinzel text-xl sm:text-2xl font-black tracking-widest text-[#FFC837] fantasy-title-gold">
            MADAGASCAR
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 font-cinzel text-[10px] font-bold uppercase border border-emerald-500/40 shadow-fantasy-emerald">
            CHAMPIONS' GATEWAY
          </span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#111928]/95 via-[#0D1322]/95 to-[#080C17]/95 border-2 border-emerald-500/30 shadow-fantasy-card overflow-hidden backdrop-blur-xl animate-fade-in">
          {/* Header Banner */}
          <div className="relative p-6 bg-gradient-to-b from-emerald-950/70 to-slate-900/60 border-b border-emerald-500/20 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400/20 via-emerald-500/20 to-teal-500/20 border-2 border-[#FFC837]/50 shadow-fantasy-gold flex items-center justify-center text-3xl mb-3">
              ⚔️
            </div>
            <h1 className="font-cinzel text-2xl font-black tracking-wider text-[#FFC837] fantasy-title-gold">
              ADVENTURERS' GUILD
            </h1>
            <p className="text-xs font-jakarta text-emerald-200/80 mt-1.5">
              Enter your University Seat Number (USN) & Secret Passkey
            </p>
          </div>

          {/* Mode Tabs: SIGN UP vs SIGN IN */}
          <div className="grid grid-cols-2 p-2 bg-[#090D18]/90 border-b border-white/10 gap-2 select-none">
            <button
              type="button"
              onClick={() => handleTabSwitch('register')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-cinzel text-xs font-bold tracking-wider transition-all ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-[#FFC837] to-[#FF9E1B] text-[#0A091A] font-black shadow-fantasy-gold -translate-y-0.5'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>SIGN UP</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('login')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-cinzel text-xs font-bold tracking-wider transition-all ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-[#FFC837] to-[#FF9E1B] text-[#0A091A] font-black shadow-fantasy-gold -translate-y-0.5'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>SIGN IN</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mx-6 mt-5 p-3 rounded-xl bg-red-950/60 border border-red-500/60 text-red-200 text-xs font-jakarta font-semibold flex items-start gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mx-6 mt-5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs font-jakarta font-semibold flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ============================================================= */}
          {/* 1. SIGN UP FORM (FULL NAME, USN, SECURE PIN)                  */}
          {/* ============================================================= */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 text-xs font-jakarta">
              <div>
                <label className="block text-slate-300 font-cinzel font-bold text-xs uppercase mb-1.5 tracking-wider">
                  CHAMPION NAME *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="e.g. Aethelgard the Swift"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D18] border border-white/15 text-slate-100 font-medium text-sm focus:outline-none focus:border-[#FFC837] focus:ring-1 focus:ring-[#FFC837] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-cinzel font-bold text-xs uppercase mb-1.5 tracking-wider">
                  UNIVERSITY SEAT NUMBER (USN) *
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={registerUsn}
                    onChange={(e) => setRegisterUsn(e.target.value.toUpperCase())}
                    placeholder="e.g. 1RV21CS001"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D18] border border-white/15 text-slate-100 font-mono font-bold text-sm uppercase tracking-wider focus:outline-none focus:border-[#FFC837] focus:ring-1 focus:ring-[#FFC837] transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Your USN acts as your permanent champion sigil on the kingdom leaderboard.
                </p>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-slate-300 font-cinzel font-bold text-xs uppercase mb-1.5 tracking-wider">
                  CHOOSE YOUR HERO CREST
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
                      className={`p-2.5 rounded-xl text-xl border transition-all flex items-center justify-center ${
                        selectedAvatar === av.icon
                          ? 'bg-[#FFC837]/20 border-[#FFC837] shadow-fantasy-gold scale-105'
                          : 'bg-[#090D18] border-white/10 hover:border-white/30'
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
                  <label className="block text-slate-300 font-cinzel font-bold text-xs uppercase mb-1.5 tracking-wider">
                    CREATE PIN *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showRegisterPin ? 'text' : 'password'}
                      required
                      minLength={4}
                      value={registerPin}
                      onChange={(e) => setRegisterPin(e.target.value)}
                      placeholder="4-8 digits"
                      className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#090D18] border border-white/15 text-slate-100 font-mono font-bold text-sm focus:outline-none focus:border-[#FFC837] focus:ring-1 focus:ring-[#FFC837]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPin(!showRegisterPin)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showRegisterPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-cinzel font-bold text-xs uppercase mb-1.5 tracking-wider">
                    CONFIRM PIN *
                  </label>
                  <input
                    type={showRegisterPin ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={registerConfirmPin}
                    onChange={(e) => setRegisterConfirmPin(e.target.value)}
                    placeholder="Repeat PIN"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D18] border border-white/15 text-slate-100 font-mono font-bold text-sm focus:outline-none focus:border-[#FFC837] focus:ring-1 focus:ring-[#FFC837]"
                  />
                </div>
              </div>

              {/* Starting Coins Allocation Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-950/25 border border-amber-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFC837]/20 border border-[#FFC837]/50 flex items-center justify-center shrink-0">
                  <Coins className="w-5 h-5 text-[#FFC837]" />
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="font-cinzel font-bold text-[#FFC837] block">
                    STARTING TRIBUTE: {startingCoins} GOLD TOKENS
                  </span>
                  <span className="text-slate-300">
                    Granted immediately upon enrolment to venture into realm quest trials.
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-fantasy-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-cinzel font-black tracking-wider disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span>SANCTIFYING CHAMPION...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#0A091A]" />
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
            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-xs font-jakarta">
              <div>
                <label className="block text-slate-300 font-cinzel font-bold text-xs uppercase mb-1.5 tracking-wider">
                  UNIVERSITY SEAT NUMBER (USN) *
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={loginUsn}
                    onChange={(e) => setLoginUsn(e.target.value.toUpperCase())}
                    placeholder="e.g. 1RV21CS001"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D18] border border-white/15 text-slate-100 font-mono font-bold text-sm uppercase tracking-wider focus:outline-none focus:border-[#FFC837] focus:ring-1 focus:ring-[#FFC837]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-cinzel font-bold text-xs uppercase mb-1.5 tracking-wider">
                  YOUR SECRET PIN *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showLoginPin ? 'text' : 'password'}
                    required
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    placeholder="Enter your secret 4-digit PIN"
                    className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#090D18] border border-white/15 text-slate-100 font-mono font-bold text-sm focus:outline-none focus:border-[#FFC837] focus:ring-1 focus:ring-[#FFC837]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPin(!showLoginPin)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showLoginPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Security Note */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 flex items-center gap-2.5 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Encrypted passkey verification safeguards your glory on the kingdom chronicles.</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-fantasy-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-cinzel font-black tracking-wider disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span>AUTHENTICATING CHAMPION...</span>
                ) : (
                  <>
                    <Compass className="w-4 h-4 text-[#0A091A]" />
                    <span>SIGN IN & ENTER ARENA</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer mode toggle */}
          <div className="p-4 bg-[#090D18]/90 border-t border-white/10 text-center font-jakarta text-xs text-slate-400">
            {authMode === 'register' ? (
              <p>
                Already sworn into the guild?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  className="text-[#FFC837] underline font-bold hover:text-amber-200 transition-colors"
                >
                  Sign In with your USN & PIN
                </button>
              </p>
            ) : (
              <p>
                New adventurer?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('register')}
                  className="text-[#FFC837] underline font-bold hover:text-amber-200 transition-colors"
                >
                  Register your Champion Account
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Fantasy Realm Footer */}
      <footer className="relative z-10 py-4 px-6 text-center text-xs font-cinzel font-semibold tracking-widest text-slate-400/80 select-none">
        MADAGASCAR — THE LIVING FANTASY REALM & CHAMPIONSHIP KINGDOM
      </footer>
    </div>
  );
}
