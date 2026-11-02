import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  HelpCircle, 
  Trophy, 
  Database, 
  Server, 
  Activity, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Zap
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import { checkSupabaseConnection, isSupabaseConfigured } from '../../services/supabaseClient';

export default function AdminDashboardPage() {
  const [connectionStatus, setConnectionStatus] = useState({
    loading: true,
    connected: false,
    message: 'Testing connection...',
  });

  const runDiagnostics = async () => {
    setConnectionStatus({ loading: true, connected: false, message: 'Pinging Supabase...' });
    const result = await checkSupabaseConnection();
    setConnectionStatus({
      loading: false,
      connected: result.connected,
      message: result.note || result.message || 'Ready',
    });
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="space-y-8">
      {/* Title & Stage Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="purple" size="md" className="mb-2">
            MISSION CONTROL MAIN
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-retro font-bold text-white tracking-wide">
            ADMIN DASHBOARD
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time telemetry, tournament orchestrator, and module status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={runDiagnostics}
            disabled={connectionStatus.loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${connectionStatus.loading ? 'animate-spin' : ''}`} />
            Run Diagnostics
          </Button>
          <Link to="/guess-who">
            <Button variant="pink" size="sm">
              Open Projector Display Screen
            </Button>
          </Link>
        </div>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Supabase Client"
          value={connectionStatus.connected ? 'ONLINE' : 'OFFLINE'}
          subtext={connectionStatus.message}
          icon={Database}
          variant={connectionStatus.connected ? 'cyan' : 'gold'}
        />
        <StatCard
          title="Registered Players"
          value="1,248"
          subtext="across 14 teams"
          trend="+12 today"
          icon={Users}
          variant="pink"
        />
        <StatCard
          title="Active Mystery Rooms"
          value="18"
          subtext="Person 2 arena"
          icon={HelpCircle}
          variant="purple"
        />
        <StatCard
          title="Leaderboard Events"
          value="5,892"
          subtext="Person 1 telemetry"
          icon={Trophy}
          variant="gold"
        />
      </div>

      {/* Database & Environment Inspector */}
      <Card variant="hologram" brackets={true} className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${connectionStatus.connected ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-amber-500/20 border-amber-500/40 text-amber-400'}`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-retro text-sm text-cyan-300">
                SUPABASE CONNECTION TELEMETRY
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {connectionStatus.connected
                  ? 'Authenticated via Public Anon Key (RLS Active)'
                  : 'Operating in local mock fallback mode'}
              </p>
            </div>
          </div>
          <Badge variant={connectionStatus.connected ? 'green' : 'gold'} size="md">
            {connectionStatus.connected ? 'CONNECTED' : 'LOCAL DEV MODE'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-cosmic-950/60 border border-purple-500/20">
            <span className="text-slate-400 block mb-1">Environment:</span>
            <span className="text-cyan-300 font-semibold">{import.meta.env.VITE_APP_ENV || 'development'}</span>
          </div>
          <div className="p-3 rounded-lg bg-cosmic-950/60 border border-purple-500/20">
            <span className="text-slate-400 block mb-1">Supabase URL:</span>
            <span className="text-cyan-300 font-semibold truncate block">
              {import.meta.env.VITE_SUPABASE_URL || 'Not set (using fallback)'}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-cosmic-950/60 border border-purple-500/20">
            <span className="text-slate-400 block mb-1">Security Standard:</span>
            <span className="text-emerald-400 font-semibold">Service Role Keys Hidden</span>
          </div>
        </div>
      </Card>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="pink" brackets={true} className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-retro text-xs text-pink-400">PERSON 2 MODULE</span>
              <Badge variant="pink" size="sm">50% SCOPE</Badge>
            </div>
            <h4 className="font-retro text-sm text-white mb-2">Guess Who? Mission Operator</h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
              Operate live tournament rounds, progressive reveals (Celebrities & Objects), answers, and team score recording.
            </p>
          </div>
          <Link to="/admin/guess-who">
            <Button variant="pink" size="sm" className="w-full">
              Open Operator Console →
            </Button>
          </Link>
        </Card>

        <Card variant="gold" brackets={true} className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-retro text-xs text-yellow-400">PERSON 1 MODULE</span>
              <Badge variant="gold" size="sm">50% SCOPE</Badge>
            </div>
            <h4 className="font-retro text-sm text-white mb-2">Leaderboard Telemetry</h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
              Dedicated monitoring console for scores audit, ranking recalculation, and dispute resolution.
            </p>
          </div>
          <Link to="/admin/scores">
            <Button variant="gold" size="sm" className="w-full">
              Open Scoring Logs →
            </Button>
          </Link>
        </Card>

        <Card variant="cyan" brackets={true} className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-retro text-xs text-cyan-400">PARTICIPANTS</span>
              <Badge variant="cyan" size="sm">CHAMPIONSHIP</Badge>
            </div>
            <h4 className="font-retro text-sm text-white mb-2">Player Directory</h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
              Manage registered contenders, roster check-ins, team affiliations, and qualification badges.
            </p>
          </div>
          <Link to="/admin/participants">
            <Button variant="cyan" size="sm" className="w-full">
              Manage Participants →
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
