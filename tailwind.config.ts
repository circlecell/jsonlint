import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Developer-focused palette
        editor: {
          bg: '#1a1d23',
          surface: '#22262e',
          border: '#2d3139',
          hover: '#353a45',
        },
        // Aligned to the JSONLint brand tokens (redesign). Keep in sync with
        // the CSS variables in styles/globals.css.
        accent: {
          green: '#10b981',
          red: '#ef4444',
          blue: '#0A84FF',
          amber: '#FF9F0A',
          purple: '#8b5cf6',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
