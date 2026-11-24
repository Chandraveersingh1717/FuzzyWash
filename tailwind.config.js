/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#0B1020', 900: '#0d1428', 800: '#111c38', 700: '#162040' },
        cyan: { 400: '#22D3EE', 500: '#06B6D4' },
        violet: { 500: '#8B5CF6', 600: '#7C3AED' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'] },
    },
  },
  plugins: [],
}
