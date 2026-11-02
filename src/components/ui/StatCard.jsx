import React from 'react';
import Card from './Card';

/**
 * Arcade Stat Display Card
 */
export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  variant = 'cyan', // 'pink' | 'cyan' | 'gold' | 'purple'
  trend,
  className = '',
}) {
  const accentColors = {
    cyan: {
      text: 'text-cyan-400',
      glow: 'neon-glow-cyan',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    },
    pink: {
      text: 'text-pink-400',
      glow: 'neon-glow-pink',
      iconBg: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    },
    gold: {
      text: 'text-yellow-400',
      glow: 'neon-glow-gold',
      iconBg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    },
    purple: {
      text: 'text-purple-400',
      glow: '',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
  }[variant] || {
    text: 'text-cyan-400',
    glow: 'neon-glow-cyan',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  };

  return (
    <Card variant={variant} className={`overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-slate-400 block mb-1">
            {title}
          </span>
          <div className={`text-2xl sm:text-3xl font-retro font-bold ${accentColors.text} ${accentColors.glow}`}>
            {value}
          </div>
          {subtext && (
            <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
              {trend && (
                <span className={trend.startsWith('+') ? 'text-emerald-400' : 'text-amber-400'}>
                  {trend}
                </span>
              )}
              {subtext}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${accentColors.iconBg} shadow-inner`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
}
