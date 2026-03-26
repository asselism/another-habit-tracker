/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#1a1a2e',
          card: '#16213e',
          hover: '#1f2b47',
        },
        accent: {
          blue: '#4cc9f0',
          purple: '#7b2ff7',
          pink: '#f72585',
          green: '#4ade80',
          orange: '#fb923c',
          yellow: '#facc15',
        },
      },
    },
  },
  plugins: [],
}

