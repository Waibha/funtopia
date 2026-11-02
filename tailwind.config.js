/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // FUNTOPIA Pixel Arcade Design Tokens (Championship Platform)
        pixel: {
          bg: '#5C2D91',          // Primary arcade violet sky / backdrop
          'bg-deep': '#40186D',   // Deep evening violet / header backdrop
          'bg-dark': '#2B0E4C',   // Night ground / darkest purple
          'bg-light': '#7B42BC',  // Highlight violet
          yellow: '#FFDE25',      // Sunshine arcade yellow ("GAME", "THANK YOU", moon, trophy)
          'yellow-light': '#FFF078',
          'yellow-dark': '#DDAE00',
          pink: '#FF5FA0',        // Bubblegum pixel pink ("START", "RULES!")
          'pink-light': '#FFA3CB',
          'pink-dark': '#D82E74',
          green: '#28C76F',       // Retro mint green ("MENU", grass, health bar)
          'green-light': '#6EE7B7',
          'green-dark': '#15803D',
          cyan: '#00F0FF',        // Electric cyan ("GAME OVER", jackets, badges)
          'cyan-dark': '#0284C7',
          brick: '#C86432',       // Terracotta brick platform walkway
          'brick-dark': '#8E3812',
          'brick-light': '#E08552',
          window: '#D1D5DB',      // Classic 90s OS dialogue grey
          'window-bar': '#000080',// Classic OS titlebar navy blue
          white: '#FFFFFF',       // Speech bubble white
          ink: '#0D0518',         // Deep pixel black border
          muted: '#8B72A8',       // Subdued violet text
        },
        // Backwards compatibility mappings for smooth migration
        pop: {
          canvas: '#5C2D91',
          butter: '#FFFDF5',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          ink: '#0D0518',
          purple: '#5C2D91',
          'purple-light': '#F3E8FF',
          coral: '#FF5FA0',
          'coral-light': '#FFE4EC',
          orange: '#FF7A00',
          'orange-light': '#FFF0E5',
          yellow: '#FFDE25',
          'yellow-light': '#FEFBC8',
          cyan: '#00F0FF',
          'cyan-light': '#E0FBFF',
          green: '#28C76F',
          border: '#0D0518',
          muted: '#6B5E78',
        },
        // Cosmic Retro Tokens (Guess Who Arena & Projector)
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
        arcade: ['"Press Start 2P"', 'monospace'],
        retro: ['"Press Start 2P"', 'monospace'],
        pixel: ['Silkscreen', 'monospace'],
        bungee: ['Bungee', 'cursive'],
        display: ['Oxanium', 'sans-serif'],
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'pixel-sm': '2px 2px 0px #0D0518',
        'pixel': '4px 4px 0px #0D0518',
        'pixel-lg': '6px 6px 0px #0D0518',
        'pixel-xl': '8px 8px 0px #0D0518',
        'pixel-yellow': '4px 4px 0px #FFDE25',
        'pixel-pink': '4px 4px 0px #FF5FA0',
        'pop-sm': '2px 2px 0px #0D0518',
        'pop': '4px 4px 0px #0D0518',
        'pop-lg': '6px 6px 0px #0D0518',
        'pop-xl': '8px 8px 0px #0D0518',
        'neon-pink': '0 0 15px rgba(255, 42, 133, 0.5), 0 0 30px rgba(255, 42, 133, 0.2)',
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.5), 0 0 30px rgba(0, 240, 255, 0.2)',
        'neon-gold': '0 0 15px rgba(255, 208, 0, 0.5), 0 0 30px rgba(255, 208, 0, 0.2)',
        'neon-purple': '0 0 15px rgba(168, 85, 247, 0.5), 0 0 30px rgba(168, 85, 247, 0.2)',
        'arcade-button': '0 4px 0 #000, 0 6px 12px rgba(0,0,0,0.4)',
        'arcade-button-pressed': '0 1px 0 #000, 0 2px 4px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
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
      },
      animation: {
        'marquee': 'marquee 22s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 7s ease-in-out infinite',
        'grid-scroll': 'gridScroll 20s linear infinite',
      },
    },
  },
  plugins: [],
}
