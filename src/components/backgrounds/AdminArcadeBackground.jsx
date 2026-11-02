import React, { useEffect, useRef } from 'react';

/**
 * AdminArcadeBackground
 * Calm, high-tech retro arcade telemetry backdrop for the Admin & Operator Portal.
 * Features subtle upward floating data packets, glowing telemetry circuit nodes,
 * faint geometric data markers, and soft atmospheric lighting.
 * Lightweight, 60fps, pointer-events-none, respects prefers-reduced-motion.
 */
export default function AdminArcadeBackground() {
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
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.015;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.015;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic data nodes count
    const nodeCount = Math.min(24, Math.max(12, Math.floor(width / 60)));

    // Generate telemetry data nodes drifting upward gently
    const nodes = Array.from({ length: nodeCount }, () => {
      const depth = Math.random();
      const type = Math.random() < 0.4 ? 'packet' : Math.random() < 0.75 ? 'node' : 'cross';

      let size;
      let speedY;
      let opacity;

      if (depth < 0.4) {
        size = 8 + Math.random() * 4;
        speedY = 0.3 + Math.random() * 0.3;
        opacity = 0.12 + Math.random() * 0.1;
      } else if (depth < 0.8) {
        size = 14 + Math.random() * 6;
        speedY = 0.6 + Math.random() * 0.4;
        opacity = 0.2 + Math.random() * 0.15;
      } else {
        size = 20 + Math.random() * 8;
        speedY = 0.9 + Math.random() * 0.5;
        opacity = 0.32 + Math.random() * 0.18;
      }

      const colors = ['#FFDE25', '#00F0FF', '#C084FC', '#28C76F'];

      return {
        type,
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        speedY,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        opacity,
        depth,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
      };
    });

    // Draw telemetry packet
    function drawPacket(x, y, size, color, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);

      ctx.fillStyle = color;
      ctx.fillRect(-size / 2, -size / 2, size, size);

      ctx.strokeStyle = '#0D0518';
      ctx.lineWidth = 1;
      ctx.strokeRect(-size / 2, -size / 2, size, size);

      // Inner glowing core
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-size / 4, -size / 4, size / 2, size / 2);

      ctx.restore();
    }

    // Draw wireframe node
    function drawWireframeNode(x, y, size, color, alpha, rot) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rot);

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-size / 2, -size / 2, size, size);

      // Corner markers
      const dot = 2.5;
      ctx.fillStyle = '#FFDE25';
      ctx.fillRect(-size / 2 - dot / 2, -size / 2 - dot / 2, dot, dot);
      ctx.fillRect(size / 2 - dot / 2, -size / 2 - dot / 2, dot, dot);
      ctx.fillRect(-size / 2 - dot / 2, size / 2 - dot / 2, dot, dot);
      ctx.fillRect(size / 2 - dot / 2, size / 2 - dot / 2, dot, dot);

      ctx.restore();
    }

    // Draw coordinate cross
    function drawCross(x, y, size, color, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-size / 2, 0);
      ctx.lineTo(size / 2, 0);
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(0, size / 2);
      ctx.stroke();

      ctx.restore();
    }

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Subtle ambient vignette
      const ambientGlow = Math.sin(frameCount * 0.012) * 0.02 + 0.14;
      const grad = ctx.createRadialGradient(
        width / 2 + mouseRef.current.x * 2,
        height * 0.45 + mouseRef.current.y * 2,
        80,
        width / 2,
        height * 0.5,
        width * 0.85
      );
      grad.addColorStop(0, `rgba(88, 28, 135, ${ambientGlow})`);
      grad.addColorStop(0.7, `rgba(43, 14, 76, ${ambientGlow * 0.6})`);
      grad.addColorStop(1, 'rgba(13, 5, 24, 0.65)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render nodes
      nodes.forEach((n) => {
        const nx = n.x + mouseRef.current.x * n.depth * 15;
        const ny = n.y + mouseRef.current.y * n.depth * 15;

        const pulseAlpha = n.opacity * (0.8 + Math.sin(n.pulse) * 0.2);

        if (n.type === 'packet') {
          drawPacket(nx, ny, n.size, n.color, pulseAlpha);
        } else if (n.type === 'node') {
          drawWireframeNode(nx, ny, n.size, n.color, pulseAlpha, n.rot);
        } else {
          drawCross(nx, ny, n.size, n.color, pulseAlpha);
        }

        if (!prefersReducedMotion) {
          n.pulse += n.pulseSpeed;
          n.y -= n.speedY; // subtle upward data flow
          n.rot += n.rotSpeed;

          // Wrap around top
          if (n.y < -40) {
            n.y = height + 30;
            n.x = Math.random() * width;
          }
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
      {/* Subtle telemetry wireframe grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #00F0FF 1px, transparent 1px), linear-gradient(to bottom, #00F0FF 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}
