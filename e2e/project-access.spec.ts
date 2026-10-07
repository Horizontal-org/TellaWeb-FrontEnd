import { Locator } from "@playwright/test"
import { authenticated as test, expect, expectToast, waitForApp } from "./fixtures"
import { uniqueEmail, uniqueName } from "./support/api"
import { tinyPdf } from "./support/files"

// The search box is grey, and turns blue (#008DEC) when focused or, through the styled-components
// `resultsOpen` prop, while results are open or something is selected (SearchUserInput /
// SearchEntityInput). Focus is moved away before checking, so only the prop can make it blue
const IDLE_BORDER = "rgb(95, 99, 104)"
const ACTIVE_BORDER = "rgb(0, 141, 236)"

// Searches in an "Add … to project" dialog and selects the result
const searchAndSelect = async (dialog: Locator, query: string, result: string) => {
  const input = dialog.getByRole("textbox")
  const searchBox = input.locator("xpath=../..")
  await expect(searchBox).toHaveCSS("border-top-color", IDLE_BORDER)

  await input.click()
  await input.pressSequentially(query)
  // Click the result row (a <p>), not the typed text inside the search box itself
  await dialog.getByRole("paragraph").getByText(result, { exact: true }).click()

  await dialog.getByRole("paragraph").first().click()
  await expect(input).not.toBeFocused()
  await expect(searchBox).toHaveCSS("border-top-color", ACTIVE_BORDER)
  await expect(dialog.getByRole("button", { name: "ADD" })).toBeEnabled()
}

test("add a user to a project", async ({ page, adminApi }) => {
  const project = await adminApi.createProject(uniqueName("access-project"))
  const email = uniqueEmail("access-user")
  await adminApi.createUser(email, "viewer")

  await page.goto(`/project/${project.id}/users`)
  await waitForApp(page)
  await page.getByRole("button", { name: "ADD USERS" }).click()
  const dialog = page.getByRole("dialog")
  await searchAndSelect(dialog, email, email)
  await dialog.getByRole("button", { name: "ADD" }).click()

  await expectToast(page, "Users updated!")
  await expect(page.getByRole("row", { name: new RegExp(email) })).toBeVisible()
})

test("add a resource to a project", async ({ page, adminApi }) => {
  const project = await adminApi.createProject(uniqueName("access-project"))
  const title = uniqueName("access-resource")
  await adminApi.uploadResource(`${title}.pdf`, tinyPdf())

  await page.goto(`/project/${project.id}/resources`)
  await waitForApp(page)
  await page.getByRole("button", { name: "ADD RESOURCES" }).click()
  const dialog = page.getByRole("dialog")
  await searchAndSelect(dialog, title, `${title}.pdf`)
  await dialog.getByRole("button", { name: "ADD" }).click()

  await expect(page.getByRole("row", { name: new RegExp(title) })).toBeVisible()
})
