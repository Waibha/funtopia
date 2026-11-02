import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Home, RotateCcw } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <Card variant="hologram" brackets={true} scanlines={true} className="max-w-lg w-full text-center p-8 sm:p-12 border-pink-500/50 shadow-[0_0_50px_rgba(236,72,153,0.3)]">
        <Badge variant="pink" size="md" className="mb-4">
          SECTOR 404 UNREACHABLE
        </Badge>

        <div className="text-6xl sm:text-7xl mb-4 animate-bounce">
          🛸
        </div>

        <h1 className="text-4xl sm:text-5xl font-retro font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-300 to-cyan-400 mb-4 neon-glow-pink">
          404 ERROR
        </h1>

        <p className="font-retro text-xs text-yellow-300 mb-3">
          LOST IN DEEP SPACE
        </p>

        <p className="text-sm text-slate-300 font-sans leading-relaxed mb-8">
          The planetary coordinates you entered do not exist on the galactic star map or have been warped by a cosmic anomaly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button variant="pink" size="md" sound="laser">
              <Home className="w-4 h-4 mr-1.5" /> Warp Back to Earth
            </Button>
          </Link>
          <Link to="/guess-who">
            <Button variant="ghost" size="md">
              <RotateCcw className="w-4 h-4 mr-1.5" /> Enter Guess Who
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
