import { FlatCompat } from "@eslint/eslintrc"
import testingLibrary from "eslint-plugin-testing-library"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

export default [
  {
    ignores: [".next/**", "node_modules/**", "storybook-static/**", "playwright-report/**", "test-results/**"],
  },
  ...compat.extends("next", "next/core-web-vitals"),
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
    },
  },
  {
    // Jest/Testing Library tests only, Playwright specs in e2e/ don't use Testing Library
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    ignores: ["e2e/**"],
    ...testingLibrary.configs["flat/react"],
  },
]
