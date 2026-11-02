import React, { useEffect, useRef } from 'react';

// Classic 7 Tetromino matrices
const TETROMINO_SHAPES = [
  // I shape
  {
    matrix: [[1, 1, 1, 1]],
    color: '#00F0FF',
    highlight: '#8AFFFF',
    shadow: '#008B9B',
  },
  // O shape
  {
    matrix: [
      [1, 1],
      [1, 1],
    ],
    color: '#FFDE25',
    highlight: '#FFF7A5',
    shadow: '#C7A400',
  },
  // T shape
  {
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: '#C084FC',
    highlight: '#E9D5FF',
    shadow: '#7E22CE',
  },
  // S shape
  {
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: '#28C76F',
    highlight: '#86EFAC',
    shadow: '#15803D',
  },
  // Z shape
  {
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: '#FF5FA0',
    highlight: '#FFA4CB',
    shadow: '#BE185D',
  },
  // J shape
  {
    matrix: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: '#60A5FA',
    highlight: '#BAE6FD',
    shadow: '#1D4ED8',
  },
  // L shape
  {
    matrix: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: '#FF7A00',
    highlight: '#FED7AA',
    shadow: '#C2410C',
  },
];

export default function TetrisArcadeBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      // Damped target coordinates relative to center
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.03;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.03;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Number of falling items based on screen width
    const itemCount = Math.min(38, Math.max(18, Math.floor(width / 45)));

    // Initialize falling entities (Tetrominoes, golden coins, pixel stars)
    const entities = [];

    function createEntity(initialYRandom = true) {
      const type = Math.random() < 0.78 ? 'tetromino' : Math.random() < 0.6 ? 'coin' : 'star';
      const depth = Math.random(); // 0 (far/small) to 1 (near/large)

      let blockSize;
      let speed;
      let opacity;

      if (depth < 0.4) {
        // Far layer
        blockSize = 8 + Math.random() * 3;
        speed = 0.4 + Math.random() * 0.5;
        opacity = 0.18 + Math.random() * 0.15;
      } else if (depth < 0.8) {
        // Mid layer
        blockSize = 12 + Math.random() * 4;
        speed = 0.8 + Math.random() * 0.8;
        opacity = 0.35 + Math.random() * 0.25;
      } else {
        // Foreground accent layer
        blockSize = 16 + Math.random() * 5;
        speed = 1.3 + Math.random() * 1.1;
        opacity = 0.5 + Math.random() * 0.25;
      }

      const tetrominoDef = TETROMINO_SHAPES[Math.floor(Math.random() * TETROMINO_SHAPES.length)];

      return {
        type,
        x: Math.random() * width,
        y: initialYRandom ? Math.random() * height : -60 - Math.random() * 100,
        speed,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        blockSize,
        opacity,
        depth,
        shape: tetrominoDef,
        coinFrame: Math.floor(Math.random() * 30),
      };
    }

    for (let i = 0; i < itemCount; i++) {
      entities.push(createEntity(true));
    }

    // Draw individual beveled 16-bit arcade pixel block
    function drawPixelBlock(x, y, size, color, highlight, shadow, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;

      // Base block fill
      ctx.fillStyle = color;
      ctx.fillRect(x, y, size, size);

      // Light top & left highlight bevels
      ctx.fillStyle = highlight;
      ctx.fillRect(x, y, size, size * 0.2);
      ctx.fillRect(x, y, size * 0.2, size);

      // Dark bottom & right shadow bevels
      ctx.fillStyle = shadow;
      ctx.fillRect(x, y + size * 0.8, size, size * 0.2);
      ctx.fillRect(x + size * 0.8, y, size * 0.2, size);

      // Crisp outer black pixel stroke
      ctx.strokeStyle = '#0D0518';
      ctx.lineWidth = Math.max(1, size * 0.08);
      ctx.strokeRect(x, y, size, size);

      ctx.restore();
    }

    // Draw rotating arcade golden coin
    function drawCoin(x, y, size, alpha, frame) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);

      const coinScaleX = Math.abs(Math.cos(frame * 0.08)); // Spinning coin illusion
      ctx.scale(Math.max(0.15, coinScaleX), 1);

      // Outer gold rim
      ctx.fillStyle = '#FFDE25';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0D0518';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner rim
      ctx.fillStyle = '#FFAE00';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Dollar / Star symbol inside
      ctx.fillStyle = '#FFF7A5';
      ctx.font = `bold ${Math.floor(size * 0.6)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 0);

      ctx.restore();
    }

    // Draw retro star twinkle
    function drawStar(x, y, size, alpha, rotation) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rotation);

      ctx.fillStyle = '#FFDE25';
      ctx.fillRect(-size / 2, -size / 6, size, size / 3);
      ctx.fillRect(-size / 6, -size / 2, size / 3, size);

      ctx.restore();
    }

    let frameCount = 0;

    // Main render loop
    function render() {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse parallax interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Soft ambient radial glow pulsing slowly behind the center title
      const glowPulse = Math.sin(frameCount * 0.02) * 0.05 + 0.22;
      const gradient = ctx.createRadialGradient(
        width / 2 + mouseRef.current.x * 2,
        height * 0.38 + mouseRef.current.y * 2,
        20,
        width / 2,
        height * 0.38,
        width * 0.45
      );
      gradient.addColorStop(0, `rgba(168, 85, 247, ${glowPulse})`);
      gradient.addColorStop(0.5, `rgba(112, 26, 117, ${glowPulse * 0.5})`);
      gradient.addColorStop(1, 'rgba(32, 11, 59, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render all falling entities
      entities.forEach((entity) => {
        // Parallax offset based on entity depth
        const parallaxOffsetX = mouseRef.current.x * entity.depth * 25;
        const parallaxOffsetY = mouseRef.current.y * entity.depth * 25;

        const currentX = entity.x + parallaxOffsetX;
        const currentY = entity.y + parallaxOffsetY;

        if (entity.type === 'tetromino') {
          ctx.save();
          ctx.translate(currentX, currentY);
          ctx.rotate(entity.rotation);

          const { matrix, color, highlight, shadow } = entity.shape;
          const rows = matrix.length;
          const cols = matrix[0].length;
          const totalW = cols * entity.blockSize;
          const totalH = rows * entity.blockSize;

          // Render centered tetromino matrix
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              if (matrix[r][c] === 1) {
                const blockX = c * entity.blockSize - totalW / 2;
                const blockY = r * entity.blockSize - totalH / 2;
                drawPixelBlock(
                  blockX,
                  blockY,
                  entity.blockSize,
                  color,
                  highlight,
                  shadow,
                  entity.opacity
                );
              }
            }
          }
          ctx.restore();
        } else if (entity.type === 'coin') {
          drawCoin(currentX, currentY, entity.blockSize, entity.opacity, entity.coinFrame);
          entity.coinFrame++;
        } else if (entity.type === 'star') {
          drawStar(currentX, currentY, entity.blockSize, entity.opacity, entity.rotation);
        }

        // Only animate position if not prefers-reduced-motion
        if (!prefersReducedMotion) {
          entity.y += entity.speed;
          entity.rotation += entity.rotationSpeed;

          // Wrap around bottom
          if (entity.y > height + 80) {
            entity.y = -60 - Math.random() * 40;
            entity.x = Math.random() * width;
          }
        }
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    }

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}
