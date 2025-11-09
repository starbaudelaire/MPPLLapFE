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
        "lapang-red": "#D90429",
        "lapang-green": "#55A630",
        "lapang-dark": "#1F2937",
        "lapang-gray": "#F3F4F6",
        "lapang-light": "#FFFFFF",
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
