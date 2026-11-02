import React from 'react';

/**
 * Cosmic Retro Badge
 */
export default function Badge({
  children,
  variant = 'pink', // 'pink' | 'cyan' | 'gold' | 'purple' | 'green' | 'red'
  pulse = false,
  size = 'md', // 'sm' | 'md'
  className = '',
}) {
  const variantStyles = {
    pink: 'bg-pink-950/60 text-pink-300 border-pink-500/50 shadow-[0_0_8px_rgba(236,72,153,0.3)]',
    cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]',
    gold: 'bg-yellow-950/60 text-yellow-300 border-yellow-500/50 shadow-[0_0_8px_rgba(250,204,21,0.3)]',
    purple: 'bg-purple-950/60 text-purple-300 border-purple-500/50 shadow-[0_0_8px_rgba(168,85,247,0.3)]',
    green: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]',
    red: 'bg-red-950/60 text-red-300 border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.3)]',
  };

  const sizeStyles = {
    sm: 'text-[8px] px-2 py-0.5',
    md: 'text-[10px] px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-retro uppercase border rounded-full font-medium tracking-wider backdrop-blur-sm ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.pink} ${pulse ? 'animate-pulse' : ''} ${className}`}
    >
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />}
      {children}
    </span>
  );
}
