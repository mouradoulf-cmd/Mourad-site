/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1c3a52',
        slate: '#7c8ba3',
        teal: '#4fae8c',
        gold: '#f5b90f',
        crimson: '#e41959',
        sky: '#4c96d1',
        plum: '#7d2a72',
        cream: '#faf9f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
