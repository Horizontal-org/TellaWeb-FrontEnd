import fs from "fs"
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

test("share a configuration as a QR code: download and print", async ({ page, adminApi }) => {
  const name = uniqueName("share")
  const config = await adminApi.post("/config/", {
    name,
    camouflage: JSON.stringify({ visible: true, calculator: true, change_name: true }),
    crashReports: JSON.stringify({ visible: true, enabled: true }),
    serversVisible: true,
  })

  // react-to-print prints from a hidden iframe; init scripts run in every frame, so count print() calls
  await page.addInitScript(() => {
    window.print = () => {
      const top = window.top as Window & { __printCalls?: number }
      top.__printCalls = (top.__printCalls ?? 0) + 1
    }
  })

  await page.goto(`/configuration/${config.id}`)
  await waitForApp(page)
  await page.getByRole("button", { name: "Share" }).click()
  const dialog = page.getByRole("dialog")
  const qr = dialog.locator("canvas#qrcode")
  await expect(qr).toBeVisible()
  // The QR code is drawn (not a blank canvas)
  expect(await qr.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL().length)).toBeGreaterThan(1000)

  const downloadPromise = page.waitForEvent("download")
  await dialog.getByRole("button", { name: "Download" }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe("qrcode.png")
  const png = fs.readFileSync(await download.path())
  expect(png.subarray(1, 4).toString("latin1")).toBe("PNG")

  await dialog.getByRole("button", { name: "Print" }).click()
  await expect.poll(() => page.evaluate(() => (window as Window & { __printCalls?: number }).__printCalls ?? 0)).toBe(1)
})
