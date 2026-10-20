import fs from "fs"
import { authenticated as test, expect, expectToast, waitForApp } from "./fixtures"
import { uniqueName } from "./support/api"
import { tinyPdf } from "./support/files"

test("upload, download and delete a resource", async ({ page, adminApi }) => {
  const title = uniqueName("resource")
  const fileName = `${title}.pdf`

  // Upload through the "Create resource" dialog
  await page.goto("/resource")
  await waitForApp(page)
  await page.getByRole("button", { name: "CREATE RESOURCE" }).click()
  const dialog = page.getByRole("dialog")
  await dialog.locator('input[type="file"]').setInputFiles({ name: fileName, mimeType: "application/pdf", buffer: tinyPdf() })
  await expect(dialog.getByText(fileName)).toBeVisible()
  await dialog.getByRole("button", { name: "SAVE" }).click()
  await expectToast(page, "The new resource was successfully added to your workspace")

  const row = page.getByRole("row", { name: new RegExp(title) })
  await expect(row).toBeVisible()
  await expect.poll(async () => (await adminApi.findResource(title))?.fileName).toBe(fileName)

  // Download it: clicking a row selects it, then the toolbar shows a Download button
  await row.getByRole("cell", { name: title }).click()
  await expect(row.getByRole("checkbox")).toBeChecked()
  const downloadPromise = page.waitForEvent("download")
  await page.getByRole("button", { name: "Download" }).click()
  const download = await downloadPromise
  const content = fs.readFileSync(await download.path())
  expect(content.length).toBeGreaterThan(0)
  // A single resource may come back as the PDF itself or zipped
  expect(["%PDF", "PK\u0003\u0004"]).toContain(content.subarray(0, 4).toString("latin1"))

  // Delete from the toolbar's menu (icon-only "three dots" button after Download) while selected
  const toolbar = page.locator("div.space-x-2").filter({ has: page.getByRole("button", { name: "Download" }) })
  await toolbar.getByRole("button").last().click()
  await page.getByRole("button", { name: "DELETE", exact: true }).click()
  await page.getByRole("dialog").getByRole("button", { name: "DELETE" }).click()
  await expectToast(page, "The resource was successfully deleted")
  await expect.poll(() => adminApi.findResource(title)).toBeUndefined()
})
