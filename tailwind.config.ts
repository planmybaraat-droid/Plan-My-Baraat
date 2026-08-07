import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  "#fdfbf7",
          100: "#faf4e5",
          200: "#f3e7c8",
          300: "#e9d5a2",
          400: "#d3ba7a",
          500: "#b8860b", // Core Burnished Gold
          600: "#9e7104",
          700: "#805c03",
          800: "#614602",
          900: "#422f01",
        },
        champagne: "#f4f1ea",
        ivory:     "#fcfbf9",
        charcoal:  "#1c1917",
        midnight:  "#fcfbf9", // map to ivory background
        blush:     "#fdf2f2",
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Georgia", "serif"],
        sans:  ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #b8860b 0%, #dfc282 50%, #8c6200 100%)",
        "dark-gradient": "linear-gradient(135deg, #fcfbf9 0%, #f4f1ea 100%)",
      },
      boxShadow: {
        gold:   "0 4px 24px rgba(184,134,11,0.08)",
        luxury: "0 10px 40px rgba(184,134,11,0.06), 0 2px 12px rgba(0,0,0,0.03)",
        card:   "0 4px 20px rgba(0,0,0,0.02), 0 1px 3px rgba(184,134,11,0.04)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        float:     "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
