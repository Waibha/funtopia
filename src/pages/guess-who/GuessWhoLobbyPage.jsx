import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Tv, ShieldCheck, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

/**
 * Repurposed Lobby Page:
 * Redirects players to the main presentation display screen.
 * In the coordinator-operated model, players do not use interactive lobbies or accounts.
 */
export default function GuessWhoLobbyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <Card variant="hologram" brackets={true} className="p-8 space-y-4 border-cyan-400/50">
        <Badge variant="cyan" size="md">
          COORDINATOR-OPERATED GAME
        </Badge>
        
        <div className="text-5xl my-2">
          📺
        </div>

        <h1 className="text-2xl font-retro font-bold text-white">
          SHARED PROJECTOR DISPLAY ACTIVE
        </h1>

        <p className="text-sm text-slate-300 font-sans leading-relaxed">
          The Guess Who? tournament is operated directly by event coordinators from Mission Control. Players do not need accounts, rooms, or personal devices — simply view the live match on the shared venue screen!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link to="/guess-who">
            <Button variant="cyan" size="md">
              <Tv className="w-4 h-4 mr-1.5" /> View Projector Display Screen
            </Button>
          </Link>
          <Link to="/admin/guess-who">
            <Button variant="ghost" size="md">
              <ShieldCheck className="w-4 h-4 mr-1.5" /> Coordinator Console
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
