import { Page } from "@playwright/test"
import { apiRequest, apiResponse, authenticated as test, bodyRows, expect, waitForApp } from "./fixtures"
import { TMP_PREFIX } from "./support/api"
import { tinyPdf } from "./support/files"

// Server-side search and sorting on the configurations and resources lists. The records share a
// unique prefix and every test searches for it, so the rows only contain records created here
const PREFIX = `${TMP_PREFIX}lsrt-${Date.now().toString(36)}-`
const configNames = ["a", "b", "c"].map((s) => `${PREFIX}${s}`)
const resourceTitles = ["a", "b"].map((s) => `${PREFIX}${s}`)

test.describe.configure({ mode: "serial" })

test.beforeAll(async ({ adminApi }) => {
  for (const name of configNames) await adminApi.createConfiguration(name)
  for (const title of resourceTitles) await adminApi.uploadResource(`${title}.pdf`, tinyPdf())
})

test.afterAll(async ({ adminApi }) => {
  await adminApi.removeTmpRecords()
})

const names = async (page: Page) => (await bodyRows(page).locator("td:nth-child(2)").allTextContents()).map((n) => n.trim())

const openFiltered = async (page: Page, path: string, apiPath: string) => {
  await page.goto(path)
  await waitForApp(page)
  const searched = apiRequest(page, apiPath, (p) => p.get("search") === PREFIX)
  await page.getByRole("textbox", { name: "Search" }).fill(PREFIX)
  await searched
}

test("configurations: search filters the rows on the server", async ({ page }) => {
  await openFiltered(page, "/configuration", "/api/config")
  await expect(bodyRows(page)).toHaveCount(configNames.length)
  expect(new Set(await names(page))).toEqual(new Set(configNames))
})

test("configurations: clicking Name sorts on the server, descending then ascending", async ({ page }) => {
  await openFiltered(page, "/configuration", "/api/config")
  await expect(bodyRows(page)).toHaveCount(configNames.length)
  const header = page.getByRole("columnheader", { name: "Name" })

  const desc = apiRequest(page, "/api/config", (p) => p.get("sort") === "configuration.name" && p.get("order") === "desc")
  await header.click()
  await desc
  await expect.poll(() => names(page)).toEqual([...configNames].reverse())

  const asc = apiRequest(page, "/api/config", (p) => p.get("sort") === "configuration.name" && p.get("order") === "asc")
  await header.click()
  await asc
  await expect.poll(() => names(page)).toEqual(configNames)
})

test("resources: sorting by date is accepted by the server", async ({ page }) => {
  await openFiltered(page, "/resource", "/api/resource")
  await expect(bodyRows(page)).toHaveCount(resourceTitles.length)
  const response = apiResponse(page, "/api/resource", (p) => p.get("sort") === "resource.createdAt")
  await page.getByRole("columnheader", { name: "Date created" }).click()
  expect((await response).status()).toBe(200)
  await expect(bodyRows(page)).toHaveCount(resourceTitles.length)
})
