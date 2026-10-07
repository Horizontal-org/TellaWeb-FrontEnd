import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import testingLibrary from "eslint-plugin-testing-library"

export default [
  {
    ignores: [".next/**", "node_modules/**", "storybook-static/**", "playwright-report/**", "test-results/**"],
  },
  // Includes the base "next" and "next/typescript" configs
  ...nextCoreWebVitals,
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
      // React Compiler rules (eslint-plugin-react-hooks 7, via Next 16) that existing pages
      // trip. The app doesn't use the compiler, so they stay off until those effects are refactored
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/preserve-manual-memoization": "off",
    },
  },
  {
    // Jest/Testing Library tests only, Playwright specs in e2e/ don't use Testing Library
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    ignores: ["e2e/**"],
    ...testingLibrary.configs["flat/react"],
  },
]
