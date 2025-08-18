// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // خطوط محلية
        nata: ["NataSansVariable", "sans-serif"],
        cairo: ["CairoVariable", "sans-serif"],
        fira: ["FiraCodeVariable", "monospace"],
        geist: ["GeistVariable", "sans-serif"],
        inter: ["InterVariable", "sans-serif"],
        interItalic: ["InterItalicVariable", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config
