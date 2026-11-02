import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  ExternalLink, 
  Plus, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Eye, 
  AlertTriangle,
  Tv,
  Check,
  Award,
  RefreshCw,
  Trophy,
  ArrowRight,
  Search,
  Filter,
  Trash2,
  UserPlus
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

// Services & Seed Data
import { 
  getRegisteredPlayers, 
  registerPlayer, 
  generateAutomaticSlab, 
  createManualSlab,
  saveActiveSlab,
  getActiveSlab, 
  removeSlabSlot, 
  replaceSlabSlot, 
  isSlabComplete, 
  recordPlayerTurn, 
  getResultDetails,
  getQuestionLibrary,
  broadcastToProjector, 
  broadcastFinalResultToProjector,
  publishAuthoritativeState,
  submitAuthoritativeTurn,
  getDisplayState,
  archiveCompletedRun,
  getRunHistory,
  getSupabaseSyncStatus,
  subscribeToSyncStatus
} from '../../services/guessWhoService';
import { 
  isSupabaseConfigured,
  signInCoordinator,
  signOutCoordinator,
  getCoordinatorSession,
  onCoordinatorAuthStateChange
} from '../../services/supabaseClient';
import { APPROVED_CATEGORIES } from '../../data/guessWhoSeedDecks';
import { playArcadeSound } from '../../utilities/sound';

// Modals
import AddQuestionModal from '../../components/guess-who/AddQuestionModal';
import QuestionBrowserModal from '../../components/guess-who/QuestionBrowserModal';
import Modal from '../../components/ui/Modal';

