/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          950: '#070714',
          900: '#0b0c1b',
          850: '#111227',
          800: '#161938',
          700: '#232759',
          600: '#383b78',
          dark: '#0b0c1b',
          purple: '#6d28d9',
          neon: '#a855f7',
          cyan: '#06b6d4',
          pink: '#ec4899',
          gold: '#facc15',
        },
        arcade: {
          pink: '#ff2a85',
          cyan: '#00f0ff',
          gold: '#ffd000',
          violet: '#9d4edd',
          green: '#00ff88',
          dark: '#0e0e1e',
          surface: '#181930',
        },
      },
      fontFamily: {
        retro: ['"Press Start 2P"', 'monospace'],
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'neon-pink': '0 0 15px rgba(255, 42, 133, 0.5), 0 0 30px rgba(255, 42, 133, 0.2)',
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.5), 0 0 30px rgba(0, 240, 255, 0.2)',
        'neon-gold': '0 0 15px rgba(255, 208, 0, 0.5), 0 0 30px rgba(255, 208, 0, 0.2)',
        'neon-purple': '0 0 15px rgba(168, 85, 247, 0.5), 0 0 30px rgba(168, 85, 247, 0.2)',
        'arcade-button': '0 4px 0 #000, 0 6px 12px rgba(0,0,0,0.4)',
        'arcade-button-pressed': '0 1px 0 #000, 0 2px 4px rgba(0,0,0,0.4)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 7s ease-in-out infinite',
        'grid-scroll': 'gridScroll 20s linear infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.9', filter: 'drop-shadow(0 0 12px rgba(0, 240, 255, 0.6))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 24px rgba(255, 42, 133, 0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gridScroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(40px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
