/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arcade: {
          bg: '#0c0b10',          // Deep charcoal / near-black
          surface: '#15141c',     // Clean panel background
          elevated: '#1e1c27',    // Card / slot surface
          border: '#2c293a',      // Crisp structural border
          pink: '#ff007f',        // Bold hot magenta
          purple: '#7928ca',      // Bold arcade purple
          yellow: '#ffe600',      // High-contrast arcade yellow
          orange: '#ff6b00',      // Arcade blazing orange
          cyan: '#00f0ff',        // Vibrant arcade cyan
          green: '#10b981',       // High-score green
          white: '#f4f4f6',       // Primary text
          muted: '#8b8899',       // Secondary text
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
        'arcade-sm': '2px 2px 0px #000',
        'arcade': '4px 4px 0px #000',
        'arcade-lg': '6px 6px 0px #000',
        'arcade-yellow': '4px 4px 0px #ffe600',
        'arcade-pink': '4px 4px 0px #ff007f',
        'arcade-cyan': '4px 4px 0px #00f0ff',
      },
      keyframes: {
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'marquee': 'marquee 22s linear infinite',
      },
    },
  },
  plugins: [],
}
