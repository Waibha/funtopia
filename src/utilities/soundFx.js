/**
 * FUNTOPIA Premium Retro-Modern Audio Engine
 * High-end Web Audio API Synthesizer with ambient BGM lounge & tactile SFX.
 * Zero external audio files required, zero copyright issues, instant playback.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.bgmEnabled = false; // OFF by default as required
    this.sfxVolume = 0.8;
    this.bgmVolume = 0.35;

    // Load saved preferences
    try {
      const savedSfx = localStorage.getItem('funtopia_sfx_enabled');
      if (savedSfx !== null) this.sfxEnabled = JSON.parse(savedSfx);

      const savedBgm = localStorage.getItem('funtopia_bgm_enabled');
      if (savedBgm !== null) this.bgmEnabled = JSON.parse(savedBgm);

      const savedSfxVol = localStorage.getItem('funtopia_sfx_vol');
      if (savedSfxVol !== null) this.sfxVolume = parseFloat(savedSfxVol);

      const savedBgmVol = localStorage.getItem('funtopia_bgm_vol');
      if (savedBgmVol !== null) this.bgmVolume = parseFloat(savedBgmVol);
    } catch (e) {}

    // BGM loop state
    this.bgmTimer = null;
    this.bgmGainNode = null;
    this.isBgmPlaying = false;
    this.currentStep = 0;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.bgmGainNode = this.ctx.createGain();
        this.bgmGainNode.gain.setValueAtTime(this.bgmEnabled ? this.bgmVolume * 0.12 : 0, this.ctx.currentTime);
        this.bgmGainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ==========================================
  // SFX CONTROLS & SYNTHESIS
  // ==========================================
  setSfxEnabled(enabled) {
    this.sfxEnabled = enabled;
    try {
      localStorage.setItem('funtopia_sfx_enabled', JSON.stringify(enabled));
    } catch (e) {}
    if (enabled) this.play('click');
  }

  setSfxVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('funtopia_sfx_vol', this.sfxVolume.toString());
    } catch (e) {}
  }

  play(type = 'click') {
    if (!this.sfxEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const masterVol = this.sfxVolume;

      switch (type) {
        case 'click': {
          // Tactile mechanical microswitch click
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.035);
          gain.gain.setValueAtTime(0.09 * masterVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.035);
          break;
        }

        case 'coin': {
          // Shimmering coin reward (B5 to E6)
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(987.77, now); // B5
          osc.frequency.setValueAtTime(1318.51, now + 0.07); // E6
          gain.gain.setValueAtTime(0.12 * masterVol, now);
          gain.gain.setValueAtTime(0.12 * masterVol, now + 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.32);
          break;
        }

        case 'spend': {
          // Mechanical coin drop into arcade cabinet slot
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
          gain.gain.setValueAtTime(0.15 * masterVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }

        case 'select': {
          // Subtle game hover / card select sweep
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(780, now + 0.06);
          gain.gain.setValueAtTime(0.06 * masterVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.06);
          break;
        }

        case 'success': {
          // Satisfying registration & game confirmation chime
          const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
          notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);
            gain.gain.setValueAtTime(0.1 * masterVol, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.22);
          });
          break;
        }

        case 'transition': {
          // Warp sweep between portals and screens
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();
          osc.type = 'sawtooth';
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(400, now);
          filter.frequency.exponentialRampToValueAtTime(2400, now + 0.18);
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.exponentialRampToValueAtTime(480, now + 0.18);
          gain.gain.setValueAtTime(0.08 * masterVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.22);
          break;
        }

        case 'scoreUp': {
          this.play('success');
          break;
        }

        case 'scoreDown': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(280, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
          gain.gain.setValueAtTime(0.12 * masterVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        case 'fanfare': {
          const chord = [
            { f: 523.25, t: 0.0, d: 0.12 },
            { f: 659.25, t: 0.12, d: 0.12 },
            { f: 783.99, t: 0.24, d: 0.12 },
            { f: 1046.50, t: 0.36, d: 0.4 },
          ];
          chord.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(n.f, now + n.t);
            gain.gain.setValueAtTime(0.1 * masterVol, now + n.t);
            gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + n.t);
            osc.stop(now + n.t + n.d + 0.05);
          });
          break;
        }

        default:
          break;
      }
    } catch (e) {}
  }

  // ==========================================
  // AMBIENT ARCADE BGM SYNTHESIZER
  // ==========================================
  setBgmEnabled(enabled) {
    this.bgmEnabled = enabled;
    try {
      localStorage.setItem('funtopia_bgm_enabled', JSON.stringify(enabled));
    } catch (e) {}

    if (enabled) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
  }

  setBgmVolume(vol) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('funtopia_bgm_vol', this.bgmVolume.toString());
    } catch (e) {}
    if (this.bgmGainNode && this.ctx) {
      this.bgmGainNode.gain.setValueAtTime(this.bgmEnabled ? this.bgmVolume * 0.12 : 0, this.ctx.currentTime);
    }
  }

  toggleBgm() {
    this.setBgmEnabled(!this.bgmEnabled);
    return this.bgmEnabled;
  }

  toggleSound() {
    this.setSfxEnabled(!this.sfxEnabled);
    return this.sfxEnabled;
  }

  startBgm() {
    if (this.isBgmPlaying) return;
    this.init();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    if (this.bgmGainNode) {
      this.bgmGainNode.gain.setValueAtTime(this.bgmVolume * 0.12, this.ctx.currentTime);
    }

    // High-end ambient retro lounge arpeggio sequence (C minor pentatonic / Eb major)
    const arpeggio = [
      261.63, 311.13, 392.00, 466.16, 523.25, 466.16, 392.00, 311.13,
      293.66, 349.23, 440.00, 523.25, 587.33, 523.25, 440.00, 349.23,
      233.08, 293.66, 349.23, 466.16, 587.33, 466.16, 349.23, 293.66,
      261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63
    ];

    const stepDuration = 0.28; // 107 BPM gentle pulse

    const tick = () => {
      if (!this.isBgmPlaying || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const freq = arpeggio[this.currentStep % arpeggio.length];

        // Soft filtered triangle synth
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);

        noteGain.gain.setValueAtTime(0.04, now);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.95);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.bgmGainNode);

        osc.start(now);
        osc.stop(now + stepDuration);

        this.currentStep++;
        this.bgmTimer = setTimeout(tick, stepDuration * 1000);
      } catch (e) {
        this.stopBgm();
      }
    };

    tick();
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.bgmGainNode && this.ctx) {
      this.bgmGainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }
}

export const soundFx = new SoundEngine();
