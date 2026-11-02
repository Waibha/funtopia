import React, { useEffect, useRef } from 'react';

/**
 * ParticipantArcadeBackground
 * Floating celestial stardust and glowing runic crystals.
 * Creates an immersive magical fantasy adventure atmosphere for the Adventurers' Realm.
 */
export default function ParticipantArcadeBackground() {
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

    // Floating fantasy motes & crystals
    const elements = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 14 + Math.random() * 18,
      speedY: 15 + Math.random() * 25, // gentle drift down
      speedX: (Math.random() - 0.5) * 8,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      type: ['coin', 'diamond', 'square', 'star'][i % 4],
      color: [
        'rgba(255, 200, 55, 0.20)', // gold
        'rgba(16, 185, 129, 0.18)', // emerald
        'rgba(0, 240, 255, 0.18)',  // cyan
        'rgba(168, 85, 247, 0.18)', // amethyst
      ][i % 4],
    }));

    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Deep fantasy night gradient
      const grad = ctx.createRadialGradient(width / 2, height * 0.4, 100, width / 2, height * 0.5, width * 0.85);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
      grad.addColorStop(0.7, 'rgba(11, 15, 29, 0.75)');
      grad.addColorStop(1, 'rgba(10, 9, 26, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      elements.forEach((el) => {
        if (!prefersReducedMotion) {
          el.y += el.speedY * dt;
          el.x += el.speedX * dt;
          el.rot += el.rotSpeed;

          if (el.y > height + 40) el.y = -40;
          if (el.x > width + 40) el.x = -40;
          if (el.x < -40) el.x = width + 40;
        }

        ctx.save();
        ctx.translate(el.x, el.y);
        ctx.rotate(el.rot);
        ctx.strokeStyle = el.color;
        ctx.fillStyle = el.color;
        ctx.lineWidth = 1.5;

        if (el.type === 'coin') {
          ctx.beginPath();
          ctx.arc(0, 0, el.size / 2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, el.size / 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (el.type === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(0, -el.size / 2);
          ctx.lineTo(el.size / 2, 0);
          ctx.lineTo(0, el.size / 2);
          ctx.lineTo(-el.size / 2, 0);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
        } else if (el.type === 'square') {
          ctx.strokeRect(-el.size / 2, -el.size / 2, el.size, el.size);
          ctx.fillRect(-el.size / 3, -el.size / 3, (el.size * 2) / 3, (el.size * 2) / 3);
        } else if (el.type === 'star') {
          ctx.beginPath();
          ctx.moveTo(0, -el.size / 2);
          ctx.lineTo(el.size / 6, -el.size / 6);
          ctx.lineTo(el.size / 2, 0);
          ctx.lineTo(el.size / 6, el.size / 6);
          ctx.lineTo(0, el.size / 2);
          ctx.lineTo(-el.size / 6, el.size / 6);
          ctx.lineTo(-el.size / 2, 0);
          ctx.lineTo(-el.size / 6, -el.size / 6);
          ctx.closePath();
          ctx.fill();
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
      {/* Subtle fantasy stardust matrix */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#10B981 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
    </div>
  );
}
