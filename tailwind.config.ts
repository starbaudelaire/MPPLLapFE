import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f64e42",
        brand: "#0A84FF",
        "brand-dim": "#0666cc",
        "lapang-red": "#D90429",
        "lapang-green": "#55A630",
        "lapang-dark": "#1F2937",
        "lapang-gray": "#F3F4F6",
        "lapang-light": "#FFFFFF",
      },
      borderRadius: {
        lg: "14px",
        md: "10px",
        sm: "8px",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(0, 0, 0, 0.10)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
