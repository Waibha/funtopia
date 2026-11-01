import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ArrowRight, RotateCw, Sparkles, Trophy } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { saveParticipantSession, resendParticipantVerification } from '../services/api/authService';
import { soundFx } from '../utilities/soundFx';

export default function AuthCallback({ onRegisterParticipant, startingCoins = 0, triggerCelebration }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function handleAuthRedirect() {
      // 1. Check for errors in query params or hash fragment
      const searchParams = new URLSearchParams(location.search);
      const hashParams = new URLSearchParams(location.hash.startsWith('#') ? location.hash.substring(1) : location.hash);

      const error = searchParams.get('error') || hashParams.get('error');
      const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

      if (error) {
        if (!isMounted) return;
        soundFx.play('scoreDown');
        setStatus('error');
        if (errorDescription && (errorDescription.includes('expired') || errorDescription.includes('invalid') || errorDescription.includes('already'))) {
          setErrorMessage('This verification link has already been used or has expired. If you have already verified, please sign in.');
        } else {
          setErrorMessage(errorDescription || 'The email confirmation link could not be verified.');
        }
        return;
      }

      // 2. Check for PKCE exchange code in query params (?code=...)
      const code = searchParams.get('code');
      if (code && supabase) {
        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            if (!isMounted) return;
            soundFx.play('scoreDown');
            setStatus('error');
            setErrorMessage(exchangeError.message || 'Failed to exchange verification code for session.');
            return;
          }

          if (data?.session?.user) {
            handleSuccessfulVerification(data.session.user);
            return;
          }
        } catch (err) {
          if (!isMounted) return;
          soundFx.play('scoreDown');
          setStatus('error');
          setErrorMessage(err.message || 'An error occurred during code exchange.');
          return;
        }
      }

      // 3. Check for implicit hash session or active Supabase session
      if (supabase) {
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            if (!isMounted) return;
            setStatus('error');
            setErrorMessage(sessionError.message);
            return;
          }

          if (session?.user) {
            handleSuccessfulVerification(session.user);
            return;
          }
        } catch (err) {
          // Continue to fallback check
        }
      }

      // If no code, no hash error, and no session found after brief delay
      setTimeout(async () => {
        if (!isMounted) return;
        if (supabase) {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            handleSuccessfulVerification(data.session.user);
            return;
          }
        }
        setStatus('error');
        setErrorMessage('No valid confirmation code or session found in redirect URL.');
      }, 1500);
    }

    function handleSuccessfulVerification(user) {
      if (!isMounted) return;
      soundFx.play('fanfare');
      if (triggerCelebration) triggerCelebration();

      const allocatedCoins = typeof user.user_metadata?.startingCoins === 'number'
        ? user.user_metadata.startingCoins
        : Number(startingCoins ?? 0);

      const verifiedParticipant = {
        id: user.id,
        name: user.user_metadata?.name || 'Verified Player',
        email: user.email,
        avatar: user.user_metadata?.avatar || '👾',
        coins: allocatedCoins,
        isEmailVerified: true,
        registeredAt: new Date().toISOString(),
      };

      const session = {
        role: 'participant',
        participantId: verifiedParticipant.id,
        name: verifiedParticipant.name,
        email: verifiedParticipant.email,
        avatar: verifiedParticipant.avatar,
        issuedAt: Date.now(),
      };

      saveParticipantSession(session);
      if (onRegisterParticipant) {
        onRegisterParticipant(verifiedParticipant);
      }

      setVerifiedUser(verifiedParticipant);
      setStatus('success');

      // Clean URL query parameters and redirect to participant lobby after 2 seconds
      setTimeout(() => {
        if (isMounted) {
          navigate('/participant', { replace: true });
        }
      }, 2200);
    }

    handleAuthRedirect();

    return () => {
      isMounted = false;
    };
  }, [location, navigate, onRegisterParticipant, startingCoins, triggerCelebration]);

  const handleManualResend = async () => {
    setIsResending(true);
    setResendStatus('');
    try {
      const emailPrompt = window.prompt('Enter your registered email address to resend confirmation:');
      if (!emailPrompt) {
        setIsResending(false);
        return;
      }
      const res = await resendParticipantVerification({ email: emailPrompt.trim() });
      if (res.success) {
        setResendStatus(`Verification email resent to ${emailPrompt.trim()}! Please check your inbox.`);
      } else {
        setResendStatus(res.error || 'Failed to resend verification email.');
      }
    } catch (err) {
      setResendStatus('Error resending email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#451B75] text-white flex flex-col items-center justify-center p-4 font-sans select-none">
      {/* Background Graphic Texture */}
      <div
        className="fixed inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#FFDE25 1px, transparent 1px), linear-gradient(90deg, #FFDE25 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-md w-full bg-white text-[#0D0518] rounded-3xl border-4 border-[#0D0518] p-8 shadow-pixel-xl text-center space-y-6">
        {/* Processing State */}
        {status === 'processing' && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel mx-auto flex items-center justify-center text-3xl animate-bounce">
              👾
            </div>
            <h2 className="font-bungee text-2xl text-[#0D0518]">VERIFYING CONFIRMATION...</h2>
            <p className="font-mono text-xs text-gray-600 font-bold">
              Connecting to Supabase Auth and validating email token.
            </p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && verifiedUser && (
          <div className="space-y-4 py-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-[#28C76F] border-3 border-[#0D0518] shadow-pixel mx-auto flex items-center justify-center text-4xl text-white">
              ✓
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-[#28C76F] text-[#0D0518] font-arcade text-[10px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm inline-block mb-2">
                EMAIL VERIFIED • ACCOUNT ACTIVE
              </span>
              <h2 className="font-bungee text-3xl text-[#0D0518]">
                WELCOME, {verifiedUser.name.toUpperCase()}!
              </h2>
              <p className="font-mono text-xs text-gray-600 mt-1 font-bold">
                Your account is confirmed. Redirecting into the Championship Arena...
              </p>
            </div>

            <div className="bg-[#FAF7EE] border-3 border-[#0D0518] rounded-2xl p-4 text-left font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">HANDLE:</span>
                <span className="font-black text-[#0D0518]">{verifiedUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">EMAIL:</span>
                <span className="font-bold text-[#0D0518]">{verifiedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">STARTING BALANCE:</span>
                <span className="font-black text-[#FF7A00]">🪙 {verifiedUser.coins} COINS</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/participant')}
              className="btn-pixel-yellow w-full py-3 text-xs font-black flex items-center justify-center gap-2"
            >
              <span>ENTER ARENA NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="space-y-4 py-2 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#FF3366] text-white border-3 border-[#0D0518] shadow-pixel mx-auto flex items-center justify-center text-3xl">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-[#FF3366] text-white font-arcade text-[10px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm inline-block mb-2">
                VERIFICATION NOTICE
              </span>
              <h2 className="font-bungee text-2xl text-[#0D0518]">LINK EXPIRED OR ALREADY CONFIRMED</h2>
              <p className="font-mono text-xs text-gray-700 mt-1 leading-relaxed font-bold">
                {errorMessage}
              </p>
            </div>

            {resendStatus && (
              <div className="p-3 bg-purple-50 border-2 border-purple-300 rounded-xl font-mono text-xs text-purple-900 font-bold">
                {resendStatus}
              </div>
            )}

            <div className="space-y-2 pt-2 font-mono text-xs">
              <button
                onClick={() => navigate('/participant')}
                className="btn-pixel-yellow w-full py-3 text-xs font-black"
              >
                GO TO SIGN IN / LOBBY
              </button>

              <button
                onClick={handleManualResend}
                disabled={isResending}
                className="btn-pixel-white w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>RESEND VERIFICATION LINK</span>
              </button>

              <button
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-[#0D0518] text-[11px] block mx-auto pt-1 font-bold"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
