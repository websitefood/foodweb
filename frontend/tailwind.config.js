/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class', // Enable dark mode via class
  theme: {
    extend: {
      colors: {
        primary: '#F47C16',      // Custom orange color for accents
        secondary: '#F59E0B',
        // The custom colors allow usage like 'text-primary', 'bg-secondary', etc.
      }
    }
  },
  plugins: [],
};
