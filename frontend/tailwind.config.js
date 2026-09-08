/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        sans:    ['Inter', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        brand: {
          cyan:   '#00B4D8',
          blue:   '#0077B6',
          red:    '#E63946',
          orange: '#FF9F43',
          pink:   '#FF6B9D',
        }
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':    'fadeIn 0.4s ease both',
        'spin-slow':  'spin 3s linear infinite',
      }
    }
  },
  plugins: [],
}
