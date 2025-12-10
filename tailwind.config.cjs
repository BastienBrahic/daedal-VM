/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'os-bg': 'var(--os-color-bg)',
        'os-bg-alt': 'var(--os-color-bg-alt)',
        'os-surface': 'var(--os-color-surface)',
        'os-surface-elevated': 'var(--os-color-surface-elevated)',
        'os-border': 'var(--os-color-border)',
        'os-accent': 'var(--os-color-accent)',
        'os-accent-hover': 'var(--os-color-accent-hover)',
        'os-accent-active': 'var(--os-color-accent-active)',
        'os-text': 'var(--os-color-text)',
        'os-text-muted': 'var(--os-color-text-muted)',
        'os-text-inverted': 'var(--os-color-text-inverted)',
        'os-warning': 'var(--os-color-warning)',
        'os-success': 'var(--os-color-success)',
        'os-error': 'var(--os-color-error)',
        'os-selected': 'var(--os-color-selected)',
        'os-hover': 'var(--os-color-hover)',
        'os-pressed': 'var(--os-color-pressed)',
      },
      fontFamily: {
        ubuntu: ['"Ubuntu"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'window': '0.75rem',
        'pill': '9999px',
      },
      boxShadow: {
        'window': '0 12px 30px rgba(0,0,0,0.35)',
        'dock': '0 6px 18px rgba(0,0,0,0.4)',
      },
      zIndex: {
        dock: '40',
        topbar: '50',
        windowsBase: '10',
      },
    },
  },
  plugins: [],
}
