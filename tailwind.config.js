/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Important for Vite projects
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all JS/JSX/TS/TSX files in src folder
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Set Inter as default font
      },
    },
  },
  plugins: [],
}