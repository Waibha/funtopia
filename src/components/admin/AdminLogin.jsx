import React, { useState } from 'react';
import { Lock, ArrowLeft, AlertTriangle, KeyRound } from 'lucide-react';
import { soundFx } from '../../utilities/soundFx';
import { verifyAdminPasskey } from '../../services/api/authService';

export default function AdminLogin({ onLoginSuccess, onReturnToPortals }) {
  const [operatorEmail, setOperatorEmail] = useState('');
  const [passkey, setPasskey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAuthorizing(true);
    setErrorMsg('');
    soundFx.play('click');

    try {
      const res = await verifyAdminPasskey({
        passkey,
        operatorEmail: operatorEmail.trim() || 'operator@funtopia.arcade',
      });

      if (res.success && res.session) {
        soundFx.play('fanfare');
        setIsAuthorizing(false);
        onLoginSuccess(res.session);
      } else {
        soundFx.play('scoreDown');
        setIsAuthorizing(false);
        setErrorMsg(res.error || 'ACCESS DENIED: Invalid passkey.');
      }
    } catch (err) {
      soundFx.play('scoreDown');
      setIsAuthorizing(false);
      setErrorMsg('Authentication service error. Verification failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#5C2D91] text-white flex flex-col justify-between p-4 sm:p-8 select-none font-sans">
      {/* Background Graphic Grid */}
      <div
        className="fixed inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#FFDE25 1px, transparent 1px), linear-gradient(90deg, #FFDE25 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="fixed inset-0 bg-radial-at-t from-purple-700/25 via-transparent to-[#1F0738]/90 pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto w-full flex items-center justify-between">
        <button
          onClick={onReturnToPortals}
          className="btn-pixel-white text-[11px] py-1.5 px-3 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>PORTALS</span>
        </button>

        <span className="font-arcade text-[10px] text-[#FF5FA0] font-black">
          RESTRICTED GATEWAY
        </span>
      </div>

      {/* Main 90s OS Retro Window (Homage to Screen 2: "ARE YOU READY?") */}
      <div className="relative z-10 max-w-md mx-auto w-full my-auto py-6">
        <div className="retro-os-window rounded-2xl">
          {/* Classic 90s Blue Header Bar */}
          <div className="retro-os-titlebar py-2 px-3">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>ADMIN_AUTHENTICATION_GATEWAY.EXE</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.2 bg-[#D1D5DB] text-[#0D0518] border border-[#0D0518] text-[10px] cursor-pointer">_</span>
              <span className="px-1.5 py-0.2 bg-[#D1D5DB] text-[#0D0518] border border-[#0D0518] text-[10px] cursor-pointer">✕</span>
            </div>
          </div>

          <div className="p-6 bg-[#D1D5DB]">
            {/* "ARE YOU READY?" dialogue box banner */}
            <div className="bg-white border-3 border-[#0D0518] p-4 text-center rounded-xl mb-5 shadow-pixel-sm">
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="text-xl">👾</span>
                <span className="font-arcade text-sm text-[#0D0518] font-black">
                  ARE YOU READY ?
                </span>
                <span className="text-xl">👾</span>
              </div>
              <p className="text-[11px] font-mono text-gray-600 font-bold">
                ENTER AUTHORIZED ADMIN PASSKEY
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-100 border-2 border-red-600 text-red-900 text-xs font-mono flex items-start gap-2 animate-shake">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="font-bold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono text-[#0D0518]">
              <div>
                <label className="block text-[#0D0518] mb-1 font-black">
                  ADMIN PASSKEY *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="••••••••••••••••"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border-3 border-[#0D0518] text-[#0D0518] font-mono font-bold focus:outline-none focus:border-[#FF5FA0]"
                  />
                  <KeyRound className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[#0D0518] mb-1 font-black">
                  OPERATOR EMAIL / IDENTITY
                </label>
                <input
                  type="text"
                  value={operatorEmail}
                  onChange={(e) => setOperatorEmail(e.target.value)}
                  placeholder="operator@funtopia.arcade"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-3 border-[#0D0518] text-[#0D0518] font-bold focus:outline-none focus:border-[#FF5FA0]"
                />
              </div>

              {/* Action Buttons styled like the [ Yes ] [ No ] dialog buttons */}
              <div className="pt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onReturnToPortals}
                  className="btn-pixel-white text-center justify-center text-xs py-3"
                >
                  NO / CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isAuthorizing}
                  className="btn-pixel-yellow text-center justify-center text-xs py-3 font-bold"
                >
                  {isAuthorizing ? 'VERIFYING...' : 'YES / ENTER'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Platform */}
      <footer className="relative z-10 w-full select-none">
        <div className="pixel-grass-strip h-3 w-full" />
        <div className="pixel-brick-strip py-3 px-6 text-center text-xs font-arcade text-[#FFDE25]">
          SECURE OPERATOR TERMINAL • CRYPTO-HASH VERIFICATION v2.6
        </div>
      </footer>
    </div>
  );
}
