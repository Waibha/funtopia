import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Sparkles, Compass, ArrowRight, Sliders, Shield, Zap } from 'lucide-react';
import AudioSettingsModal from '../components/AudioSettingsModal';
import FantasyWorldEnvironment from '../components/fantasy/FantasyWorldEnvironment';
import { soundFx } from '../utilities/soundFx';

export default function WelcomeHomepage({ soundEnabled, setSoundEnabled, triggerCelebration }) {
  const navigate = useNavigate();
  const [enteringKingdom, setEnteringKingdom] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  const handleStart = () => {
    soundFx.play('coin');
    setEnteringKingdom(true);
    triggerCelebration();

    setTimeout(() => {
      soundFx.play('fanfare');
      navigate('/select-portal');
    }, 650);
  };

  const handleSoundToggle = (e) => {
    e.stopPropagation();
    const newState = soundFx.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col justify-between overflow-hidden select-none font-sans bg-[#0A091A]">
      {/* ========================================================================= */}
      {/* 1. LIVING FANTASY WORLD ENVIRONMENT (DYNAMIC MULTI-LAYERED LANDSCAPE)     */}
      {/* ========================================================================= */}
      <FantasyWorldEnvironment />

      {/* ========================================================================= */}
      {/* 2. TOP NAVIGATION: REALM HUD & AMBIENCE SETTINGS                          */}
      {/* ========================================================================= */}
      <header className="relative z-20 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        {/* Realm Crest Badge */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FFC837] via-[#FFE484] to-[#FF9E1B] p-[2px] shadow-fantasy-gold">
            <div className="w-full h-full bg-[#0E0B28] rounded-[14px] flex items-center justify-center text-xl">
              🏰
            </div>
          </div>
          <div className="font-jakarta text-xs">
            <span className="font-cinzel text-xs sm:text-sm font-black text-[#FFC837] tracking-wider block">
              MADAGASCAR
            </span>
            <span className="text-cyan-300 text-[10px] font-semibold tracking-widest uppercase">
              THE LIVING FANTASY REALM
            </span>
          </div>
        </div>

        {/* Audio Atmosphere & Synthesizer Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAudioModalOpen(true)}
            className="btn-fantasy-subtle"
            title="Audio & Atmosphere Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-[#FFC837]" />
            <span className="hidden sm:inline">ATMOSPHERE</span>
          </button>

          <button
            onClick={handleSoundToggle}
            className={`btn-fantasy-subtle transition-all ${
              soundEnabled
                ? 'border-[#FFC837]/80 text-[#FFC837] shadow-[0_0_15px_rgba(255,200,55,0.3)]'
                : 'text-slate-400'
            }`}
            title={soundEnabled ? 'Realm Soundscape On' : 'Realm Soundscape Muted'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#FFC837]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="font-cinzel text-[11px] font-bold">
              {soundEnabled ? 'SOUND ON' : 'MUTED'}
            </span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. CENTER STAGE: MAJESTIC KINGDOM TITLE & "ENTER THE KINGDOM" ACTION      */}
      {/* ========================================================================= */}
      <main className="relative z-20 flex flex-col items-center justify-center text-center px-4 my-auto py-6">
        {/* Luminous Adventurer Crest Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#120F30]/85 border border-[#FFC837]/50 shadow-fantasy-gold text-[#FFC837] font-cinzel text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-[#FFC837]" />
          <span>✦ THE CHAMPIONSHIP REALM AWAITS ✦</span>
          <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
        </div>

        {/* Grand Realm Title "MADAGASCAR" */}
        <div className="relative mb-3">
          {/* Subtle magical sparkles */}
          <div className="absolute -top-7 -left-10 text-[#FFC837] text-3xl animate-bounce pointer-events-none opacity-80">
            ✦
          </div>
          <div className="absolute -bottom-5 -right-10 text-[#00F0FF] text-3xl animate-pulse pointer-events-none opacity-80">
            ✦
          </div>

          <h1 className="text-6xl sm:text-8xl md:text-9xl fantasy-title-gold select-none tracking-wider hover:scale-105 transition-transform duration-300">
            MADAGASCAR
          </h1>

          {/* Underline Arcane Halo */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-1.5 bg-gradient-to-r from-transparent via-[#FFC837] to-transparent shadow-fantasy-gold rounded-full" />
        </div>

        <p className="font-jakarta font-medium text-sm sm:text-lg text-slate-200 tracking-widest max-w-xl mb-8 mt-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] uppercase">
          An Enchanted Fantasy World of Quests, Champions & Glory
        </p>

        {/* PRIMARY "ENTER THE KINGDOM" INTERACTION */}
        <button
          onClick={handleStart}
          disabled={enteringKingdom}
          className={`btn-fantasy-primary group ${
            enteringKingdom ? 'scale-95 brightness-125 animate-pulse' : ''
          }`}
        >
          <Compass className="w-6 h-6 text-[#0A091A] group-hover:rotate-45 transition-transform duration-300" />
          <span>{enteringKingdom ? 'ENTERING THE REALM...' : 'ENTER THE KINGDOM'}</span>
          <ArrowRight className="w-6 h-6 text-[#0A091A] group-hover:translate-x-2 transition-transform duration-300" />
        </button>

        {/* Whispering Sprite Dialogue Tip */}
        <div className="mt-7 max-w-md bg-[#100D2B]/90 backdrop-blur-md text-slate-200 rounded-2xl border border-white/15 shadow-fantasy-card p-3.5 relative text-xs font-jakarta flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#34D399] flex items-center justify-center text-lg shadow-fantasy-emerald shrink-0">
            ✨
          </div>
          <p className="text-left text-xs leading-relaxed text-slate-300">
            Cross the threshold into <strong className="text-[#FFC837] font-bold">MADAGASCAR</strong> to command as an <strong className="text-cyan-300">Admin Marshal</strong> or embark on adventures in the <strong className="text-emerald-300">Participant Guild</strong>!
          </p>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. FOOTER: CHAMPION EMBLEMS & LIVING REALM BASELINE                       */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full select-none">
        {/* Adventurer Class Lineup */}
        <div className="max-w-4xl mx-auto px-4 flex items-end justify-center gap-6 sm:gap-10 pb-2.5 opacity-90 pointer-events-none">
          <div className="flex flex-col items-center animate-bounce-subtle">
            <span className="text-2xl sm:text-3xl filter drop-shadow">🤠</span>
            <span className="font-cinzel text-[9px] text-[#FFC837] font-bold tracking-wider mt-0.5">RANGER</span>
          </div>
          <div className="flex flex-col items-center animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>
            <span className="text-2xl sm:text-3xl filter drop-shadow">🧕</span>
            <span className="font-cinzel text-[9px] text-pink-300 font-bold tracking-wider mt-0.5">MYSTIC</span>
          </div>
          <div className="flex flex-col items-center animate-bounce-subtle" style={{ animationDelay: '0.4s' }}>
            <span className="text-2xl sm:text-3xl filter drop-shadow">🦊</span>
            <span className="font-cinzel text-[9px] text-[#FF9E1B] font-bold tracking-wider mt-0.5">PILOT</span>
          </div>
          <div className="flex flex-col items-center animate-bounce-subtle" style={{ animationDelay: '0.1s' }}>
            <span className="text-2xl sm:text-3xl filter drop-shadow">🧑‍🎤</span>
            <span className="font-cinzel text-[9px] text-emerald-300 font-bold tracking-wider mt-0.5">BARD</span>
          </div>
          <div className="flex flex-col items-center animate-bounce-subtle" style={{ animationDelay: '0.5s' }}>
            <span className="text-2xl sm:text-3xl filter drop-shadow">🚀</span>
            <span className="font-cinzel text-[9px] text-cyan-300 font-bold tracking-wider mt-0.5">COSMO</span>
          </div>
          <div className="flex flex-col items-center animate-bounce-subtle" style={{ animationDelay: '0.3s' }}>
            <span className="text-2xl sm:text-3xl filter drop-shadow">⚔️</span>
            <span className="font-cinzel text-[9px] text-[#FFC837] font-bold tracking-wider mt-0.5">KNIGHT</span>
          </div>
        </div>

        {/* Luminous Shimmer Baseline Strip */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#FFC837] to-transparent shadow-fantasy-gold" />

        {/* Realm Status Bar */}
        <div className="bg-[#080718]/95 backdrop-blur-md border-t border-white/10 py-3 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-jakarta text-slate-300 font-medium gap-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FFC837]" />
              <span className="text-[#FFC837] font-cinzel text-[11px] font-bold">LIVING KINGDOM ENGINE</span>
              <span className="text-slate-500 text-xs hidden md:inline">• ENTER TO CHOOSE YOUR DESTINATION</span>
            </div>
            <div className="text-[11px] font-cinzel text-cyan-300 tracking-wider">
              REALM RECORD: 999,990 PTS • STATUS: SANCTUARY ACTIVE
            </div>
          </div>
        </div>
      </footer>

      {/* Audio Settings Modal */}
      <AudioSettingsModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
      />
    </div>
  );
}
