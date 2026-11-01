import React, { useEffect, useRef } from 'react';

/**
 * AuthArcadeBackground
 * Restrained floating geometric elements with subtle movement.
 * Creates an immersive arcade entrance atmosphere for authentication screens.
 */
export default function AuthArcadeBackground() {
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

    const nodes = [
      { x: width * 0.12, y: height * 0.25, r: 16, vy: 0.1, vx: 0.05, rot: 0, rotV: 0.003, color: 'rgba(255, 222, 37, 0.14)', type: 'coin' },
      { x: width * 0.88, y: height * 0.2, r: 24, vy: -0.08, vx: -0.04, rot: 0.5, rotV: -0.002, color: 'rgba(255, 95, 160, 0.12)', type: 'diamond' },
      { x: width * 0.18, y: height * 0.78, r: 20, vy: 0.09, vx: -0.03, rot: 1.1, rotV: 0.004, color: 'rgba(0, 240, 255, 0.12)', type: 'square' },
      { x: width * 0.82, y: height * 0.75, r: 18, vy: -0.12, vx: 0.05, rot: 2.0, rotV: -0.003, color: 'rgba(192, 132, 252, 0.14)', type: 'coin' },
      { x: width * 0.5, y: height * 0.88, r: 14, vy: 0.07, vx: 0.02, rot: 0.8, rotV: 0.002, color: 'rgba(255, 222, 37, 0.10)', type: 'diamond' },
    ];

    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Deep purple arcade background
      const grad = ctx.createRadialGradient(width / 2, height / 2, width * 0.1, width / 2, height / 2, width * 0.75);
      grad.addColorStop(0, 'rgba(48, 14, 84, 0.25)');
      grad.addColorStop(1, 'rgba(13, 5, 24, 0.55)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      nodes.forEach((n) => {
        if (!prefersReducedMotion) {
          n.y += n.vy * 30 * dt;
          n.x += n.vx * 30 * dt;
          n.rot += n.rotV;

          if (n.y < -30) n.y = height + 30;
          if (n.y > height + 30) n.y = -30;
          if (n.x < -30) n.x = width + 30;
          if (n.x > width + 30) n.x = -30;
        }

        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(n.rot);
        ctx.strokeStyle = n.color;
        ctx.fillStyle = n.color;
        ctx.lineWidth = 1.5;

        if (n.type === 'coin') {
          ctx.beginPath();
          ctx.arc(0, 0, n.r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, n.r * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (n.type === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(0, -n.r);
          ctx.lineTo(n.r, 0);
          ctx.lineTo(0, n.r);
          ctx.lineTo(-n.r, 0);
          ctx.closePath();
          ctx.stroke();
        } else if (n.type === 'square') {
          ctx.strokeRect(-n.r / 2, -n.r / 2, n.r, n.r);
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
      {/* Subtle arcade grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(to right, #C084FC 1px, transparent 1px), linear-gradient(to bottom, #C084FC 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />
    </div>
  );
}
