import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Premium Color Palette ─────────────────────────────────
      colors: {
        // Warm neutral backgrounds
        sand: {
          50: "#FDFCFA",
          100: "#FAF8F5",
          200: "#F5F0EB",
          300: "#EDE6DD",
          400: "#E0D5C8",
          500: "#C9B9A8",
          600: "#A89885",
          700: "#857766",
          800: "#5E5347",
          900: "#3A332C",
        },
        // Muted sage green — primary accent
        sage: {
          50: "#F4F7F4",
          100: "#E8EFE8",
          200: "#D1DFD1",
          300: "#B3CBB3",
          400: "#8FB38F",
          500: "#6B9A6B",
          600: "#537A53",
          700: "#436143",
          800: "#374F37",
          900: "#2C3F2C",
        },
        // Warm forest — secondary accent
        forest: {
          50: "#F2F5F3",
          100: "#E0E8E2",
          200: "#C3D3C7",
          300: "#9DB8A3",
          400: "#74997C",
          500: "#557D5E",
          600: "#42634A",
          700: "#36503D",
          800: "#2D4133",
          900: "#26362B",
        },
        // Cream / warm white
        cream: {
          50: "#FFFEFB",
          100: "#FEFCF7",
          200: "#FDF8EF",
          300: "#FBF3E4",
          400: "#F7EBD5",
          500: "#F0DFC2",
        },
        // Charcoal for text
        charcoal: {
          50: "#F5F5F5",
          100: "#E8E8E8",
          200: "#D1D1D1",
          300: "#B0B0B0",
          400: "#888888",
          500: "#6D6D6D",
          600: "#5D5D5D",
          700: "#4F4F4F",
          800: "#3D3D3D",
          900: "#2A2A2A",
          950: "#1A1A1A",
        },
        // Accent — warm terracotta for highlights
        terracotta: {
          50: "#FDF6F3",
          100: "#FBEBE4",
          200: "#F7D5C8",
          300: "#F0B8A1",
          400: "#E8946F",
          500: "#DF7A4F",
          600: "#CC6138",
          700: "#AB4E2E",
          800: "#8C412A",
          900: "#743926",
        },
      },

      // ─── Typography Scale ─────────────────────────────────────
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Display sizes
        "display-2xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        "display-xs": ["1.5rem", { lineHeight: "1.3" }],
        // Body sizes
        "body-xl": ["1.25rem", { lineHeight: "1.6" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "body-xs": ["0.75rem", { lineHeight: "1.5" }],
      },

      // ─── Spacing Tokens ───────────────────────────────────────
      spacing: {
        "4.5": "1.125rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },

      // ─── Border Radius ────────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // ─── Shadows (soft, warm) ─────────────────────────────────
      boxShadow: {
        "soft-xs": "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        "soft-sm": "0 2px 4px -1px rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
        "soft-md": "0 4px 8px -2px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)",
        "soft-lg": "0 8px 16px -4px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.03)",
        "soft-xl": "0 16px 32px -8px rgba(0, 0, 0, 0.08), 0 8px 16px -8px rgba(0, 0, 0, 0.04)",
        "soft-2xl": "0 24px 48px -12px rgba(0, 0, 0, 0.1)",
        "inner-soft": "inset 0 1px 2px 0 rgba(0, 0, 0, 0.04)",
      },

      // ─── Animations ───────────────────────────────────────────
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(8px)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-in-bottom": "slide-in-bottom 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
      },

      // ─── Transitions ──────────────────────────────────────────
      transitionTimingFunction: {
        "ease-premium": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
