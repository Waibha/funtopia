import React, { useEffect, useRef } from 'react';

/**
 * AdminArcadeBackground
 * Deep sapphire telemetry motes and celestial stardust.
 * Designed specifically for the High Citadel Chamber: elegant, focused, and accessible.
 */
export default function AdminArcadeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Floating subtle geometric elements
    const shapes = [
      { x: width * 0.1, y: height * 0.2, size: 28, speed: 0.15, angle: 0, rotSpeed: 0.005, type: 'diamond', color: 'rgba(255, 200, 55, 0.18)' },
      { x: width * 0.85, y: height * 0.35, size: 36, speed: 0.18, angle: 0.5, rotSpeed: -0.004, type: 'square', color: 'rgba(0, 240, 255, 0.16)' },
      { x: width * 0.25, y: height * 0.7, size: 32, speed: 0.12, angle: 1.2, rotSpeed: 0.003, type: 'coin', color: 'rgba(255, 200, 55, 0.18)' },
      { x: width * 0.7, y: height * 0.75, size: 24, speed: 0.2, angle: 0.8, rotSpeed: -0.006, type: 'diamond', color: 'rgba(0, 240, 255, 0.16)' },
      { x: width * 0.5, y: height * 0.15, size: 20, speed: 0.14, angle: 0.2, rotSpeed: 0.004, type: 'square', color: 'rgba(56, 189, 248, 0.15)' },
      { x: width * 0.9, y: height * 0.85, size: 30, speed: 0.16, angle: 2.1, rotSpeed: 0.005, type: 'coin', color: 'rgba(255, 200, 55, 0.16)' },
    ];

    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Subtle ambient vignette
      const grad = ctx.createRadialGradient(width / 2, height / 2, width * 0.1, width / 2, height / 2, width * 0.8);
      grad.addColorStop(0, 'rgba(12, 27, 56, 0.45)');
      grad.addColorStop(1, 'rgba(10, 9, 26, 0.90)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      shapes.forEach((s) => {
        if (!prefersReducedMotion) {
          s.y -= s.speed * 40 * dt;
          s.angle += s.rotSpeed;
          if (s.y < -50) s.y = height + 50;
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.strokeStyle = s.color;
        ctx.fillStyle = s.color;
        ctx.lineWidth = 1.5;

        if (s.type === 'coin') {
          ctx.beginPath();
          ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, s.size / 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (s.type === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(0, -s.size / 2);
          ctx.lineTo(s.size / 2, 0);
          ctx.lineTo(0, s.size / 2);
          ctx.lineTo(-s.size / 2, 0);
          ctx.closePath();
          ctx.stroke();
        } else if (s.type === 'square') {
          ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
        }

        ctx.restore();
      });

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render(performance.now());

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle telemetry grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, #00F0FF 1px, transparent 1px), linear-gradient(to bottom, #00F0FF 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}
