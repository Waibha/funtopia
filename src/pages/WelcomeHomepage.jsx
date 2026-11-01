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
    }, 600);
  };

  const handleSoundToggle = (e) => {
    e.stopPropagation();
    const newState = soundFx.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <div className="relative min-h-screen bg-[#451B75] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* ========================================================================= */}
      {/* LAYER 1: VIBRANT RETRO ARCADE SKY & PIXEL CITYSCAPE BACKGROUND            */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#FFDE25 1.5px, transparent 1.5px), radial-gradient(#FF5FA0 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />
      <div className="absolute inset-0 bg-radial-at-t from-purple-600/25 via-transparent to-[#1F0738]/90 pointer-events-none" />

      {/* Floating Pixel Clouds */}
      <div className="absolute top-16 left-6 sm:left-20 opacity-85 pointer-events-none animate-bounce-subtle">
        <svg width="120" height="50" viewBox="0 0 120 50" fill="none">
          <rect x="28" y="0" width="48" height="14" fill="#E9D5FF" />
          <rect x="14" y="14" width="82" height="14" fill="#E9D5FF" />
          <rect x="0" y="28" width="116" height="22" fill="#F5EEFF" />
          <rect x="20" y="28" width="84" height="8" fill="#C084FC" />
        </svg>
      </div>

      <div className="absolute top-24 right-8 sm:right-24 opacity-80 pointer-events-none">
        <svg width="140" height="56" viewBox="0 0 140 56" fill="none">
          <rect x="36" y="0" width="60" height="16" fill="#E9D5FF" />
          <rect x="16" y="16" width="100" height="16" fill="#E9D5FF" />
          <rect x="0" y="32" width="140" height="24" fill="#F5EEFF" />
          <rect x="24" y="32" width="100" height="9" fill="#C084FC" />
        </svg>
      </div>

      {/* Pixel Full Moon */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 sm:translate-x-64 opacity-90 pointer-events-none hidden md:block">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect x="24" y="0" width="32" height="80" fill="#FFDE25" />
          <rect x="8" y="8" width="64" height="64" fill="#FFDE25" />
          <rect x="0" y="24" width="80" height="32" fill="#FFDE25" />
          <rect x="20" y="28" width="12" height="12" fill="#E6C200" />
          <rect x="48" y="44" width="16" height="16" fill="#E6C200" />
          <rect x="40" y="16" width="8" height="8" fill="#E6C200" />
        </svg>
      </div>

      {/* Layered Pixel City Skyline Silhouette across bottom background */}
      <div className="absolute bottom-16 inset-x-0 h-40 opacity-25 pointer-events-none flex items-end justify-center overflow-hidden">
        <svg viewBox="0 0 1200 160" className="w-full h-full preserve-3d" fill="none" preserveAspectRatio="none">
          <rect x="40" y="60" width="50" height="100" fill="#200B3B" />
          <rect x="110" y="20" width="70" height="140" fill="#200B3B" />
          <rect x="200" y="70" width="45" height="90" fill="#200B3B" />
          <rect x="260" y="40" width="80" height="120" fill="#200B3B" />
          <rect x="360" y="10" width="65" height="150" fill="#200B3B" />
          <rect x="445" y="80" width="55" height="80" fill="#200B3B" />
          <rect x="520" y="30" width="90" height="130" fill="#200B3B" />
          <rect x="630" y="50" width="70" height="110" fill="#200B3B" />
          <rect x="720" y="15" width="80" height="145" fill="#200B3B" />
          <rect x="820" y="65" width="60" height="95" fill="#200B3B" />
          <rect x="900" y="35" width="85" height="125" fill="#200B3B" />
          <rect x="1005" y="75" width="50" height="85" fill="#200B3B" />
          <rect x="1075" y="25" width="85" height="135" fill="#200B3B" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* TOP HEADER: ARCADE UTILITY & AUDIO SYNTHESIZER BAR                        */}
      {/* ========================================================================= */}
      <header className="relative z-20 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel-sm flex items-center justify-center font-arcade text-black text-lg font-black">
            👾
          </div>
          <div className="font-mono text-xs">
            <span className="text-[#FFDE25] font-black uppercase tracking-wider block">
              FUNTOPIA ARCADE • ROM v2.6
            </span>
            <span className="text-purple-200 text-[10px] font-bold">
              16-BIT INDIE GAMING SYSTEM
            </span>
          </div>
        </div>

        {/* Audio Synthesizer Toggle */}
        <button
          onClick={handleSoundToggle}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border-3 border-[#0D0518] text-xs font-mono font-black shadow-pixel-sm transition-all ${
            soundEnabled
              ? 'bg-[#FFDE25] text-[#0D0518]'
              : 'bg-[#2E1052] text-purple-200'
          }`}
          title={soundEnabled ? '8-Bit Audio On' : 'Audio Muted'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
          <span className="font-arcade text-[10px]">{soundEnabled ? 'SFX ON' : 'MUTED'}</span>
        </button>
      </header>

      {/* ========================================================================= */}
      {/* CENTER STAGE: VIBRANT RETRO ARCADE TITLE & ILLUSTRATED CABINET            */}
      {/* ========================================================================= */}
      <main className="relative z-20 flex flex-col items-center justify-center text-center px-4 my-auto py-6">
        {/* Retro Header Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5FA0] text-white font-arcade text-xs font-black uppercase tracking-widest border-3 border-[#0D0518] shadow-pixel-sm mb-3 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-[#FFDE25]" />
          <span>✦ PLAYER 1 READY ✦</span>
        </div>

        {/* Grand Marquee Arcade Title "FUNTOPIA" */}
        <div className="relative mb-2">
          <h1 className="font-bungee text-6xl sm:text-8xl md:text-9xl tracking-wider text-[#FFDE25] pixel-title-yellow select-none hover:scale-105 transition-transform duration-200">
            FUNTOPIA
          </h1>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 sm:w-80 h-1.5 bg-[#FFDE25] shadow-[0_0_20px_#FFDE25] rounded-full" />
        </div>

        <p className="font-display font-black text-base sm:text-xl text-purple-200 tracking-wide max-w-xl mb-6">
          THE INDIE ARCADE CHAMPIONSHIP PLATFORM
        </p>

        {/* ORIGINAL ILLUSTRATED ARCADE CABINET CONTROL PANEL WITH JOYSTICK & COIN */}
        <div className="w-72 sm:w-96 h-36 mb-6 relative flex items-center justify-center">
          <svg
            viewBox="0 0 340 130"
            className="w-full h-full drop-shadow-[0_12px_30px_rgba(0,0,0,0.7)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Chassis */}
            <rect x="10" y="16" width="320" height="98" rx="18" fill="#200B3B" stroke="#0D0518" strokeWidth="4" />
            <rect x="16" y="22" width="308" height="86" rx="12" fill="#32125A" />
            <rect x="20" y="26" width="300" height="78" rx="8" fill="#40186D" />

            {/* Red 16-Bit Arcade Joystick with Ball-top */}
            <rect x="54" y="58" width="22" height="34" rx="4" fill="#0D0518" />
            <circle cx="65" cy="46" r="18" fill="#FF5FA0" stroke="#0D0518" strokeWidth="3.5" />
            <circle cx="60" cy="40" r="5" fill="#FFA3CB" />

            {/* 6 Rainbow Action Buttons */}
            <circle cx="132" cy="52" r="11" fill="#FF5FA0" stroke="#0D0518" strokeWidth="3" />
            <circle cx="162" cy="46" r="11" fill="#FFDE25" stroke="#0D0518" strokeWidth="3" />
            <circle cx="192" cy="52" r="11" fill="#00F0FF" stroke="#0D0518" strokeWidth="3" />
            <circle cx="132" cy="80" r="11" fill="#5C2D91" stroke="#0D0518" strokeWidth="3" />
            <circle cx="162" cy="74" r="11" fill="#FF7A00" stroke="#0D0518" strokeWidth="3" />
            <circle cx="192" cy="80" r="11" fill="#28C76F" stroke="#0D0518" strokeWidth="3" />

            {/* 25¢ Coin Entry Slot Bezel */}
            <rect x="240" y="40" width="62" height="52" rx="8" fill="#200B3B" stroke="#FFDE25" strokeWidth="2.5" />
            <rect x="268" y="48" width="7" height="34" rx="2" fill="#FFDE25" />
            <text x="247" y="32" fill="#FFDE25" fontSize="9" fontFamily="monospace" fontWeight="900">25¢ COIN</text>
          </svg>
        </div>

        {/* PRIMARY 'ENTER FUNTOPIA' / 'PRESS START' INTERACTION */}
        <button
          onClick={handleStart}
          disabled={insertCoinActive}
          className={`group relative px-8 py-4 sm:px-12 sm:py-5 rounded-2xl bg-[#FFDE25] text-[#0D0518] font-bungee text-xl sm:text-3xl tracking-wider uppercase border-4 border-[#0D0518] shadow-pixel-xl transition-all duration-150 hover:-translate-y-1 hover:shadow-pixel-lg active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 ${
            insertCoinActive ? 'scale-95 bg-[#FF5FA0] text-white animate-pulse' : ''
          }`}
        >
          <Gamepad2 className="w-7 h-7 text-[#0D0518] group-hover:rotate-12 transition-transform" />
          <span>{insertCoinActive ? 'INSERTING COIN...' : 'ENTER FUNTOPIA'}</span>
          <ArrowRight className="w-7 h-7 text-[#0D0518] group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Character Dialogue Bubble */}
        <div className="mt-6 max-w-md bg-white text-[#0D0518] rounded-2xl border-4 border-[#0D0518] shadow-pixel p-3.5 relative text-xs font-mono font-bold flex items-center gap-3">
          <span className="text-3xl shrink-0">👾</span>
          <p className="text-left text-xs leading-relaxed font-semibold">
            Press <strong className="text-[#FF5FA0]">ENTER FUNTOPIA</strong> to proceed to portal selection!
          </p>
        </div>
      </main>

      {/* FOOTER: PIXEL GRASS & BRICK PLATFORM WALKWAY BASELINE */}
      <footer className="relative z-20 w-full select-none">
        <div className="pixel-grass-strip h-3.5 w-full" />
        <div className="pixel-brick-strip py-3.5 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-white font-bold gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span className="text-[#FFDE25] font-arcade text-[10px]">16-BIT CHAMPIONSHIP ENGINE</span>
              <span className="text-purple-200 text-[10px] hidden md:inline">• PRESS START TO CHOOSE PORTAL</span>
            </div>
            <div className="text-[10px] font-arcade text-white/90">
              HIGH SCORE: 999,990 • SYSTEM LIVE
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
