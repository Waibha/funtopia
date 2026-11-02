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
} from 'lucide-react';
import PublicLeaderboard from './PublicLeaderboard';
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
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'games' | 'profile'
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

  // Synchronize session profile (fallback to session payload if participant list is refreshing)
  const loggedInParticipant = useMemo(() => {
    if (!session?.participantId) return null;
    const found = (data.participants || []).find((p) => p.id === session.participantId);
    if (found) return found;
    return {
      id: session.participantId,
      name: session.name || 'Competitor',
      usn: session.usn || '',
      email: session.email || '',
      avatar: session.avatar || '👾',
      coins: Number(session.coins || data.settings?.startingCoins || 5),
    };
  }, [session, data.participants, data.settings]);

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
        const gName = game ? game.name : 'Arcade Challenge';
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
        message: 'Please sign in or register to join championship games.',
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
            message: res.error || `Insufficient coins! Entry costs ${game.cost} coins, but your balance is ${currentCoins} coins.`,
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
          message: `✓ Successfully joined ${game.name}! Deducted ${res.cost} virtual coins. New balance: ${res.newBalance} coins.`,
        });
      }
    } catch (err) {
      soundFx.play('scoreDown');
      setJoinStatusBanner({
        type: 'error',
        message: 'An error occurred while joining the game. Please retry.',
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
    <div className="relative min-h-screen bg-[#451B75] text-white flex flex-col justify-between selection:bg-[#FFDE25] selection:text-[#0D0518] font-sans arcade-page-transition">
      {/* Background Graphic Texture & Animation */}
      <ParticipantArcadeBackground />
      <div
        className="fixed inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#FFDE25 1px, transparent 1px), linear-gradient(90deg, #FFDE25 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="fixed inset-0 bg-radial-at-t from-purple-700/20 via-transparent to-[#1F0738]/90 pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Universal Participant Header */}
        <header className="sticky top-0 z-40 bg-[#40186D]/95 backdrop-blur-md border-b-4 border-[#0D0518] select-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-20 py-3">
              {/* Brand and Breadcrumb */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    soundFx.play('transition');
                    navigate('/select-portal');
                  }}
                  className="btn-pixel-white p-2.5 rounded-xl"
                  title="Return to Portal Selection"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bungee text-xl sm:text-2xl tracking-wide text-[#FFDE25] pixel-title-yellow">
                      MADAGASCAR
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#28C76F] text-[#0D0518] font-arcade text-[9px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm">
                      PARTICIPANT ARENA
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-purple-200 tracking-wider font-bold">
                    CIRCUIT: {competition?.name}
                  </p>
                </div>
              </div>

              {/* Navigation Tabs (Leaderboard, Games, My Profile) */}
              <nav className="hidden sm:flex items-center gap-2 bg-[#2B0E4C] p-1.5 rounded-2xl border-3 border-[#0D0518] shadow-pixel-sm">
                <button
                  onClick={() => handleTabChange('leaderboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-black tracking-wider transition-all ${
                    activeTab === 'leaderboard'
                      ? 'bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518] shadow-pixel-sm -translate-y-0.5'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>LEADERBOARD</span>
                </button>

                <button
                  onClick={() => handleTabChange('games')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-black tracking-wider transition-all ${
                    activeTab === 'games'
                      ? 'bg-[#28C76F] text-[#0D0518] border-2 border-[#0D0518] shadow-pixel-sm -translate-y-0.5'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>GAMES ({data.games.length})</span>
                </button>

                <button
                  onClick={() => handleTabChange('profile')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-black tracking-wider transition-all ${
                    activeTab === 'profile'
                      ? 'bg-[#FF5FA0] text-white border-2 border-[#0D0518] shadow-pixel-sm -translate-y-0.5'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>MY PROFILE</span>
                </button>
              </nav>

              {/* Right Side: Logged-in Participant Badge, Coins Wallet, & Audio */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2">
                  {/* Coin Wallet Balance */}
                  <div
                    title="Arcade Coins (Used to enter games)"
                    className="hidden md:flex items-center gap-1.5 bg-[#200B3B] px-3 py-1.5 rounded-xl border-2 border-[#FFDE25] shadow-pixel-sm text-xs font-mono hover:scale-105 hover:border-[#FFF078] transition-all cursor-default"
                  >
                    <span className="text-sm animate-bounce-subtle">🪙</span>
                    <div>
                      <span className="text-[8px] text-[#FFDE25] block font-arcade font-black leading-none">COINS</span>
                      <span className="font-black text-white text-xs">{currentCoins}</span>
                    </div>
                  </div>

                  {/* Competition Points Score */}
                  <div
                    title="Tournament Points (Competition Ranking)"
                    className="hidden lg:flex items-center gap-1.5 bg-[#200B3B] px-3 py-1.5 rounded-xl border-2 border-[#28C76F] shadow-pixel-sm text-xs font-mono hover:scale-105 hover:border-[#6EE7B7] transition-all cursor-default"
                  >
                    <span className="text-sm">🏆</span>
                    <div>
                      <span className="text-[8px] text-[#28C76F] block font-arcade font-black leading-none">POINTS</span>
                      <span className="font-black text-[#28C76F] text-xs">{myTotalPoints} PTS</span>
                    </div>
                  </div>

                  {/* Participant Profile Pill */}
                  <div className="flex items-center gap-2 bg-white text-[#0D0518] px-3 py-1.5 rounded-xl border-2 border-[#0D0518] shadow-pixel-sm hover:-translate-y-0.5 hover:shadow-pixel transition-all">
                    <span className="text-xl">{loggedInParticipant.avatar || '👾'}</span>
                    <div className="hidden sm:block text-left font-mono">
                      <span className="font-black text-xs block leading-tight truncate max-w-[100px]">
                        {loggedInParticipant.name}
                      </span>
                      <span className="text-[9px] text-[#28C76F] font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" /> {loggedInParticipant.usn || 'Verified'}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-gray-400 hover:text-red-600 hover:scale-110 p-1 rounded transition-all"
                      title="Sign Out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Audio Master Modal Toggle */}
                <button
                  onClick={() => setIsAudioModalOpen(true)}
                  className="btn-pixel-white p-2 rounded-xl text-xs"
                  title="Audio Settings"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Tab Bar */}
            <div className="flex sm:hidden items-center justify-between py-2 border-t-2 border-[#0D0518] gap-1">
              <button
                onClick={() => handleTabChange('leaderboard')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-display font-black text-center ${
                  activeTab === 'leaderboard' ? 'bg-[#FFDE25] text-[#0D0518] border-2 border-[#0D0518]' : 'text-purple-200'
                }`}
              >
                LEADERBOARD
              </button>
              <button
                onClick={() => handleTabChange('games')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-display font-black text-center ${
                  activeTab === 'games' ? 'bg-[#28C76F] text-[#0D0518] border-2 border-[#0D0518]' : 'text-purple-200'
                }`}
              >
                GAMES
              </button>
              <button
                onClick={() => handleTabChange('profile')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-display font-black text-center ${
                  activeTab === 'profile' ? 'bg-[#FF5FA0] text-white border-2 border-[#0D0518]' : 'text-purple-200'
                }`}
              >
                MY PROFILE
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
          {/* Active Player Profile Banner (when logged in) */}
          {loggedInParticipant && (
            <div className="mb-6 bg-[#32125A] rounded-2xl border-3 border-[#0D0518] p-4 shadow-pixel-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-3xl border-2 border-[#0D0518] shadow-pixel-sm">
                  {loggedInParticipant.avatar || '👾'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-lg text-[#FFDE25]">
                      {loggedInParticipant.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#28C76F] text-[#0D0518] font-arcade text-[8px] font-black uppercase border border-[#0D0518]">
                      VERIFIED PLAYER
                    </span>
                  </div>
                  <span className="text-xs font-mono text-purple-200">
                    USN: {loggedInParticipant.usn || loggedInParticipant.email || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs">
                <div className="text-center bg-[#200B3B] px-3.5 py-1.5 rounded-xl border border-[#FFDE25]">
                  <span className="text-[9px] text-[#FFDE25] block font-arcade font-black">GAME COINS</span>
                  <span className="font-black text-base text-white">🪙 {currentCoins}</span>
                </div>
                <div className="text-center bg-[#200B3B] px-3.5 py-1.5 rounded-xl border border-[#28C76F]">
                  <span className="text-[9px] text-[#28C76F] block font-arcade font-black">TOTAL POINTS</span>
                  <span className="font-black text-base text-[#28C76F]">{myTotalPoints} PTS</span>
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

          {activeTab === 'profile' && loggedInParticipant && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-[#40186D] rounded-3xl border-4 border-[#0D0518] p-6 sm:p-8 shadow-pixel-xl text-white">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b-3 border-[#0D0518] pb-6">
                  <div className="w-20 h-20 rounded-2xl bg-white border-3 border-[#0D0518] shadow-pixel flex items-center justify-center text-4xl shrink-0">
                    {loggedInParticipant.avatar || '👾'}
                  </div>
                  <div className="text-center sm:text-left flex-grow">
                    <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                      <h2 className="font-bungee text-2xl sm:text-3xl text-[#FFDE25]">
                        {loggedInParticipant.name}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#28C76F] text-[#0D0518] font-arcade text-[9px] font-black uppercase border border-[#0D0518]">
                        <ShieldCheck className="w-2.5 h-2.5 inline mr-0.5" /> VERIFIED PLAYER
                      </span>
                    </div>
                    <p className="font-mono text-xs text-purple-200 mt-1">
                      USN: {loggedInParticipant.usn || loggedInParticipant.email || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="bg-[#200B3B] p-4 rounded-2xl border-2 border-[#FFDE25] text-center">
                    <span className="text-[10px] font-arcade text-[#FFDE25] block font-black">YOUR ARCADE COINS</span>
                    <span className="font-mono text-2xl font-black text-white mt-1 block">
                      🪙 {currentCoins}
                    </span>
                    <span className="text-[10px] font-mono text-purple-200">Usable for Game Entries</span>
                  </div>

                  <div className="bg-[#200B3B] p-4 rounded-2xl border-2 border-[#28C76F] text-center">
                    <span className="text-[10px] font-arcade text-[#28C76F] block font-black">TOURNAMENT POINTS</span>
                    <span className="font-mono text-2xl font-black text-[#28C76F] mt-1 block">
                      🏆 {myTotalPoints} PTS
                    </span>
                    <span className="text-[10px] font-mono text-purple-200">Championship Standing</span>
                  </div>
                </div>

                {/* Score breakdown across games */}
                <div className="bg-[#2B0E4C] rounded-2xl p-4 border-2 border-[#0D0518] space-y-3">
                  <span className="text-xs font-arcade text-[#FFDE25] font-black block uppercase tracking-wider">
                    YOUR GAME BREAKDOWN ({myGamesBreakdown.length} PLAYED)
                  </span>
                  <div className="space-y-2">
                    {myGamesBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7EE] text-[#0D0518] font-mono text-xs font-bold border-2 border-[#0D0518]"
                      >
                        <span>{item.name}</span>
                        <span className="font-black text-[#5C2D91] bg-[#FFDE25] px-2 py-0.5 rounded border border-[#0D0518]">
                          +{item.points} PTS
                        </span>
                      </div>
                    ))}
                    {myGamesBreakdown.length === 0 && (
                      <p className="text-xs font-mono text-purple-200 text-center py-4">
                        You have not recorded points in any games yet. Enter games to compete!
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-[#0D0518] flex justify-between items-center">
                  <span className="text-xs font-mono text-purple-200 font-bold">
                    Authenticated Account Session
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-pixel-white text-xs py-2.5 px-4 flex items-center gap-1.5"
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
                  className={`p-4 rounded-2xl border-3 border-[#0D0518] shadow-pixel flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
                    joinStatusBanner.type === 'success'
                      ? 'bg-[#28C76F] text-[#0D0518]'
                      : 'bg-[#FF3366] text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {joinStatusBanner.type === 'success' ? (
                      <CheckCircle2 className="w-6 h-6 shrink-0 text-[#0D0518]" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 shrink-0 text-white" />
                    )}
                    <span className="font-mono text-xs sm:text-sm font-black">
                      {joinStatusBanner.message}
                    </span>
                  </div>
                  <button
                    onClick={() => setJoinStatusBanner(null)}
                    className="p-1 rounded hover:bg-black/20 text-current transition-colors"
                    title="Dismiss notification"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Header */}
              <div className="bg-[#40186D] text-white rounded-3xl border-4 border-[#0D0518] p-6 sm:p-8 shadow-pixel-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#FF5FA0] text-white font-arcade text-[10px] font-black uppercase border-2 border-[#0D0518] shadow-pixel-sm inline-block mb-2">
                    ARCADE LOBBY CATALOG
                  </span>
                  <h2 className="font-bungee text-3xl sm:text-5xl text-[#FFDE25] pixel-title-yellow">
                    CHAMPIONSHIP GAMES
                  </h2>
                  <p className="text-purple-200 font-sans text-xs sm:text-sm mt-1 max-w-2xl font-medium">
                    Games created by tournament operators. Virtual coins are spent to enter games. Points are earned through gameplay and rank you on the leaderboard.
                  </p>
                </div>

                {/* Player Token Bank Widget */}
                <div className="bg-[#200B3B] p-5 rounded-2xl border-3 border-[#FFDE25] shadow-pixel text-center shrink-0 min-w-[200px]">
                  <span className="text-[10px] font-arcade text-[#FFDE25] block font-black">YOUR ARCADE COINS</span>
                  <div className="font-display font-black text-2xl text-white mt-1 flex items-center justify-center gap-1.5">
                    <span>🪙</span>
                    <span>{currentCoins} COINS</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-200 block mt-1.5">
                    {loggedInParticipant ? 'Active Wallet Balance' : 'Sign in to access your coins'}
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
                      className="group p-6 rounded-3xl bg-[#FAF7EE] text-[#0D0518] border-4 border-[#0D0518] shadow-pixel-xl space-y-4 hover:-translate-y-2 hover:shadow-[8px_12px_0px_#0D0518] hover:border-[#FFDE25] transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-2xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel-sm flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                            🕹️
                          </div>
                          <div>
                            <h3 className="font-display font-black text-2xl text-[#0D0518]">
                              {g.name}
                            </h3>
                            <span className="text-xs font-mono text-gray-500 font-bold block mt-0.5">
                              GAME ID: {g.id}
                            </span>
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full font-arcade text-[9px] font-black border-2 border-[#0D0518] transition-colors ${
                          g.isActive ? 'bg-[#28C76F] text-[#0D0518] group-hover:bg-[#FFDE25]' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {g.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border-3 border-[#0D0518] text-center font-mono flex items-center justify-between px-6 group-hover:border-[#FFDE25] transition-colors">
                        <span className="text-xs text-gray-500 font-black uppercase">ENTRY FEE</span>
                        <span className="text-xl font-black text-[#FF5FA0] flex items-center gap-1 group-hover:scale-105 transition-transform">
                          <Coins className="w-4 h-4 text-[#FFDE25]" />
                          {entryCost} COINS
                        </span>
                      </div>

                      <button
                        onClick={() => handleJoinGameClick(g)}
                        disabled={!g.isActive || isJoining}
                        className={`w-full py-3 rounded-2xl font-display font-black text-sm uppercase border-3 border-[#0D0518] shadow-pixel transition-all flex items-center justify-center gap-2 ${
                          !g.isActive
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : isJoined
                            ? 'bg-[#28C76F] text-[#0D0518] hover:bg-[#34e280]'
                            : !loggedInParticipant
                            ? 'bg-[#FFDE25] text-[#0D0518] hover:bg-yellow-300'
                            : !canAfford
                            ? 'bg-[#FF3366] text-white hover:bg-red-600'
                            : 'bg-[#FFDE25] text-[#0D0518] hover:bg-yellow-300 active:translate-y-0.5'
                        }`}
                      >
                        {!g.isActive ? (
                          <span>GAME CURRENTLY OFFLINE</span>
                        ) : !loggedInParticipant ? (
                          <>
                            <User className="w-4 h-4" />
                            <span>SIGN IN TO ENTER ({entryCost} COINS)</span>
                          </>
                        ) : isJoined ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-[#0D0518]" />
                            <span>ENTERED • PLAY AGAIN ({entryCost} COINS)</span>
                          </>
                        ) : !canAfford ? (
                          <>
                            <AlertTriangle className="w-4 h-4 text-white" />
                            <span>INSUFFICIENT COINS (NEED {entryCost - currentCoins} MORE)</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            <span>ENTER GAME ({entryCost} COINS)</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {data.games.length === 0 && (
                <div className="p-16 text-center bg-white rounded-3xl border-4 border-[#0D0518] shadow-pixel text-[#0D0518]">
                  <Gamepad2 className="w-12 h-12 text-[#FF7A00] mx-auto mb-3" />
                  <h3 className="font-bungee text-2xl">NO ACTIVE GAMES YET</h3>
                  <p className="font-mono text-xs text-gray-600 mt-1 max-w-md mx-auto">
                    The tournament organizer has not created any games yet. Log in to the Admin Portal to add games.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Platform Footer */}
        <footer className="relative z-20 w-full select-none mt-12">
          <div className="pixel-grass-strip h-3.5 w-full" />
          <div className="pixel-brick-strip py-4 px-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-white font-bold gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">👾</span>
                <span className="text-[#FFDE25] font-arcade text-[10px]">
                  MADAGASCAR INDIE GAMING PLATFORM
                </span>
                <span className="text-purple-200 text-[10px] hidden md:inline">
                  • REAL VERIFIED PARTICIPANTS
                </span>
              </div>
              <div className="text-[10px] font-arcade text-white/90">
                ACTIVE PLAYERS: {data.participants.length} • TOTAL GAMES: {data.games.length}
              </div>
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
