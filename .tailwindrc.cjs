const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {},
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-15deg)" },
          "50%": { transform: "rotate(15deg)" },
        },
        "modal-open": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "modal-close": {
          "0%": { transform: "scaleX(1)" },
          "100%": { transform: "scaleX(0)" },
        },
        "calendar-open": {
          "0%": { transform: "translateY(6rem)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "calendar-close": {
          "0%": { transform: "translateY(0)", opacity: 1 },
          "100%": { transform: "translateY(6rem)", opacity: 0 },
        },
      },
      animation: {
        wiggle: "wiggle 200ms ease-in-out",
        "modal-open": "modal-open 250ms ease-out",
        "modal-close": "modal-close 250ms ease-in",
        "calendar-open": "calendar-open 250ms ease-out",
        "calendar-close": "calendar-close 300ms ease-in",
      },
    },
  },
  variants: {
    extend: {},
  },
  safelist: [
    {
      pattern: /bg-(emerald|amber|rose|sky|violet|fuchsia|stone)-(100|300|500)/,
    },
    {
      pattern: /shadow-(emerald|amber|rose|sky|violet|fuchsia|stone)-(300|500)/,
    },
    {
      pattern: /text-(emerald|amber|rose|sky|violet|fuchsia|stone)-(500|900)/,
    },
  ],
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography"), require("@tailwindcss/aspect-ratio")],
};
