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
          800: "#98B484",
          900: "#809671",
        },
        bentevi: {
          900: "#e9d045",
          800: "#ffed8a",
        },
        bentenavi: {
          900: "#5c6092",
        },
        chocolate: {
          900: "#593a2d",
          800: "#8f6f65",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
