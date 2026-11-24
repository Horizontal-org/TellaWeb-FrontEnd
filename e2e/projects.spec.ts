import { authenticated as test, expect, expectToast, waitForApp } from "./fixtures"
import { uniqueName } from "./support/api"

test("create, rename and delete a project", async ({ page, adminApi }) => {
  const name = uniqueName("project")
  const renamed = `${name}-renamed`

  // Create from the projects list
  await page.goto("/project")
  await waitForApp(page)
  await page.getByRole("button", { name: "NEW" }).click()
  const createDialog = page.getByRole("dialog")
  await createDialog.locator('input[name="name"]').fill(name)
  await createDialog.getByRole("button", { name: "SAVE" }).click()
  await expectToast(page, "Project created!")
  await expect(page.getByText(name, { exact: true })).toBeVisible()

  const project = await adminApi.findProject(name)
  expect(project, "project exists in the backend").toBeTruthy()

  // Rename from the settings page
  await page.goto(`/project/${project.id}/settings`)
  await waitForApp(page)
  await expect(page.getByRole("heading", { name, level: 1 })).toBeVisible()
  await page.getByRole("button", { name: "RENAME" }).click()
  const renameDialog = page.getByRole("dialog")
  await renameDialog.locator('input[name="name"]').fill(renamed)
  await renameDialog.getByRole("button", { name: "SAVE" }).click()
  await expectToast(page, "Values updated!")
  await expect(page.getByRole("heading", { name: renamed, level: 1 })).toBeVisible()

  // Delete: the dialog only enables DELETE after typing the name and "DELETE"
  await page.getByRole("button", { name: "DELETE" }).click()
  const deleteDialog = page.getByRole("dialog")
  const confirm = deleteDialog.getByRole("button", { name: "DELETE" })
  await expect(confirm).toBeDisabled()
  await deleteDialog.locator('input[name="name"]').fill(renamed)
  await deleteDialog.locator('input[name="deleteConfirm"]').fill("DELETE")
  await expect(confirm).toBeEnabled()
  await confirm.click()
  await expectToast(page, "Project deleted")
  await expect(page).toHaveURL(/\/project$/)

  await expect.poll(() => adminApi.findProject(renamed)).toBeUndefined()
})
