import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  UserPlus,
  Gamepad2,
  ArrowLeft,
  Sparkles,
  Sliders,
  Coins,
  ShieldCheck,
  LogOut,
  User,
  Activity,
  Play,
  CheckCircle2,
  AlertTriangle,
  X,
  Compass,
  Swords,
  Scroll,
} from 'lucide-react';
import PublicLeaderboard from './PublicLeaderboard';
import ParticipantRegistration from '../components/participant/ParticipantRegistration';
import LiveTicker from '../components/LiveTicker';
import AudioSettingsModal from '../components/AudioSettingsModal';
import ParticipantAuthScreen from '../components/participant/ParticipantAuthScreen';
import ParticipantArcadeBackground from '../components/backgrounds/ParticipantArcadeBackground';
import { soundFx } from '../utilities/soundFx';
import { getParticipantSession, revokeParticipantSession } from '../services/api/authService';

export default function ParticipantPortal({
  data,
  leaderboard,
  onRegisterParticipant,
  onJoinGame,
  triggerCelebration,
  soundEnabled,
  setSoundEnabled,
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'games' | 'register' | 'profile'
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  // Authenticated participant session
  const [session, setSession] = useState(() => getParticipantSession());
  const [joinedGames, setJoinedGames] = useState({});
  const [isJoining, setIsJoining] = useState(false);
  const [joinStatusBanner, setJoinStatusBanner] = useState(null); // { type: 'success' | 'error', message }

  // Forward to auth callback if confirmation code, error, or token is present in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const hash = window.location.hash;
      if (search.includes('code=') || search.includes('error=') || hash.includes('access_token=') || hash.includes('error=')) {
        navigate(`/auth/callback${search}${hash}`, { replace: true });
      }
    }
  }, [navigate]);

  // Synchronize session profile
  const loggedInParticipant = useMemo(() => {
    if (!session?.participantId) return null;
    return (data.participants || []).find((p) => p.id === session.participantId) || null;
  }, [session, data.participants]);

  const currentCoins = loggedInParticipant ? Number(loggedInParticipant.coins ?? 0) : 0;

  // Total competition points for logged in participant
  const myTotalPoints = useMemo(() => {
    if (!loggedInParticipant) return 0;
    return (data.transactions || [])
      .filter((tx) => tx.participantId === loggedInParticipant.id)
      .reduce((sum, tx) => sum + Number(tx.pointsDelta || 0), 0);
  }, [loggedInParticipant, data.transactions]);

  // Breakdown of games played by this participant
  const myGamesBreakdown = useMemo(() => {
    if (!loggedInParticipant) return [];
    const map = {};
    (data.transactions || [])
      .filter((tx) => tx.participantId === loggedInParticipant.id)
      .forEach((tx) => {
        const game = (data.games || []).find((g) => g.id === tx.gameId);
        const gName = game ? game.name : 'Quest Trial';
        map[gName] = (map[gName] || 0) + Number(tx.pointsDelta || 0);
      });
    return Object.entries(map).map(([name, points]) => ({ name, points }));
  }, [loggedInParticipant, data.transactions, data.games]);

  const competition = data.activeCompetition || { name: 'MADAGASCAR Championship' };

  const handleTabChange = (tabId) => {
    soundFx.play('switch');
    setActiveTab(tabId);
  };

  const handleParticipantLogin = (participant) => {
    setSession({
      role: 'participant',
      participantId: participant.id,
      name: participant.name,
      email: participant.email,
      avatar: participant.avatar,
    });
    setActiveTab('leaderboard');
  };

  const handleLogout = () => {
    soundFx.play('click');
    revokeParticipantSession();
    setSession(null);
  };

  // Join / Enter game action with atomic coin validation & double-click protection
  const handleJoinGameClick = async (game) => {
    if (!loggedInParticipant) {
      soundFx.play('click');
      setJoinStatusBanner({
        type: 'error',
        message: 'Please sign in or enroll to embark on quest trials.',
      });
      setActiveTab('register');
      return;
    }

    if (isJoining) return; // Prevent duplicate clicks

    setIsJoining(true);
    setJoinStatusBanner(null);

    try {
      if (onJoinGame) {
        const res = onJoinGame({
          participantId: loggedInParticipant.id,
          gameId: game.id,
        });

        if (!res.success) {
          soundFx.play('scoreDown');
          setJoinStatusBanner({
            type: 'error',
            message: res.error || `Insufficient gold coins! Entry costs ${game.cost} coins, but your balance is ${currentCoins} coins.`,
          });
          setIsJoining(false);
          return;
        }

        soundFx.play('spend');
        soundFx.play('coin');
        triggerCelebration();

        setJoinedGames((prev) => ({ ...prev, [game.id]: true }));
        setJoinStatusBanner({
          type: 'success',
          message: `✓ Successfully entered ${game.name}! Deducted ${res.cost} gold tokens. New balance: ${res.newBalance} tokens.`,
        });
      }
    } catch (err) {
      soundFx.play('scoreDown');
      setJoinStatusBanner({
        type: 'error',
        message: 'An error occurred while entering the quest. Please retry.',
      });
    } finally {
      setIsJoining(false);
    }
  };

  // Dedicated Participant Welcome / Authentication Screen (Sign Up & Sign In)
  if (!session || !session.participantId) {
    return (
      <ParticipantAuthScreen
        startingCoins={data.settings?.startingCoins ?? 5}
        registeredParticipants={data.participants || []}
        triggerCelebration={triggerCelebration}
        onAuthSuccess={(participant, newSession, isNew) => {
          if (isNew && onRegisterParticipant) {
            onRegisterParticipant(participant);
          }
          setSession(newSession);
          setActiveTab('leaderboard');
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A091A] text-slate-100 flex flex-col justify-between selection:bg-[#FFC837] selection:text-[#0A091A] font-sans">
      {/* Background Graphic Texture & Fantasy Aurora Animation */}
      <ParticipantArcadeBackground />
      <div className="fixed inset-0 bg-radial-at-t from-emerald-950/20 via-transparent to-[#0A091A]/95 pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Universal Participant Fantasy Realm Header */}
        <header className="sticky top-0 z-40 bg-[#0C1222]/95 backdrop-blur-md border-b border-emerald-500/25 select-none shadow-fantasy-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-20 py-3">
              {/* Brand and Breadcrumb */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    soundFx.play('transition');
                    navigate('/select-portal');
                  }}
                  className="btn-fantasy-subtle p-2.5 rounded-xl text-amber-200"
                  title="Return to Realm Selection"
                >
                  <ArrowLeft className="w-4 h-4 text-[#FFC837]" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-xl sm:text-2xl font-black tracking-widest text-[#FFC837] fantasy-title-gold">
                      MADAGASCAR
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-cinzel text-[9px] font-bold uppercase border border-emerald-500/40 shadow-fantasy-emerald">
                      ADVENTURERS' REALM
                    </span>
                  </div>
                  <p className="text-[10px] font-jakarta text-slate-400 tracking-wider">
                    CIRCUIT: {competition?.name}
                  </p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="hidden sm:flex items-center gap-2 bg-[#080C17]/90 p-1.5 rounded-2xl border border-white/10 shadow-fantasy-card">
                <button
                  onClick={() => handleTabChange('leaderboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition-all ${
                    activeTab === 'leaderboard'
                      ? 'bg-gradient-to-r from-[#FFC837] to-[#FF9E1B] text-[#0A091A] font-black shadow-fantasy-gold -translate-y-0.5'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>LEADERBOARD</span>
                </button>

                <button
                  onClick={() => handleTabChange('games')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition-all ${
                    activeTab === 'games'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-[#0A091A] font-black shadow-fantasy-emerald -translate-y-0.5'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>GAMES ({data.games.length})</span>
                </button>

                {loggedInParticipant ? (
                  <button
                    onClick={() => handleTabChange('profile')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition-all ${
                      activeTab === 'profile'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-[#0A091A] font-black shadow-fantasy-cyan -translate-y-0.5'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>MY PROFILE</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleTabChange('register')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition-all ${
                      activeTab === 'register'
                        ? 'bg-gradient-to-r from-[#FFC837] to-[#FF9E1B] text-[#0A091A] font-black shadow-fantasy-gold -translate-y-0.5'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>SIGN IN / REGISTER</span>
                  </button>
                )}
              </nav>

              {/* Right Side: Logged-in Participant Badge, Coins Wallet, & Audio */}
              <div className="flex items-center gap-2.5">
                {loggedInParticipant ? (
                  <div className="flex items-center gap-2">
                    {/* Coin Wallet Balance */}
                    <div
                      title="Gold Tokens (Usable to embark on quest trials)"
                      className="hidden md:flex items-center gap-2 bg-[#090D18] px-3.5 py-1.5 rounded-xl border border-[#FFC837]/50 shadow-fantasy-gold text-xs font-jakarta"
                    >
                      <span className="text-base">🪙</span>
                      <div>
                        <span className="text-[8px] text-[#FFC837] block font-cinzel font-black leading-none">GOLD</span>
                        <span className="font-bold text-white text-xs">{currentCoins}</span>
                      </div>
                    </div>

                    {/* Renown Score */}
                    <div
                      title="Kingdom Renown Points (Championship Ranking)"
                      className="hidden lg:flex items-center gap-2 bg-[#090D18] px-3.5 py-1.5 rounded-xl border border-emerald-500/50 shadow-fantasy-emerald text-xs font-jakarta"
                    >
                      <span className="text-base">🏆</span>
                      <div>
                        <span className="text-[8px] text-emerald-400 block font-cinzel font-black leading-none">RENOWN</span>
                        <span className="font-bold text-emerald-300 text-xs">{myTotalPoints} PTS</span>
                      </div>
                    </div>

                    {/* Participant Profile Pill */}
                    <div className="flex items-center gap-2 bg-[#121B2D] text-slate-100 px-3 py-1.5 rounded-xl border border-white/15 shadow-fantasy-card">
                      <span className="text-xl">{loggedInParticipant.avatar || '⚔️'}</span>
                      <div className="hidden sm:block text-left font-jakarta">
                        <span className="font-bold text-xs block leading-tight truncate max-w-[110px] text-amber-200">
                          {loggedInParticipant.name}
                        </span>
                        <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5 font-mono">
                          <ShieldCheck className="w-2.5 h-2.5" /> {loggedInParticipant.usn || 'Verified'}
                        </span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors ml-1"
                        title="Sign Out of Realm"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleTabChange('register')}
                    className="btn-fantasy-primary text-xs py-2 px-3.5 flex items-center gap-1.5 font-cinzel font-bold"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>SIGN IN / REGISTER</span>
                  </button>
                )}

                {/* Audio Master Modal Toggle */}
                <button
                  onClick={() => setIsAudioModalOpen(true)}
                  className="btn-fantasy-subtle p-2 rounded-xl text-xs"
                  title="Kingdom Audio & Ambience"
                >
                  <Sliders className="w-4 h-4 text-[#FFC837]" />
                </button>
              </div>
            </div>

            {/* Mobile Tab Bar */}
            <div className="flex sm:hidden items-center justify-between py-2 border-t border-white/10 gap-1.5">
              <button
                onClick={() => handleTabChange('leaderboard')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-cinzel font-bold text-center transition-all ${
                  activeTab === 'leaderboard' ? 'bg-[#FFC837] text-[#0A091A] font-black' : 'text-slate-300'
                }`}
              >
                LEADERBOARD
              </button>
              <button
                onClick={() => handleTabChange('games')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-cinzel font-bold text-center transition-all ${
                  activeTab === 'games' ? 'bg-emerald-500 text-[#0A091A] font-black' : 'text-slate-300'
                }`}
              >
                GAMES
              </button>
              <button
                onClick={() => handleTabChange(loggedInParticipant ? 'profile' : 'register')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-cinzel font-bold text-center transition-all ${
                  activeTab === 'profile' || activeTab === 'register' ? 'bg-cyan-500 text-[#0A091A] font-black' : 'text-slate-300'
                }`}
              >
                {loggedInParticipant ? 'MY PROFILE' : 'SIGN IN'}
              </button>
            </div>
          </div>
        </header>

        {/* Live Score Ticker Tape */}
        <LiveTicker
          activeEvent={competition}
          transactions={data.transactions}
          participants={data.participants}
          games={data.games}
        />

        {/* Participant Main Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-grow py-6">
          {/* Active Champion Profile Banner (when logged in) */}
          {loggedInParticipant && activeTab !== 'register' && (
            <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#121B2D] via-[#0E1726] to-[#0A101C] border border-emerald-500/30 p-4 sm:p-5 shadow-fantasy-card flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFC837]/20 via-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-3xl border border-[#FFC837]/40 shadow-fantasy-gold">
                  {loggedInParticipant.avatar || '⚔️'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-cinzel font-bold text-lg text-amber-200">
                      {loggedInParticipant.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-cinzel text-[9px] font-bold uppercase border border-emerald-500/40">
                      VERIFIED CHAMPION
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    SIGIL / USN: {loggedInParticipant.usn || loggedInParticipant.email || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 font-jakarta text-xs">
                <div className="text-center bg-[#090D18] px-4 py-2 rounded-xl border border-[#FFC837]/40 shadow-fantasy-gold">
                  <span className="text-[9px] text-[#FFC837] block font-cinzel font-bold">GOLD TOKENS</span>
                  <span className="font-bold text-base text-white">🪙 {currentCoins}</span>
                </div>
                <div className="text-center bg-[#090D18] px-4 py-2 rounded-xl border border-emerald-500/40 shadow-fantasy-emerald">
                  <span className="text-[9px] text-emerald-400 block font-cinzel font-bold">TOTAL RENOWN</span>
                  <span className="font-bold text-base text-emerald-300">{myTotalPoints} PTS</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <PublicLeaderboard
              leaderboard={leaderboard}
              activeEvent={competition}
              games={data.games}
              transactions={data.transactions}
              participants={data.participants}
              triggerCelebration={triggerCelebration}
            />
          )}

          {activeTab === 'register' && !loggedInParticipant && (
            <ParticipantRegistration
              onRegisterParticipant={onRegisterParticipant}
              onParticipantLogin={handleParticipantLogin}
              startingCoins={data.settings?.startingCoins ?? 0}
              registeredList={data.participants || []}
            />
          )}

          {(activeTab === 'profile' || (activeTab === 'register' && loggedInParticipant)) && loggedInParticipant && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="rounded-3xl bg-gradient-to-b from-[#111928] via-[#0E1524] to-[#090D17] border-2 border-emerald-500/30 p-6 sm:p-8 shadow-fantasy-card text-white">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-white/10 pb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400/20 via-emerald-500/20 to-teal-500/20 border-2 border-[#FFC837]/50 shadow-fantasy-gold flex items-center justify-center text-4xl shrink-0">
                    {loggedInParticipant.avatar || '⚔️'}
                  </div>
                  <div className="text-center sm:text-left flex-grow">
                    <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                      <h2 className="font-cinzel text-2xl sm:text-3xl text-[#FFC837] fantasy-title-gold">
                        {loggedInParticipant.name}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-cinzel text-[9px] font-bold uppercase border border-emerald-500/40">
                        <ShieldCheck className="w-2.5 h-2.5 inline mr-0.5" /> VERIFIED CHAMPION
                      </span>
                    </div>
                    <p className="font-mono text-xs text-slate-300 mt-1">
                      USN: {loggedInParticipant.usn || loggedInParticipant.email || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="bg-[#090D18] p-4 rounded-2xl border border-[#FFC837]/40 text-center shadow-fantasy-gold">
                    <span className="text-[10px] font-cinzel text-[#FFC837] block font-bold">YOUR GOLD TOKENS</span>
                    <span className="font-jakarta text-2xl font-black text-white mt-1 block">
                      🪙 {currentCoins}
                    </span>
                    <span className="text-[10px] font-jakarta text-slate-400">Usable for Quest Trial Entries</span>
                  </div>

                  <div className="bg-[#090D18] p-4 rounded-2xl border border-emerald-500/40 text-center shadow-fantasy-emerald">
                    <span className="text-[10px] font-cinzel text-emerald-400 block font-bold">KINGDOM RENOWN</span>
                    <span className="font-jakarta text-2xl font-black text-emerald-300 mt-1 block">
                      🏆 {myTotalPoints} PTS
                    </span>
                    <span className="text-[10px] font-jakarta text-slate-400">Championship Standing</span>
                  </div>
                </div>

                {/* Score breakdown across games */}
                <div className="bg-[#080C17] rounded-2xl p-5 border border-white/10 space-y-3">
                  <span className="text-xs font-cinzel text-[#FFC837] font-bold block uppercase tracking-wider">
                    YOUR QUEST CHRONICLES ({myGamesBreakdown.length} CONQUERED)
                  </span>
                  <div className="space-y-2.5">
                    {myGamesBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#0F1626] text-slate-100 font-jakarta text-xs font-semibold border border-white/10"
                      >
                        <span className="text-slate-200">{item.name}</span>
                        <span className="font-bold text-amber-200 bg-[#FFC837]/15 px-2.5 py-0.5 rounded border border-[#FFC837]/40 font-mono">
                          +{item.points} PTS
                        </span>
                      </div>
                    ))}
                    {myGamesBreakdown.length === 0 && (
                      <p className="text-xs font-jakarta text-slate-400 text-center py-4">
                        You have not recorded glory in any quest trials yet. Enter trials to compete!
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs font-jakarta text-slate-400">
                    Sanctified Champion Session
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-fantasy-subtle text-xs py-2 px-3.5 flex items-center gap-1.5 text-red-300 hover:text-red-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>LOG OUT</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'games' && (
            <div className="space-y-6">
              {/* Join Status Feedback Notification Banner */}
              {joinStatusBanner && (
                <div
                  className={`p-4 rounded-2xl border shadow-fantasy-card flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
                    joinStatusBanner.type === 'success'
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                      : 'bg-red-950/80 border-red-500/60 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {joinStatusBanner.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
                    )}
                    <span className="font-jakarta text-xs sm:text-sm font-semibold">
                      {joinStatusBanner.message}
                    </span>
                  </div>
                  <button
                    onClick={() => setJoinStatusBanner(null)}
                    className="p-1 rounded hover:bg-white/10 text-current transition-colors"
                    title="Dismiss notification"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Header */}
              <div className="rounded-3xl bg-gradient-to-r from-[#111928] via-[#0E1524] to-[#0A101C] border border-emerald-500/30 p-6 sm:p-8 shadow-fantasy-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-cinzel text-[10px] font-bold uppercase border border-emerald-500/40 shadow-fantasy-emerald inline-block mb-2">
                    REALM QUEST TRIALS CATALOG
                  </span>
                  <h2 className="font-cinzel text-3xl sm:text-4xl text-[#FFC837] fantasy-title-gold">
                    CHAMPIONSHIP QUESTS
                  </h2>
                  <p className="text-slate-300 font-jakarta text-xs sm:text-sm mt-1 max-w-2xl font-medium">
                    Quest challenges crafted by the High Citadel. Spend gold tokens to enter, triumph in trials, and ascend the kingdom leaderboard.
                  </p>
                </div>

                {/* Player Token Bank Widget */}
                <div className="bg-[#090D18] p-5 rounded-2xl border border-[#FFC837]/50 shadow-fantasy-gold text-center shrink-0 min-w-[200px]">
                  <span className="text-[10px] font-cinzel text-[#FFC837] block font-bold">YOUR GOLD TOKENS</span>
                  <div className="font-jakarta font-black text-2xl text-white mt-1 flex items-center justify-center gap-1.5">
                    <span>🪙</span>
                    <span>{currentCoins} TOKENS</span>
                  </div>
                  <span className="text-[10px] font-jakarta text-slate-400 block mt-1.5">
                    {loggedInParticipant ? 'Active Champion Balance' : 'Sign in to access your tokens'}
                  </span>
                </div>
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.games.map((g) => {
                  const entryCost = Number(g.cost || 0);
                  const isJoined = Boolean(joinedGames[g.id]);
                  const canAfford = loggedInParticipant ? currentCoins >= entryCost : false;

                  return (
                    <div
                      key={g.id}
                      className="p-6 rounded-3xl bg-gradient-to-b from-[#111827] via-[#0E1422] to-[#080C16] text-slate-100 border border-white/15 shadow-fantasy-card space-y-4 hover:border-[#FFC837]/40 hover:-translate-y-1 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 via-emerald-500/20 to-teal-500/20 border border-[#FFC837]/40 shadow-fantasy-gold flex items-center justify-center text-3xl shrink-0">
                            ⚔️
                          </div>
                          <div>
                            <h3 className="font-cinzel font-bold text-xl text-amber-200">
                              {g.name}
                            </h3>
                            <span className="text-xs font-mono text-slate-400 block mt-0.5">
                              TRIAL ID: {g.id}
                            </span>
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full font-cinzel text-[10px] font-bold border ${
                          g.isActive ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-fantasy-emerald' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {g.isActive ? 'OPEN TRIAL' : 'SEALED'}
                        </span>
                      </div>

                      <div className="bg-[#090D18] p-4 rounded-2xl border border-white/10 text-center font-jakarta flex items-center justify-between px-6">
                        <span className="text-xs text-slate-400 font-cinzel font-bold uppercase">ENTRY TRIBUTE</span>
                        <span className="text-xl font-bold text-amber-300 flex items-center gap-1.5">
                          <Coins className="w-4 h-4 text-[#FFC837]" />
                          {entryCost} GOLD TOKENS
                        </span>
                      </div>

                      <button
                        onClick={() => handleJoinGameClick(g)}
                        disabled={!g.isActive || isJoining}
                        className={`w-full py-3.5 rounded-xl font-cinzel font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 ${
                          !g.isActive
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                            : isJoined
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-[#0A091A] font-black shadow-fantasy-emerald hover:brightness-110'
                            : !loggedInParticipant
                            ? 'btn-fantasy-primary'
                            : !canAfford
                            ? 'bg-red-950/60 border border-red-500/50 text-red-300'
                            : 'btn-fantasy-primary'
                        }`}
                      >
                        {!g.isActive ? (
                          <span>TRIAL CURRENTLY DORMANT</span>
                        ) : !loggedInParticipant ? (
                          <>
                            <User className="w-4 h-4" />
                            <span>SIGN IN TO ENTER ({entryCost} TOKENS)</span>
                          </>
                        ) : isJoined ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-[#0A091A]" />
                            <span>ENTERED • VENTURE AGAIN ({entryCost} TOKENS)</span>
                          </>
                        ) : !canAfford ? (
                          <>
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span>INSUFFICIENT GOLD (NEED {entryCost - currentCoins} MORE)</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 text-[#0A091A]" />
                            <span>EMBARK ON QUEST ({entryCost} TOKENS)</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {data.games.length === 0 && (
                <div className="p-16 text-center bg-[#111827] rounded-3xl border border-white/10 shadow-fantasy-card text-slate-200">
                  <Gamepad2 className="w-12 h-12 text-[#FFC837] mx-auto mb-3" />
                  <h3 className="font-cinzel text-2xl font-bold">NO QUEST TRIALS DRAFTED YET</h3>
                  <p className="font-jakarta text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    The High Citadel Scribes have not opened any trials yet. Check back shortly.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Realm Footer */}
        <footer className="relative z-20 w-full select-none mt-12 border-t border-white/10 bg-[#070B14]/90 py-5 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-jakarta text-slate-400 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏰</span>
              <span className="text-[#FFC837] font-cinzel font-bold text-xs">
                MADAGASCAR FANTASY KINGDOM
              </span>
              <span className="text-slate-400 text-xs hidden md:inline">
                • VERIFIED ADVENTURERS' GUILD
              </span>
            </div>
            <div className="text-xs font-cinzel text-slate-400">
              REGISTERED CHAMPIONS: {data.participants.length} • ACTIVE QUESTS: {data.games.length}
            </div>
          </div>
        </footer>
      </div>

      {/* Audio Modal */}
      <AudioSettingsModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
      />
    </div>
  );
}
