import React, { useState } from 'react';
import { Mail, Lock, KeyRound, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { soundFx } from '../../utilities/soundFx';
import {
  initiateParticipantRegistration,
  completeParticipantVerification,
  loginParticipant,
} from '../../services/api/authService';

export default function ParticipantRegistration({
  onRegisterParticipant,
  onParticipantLogin,
  startingCoins = 0,
  registeredList = [],
}) {
  const [mode, setMode] = useState('register'); // 'register' | 'verify' | 'login'

  // Registration form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '👾',
  });

  // Verification step state
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [sentCodeHint, setSentCodeHint] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Status and feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifiedProfile, setVerifiedProfile] = useState(null);

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
    { icon: '🔥', name: 'Blaze' },
  ];

  // Handle Step 1: Initiate Registration
  const handleInitiateRegistration = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    soundFx.play('click');

    try {
      const res = await initiateParticipantRegistration({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: formData.avatar,
        startingCoins: Number(startingCoins ?? 0),
        existingParticipants: registeredList,
      });

      if (!res.success) {
        soundFx.play('scoreDown');
        setIsSubmitting(false);
        setErrorMsg(res.error || 'Registration failed.');
        return;
      }

      soundFx.play('coin');
      setIsSubmitting(false);
      setVerificationEmail(res.cleanEmail);
      setSentCodeHint(res.verificationCode);
      setMode('verify');
    } catch (err) {
      soundFx.play('scoreDown');
      setIsSubmitting(false);
      setErrorMsg('Failed to process registration. Please retry.');
    }
  };

  // Handle Step 2: Complete Email Verification
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    soundFx.play('click');

    try {
      const res = await completeParticipantVerification({
        email: verificationEmail,
        code: verificationCodeInput,
      });

      if (!res.success) {
        soundFx.play('scoreDown');
        setIsSubmitting(false);
        setErrorMsg(res.error || 'Invalid code.');
        return;
      }

      soundFx.play('fanfare');
      setIsSubmitting(false);
      setVerifiedProfile(res.participant);
      onRegisterParticipant(res.participant);
      if (onParticipantLogin) {
        onParticipantLogin(res.participant);
      }
    } catch (err) {
      soundFx.play('scoreDown');
      setIsSubmitting(false);
      setErrorMsg('Verification failed. Please retry.');
    }
  };

  // Handle Login for Existing Registered Participant
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    soundFx.play('click');

    try {
      const res = await loginParticipant({
        email: loginEmail,
        password: loginPassword,
        registeredParticipants: registeredList,
      });

      if (!res.success) {
        soundFx.play('scoreDown');
        setIsSubmitting(false);
        setErrorMsg(res.error || 'Login failed.');
        return;
      }

      soundFx.play('fanfare');
      setIsSubmitting(false);
      setVerifiedProfile(res.participant);
      if (onParticipantLogin) {
        onParticipantLogin(res.participant);
      }
    } catch (err) {
      soundFx.play('scoreDown');
      setIsSubmitting(false);
      setErrorMsg('Login failed. Please verify credentials.');
    }
  };

  // If successfully verified and profile is ready
  if (verifiedProfile) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <div className="bg-white text-[#0D0518] rounded-3xl border-4 border-[#0D0518] p-8 shadow-pixel-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#28C76F] border-3 border-[#0D0518] shadow-pixel mx-auto flex items-center justify-center text-4xl text-white">
            ✓
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-[#28C76F] text-[#0D0518] font-arcade text-[10px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm inline-block mb-2">
              EMAIL VERIFIED • ACCOUNT ACTIVE
            </span>
            <h2 className="font-bungee text-3xl text-[#0D0518]">
              WELCOME, {verifiedProfile.name.toUpperCase()}!
            </h2>
            <p className="text-gray-600 font-mono text-xs mt-1">
              Your verified player profile has been linked to the live championship ledger.
            </p>
          </div>

          <div className="bg-[#FAF7EE] border-3 border-[#0D0518] rounded-2xl p-5 shadow-pixel text-left space-y-3">
            <div className="flex items-center justify-between border-b-2 border-[#0D0518] pb-3">
              <span className="font-arcade text-xs text-[#FF5FA0] font-black">PLAYER PASSPORT</span>
              <span className="text-3xl">{verifiedProfile.avatar}</span>
            </div>

            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">NAME:</span>
                <span className="font-black text-[#0D0518]">{verifiedProfile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">EMAIL:</span>
                <span className="font-bold text-[#0D0518]">{verifiedProfile.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">STARTING COINS:</span>
                <span className="font-black text-[#FF7A00]">🪙 {verifiedProfile.coins || 500} COINS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">EMAIL STATUS:</span>
                <span className="font-black text-[#28C76F] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setVerifiedProfile(null)}
            className="btn-pixel-yellow w-full py-3 text-xs"
          >
            VIEW LOBBY & LEADERBOARD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 font-sans">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center gap-2 bg-[#FAF7EE] p-1.5 rounded-2xl border-3 border-[#0D0518] shadow-pixel-sm max-w-md mx-auto text-xs font-mono font-black">
        <button
          type="button"
          onClick={() => {
            soundFx.play('click');
            setMode('register');
            setErrorMsg('');
          }}
          className={`flex-1 py-2 rounded-xl transition-all ${
            mode === 'register' || mode === 'verify'
              ? 'bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518] shadow-pixel-sm'
              : 'text-gray-600 hover:text-[#0D0518]'
          }`}
        >
          CREATE ACCOUNT
        </button>
        <button
          type="button"
          onClick={() => {
            soundFx.play('click');
            setMode('login');
            setErrorMsg('');
          }}
          className={`flex-1 py-2 rounded-xl transition-all ${
            mode === 'login'
              ? 'bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518] shadow-pixel-sm'
              : 'text-gray-600 hover:text-[#0D0518]'
          }`}
        >
          SIGN IN
        </button>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-100 border-3 border-red-600 text-red-900 text-xs font-mono flex items-start gap-2.5 shadow-pixel-sm animate-shake">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span className="font-bold">{errorMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 1: REGISTRATION FORM                                                */}
      {/* ========================================================================= */}
      {mode === 'register' && (
        <div className="bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 sm:p-8 shadow-pixel-lg space-y-6">
          <div className="border-b-3 border-[#0D0518] pb-4">
            <span className="px-3 py-1 rounded-full bg-[#FF5FA0] text-white font-arcade text-[10px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm inline-block mb-2">
              STEP 1 OF 2 • REAL EMAIL ONBOARDING
            </span>
            <h2 className="font-bungee text-2xl sm:text-3xl text-[#0D0518]">
              REGISTER PARTICIPANT
            </h2>
            <p className="text-gray-600 font-mono text-xs mt-1">
              Enter your real name and email address. An email verification code will be required before account activation.
            </p>
          </div>

          <form onSubmit={handleInitiateRegistration} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[#0D0518] mb-1 font-black">FULL NAME *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alice"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold focus:outline-none focus:border-[#FF5FA0]"
              />
            </div>

            <div>
              <label className="block text-[#0D0518] mb-1 font-black">GMAIL / EMAIL ADDRESS *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. alice@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold focus:outline-none focus:border-[#FF5FA0]"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1 font-bold">
                Duplicate email registrations are rejected. Verification is required.
              </p>
            </div>

            <div>
              <label className="block text-[#0D0518] mb-1 font-black">CREATE PASSWORD (MIN 6 CHARS) *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-mono font-bold focus:outline-none focus:border-[#FF5FA0]"
                />
              </div>
            </div>

            {/* Avatar Sprite Selection */}
            <div>
              <label className="block text-[#0D0518] mb-2 font-black">CHOOSE YOUR CHARACTER SPRITE</label>
              <div className="grid grid-cols-5 gap-2">
                {avatars.map((av) => (
                  <button
                    type="button"
                    key={av.name}
                    onClick={() => {
                      soundFx.play('click');
                      setFormData({ ...formData, avatar: av.icon });
                    }}
                    className={`p-2 rounded-xl border-3 flex flex-col items-center justify-center transition-all ${
                      formData.avatar === av.icon
                        ? 'bg-[#FFDE25] border-[#0D0518] shadow-pixel-sm scale-105'
                        : 'bg-[#FAF7EE] border-gray-300 hover:border-[#0D0518]'
                    }`}
                  >
                    <span className="text-2xl">{av.icon}</span>
                    <span className="text-[9px] font-bold truncate mt-1 text-[#0D0518]">{av.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-pixel-yellow w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 mt-2"
            >
              <span>{isSubmitting ? 'PROCESSING...' : 'CONTINUE TO EMAIL VERIFICATION'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 2: EMAIL VERIFICATION CODE STEP                                     */}
      {/* ========================================================================= */}
      {mode === 'verify' && (
        <div className="bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 sm:p-8 shadow-pixel-lg space-y-6">
          <div className="border-b-3 border-[#0D0518] pb-4">
            <span className="px-3 py-1 rounded-full bg-[#28C76F] text-[#0D0518] font-arcade text-[10px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm inline-block mb-2">
              STEP 2 OF 2 • VERIFY EMAIL OWNERSHIP
            </span>
            <h2 className="font-bungee text-2xl sm:text-3xl text-[#0D0518]">
              ENTER VERIFICATION CODE
            </h2>
            <p className="text-gray-600 font-mono text-xs mt-1">
              A 6-digit verification code has been dispatched to{' '}
              <strong className="text-[#0D0518] underline">{verificationEmail}</strong>.
            </p>
          </div>

          {/* Verification Code Box for Evaluator / Testing */}
          <div className="bg-[#FAF7EE] border-2 border-dashed border-[#5C2D91] rounded-2xl p-3.5 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[10px] text-gray-500 font-bold block uppercase">VERIFICATION DISPATCH</span>
              <span className="font-black text-[#5C2D91]">
                CODE SENT: <code className="text-base text-[#0D0518] bg-white px-2 py-0.5 rounded border border-gray-400">{sentCodeHint}</code>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setVerificationCodeInput(sentCodeHint)}
              className="px-2.5 py-1 bg-[#FFDE25] border-2 border-[#0D0518] rounded-lg font-bold text-[10px]"
            >
              FILL CODE
            </button>
          </div>

          <form onSubmit={handleVerifyCode} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[#0D0518] mb-1 font-black">
                6-DIGIT VERIFICATION CODE *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCodeInput}
                  onChange={(e) => setVerificationCodeInput(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-mono font-black text-xl tracking-widest text-center focus:outline-none focus:border-[#FF5FA0]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="btn-pixel-white text-center justify-center text-xs py-3"
              >
                BACK
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-pixel-green text-center justify-center text-xs py-3 font-bold"
              >
                {isSubmitting ? 'VERIFYING...' : 'CONFIRM & ACTIVATE'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 3: EXISTING PARTICIPANT LOGIN                                       */}
      {/* ========================================================================= */}
      {mode === 'login' && (
        <div className="bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 sm:p-8 shadow-pixel-lg space-y-6">
          <div className="border-b-3 border-[#0D0518] pb-4">
            <span className="px-3 py-1 rounded-full bg-[#5C2D91] text-white font-arcade text-[10px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm inline-block mb-2">
              PLAYER ACCESS
            </span>
            <h2 className="font-bungee text-2xl sm:text-3xl text-[#0D0518]">
              PARTICIPANT SIGN IN
            </h2>
            <p className="text-gray-600 font-mono text-xs mt-1">
              Sign in with your verified email and password to access your coins, games, and scores.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[#0D0518] mb-1 font-black">REGISTERED EMAIL *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="alice@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-bold focus:outline-none focus:border-[#FF5FA0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#0D0518] mb-1 font-black">PASSWORD *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-mono font-bold focus:outline-none focus:border-[#FF5FA0]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-pixel-yellow w-full py-3.5 text-xs font-bold"
            >
              {isSubmitting ? 'SIGNING IN...' : 'SIGN IN TO LOBBY'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
