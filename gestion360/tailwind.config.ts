import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#0b1c30", 900: "#0f2742", 800: "#16365a", 700: "#1f4670" },
        brand: { 50: "#ecf7f3", 100: "#d0ece3", 500: "#1f9d7a", 600: "#178566", 700: "#126b52" },
        gold: { 500: "#b8893a" },
        surface: "#f5f7fa",
      },
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"] },
      boxShadow: { card: "0 1px 2px rgba(15,39,66,.06), 0 1px 3px rgba(15,39,66,.08)" },
    },
  },
  plugins: [],
} satisfies Config;
