import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Gamepad2, 
  Trophy, 
  Sparkles, 
  Tv, 
  HelpCircle, 
  Users, 
  Flame, 
  ArrowRight, 
  Timer, 
  Play,
  ShieldCheck
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 22, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono mb-6 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
          <span>OFFICIAL COSMIC RETRO CHAMPIONSHIP 2026</span>
          <span className="text-pink-400 font-bold">•</span>
          <span className="text-cyan-300">LIVE ARENA</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-retro font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-300 to-cyan-400 drop-shadow-[0_0_35px_rgba(236,72,153,0.5)] mb-6 leading-tight">
          MADAGASCAR
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-sans leading-relaxed mb-8">
          The ultimate futuristic arcade showdown. Operated live by event coordinators, displayed on shared tournament screens, and synced with the central leaderboard.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link to="/guess-who">
            <Button variant="pink" size="lg" sound="laser" className="w-full sm:w-auto shadow-neon-pink">
              <Tv className="w-4 h-4 mr-1.5" /> Open Projector Display
            </Button>
          </Link>
          <Link to="/admin/guess-who">
            <Button variant="ghost" size="lg" sound="coin" className="w-full sm:w-auto">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Coordinator Console
            </Button>
          </Link>
        </div>

        {/* Championship Countdown Timer */}
        <div className="inline-block p-4 sm:p-6 rounded-2xl bg-cosmic-900/90 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-xl">
          <div className="flex items-center justify-center gap-2 text-xs font-retro text-cyan-400 mb-3">
            <Timer className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>STAGE 1 COUNTDOWN</span>
          </div>
          <div className="flex items-center justify-center gap-4 sm:gap-6 font-retro">
            <div className="text-center">
              <span className="text-2xl sm:text-4xl text-yellow-400 block neon-glow-gold">
                0{timeLeft.hours}
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-mono">Hours</span>
            </div>
            <span className="text-2xl sm:text-4xl text-purple-400">:</span>
            <div className="text-center">
              <span className="text-2xl sm:text-4xl text-pink-400 block neon-glow-pink">
                {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-mono">Mins</span>
            </div>
            <span className="text-2xl sm:text-4xl text-purple-400">:</span>
            <div className="text-center">
              <span className="text-2xl sm:text-4xl text-cyan-400 block neon-glow-cyan">
                {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-mono">Secs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Arcade Statistics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Challengers"
            value="1,248"
            subtext="registered contenders"
            trend="+18%"
            icon={Users}
            variant="pink"
          />
          <StatCard
            title="Guess Who Solved"
            value="3,420"
            subtext="clues decoded"
            trend="+42%"
            icon={HelpCircle}
            variant="cyan"
          />
          <StatCard
            title="Championship XP"
            value="892K"
            subtext="points awarded"
            trend="+24%"
            icon={Flame}
            variant="gold"
          />
          <StatCard
            title="Active Arenas"
            value="24"
            subtext="concurrent rooms"
            icon={Gamepad2}
            variant="purple"
          />
        </div>
      </section>

      {/* Dual Tournament Modules (Person 1 vs Person 2 Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge variant="cyan" size="md" className="mb-2">
            TOURNAMENT ARCHITECTURE
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-retro font-bold text-white tracking-wider">
            TWO CORE MODULES
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Independent, decoupled architecture designed for parallel development
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Module 1: Guess Who? (Person 2's Domain - Coordinator Operated) */}
          <Card variant="pink" brackets={true} scanlines={true} className="relative overflow-hidden group hover:scale-[1.01] transition-transform">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="pink" pulse={true}>
                PERSON 2 DOMAIN • 50% SCOPE
              </Badge>
              <span className="text-xs font-mono text-pink-300">COORDINATOR OPERATED</span>
            </div>

            <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 mb-4">
              <Tv className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-retro text-pink-300 mb-2">
              GUESS WHO? MODULE
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
              Operated live from the admin console and projected on the venue screen for players. Features individual 12-puzzle runs, progressive reveals for Celebrities and Objects, authentic Bollywood dialogues, and an immediate early win at 7 correct answers (maximum achievable score: 7).
            </p>

            <ul className="space-y-2 text-xs font-mono text-slate-300 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-pink-400">✓</span> 12-puzzle runs across 8 official categories
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-400">✓</span> Dedicated projector display (zero answers or scores leaked)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-400">✓</span> Individual player scoring (7 correct wins immediately; max score 7)
              </li>
            </ul>

            <div className="flex items-center gap-3">
              <Link to="/guess-who" className="flex-1">
                <Button variant="pink" size="md" className="w-full">
                  Open Public Display <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/admin/guess-who">
                <Button variant="ghost" size="md">
                  Operator Panel
                </Button>
              </Link>
            </div>
          </Card>

          {/* Module 2: Cosmic Leaderboard (Person 1's Domain) */}
          <Card variant="gold" brackets={true} className="relative overflow-hidden group hover:scale-[1.01] transition-transform">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="gold">
                PERSON 1 DOMAIN • 50% SCOPE
              </Badge>
              <span className="text-xs font-mono text-yellow-300">MODULAR SLOT</span>
            </div>

            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 mb-4">
              <Trophy className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-retro text-yellow-300 mb-2">
              LEADERBOARD & SCORING
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
              Person 1's signature feature. Dedicated real-time leaderboard engine, score normalization, live rankings, and player achievements synced with Supabase Realtime.
            </p>

            <ul className="space-y-2 text-xs font-mono text-slate-300 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span> Real-time ranking podium
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span> Cross-game score aggregation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span> Plug-and-play contract ready
              </li>
            </ul>

            <Link to="/leaderboard">
              <Button variant="gold" size="md" className="w-full">
                View Leaderboard Hub <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Light / High-Contrast Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card variant="light" brackets={true} className="p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl">
            <Badge variant="purple" size="md" className="mb-4">
              ARCADE CHAMPIONSHIP HIGHLIGHT
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-retro font-bold text-cosmic-950 mb-4 tracking-tight leading-tight">
              A FUTURISTIC RETRO SPECTACLE
            </h2>
            <p className="text-base text-slate-700 leading-relaxed font-sans mb-6">
              Experience the nostalgia of 80s arcade parlors merged with cutting-edge real-time web capabilities. Powered by React 18, Vite, Tailwind CSS, and Supabase.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/rules">
                <Button variant="purple" size="md">
                  Read Tournament Rules
                </Button>
              </Link>
              <Link to="/schedule">
                <Button variant="ghost" size="md" className="border-purple-900/40 text-purple-950 hover:bg-purple-200">
                  Event Schedule
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
