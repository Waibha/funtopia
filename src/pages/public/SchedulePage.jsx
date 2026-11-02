import React from 'react';
import { Calendar, Clock, Sparkles, Trophy, HelpCircle, Flame, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function SchedulePage() {
  const events = [
    {
      time: '10:00 AM - 11:30 AM',
      title: 'Opening Ceremony & Galactic Briefing',
      module: 'Main Event',
      badge: 'cyan',
      status: 'completed',
      desc: 'Player registration validation, rules explanation, and exhibition match kickoff.',
    },
    {
      time: '12:00 PM - 02:30 PM',
      title: 'Guess Who? Mystery Qualifier (Stage 1)',
      module: 'Person 2 Scope',
      badge: 'pink',
      status: 'active',
      desc: '1-on-1 cosmic deduction brackets. Top 16 players advance to championship elimination.',
    },
    {
      time: '03:00 PM - 04:30 PM',
      title: 'Leaderboard Speed Trial Sprint',
      module: 'Person 1 Scope',
      badge: 'gold',
      status: 'upcoming',
      desc: 'High-speed deduction puzzles and score aggregation sprint across all active terminals.',
    },
    {
      time: '05:00 PM - 06:30 PM',
      title: 'Grand Finals & Arcade Awards Gala',
      module: 'Championship',
      badge: 'purple',
      status: 'upcoming',
      desc: 'Top 4 players battle on main stage for the Golden Joystick trophy and championship prizes.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="cyan" size="md">
          TOURNAMENT TIMELINE
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-retro font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400">
          EVENT SCHEDULE
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Track matches, deduction rounds, and live broadcasts throughout the championship day.
        </p>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {events.map((evt, idx) => (
          <Card
            key={idx}
            variant={evt.status === 'active' ? 'pink' : 'default'}
            brackets={true}
            className={`transition-all ${evt.status === 'active' ? 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.25)]' : ''}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="font-mono text-xs text-slate-300 font-semibold">{evt.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={evt.badge} size="sm">
                  {evt.module}
                </Badge>
                {evt.status === 'active' && (
                  <Badge variant="green" size="sm" pulse={true}>
                    LIVE NOW
                  </Badge>
                )}
                {evt.status === 'completed' && (
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Done
                  </span>
                )}
              </div>
            </div>

            <h3 className="font-retro text-sm sm:text-base text-white mb-2">
              {evt.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {evt.desc}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
