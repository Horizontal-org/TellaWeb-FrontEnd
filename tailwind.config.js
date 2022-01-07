/* eslint-disable */
const defaultTheme = require("tailwindcss/defaultTheme");
const aspectRatio = require("@tailwindcss/aspect-ratio");

module.exports = {
  purge: ["./packages/ui/**/*.tsx"],
  darkMode: false,
  theme: {
    colors: {
      ...defaultTheme.colors,
      blue: {
        light: "#e9f2ff",
        50: "#3eacf1",
        100: "#34a2e7",
        200: "#2a98dd",
        300: "#008DEC",
        400: "#0082d9",
        500: "#0c7abf",
        600: "#0270b5",
        700: "#0066ab",
        800: "#005ca1",
        900: "#005297",
      },
      gray: {
        ...defaultTheme.colors.gray,
        25: "#f1f1f1",
        50: "#f5f5f5",
        100: "#d9d9d9",
        200: "#e5e5e5",
        300: "#8b8e8f",
        500: "#5f6368",
        700: "#404040",
      },
      customgray: {
        400: '#D9D9D9',
        500: '#8B8E8F'
      }
    },
    fontSize: {
      sm: ["11px", "14px"],
      base: ["14px", "16.8px"],
      lg: ["16px", "24px"],
      xl: ["20px", "28px"],
      xxl: ["3rem", "4rem"],
      xxxl: ["24px", "32px"],
    },
    fontWeight: {
      ...defaultTheme.fontWeight,
      extrablack: 1000,
    },
    boxShadow: {
      ...defaultTheme.boxShadow,
      inbox:
        "inset -3px 2px 2px rgba(0, 0, 0, 0.15), inset 2px -2px 2px rgba(0, 0, 0, 0.15)",
    },
    spacing: {
      ...defaultTheme.spacing,
      xxxsm: "5px",
      xsm: "15px",
      sm: "20px",
      md: "30px",
      xxl: "60px",
      xxxxl: "80px",
    },
    extend: {
      fontFamily: {
        sans: ["Open Sans", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {
      placeholderColor: ["hover"],
      opacity: ["disabled"],
      boxShadow: ["active"],
      display: ["group-hover"]
    },
  },
  plugins: [aspectRatio],
};
