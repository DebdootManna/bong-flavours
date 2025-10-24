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
        brand: {
          maroon: "#6F1D1B",
          tan: "#BB9457",
          dark: "#432818",
          brown: "#99582A",
          cream: "#FFE6A7",
        },
      },
      fontFamily: {
        gupter: ["Gupter", "serif"],
        "instrument-sans": ["var(--font-instrument-sans)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
        "albert-sans": ["var(--font-albert-sans)", "sans-serif"],
        prata: ["var(--font-prata)", "serif"],
        oswald: ["var(--font-oswald)", "sans-serif"],
        title: ["var(--font-oswald)", "sans-serif"],
        heading: ["var(--font-oswald)", "sans-serif"],
        subheading: ["sans-serif"],
        body: ["serif"],
      },
      animation: {
        fadeIn: "fadeIn 0.6s ease-in-out",
        slideUp: "slideUp 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
