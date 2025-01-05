/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,ts}",
    "./src/**/**/*.{vue,ts}"
  ],
  darkMode: "class",
  theme: {
    spacing: Array.from({ length: 1000 }).reduce((map, _, index) => {
      map[index] = `${index}px`;
      return map;
    }, {}),
    extend: {
      colors: {
        customGray: {
          DEFAULT: "#212121"
        },
        customGray_shallow: {
          DEFAULT: "#313131"
        },
        customGray_more_shallow: {
          DEFAULT: "#4A4A4A"
        }
      }
    }
  },
  plugins: [require("daisyui")]
};