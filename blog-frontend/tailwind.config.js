/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F8F7F2',
        ink: '#1E2924',
        forest: '#244A3D',
        moss: '#D8E6C5',
        lime: '#D8F36A',
        muted: '#6E776F',
        line: '#E6E5DC',
        clay: '#C96B4B',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px -28px rgba(30, 41, 36, .28)',
        card: '0 8px 28px -20px rgba(30, 41, 36, .18)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
