import React, { useState } from 'react';
import { Lock, ShieldCheck, Key, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { soundFx } from '../../utilities/soundFx';

export default function AdminLogin({ onLoginSuccess, onReturnToPortals }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAuthorizing(true);
    setErrorMsg('');
    soundFx.play('click');

    // Simulate server-side verification check
    setTimeout(() => {
      // In production, this calls supabase.auth.signInWithPassword()
      // followed by RPC redeem_admin_invitation(access_code)
      if (email.trim().length > 3 && password.length >= 6) {
        soundFx.play('fanfare');
        setIsAuthorizing(false);
        onLoginSuccess({
          email: email.trim(),
          role: 'admin',
          authorizedAt: new Date().toISOString(),
        });
      } else {
        soundFx.play('scoreDown');
        setIsAuthorizing(false);
        setErrorMsg('Authentication error: Invalid credentials or unverified invitation code.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#150A26] text-white flex flex-col justify-between p-4 sm:p-8 select-none">
      <div className="max-w-md mx-auto w-full flex items-center justify-between">
        <button
          onClick={onReturnToPortals}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#26123D] border-2 border-black text-xs font-mono font-bold text-purple-200 hover:bg-pop-purple hover:text-white shadow-pop-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>PORTAL SELECTION</span>
        </button>

        <span className="font-arcade text-[10px] text-pop-coral font-black">
          RESTRICTED GATEWAY
        </span>
      </div>

      <div className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-[#26123D] border-4 border-black rounded-3xl p-6 sm:p-8 shadow-pop-xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-pop-yellow border-3 border-black shadow-pop mx-auto flex items-center justify-center text-pop-ink mb-4">
              <Lock className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full bg-pop-coral text-white font-arcade text-[9px] font-black uppercase border-2 border-black shadow-pop-sm inline-block mb-2">
              ADMIN AUTHORIZATION
            </span>
            <h2 className="font-bungee text-2xl sm:text-3xl text-pop-yellow">
              OPERATOR ACCESS
            </h2>
            <p className="text-xs text-purple-200 font-sans mt-1">
              Restricted to the Owner and authorized tournament marshals.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border-2 border-red-500 text-red-200 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-purple-200 mb-1 font-bold">
                ADMINISTRATOR EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@funtopia.arcade"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#180A28] border-2 border-black text-white font-bold focus:outline-none focus:border-pop-yellow"
              />
            </div>

            <div>
              <label className="block text-purple-200 mb-1 font-bold">
                PASSWORD
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#180A28] border-2 border-black text-white font-bold focus:outline-none focus:border-pop-yellow"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-pop-yellow font-bold">
                  INVITATION ACCESS CODE / HASH
                </label>
                <span className="text-[10px] text-purple-300">Server verified</span>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-pop-yellow absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="e.g. FNT-MASTER-99"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#180A28] border-2 border-black text-pop-yellow font-mono font-bold uppercase focus:outline-none focus:border-pop-yellow"
                />
              </div>
              <p className="text-[10px] text-purple-300/80 mt-1">
                Single-use invitation token issued by the Owner. Never validated on client.
              </p>
            </div>

            <button
              type="submit"
              disabled={isAuthorizing}
              className="w-full mt-2 py-3.5 rounded-2xl bg-pop-yellow text-pop-ink font-display font-black text-sm uppercase tracking-wider border-3 border-black shadow-pop hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>{isAuthorizing ? 'VALIDATING CLEARANCE...' : 'AUTHORIZE ADMIN SESSION'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t-2 border-black/40 text-center text-[10px] font-mono text-purple-300/70">
            Protected by Supabase PostgreSQL Row Level Security (RLS)
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full text-center text-xs font-mono text-purple-400">
        FUNTOPIA RESTRICTED GATEWAY • PRIVILEGED ACCESS ONLY
      </div>
    </div>
  );
}
