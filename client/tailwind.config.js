/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          50: '#FFF3EE',
          100: '#FFE5DA',
          200: '#FFC8B3',
          300: '#FFAA8C',
          400: '#FF8A61',
          500: '#FF6B35',
          600: '#E6531D',
          700: '#BF3D0D',
          800: '#942D08',
          900: '#6E2004',
        },
        charcoal: {
          DEFAULT: '#202124',
          50: '#F8F9FA',
          100: '#F1F3F4',
          200: '#E8EAED',
          300: '#DADCE0',
          400: '#BDC1C6',
          500: '#80868B',
          600: '#5F6368',
          700: '#3C4043',
          800: '#202124',
          900: '#171717',
          950: '#0F1012',
        },
        accent: {
          green: '#28A745',
          yellow: '#FFD166',
          blue: '#1E88E5',
          purple: '#845EC2',
          red: '#DC3545'
        },
        cravebg: {
          light: '#FFF9F3',
          dark: '#121214'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(255, 107, 53, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'premium': '0 12px 32px -4px rgba(255, 107, 53, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 25px rgba(255, 107, 53, 0.35)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
