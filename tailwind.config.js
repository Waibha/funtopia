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
          dark: '#0b0c1b',
          purple: '#6d28d9',
          neon: '#a855f7',
          cyan: '#06b6d4',
          pink: '#ec4899',
          gold: '#facc15',
        },
      },
      fontFamily: {
        retro: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
}
