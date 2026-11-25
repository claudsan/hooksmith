/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        shell: '#0B0D10',
        panel: '#11141A',
        elevated: '#181C24',
        hover: '#1F2430',
        line: { DEFAULT: '#232834', focus: '#3B4254' },
        fg: { DEFAULT: '#F1F5F9', muted: '#94A3B8', subtle: '#64748B' },
        brand: { DEFAULT: '#F97316', hover: '#EA580C', soft: 'rgba(249, 115, 22, 0.12)' },
        ok: '#10B981',
        warn: '#F59E0B',
        danger: '#EF4444',
        info: '#38BDF8',
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        brand: '0 1px 0 rgba(255,255,255,0.18) inset, 0 6px 18px -6px rgba(249,115,22,0.55)',
        panel: '0 24px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.02)',
      },
    },
  },
  plugins: [],
};
