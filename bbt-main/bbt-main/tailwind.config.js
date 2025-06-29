/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Bhutan-inspired dark mode palette
        'bhutan': {
          'deep': '#0a0612', // Deep purple-black base
          'navy': '#1a1625', // Rich navy purple
          'dark': '#2a2438', // Dark purple-gray
          'royal': '#4a3f5c', // Royal purple
          'gold': '#d4af37', // Rich Bhutanese gold
          'saffron': '#ff8c00', // Saffron orange
          'crimson': '#dc143c', // Deep red
          'amber': '#ffbf00', // Warm amber
          'copper': '#b87333', // Copper accent
          'bronze': '#cd7f32', // Bronze highlight
        },
        // Enhanced Bitcoin colors
        'bitcoin': {
          'orange': '#f7931a',
          'gold': '#ffb347',
          'amber': '#ffc649',
        },
        // Glass effects with Bhutan tones
        'glass': {
          'white': 'rgba(212, 175, 55, 0.08)', // Gold-tinted glass
          'border': 'rgba(212, 175, 55, 0.15)', // Gold border
          'hover': 'rgba(212, 175, 55, 0.12)', // Gold hover
        },
        // Status colors with Bhutan influence
        'status': {
          'success': '#228b22', // Forest green
          'warning': '#ff8c00', // Saffron orange
          'error': '#dc143c', // Crimson red
          'info': '#4169e1', // Royal blue
        }
      },
      fontFamily: {
        // Premium font stack
        'display': ['Playfair Display', 'serif'], // Elegant display font
        'sans': ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'], // Modern sans-serif
        'body': ['Inter', 'system-ui', 'sans-serif'], // Clean body text
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'], // Technical monospace
      },
      fontSize: {
        // Enhanced typography scale
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.6', letterSpacing: '0.015em' }],
        'lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0.015em' }],
        'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0.005em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '0em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.035em' }],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out infinite 2s',
        'float-delay-2': 'float 6s ease-in-out infinite 4s',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'count-up': 'count-up 2s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'slide-in': 'slide-in 0.5s ease-out',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'drift': 'drift 8s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradient-shift 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.8)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1) rotate(180deg)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '25%': { transform: 'translateX(20px) translateY(-10px)' },
          '50%': { transform: 'translateX(-15px) translateY(-20px)' },
          '75%': { transform: 'translateX(10px) translateY(-5px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'bhutan-gradient': 'linear-gradient(135deg, #0a0612 0%, #1a1625 25%, #2a2438 50%, #1a1625 75%, #0a0612 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #ffbf00 50%, #cd7f32 100%)',
        'royal-gradient': 'linear-gradient(135deg, #4a3f5c 0%, #2a2438 50%, #1a1625 100%)',
      },
      boxShadow: {
        'bhutan': '0 25px 50px -12px rgba(212, 175, 55, 0.25)',
        'gold': '0 20px 40px -12px rgba(212, 175, 55, 0.4)',
        'royal': '0 20px 40px -12px rgba(74, 63, 92, 0.3)',
      }
    },
  },
  plugins: [],
};