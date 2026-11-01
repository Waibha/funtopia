import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Sliders, X, Sparkles, Play, Square, Coins } from 'lucide-react';
import { soundFx } from '../utilities/soundFx';

export default function AudioSettingsModal({ isOpen, onClose }) {
  const [sfxEnabled, setSfxEnabled] = useState(soundFx.sfxEnabled);
  const [bgmEnabled, setBgmEnabled] = useState(soundFx.bgmEnabled);
  const [sfxVol, setSfxVol] = useState(soundFx.sfxVolume);
  const [bgmVol, setBgmVol] = useState(soundFx.bgmVolume);

  if (!isOpen) return null;

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    soundFx.setSfxEnabled(next);
  };

  const handleToggleBgm = () => {
    const next = !bgmEnabled;
    setBgmEnabled(next);
    soundFx.setBgmEnabled(next);
  };

  const handleSfxVolChange = (e) => {
    const val = parseFloat(e.target.value);
    setSfxVol(val);
    soundFx.setSfxVolume(val);
  };

  const handleBgmVolChange = (e) => {
    const val = parseFloat(e.target.value);
    setBgmVol(val);
    soundFx.setBgmVolume(val);
  };

  const testSound = (type) => {
    soundFx.play(type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0518]/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md bg-[#2A0E4E] text-white border-4 border-[#0D0518] rounded-3xl p-6 sm:p-7 shadow-pixel-xl font-sans animate-fade-in">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-purple-800/80 mb-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#FFDE25]" />
            <h3 className="font-bungee text-xl text-[#FFDE25] tracking-wide">
              AUDIO & ATMOSPHERE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-[#40186D] hover:bg-[#FF5FA0] text-white border-2 border-[#0D0518] shadow-pixel-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6 text-xs font-mono">
          {/* 1. Background Music Controller */}
          <div className="bg-[#1A0733] p-4 rounded-2xl border-2 border-[#0D0518] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-[#00F0FF]" />
                <span className="font-black text-white text-sm">RETRO AMBIENT BGM</span>
              </div>
              <button
                onClick={handleToggleBgm}
                className={`px-3 py-1 rounded-xl text-xs font-arcade font-black border-2 border-[#0D0518] shadow-pixel-sm transition-all ${
                  bgmEnabled
                    ? 'bg-[#28C76F] text-[#0D0518]'
                    : 'bg-[#40186D] text-gray-400'
                }`}
              >
                {bgmEnabled ? 'MUSIC ON' : 'MUSIC OFF'}
              </button>
            </div>

            <p className="text-[11px] text-purple-200">
              Subtle retro-modern lounge synthesizer progression (off by default).
            </p>

            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-purple-300 mb-1">
                <span>Music Volume</span>
                <span>{Math.round(bgmVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={bgmVol}
                onChange={handleBgmVolChange}
                disabled={!bgmEnabled}
                className="w-full accent-[#00F0FF] cursor-pointer"
              />
            </div>
          </div>

          {/* 2. Sound Effects Controller */}
          <div className="bg-[#1A0733] p-4 rounded-2xl border-2 border-[#0D0518] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#FFDE25]" />
                <span className="font-black text-white text-sm">ARCADE SOUND EFFECTS</span>
              </div>
              <button
                onClick={handleToggleSfx}
                className={`px-3 py-1 rounded-xl text-xs font-arcade font-black border-2 border-[#0D0518] shadow-pixel-sm transition-all ${
                  sfxEnabled
                    ? 'bg-[#FFDE25] text-[#0D0518]'
                    : 'bg-[#40186D] text-gray-400'
                }`}
              >
                {sfxEnabled ? 'SFX ON' : 'SFX MUTED'}
              </button>
            </div>

            <p className="text-[11px] text-purple-200">
              Tactile button clicks, coin reward shimmer, coin spend clink, and victory fanfare.
            </p>

            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-purple-300 mb-1">
                <span>SFX Volume</span>
                <span>{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVol}
                onChange={handleSfxVolChange}
                disabled={!sfxEnabled}
                className="w-full accent-[#FFDE25] cursor-pointer"
              />
            </div>

            {/* Test SFX Pills */}
            <div className="pt-2 border-t border-purple-900/60">
              <span className="text-[10px] text-purple-300 uppercase font-black block mb-2">
                TEST MICRO-INTERACTION SOUNDS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => testSound('click')}
                  className="px-2.5 py-1 rounded-lg bg-[#40186D] hover:bg-[#5C2D91] text-xs font-bold border border-[#0D0518]"
                >
                  Click
                </button>
                <button
                  type="button"
                  onClick={() => testSound('coin')}
                  className="px-2.5 py-1 rounded-lg bg-[#FFDE25] text-[#0D0518] text-xs font-black border border-[#0D0518]"
                >
                  🪙 Coin Earn
                </button>
                <button
                  type="button"
                  onClick={() => testSound('spend')}
                  className="px-2.5 py-1 rounded-lg bg-[#FF5FA0] text-white text-xs font-bold border border-[#0D0518]"
                >
                  🎰 Coin Spend
                </button>
                <button
                  type="button"
                  onClick={() => testSound('success')}
                  className="px-2.5 py-1 rounded-lg bg-[#28C76F] text-[#0D0518] text-xs font-black border border-[#0D0518]"
                >
                  ✓ Success
                </button>
                <button
                  type="button"
                  onClick={() => testSound('transition')}
                  className="px-2.5 py-1 rounded-lg bg-[#00F0FF] text-[#0D0518] text-xs font-black border border-[#0D0518]"
                >
                  Warp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t-2 border-purple-800/80 flex items-center justify-between">
          <span className="text-[10px] text-purple-300 font-mono">
            Preferences auto-saved to device
          </span>
          <button
            onClick={onClose}
            className="btn-pixel-yellow text-xs py-2 px-4"
          >
            CONFIRM & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
