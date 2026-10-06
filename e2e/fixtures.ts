import { test as base, expect, Page } from "@playwright/test"
import fs from "fs"
import { AUTH_FILE, DATA_FILE, E2EData } from "./global-setup"

export const readData = (): E2EData => JSON.parse(fs.readFileSync(DATA_FILE, "utf8"))

// Fails the test on uncaught page errors, which is what most upgrade breakage looks like
export const test = base.extend<{ pageErrors: Error[] }>({
  pageErrors: [
    async ({ page }, use) => {
      const errors: Error[] = []
      page.on("pageerror", (error) => errors.push(error))
      await use(errors)
      expect(errors, errors.map((e) => e.message).join("\n")).toEqual([])
    },
    { auto: true },
  ],
})

export const authenticated = test.extend({
  storageState: AUTH_FILE,
})

// Waits until the app is past the splash screen and requests have settled
export const waitForApp = async (page: Page) => {
  await page.waitForLoadState("load")
  await page.waitForLoadState("networkidle").catch(() => undefined)
  await expect(page).not.toHaveURL(/\/login/)
}

export { expect }
