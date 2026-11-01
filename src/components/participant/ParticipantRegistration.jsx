import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  Info,
} from 'lucide-react';
import { soundFx } from '../../utilities/soundFx';
import {
  initiateParticipantRegistration,
  completeParticipantVerification,
  resendParticipantVerification,
  loginParticipant,
} from '../../services/api/authService';
import { supabase, supabaseConfig } from '../../services/supabaseClient';

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
  const [resendCooldown, setResendCooldown] = useState(0);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Status and feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verifiedProfile, setVerifiedProfile] = useState(null);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Listen to Supabase Auth State Change for email confirmation link clicks
  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user?.email_confirmed_at) {
        const user = session.user;
        const participant = {
          id: user.id,
          name: user.user_metadata?.name || 'Verified Player',
          email: user.email,
          avatar: user.user_metadata?.avatar || '👾',
          coins: typeof user.user_metadata?.startingCoins === 'number'
            ? user.user_metadata.startingCoins
            : Number(startingCoins ?? 0),
          isEmailVerified: true,
          registeredAt: new Date().toISOString(),
        };
        soundFx.play('fanfare');
        setVerifiedProfile(participant);
        if (onRegisterParticipant) onRegisterParticipant(participant);
        if (onParticipantLogin) onParticipantLogin(participant);
      }
    });

    return () => subscription?.unsubscribe();
  }, [onRegisterParticipant, onParticipantLogin, startingCoins]);

  // Diverse pixel adventure character sprites
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

  // Handle Step 1: Initiate Real Registration via Supabase
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
      setSuccessMsg(res.message || `An actual verification email has been dispatched to ${res.cleanEmail}.`);
      setResendCooldown(60);
      setMode('verify');
    } catch (err) {
      soundFx.play('scoreDown');
      setIsSubmitting(false);
      setErrorMsg('Failed to process registration. Please retry.');
    }
  };

  // Handle Step 2: Complete Email Verification with Real OTP / Confirmation
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    soundFx.play('click');

    try {
      const res = await completeParticipantVerification({
        email: verificationEmail,
        code: verificationCodeInput,
        startingCoins: Number(startingCoins ?? 0),
      });

      if (!res.success) {
        soundFx.play('scoreDown');
        setIsSubmitting(false);
        setErrorMsg(res.error || 'Verification failed. Code may be invalid or expired.');
        return;
      }

      soundFx.play('fanfare');
      setIsSubmitting(false);
      setVerifiedProfile(res.participant);
      if (onRegisterParticipant) {
        onRegisterParticipant(res.participant);
      }
      if (onParticipantLogin) {
        onParticipantLogin(res.participant);
      }
    } catch (err) {
      soundFx.play('scoreDown');
      setIsSubmitting(false);
      setErrorMsg('Verification failed. Please retry.');
    }
  };

  // Handle Resend Verification Email
  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setErrorMsg('');
    soundFx.play('click');

    try {
      const res = await resendParticipantVerification({ email: verificationEmail });
      if (!res.success) {
        soundFx.play('scoreDown');
        setErrorMsg(res.error || 'Failed to resend verification email.');
      } else {
        soundFx.play('coin');
        setSuccessMsg(res.message || 'Verification email resent! Please check your inbox.');
        setResendCooldown(60);
      }
    } catch (err) {
      soundFx.play('scoreDown');
      setErrorMsg('Error resending email. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  // Handle Login for Existing Registered Participant
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
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
        if (res.unconfirmed) {
          setVerificationEmail(res.email || loginEmail);
          setMode('verify');
        }
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
              REAL EMAIL CONFIRMED • ACCOUNT ACTIVE
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
              <span className="font-arcade text-xs text-[#FF5FA0] font-black">PLAYER IDENTITY PASSPORT</span>
              <span className="text-3xl">{verifiedProfile.avatar}</span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">NAME:</span>
                <span className="font-black text-[#0D0518]">{verifiedProfile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">EMAIL:</span>
                <span className="font-bold text-[#0D0518]">{verifiedProfile.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">STARTING BALANCE:</span>
                <span className="font-black text-[#FF7A00]">🪙 {Number(verifiedProfile.coins ?? 0)} COINS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">EMAIL VERIFICATION:</span>
                <span className="font-black text-[#28C76F] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Confirmed via Supabase Auth
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setVerifiedProfile(null)}
            className="btn-pixel-yellow w-full py-3 text-xs"
          >
            ENTER CHAMPIONSHIP LOBBY
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
            setSuccessMsg('');
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
            setSuccessMsg('');
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

      {/* Supabase Connection Status Indicator */}
      {!supabaseConfig.isConfigured && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border-3 border-amber-500 text-amber-950 text-xs font-mono flex items-start gap-2.5 shadow-pixel-sm">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-black block">LIVE EMAIL DISPATCH NOT CONFIGURED:</span>
            <span>
              Real Gmail delivery requires Supabase credentials (<code className="bg-amber-200/60 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-amber-200/60 px-1 rounded">VITE_SUPABASE_ANON_KEY</code>) configured in <code className="bg-amber-200/60 px-1 rounded">.env</code> with an enabled SMTP provider.
            </span>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-100 border-3 border-red-600 text-red-900 text-xs font-mono flex items-start gap-2.5 shadow-pixel-sm animate-shake">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span className="font-bold">{errorMsg}</span>
        </div>
      )}

      {/* Success Alert */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-green-100 border-3 border-green-600 text-green-900 text-xs font-mono flex items-start gap-2.5 shadow-pixel-sm">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 1: REGISTRATION FORM                                                */}
      {/* ========================================================================= */}
      {mode === 'register' && (
        <div className="bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 sm:p-8 shadow-pixel-lg space-y-6">
          <div className="border-b-3 border-[#0D0518] pb-4">
            <span className="px-3 py-1 rounded-full bg-[#FF5FA0] text-white font-arcade text-[10px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm inline-block mb-2">
              STEP 1 OF 2 • REAL GMAIL / EMAIL REGISTRATION
            </span>
            <h2 className="font-bungee text-2xl sm:text-3xl text-[#0D0518]">
              REGISTER PARTICIPANT
            </h2>
            <p className="text-gray-600 font-mono text-xs mt-1">
              Enter your real name and verified email address. An actual verification email will be dispatched to your inbox.
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
                You will need to open your email inbox to verify ownership before accessing the platform.
              </p>
            </div>

            <div>
              <label className="block text-[#0D0518] mb-1 font-black">CREATE PASSWORD (MIN 6 CHARACTERS) *</label>
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
              <span>{isSubmitting ? 'DISPATCHING EMAIL...' : 'DISPATCH VERIFICATION EMAIL'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 2: REAL EMAIL VERIFICATION CODE / CONFIRMATION STEP                 */}
      {/* ========================================================================= */}
      {mode === 'verify' && (
        <div className="bg-white text-[#0D0518] border-4 border-[#0D0518] rounded-3xl p-6 sm:p-8 shadow-pixel-lg space-y-6">
          <div className="border-b-3 border-[#0D0518] pb-4">
            <span className="px-3 py-1 rounded-full bg-[#28C76F] text-[#0D0518] font-arcade text-[10px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm inline-block mb-2">
              STEP 2 OF 2 • CHECK YOUR EMAIL INBOX
            </span>
            <h2 className="font-bungee text-2xl sm:text-3xl text-[#0D0518]">
              VERIFY YOUR EMAIL
            </h2>
            <p className="text-gray-600 font-mono text-xs mt-1">
              A real verification email has been dispatched to{' '}
              <strong className="text-[#0D0518] underline">{verificationEmail}</strong>.
            </p>
          </div>

          {/* Genuine Inbox Instructions Card */}
          <div className="bg-[#FAF7EE] border-3 border-[#0D0518] rounded-2xl p-4 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#5C2D91] font-black">
              <Mail className="w-4 h-4" />
              <span>CHECK INBOX & SPAM FOLDER</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Open the verification email sent from Supabase Auth. You can either:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 pl-1 font-bold">
              <li>Click the confirmation link directly inside the email.</li>
              <li>Or copy the 6-digit verification code and paste it below.</li>
            </ul>
          </div>

          <form onSubmit={handleVerifyCode} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[#0D0518] mb-1 font-black">
                ENTER 6-DIGIT VERIFICATION CODE *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCodeInput}
                  onChange={(e) => setVerificationCodeInput(e.target.value.trim())}
                  placeholder="••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7EE] border-3 border-[#0D0518] text-[#0D0518] font-mono font-black text-xl tracking-widest text-center focus:outline-none focus:border-[#FF5FA0]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-gray-500 font-bold">Did not receive the email?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
                className="text-[#5C2D91] font-black hover:underline disabled:text-gray-400 flex items-center gap-1"
              >
                <RotateCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                <span>
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : isResending
                    ? 'Resending...'
                    : 'Resend Verification Email'}
                </span>
              </button>
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
              VERIFIED PLAYER LOGIN
            </span>
            <h2 className="font-bungee text-2xl sm:text-3xl text-[#0D0518]">
              PARTICIPANT SIGN IN
            </h2>
            <p className="text-gray-600 font-mono text-xs mt-1">
              Sign in with your verified email and password. Unverified accounts cannot sign in.
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
