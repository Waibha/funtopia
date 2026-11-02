import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, AlertTriangle, Zap, Gamepad2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function RulesPage() {
  const ruleSections = [
    {
      title: '1. GENERAL ARCADE ETIQUETTE',
      rules: [
        'Players must respect opponent clocks and adhere to fair play regulations.',
        'Use of external automated deduction tools or cheating engines is strictly prohibited.',
        'Each match must be confirmed by both players in the lobby before round initiation.',
      ],
    },
    {
      title: '2. GUESS WHO? TOURNAMENT PROTOCOL (COORDINATOR OPERATED)',
      rules: [
        'Stage Presentation: The event coordinator operates the game from Mission Control and projects the puzzle on the venue screen for players who guess verbally.',
        'Slab Composition: Each player attempts an individual 12-puzzle run composed of mixed categories (Hollywood, Bollywood, Scientists, Objects, Flags, Bollywood Dialogues, Logos, Misc).',
        'Progressive Unmasking: For Celebrities and Objects, the coordinator controls progressive image reveals (from heavy blur to crystal clarity).',
        'Scoring & Winner Qualification: Correct = 1 point, Wrong = 0, Skip = 0. The first player to reach 7 correct answers wins immediately (maximum achievable final score is 7). Players who do not reach 7 can attempt all 12 puzzles.',
        'Projector Privacy: Correct answers, scores, and question metadata are strictly hidden from the public projector screen at all times.',
      ],
    },
    {
      title: '3. SCORING & LEADERBOARD RULES (PERSON 1 MODULE)',
      rules: [
        'Winning a standard Guess Who round awards +1,000 Championship XP.',
        'Speed bonus: Winning with 5 or fewer questions asked awards a +500 XP multiplier.',
        'Consecutive match wins trigger a Streak Bonus (+100 XP per win in sequence).',
        'All scores are verified and signed via Supabase database functions.',
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="purple" size="md">
          OFFICIAL CODE OF CONDUCT
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-retro font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300">
          ARCADE RULEBOOK
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Tournament guidelines, deduction mechanics, and scoring criteria for the Funtopia Championship.
        </p>
      </div>

      {/* Rules Accordion / Cards */}
      <div className="space-y-6">
        {ruleSections.map((sec, idx) => (
          <Card key={idx} variant="default" brackets={true} className="p-6">
            <h3 className="font-retro text-xs sm:text-sm text-cyan-300 mb-4 tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              {sec.title}
            </h3>
            <ul className="space-y-3">
              {sec.rules.map((rule, rIdx) => (
                <li key={rIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
