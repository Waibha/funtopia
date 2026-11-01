import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl p-8 border border-purple-500/30 rounded-2xl bg-purple-950/20 backdrop-blur shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 font-retro mb-4">
          FUNTOPIA
        </h1>
        <p className="text-gray-300 text-lg mb-2">
          Cosmic Retro Event Leaderboard
        </p>
        <p className="text-xs text-purple-300 font-mono">
          Project initialized & connected to GitHub repository.
        </p>
      </div>
    </div>
  );
}
