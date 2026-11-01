import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Sparkles, Gamepad2, ArrowRight } from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function WelcomeHomepage({ soundEnabled, setSoundEnabled, triggerCelebration }) {
  const navigate = useNavigate();
  const [insertCoinActive, setInsertCoinActive] = useState(false);

  const handleStart = () => {
    soundFx.play('coin');
    setInsertCoinActive(true);
    triggerCelebration();

    setTimeout(() => {
      soundFx.play('fanfare');
      navigate('/select-portal');
    }, 700);
  };

  const handleSoundToggle = (e) => {
    e.stopPropagation();
    const newState = soundFx.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <div className="relative min-h-screen bg-[#150A26] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Background Arcade Grid & Vignette */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#F5EE00 1px, transparent 1px), linear-gradient(90deg, #F5EE00 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />
      <div className="absolute inset-0 bg-radial-at-c from-purple-900/20 via-transparent to-black/80 pointer-events-none" />

      {/* TOP HEADER: ARCADE UTILITY BAR */}
      <header className="relative z-20 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        {/* Arcade Cabinet Specs */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-pop-yellow border-2 border-black shadow-pop-sm flex items-center justify-center font-arcade text-black text-sm font-black">
            👾
          </div>
          <div className="font-mono text-xs">
            <span className="text-pop-yellow font-bold uppercase tracking-wider block">
              CIRCUIT SYSTEM • ROM v2.6
            </span>
            <span className="text-purple-300/80 text-[10px]">
              ALL RIGHTS RESERVED • INDIE ARCADE
            </span>
          </div>
        </div>

        {/* Audio Synthesizer Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSoundToggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-black text-xs font-mono font-bold shadow-pop-sm transition-all ${
              soundEnabled
                ? 'bg-pop-purple text-white'
                : 'bg-[#26123D] text-purple-300'
            }`}
            title={soundEnabled ? '8-Bit Audio On' : 'Audio Muted'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-pop-yellow" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
            <span className="hidden sm:inline">{soundEnabled ? 'SFX ON' : 'SFX MUTED'}</span>
          </button>
        </div>
      </header>

      {/* CENTER STAGE: VIBRANT RETRO ARCADE TITLE SEQUENCE */}
      <main className="relative z-20 flex flex-col items-center justify-center text-center px-4 my-auto">
        {/* Retro Header Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pop-coral text-white font-arcade text-xs font-black uppercase tracking-widest border-2 border-black shadow-pop mb-4 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-pop-yellow" />
          <span>PLAYER 1 READY</span>
        </div>

        {/* Grand Marquee Arcade Title */}
        <div className="relative mb-6">
          <h1 className="font-bungee text-5xl sm:text-7xl md:text-8xl tracking-wider text-pop-yellow drop-shadow-[4px_4px_0px_#FF2A6D] transition-transform hover:scale-105 duration-300">
            FUNTOPIA
          </h1>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-48 sm:w-72 h-1 bg-pop-yellow shadow-[0_0_15px_#F5EE00] rounded-full" />
        </div>

        <p className="font-display font-black text-lg sm:text-2xl text-purple-200 tracking-wide max-w-xl mb-8">
          THE CHAMPIONSHIP ARCADE LEADERBOARD
        </p>

        {/* ORIGINAL ARCADE CABINET JOYSTICK & COIN ACCEPTOR SVG ILLUSTRATION */}
        <div className="w-64 sm:w-80 h-32 mb-8 relative flex items-center justify-center">
          <svg
            viewBox="0 0 320 120"
            className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Control Panel Chassis */}
            <rect x="10" y="20" width="300" height="85" rx="16" fill="#26123D" stroke="#000" strokeWidth="4" />
            <rect x="16" y="26" width="288" height="73" rx="10" fill="#38195A" />

            {/* Red Arcade Joystick */}
            <rect x="52" y="55" width="20" height="30" rx="4" fill="#180A28" />
            <circle cx="62" cy="45" r="16" fill="#FF2A6D" stroke="#000" strokeWidth="3" />
            <circle cx="58" cy="40" r="4" fill="#FFA3BD" />

            {/* 6 Rainbow Action Buttons */}
            <circle cx="130" cy="50" r="10" fill="#FF2A6D" stroke="#000" strokeWidth="2.5" />
            <circle cx="158" cy="45" r="10" fill="#F5EE00" stroke="#000" strokeWidth="2.5" />
            <circle cx="186" cy="50" r="10" fill="#00E5FF" stroke="#000" strokeWidth="2.5" />
            <circle cx="130" cy="75" r="10" fill="#7928CA" stroke="#000" strokeWidth="2.5" />
            <circle cx="158" cy="70" r="10" fill="#FF6B00" stroke="#000" strokeWidth="2.5" />
            <circle cx="186" cy="75" r="10" fill="#05D179" stroke="#000" strokeWidth="2.5" />

            {/* Coin Entry Bezel */}
            <rect x="230" y="40" width="55" height="45" rx="6" fill="#180A28" stroke="#F5EE00" strokeWidth="2" />
            <rect x="254" y="48" width="6" height="28" rx="2" fill="#F5EE00" />
            <text x="238" y="32" fill="#F5EE00" fontSize="8" fontFamily="monospace" fontWeight="bold">25¢ COIN</text>
          </svg>
        </div>

        {/* INTERACTIVE 'PRESS START / ENTER FUNTOPIA' BUTTON */}
        <button
          onClick={handleStart}
          disabled={insertCoinActive}
          className={`group relative px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-pop-yellow text-pop-ink font-bungee text-lg sm:text-2xl tracking-wider uppercase border-3 border-black shadow-pop-lg transition-all duration-150 hover:-translate-y-1 hover:shadow-pop-xl active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center gap-3 ${
            insertCoinActive ? 'scale-95 bg-pop-coral text-white animate-pulse' : ''
          }`}
        >
          <Gamepad2 className="w-6 h-6 text-pop-ink group-hover:rotate-12 transition-transform" />
          <span>{insertCoinActive ? 'INSERTING COIN...' : 'ENTER FUNTOPIA'}</span>
          <ArrowRight className="w-6 h-6 text-pop-ink group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Sub-prompt */}
        <div className="mt-4 flex items-center gap-2 font-mono text-xs text-purple-300">
          <span className="w-2 h-2 rounded-full bg-pop-green animate-ping" />
          <span>PRESS START TO CHOOSE PORTAL</span>
        </div>
      </main>

      {/* FOOTER: ARCADE MARQUEE DETAILS */}
      <footer className="relative z-20 px-6 py-4 border-t-2 border-black/40 bg-[#10071C] text-xs font-mono text-purple-300/70 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div>
          <span className="text-pop-yellow font-bold">FUNTOPIA</span> • INDIE GAMING ARCADE PLATFORM
        </div>
        <div className="flex items-center gap-4">
          <span>HIGH SCORE: 999,990</span>
          <span>•</span>
          <span className="text-pop-green font-bold">SYSTEM ONLINE</span>
        </div>
      </footer>
    </div>
  );
}
