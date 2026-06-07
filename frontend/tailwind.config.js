/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        command: {
          bg: "#070c14",        // Deep command center black/navy
          panel: "#0f172a",     // Dark slate panel
          glass: "rgba(15, 23, 42, 0.65)", // Semi-transparent panel
          border: "rgba(56, 189, 248, 0.15)", // Glow border
          text: "#f8fafc",      // High contrast text
          muted: "#94a3b8",     // Slate-400
        },
        emergency: {
          blue: "#0ea5e9",      // Vibrant neon blue
          emerald: "#10b981",   // Calming green (safe)
          red: "#ef4444",       // Warning/danger red
          yellow: "#f59e0b",    // Warning/caution yellow
        }
      },
      boxShadow: {
        'glow-blue': '0 0 15px rgba(14, 165, 233, 0.25)',
        'glow-emerald': '0 0 15px rgba(16, 185, 129, 0.25)',
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
