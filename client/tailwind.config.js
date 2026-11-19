/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F7F4',
          100: '#E1EFE9',
          200: '#C2DFD4',
          300: '#94C7B5',
          400: '#5EA88F',
          500: '#388B71',
          600: '#267059',
          700: '#1F5A48',
          800: '#1B473A',
          900: '#173B30',
          950: '#0B211B',
        },
        dark: {
          bg: '#0A110E',
          surface: '#121E19',
          elevated: '#172721',
          border: '#1E362C',
          borderLight: '#264538',
          muted: '#8CA399',
        },
        ivory: {
          50: '#FDFDFC',
          100: '#FAF9F5',
          200: '#F5F3EC',
          300: '#EBE7DC',
          400: '#DFD8C7',
          500: '#D1C6AF',
        },
        gold: {
          50: '#FCF9EE',
          100: '#F7F0D4',
          500: '#C59A3F',
          600: '#AF822E',
        },
        table: {
          available: '#10B981',
          held: '#F59E0B',
          occupied: '#EF4444',
          reserved: '#6366F1',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
        'card': '0 2px 12px -2px rgba(23, 59, 48, 0.08)',
        'elevated': '0 10px 30px -5px rgba(23, 59, 48, 0.12)',
        'dark-soft': '0 4px 24px -2px rgba(0, 0, 0, 0.5)',
        'dark-card': '0 2px 14px -2px rgba(0, 0, 0, 0.4)',
        'dark-glow': '0 0 20px rgba(16, 185, 129, 0.2)',
      }
    },
  },
  plugins: [],
}
