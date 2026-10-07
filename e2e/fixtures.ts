import { test as base, expect, Page } from "@playwright/test"
import fs from "fs"
import { AUTH_FILE, DATA_FILE, E2EData } from "./global-setup"
import { AdminApi } from "./support/api"

export const readData = (): E2EData => JSON.parse(fs.readFileSync(DATA_FILE, "utf8"))

// Fails the test on uncaught page errors, which is what most upgrade breakage looks like.
// adminApi talks to the backend directly, for setup, checks and clean-up
export const test = base.extend<{ pageErrors: Error[] }, { adminApi: AdminApi }>({
  adminApi: [
    async ({}, use, workerInfo) => {
      const api = await AdminApi.login(workerInfo.project.use.baseURL)
      await use(api)
      await api.removeTmpRecords()
      await api.dispose()
    },
    { scope: "worker" },
  ],
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

// The toast the app shows after an action (components/ToastWrapper.tsx)
export const toast = (page: Page, text: string | RegExp) => page.getByText(text)

// Checks a toast appears, then waits for it to go away. ToastWrapper doesn't cancel the previous
// toast's 5 s hide timer, so a toast shown right after another one can disappear early
export const expectToast = async (page: Page, text: string | RegExp) => {
  await expect(toast(page, text)).toBeVisible()
  await expect(toast(page, text)).toBeHidden({ timeout: 10_000 })
}

export { expect }
