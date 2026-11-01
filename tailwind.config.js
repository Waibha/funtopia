/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pop: {
          canvas: '#FAF7EE',        // Primary warm ivory / pale butter
          butter: '#F5EEDB',        // Subdued ivory tint
          surface: '#FFFFFF',       // Clean card surface
          card: '#FFFFFF',
          ink: '#180A28',           // Deep aubergine dark ink
          purple: '#7928CA',        // Electric purple
          'purple-light': '#F3E8FF',
          coral: '#FF2A6D',         // Hot coral pink
          'coral-light': '#FFE4EC',
          orange: '#FF6B00',        // Vibrant tangerine orange
          'orange-light': '#FFF0E5',
          yellow: '#F5EE00',        // Acid lemon yellow
          'yellow-light': '#FEFBC8',
          cyan: '#00E5FF',          // Sharp pop cyan
          'cyan-light': '#E0FBFF',
          green: '#05D179',         // Punchy pop green
          border: '#180A28',        // High-contrast ink border
          muted: '#6B5E78',         // Secondary ink
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
        'pop-sm': '2px 2px 0px #180A28',
        'pop': '4px 4px 0px #180A28',
        'pop-lg': '6px 6px 0px #180A28',
        'pop-xl': '8px 8px 0px #180A28',
        'pop-yellow': '4px 4px 0px #F5EE00',
        'pop-coral': '4px 4px 0px #FF2A6D',
        'pop-purple': '4px 4px 0px #7928CA',
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
