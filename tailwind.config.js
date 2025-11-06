/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#8b5cf6",
        "primary-light": "#a78bfa", 
        "primary-soft": "#c4b5fd",
        "background-light": "#fafafa",
        "background-dark": "#0f172a",
        "card-light": "#ffffff",
        "card-dark": "#1e293b",
        "text-soft": "#64748b",
        "border-soft": "#e2e8f0",
        "gradient-start": "#f8fafc",
        "gradient-middle": "#f1f5f9",
        "gradient-end": "#e2e8f0",
        "accent-soft": "#94a3b8",
        "accent-light": "#cbd5e1",
        "glass-white": "rgba(255, 255, 255, 0.05)",
        "glass-dark": "rgba(255, 255, 255, 0.02)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'soft-aurora': 'linear-gradient(135deg, #fafafa 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #f9fafb 100%)',
        'soft-aurora-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        'soft-mesh': 'radial-gradient(at 40% 20%, hsla(220,30%,95%,0.8) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(210,40%,90%,0.6) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(200,25%,92%,0.7) 0px, transparent 50%)',
      },
      fontFamily: {
        "display": ["Poppins", "system-ui", "-apple-system", "sans-serif"],
        "sans": ["Poppins", "system-ui", "-apple-system", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}