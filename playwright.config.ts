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

// Screenshot baselines are local only (gitignored). On a machine that has none yet, this run
// records them instead of failing every screenshot test. Once they exist, a missing or changed
// screenshot fails as usual. Decided once in the main process and passed to workers through the
// environment, because workers re-read this file after the first baselines are written
const screenshotsDir = path.join(__dirname, "e2e", "__screenshots__")
if (process.env.E2E_RECORD_BASELINES === undefined) {
  process.env.E2E_RECORD_BASELINES = fs.existsSync(screenshotsDir) ? "0" : "1"
  if (process.env.E2E_RECORD_BASELINES === "1") {
    console.log(`No screenshot baselines in ${path.relative(process.cwd(), screenshotsDir)}: this run records them`)
  }
}
const recordBaselines = process.env.E2E_RECORD_BASELINES === "1"

export default defineConfig({
  testDir: "./e2e",
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",
  ...(recordBaselines && { updateSnapshots: "changed" as const }),
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
