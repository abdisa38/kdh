/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        school: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#B9DDFF',
          300: '#7CC1FF',
          400: '#369EFF',
          500: '#0C7EFF',
          600: '#0060DF',
          700: '#004CB2',
          800: '#06408F',
          900: '#0B3673',
          950: '#07224B', // Deep Academic Navy
        },
        gold: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        emerald: {
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
