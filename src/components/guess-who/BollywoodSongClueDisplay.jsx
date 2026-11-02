import React from 'react';
import { Music, Disc3, Sparkles } from 'lucide-react';

/**
 * ============================================================================
 * GUESS THE BOLLYWOOD SONG — PROJECTOR CLUE DISPLAY COMPONENT
 * ============================================================================
 * 
 * Central feature of the "Guess the Bollywood Song" game mode.
 * Styled with FUNTOPIA's Cosmic Retro aesthetic:
 * - Deep electric-blue and midnight-blue gradient
 * - Glowing neon-blue border and retro corner brackets
 * - Large, highly legible English paraphrased clue text for projector readability
 * - Animated retro equalizer / sound-wave bars
 * - Ambient musical particle accents
 * 
 * STRICT SECURITY INVARIANT:
 * Strictly receives ONLY presentation parameters: `clueText` (the English paraphrase).
 * NEVER receives or renders Hindi song titles, answers, artist, movie name, or clues!
 */
export default function BollywoodSongClueDisplay({ clueText, className = '' }) {
  if (!clueText) return null;

  return (
    <div
      className={`w-full max-w-4xl mx-auto px-4 sm:px-6 animate-in fade-in zoom-in-95 duration-500 select-none ${className}`}
    >
      {/* Outer Blue Clue Box */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-cyan-400/90 shadow-[0_0_60px_rgba(6,182,212,0.45),inset_0_0_40px_rgba(30,58,138,0.35)] bg-gradient-to-b from-blue-950/95 via-slate-950 to-indigo-950/95 p-6 sm:p-12 lg:p-14">
        
        {/* Subtle Cosmic Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Retro Arcade Corner Brackets */}
        <span className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        <span className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        <span className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-cyan-400 z-20 pointer-events-none shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        <span className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none shadow-[0_0_10px_rgba(6,182,212,0.8)]" />

        {/* Content Stack */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 sm:space-y-8">
          
          {/* Header Badge & Equalizer */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/40 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Disc3 className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-retro text-[11px] sm:text-xs text-cyan-300 tracking-wider uppercase font-bold">
                GUESS THE BOLLYWOOD SONG
              </span>
              <Music className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </div>

            {/* Subtle Animated Equalizer Graphic */}
            <div className="hidden sm:flex items-end gap-1 h-5 px-3 py-1 rounded-md bg-blue-950/60 border border-cyan-500/30">
              {[60, 100, 45, 80, 95, 30, 85, 50, 75, 40, 90, 65].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDuration: `${0.6 + (i % 5) * 0.2}s`,
                    animationDelay: `${(i % 4) * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Prompt Subtitle */}
          <p className="text-[11px] sm:text-xs font-mono text-cyan-300/80 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Identify the original Hindi song from this English paraphrase</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          </p>

          {/* Central English Clue Box Text */}
          <div className="relative px-2 sm:px-6 py-2">
            <p className="text-2xl sm:text-4xl lg:text-5xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-blue-200 leading-snug tracking-tight drop-shadow-[0_2px_15px_rgba(6,182,212,0.6)]">
              "{clueText}"
            </p>
          </div>

          {/* Bottom Equalizer Waves Bar (Mobile & Desktop) */}
          <div className="w-full pt-4 border-t border-cyan-500/20 flex items-center justify-between px-2 text-xs font-mono text-cyan-400/60">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>COSMIC AUDIO FEED</span>
            </span>

            {/* Center animated frequency bars */}
            <div className="flex items-end gap-1 h-4">
              {[40, 70, 90, 60, 100, 50, 80, 40, 75, 95, 30, 85].map((h, i) => (
                <span
                  key={i}
                  className="w-0.5 sm:w-1 bg-cyan-400/70 rounded-full"
                  style={{
                    height: `${h}%`,
                  }}
                />
              ))}
            </div>

            <span className="tracking-widest uppercase text-[10px]">VERBAL ANSWER ONLY</span>
          </div>

        </div>
      </div>
    </div>
  );
}
