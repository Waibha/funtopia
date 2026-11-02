/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fantasy Realm Atmosphere Palette
        realm: {
          void: '#05040D',        // Darkest celestial abyss
          night: '#0A091A',       // Primary twilight canvas
          deep: '#100E26',        // Deep forest & citadel shadow
          amethyst: '#1C153A',    // Mystical twilight purple
          slate: '#241D45',       // Elevated surface
          gold: '#FFC837',        // Sunstone gold (titles, crests, coins)
          'gold-light': '#FFE484',// Radiance highlight
          amber: '#FF9E1B',       // Warm evening ember
          emerald: '#10B981',     // Sacred grove & verve
          'emerald-light': '#6EE7B7',
          cyan: '#00F0FF',        // Crystalline spring water & arcane runes
          'cyan-light': '#A5F3FC',
          ruby: '#F43F5E',        // Dragon ruby & challenge badge
          parchment: '#FAF5E8',   // Royal decree & high-contrast card
        },
        // Pixel moodboard palette preserved for backward compatibility
        pixel: {
          bg: '#5C2D91',
          'bg-deep': '#40186D',
          'bg-dark': '#2B0E4C',
          'bg-light': '#7B42BC',
          yellow: '#FFDE25',
          'yellow-light': '#FFF078',
          'yellow-dark': '#DDAE00',
          pink: '#FF5FA0',
          'pink-light': '#FFA3CB',
          'pink-dark': '#D82E74',
          green: '#28C76F',
          'green-light': '#6EE7B7',
          'green-dark': '#15803D',
          cyan: '#00F0FF',
          'cyan-dark': '#0284C7',
          brick: '#C86432',
          'brick-dark': '#8E3812',
          'brick-light': '#E08552',
          window: '#D1D5DB',
          'window-bar': '#000080',
          white: '#FFFFFF',
          ink: '#0D0518',
          muted: '#8B72A8',
        },
        // Pop palette preserved
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
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        'cinzel-dec': ['"Cinzel Decorative"', 'cursive'],
        fantasy: ['Cinzel', 'serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        arcade: ['"Press Start 2P"', 'monospace'],
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
        // Fantasy Dimensional Glows & Shadows
        'fantasy-gold': '0 0 30px rgba(255, 200, 55, 0.45)',
        'fantasy-cyan': '0 0 30px rgba(0, 240, 255, 0.4)',
        'fantasy-emerald': '0 0 30px rgba(16, 185, 129, 0.4)',
        'fantasy-card': '0 12px 36px -6px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'fantasy-card-hover': '0 20px 48px -8px rgba(0, 0, 0, 0.85), 0 0 24px rgba(255, 200, 55, 0.25)',
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
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-island': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(0.4deg)' },
        },
        'float-island-delayed': {
          '0%, 100%': { transform: 'translateY(-12px) rotate(-0.3deg)' },
          '50%': { transform: 'translateY(6px) rotate(0.3deg)' },
        },
        'shimmer-aurora': {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.04)' },
        },
        'waterfall-stream': {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-80' },
        },
        'fly-across': {
          '0%': { transform: 'translateX(-120px) translateY(20px) scale(0.7)', opacity: '0' },
          '15%': { opacity: '0.85' },
          '85%': { opacity: '0.85' },
          '100%': { transform: 'translateX(1300px) translateY(-50px) scale(1)', opacity: '0' },
        },
        'firefly-glow': {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.3)' },
        },
      },
      animation: {
        'marquee': 'marquee 22s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'float-island': 'float-island 8s ease-in-out infinite',
        'float-island-delayed': 'float-island-delayed 9s ease-in-out infinite',
        'shimmer-aurora': 'shimmer-aurora 7s ease-in-out infinite',
        'waterfall-stream': 'waterfall-stream 1.8s linear infinite',
        'fly-across': 'fly-across 26s linear infinite',
        'firefly-glow': 'firefly-glow 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
