import React, { useEffect, useRef } from 'react';

/**
 * AuthArcadeBackground
 * Gateway environmental canvas for Portal Selection & Auth screens.
 * Features gently drifting 16-bit arcade stars, floating neon geometric particles,
 * and subtle cosmic parallax in deep arcade violet.
 * Lightweight, 60fps, pointer-events-none, respects prefers-reduced-motion.
 */
export default function AuthArcadeBackground() {
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
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.025;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.025;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic particle count based on screen size
    const particleCount = Math.min(32, Math.max(16, Math.floor(width / 50)));

    // Generate floating arcade celestial entities
    const particles = Array.from({ length: particleCount }, () => {
      const depth = Math.random(); // 0 (far) to 1 (near)
      const type = Math.random() < 0.45 ? 'star' : Math.random() < 0.75 ? 'diamond' : 'pixel';
      
      let size;
      let speedY;
      let opacity;

      if (depth < 0.4) {
        size = 6 + Math.random() * 4;
        speedY = 0.2 + Math.random() * 0.3;
        opacity = 0.15 + Math.random() * 0.15;
      } else if (depth < 0.8) {
        size = 10 + Math.random() * 6;
        speedY = 0.4 + Math.random() * 0.5;
        opacity = 0.25 + Math.random() * 0.2;
      } else {
        size = 16 + Math.random() * 8;
        speedY = 0.7 + Math.random() * 0.7;
        opacity = 0.4 + Math.random() * 0.25;
      }

      const colors = [
        '#FFDE25', // sunshine yellow
        '#FF5FA0', // bubblegum pink
        '#00F0FF', // electric cyan
        '#C084FC', // mystic purple
        '#28C76F', // arcade green
      ];

      return {
        type,
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        speedY,
        speedX: (Math.random() - 0.5) * 0.3,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        opacity,
        depth,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
      };
    });

    // Draw 4-point pixel arcade star
    function drawArcadeStar(x, y, size, color, alpha, rotation) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;

      // Cross bars creating retro 4-point star
      const armW = Math.max(2, size * 0.22);
      ctx.fillRect(-size / 2, -armW / 2, size, armW);
      ctx.fillRect(-armW / 2, -size / 2, armW, size);

      // Center bright pixel
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-armW / 2, -armW / 2, armW, armW);

      ctx.restore();
    }

    // Draw floating diamond gem
    function drawDiamond(x, y, size, color, alpha, rotation) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rotation);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(size / 2, 0);
      ctx.lineTo(0, size / 2);
      ctx.lineTo(-size / 2, 0);
      ctx.closePath();
      ctx.fill();

      // Inner highlight
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }

    // Draw retro pixel particle
    function drawPixel(x, y, size, color, alpha, rotation) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rotation);

      ctx.fillStyle = color;
      ctx.fillRect(-size / 2, -size / 2, size, size);

      ctx.strokeStyle = '#0D0518';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-size / 2, -size / 2, size, size);

      ctx.restore();
    }

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Ambient radial atmospheric glow pulsing in the background
      const ambientGlow = Math.sin(frameCount * 0.015) * 0.04 + 0.18;
      const grad = ctx.createRadialGradient(
        width / 2 + mouseRef.current.x * 2,
        height * 0.45 + mouseRef.current.y * 2,
        40,
        width / 2,
        height * 0.5,
        width * 0.75
      );
      grad.addColorStop(0, `rgba(123, 66, 188, ${ambientGlow})`);
      grad.addColorStop(0.6, `rgba(43, 14, 76, ${ambientGlow * 0.6})`);
      grad.addColorStop(1, 'rgba(13, 5, 24, 0.75)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render all floating entities
      particles.forEach((p) => {
        const px = p.x + mouseRef.current.x * p.depth * 20;
        const py = p.y + mouseRef.current.y * p.depth * 20;

        // Twinkling opacity
        const twinkleAlpha = p.opacity * (0.75 + Math.sin(p.twinklePhase) * 0.25);

        if (p.type === 'star') {
          drawArcadeStar(px, py, p.size, p.color, twinkleAlpha, p.rot);
        } else if (p.type === 'diamond') {
          drawDiamond(px, py, p.size, p.color, twinkleAlpha, p.rot);
        } else {
          drawPixel(px, py, p.size, p.color, twinkleAlpha, p.rot);
        }

        if (!prefersReducedMotion) {
          p.twinklePhase += p.twinkleSpeed;
          p.y += p.speedY;
          p.x += p.speedX;
          p.rot += p.rotSpeed;

          // Wrap smoothly
          if (p.y > height + 40) {
            p.y = -30;
            p.x = Math.random() * width;
          }
          if (p.x < -30) p.x = width + 30;
          if (p.x > width + 30) p.x = -30;
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
      {/* Subtle retro arcade grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #FFDE25 1px, transparent 1px), linear-gradient(to bottom, #FFDE25 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />
    </div>
  );
}
