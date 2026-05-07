/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dce6ff',
          200: '#b9cdff',
          300: '#84a8ff',
          400: '#4d7aff',
          500: '#2554ff',
          600: '#1036f5',
          700: '#0d27e1',
          800: '#1022b6',
          900: '#13228f',
          950: '#0c1657',
        },

        surface: {
          0: '#ffffff',
          50: '#f8f9fc',
          100: '#f0f2f8',
          200: '#e4e8f2',
          300: '#cdd4e8',
          400: '#9aa4bf',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1e2340',
          900: '#141829',
          950: '#0c0f1d',
        },

        accent: {
          amber: '#f59e0b',
          green: '#10b981',
          red: '#ef4444',
          purple: '#8b5cf6',
        },
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
        'shimmer': 'shimmer 1.8s infinite linear',
      },

      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },

        slideUp: {
          from: {
            opacity: 0,
            transform: 'translateY(12px)',
          },

          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },

        slideDown: {
          from: {
            opacity: 0,
            transform: 'translateY(-8px)',
          },

          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },

        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },

          '100%': {
            backgroundPosition: '700px 0',
          },
        },
      },

      boxShadow: {
        card:
          '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',

        'card-hover':
          '0 4px 16px -2px rgb(0 0 0 / 0.1), 0 2px 6px -2px rgb(0 0 0 / 0.06)',

        modal:
          '0 20px 60px -10px rgb(0 0 0 / 0.25)',

        brand:
          '0 4px 14px 0 rgba(37, 84, 255, 0.35)',
      },
    },
  },

  plugins: [],
}