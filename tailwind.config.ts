import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        almond: {
          900: "#E5E0D8",
        },
        matcha: {
          dark: "#556952",
          light: "#819570",
          lighter: "#98b385",
          800: "#98B484",
          900: "#809671",
        },
        bentevi: {
          light: "#ffec81",
          medium: "#eacf46",
          900: "#e9d045",
          800: "#ffed8a",
        },
        bentenavi: {
          dark: "#262d93",
          900: "#5c6092",
        },
        chocolate: {
          950: "#5a3a2d",
          900: "#593a2d",
          800: "#8f6f65",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
