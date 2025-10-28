import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#121212",
          500: "#121212",
          400: "#1c1c1c",
          300: "#2b2b2b",
        },
        fog: {
          DEFAULT: "#f6f6f6",
          200: "#f6f6f6",
          300: "#ececec",
          400: "#e0e0e0",
        },
      },
      fontFamily: {
        sans: ["var(--font-grotesk)", "Space Grotesk", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        "soft-ease": "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "soft-long": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        250: "250ms",
      },
      boxShadow: {
        focus: "0 0 0 1px #0b0b0b, 0 0 0 6px rgba(11, 11, 11, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
