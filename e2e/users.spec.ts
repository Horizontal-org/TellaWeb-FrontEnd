import { Page } from "@playwright/test"
import { authenticated as test, expect, expectToast, toast, waitForApp } from "./fixtures"
import { TMP_PASSWORD, uniqueEmail } from "./support/api"

const openCreateUser = async (page: Page) => {
  await page.goto("/user")
  await waitForApp(page)
  await page.getByRole("button", { name: "CREATE USER" }).click()
  return page.getByRole("dialog")
}

// A section of the user page ("Role", "Delete user", …), each with its own action button
const section = (page: Page, label: string) =>
  page.locator("div.justify-between").filter({ has: page.getByText(label, { exact: true }) })

test("create a user, change their role and delete them", async ({ page, adminApi }) => {
  const email = uniqueEmail("user")

  // Create as a viewer
  const dialog = await openCreateUser(page)
  await dialog.locator('input[name="username"]').fill(email)
  await dialog.locator('input[name="password"]').fill(TMP_PASSWORD)
  await dialog.locator('input[name="confirm-password"]').fill(TMP_PASSWORD)
  await dialog.getByRole("radio", { name: "Viewer" }).check()
  await dialog.getByRole("button", { name: "SAVE" }).click()
  await expectToast(page, "User created!")
  await expect(page.getByRole("row", { name: `${email} viewer` })).toBeVisible()

  const user = await adminApi.findUser(email)
  expect(user?.role).toBe("viewer")

  // Open the user page from the list. Navigating inside the app matters: after deleting, the page
  // goes back with router.back(), and a full page load would reset the toast
  const row = page.getByRole("row", { name: `${email} viewer` })
  await row.hover()
  await row.getByRole("button", { name: "Open", exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`/user/${user.id}$`))

  // Promote to editor
  await section(page, "Role").getByRole("button", { name: "EDIT" }).click()
  const roleDialog = page.getByRole("dialog")
  await roleDialog.getByRole("radio", { name: "Editor" }).check()
  await roleDialog.getByRole("button", { name: "SAVE" }).click()
  await expectToast(page, "User updated!")
  await expect.poll(async () => (await adminApi.findUser(email))?.role).toBe("editor")

  // Delete: confirmation needs "DELETE" typed in
  await section(page, "Delete user").getByRole("button", { name: "DELETE" }).click()
  const deleteDialog = page.getByRole("dialog")
  const confirm = deleteDialog.getByRole("button", { name: "DELETE" })
  await expect(confirm).toBeDisabled()
  await deleteDialog.locator('input[name="username"]').fill("DELETE")
  await confirm.click()
  await expectToast(page, "User deleted")
  await expect(page).toHaveURL(/\/user$/)
  await expect.poll(() => adminApi.findUser(email)).toBeUndefined()
})

test("creating a user with an existing email shows the backend's error", async ({ page }) => {
  const dialog = await openCreateUser(page)
  await dialog.locator('input[name="username"]').fill(process.env.E2E_USER)
  await dialog.locator('input[name="password"]').fill(TMP_PASSWORD)
  await dialog.locator('input[name="confirm-password"]').fill(TMP_PASSWORD)
  await dialog.getByRole("button", { name: "SAVE" }).click()
  await expect(toast(page, `User ${process.env.E2E_USER} already exist`)).toBeVisible()
})
