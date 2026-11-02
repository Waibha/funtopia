import React, { useState } from 'react';
import { Lock, ArrowLeft, AlertTriangle, KeyRound, Shield, Sparkles } from 'lucide-react';
import { soundFx } from '../../utilities/soundFx';
import { verifyAdminPasskey } from '../../services/api/authService';
import AuthArcadeBackground from '../backgrounds/AuthArcadeBackground';

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
    <div className="relative min-h-screen bg-[#0A091A] text-slate-100 flex flex-col justify-between p-4 sm:p-8 select-none font-sans overflow-hidden">
      {/* Background Animated Elements */}
      <AuthArcadeBackground />
      <div className="fixed inset-0 bg-radial-at-t from-cyan-950/25 via-transparent to-[#0A091A]/95 pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 max-w-md mx-auto w-full flex items-center justify-between">
        <button
          onClick={onReturnToPortals}
          className="btn-fantasy-subtle text-xs py-2 px-3 flex items-center gap-1.5 font-cinzel text-cyan-200"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>RETURN TO PORTALS</span>
        </button>

        <span className="font-cinzel text-[10px] text-[#00F0FF] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-[#00F0FF]/30 shadow-fantasy-cyan">
          HIGH CITADEL ARCHIVE
        </span>
      </div>

      {/* Main High Citadel Vault Frame */}
      <div className="relative z-10 max-w-md mx-auto w-full my-auto py-6">
        <div className="rounded-3xl bg-gradient-to-b from-[#0F1B38]/95 via-[#0A132B]/95 to-[#060B1A]/95 border-2 border-[#00F0FF]/40 shadow-fantasy-card overflow-hidden backdrop-blur-xl animate-fade-in">
          {/* Celestial Titlebar */}
          <div className="bg-[#0B152C]/90 px-4 py-3 border-b border-[#00F0FF]/25 flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-200 text-xs font-cinzel font-bold tracking-wider">
              <Shield className="w-4 h-4 text-[#00F0FF]" />
              <span>CITADEL_PASSKEY_SANCTUM</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[10px] font-mono text-cyan-300">RESTRICTED</span>
            </div>
          </div>

          <div className="p-6">
            {/* Seal Dialogue Banner */}
            <div className="bg-[#081024]/80 border border-[#00F0FF]/30 p-5 text-center rounded-2xl mb-6 shadow-fantasy-cyan">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-950/80 border border-[#00F0FF]/50 flex items-center justify-center text-2xl mb-3 shadow-fantasy-cyan">
                🗝️
              </div>
              <h2 className="font-cinzel text-xl font-black text-[#FFC837] fantasy-title-gold tracking-wide">
                HIGH CITADEL VAULT
              </h2>
              <p className="text-[11px] font-jakarta text-cyan-200/80 mt-1">
                Enter authorized Grand Scribe Passkey & Identity
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/60 text-red-200 text-xs font-jakarta flex items-start gap-2.5 animate-shake">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="font-bold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-jakarta text-slate-200">
              <div>
                <label className="block text-slate-300 font-cinzel font-bold text-xs uppercase mb-1.5 tracking-wider">
                  CITADEL PASSKEY *
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
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#060D1E] border border-white/15 text-slate-100 font-mono font-bold focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all"
                  />
                  <KeyRound className="w-4 h-4 text-cyan-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-cinzel font-bold text-xs uppercase mb-1.5 tracking-wider">
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060D1E] border border-white/15 text-slate-100 font-mono font-medium focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onReturnToPortals}
                  className="btn-fantasy-subtle text-center justify-center text-xs py-3 font-cinzel font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isAuthorizing}
                  className="btn-fantasy-citadel text-center justify-center text-xs py-3 font-cinzel font-bold"
                >
                  {isAuthorizing ? 'VERIFYING...' : 'ENTER CITADEL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Platform */}
      <footer className="relative z-10 w-full select-none text-center py-4 border-t border-white/10 text-xs font-cinzel text-slate-400">
        MADAGASCAR CITADEL MARSHAL TERMINAL • SECURE TELEMETRY ARCHIVE
      </footer>
    </div>
  );
}
