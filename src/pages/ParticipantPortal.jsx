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
} from 'lucide-react';
import PublicLeaderboard from './PublicLeaderboard';
import ParticipantRegistration from '../components/participant/ParticipantRegistration';
import LiveTicker from '../components/LiveTicker';
import AudioSettingsModal from '../components/AudioSettingsModal';
import { soundFx } from '../utilities/soundFx';
import { getParticipantSession, revokeParticipantSession } from '../services/api/authService';

export default function ParticipantPortal({
  data,
  leaderboard,
  onRegisterParticipant,
  triggerCelebration,
  soundEnabled,
  setSoundEnabled,
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'games' | 'register' | 'profile'
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  // Authenticated participant session
  const [session, setSession] = useState(() => getParticipantSession());
  const [walletCoins, setWalletCoins] = useState(500);

  // Synchronize session profile
  const loggedInParticipant = useMemo(() => {
    if (!session?.participantId) return null;
    return (data.participants || []).find((p) => p.id === session.participantId) || null;
  }, [session, data.participants]);

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

  const competition = data.activeCompetition || { name: 'FUNTOPIA Championship' };

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
    setWalletCoins(participant.coins || 500);
    setActiveTab('leaderboard');
  };

  const handleLogout = () => {
    soundFx.play('click');
    revokeParticipantSession();
    setSession(null);
  };

  // Play game action (spends arcade coins)
  const handlePlayGame = (game) => {
    const cost = Number(game.cost || 0);
    if (walletCoins < cost) {
      soundFx.play('scoreDown');
      alert(`Insufficient arcade coins! Cost: ${cost} coins, Wallet: ${walletCoins} coins. Reload coins to enter.`);
      return;
    }

    soundFx.play('spend');
    setWalletCoins((prev) => prev - cost);

    setTimeout(() => {
      soundFx.play('coin');
      triggerCelebration();
      alert(`Entered ${game.name}! Spent ${cost} arcade coins from wallet.`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#451B75] text-white flex flex-col justify-between selection:bg-[#FFDE25] selection:text-[#0D0518] font-sans">
      {/* Background Graphic Texture */}
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
                      FUNTOPIA
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

              {/* Navigation Tabs */}
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
                  <span>STANDINGS</span>
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
                  onClick={() => handleTabChange('register')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-black tracking-wider transition-all ${
                    activeTab === 'register'
                      ? 'bg-[#FF5FA0] text-white border-2 border-[#0D0518] shadow-pixel-sm -translate-y-0.5'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{loggedInParticipant ? 'SWITCH USER' : 'REGISTER / LOGIN'}</span>
                </button>
              </nav>

              {/* Right Side: Logged-in Participant Badge, Coins Wallet, & Audio */}
              <div className="flex items-center gap-2.5">
                {loggedInParticipant ? (
                  <div className="flex items-center gap-2">
                    {/* Coin Wallet Balance */}
                    <div
                      title="Arcade Coins (Used to enter games)"
                      className="hidden md:flex items-center gap-1.5 bg-[#200B3B] px-3 py-1.5 rounded-xl border-2 border-[#FFDE25] shadow-pixel-sm text-xs font-mono"
                    >
                      <span className="text-sm">🪙</span>
                      <div>
                        <span className="text-[8px] text-[#FFDE25] block font-arcade font-black leading-none">COINS</span>
                        <span className="font-black text-white text-xs">{walletCoins}</span>
                      </div>
                    </div>

                    {/* Competition Points Score */}
                    <div
                      title="Tournament Points (Competition Ranking)"
                      className="hidden lg:flex items-center gap-1.5 bg-[#200B3B] px-3 py-1.5 rounded-xl border-2 border-[#28C76F] shadow-pixel-sm text-xs font-mono"
                    >
                      <span className="text-sm">🏆</span>
                      <div>
                        <span className="text-[8px] text-[#28C76F] block font-arcade font-black leading-none">POINTS</span>
                        <span className="font-black text-[#28C76F] text-xs">{myTotalPoints} PTS</span>
                      </div>
                    </div>

                    {/* Participant Profile Pill */}
                    <div className="flex items-center gap-2 bg-white text-[#0D0518] px-3 py-1.5 rounded-xl border-2 border-[#0D0518] shadow-pixel-sm">
                      <span className="text-xl">{loggedInParticipant.avatar || '👾'}</span>
                      <div className="hidden sm:block text-left font-mono">
                        <span className="font-black text-xs block leading-tight truncate max-w-[100px]">
                          {loggedInParticipant.name}
                        </span>
                        <span className="text-[9px] text-[#28C76F] font-bold flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" /> Verified
                        </span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-red-600 p-1 rounded"
                        title="Sign Out"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleTabChange('register')}
                    className="btn-pixel-yellow text-xs py-2 px-3 flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>SIGN IN / REGISTER</span>
                  </button>
                )}

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
                STANDINGS
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
                onClick={() => handleTabChange('register')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-display font-black text-center ${
                  activeTab === 'register' ? 'bg-[#FF5FA0] text-white border-2 border-[#0D0518]' : 'text-purple-200'
                }`}
              >
                {loggedInParticipant ? 'PROFILE' : 'REGISTER'}
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
          {loggedInParticipant && activeTab !== 'register' && (
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
                      VERIFIED GMAIL
                    </span>
                  </div>
                  <span className="text-xs font-mono text-purple-200">
                    {loggedInParticipant.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs">
                <div className="text-center bg-[#200B3B] px-3.5 py-1.5 rounded-xl border border-[#FFDE25]">
                  <span className="text-[9px] text-[#FFDE25] block font-arcade font-black">GAME COINS</span>
                  <span className="font-black text-base text-white">🪙 {walletCoins}</span>
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

          {activeTab === 'register' && (
            <ParticipantRegistration
              onRegisterParticipant={onRegisterParticipant}
              onParticipantLogin={handleParticipantLogin}
              registeredList={data.participants || []}
            />
          )}

          {activeTab === 'games' && (
            <div className="space-y-6">
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
                    Games created by the tournament organizer. Spend arcade coins to enter games and compete for points.
                  </p>
                </div>

                {/* Player Token Bank Widget */}
                <div className="bg-[#200B3B] p-4 rounded-2xl border-3 border-[#FFDE25] shadow-pixel text-center shrink-0">
                  <span className="text-[10px] font-arcade text-[#FFDE25] block font-black">YOUR ARCADE COINS</span>
                  <div className="font-display font-black text-2xl text-white mt-1 flex items-center justify-center gap-1.5">
                    <span>🪙</span>
                    <span>{walletCoins} COINS</span>
                  </div>
                  <button
                    onClick={() => {
                      soundFx.play('coin');
                      setWalletCoins((prev) => prev + 250);
                    }}
                    className="mt-2 text-[10px] font-mono font-black text-[#FFDE25] hover:underline block"
                  >
                    + Reload 250 Coins
                  </button>
                </div>
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.games.map((g) => (
                  <div
                    key={g.id}
                    className="p-6 rounded-3xl bg-[#FAF7EE] text-[#0D0518] border-4 border-[#0D0518] shadow-pixel-xl space-y-4 hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-[#FFDE25] border-3 border-[#0D0518] shadow-pixel-sm flex items-center justify-center text-3xl shrink-0">
                          🕹️
                        </div>
                        <div>
                          <h3 className="font-display font-black text-2xl text-[#0D0518]">
                            {g.name}
                          </h3>
                          <span className="text-xs font-mono text-gray-500 font-bold block mt-0.5">
                            ID: {g.id}
                          </span>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full font-arcade text-[9px] font-black border-2 border-[#0D0518] ${
                        g.isActive ? 'bg-[#28C76F] text-[#0D0518]' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {g.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border-3 border-[#0D0518] text-center font-mono">
                      <span className="text-[10px] text-gray-500 block font-bold uppercase">ENTRY COST</span>
                      <span className="text-xl font-black text-[#FF5FA0] flex items-center justify-center gap-1 mt-0.5">
                        <Coins className="w-4 h-4 text-[#FFDE25]" />
                        {Number(g.cost || 0)} COINS
                      </span>
                    </div>

                    <button
                      onClick={() => handlePlayGame(g)}
                      disabled={!g.isActive}
                      className={`w-full py-3 rounded-2xl font-display font-black text-sm uppercase border-3 border-[#0D0518] shadow-pixel transition-all flex items-center justify-center gap-2 ${
                        g.isActive
                          ? 'bg-[#FFDE25] text-[#0D0518] hover:bg-yellow-300 active:translate-y-0.5'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Play className="w-4 h-4" />
                      <span>ENTER GAME ({Number(g.cost || 0)} COINS)</span>
                    </button>
                  </div>
                ))}
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
                  FUNTOPIA INDIE GAMING PLATFORM
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
