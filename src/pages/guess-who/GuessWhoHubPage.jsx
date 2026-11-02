import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Maximize2, Minimize2, Radio, Trophy, Award, Sparkles, Heart } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import CosmicBackground from '../../components/ui/CosmicBackground';
import { getDisplayState, subscribeToProjector } from '../../services/guessWhoService';
import { playArcadeSound } from '../../utilities/sound';
import GuessWhoRevealDisplay from './GuessWhoRevealDisplay';
import BollywoodSongClueDisplay from '../../components/guess-who/BollywoodSongClueDisplay';

/**
 * ============================================================================
 * GUESS WHO? PUBLIC PROJECTOR DISPLAY
 * ============================================================================
 * 
 * Presentation interface for the shared venue display / projector.
 * Strictly adheres to security isolation:
 * - During gameplay: Displays ONLY the currently displayed puzzle image or dialogue.
 *   NEVER exposes correct answers, question metadata, admin controls, player names,
 *   scores, qualification status, or turn results.
 * - After gameplay (Game Ended): Displays the final result screen with player name,
 *   score out of 12, and the trophy/encouraging message.
 */
export default function GuessWhoHubPage() {
  const [displayState, setDisplayState] = useState(getDisplayState());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToProjector((updated) => {
      setDisplayState(updated);

      // Trigger celebratory confetti if game ended as a winner
      if (updated.isGameEnded && updated.isWinner) {
        playArcadeSound('coin');
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#ffd000', '#00f0ff', '#ff2a85', '#a855f7'],
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const getFilterStyle = (level) => {
    switch (Number(level)) {
      case 1:
        return 'blur-[24px] contrast-[175%] brightness-90 saturate-150';
      case 2:
        return 'blur-[12px] contrast-[135%] brightness-95';
      case 3:
        return 'blur-[4px] contrast-[110%]';
      case 4:
      default:
        return 'filter-none';
    }
  };

  return (
    <div className="min-h-screen bg-[#070714] text-slate-100 relative selection:bg-pink-500 selection:text-white flex flex-col items-center justify-center overflow-x-hidden">
      <CosmicBackground />
      <div className={`w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[90vh] relative z-10 ${isFullscreen ? 'p-10' : ''}`}>
      {/* Top Projector Utility Bar (Minimalist, No player info or category metadata) */}
      <div className="w-full flex items-center justify-between mb-6 px-4 py-2.5 rounded-xl bg-cosmic-950/80 border border-purple-500/30 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Badge
            variant={displayState.isGameEnded ? (displayState.isWinner ? 'gold' : 'purple') : (displayState.isDisplayed ? 'pink' : 'purple')}
            size="sm"
            pulse={displayState.isDisplayed && !displayState.isGameEnded}
          >
            {displayState.isGameEnded
              ? (displayState.isWinner ? 'CHAMPIONSHIP WINNER' : 'ROUND CONCLUDED')
              : (displayState.isDisplayed ? `LIVE PUZZLE #${displayState.currentSlot || 1}/${displayState.totalQuestions || 12}` : 'STANDBY')}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] hidden sm:inline text-emerald-300 font-retro">REALTIME SYNC ACTIVE</span>
          </div>
        </div>

        {/* Projector Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg bg-purple-950/50 hover:bg-purple-900/50 text-slate-400 hover:text-white border border-purple-500/30 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Projector Fullscreen (F11)'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Presentation Viewport */}
      <Card
        variant="hologram"
        brackets={true}
        className="relative w-full max-w-4xl p-8 sm:p-14 text-center border-purple-500/40 shadow-[0_0_80px_rgba(109,40,217,0.3)] min-h-[520px] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Turn Feedback Overlay (Visible only for the active puzzle slot) */}
        {displayState.feedback && displayState.feedback.puzzleSlot === displayState.currentSlot && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4 animate-in zoom-in-95 duration-200">
            {displayState.feedback.type === 'correct' ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border-2 border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.7)] text-emerald-200 font-retro text-lg sm:text-xl flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
                <span>{displayState.feedback.message || "Brilliant! That's Correct!"}</span>
                <span className="text-xs font-mono bg-yellow-400 text-cosmic-950 px-2 py-0.5 rounded-full font-bold">+1 PT</span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-pink-950 to-purple-950 border-2 border-pink-500/70 shadow-[0_0_35px_rgba(236,72,153,0.6)] text-pink-200 font-retro text-base sm:text-lg flex items-center justify-center gap-3">
                <span className="text-2xl">🛸</span>
                <span>{displayState.feedback.message || "Good Try! Let's Move On!"}</span>
              </div>
            )}
          </div>
        )}
        {/* Case 1: Game Finished -> Display Final Result Screen */}
        {displayState.isGameEnded ? (
          <div className="space-y-6 py-6 animate-in zoom-in-95 duration-500 w-full max-w-2xl">
            {displayState.isWinner ? (
              /* Winner Screen (Score = 7 Early Victory): Trophy Visual & Celebration */
              <div className="space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full" />
                  <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-tr from-yellow-500 to-amber-300 p-1 shadow-[0_0_50px_rgba(250,204,21,0.6)] flex items-center justify-center animate-bounce">
                    <Trophy className="w-16 h-16 text-cosmic-950" />
                  </div>
                </div>

                <Badge variant="gold" size="md">
                  ★ WINNER QUALIFIED (7/7) ★
                </Badge>

                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-5xl font-retro font-bold text-yellow-300 neon-glow-gold">
                    {displayState.resultMessage}
                  </h2>
                  <p className="text-xl sm:text-2xl font-sans text-white font-bold">
                    Contender: <span className="text-cyan-300">{displayState.playerName}</span>
                  </p>
                </div>

                <div className="inline-block p-4 sm:p-6 rounded-2xl bg-cosmic-950/80 border-2 border-yellow-400/60 shadow-xl">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Final Tournament Score
                  </span>
                  <div className="text-4xl sm:text-6xl font-retro text-yellow-400">
                    {displayState.finalScore ?? displayState.score ?? 7} / 7
                  </div>
                  <span className="text-xs font-mono text-slate-300 mt-1 block">
                    Puzzles Played: {displayState.currentSlot ?? displayState.slotsPlayed ?? 7} / 12 (Early Win at 7 Points)
                  </span>
                  <span className="text-xs font-retro text-emerald-400 mt-2 block">
                    QUALIFIED FOR GRAND FINALS
                  </span>
                </div>
              </div>
            ) : (
              /* Non-Winner Screen (Score < 7 after 12 puzzles): Encouraging Visual (NO TROPHY) */
              <div className="space-y-6">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-4xl">
                  🛸
                </div>

                <Badge variant="purple" size="md">
                  ROUND COMPLETED
                </Badge>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-4xl font-retro font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                    {displayState.resultMessage}
                  </h2>
                  <p className="text-lg sm:text-xl font-sans text-white font-semibold">
                    Contender: <span className="text-pink-300">{displayState.playerName}</span>
                  </p>
                </div>

                <div className="inline-block p-4 sm:p-6 rounded-2xl bg-cosmic-950/80 border border-purple-500/40">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    Final Score
                  </span>
                  <div className="text-3xl sm:text-5xl font-retro text-slate-200">
                    {displayState.finalScore ?? displayState.score ?? 0} / 7
                  </div>
                  <span className="text-xs font-mono text-slate-400 mt-1 block">
                    Puzzles Completed: 12 / 12
                  </span>
                  <span className="text-xs font-mono text-pink-400 mt-2 block">
                    Target: 7 correct answers to win
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : !displayState.isDisplayed ? (
          /* Case 2: Standby Screen (Awaiting Coordinator to click Display) */
          <div className="space-y-6 py-12">
            <div className="text-7xl animate-bounce">
              🛸
            </div>
            <Badge variant="cyan" size="md">
              AWAITING COORDINATOR TRANSMISSION
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-retro font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">
              GUESS WHO?
            </h1>
            <p className="max-w-md mx-auto text-sm text-slate-400 font-sans">
              The puzzle will appear on this screen once the event coordinator triggers Display from Mission Control.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-500 pt-2">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Listening on Funtopia Projector Feed...</span>
            </div>
          </div>
        ) : (displayState.songClueText || displayState.subtype === 'bollywood_song_guess' || displayState.revealType === 'song_clue') ? (
          /* Case 3A: Guess the Bollywood Song — Glowing Blue Clue Box */
          <BollywoodSongClueDisplay
            clueText={displayState.songClueText}
          />
        ) : displayState.dialogueText ? (
          /* Case 3B: Bollywood Dialogue Presentation Card */
          <div className="w-full max-w-3xl space-y-6 py-6 animate-in zoom-in-95 duration-300">
            <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-purple-950/60 to-cosmic-950 border-2 border-pink-500/60 shadow-[0_0_60px_rgba(236,72,153,0.35)]">
              <p className="text-2xl sm:text-4xl lg:text-5xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-yellow-200 to-cyan-300 leading-relaxed whitespace-pre-line">
                {displayState.dialogueText}
              </p>
            </div>
          </div>
        ) : (
          /* Case 4: Puzzle Image with Progressive Reveal (Crop, Puzzle Tiles, Silhouette, Blur) */
          <div className="space-y-6 animate-in zoom-in-95 duration-300 w-full flex flex-col items-center">
            <GuessWhoRevealDisplay
              imageUrl={displayState.imageUrl}
              revealType={displayState.revealType}
              revealMetadata={displayState.revealMetadata}
              revealLevel={displayState.revealLevel}
            />
          </div>
        )}
      </Card>
      </div>
    </div>
  );
}
