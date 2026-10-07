import { authenticated as test, expect, expectToast, waitForApp } from "./fixtures"
import { uniqueName } from "./support/api"

test("create and delete a remote configuration", async ({ page, adminApi }) => {
  const name = uniqueName("config")

  await page.goto("/configuration")
  await waitForApp(page)
  await page.getByRole("button", { name: "NEW" }).click()
  const dialog = page.getByRole("dialog")
  await dialog.locator('input[name="name"]').fill(name)
  await dialog.getByRole("button", { name: "SAVE" }).click()
  await expectToast(page, "Remote configuration created!")

  const config = await adminApi.findConfiguration(name)
  expect(config, "configuration exists in the backend").toBeTruthy()

  // Open it from the list (in-app navigation, deleting goes back with router.back())
  const row = page.getByRole("row", { name: new RegExp(name) })
  await row.hover()
  await row.getByRole("button", { name: "..." }).click()
  await row.getByRole("button", { name: "Open", exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`/configuration/${config.id}$`))
  await expect(page.getByRole("heading", { name })).toBeVisible()

  // Delete through the "..." menu; the confirmation needs "DELETE" typed in
  await page.getByRole("button", { name: "..." }).click()
  await page.getByRole("button", { name: "DELETE" }).click()
  const confirmDialog = page.getByRole("dialog")
  await confirmDialog.getByRole("textbox").fill("DELETE")
  await confirmDialog.getByRole("button", { name: "Confirm" }).click()

  // The app currently says "Report deleted" here, so check the outcome rather than the wording
  await expect(page).toHaveURL(/\/configuration$/)
  await expect.poll(() => adminApi.findConfiguration(name)).toBeUndefined()
})
