import React from 'react';

/**
 * Premium Retro Pop Canvas
 * Warm ivory / cream background with faint geometric grid graph texture.
 */
export default function CosmicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FAF7EE]">
      {/* Subtle retro graph pattern in warm ivory */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `linear-gradient(#180A28 1px, transparent 1px), linear-gradient(90deg, #180A28 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
    </div>
  );
}
