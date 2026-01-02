import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Dark Palette - Midnight Obsidian
        obsidian: {
          DEFAULT: "#0a0a0a",
          50: "#1a1a1a",
          100: "#141414",
          200: "#121212",
          300: "#0f0f0f",
          400: "#0a0a0a",
          500: "#050505",
        },
        surface: {
          DEFAULT: "#121212",
          elevated: "#1E1E1E",
          hover: "#252525",
        },
        cream: {
          DEFAULT: "#F5F5F0",
          muted: "#E8E8E3",
          glow: "rgba(245, 245, 240, 0.15)",
        },
        // Border colors
        border: {
          subtle: "rgba(255, 255, 255, 0.06)",
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          hover: "rgba(255, 255, 255, 0.2)",
        },
        // Text colors
        text: {
          primary: "#EDEDED",
          secondary: "#A1A1AA",
          muted: "#71717A",
        },
        // Functional colors (kept for compatibility)
        score: {
          great: "#10B981",
          good: "#F59E0B",
          okay: "#F97316",
          poor: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      letterSpacing: {
        tighter: "-0.03em",
        tight: "-0.02em",
      },
      boxShadow: {
        glass: "0 4px 24px -1px rgba(0, 0, 0, 0.2)",
        "glass-lg": "0 8px 32px -1px rgba(0, 0, 0, 0.3)",
        "glass-xl": "0 16px 48px -1px rgba(0, 0, 0, 0.4)",
        glow: "0 0 20px rgba(245, 245, 240, 0.1)",
        "glow-lg": "0 0 40px rgba(245, 245, 240, 0.15)",
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245, 245, 240, 0.1)" },
          "50%": { boxShadow: "0 0 40px rgba(245, 245, 240, 0.2)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
