import { defineConfig, devices } from "@playwright/test"
import fs from "fs"
import path from "path"

// Load E2E_USER / E2E_PASS from .env.e2e.local (gitignored) without adding a dotenv dependency
const envFile = path.join(__dirname, ".env.e2e.local")
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2]
  }
}

// E2E_PROD=1 runs the suite against a production build (`next build && next start`) on its
// own port, so it never reuses a dev server
const prod = !!process.env.E2E_PROD
const port = prod ? 3101 : 3100
const baseURL = process.env.E2E_BASE_URL || `http://localhost:${port}`

export default defineConfig({
  testDir: "./e2e",
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: {
    timeout: 15_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
  },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: prod ? `npm run build && npx next start -p ${port}` : `npx next dev -p ${port}`,
    url: baseURL,
    reuseExistingServer: !prod,
    timeout: prod ? 600_000 : 180_000,
    env: {
      NEXT_PUBLIC_API_URL: "/api",
      NEXT_REDIRECT_API_URL: process.env.NEXT_REDIRECT_API_URL || "http://localhost:3001",
    },
  },
})
