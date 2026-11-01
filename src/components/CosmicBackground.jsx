import React from 'react';

/**
 * Clean Retro Arcade Background
 * Replaces cosmic space dust with a minimalist, high-performance dark arcade chassis texture.
 */
export default function CosmicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0c0b10]">
      {/* Subtle retro arcade grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      {/* Very subtle vignetting on screen edges like an arcade bezel */}
      <div className="absolute inset-0 bg-radial-vignette opacity-50" />
    </div>
  );
}
