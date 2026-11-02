import React from 'react';

/**
 * Cosmic Retro Card Component with optional cyber corner brackets
 */
export default function Card({
  children,
  variant = 'default', // 'default' | 'light' | 'pink' | 'cyan' | 'gold' | 'hologram'
  brackets = true,
  scanlines = false,
  className = '',
  ...props
}) {
  const variantStyles = {
    default: 'bg-cosmic-900/80 border-purple-500/30 text-white shadow-xl shadow-purple-950/40 backdrop-blur-md',
    light: 'bg-gradient-to-b from-purple-50 to-indigo-100 text-cosmic-950 border-purple-300 shadow-2xl shadow-purple-500/20',
    pink: 'bg-cosmic-900/90 border-pink-500/40 text-white shadow-xl shadow-pink-950/30 hover:border-pink-500/70 transition-colors',
    cyan: 'bg-cosmic-900/90 border-cyan-500/40 text-white shadow-xl shadow-cyan-950/30 hover:border-cyan-500/70 transition-colors',
    gold: 'bg-cosmic-900/90 border-yellow-500/40 text-white shadow-xl shadow-yellow-950/30 hover:border-yellow-500/70 transition-colors',
    hologram: 'bg-purple-950/40 border-cyan-400/40 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-lg',
  };

  const bracketColor = {
    default: 'border-purple-400/70',
    light: 'border-purple-600',
    pink: 'border-pink-400',
    cyan: 'border-cyan-400',
    gold: 'border-yellow-400',
    hologram: 'border-cyan-300',
  }[variant] || 'border-cyan-400';

  return (
    <div
      className={`relative rounded-xl border p-6 transition-all duration-200 ${variantStyles[variant] || variantStyles.default} ${className}`}
      {...props}
    >
      {/* Corner Cyber Brackets */}
      {brackets && (
        <>
          <span className={`absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 ${bracketColor}`} />
          <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 ${bracketColor}`} />
          <span className={`absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 ${bracketColor}`} />
          <span className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 ${bracketColor}`} />
        </>
      )}

      {/* CRT Scanline overlay if requested */}
      {scanlines && (
        <div className="absolute inset-0 retro-scanlines pointer-events-none rounded-xl overflow-hidden" />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
