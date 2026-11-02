import React, { useEffect, useRef } from 'react';

/**
 * ParticipantArcadeBackground
 * Immersive environmental backdrop for the Participant Portal.
 * Features subtle falling 3D-spinning golden coins, floating arcade gems,
 * game stars, and soft atmospheric lighting in rich tournament violet.
 * Lightweight, 60fps, pointer-events-none, respects prefers-reduced-motion.
 */
export default function ParticipantArcadeBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

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

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.02;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.02;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Number of falling items based on screen width
    const itemCount = Math.min(28, Math.max(14, Math.floor(width / 55)));

    // Generate falling virtual arcade coins and game-related elements
    const elements = Array.from({ length: itemCount }, () => {
      const depth = Math.random();
      // 55% virtual coins, 25% stars, 20% gem crystals
      const type = Math.random() < 0.55 ? 'coin' : Math.random() < 0.75 ? 'star' : 'gem';

      let size;
      let speedY;
      let opacity;

      if (depth < 0.4) {
        size = 12 + Math.random() * 4;
        speedY = 0.5 + Math.random() * 0.4;
        opacity = 0.16 + Math.random() * 0.12;
      } else if (depth < 0.8) {
        size = 18 + Math.random() * 6;
        speedY = 0.9 + Math.random() * 0.6;
        opacity = 0.28 + Math.random() * 0.18;
      } else {
        size = 24 + Math.random() * 8;
        speedY = 1.4 + Math.random() * 0.8;
        opacity = 0.42 + Math.random() * 0.22;
      }

      return {
        type,
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        speedY,
        speedX: (Math.random() - 0.5) * 0.25,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        coinFrame: Math.floor(Math.random() * 60),
        coinSpinSpeed: 0.04 + Math.random() * 0.04,
        opacity,
        depth,
        color: ['#FFDE25', '#FF5FA0', '#00F0FF', '#28C76F'][Math.floor(Math.random() * 4)],
      };
    });

    // Draw 3D rotating arcade golden coin
    function drawSpinningCoin(x, y, size, alpha, frame) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);

      const scaleX = Math.cos(frame); // 3D flip illusion
      const absScaleX = Math.max(0.12, Math.abs(scaleX));
      ctx.scale(scaleX >= 0 ? absScaleX : -absScaleX, 1);

      const r = size * 0.55;

      // Outer gold rim
      ctx.fillStyle = '#FFDE25';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#0D0518';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner coin face
      ctx.fillStyle = '#FFAE00';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.68, 0, Math.PI * 2);
      ctx.fill();

      // Dollar / Coin symbol
      ctx.fillStyle = '#FFF7A5';
      ctx.font = `bold ${Math.floor(r * 0.85)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 1);

      ctx.restore();
    }

    // Draw retro arcade sparkle star
    function drawArcadeStar(x, y, size, color, alpha, rot) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rot);

      ctx.fillStyle = color;
      const arm = size * 0.22;
      ctx.fillRect(-size / 2, -arm / 2, size, arm);
      ctx.fillRect(-arm / 2, -size / 2, arm, size);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-arm / 2, -arm / 2, arm, arm);

      ctx.restore();
    }

    // Draw faceted game gem
    function drawGameGem(x, y, size, color, alpha, rot) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rot);

      const r = size * 0.5;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r, 0);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#0D0518';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.7);
      ctx.lineTo(r * 0.35, 0);
      ctx.lineTo(0, -r * 0.2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Soft ambient vignette behind dashboard
      const ambientGlow = Math.sin(frameCount * 0.015) * 0.03 + 0.16;
      const grad = ctx.createRadialGradient(
        width / 2 + mouseRef.current.x * 2,
        height * 0.4 + mouseRef.current.y * 2,
        60,
        width / 2,
        height * 0.5,
        width * 0.8
      );
      grad.addColorStop(0, `rgba(107, 33, 168, ${ambientGlow})`);
      grad.addColorStop(0.65, `rgba(49, 14, 86, ${ambientGlow * 0.55})`);
      grad.addColorStop(1, 'rgba(15, 4, 32, 0.7)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render falling elements
      elements.forEach((el) => {
        const ex = el.x + mouseRef.current.x * el.depth * 20;
        const ey = el.y + mouseRef.current.y * el.depth * 20;

        if (el.type === 'coin') {
          drawSpinningCoin(ex, ey, el.size, el.opacity, el.coinFrame);
          if (!prefersReducedMotion) el.coinFrame += el.coinSpinSpeed;
        } else if (el.type === 'star') {
          drawArcadeStar(ex, ey, el.size, el.color, el.opacity, el.rot);
        } else {
          drawGameGem(ex, ey, el.size, el.color, el.opacity, el.rot);
        }

        if (!prefersReducedMotion) {
          el.y += el.speedY;
          el.x += el.speedX;
          el.rot += el.rotSpeed;

          // Wrap around bottom
          if (el.y > height + 50) {
            el.y = -40;
            el.x = Math.random() * width;
          }
          if (el.x < -40) el.x = width + 40;
          if (el.x > width + 40) el.x = -40;
        }
      });

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle retro dot matrix overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#FFDE25 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
