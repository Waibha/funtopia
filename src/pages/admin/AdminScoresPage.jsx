import React from 'react';
import { Trophy, ShieldCheck, Database, RefreshCw, FileText, ArrowUpRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function AdminScoresPage() {
  const scoreLogs = [
    { id: 'LOG-901', timestamp: '10:42:15 AM', player: 'CyberNova', game: 'Guess Who? (P2)', change: '+1,250 XP', status: 'Verified', signature: '0x8f2a...c91' },
    { id: 'LOG-902', timestamp: '10:40:02 AM', player: 'RetroVoxel', game: 'Speed Blitz', change: '+950 XP', status: 'Verified', signature: '0x7e11...402' },
    { id: 'LOG-903', timestamp: '10:38:51 AM', player: 'StarGazer_X', game: 'Guess Who? (P2)', change: '+1,000 XP', status: 'Verified', signature: '0x5b38...fa9' },
    { id: 'LOG-904', timestamp: '10:35:10 AM', player: 'NeonBlaster', game: 'Practice Duel', change: '+200 XP', status: 'Pending Review', signature: '0x12c4...e31' },
    { id: 'LOG-905', timestamp: '10:31:44 AM', player: 'PixelPhantom', game: 'Guess Who? (P2)', change: '+1,100 XP', status: 'Verified', signature: '0x99a2...bb4' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">PERSON 1 HOOK</Badge>
            <Badge variant="purple" size="sm">TELEMETRY AUDIT</Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-retro font-bold text-white">
            SCORING SUBMISSION LOG
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Auditing scores submitted by tournament modules prior to leaderboard commitment
          </p>
        </div>

        <Button variant="gold" size="sm">
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Sync Ledger
        </Button>
      </div>

      {/* Integration Notice */}
      <Card variant="hologram" brackets={true} className="border-yellow-500/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-retro text-xs text-yellow-300 mb-1">
              PERSON 1 SCORING INTEGRATION SPEC
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              When Person 1 finalizes the scoring architecture and database tables, this table will stream verified scores directly from Supabase realtime channels. Person 2's Guess Who game will emit match conclusion payloads to this shared pipeline.
            </p>
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card variant="default" brackets={true} className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-purple-950/40 text-slate-400 border-b border-purple-500/20 uppercase font-retro text-[9px]">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-4">Module Source</th>
                <th className="py-3 px-4">Score Awarded</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-4 text-right">Crypto Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {scoreLogs.map((log) => (
                <tr key={log.id} className="hover:bg-purple-900/20 transition-colors">
                  <td className="py-3.5 px-4 text-yellow-400 font-semibold">{log.id}</td>
                  <td className="py-3.5 px-4 text-slate-400">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-sans font-medium text-white">{log.player}</td>
                  <td className="py-3.5 px-4 text-cyan-300">{log.game}</td>
                  <td className="py-3.5 px-4 font-retro text-emerald-400">{log.change}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={log.status === 'Verified' ? 'green' : 'gold'} size="sm">
                      {log.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-500 font-mono">
                    {log.signature}
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
