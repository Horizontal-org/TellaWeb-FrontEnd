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
