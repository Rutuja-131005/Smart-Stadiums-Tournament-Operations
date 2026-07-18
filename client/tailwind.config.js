/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Enterprise dark palette
        surface: {
          DEFAULT: '#0B1220',
          secondary: '#111827',
          card: '#1F2937',
          elevated: '#263245',
        },
        border: {
          DEFAULT: '#374151',
          light: '#4B5563',
        },
        accent: {
          DEFAULT: '#00E5A8',
          hover: '#00CC96',
          glow: 'rgba(0, 229, 168, 0.15)',
          muted: 'rgba(0, 229, 168, 0.08)',
        },
        secondary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          glow: 'rgba(59, 130, 246, 0.15)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          bg: 'rgba(245, 158, 11, 0.1)',
        },
        danger: {
          DEFAULT: '#EF4444',
          bg: 'rgba(239, 68, 68, 0.1)',
        },
        success: {
          DEFAULT: '#22C55E',
          bg: 'rgba(34, 197, 94, 0.1)',
        },
        text: {
          primary: '#F9FAFB',
          secondary: '#6B7280', // Better contrast (was #9CA3AF)
          muted: '#4B5563', // Better contrast (was #6B7280)
        },
        // Keep FIFA colors for specific branding
        fifa: {
          gold: '#C5A572',
          blue: '#003087',
          navy: '#001F5B',
          green: '#00A651',
          red: '#E4002B',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        xl: '12px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 229, 168, 0.15)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.15)',
        card: '0 4px 24px rgba(0, 0, 0, 0.12)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.2)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
      backdropBlur: {
        glass: '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'counter': 'counter 1s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 229, 168, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 229, 168, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
