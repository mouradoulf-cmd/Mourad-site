/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#d4af37',
        'gold-bright': '#f4d888',
        ink: '#07060a',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Jost"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
