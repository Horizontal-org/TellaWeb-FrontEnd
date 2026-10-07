const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const aspectRatio = require("@tailwindcss/aspect-ratio");

// Tailwind 2's default palette under its v2 names. In v3 `defaultTheme.colors` is a function
// (spreading it gives nothing) and some palettes were renamed; shades 50–900 are identical
const v2Colors = {
  transparent: "transparent",
  current: "currentColor",
  black: colors.black,
  white: colors.white,
  gray: colors.gray,
  red: colors.red,
  yellow: colors.amber,
  green: colors.emerald,
  indigo: colors.indigo,
  purple: colors.violet,
  pink: colors.pink,
};

// Tailwind 2's default shadows (v3 changed their values)
const v2BoxShadow = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  none: "none",
};

// Tailwind 2's default sans-serif fallbacks (v3 changed the list)
const v2SansFallbacks = [
  "ui-sans-serif",
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  '"Noto Sans"',
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
];

module.exports = {
  content: [
    "./packages/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./common/**/*.{ts,tsx}",
  ],
  // The aspect-ratio plugin provides aspect-w-* / aspect-h-*; v3's own aspect-* utilities clash with it
  corePlugins: {
    aspectRatio: false,
  },
  theme: {
    colors: {
      ...v2Colors,
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
        ...v2Colors.gray,
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
      ...v2BoxShadow,
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
        sans: ["Open Sans", ...v2SansFallbacks],
      },
    },
  },
  plugins: [aspectRatio],
};
