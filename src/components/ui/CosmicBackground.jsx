import React, { useMemo } from 'react';

/**
 * Cosmic Retro Background with twinkling stars, nebula lights, and retro horizon grid
 */
export default function CosmicBackground() {
  // Generate a deterministic constellation of stars
  const stars = useMemo(() => {
    return Array.from({ length: 65 }).map((_, i) => ({
      id: i,
      x: ((i * 37 + 13) % 100),
      y: ((i * 53 + 7) % 100),
      size: (i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1),
      opacity: 0.3 + ((i * 19) % 70) / 100,
      duration: 2 + ((i * 11) % 40) / 10,
      delay: ((i * 7) % 30) / 10,
      color: i % 5 === 0 ? '#ff2a85' : i % 4 === 0 ? '#00f0ff' : i % 3 === 0 ? '#facc15' : '#ffffff',
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#070714]">
      {/* Deep Space Nebula Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/20 blur-[130px]" />
      <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-pink-900/15 blur-[140px]" />
      <div className="absolute bottom-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-cyan-900/15 blur-[120px]" />
      <div className="absolute top-[60%] right-[30%] w-[30vw] h-[30vw] rounded-full bg-indigo-900/20 blur-[100px]" />

      {/* Twinkling Stars */}
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
            animation: `pulse ${star.duration}s infinite ease-in-out ${star.delay}s`,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Retro Synthwave Horizon Floor Grid */}
      <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#070714]/80 to-[#070714]" />
        <div className="w-full h-full retro-grid-floor border-t border-purple-500/20" />
      </div>
    </div>
  );
}
