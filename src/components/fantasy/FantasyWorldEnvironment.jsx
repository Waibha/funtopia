import React, { useState, useEffect, useRef } from 'react';

/**
 * FantasyWorldEnvironment
 * A living, multi-layered, dynamic fantasy adventure landscape for MADAGASCAR.
 * Features:
 * - Parallax depth driven by pointer motion
 * - Floating celestial islands with cascading waterfalls
 * - Grand fantasy castle citadel with illuminated spires
 * - Drifting atmospheric cloud banks & shimmering auroras
 * - Soaring fantasy creatures across the horizon
 * - Luminous floating mana motes & fireflies
 * - Ancient enchanted forest canopy & glowing crystals
 */
export default function FantasyWorldEnvironment({ className = '' }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Check reduced motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);

    // Mouse movement parallax listener
    const handleMouseMove = (e) => {
      if (reducedMotion) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      mq.removeEventListener('change', handler);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [reducedMotion]);

  // Calculate parallax transform styles based on depth factor
  const getParallaxStyle = (factorX, factorY = factorX) => {
    if (reducedMotion) return {};
    const tx = mousePos.x * factorX * 24;
    const ty = mousePos.y * factorY * 18;
    return {
      transform: `translate3d(${tx}px, ${ty}px, 0)`,
      transition: 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)',
      willChange: 'transform',
    };
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* 1. SKY & CELESTIAL BACKGROUND                                             */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#060414] via-[#0E0B2B] to-[#1A123E]"
        style={getParallaxStyle(0.01)}
      >
        {/* Celestial Starfield */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(1.5px 1.5px at 40px 60px, #FFFFFF, rgba(0,0,0,0)),
                              radial-gradient(1px 1px at 120px 140px, #FFDE7A, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 240px 80px, #7EE7FC, rgba(0,0,0,0)),
                              radial-gradient(1px 1px at 380px 200px, #FFFFFF, rgba(0,0,0,0)),
                              radial-gradient(1.5px 1.5px at 520px 110px, #FFD272, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 700px 160px, #FFFFFF, rgba(0,0,0,0)),
                              radial-gradient(1px 1px at 860px 70px, #A7F3D0, rgba(0,0,0,0)),
                              radial-gradient(1.5px 1.5px at 1040px 190px, #FFFFFF, rgba(0,0,0,0))`,
            backgroundSize: '360px 360px',
          }}
        />

        {/* Luminous Celestial Moon with Golden-Cyan Corona */}
        <div className="absolute top-10 right-12 sm:right-28 w-44 h-44 rounded-full bg-gradient-to-tr from-[#FFE484] via-[#FFF8D6] to-[#FFFFFF] opacity-90 blur-[0.5px] shadow-[0_0_100px_rgba(255,228,132,0.65),0_0_160px_rgba(0,240,255,0.3)] animate-pulse" style={{ animationDuration: '6s' }}>
          {/* Subtle lunar crater textures */}
          <div className="absolute top-10 left-12 w-9 h-9 rounded-full bg-[#E8CF72]/40" />
          <div className="absolute top-22 left-20 w-14 h-14 rounded-full bg-[#E8CF72]/30" />
          <div className="absolute top-28 left-8 w-7 h-7 rounded-full bg-[#E8CF72]/35" />
        </div>

        {/* Shimmering Aurora Ribbon */}
        <div
          className="absolute top-0 inset-x-0 h-[480px] bg-gradient-to-b from-[#10B981]/15 via-[#00F0FF]/10 to-transparent blur-3xl animate-shimmer-aurora"
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. DRIFTING VOLUMETRIC CLOUDS (FAR LAYER)                                */}
      {/* ========================================================================= */}
      <div className="absolute inset-0" style={getParallaxStyle(0.02)}>
        <svg
          viewBox="0 0 1600 600"
          className="w-full h-auto opacity-35 absolute top-16 -left-20 animate-marquee"
          style={{ animationDuration: '75s' }}
          fill="none"
        >
          <path
            d="M0 320 Q 150 260, 300 300 T 600 280 T 900 310 T 1200 270 T 1500 290 T 1800 310 L 1800 600 L 0 600 Z"
            fill="url(#cloudGrad1)"
          />
          <defs>
            <linearGradient id="cloudGrad1" x1="0" y1="260" x2="0" y2="600" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C084FC" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#818CF8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 3. DISTANT MAJESTIC MOUNTAINS & GOD-RAYS                                  */}
      {/* ========================================================================= */}
      <div className="absolute bottom-24 inset-x-0 h-[500px]" style={getParallaxStyle(0.035)}>
        <svg
          viewBox="0 0 1440 450"
          className="w-full h-full"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="distMountain" x1="0" y1="0" x2="0" y2="450" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#312061" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#221447" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#110829" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="godRayGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFDE7A" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FFDE7A" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Jagged Peaks */}
          <polygon
            points="0,450 0,260 120,200 240,290 380,160 520,270 660,140 820,280 960,180 1100,290 1260,170 1440,250 1440,450"
            fill="url(#distMountain)"
          />

          {/* Ethereal God Rays cascading down */}
          <polygon points="660,140 500,450 620,450" fill="url(#godRayGrad)" />
          <polygon points="660,140 700,450 820,450" fill="url(#godRayGrad)" />
          <polygon points="960,180 880,450 990,450" fill="url(#godRayGrad)" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 4. SOARING FANTASY CREATURES / BIRDS FLOCK                                */}
      {/* ========================================================================= */}
      <div className="absolute top-28 left-0 w-48 h-32 animate-fly-across pointer-events-none">
        <svg viewBox="0 0 120 70" fill="none" className="w-full h-full opacity-70">
          {/* Bird 1 */}
          <path d="M10 25 Q 18 15, 26 25 Q 34 15, 42 25 Q 34 22, 26 27 Q 18 22, 10 25 Z" fill="#FFE484" />
          {/* Bird 2 (Offset & smaller) */}
          <path d="M48 18 Q 54 10, 60 18 Q 66 10, 72 18 Q 66 16, 60 20 Q 54 16, 48 18 Z" fill="#FFE484" opacity="0.8" />
          {/* Bird 3 */}
          <path d="M78 32 Q 83 26, 88 32 Q 93 26, 98 32 Q 93 30, 88 34 Q 83 30, 78 32 Z" fill="#FFE484" opacity="0.6" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 5. FLOATING ISLANDS WITH CASCADING WATERFALLS (MIDGROUND)                  */}
      {/* ========================================================================= */}
      {/* Floating Island Left (Large with flowing waterfall) */}
      <div
        className="absolute top-36 -left-12 sm:left-6 md:left-14 w-64 sm:w-84 md:w-96 animate-float-island"
        style={getParallaxStyle(0.05, 0.045)}
      >
        <svg viewBox="0 0 360 260" fill="none" className="w-full h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)]">
          <defs>
            <linearGradient id="islandRock1" x1="0" y1="0" x2="0" y2="260" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2A1B4E" />
              <stop offset="40%" stopColor="#1E1238" />
              <stop offset="100%" stopColor="#0B0617" />
            </linearGradient>
            <linearGradient id="islandGrass1" x1="0" y1="0" x2="360" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="waterfallGrad" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#00F0FF" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#67E8F9" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Ancient Hanging Roots & Inverted Island Keel */}
          <polygon points="30,85 180,245 330,85" fill="url(#islandRock1)" stroke="#090514" strokeWidth="2" />
          <path d="M120 180 Q 130 220, 140 255" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <path d="M210 170 Q 225 210, 230 240" stroke="#10B981" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M170 200 Q 175 235, 180 258" stroke="#34D399" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

          {/* Lush Green Island Plateau */}
          <ellipse cx="180" cy="85" rx="150" ry="24" fill="url(#islandGrass1)" stroke="#090514" strokeWidth="3" />

          {/* Enchanted Temple Shrine on Island */}
          <rect x="160" y="42" width="40" height="36" rx="4" fill="#E2E8F0" stroke="#0B0617" strokeWidth="2" />
          <polygon points="150,44 180,18 210,44" fill="#FFC837" stroke="#0B0617" strokeWidth="2" />
          {/* Shrine Door with Arcane Light */}
          <rect x="174" y="54" width="12" height="24" rx="6" fill="#00F0FF" className="animate-pulse" />

          {/* Fantasy Ancient Trees on Island */}
          {/* Tree 1 */}
          <rect x="95" y="55" width="8" height="24" fill="#451E11" />
          <circle cx="99" cy="45" r="22" fill="#047857" opacity="0.9" />
          <circle cx="95" cy="40" r="16" fill="#10B981" />
          <circle cx="106" cy="44" r="14" fill="#34D399" />
          {/* Tree 2 */}
          <rect x="250" y="58" width="7" height="20" fill="#451E11" />
          <circle cx="253" cy="48" r="18" fill="#047857" />
          <circle cx="258" cy="44" r="13" fill="#10B981" />

          {/* Luminous Cascading Waterfall falling from Island */}
          <path
            d="M174 88 L 174 210"
            stroke="url(#waterfallGrad)"
            strokeWidth="9"
            strokeLinecap="round"
            className="animate-waterfall-stream"
            style={{ strokeDasharray: '20 8' }}
          />
          <path
            d="M182 90 L 182 195"
            stroke="url(#waterfallGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            className="animate-waterfall-stream"
            style={{ strokeDasharray: '16 6' }}
          />

          {/* Shimmering Mist Clouds at Waterfall Bottom */}
          <circle cx="178" cy="205" r="16" fill="#00F0FF" opacity="0.35" className="blur-xs animate-pulse" />
          <circle cx="174" cy="215" r="22" fill="#FFFFFF" opacity="0.25" className="blur-sm" />
        </svg>
      </div>

      {/* Floating Island Right (Smaller satellite island) */}
      <div
        className="absolute top-24 right-0 sm:right-10 md:right-20 w-48 sm:w-64 animate-float-island-delayed"
        style={getParallaxStyle(0.045, 0.04)}
      >
        <svg viewBox="0 0 240 180" fill="none" className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]">
          <polygon points="20,60 120,170 220,60" fill="#1A1035" stroke="#090514" strokeWidth="2" />
          <ellipse cx="120" cy="60" rx="100" ry="18" fill="#10B981" stroke="#090514" strokeWidth="2.5" />
          {/* Weeping Willow Tree */}
          <rect x="116" y="38" width="8" height="22" fill="#3D1D13" />
          <ellipse cx="120" cy="28" rx="28" ry="20" fill="#059669" />
          <ellipse cx="118" cy="24" rx="20" ry="16" fill="#34D399" />
          {/* Glowing Crystal Obelisk */}
          <polygon points="155,58 160,25 165,58" fill="#00F0FF" stroke="#FFFFFF" strokeWidth="1" className="animate-pulse" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 6. THE GRAND CITADEL & CASTLE OF MADAGASCAR (CENTERPIECE)                */}
      {/* ========================================================================= */}
      <div
        className="absolute bottom-16 sm:bottom-20 inset-x-0 flex justify-center items-end"
        style={getParallaxStyle(0.075, 0.07)}
      >
        <div className="w-[680px] sm:w-[920px] md:w-[1100px] h-auto max-w-full">
          <svg
            viewBox="0 0 1100 420"
            fill="none"
            className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)]"
          >
            <defs>
              <linearGradient id="citadelStone" x1="0" y1="0" x2="0" y2="420" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2E1C58" />
                <stop offset="50%" stopColor="#1B0F38" />
                <stop offset="100%" stopColor="#0D061E" />
              </linearGradient>
              <linearGradient id="citadelRoof" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="40%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id="goldSpire" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFE484" />
                <stop offset="100%" stopColor="#FF9E1B" />
              </linearGradient>
              <linearGradient id="magicRiver" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Cliff Pedestal beneath the Castle */}
            <path
              d="M150 420 L 260 270 Q 550 250, 840 270 L 950 420 Z"
              fill="#130B26"
              stroke="#070310"
              strokeWidth="4"
            />

            {/* Cascading Mountain River flowing out from underneath the Castle */}
            <path
              d="M500 290 Q 550 330, 480 370 Q 420 400, 460 420 L 640 420 Q 680 390, 620 360 Q 570 320, 600 290 Z"
              fill="url(#magicRiver)"
              className="animate-pulse"
              style={{ animationDuration: '4s' }}
            />

            {/* Outer Castle Curtain Walls */}
            <rect x="280" y="220" width="540" height="70" fill="url(#citadelStone)" stroke="#090414" strokeWidth="3" />
            {/* Wall Battlements */}
            {Array.from({ length: 18 }).map((_, i) => (
              <rect key={i} x={288 + i * 30} y="206" width="14" height="15" fill="#241645" stroke="#090414" strokeWidth="2" />
            ))}

            {/* Left Grand Tower */}
            <rect x="320" y="140" width="70" height="120" rx="4" fill="url(#citadelStone)" stroke="#090414" strokeWidth="3" />
            <polygon points="310,140 355,50 400,140" fill="url(#citadelRoof)" stroke="#090414" strokeWidth="3" />
            <circle cx="355" cy="46" r="4" fill="url(#goldSpire)" />

            {/* Right Grand Tower */}
            <rect x="710" y="140" width="70" height="120" rx="4" fill="url(#citadelStone)" stroke="#090414" strokeWidth="3" />
            <polygon points="700,140 745,50 790,140" fill="url(#citadelRoof)" stroke="#090414" strokeWidth="3" />
            <circle cx="745" cy="46" r="4" fill="url(#goldSpire)" />

            {/* Central Keep (Tallest Citadel Spire) */}
            <rect x="470" y="100" width="160" height="160" rx="6" fill="url(#citadelStone)" stroke="#090414" strokeWidth="3.5" />
            <polygon points="450,100 550,0 650,100" fill="url(#citadelRoof)" stroke="#090414" strokeWidth="3.5" />
            {/* Golden Apex Crown on Central Keep */}
            <polygon points="545,0 550,-18 555,0" fill="url(#goldSpire)" stroke="#090414" strokeWidth="1.5" />
            <circle cx="550" cy="-20" r="5" fill="#FFC837" className="animate-ping" style={{ animationDuration: '3s' }} />

            {/* Grand Rose Window with Magical Radiance */}
            <circle cx="550" cy="150" r="28" fill="#00F0FF" stroke="#FFC837" strokeWidth="3" opacity="0.9" />
            <circle cx="550" cy="150" r="16" fill="#FFE484" opacity="0.85" />
            <circle cx="550" cy="150" r="6" fill="#FFFFFF" />

            {/* Sentry Tower Arched Windows with Warm Lantern Glow */}
            <rect x="345" y="170" width="20" height="36" rx="10" fill="#FFC837" stroke="#090414" strokeWidth="2" className="animate-pulse" />
            <rect x="735" y="170" width="20" height="36" rx="10" fill="#FFC837" stroke="#090414" strokeWidth="2" className="animate-pulse" />

            {/* Castle Spires / Minor Minarets */}
            <polygon points="420,180 435,120 450,180" fill="url(#citadelRoof)" stroke="#090414" strokeWidth="2" />
            <polygon points="650,180 665,120 680,180" fill="url(#citadelRoof)" stroke="#090414" strokeWidth="2" />

            {/* Castle Portcullis Gateway */}
            <rect x="520" y="240" width="60" height="50" rx="30" fill="#070310" stroke="#FFC837" strokeWidth="2.5" />
            <rect x="526" y="248" width="48" height="42" rx="24" fill="#FF9E1B" opacity="0.8" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. DYNAMIC PARTICLES: GLOWING FIREFLIES & MANA MOTES                      */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Firefly Clusters */}
        {[
          { x: '15%', y: '60%', size: 6, color: '#FFC837', dur: '3.2s', del: '0s' },
          { x: '25%', y: '45%', size: 4, color: '#00F0FF', dur: '4.5s', del: '0.8s' },
          { x: '35%', y: '70%', size: 5, color: '#10B981', dur: '3.8s', del: '1.4s' },
          { x: '48%', y: '55%', size: 7, color: '#FFE484', dur: '5.0s', del: '0.3s' },
          { x: '62%', y: '65%', size: 5, color: '#00F0FF', dur: '3.6s', del: '1.9s' },
          { x: '75%', y: '50%', size: 6, color: '#FFC837', dur: '4.2s', del: '0.6s' },
          { x: '85%', y: '68%', size: 4, color: '#34D399', dur: '3.9s', del: '1.1s' },
          { x: '18%', y: '30%', size: 5, color: '#FFDE7A', dur: '4.8s', del: '2.1s' },
          { x: '82%', y: '35%', size: 6, color: '#00F0FF', dur: '3.4s', del: '1.6s' },
          { x: '50%', y: '38%', size: 4, color: '#FFC837', dur: '4.0s', del: '0.9s' },
        ].map((f, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-firefly-glow"
            style={{
              left: f.x,
              top: f.y,
              width: `${f.size}px`,
              height: `${f.size}px`,
              backgroundColor: f.color,
              boxShadow: `0 0 16px ${f.color}, 0 0 32px ${f.color}`,
              animationDuration: f.dur,
              animationDelay: f.del,
            }}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 8. FOREGROUND ENCHANTED CANOPY & CRYSTAL CLUSTERS                         */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none" style={getParallaxStyle(0.12, 0.1)}>
        {/* Top-Left Ancient Canopy Branch with Hanging Glowing Lantern */}
        <div className="absolute -top-6 -left-10 w-72 sm:w-96 h-64">
          <svg viewBox="0 0 320 220" fill="none" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
            <path
              d="M0 0 Q 140 30, 220 80 Q 280 120, 310 160"
              stroke="#130826"
              strokeWidth="28"
              strokeLinecap="round"
            />
            {/* Hanging Cord & Glowing Lantern */}
            <line x1="220" y1="80" x2="220" y2="135" stroke="#FFC837" strokeWidth="2" />
            <circle cx="220" cy="145" r="14" fill="#FFC837" className="animate-pulse shadow-fantasy-gold" />
            <polygon points="214,131 220,123 226,131" fill="#FF9E1B" />
            <polygon points="214,159 220,167 226,159" fill="#FF9E1B" />
          </svg>
        </div>

        {/* Bottom-Left Luminous Crystal Cluster */}
        <div className="absolute -bottom-6 -left-6 w-48 sm:w-64 h-48">
          <svg viewBox="0 0 200 180" fill="none" className="w-full h-full drop-shadow-[0_0_25px_rgba(0,240,255,0.5)]">
            {/* Crystal 1 (Center Tall Cyan) */}
            <polygon points="70,180 85,50 100,65 90,180" fill="#00F0FF" opacity="0.9" stroke="#E0F2FE" strokeWidth="1.5" />
            {/* Crystal 2 (Left Emerald) */}
            <polygon points="40,180 55,80 70,95 60,180" fill="#10B981" opacity="0.85" stroke="#D1FAE5" strokeWidth="1.5" />
            {/* Crystal 3 (Right Amber) */}
            <polygon points="95,180 115,90 125,105 110,180" fill="#FFC837" opacity="0.85" stroke="#FEF3C7" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Bottom-Right Foreground Ancient Stone & Flora */}
        <div className="absolute -bottom-8 -right-8 w-52 sm:w-72 h-52">
          <svg viewBox="0 0 220 180" fill="none" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
            <path d="M40 180 Q 90 90, 180 100 L 220 180 Z" fill="#0F0922" stroke="#05020C" strokeWidth="3" />
            {/* Glowing flora flowers */}
            <circle cx="95" cy="115" r="7" fill="#00F0FF" className="animate-pulse" />
            <circle cx="130" cy="105" r="9" fill="#FFC837" className="animate-pulse" style={{ animationDelay: '1s' }} />
            <circle cx="160" cy="118" r="6" fill="#10B981" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
          </svg>
        </div>
      </div>

      {/* Ambient Vignette & Mist Floor Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0A091A] via-[#0A091A]/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0A091A]/20 to-[#05040D]/75 pointer-events-none" />
    </div>
  );
}
