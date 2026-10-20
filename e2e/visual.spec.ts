import { Page } from "@playwright/test"
import { authenticated, expect, readData, test, waitForApp } from "./fixtures"
import { TMP_PASSWORD, enableTwoFactor, uniqueEmail } from "./support/api"

// Screenshots of UI states the page screenshots don't reach: dialogs, a selected row, error
// and 2FA screens. Element screenshots where possible, so list data around them doesn't matter.
// Added before the Tailwind upgrade, which can change any of these.

const openDialog = async (page: Page, path: string, button: string) => {
  await page.goto(path)
  await waitForApp(page)
  await page.getByRole("button", { name: button, exact: true }).click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  return dialog
}

authenticated.describe("dialogs", () => {
  authenticated("create user, with the password meter", async ({ page }) => {
    const dialog = await openDialog(page, "/user", "CREATE USER")
    await dialog.locator('input[name="password"]').fill("abc")
    await expect(dialog).toHaveScreenshot("dialog-create-user.png")
  })

  authenticated("create project", async ({ page }) => {
    const dialog = await openDialog(page, "/project", "NEW")
    await expect(dialog).toHaveScreenshot("dialog-create-project.png")
  })

  authenticated("create resource", async ({ page }) => {
    const dialog = await openDialog(page, "/resource", "CREATE RESOURCE")
    await expect(dialog).toHaveScreenshot("dialog-create-resource.png")
  })

  authenticated("new configuration", async ({ page }) => {
    const dialog = await openDialog(page, "/configuration", "NEW")
    await expect(dialog).toHaveScreenshot("dialog-new-configuration.png")
  })

  authenticated("share configuration", async ({ page }) => {
    const { configurationId } = readData()
    authenticated.skip(!configurationId, "No configuration in the local backend")
    const dialog = await openDialog(page, `/configuration/${configurationId}`, "Share")
    await expect(dialog.locator("canvas#qrcode")).toBeVisible()
    await expect(dialog).toHaveScreenshot("dialog-share-configuration.png")
  })

  authenticated("rename and delete project", async ({ page }) => {
    const { projectId } = readData()
    authenticated.skip(!projectId, "No project in the local backend")
    const rename = await openDialog(page, `/project/${projectId}/settings`, "RENAME")
    await expect(rename).toHaveScreenshot("dialog-rename-project.png")
    await page.keyboard.press("Escape")

    const remove = await openDialog(page, `/project/${projectId}/settings`, "DELETE")
    await expect(remove).toHaveScreenshot("dialog-delete-project.png")
  })
})

authenticated("users list with a selected row", async ({ page }) => {
  await page.goto("/user")
  await waitForApp(page)
  await page.locator("tbody tr").first().locator("td").nth(1).click()
  await page.getByRole("heading", { level: 1 }).hover()
  await expect(page).toHaveScreenshot("users-row-selected.png", { fullPage: true })
})

// Uses its own user: repeated failed logins on the e2e admin could trip the backend's
// suspicious-login protection for the account every other test uses
test("login with a wrong password shows an error", async ({ page, adminApi }) => {
  const email = uniqueEmail("visual-wrong-password")
  await adminApi.createUser(email, "viewer")
  await page.goto("/login")
  await page.getByPlaceholder("Email").fill(email)
  await page.getByPlaceholder("Password").fill("definitely-not-the-password")
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page.getByRole("alert").filter({ hasText: /\S/ })).toBeVisible()
  await expect(page.locator("form")).toHaveScreenshot("login-error.png")
})

test("two-factor passcode screen", async ({ page, baseURL, adminApi }) => {
  const email = uniqueEmail("visual-otp")
  await adminApi.createUser(email, "viewer")
  await enableTwoFactor(baseURL, email)

  await page.goto("/login")
  await page.getByPlaceholder("Email").fill(email)
  await page.getByPlaceholder("Password").fill(TMP_PASSWORD)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page.getByText("One-time passcode")).toBeVisible()
  await expect(page.locator("form")).toHaveScreenshot("login-two-factor.png")
})
