// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // --- Your Neutral Palette ---
        'light-bg-canvas': '#F9FAFB',
        'light-bg-card': '#FFFFFF',
        'dark-bg-canvas-start': '#000000',
        'dark-bg-canvas-via': '#1A2A3D',
        'dark-bg-canvas-end': '#122030',
        'dark-bg-card': '#1F2937',
        'text-primary-light': '#1F2937',
        'text-secondary-light': '#6B7280',
        'text-primary-dark': '#F9FAFB',
        'text-secondary-dark': '#D1D5DB',
        'border-subtle-light': '#E5E7EB',
        'border-subtle-dark': '#374151',

        // --- Your Core UI Blues ---
        'ui-blue-light': '#2563EB',
        'ui-blue-dark': '#60A5FA',
        'brand-accent-light': '#DBEAFE',
        'brand-accent-dark': '#1E3A8A',

        // --- Your Company Brand Orange ---
        'brand-orange-light': '#FB400E',
        'brand-orange-dark': '#FF693C',

        // --- Your Semantic Colors ---
        'status-approved-light': '#22C55E',
        'status-approved-dark': '#4ADE80',
        'status-pending-light': '#F97316',
        'status-pending-dark': '#FB923C',
        'status-attention-light': '#6366F1',
        'status-attention-dark': '#818CF8',
        'status-raised-light': '#A855F7',
        'status-raised-dark': '#C084FC',
        'status-logout-light': '#EF4444',
        'status-logout-dark': '#F87171',
      },
    },
  },
  // FIX: Added the line-clamp plugin back for proper text truncation
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}