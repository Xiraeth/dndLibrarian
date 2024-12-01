/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.pug"],
  theme: {
    extend: {
      fontFamily: {
        mont: ["montserat", "ui-sans-serif"],
        cactus: ["cactus", "ui-serif"],
      },
      keyframes: {
        rainbowColor: {
          "0%, 100%": { color: "orange" },
          "14%": { color: "yellow" },
          "28%": { color: "green" },
          "42%": { color: "cyan" },
          "57%": { color: "blue" },
          "71%": { color: "violet" },
          "85%": { color: "red" },
        },
      },
      animation: {
        rainbowColor: "rainbowColor 7s linear infinite",
      },
    },
  },
  plugins: [],
};
