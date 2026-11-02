import React from 'react';
import { playArcadeSound } from '../../utilities/sound';

/**
 * Cosmic Retro Arcade Button
 */
export default function Button({
  children,
  variant = 'pink', // 'pink' | 'cyan' | 'gold' | 'purple' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  sound = 'blip',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const handleClick = (e) => {
    if (disabled) return;
    if (sound) playArcadeSound(sound);
    if (onClick) onClick(e);
  };

  const baseStyles = 'inline-flex items-center justify-center font-retro uppercase transition-all duration-100 select-none cursor-pointer tracking-wider disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const sizeStyles = {
    sm: 'text-[9px] px-3 py-1.5 rounded-md gap-1.5 active:translate-y-0.5',
    md: 'text-[11px] px-5 py-2.5 rounded-lg gap-2 active:translate-y-1',
    lg: 'text-[13px] px-7 py-3.5 rounded-xl gap-2.5 active:translate-y-1',
  };

  const variantStyles = {
    pink: 'bg-gradient-to-b from-pink-500 to-rose-600 text-white border border-pink-300/40 shadow-[0_4px_0_#881337,0_0_15px_rgba(236,72,153,0.4)] hover:brightness-110 active:shadow-[0_1px_0_#881337]',
    cyan: 'bg-gradient-to-b from-cyan-400 to-cyan-600 text-cosmic-950 font-bold border border-cyan-200/50 shadow-[0_4px_0_#0e7490,0_0_15px_rgba(6,182,212,0.4)] hover:brightness-110 active:shadow-[0_1px_0_#0e7490]',
    gold: 'bg-gradient-to-b from-yellow-300 to-amber-500 text-cosmic-950 font-bold border border-yellow-200/50 shadow-[0_4px_0_#b45309,0_0_15px_rgba(250,204,21,0.4)] hover:brightness-110 active:shadow-[0_1px_0_#b45309]',
    purple: 'bg-gradient-to-b from-purple-600 to-indigo-800 text-white border border-purple-400/40 shadow-[0_4px_0_#3b0764,0_0_15px_rgba(168,85,247,0.4)] hover:brightness-110 active:shadow-[0_1px_0_#3b0764]',
    ghost: 'bg-cosmic-900/60 backdrop-blur-md text-cyan-300 border border-cyan-500/40 shadow-[0_4px_0_#1e1b4b] hover:bg-cyan-500/10 hover:text-white hover:border-cyan-400 active:shadow-[0_1px_0_#1e1b4b]',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.pink} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
