/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    colors: {
      bgColor: "rgb(var(--color-bg) / <alpha-value>)",
      primary: "rgb(var(--color-primary) / <alpha-value>)",
      secondary: "rgb(var(--color-secondary) / <alpha-value>)",
      blue: "rgb(var(--color-blue) / <alpha-value>)",
      white: "rgb(var(--color-white) / <alpha-value>)",

      orange: "rgb(var(--color-orange) / <alpha-value>)",
      input: "rgb(var(--color-input) / <alpha-value>)",
      purple: "rgb(var(--color-purple) / <alpha-value>)",
      "hover-purple": "rgb(var(--color-hover-purple) / <alpha-value>)",
      ascent: {
        1: "rgb(var(--color-ascent1) / <alpha-value>)",
        2: "rgb(var(--color-ascent2) / <alpha-value>)",
      },
      Clr: "#4B32C3",
      Clrhv: "#553fc2",
      do: "#4B32C3",
    },
    screens: {
      sm: "640px",

      md: "768px",

      lg: "1024px",

      xl: "1280px",

      "2xl": "1536px",
    },
    extend: {
      backgroundImage: {
        tg: `url('/tg.jpg')`,
      },
      gridTemplateColumns: {
        16: "250px 1fr 250px",
        profile: "250px 1fr",
      },
    },
  },
  plugins: [],
};
