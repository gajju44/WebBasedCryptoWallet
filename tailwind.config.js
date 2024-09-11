/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
    theme: {
      extend: {
        keyframes: {
          'slide-left': {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(-100%)' },
          },
          'slide-right': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' },
          },
        },
        animation: {
          'slide-left': 'slide-left 10s linear infinite',
          'slide-right': 'slide-right 10s linear infinite',
        },
      },
    },
  plugins: [],
}

