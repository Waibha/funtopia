/**
 * Lightweight 8-bit Cosmic Retro Sound Synthesizer
 * Uses Web Audio API - no external assets required!
 */

let audioCtx = null;
let soundEnabled = true;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const isAudioEnabled = () => soundEnabled;

export const setAudioEnabled = (val) => {
  soundEnabled = val;
  if (typeof window !== 'undefined') {
    localStorage.setItem('funtopia_sfx_enabled', val ? 'true' : 'false');
  }
};

export const initAudioPreferences = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('funtopia_sfx_enabled');
    if (saved !== null) {
      soundEnabled = saved === 'true';
    }
  }
  return soundEnabled;
};

export const playArcadeSound = (type = 'blip') => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'coin':
        // Retro coin sound: 987Hz -> 1318Hz
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
        break;

      case 'laser':
        // Cosmic laser shot: 880Hz down to 220Hz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;

      case 'blip':
      default:
        // Subtle UI click: short 440Hz blip
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(540, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
        break;
    }
  } catch (err) {
    // Gracefully ignore audio interruptions
  }
};
