import { authenticated as test, expect, readData, waitForApp } from "./fixtures"
import { E2EData } from "./global-setup"

type PageCase = { name: string; path: (data: E2EData) => string | undefined }

// Every main screen must load without redirecting to /login or throwing, and look the same
const pages: PageCase[] = [
  { name: "projects", path: () => "/project" },
  { name: "project", path: (data) => data.projectId && `/project/${data.projectId}` },
  { name: "project-users", path: (data) => data.projectId && `/project/${data.projectId}/users` },
  { name: "project-resources", path: (data) => data.projectId && `/project/${data.projectId}/resources` },
  { name: "project-settings", path: (data) => data.projectId && `/project/${data.projectId}/settings` },
  { name: "report", path: (data) => data.reportId && `/report/${data.reportId}` },
  { name: "configurations", path: () => "/configuration" },
  { name: "configuration", path: (data) => data.configurationId && `/configuration/${data.configurationId}` },
  { name: "users", path: () => "/user" },
  { name: "resources", path: () => "/resource" },
  { name: "admin-center", path: () => "/admin-center" },
  { name: "settings", path: () => "/settings" },
]

for (const { name, path } of pages) {
  test(`${name} page renders`, async ({ page }) => {
    const url = path(readData())
    test.skip(!url, "No matching record in the local backend")

    await page.goto(url)
    await waitForApp(page)
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [page.locator("video"), page.locator("audio")],
    })
  })
}

// The language switcher is hidden for now, so this only checks that the "settings"
// namespace loads under the Spanish locale (login covers the visible translations)
test("settings page renders under the Spanish locale", async ({ page }) => {
  await page.goto("/es/settings")
  await waitForApp(page)
  await expect(page).toHaveURL(/\/es\/settings$/)
})
