import React, { useState } from 'react';
import { Trophy, Medal, Award, Flame, Zap, Sparkles, Filter, Database, ShieldCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('overall');

  // Sample placeholder ranking dataset for visual validation
  const sampleLeaderboard = [
    { rank: 1, player: 'CyberNova', badge: 'Galaxy Master', score: '98,450', avatar: '🚀', round: 'Finals', streak: '8x' },
    { rank: 2, player: 'RetroVoxel', badge: 'Arcade Legend', score: '94,120', avatar: '👾', round: 'Stage 3', streak: '5x' },
    { rank: 3, player: 'StarGazer_X', badge: 'Cosmic Ace', score: '91,800', avatar: '⭐', round: 'Stage 3', streak: '4x' },
    { rank: 4, player: 'NeonBlaster', badge: 'Challenger', score: '88,950', avatar: '🔫', round: 'Stage 2', streak: '3x' },
    { rank: 5, player: 'PixelPhantom', badge: 'Deduction King', score: '85,400', avatar: '🕹️', round: 'Stage 2', streak: '6x' },
    { rank: 6, player: 'QuantumLeap', badge: 'Warp Scout', score: '81,250', avatar: '🌌', round: 'Stage 1', streak: '2x' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <Badge variant="gold" size="md">
          LIVE STANDINGS
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-retro font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 neon-glow-gold">
          CHAMPIONSHIP LEADERBOARD
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Real-time galactic rankings across all tournament rounds. Climb the podium and etch your name into arcade history.
        </p>
      </div>

      {/* Modular Boundary Note for Person 1 */}
      <Card variant="hologram" brackets={true} className="border-yellow-400/40 bg-yellow-950/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-retro text-xs text-yellow-300">
                  PERSON 1 INTEGRATION ZONE
                </span>
                <Badge variant="purple" size="sm">MODULAR SLOT</Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                This section is reserved for Person 1's Leaderboard and Scoring Module. The visual foundation, podium components, and layout are prepared. Person 1 can independently plug in the real-time scoring engine and Supabase subscriptions here.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-mono text-yellow-400/80 bg-yellow-900/30 px-3 py-1.5 rounded-lg border border-yellow-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Contract Ready
          </div>
        </div>
      </Card>

      {/* Top 3 Podium (Cosmic Retro Championship) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Silver - 2nd Place */}
        <Card variant="default" brackets={true} className="md:order-1 order-2 border-slate-400/40 bg-slate-900/40 text-center relative pt-8">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-400 text-slate-950 font-retro font-bold flex items-center justify-center border-2 border-white shadow-lg">
            2
          </div>
          <div className="text-4xl mb-2">{sampleLeaderboard[1].avatar}</div>
          <h3 className="font-retro text-sm text-slate-200">{sampleLeaderboard[1].player}</h3>
          <span className="text-xs font-mono text-slate-400">{sampleLeaderboard[1].badge}</span>
          <div className="mt-4 p-3 rounded-lg bg-slate-950/50 border border-slate-700/50">
            <div className="font-retro text-xl text-slate-200">{sampleLeaderboard[1].score}</div>
            <span className="text-[10px] text-slate-500 uppercase font-mono">Points</span>
          </div>
        </Card>

        {/* Gold - 1st Place */}
        <Card variant="gold" brackets={true} className="md:order-2 order-1 text-center relative pt-10 border-yellow-400/70 bg-yellow-950/30 shadow-[0_0_30px_rgba(250,204,21,0.2)] md:-translate-y-4">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 text-slate-950 font-retro font-bold flex items-center justify-center border-2 border-yellow-100 shadow-[0_0_20px_rgba(250,204,21,0.6)]">
            <Trophy className="w-6 h-6 fill-slate-950" />
          </div>
          <div className="text-5xl mb-2 animate-bounce">{sampleLeaderboard[0].avatar}</div>
          <h3 className="font-retro text-base text-yellow-300 neon-glow-gold">{sampleLeaderboard[0].player}</h3>
          <span className="text-xs font-mono text-yellow-400">{sampleLeaderboard[0].badge}</span>
          <div className="mt-4 p-3 rounded-lg bg-cosmic-950/70 border border-yellow-500/50">
            <div className="font-retro text-2xl text-yellow-400 neon-glow-gold">{sampleLeaderboard[0].score}</div>
            <span className="text-[10px] text-yellow-500 uppercase font-mono">Champion Score</span>
          </div>
        </Card>

        {/* Bronze - 3rd Place */}
        <Card variant="default" brackets={true} className="md:order-3 order-3 border-amber-700/40 bg-amber-950/20 text-center relative pt-8">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-600 text-slate-950 font-retro font-bold flex items-center justify-center border-2 border-amber-300 shadow-lg">
            3
          </div>
          <div className="text-4xl mb-2">{sampleLeaderboard[2].avatar}</div>
          <h3 className="font-retro text-sm text-amber-200">{sampleLeaderboard[2].player}</h3>
          <span className="text-xs font-mono text-amber-400">{sampleLeaderboard[2].badge}</span>
          <div className="mt-4 p-3 rounded-lg bg-slate-950/50 border border-amber-800/50">
            <div className="font-retro text-xl text-amber-300">{sampleLeaderboard[2].score}</div>
            <span className="text-[10px] text-slate-500 uppercase font-mono">Points</span>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
        <div className="flex items-center gap-2">
          {['overall', 'guess-who', 'speed-run'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-retro transition-all ${
                activeTab === tab
                  ? 'bg-yellow-400 text-cosmic-950 shadow-[0_2px_0_#b45309]'
                  : 'text-slate-400 hover:text-white bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30'
              }`}
            >
              {tab === 'overall' && 'ALL ARENAS'}
              {tab === 'guess-who' && 'GUESS WHO? (P2)'}
              {tab === 'speed-run' && 'SPEED TRIAL'}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Auto-updates every 10s
        </div>
      </div>

      {/* Ranks Table */}
      <Card variant="default" brackets={true} className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-purple-950/40 text-slate-400 border-b border-purple-500/20 uppercase font-retro text-[9px]">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-4 hidden sm:table-cell">Title</th>
                <th className="py-3 px-4 hidden md:table-cell">Stage</th>
                <th className="py-3 px-4 hidden sm:table-cell">Streak</th>
                <th className="py-3 px-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {sampleLeaderboard.map((row) => (
                <tr key={row.rank} className="hover:bg-purple-900/20 transition-colors">
                  <td className="py-3.5 px-4 font-retro text-slate-300">
                    #{row.rank}
                  </td>
                  <td className="py-3.5 px-4 font-sans font-semibold text-white flex items-center gap-2">
                    <span className="text-base">{row.avatar}</span>
                    <span>{row.player}</span>
                  </td>
                  <td className="py-3.5 px-4 hidden sm:table-cell text-slate-400">
                    {row.badge}
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell text-cyan-400">
                    {row.round}
                  </td>
                  <td className="py-3.5 px-4 hidden sm:table-cell text-pink-400 font-bold">
                    {row.streak}
                  </td>
                  <td className="py-3.5 px-4 text-right font-retro text-yellow-300">
                    {row.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
