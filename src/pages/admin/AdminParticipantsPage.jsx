import React, { useState } from 'react';
import { Users, Search, Plus, CheckCircle, XCircle, ShieldCheck, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function AdminParticipantsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const participants = [
    { id: 'PLR-101', name: 'CyberNova', email: 'nova@funtopia.arcade', role: 'Contender', status: 'Active', seed: '#1', team: 'Nebula Rogues' },
    { id: 'PLR-102', name: 'RetroVoxel', email: 'voxel@funtopia.arcade', role: 'Contender', status: 'Active', seed: '#2', team: 'Bit Shift' },
    { id: 'PLR-103', name: 'StarGazer_X', email: 'stargazer@funtopia.arcade', role: 'Contender', status: 'Active', seed: '#3', team: 'Pulsar Squad' },
    { id: 'PLR-104', name: 'NeonBlaster', email: 'blaster@funtopia.arcade', role: 'Contender', status: 'Pending', seed: '#4', team: 'Laser Knights' },
    { id: 'PLR-105', name: 'PixelPhantom', email: 'phantom@funtopia.arcade', role: 'Contender', status: 'Active', seed: '#5', team: 'Shadow Ops' },
    { id: 'PLR-106', name: 'QuantumLeap', email: 'quantum@funtopia.arcade', role: 'Judge', status: 'Active', seed: '-', team: 'Mainframe Crew' },
  ];

  const filtered = participants.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="cyan" size="sm" className="mb-1">PLAYER MANAGEMENT</Badge>
          <h1 className="text-xl sm:text-2xl font-retro font-bold text-white">
            PARTICIPANTS DIRECTORY
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            {participants.length} registered tournament contenders
          </p>
        </div>

        <Button variant="cyan" size="sm">
          <Plus className="w-3.5 h-3.5 mr-1" /> Register Contender
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-cosmic-950/80 border border-purple-500/30 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {['all', 'active', 'pending'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-md text-[10px] font-retro uppercase transition-all ${
                statusFilter === s
                  ? 'bg-cyan-500 text-cosmic-950 font-bold'
                  : 'bg-purple-950/40 text-slate-400 hover:text-white border border-purple-500/20'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Participants Table */}
      <Card variant="default" brackets={true} className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-purple-950/40 text-slate-400 border-b border-purple-500/20 uppercase font-retro text-[9px]">
              <tr>
                <th className="py-3 px-4">Player ID</th>
                <th className="py-3 px-4">Handle</th>
                <th className="py-3 px-4 hidden md:table-cell">Team</th>
                <th className="py-3 px-4 hidden sm:table-cell">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Seed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-purple-900/20 transition-colors">
                  <td className="py-3.5 px-4 text-cyan-400 font-mono font-semibold">
                    {p.id}
                  </td>
                  <td className="py-3.5 px-4 font-sans font-medium text-white">
                    <div>{p.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{p.email}</div>
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell text-slate-300">
                    {p.team}
                  </td>
                  <td className="py-3.5 px-4 hidden sm:table-cell text-slate-400">
                    {p.role}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={p.status === 'Active' ? 'green' : 'gold'} size="sm">
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-retro text-yellow-300">
                    {p.seed}
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
