/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.pug"],
  theme: {
    extend: {
      fontFamily: {
        mont: ["montserat", "ui-sans-serif"],
        cactus: ["cactus", "ui-serif"],
      },
    },
  },
  plugins: [],
};