export default function AdminGuessWhoPage() {
  // Navigation workflow state:
  // 'step_player' | 'step_generate' | 'step_review' | 'step_gameplay' | 'step_result'
  const [currentStep, setCurrentStep] = useState('step_player');

  // Supabase Auth & Synchronization Telemetry
  const isSupabaseReady = isSupabaseConfigured();
  const [coordinatorUser, setCoordinatorUser] = useState(null);
  const [syncTelemetry, setSyncTelemetry] = useState(getSupabaseSyncStatus());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Player & Slab state
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [activePlayer, setActivePlayer] = useState(null);
  const [slab, setSlab] = useState(null);
  const [playersList, setPlayersList] = useState([]);

  // Manual Generation temporary selection
  const [manualSelectionIds, setManualSelectionIds] = useState([]);
  const [manualSearch, setManualSearch] = useState('');
  const [manualCategory, setManualCategory] = useState('all');

  // Gameplay state
  const FEEDBACK_DISPLAY_DURATION_MS = 1800;
  const [activeFeedback, setActiveFeedback] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // 0 to 19
  const [currentScore, setCurrentScore] = useState(0);
  const [revealLevel, setRevealLevel] = useState(1);
  const [isDisplayedOnScreen, setIsDisplayedOnScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [replacingSlotNumber, setReplacingSlotNumber] = useState(null);

  useEffect(() => {
    setPlayersList(getRegisteredPlayers());
  }, []);

  // Monitor Coordinator Authentication & Supabase Synchronization
  useEffect(() => {
    if (isSupabaseReady) {
      getCoordinatorSession().then(({ user }) => {
        setCoordinatorUser(user);
      });
      const authSub = onCoordinatorAuthStateChange((event, session) => {
        setCoordinatorUser(session?.user || null);
      });
      const syncSub = subscribeToSyncStatus((status) => {
        setSyncTelemetry(status);
      });
      return () => {
        if (typeof authSub?.unsubscribe === 'function') authSub.unsubscribe();
        syncSub();
      };
    }
  }, [isSupabaseReady]);

  const handleCoordinatorLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Coordinator email and password are required.');
      return;
    }
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const { data, error } = await signInCoordinator({ email: loginEmail.trim(), password: loginPassword });
      if (error) {
        setLoginError(error.message);
      } else {
        setCoordinatorUser(data?.user || null);
        setIsLoginModalOpen(false);
        setLoginEmail('');
        setLoginPassword('');
        playArcadeSound('laser');
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCoordinatorLogout = async () => {
    await signOutCoordinator();
    setCoordinatorUser(null);
    playArcadeSound('blip');
  };

  const library = getQuestionLibrary();

  // --------------------------------------------------------------------------
  // STEP 1: ENTER PLAYER NAME
  // --------------------------------------------------------------------------

  const handleStartPlayerFlow = (e) => {
    e.preventDefault();
    const trimmed = playerNameInput.trim();
    if (!trimmed) return;

    playArcadeSound('blip');
    const player = registerPlayer(trimmed);
    setActivePlayer(player);
    setCurrentScore(0);
    setManualSelectionIds([]);
    setCurrentStep('step_generate');
  };

  // --------------------------------------------------------------------------
  // STEP 2: GENERATE SLAB (AUTOMATIC OR MANUAL)
  // --------------------------------------------------------------------------

  const handleGenerateAutomatic = () => {
    try {
      playArcadeSound('laser');
      const newSlab = generateAutomaticSlab(activePlayer.name);
      setSlab(newSlab);
      setCurrentStep('step_review');
    } catch (err) {
      alert(err.message || 'Failed to generate slab.');
    }
  };

  const handleToggleManualSelection = (questionId) => {
    playArcadeSound('blip');
    if (manualSelectionIds.includes(questionId)) {
      setManualSelectionIds(manualSelectionIds.filter((id) => id !== questionId));
    } else {
      if (manualSelectionIds.length >= 12) {
        alert('Maximum 12 questions can be selected for a slab.');
        return;
      }
      setManualSelectionIds([...manualSelectionIds, questionId]);
    }
  };

  const handleConfirmManualGeneration = () => {
    playArcadeSound('coin');
    const chosenQuestions = manualSelectionIds
      .map((id) => library.find((q) => q.id === id))
      .filter(Boolean);

    const newSlab = createManualSlab(activePlayer.name, chosenQuestions);
    setSlab(newSlab);
    setCurrentStep('step_review');
  };

  // --------------------------------------------------------------------------
  // STEP 3: REVIEW & EDIT SLAB
  // --------------------------------------------------------------------------

  const handleRemoveFromSlab = (slotNumber) => {
    playArcadeSound('blip');
    const updated = removeSlabSlot(slab, slotNumber);
    setSlab(updated);
  };

  const handleReplaceSlotQuestion = (newQuestion) => {
    try {
      const updated = replaceSlabSlot(slab, replacingSlotNumber, newQuestion);
      setSlab(updated);
      setReplacingSlotNumber(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStartGame = () => {
    if (!isSlabComplete(slab)) {
      alert('Slab must contain exactly 12 valid questions before starting the game.');
      return;
    }
    playArcadeSound('coin');
    setCurrentIndex(0);
    setCurrentScore(0);
    setRevealLevel(1);
    setIsDisplayedOnScreen(true);
    setActiveFeedback(null);

    const firstQuestion = slab.slots[0]?.question;
    if (firstQuestion) {
      publishAuthoritativeState({
        playerName: activePlayer.name,
        score: 0,
        finalScore: 0,
        currentSlot: 1,
        imageUrl: firstQuestion.image_url,
        dialogueText: firstQuestion.dialogue_text,
        songClueText: firstQuestion.english_clue || firstQuestion.song_clue_text || (firstQuestion.subtype === 'bollywood_song_guess' ? firstQuestion.clue : null),
        subtype: firstQuestion.subtype || null,
        revealType: firstQuestion.reveal_type || (firstQuestion.subtype === 'bollywood_song_guess' ? 'song_clue' : 'crop'),
        revealMetadata: firstQuestion.reveal_metadata || null,
        revealLevel: 1,
        isDisplayed: true,
        feedback: null,
        isGameActive: true,
        isGameEnded: false,
        isWinner: false,
      });
    }

    setCurrentStep('step_gameplay');
  };

  // --------------------------------------------------------------------------
  // STEP 4: ACTUAL GAMEPLAY (CORRECT, WRONG, SKIP)
  // --------------------------------------------------------------------------

  const currentSlot = slab && slab.slots ? slab.slots[currentIndex] : null;
  const currentQuestion = currentSlot ? currentSlot.question : null;
  const totalQuestions = slab && slab.slots ? slab.slots.length : 12;

  const handleDisplayOnProjector = () => {
    if (!currentQuestion) return;
    playArcadeSound('laser');

    publishAuthoritativeState({
      isDisplayed: true,
      imageUrl: currentQuestion.image_url,
      dialogueText: currentQuestion.dialogue_text,
      songClueText: currentQuestion.english_clue || currentQuestion.song_clue_text || (currentQuestion.subtype === 'bollywood_song_guess' ? currentQuestion.clue : null),
      subtype: currentQuestion.subtype || null,
      revealType: currentQuestion.reveal_type || (currentQuestion.subtype === 'bollywood_song_guess' ? 'song_clue' : 'crop'),
      revealMetadata: currentQuestion.reveal_metadata || null,
      revealLevel: revealLevel,
      currentSlot: currentIndex + 1,
      isGameActive: true,
    });

    setIsDisplayedOnScreen(true);
  };

  const handleHideFromProjector = () => {
    playArcadeSound('blip');
    publishAuthoritativeState({ isDisplayed: false });
    setIsDisplayedOnScreen(false);
  };

  const handleSetReveal = (level) => {
    playArcadeSound('blip');
    setRevealLevel(level);

    if (isDisplayedOnScreen && currentQuestion) {
      publishAuthoritativeState({
        isDisplayed: true,
        imageUrl: currentQuestion.image_url,
        dialogueText: currentQuestion.dialogue_text,
        songClueText: currentQuestion.english_clue || currentQuestion.song_clue_text || (currentQuestion.subtype === 'bollywood_song_guess' ? currentQuestion.clue : null),
        subtype: currentQuestion.subtype || null,
        revealType: currentQuestion.reveal_type || (currentQuestion.subtype === 'bollywood_song_guess' ? 'song_clue' : 'crop'),
        revealMetadata: currentQuestion.reveal_metadata || null,
        revealLevel: level,
        currentSlot: currentIndex + 1,
        isGameActive: true,
      });
    }
  };

  const handleFinishGame = () => {
    if (isSubmitting || !slab) return;
    setIsSubmitting(true);
    playArcadeSound('coin');

    const completedSlab = { ...slab, status: 'completed' };
    saveActiveSlab(completedSlab);
    setSlab(completedSlab);

    const isEarlyWin = currentScore >= 7;
    archiveCompletedRun(activePlayer.name, currentScore, completedSlab, isEarlyWin);

    const finalDetails = {
      ...getResultDetails(currentScore),
      finalScore: currentScore,
      isEarlyWin,
    };
    setGameResult(finalDetails);

    publishAuthoritativeState({
      playerName: activePlayer.name,
      score: currentScore,
      finalScore: currentScore,
      currentSlot: currentIndex + 1,
      imageUrl: null,
      dialogueText: null,
      feedback: null,
      isGameActive: false,
      isGameEnded: true,
      isWinner: finalDetails.isWinner,
      resultMessage: finalDetails.message,
    });

    if (finalDetails.isWinner) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ffd000', '#00f0ff', '#ff2a85'],
      });
    }

    setCurrentStep('step_result');
    setIsSubmitting(false);
  };

  const handleAdvanceOrFinish = (finalOrNextScore, currentSlab) => {
    // A) Early Game Completion: 7 points (7 correct answers) reached at any point in the run
    // B) Natural completion: 12th puzzle concluded
    const isEarlyWin = finalOrNextScore >= 7;
    const isRunCompleted = isEarlyWin || currentIndex >= totalQuestions - 1;

    if (isRunCompleted) {
      // Mark slab status as completed
      const completedSlab = { ...currentSlab, status: 'completed' };
      saveActiveSlab(completedSlab);
      setSlab(completedSlab);

      // Save completed run and score in player history
      archiveCompletedRun(activePlayer.name, finalOrNextScore, completedSlab, isEarlyWin);

      // Evaluate final result
      const finalDetails = {
        ...getResultDetails(finalOrNextScore),
        finalScore: finalOrNextScore,
        isEarlyWin,
      };
      setGameResult(finalDetails);

      // Broadcast final celebration/result to player laptop
      publishAuthoritativeState({
        playerName: activePlayer.name,
        score: finalOrNextScore,
        finalScore: finalOrNextScore,
        currentSlot: currentIndex + 1,
        imageUrl: null,
        dialogueText: null,
        feedback: null, // Clear feedback so it never appears on result screen!
        isGameActive: false,
        isGameEnded: true,
        isWinner: finalDetails.isWinner,
        resultMessage: finalDetails.message,
      });

      if (finalDetails.isWinner) {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#ffd000', '#00f0ff', '#ff2a85'],
        });
      }

      setCurrentStep('step_result');
      setIsSubmitting(false);
      return;
    }

    // Advance to next puzzle automatically and display new image on player laptop
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setRevealLevel(1);
    setIsDisplayedOnScreen(true);
    const nextSlot = currentSlab.slots[nextIndex];

    if (nextSlot && nextSlot.question) {
      publishAuthoritativeState({
        playerName: activePlayer.name,
        score: finalOrNextScore,
        finalScore: finalOrNextScore,
        currentSlot: nextIndex + 1,
        imageUrl: nextSlot.question.image_url,
        dialogueText: nextSlot.question.dialogue_text,
        songClueText: nextSlot.question.english_clue || nextSlot.question.song_clue_text || (nextSlot.question.subtype === 'bollywood_song_guess' ? nextSlot.question.clue : null),
        subtype: nextSlot.question.subtype || null,
        revealType: nextSlot.question.reveal_type || (nextSlot.question.subtype === 'bollywood_song_guess' ? 'song_clue' : 'crop'),
        revealMetadata: nextSlot.question.reveal_metadata || null,
        revealLevel: 1,
        isDisplayed: true,
        feedback: null, // Cleared! Stale feedback cannot appear on next puzzle!
        isGameActive: true,
        isGameEnded: false,
      });
    }

    setIsSubmitting(false);
  };

  const handleRecordTurn = async (resultType) => {
    if (isSubmitting || !slab || !currentQuestion) return;
    setIsSubmitting(true);
    playArcadeSound(resultType === 'correct' ? 'coin' : 'blip');

    try {
      const nextIndex = currentIndex + 1;
      const nextSlot = (nextIndex < totalQuestions && slab.slots) ? slab.slots[nextIndex] : null;
      const nextQuestion = nextSlot ? nextSlot.question : null;

      // 1. Submit atomic scoring transaction (PostgreSQL RPC or transactional local fallback)
      const updatedState = await submitAuthoritativeTurn({
        sessionId: slab.id,
        slotNumber: currentIndex + 1,
        result: resultType,
        nextQuestion: nextQuestion,
      });

      // 2. Synchronize local state with authoritative result
      const refreshedSlab = getActiveSlab() || slab;
      setSlab(refreshedSlab);
      setPlayersList(getRegisteredPlayers());
      setCurrentScore(updatedState.score);

      // 3. Early Win at 7 or natural completion after 12th puzzle
      if (updatedState.isGameEnded) {
        const finalDetails = {
          ...getResultDetails(updatedState.score),
          finalScore: updatedState.finalScore ?? updatedState.score,
          isWinner: updatedState.isWinner,
          isEarlyWin: updatedState.isEarlyWin,
        };
        setGameResult(finalDetails);

        if (updatedState.isWinner) {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#ffd000', '#00f0ff', '#ff2a85'],
          });
        }

        setCurrentStep('step_result');
        setIsSubmitting(false);
        return;
      }

      // 4. If Skip: move immediately to next puzzle (0 points, no feedback popup)
      if (resultType === 'skip') {
        setActiveFeedback(null);
        setCurrentIndex(nextIndex);
        setRevealLevel(1);
        setIsDisplayedOnScreen(true);
        setIsSubmitting(false);
        return;
      }

      // 5. If Correct or Wrong: display cheerful/gentle feedback on projector, then advance
      setActiveFeedback(updatedState.feedback);
      setTimeout(() => {
        setActiveFeedback(null);
        setCurrentIndex(nextIndex);
        setRevealLevel(1);
        setIsDisplayedOnScreen(true);
        setIsSubmitting(false);
      }, FEEDBACK_DISPLAY_DURATION_MS);

    } catch (err) {
      console.error('Scoring turn error:', err);
      alert(err.message || 'Scoring action failed.');
      setIsSubmitting(false);
    }
  };

  // Reset to Step 1 for next player
  const handleResetForNextPlayer = () => {
    playArcadeSound('blip');
    setPlayerNameInput('');
    setActivePlayer(null);
    setSlab(null);
    setGameResult(null);
    setCurrentScore(0);
    setCurrentIndex(0);
    setIsDisplayedOnScreen(false);
    setActiveFeedback(null);
    setPlayersList(getRegisteredPlayers());

    publishAuthoritativeState({
      isGameActive: false,
      isGameEnded: false,
      isDisplayed: false,
      feedback: null,
      imageUrl: null,
      dialogueText: null,
      score: 0,
      finalScore: 0,
      currentSlot: 1,
      playerName: 'Contender',
    });
    setPlayersList(getRegisteredPlayers());
    setCurrentStep('step_player');
  };

  // Filtered library for manual generation
  const filteredLibrary = library.filter((q) => {
    const matchCat = manualCategory === 'all' || q.category === manualCategory;
    const matchSearch =
      q.title.toLowerCase().includes(manualSearch.toLowerCase()) ||
      q.correct_answer.toLowerCase().includes(manualSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const filledSlotsCount = slab && slab.slots ? slab.slots.filter((s) => s.question).length : 0;
  const currentSlabQuestionIds = new Set(
    slab ? slab.slots.filter((s) => s.question).map((s) => s.question.id) : []
  );

  return (
    <div className="space-y-6 pb-12 font-sans max-w-5xl mx-auto">
      {/* Top Breadcrumb & Workflow Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="pink" size="sm">GUESS WHO? COORDINATOR</Badge>
            <span className="text-xs font-mono text-cyan-300">
              {currentStep === 'step_player' && 'STEP 1: ENTER PLAYER'}
              {currentStep === 'step_generate' && 'STEP 2: GENERATE SLAB'}
              {currentStep === 'step_review' && 'STEP 3: REVIEW / EDIT SLAB'}
              {currentStep === 'step_gameplay' && 'STEP 4: LIVE GAMEPLAY'}
              {currentStep === 'step_result' && 'FINAL RESULT'}
            </span>
          </div>
          <h1 className="text-xl font-retro font-bold text-white tracking-wide">
            MISSION OPERATOR WORKFLOW
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Puzzle to Library
          </Button>

          <a
            href="/guess-who"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button variant="cyan" size="sm" sound="laser">
              <Tv className="w-3.5 h-3.5 mr-1" /> Projector Screen <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </a>
        </div>
      </div>

      {/* Supabase Synchronization & Coordinator Auth Telemetry Banner */}
      <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          {isSupabaseReady ? (
            <>
              <Badge variant={coordinatorUser ? 'emerald' : 'gold'} size="sm">
                {coordinatorUser ? '🟢 SUPABASE SYNC ACTIVE' : '🟡 SUPABASE ONLINE'}
              </Badge>
              {coordinatorUser ? (
                <span className="text-slate-300">
                  Coordinator: <strong className="text-cyan-300">{coordinatorUser.email}</strong>
                </span>
              ) : (
                <span className="text-amber-300">
                  Sign in as coordinator to synchronize authoritative scores to Supabase
                </span>
              )}
            </>
          ) : (
            <>
              <Badge variant="purple" size="sm">⚪ OFFLINE MODE</Badge>
              <span className="text-slate-400">
                Local in-memory / localStorage mode active (No Supabase credentials detected)
              </span>
            </>
          )}
        </div>

        {isSupabaseReady && (
          <div className="flex items-center gap-2 shrink-0">
            {coordinatorUser ? (
              <Button variant="ghost" size="sm" onClick={handleCoordinatorLogout} className="text-[11px] py-1 px-2.5">
                Sign Out
              </Button>
            ) : (
              <Button variant="cyan" size="sm" onClick={() => setIsLoginModalOpen(true)} className="text-[11px] py-1 px-2.5 shadow-sm">
                🔐 Coordinator Login
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Sync Warning Banner if write error exists */}
      {isSupabaseReady && syncTelemetry?.error && (
        <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs font-mono flex items-center justify-between gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Supabase Sync Notice:</strong> {syncTelemetry.error}. Operating in transactional local fallback mode.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSyncTelemetry({ ...syncTelemetry, error: null })}
            className="text-amber-400 hover:text-white text-[11px] underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STEP 1: ENTER PLAYER NAME                                             */}
      {/* ===================================================================== */}
      {currentStep === 'step_player' && (
        <div className="space-y-6 animate-in fade-in">
          <Card variant="hologram" brackets={true} className="p-8 text-center max-w-xl mx-auto space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-3xl">
              🧑‍🚀
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-retro font-bold text-white">
                ENTER PLAYER NAME
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Each player gets their own independent 12-puzzle run.
              </p>
            </div>

            <form onSubmit={handleStartPlayerFlow} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Player Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma, Priya Patel..."
                  value={playerNameInput}
                  onChange={(e) => setPlayerNameInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-cosmic-950 border border-cyan-400/50 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-300"
                />
              </div>

              <Button variant="pink" size="md" type="submit" className="w-full">
                <Play className="w-4 h-4 fill-white mr-1.5" /> Generate Slab
              </Button>
            </form>
          </Card>

          {/* Previous Players Scoreboard */}
          {playersList.length > 0 && (
            <Card variant="default" brackets={true} className="p-5 space-y-3">
              <h3 className="font-retro text-xs text-yellow-300">
                RECENT PLAYER SCORES & RESULTS
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-purple-950/40 text-slate-400 uppercase font-retro text-[9px] border-b border-purple-500/20">
                    <tr>
                      <th className="py-2 px-3">Player</th>
                      <th className="py-2 px-3 text-center">Score (Max 7)</th>
                      <th className="py-2 px-3 text-center">Wrong</th>
                      <th className="py-2 px-3 text-center">Skipped</th>
                      <th className="py-2 px-3 text-right">Qualification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500/10">
                    {playersList.map((p) => (
                      <tr key={p.id || p.name}>
                        <td className="py-2.5 px-3 font-semibold text-white">{p.name}</td>
                        <td className="py-2.5 px-3 text-center text-yellow-400 font-retro">{p.points} / 7</td>
                        <td className="py-2.5 px-3 text-center text-rose-400">{p.wrong}</td>
                        <td className="py-2.5 px-3 text-center text-amber-400">{p.skipped}</td>
                        <td className="py-2.5 px-3 text-right">
                          <Badge variant={p.isQualified ? 'green' : 'red'} size="sm">
                            {p.isQualified ? 'QUALIFIED (7/7 WON)' : 'NOT QUALIFIED'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* STEP 2: GENERATE SLAB (TWO OPTIONS: AUTOMATIC OR MANUAL)              */}
      {/* ===================================================================== */}
      {currentStep === 'step_generate' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
            <span className="font-mono text-xs text-slate-300">
              Contender: <strong className="text-cyan-300 text-sm">{activePlayer.name}</strong>
            </span>
            <button
              onClick={() => setCurrentStep('step_player')}
              className="text-xs font-mono text-pink-400 hover:underline"
            >
              Change Player
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option A: Automatic Generation */}
            <Card variant="pink" brackets={true} className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="pink" size="sm">OPTION A</Badge>
                  <span className="text-xs font-mono text-pink-300">ONE-CLICK SLAB</span>
                </div>
                <h3 className="text-lg font-retro text-white">
                  AUTOMATIC GENERATION
                </h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Generates 12 balanced puzzles using the exact championship formula:
                </p>
                <ul className="text-xs font-mono text-slate-400 space-y-1">
                  <li>• <strong>3 Questions:</strong> Flags</li>
                  <li>• <strong>7 Questions:</strong> 1 from each of the other 7 categories</li>
                  <li>• <strong>2 Questions:</strong> Random Wildcards</li>
                  <li>• <strong>Total:</strong> Exactly 12 unique puzzles</li>
                </ul>
              </div>

              <Button
                variant="pink"
                size="md"
                onClick={handleGenerateAutomatic}
                className="w-full"
              >
                ⚡ Generate Automatic Slab
              </Button>
            </Card>

            {/* Option B: Manual Selection Trigger */}
            <Card variant="cyan" brackets={true} className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="cyan" size="sm">OPTION B</Badge>
                  <span className="text-xs font-mono text-cyan-300">CUSTOM SELECTION</span>
                </div>
                <h3 className="text-lg font-retro text-white">
                  MANUAL GENERATION
                </h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Browse the master question library and manually curate the puzzles you want for this player's run.
                </p>
                <p className="text-xs font-mono text-cyan-400">
                  Select questions directly from the catalog below (up to 12).
                </p>
              </div>

              <div className="text-xs font-mono text-yellow-300">
                Selected so far: <strong>{manualSelectionIds.length} / 12</strong>
              </div>
            </Card>
          </div>

          {/* Manual Selection Library Browser */}
          <Card variant="default" brackets={true} className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-3">
              <div>
                <h3 className="font-retro text-xs text-cyan-300">
                  MANUAL SELECTION BROWSER ({manualSelectionIds.length}/12 SELECTED)
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Select exactly 12 questions from the library to assemble this slab.
                </p>
              </div>

              <Button
                variant={manualSelectionIds.length === 12 ? 'cyan' : 'ghost'}
                size="sm"
                disabled={manualSelectionIds.length !== 12}
                onClick={handleConfirmManualGeneration}
                className={manualSelectionIds.length === 12 ? 'shadow-neon-cyan' : ''}
              >
                {manualSelectionIds.length === 12 ? (
                  <>Complete Manual Generation (12/12) <ArrowRight className="w-3.5 h-3.5 ml-1" /></>
                ) : (
                  <>Select 12 Questions ({manualSelectionIds.length}/12)</>
                )}
              </Button>
            </div>

            {/* Search and Category Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions or answers..."
                  value={manualSearch}
                  onChange={(e) => setManualSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-cosmic-950 border border-purple-500/40 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <select
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value)}
                className="px-3 py-2 rounded-lg bg-cosmic-950 border border-purple-500/40 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="all">All Categories</option>
                {APPROVED_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Questions Table */}
            <div className="max-h-72 overflow-y-auto space-y-2">
              {filteredLibrary.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-mono text-xs border border-dashed border-purple-500/30 rounded-lg">
                  Question library is currently empty. Add questions via the Add Question modal or populate the master dataset from manual image folders.
                </div>
              ) : (
                filteredLibrary.map((q) => {
                const isChecked = manualSelectionIds.includes(q.id);
                const catObj = APPROVED_CATEGORIES.find((c) => c.id === q.category);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleManualSelection(q.id)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-cyan-950/60 border-cyan-400 text-white'
                        : 'bg-cosmic-950/60 border-purple-500/20 text-slate-300 hover:border-purple-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent onClick
                        className="rounded accent-cyan-400 w-4 h-4"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs">{q.title}</span>
                          <Badge variant="purple" size="sm">{catObj ? catObj.label : q.category}</Badge>
                        </div>
                        <span className="text-[11px] font-mono text-yellow-300">
                          Answer: {q.correct_answer}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }))}
            </div>
          </Card>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STEP 3: REVIEW AND EDIT SLAB                                          */}
      {/* ===================================================================== */}
      {currentStep === 'step_review' && slab && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-retro text-xs text-white">SLAB REVIEW:</span>
                <Badge variant={filledSlotsCount === 12 ? 'green' : 'red'} size="sm">
                  {filledSlotsCount} / 12 QUESTIONS ASSIGNED
                </Badge>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Contender: <strong className="text-cyan-300">{slab.playerName}</strong> • You can remove or replace any puzzle before starting.
              </p>
            </div>

            {/* Start Game Action Button */}
            <div className="flex items-center gap-3">
              <Button
                variant="pink"
                size="md"
                disabled={filledSlotsCount !== 12}
                onClick={handleStartGame}
                className="shadow-neon-pink"
              >
                <Play className="w-4 h-4 fill-white mr-1.5" /> Start Game
              </Button>
            </div>
          </div>

          {filledSlotsCount !== 12 && (
            <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Start Game is disabled until exactly 12 questions are present. (Currently: {filledSlotsCount}/12). Assign missing slots using the buttons below.
              </span>
            </div>
          )}

          {/* 12 Slots Visual Review Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {slab.slots.map((slot) => {
              const isEmpty = !slot.question || slot.status === 'empty';
              const catObj = slot.question
                ? APPROVED_CATEGORIES.find((c) => c.id === slot.question.category)
                : null;

              return (
                <Card
                  key={slot.slotNumber}
                  variant={isEmpty ? 'default' : 'hologram'}
                  brackets={false}
                  className={`p-3.5 flex flex-col justify-between ${
                    isEmpty ? 'border-dashed border-amber-500/60 bg-amber-950/20' : 'border-purple-500/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-retro text-yellow-300">#{slot.slotNumber}</span>
                      {isEmpty ? (
                        <Badge variant="red" size="sm">EMPTY</Badge>
                      ) : (
                        <Badge variant="purple" size="sm">{catObj ? catObj.label : ''}</Badge>
                      )}
                    </div>

                    {isEmpty ? (
                      <div className="py-6 text-center text-amber-400 text-xs font-mono">
                        Slot Empty
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="w-full h-24 rounded bg-cosmic-950 border border-purple-500/30 overflow-hidden flex items-center justify-center">
                          {slot.question.image_url ? (
                            <img src={slot.question.image_url} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-2xl">🎭</span>
                          )}
                        </div>
                        <h4 className="font-semibold text-xs text-white truncate">
                          {slot.question.title}
                        </h4>
                        <p className="text-[10px] font-mono text-yellow-300 truncate">
                          Ans: {slot.question.correct_answer}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Slot action buttons */}
                  <div className="pt-3 border-t border-purple-500/20 flex items-center gap-1.5 justify-end">
                    {isEmpty ? (
                      <button
                        type="button"
                        onClick={() => setReplacingSlotNumber(slot.slotNumber)}
                        className="text-[10px] font-mono text-cyan-300 hover:text-white underline"
                      >
                        + Assign Question
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setReplacingSlotNumber(slot.slotNumber)}
                          className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/30"
                        >
                          Swap
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromSlab(slot.slotNumber)}
                          className="text-[10px] font-mono text-rose-400 hover:text-rose-300 p-1"
                          title="Remove from slab"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STEP 4: ACTUAL GAMEPLAY — ADMIN INTERFACE                             */}
      {/* ===================================================================== */}
      {currentStep === 'step_gameplay' && slab && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Gameplay Status Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card variant="default" brackets={false} className="p-3 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Active Player</span>
              <span className="font-bold text-sm text-cyan-300 truncate block">{activePlayer.name}</span>
            </Card>

            <Card variant="default" brackets={false} className="p-3 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Current Score (Max 7)</span>
              <span className="font-retro text-base text-yellow-300">{currentScore} / 7</span>
            </Card>

            <Card variant="default" brackets={false} className="p-3 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Puzzle Progress</span>
              <span className="font-retro text-base text-white">{currentIndex + 1}/12</span>
            </Card>

            <Card variant="default" brackets={false} className="p-3 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Projector Status</span>
              <span className={`text-xs font-mono font-bold ${isDisplayedOnScreen ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isDisplayedOnScreen ? '● LIVE ON SCREEN' : '○ STANDBY'}
              </span>
            </Card>
          </div>

          {/* Notice on 12th Puzzle: All images reached */}
          {currentIndex === totalQuestions - 1 && (
            <div className="p-4 rounded-xl bg-purple-900/70 border-2 border-yellow-400 text-yellow-300 font-retro text-xs text-center flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_25px_rgba(250,204,21,0.3)] animate-in fade-in">
              <span className="tracking-wide text-sm">
                ★ All images have been completed! (Final Puzzle 12/12) ★
              </span>
              <button
                type="button"
                onClick={handleFinishGame}
                className="px-4 py-2 rounded-lg bg-yellow-400 text-cosmic-950 font-bold hover:brightness-110 font-mono text-xs shadow-md transition-all active:scale-95"
              >
                Finish & Show Final Result
              </button>
            </div>
          )}

          {/* Current Question Admin Workstation Card */}
          {currentQuestion && (
            <Card variant="hologram" brackets={true} className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <span className="font-retro text-xs text-yellow-300">
                  PUZZLE #{currentIndex + 1} OF 12
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {APPROVED_CATEGORIES.find((c) => c.id === currentQuestion.category)?.label}
                </span>
              </div>

              {/* Secret Answer & Prompt (ADMIN ONLY) */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-950/60 via-purple-950/50 to-cosmic-950 border-2 border-yellow-500/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-retro text-[10px] text-yellow-300 tracking-wider">
                    {currentQuestion.subtype === 'bollywood_song_guess'
                      ? 'CORRECT HINDI SONG TITLE (CONFIDENTIAL TO ADMIN):'
                      : currentQuestion.subtype === 'guess_the_language'
                      ? 'CORRECT LANGUAGE (CONFIDENTIAL TO ADMIN):'
                      : currentQuestion.subtype === 'scientist' || currentQuestion.category === 'scientists'
                      ? 'CORRECT SCIENTIST (CONFIDENTIAL TO ADMIN):'
                      : currentQuestion.subtype === 'statue'
                      ? 'CORRECT STATUE / MONUMENT (CONFIDENTIAL TO ADMIN):'
                      : 'CORRECT ANSWER (CONFIDENTIAL TO ADMIN):'}
                  </span>
                  <Badge variant="gold" size="sm">SECRET</Badge>
                </div>
                <div className="text-2xl sm:text-3xl font-retro font-bold text-yellow-400 neon-glow-gold">
                  {currentQuestion.correct_answer}
                </div>
                {currentQuestion.subtype === 'guess_the_language' && (
                  <div className="text-xs font-mono text-cyan-300 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-yellow-500/20">
                    <div>
                      <span className="font-retro text-[9px] text-cyan-400 uppercase">Greeting: </span>
                      <span className="font-bold text-white">"{currentQuestion.greeting}"</span>
                    </div>
                    {currentQuestion.script && (
                      <div>
                        <span className="font-retro text-[9px] text-emerald-400 uppercase">Script: </span>
                        <span className="font-bold text-emerald-300">{currentQuestion.script}</span>
                      </div>
                    )}
                  </div>
                )}
                {currentQuestion.movie && (
                  <div className="text-xs font-mono text-cyan-300 flex items-center gap-1.5 pt-1 border-t border-yellow-500/20">
                    <span className="font-retro text-[9px] text-cyan-400 uppercase">Movie / Year:</span>
                    <span className="font-bold">{currentQuestion.movie}</span>
                  </div>
                )}
                {currentQuestion.field && (
                  <div className="text-xs font-mono text-emerald-300 flex items-center gap-1.5 pt-1 border-t border-yellow-500/20">
                    <span className="font-retro text-[9px] text-emerald-400 uppercase">Field of Science:</span>
                    <span className="font-bold">{currentQuestion.field}</span>
                  </div>
                )}
                {currentQuestion.location && (
                  <div className="text-xs font-mono text-amber-300 flex items-center gap-1.5 pt-1 border-t border-yellow-500/20">
                    <span className="font-retro text-[9px] text-amber-400 uppercase">Location:</span>
                    <span className="font-bold">{currentQuestion.location}</span>
                  </div>
                )}
                {currentQuestion.sculptor && (
                  <div className="text-xs font-mono text-purple-300 flex items-center gap-1.5 pt-1">
                    <span className="font-retro text-[9px] text-purple-400 uppercase">Sculptor / Builder:</span>
                    <span className="font-bold">{currentQuestion.sculptor}</span>
                  </div>
                )}
                {currentQuestion.clue && currentQuestion.subtype !== 'bollywood_song_guess' && (
                  <p className="text-xs text-slate-300 font-mono pt-1 border-t border-yellow-500/20">
                    Trivia/Clue: {currentQuestion.clue}
                  </p>
                )}
              </div>

              {/* Admin Puzzle Image Preview (Image-Based Questions) */}
              {currentQuestion.image_url && (
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center gap-4">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-cyan-400/60 bg-black/50 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center">
                    <img
                      src={currentQuestion.image_url}
                      alt="Puzzle Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1 text-xs font-mono text-slate-300 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-retro text-[10px] text-cyan-300 uppercase tracking-wider">
                        ACTUAL PUZZLE IMAGE (ADMIN MONITOR)
                      </span>
                      {currentQuestion.subtype === 'scientist' || currentQuestion.category === 'scientists' ? (
                        <Badge variant="emerald" size="sm">🔬 Scientist</Badge>
                      ) : currentQuestion.subtype === 'statue' ? (
                        <Badge variant="gold" size="sm">🗿 Statue</Badge>
                      ) : currentQuestion.subtype === 'guess_the_language' ? (
                        <Badge variant="cyan" size="sm">🌐 Guess the Language</Badge>
                      ) : null}
                    </div>
                    <p className="text-slate-400 text-[11px] truncate">{currentQuestion.image_url}</p>
                    {currentQuestion.greeting && currentQuestion.subtype === 'guess_the_language' && (
                      <p className="text-cyan-300 text-xs">💬 Greeting: <strong>"{currentQuestion.greeting}"</strong> ({currentQuestion.script})</p>
                    )}
                    {currentQuestion.field && (
                      <p className="text-emerald-300 text-xs">🔬 Field: <strong>{currentQuestion.field}</strong></p>
                    )}
                    {currentQuestion.location && (
                      <p className="text-amber-300 text-xs">📍 Location: <strong>{currentQuestion.location}</strong></p>
                    )}
                  </div>
                </div>
              )}

              {/* Question Metadata & Clues (ADMIN WORKSTATION - NO LIVE PREVIEW) */}
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      currentQuestion.subtype === 'bollywood_song_guess'
                        ? 'cyan'
                        : currentQuestion.subtype === 'guess_the_language'
                        ? 'blue'
                        : currentQuestion.subtype === 'scientist' || currentQuestion.category === 'scientists'
                        ? 'emerald'
                        : currentQuestion.subtype === 'statue'
                        ? 'gold'
                        : 'purple'
                    }
                    size="sm"
                  >
                    {currentQuestion.subtype === 'bollywood_song_guess'
                      ? '🎵 Guess the Bollywood Song'
                      : currentQuestion.subtype === 'guess_the_language'
                      ? '🌐 Guess the Language'
                      : currentQuestion.subtype === 'scientist' || currentQuestion.category === 'scientists'
                      ? '🔬 Scientist'
                      : currentQuestion.subtype === 'statue'
                      ? '🗿 Statue & Monument'
                      : APPROVED_CATEGORIES.find((c) => c.id === currentQuestion.category)?.label}
                  </Badge>
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: {currentQuestion.id} • Displayed on Player Laptop
                  </span>
                </div>
                <h3 className="font-bold text-base text-white">
                  {currentQuestion.title}
                </h3>
                {currentQuestion.subtype === 'bollywood_song_guess' ? (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/70 to-indigo-950/70 border border-cyan-400/50 space-y-1 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                    <span className="text-[10px] font-retro text-cyan-300 uppercase block tracking-wider">
                      ENGLISH PARAPHRASED CLUE (DISPLAYED ON PROJECTOR):
                    </span>
                    <p className="text-sm sm:text-base text-cyan-100 font-sans font-semibold italic">
                      "{currentQuestion.english_clue || currentQuestion.clue}"
                    </p>
                  </div>
                ) : currentQuestion.dialogue_text ? (
                  <div className="p-3 rounded-lg bg-pink-950/30 border border-pink-500/40 text-pink-200 font-sans italic text-sm">
                    "{currentQuestion.dialogue_text}"
                  </div>
                ) : (
                  <p className="text-xs text-slate-300 font-sans">
                    "{currentQuestion.prompt}"
                  </p>
                )}
              </div>

              {/* Progressive Reveal Stepper (If Image) */}
              {currentQuestion.category !== 'bollywood_dialogues' && currentQuestion.subtype !== 'bollywood_song_guess' && currentQuestion.reveal_type !== 'song_clue' && (
                <div className="space-y-2">
                  <span className="font-retro text-[10px] text-cyan-300 block">
                    IMAGE REVEAL STAGES (ADMIN CONTROL):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { level: 1, label: 'Stage 1 (25%)', sub: 'Heavy Blur' },
                      { level: 2, label: 'Stage 2 (50%)', sub: 'Medium Blur' },
                      { level: 3, label: 'Stage 3 (75%)', sub: 'Light Blur' },
                      { level: 4, label: 'Stage 4 (100%)', sub: 'Crystal Clear' },
                    ].map((stg) => (
                      <button
                        key={stg.level}
                        type="button"
                        onClick={() => handleSetReveal(stg.level)}
                        className={`p-2 rounded-lg border text-left font-mono text-xs transition-all ${
                          revealLevel === stg.level
                            ? 'bg-pink-600/30 border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.4)] text-pink-300'
                            : 'bg-cosmic-950/60 border-purple-500/30 text-slate-300 hover:border-pink-500/40'
                        }`}
                      >
                        <span className="font-retro text-[9px] block mb-0.5">{stg.label}</span>
                        <span className="text-[10px] text-slate-400">{stg.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Explicit Display Button */}
              <div className="pt-2 flex items-center gap-3">
                {!isDisplayedOnScreen ? (
                  <Button
                    variant="cyan"
                    size="md"
                    onClick={handleDisplayOnProjector}
                    className="shadow-neon-cyan"
                  >
                    <Tv className="w-4 h-4 mr-1.5" /> Display on Projector Screen
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={handleHideFromProjector}
                  >
                    Hide from Projector
                  </Button>
                )}
              </div>

              {/* Active Feedback Banner to coordinator */}
              {activeFeedback && (
                <div className={`p-3 rounded-xl border text-xs font-retro text-center animate-pulse flex items-center justify-center gap-2 ${
                  activeFeedback.type === 'correct'
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                    : 'bg-rose-950/80 border-rose-400 text-rose-300'
                }`}>
                  <span>★</span>
                  <span>Transmitting to Player Screen: "{activeFeedback.message}" — Transitioning in 2s...</span>
                  <span>★</span>
                </div>
              )}

              {/* 3 Primary Action Buttons: Correct / Wrong / Skip */}
              <div className="pt-4 border-t border-purple-500/20 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 block">
                  RECORD PLAYER'S VERBAL ANSWER:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleRecordTurn('correct')}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 text-white font-retro text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-emerald-400 shadow-[0_4px_0_#064e3b] active:translate-y-1 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Correct (+1 pt)
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleRecordTurn('wrong')}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:brightness-110 text-white font-retro text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-rose-400 shadow-[0_4px_0_#881337] active:translate-y-1 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" /> Wrong (0 pt)
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting || currentIndex >= totalQuestions - 1}
                    onClick={() => handleRecordTurn('skip')}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-700 hover:brightness-110 text-white font-retro text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-amber-400 shadow-[0_4px_0_#78350f] active:translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    title={currentIndex >= totalQuestions - 1 ? 'Skip disabled on the final puzzle' : 'Skip to next puzzle'}
                  >
                    <RotateCcw className="w-4 h-4" /> {currentIndex >= totalQuestions - 1 ? 'Skip Disabled (12/12)' : 'Skip Puzzle (0 pt)'}
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* STEP 5: FINAL RESULT SCREEN                                           */}
      {/* ===================================================================== */}
      {currentStep === 'step_result' && gameResult && (
        <div className="space-y-6 animate-in zoom-in-95 max-w-xl mx-auto text-center">
          <Card
            variant={gameResult.isWinner ? 'gold' : 'default'}
            brackets={true}
            className="p-8 sm:p-12 space-y-6"
          >
            {/* Banner message */}
            <div className="p-3.5 rounded-xl bg-purple-950/80 border-2 border-purple-400 text-cyan-300 font-retro text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              {gameResult.isEarlyWin || (gameResult.finalScore ?? currentScore) >= 7
                ? '★ QUALIFICATION TARGET ACHIEVED: 7 CORRECT GUESSES! ★'
                : '★ All 12 puzzles have been completed! ★'}
            </div>

            {gameResult.isWinner ? (
              /* Winner Visual (Trophy) */
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-yellow-500 to-amber-300 p-1 shadow-[0_0_40px_rgba(250,204,21,0.5)] flex items-center justify-center animate-bounce">
                  <Trophy className="w-14 h-14 text-cosmic-950" />
                </div>
                <h2 className="text-3xl font-retro font-bold text-yellow-300 neon-glow-gold">
                  {gameResult.message}
                </h2>
                <p className="text-xs font-mono text-emerald-400">
                  {gameResult.subMessage}
                </p>
              </div>
            ) : (
              /* Non-Winner Visual (Encouraging) */
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-3xl">
                  🛸
                </div>
                <h2 className="text-2xl font-retro font-bold text-slate-200">
                  {gameResult.message}
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  {gameResult.subMessage}
                </p>
              </div>
            )}

            {/* Scorecard Box */}
            <div className="p-5 rounded-2xl bg-cosmic-950/80 border border-purple-500/30 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                Player: {activePlayer.name}
              </span>
              <div className="text-4xl font-retro text-yellow-400">
                {gameResult.finalScore ?? currentScore} / 7
              </div>
              <div className="text-xs font-mono text-slate-400 pt-0.5">
                Puzzles Played: {gameResult.isWinner ? `${currentIndex + 1} / 12 (Early Victory at 7 Points)` : '12 / 12 Puzzles Completed'}
              </div>
              <span className="text-xs font-retro text-slate-300 block pt-1">
                {gameResult.isWinner ? 'STATUS: QUALIFIED (WINNER)' : 'STATUS: NOT QUALIFIED'}
              </span>
            </div>

            {/* Action to Start Next Player */}
            <Button
              variant="pink"
              size="lg"
              onClick={handleResetForNextPlayer}
              className="w-full shadow-neon-pink"
            >
              Start Next Player's Run <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Card>
        </div>
      )}

      {/* Modals */}
      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onQuestionAdded={() => {}}
      />

      {replacingSlotNumber !== null && (
        <QuestionBrowserModal
          isOpen={replacingSlotNumber !== null}
          onClose={() => setReplacingSlotNumber(null)}
          targetSlotNumber={replacingSlotNumber}
          currentSlabQuestionIds={currentSlabQuestionIds}
          onSelectQuestion={handleReplaceSlotQuestion}
        />
      )}

      {/* Coordinator Authentication Modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setLoginError(null);
        }}
        title="COORDINATOR AUTHENTICATION"
      >
        <form onSubmit={handleCoordinatorLogin} className="space-y-4">
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Sign in with verified coordinator credentials to authorize authoritative scoring and live Realtime state broadcasts to the projector display.
          </p>
          {loginError && (
            <div className="p-3 rounded-lg bg-pink-950/70 border border-pink-500/50 text-pink-300 text-xs font-mono">
              ⚠️ {loginError}
            </div>
          )}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Coordinator Email:</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="coordinator@example.com"
              className="w-full px-3 py-2 rounded-lg bg-cosmic-950 border border-purple-500/40 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Password:</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 rounded-lg bg-cosmic-950 border border-purple-500/40 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsLoginModalOpen(false);
                setLoginError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="cyan"
              size="sm"
              disabled={isLoggingIn}
              className="shadow-neon-cyan"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In as Coordinator'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
