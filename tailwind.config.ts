import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css,scss}",
  ],
  theme: {
    container: {
      padding: "2rem",
    },
    extend: {
      maxWidth: {
        "8xl": "88rem", // 1408px
        "9xl": "96rem", // 1536px
        "10xl": "104rem", // 1664px
        "11xl": "112rem", // 1792px
        "12xl": "120rem", // 1920px
        "13xl": "128rem", // 2048px
        "14xl": "136rem", // 2176px
        "15xl": "144rem", // 2304px
      },
      fontFamily: {
        sans: ["Figtree", ...defaultTheme.fontFamily.sans],
        header: ["Figtree", ...defaultTheme.fontFamily.sans],
      },
      screens: {
        ipad: "1193px",
      },
      keyframes: {
        pulseFast: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        textMoveIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInFromLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        moveIn: "textMoveIn 0.5s ease-in",
        slideInFromLeft: "slideInFromLeft 0.3s ease forwards",
        "pulse-fast": "pulseFast 0.6s ease-in-out infinite",
      },
    },
  },
  plugins: [
    typography,
    animate,
    ({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, any>) => void;
    }) => {
      addUtilities({
        ".diagonal-right": {
          clipPath: "polygon(0 0, 100% 0, 90% 100%, 0 100%)",
        },
        ".diagonal-left": {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 10% 100%)",
        },
      });
    },
  ],
};

export default config;
