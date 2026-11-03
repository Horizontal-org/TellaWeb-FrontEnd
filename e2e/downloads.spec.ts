import fs from "fs"
import { authenticated as test, expect, readData, waitForApp } from "./fixtures"

// Downloads go straight to the browser (no fetch + blob), so the file name comes
// from the API's Content-Disposition and the content must be the real file
const ZIP_MAGIC = "PK\u0003\u0004"

// Read only the header: backups can exceed the 2 GiB readFileSync limit
const magic = async (download) => {
  const fd = fs.openSync(await download.path(), "r")
  const buf = Buffer.alloc(4)
  fs.readSync(fd, buf, 0, 4, 0)
  fs.closeSync(fd)
  return buf.toString("latin1")
}

test("report view downloads the open file with its own name", async ({ page }) => {
  const { image } = readData()
  test.skip(!image, "No report with an image in the local backend")

  await page.goto(`/report/${image.reportId}`)
  await waitForApp(page)
  await page.getByTestId("report-files").locator(":scope > *").nth(image.fileIndex).click()

  const downloadPromise = page.waitForEvent("download")
  await page.getByRole("button", { name: "Download file" }).first().click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe(image.fileName)
  expect(fs.statSync(await download.path()).size).toBeGreaterThan(0)
})

test("report list downloads the selected report as a zip", async ({ page }) => {
  const { reportId } = readData()
  test.skip(!reportId, "No report in the local backend")

  await page.goto("/report")
  await waitForApp(page)
  // Clicking a row selects it, then the toolbar shows a Download button
  await page.locator("tbody tr").first().locator("td").nth(1).click()
  await page.getByRole("heading", { level: 1 }).hover()

  const downloadPromise = page.waitForEvent("download")
  await page.getByRole("button", { name: "Download", exact: true }).first().click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/^report-[0-9a-f-]{36}\.zip$/)
  expect(await magic(download)).toBe(ZIP_MAGIC)
})

test("admin center downloads the latest backup", async ({ page }) => {
  await page.goto("/admin-center")
  await waitForApp(page)
  const latest = page.getByText("LATEST BACKUP")
  test.skip(!(await latest.isVisible()), "No finished backup in the local backend")

  const downloadPromise = page.waitForEvent("download")
  await page.getByRole("button", { name: "DOWNLOAD", exact: true }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/^\d+-\d+-\d+T\d+_\d+_\d+-backup\.zip$/)
  // Backups can be several GB: stop the browser download and fetch only the header
  await download.cancel()
  const head = await page.request.get(download.url(), { headers: { Range: "bytes=0-3" } })
  expect(head.status()).toBe(206)
  expect((await head.body()).toString("latin1")).toBe(ZIP_MAGIC)
})
