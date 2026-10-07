import { authenticated as test, expect, readData, waitForApp } from "./fixtures"
import { ReportFile } from "./global-setup"

const openFile = async (page, file: ReportFile) => {
  await page.goto(`/report/${file.reportId}`)
  await waitForApp(page)
  await page.locator(".grid.grid-cols-2 > *").nth(file.fileIndex).click()
}

test("report image viewer shows the image", async ({ page }) => {
  const { image } = readData()
  test.skip(!image, "No report with an image in the local backend")

  await openFile(page, image)
  const img = page.locator(`img[alt="${image.fileName}"]`).last()
  await expect(img).toBeVisible()
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0)
})

test("report video viewer loads the video", async ({ page }) => {
  const { video } = readData()
  test.skip(!video, "No report with a video in the local backend")

  await openFile(page, video)
  // Thumbnails are <video> elements too, the viewer is the one inside #content
  const player = page.locator("#content video")
  await expect(player).toBeVisible()
  // readyState >= 1 (HAVE_METADATA) means the browser fetched and parsed the file
  await expect.poll(() => player.evaluate((el: HTMLVideoElement) => el.readyState)).toBeGreaterThanOrEqual(1)
})

test("report audio viewer loads the audio", async ({ page }) => {
  const { audio } = readData()
  test.skip(!audio, "No report with an audio file in the local backend")

  await openFile(page, audio)
  const player = page.locator("#content audio")
  await expect(player).toBeAttached()
  await expect.poll(() => player.evaluate((el: HTMLAudioElement) => el.readyState)).toBeGreaterThanOrEqual(1)
})

test("resource PDF viewer points at a downloadable PDF", async ({ page }) => {
  const { pdfResource } = readData()
  test.skip(!pdfResource, "No PDF resource in the local backend")

  await page.goto("/resource")
  await waitForApp(page)
  const row = page.getByRole("row").filter({ hasText: pdfResource.replace(/\.pdf$/i, "") }).first()
  await row.hover()

  await row.getByRole("button", { name: "Open" }).click()
  // Headless Chromium has no PDF plugin and never fetches <object> data, so fetch it directly
  const viewer = page.locator('object[type="application/pdf"]')
  await expect(viewer).toHaveAttribute("data", /\/api\/resource\/asset\/.+/)
  const response = await page.request.get(await viewer.getAttribute("data"))
  expect(response.ok(), `status ${response.status()}`).toBe(true)
  expect((await response.body()).subarray(0, 4).toString()).toBe("%PDF")
})
