import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Sparkles, Play, LogIn, Compass } from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function WelcomeHomepage({ soundEnabled, setSoundEnabled, triggerCelebration }) {
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    soundFx.play('coin');
    setIsStarting(true);
    triggerCelebration();

    setTimeout(() => {
      soundFx.play('fanfare');
      navigate('/select-portal');
    }, 600);
  };

  const handleSignIn = () => {
    soundFx.play('click');
    navigate('/admin');
  };

  const handleMenu = () => {
    soundFx.play('switch');
    navigate('/participant');
  };

  const handleSoundToggle = (e) => {
    e.stopPropagation();
    const newState = soundFx.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <div className="relative min-h-screen bg-[#5C2D91] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Pixel Sky Texture & Floating Clouds */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#FFDE25 1.5px, transparent 1.5px), radial-gradient(#FF5FA0 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />

      {/* Retro Pixel Clouds in Background */}
      <div className="absolute top-12 left-8 sm:left-24 opacity-80 pointer-events-none animate-bounce-subtle">
        <svg width="100" height="42" viewBox="0 0 100 42" fill="none">
          <rect x="24" y="0" width="40" height="12" fill="#E9D5FF" />
          <rect x="12" y="12" width="68" height="12" fill="#E9D5FF" />
          <rect x="0" y="24" width="96" height="18" fill="#F5EEFF" />
          <rect x="18" y="24" width="70" height="6" fill="#C084FC" />
        </svg>
      </div>

      <div className="absolute top-20 right-10 sm:right-28 opacity-75 pointer-events-none">
        <svg width="120" height="48" viewBox="0 0 120 48" fill="none">
          <rect x="30" y="0" width="50" height="14" fill="#E9D5FF" />
          <rect x="14" y="14" width="85" height="14" fill="#E9D5FF" />
          <rect x="0" y="28" width="120" height="20" fill="#F5EEFF" />
          <rect x="20" y="28" width="85" height="8" fill="#C084FC" />
        </svg>
      </div>

      {/* TOP HEADER: RETRO AUDIO & BRAND BAR */}
      <header className="relative z-20 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel-sm flex items-center justify-center text-xl">
            👾
          </div>
          <div className="font-mono text-xs">
            <span className="text-[#FFDE25] font-black uppercase tracking-wider block">
              FUNTOPIA ARCADE
            </span>
            <span className="text-purple-200 text-[10px] font-bold">
              16-BIT RETRO EDITION
            </span>
          </div>
        </div>

        {/* Audio Synthesizer Toggle */}
        <button
          onClick={handleSoundToggle}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border-3 border-[#0D0518] text-xs font-mono font-black shadow-pixel-sm transition-all ${
            soundEnabled
              ? 'bg-[#FFDE25] text-[#0D0518]'
              : 'bg-[#40186D] text-purple-200'
          }`}
          title={soundEnabled ? '8-Bit Audio On' : 'Audio Muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline font-arcade text-[10px]">{soundEnabled ? 'SFX ON' : 'MUTED'}</span>
        </button>
      </header>

      {/* CENTER STAGE: VIBRANT RETRO ARCADE TITLE SEQUENCE */}
      <main className="relative z-20 flex flex-col items-center justify-center text-center px-4 my-auto py-8">
        {/* Subtitle directly matching "LET'S PLAY" in Reference Image */}
        <div className="inline-block px-4 py-1 rounded-full bg-[#FF5FA0] text-white font-arcade text-[11px] sm:text-xs font-black uppercase tracking-widest border-3 border-[#0D0518] shadow-pixel-sm mb-3">
          ✦ LET'S PLAY ✦
        </div>

        {/* Giant Pixel Title "FUNTOPIA" styled like "GAME" in the Reference Image */}
        <div className="relative mb-6">
          <h1
            className="font-bungee text-6xl sm:text-8xl md:text-9xl tracking-wider text-[#FFDE25] pixel-title-yellow select-none transform hover:scale-105 transition-transform duration-200"
          >
            FUNTOPIA
          </h1>
          <p className="font-arcade text-xs sm:text-sm text-[#FF5FA0] tracking-widest mt-2 uppercase font-black">
            INDIVIDUAL ARCADE CHAMPIONSHIP
          </p>
        </div>

        {/* THREE ICONIC RETRO PILL BUTTONS (Matching Screen 3 of Reference Image) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full max-w-md">
          {/* 1. Yellow "SIGN IN" Button */}
          <button
            onClick={handleSignIn}
            className="btn-pixel-yellow w-full sm:w-44 text-center justify-center"
          >
            <LogIn className="w-4 h-4" />
            <span>SIGN IN</span>
          </button>

          {/* 2. Green "MENU" Button */}
          <button
            onClick={handleMenu}
            className="btn-pixel-green w-full sm:w-44 text-center justify-center"
          >
            <Compass className="w-4 h-4" />
            <span>STANDINGS</span>
          </button>

          {/* 3. Pink "START" Button */}
          <button
            onClick={handleStart}
            className="btn-pixel-pink w-full sm:w-44 text-center justify-center animate-pulse"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>START</span>
          </button>
        </div>

        {/* Character Dialogue Bubble (Directly Inspired by Screen 4 & 7) */}
        <div className="mt-8 max-w-sm bg-white text-[#0D0518] rounded-2xl border-3 border-[#0D0518] shadow-pixel p-3.5 relative text-xs font-mono font-bold flex items-center gap-3">
          <span className="text-2xl shrink-0">👾</span>
          <p className="text-left text-xs leading-relaxed">
            Welcome to the championship! Press <strong className="text-[#FF5FA0]">START</strong> to enter the tournament.
          </p>
        </div>
      </main>

      {/* BOTTOM BASELINE: PIXEL BRICK PLATFORM & CHARACTER WALKWAY */}
      <footer className="relative z-20 w-full select-none">
        {/* Lush Pixel Grass Baseline */}
        <div className="pixel-grass-strip h-4 w-full" />

        {/* Pixel Brick Platform (Direct reference to Screen 2, 4, 8, 10) */}
        <div className="pixel-brick-strip py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono text-white font-bold">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span className="text-[#FFDE25] font-arcade text-[10px]">16-BIT ARCADE ENGINE</span>
            </div>
            <div className="text-[10px] font-arcade text-white/90 hidden sm:block">
              PRESS START TO BEGIN
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
