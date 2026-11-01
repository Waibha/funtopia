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
          950: '#05060f',
          900: '#08091a',
          850: '#0c0e24',
          800: '#111432',
          750: '#171a42',
          700: '#1e2254',
          600: '#2c3275',
          card: '#0e1028',
          border: 'rgba(139, 92, 246, 0.22)',
        },
        arcade: {
          pink: '#ff007f',
          purple: '#8b5cf6',
          violet: '#a855f7',
          cyan: '#00f0ff',
          yellow: '#ffe600',
          gold: '#f59e0b',
          orange: '#ff5e3a',
          green: '#10b981',
          cream: '#fff9e6',
        },
      },
      fontFamily: {
        arcade: ['"Press Start 2P"', 'monospace'],
        pixel: ['Silkscreen', 'monospace'],
        bungee: ['Bungee', 'cursive'],
        display: ['Oxanium', 'sans-serif'],
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-pink': '0 0 15px rgba(255, 0, 127, 0.5), 0 0 35px rgba(255, 0, 127, 0.25)',
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.5), 0 0 35px rgba(0, 240, 255, 0.25)',
        'neon-yellow': '0 0 15px rgba(255, 230, 0, 0.5), 0 0 35px rgba(255, 230, 0, 0.25)',
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.4), 0 0 45px rgba(139, 92, 246, 0.2)',
        'arcade-button': '0 6px 0 #5b21b6, 0 10px 20px rgba(0, 0, 0, 0.5)',
        'arcade-button-pink': '0 6px 0 #9d174d, 0 10px 20px rgba(0, 0, 0, 0.5)',
        'arcade-button-cyan': '0 6px 0 #0e7490, 0 10px 20px rgba(0, 0, 0, 0.5)',
        'arcade-button-yellow': '0 6px 0 #b45309, 0 10px 20px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'retro-grid': 'linear-gradient(to right, rgba(139, 92, 246, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.08) 1px, transparent 1px)',
        'arcade-dots': 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 1px, transparent 1px)',
      },
      keyframes: {
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.7))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 2px rgba(0, 240, 255, 0.3))' },
        },
        'score-pop': {
          '0%': { transform: 'scale(0.85)', opacity: '0.5' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'score-pop': 'score-pop 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
