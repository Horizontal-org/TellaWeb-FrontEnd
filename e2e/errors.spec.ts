import { Page } from "@playwright/test"
import { authenticated as test, expect, toast, waitForApp } from "./fixtures"
import { uniqueName } from "./support/api"

// Submits the "Create project" dialog; the backend call is mocked by each test
const submitNewProject = async (page: Page) => {
  await page.goto("/project")
  await waitForApp(page)
  await page.getByRole("button", { name: "NEW" }).click()
  const dialog = page.getByRole("dialog")
  await dialog.locator('input[name="name"]').fill(uniqueName("never-created"))
  await dialog.getByRole("button", { name: "SAVE" }).click()
}

const mockCreateProject = (page: Page, status: number, body?: unknown) =>
  page.route("**/api/project/", (route) =>
    route.request().method() === "POST"
      ? route.fulfill(body === undefined ? { status } : { status, json: body })
      : route.continue(),
  )

test("a failed request shows the backend's error message", async ({ page }) => {
  await mockCreateProject(page, 400, { statusCode: 400, message: "Mocked: project name is not allowed" })
  await submitNewProject(page)
  await expect(toast(page, "Mocked: project name is not allowed")).toBeVisible()
  await expect(toast(page, "Project created!")).toHaveCount(0)
})

test("a failed request without a body doesn't crash the page", async ({ page }) => {
  // Before errorMessage() this read error.data.message on an empty body and threw
  await mockCreateProject(page, 500)
  await submitNewProject(page)
  await expect(page.getByRole("button", { name: "NEW" })).toBeVisible()
  await expect(toast(page, "Project created!")).toHaveCount(0)
  // The pageErrors fixture fails the test if anything threw
})
