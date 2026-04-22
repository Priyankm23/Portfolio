import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Mono"', 'monospace'],
        body: ['"IBM Plex Mono"', 'monospace'],
        label: ['"Bebas Neue"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        bg: '#0a0a0a',
        surface: '#111111',
        'surface-2': '#1a1a1a',
        border: '#2a2a2a',
        'border-hot': '#3d3d3d',
        ink: '#e8e2d9',
        muted: '#7a7065',
        accent: '#c8f542',
        'accent-2': '#f5a623',
        red: '#e84040',
      },
      animation: {
        glitch: 'glitch 0.3s steps(1) forwards',
        ticker: 'ticker 30s linear infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'scroll-indicator': 'scroll-indicator 2s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%': {
            clipPath: 'inset(0% 0 0% 0)',
            transform: 'translate(0, 0)',
          },
          '15%': {
            clipPath: 'inset(40% 0 55% 0)',
            transform: 'translate(-3px, 0)',
          },
          '30%': {
            clipPath: 'inset(70% 0 10% 0)',
            transform: 'translate(3px, 0)',
          },
          '45%': {
            clipPath: 'inset(15% 0 75% 0)',
            transform: 'translate(-2px, 0)',
          },
          '60%': {
            clipPath: 'inset(80% 0 5% 0)',
            transform: 'translate(2px, 0)',
          },
          '75%': {
            clipPath: 'inset(10% 0 80% 0)',
            transform: 'translate(-1px, 0)',
          },
          '90%': {
            clipPath: 'inset(30% 0 50% 0)',
            transform: 'translate(1px, 0)',
          },
          '100%': {
            clipPath: 'inset(0% 0 0% 0)',
            transform: 'translate(0, 0)',
          },
        },
        ticker: {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-100%)',
          },
        },
        fadeUp: {
          from: {
            opacity: '0',
            transform: 'translateY(60px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'scroll-indicator': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(2px)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
