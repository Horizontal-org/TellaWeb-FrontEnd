import { Page } from "@playwright/test"
import { apiRequest, authenticated as test, bodyRows, expect, pager, waitForApp } from "./fixtures"
import { TMP_PREFIX } from "./support/api"

// The reports list of a project (/project/[projectId]): server-side sorting, search and pagination
// through GET /report?projectId=. A second project gets a report with the same prefix, which must
// never show up in the first project's list
const PREFIX = `${TMP_PREFIX}prep-${Date.now().toString(36)}-`
const REPORT_COUNT = 27 // one more page than the list's 25 rows per page
const titles = Array.from({ length: REPORT_COUNT }, (_, i) => `${PREFIX}${String(i).padStart(2, "0")}`)
const OTHER_TITLE = `${PREFIX}other`

let projectId: string

test.describe.configure({ mode: "serial" })

test.beforeAll(async ({ adminApi }) => {
  await adminApi.createProject(`${PREFIX}project`)
  await adminApi.createProject(`${PREFIX}other-project`)
  projectId = (await adminApi.findProject(`${PREFIX}project`)).id
  const otherId = (await adminApi.findProject(`${PREFIX}other-project`)).id
  for (const title of titles) await adminApi.createReport(projectId, title)
  await adminApi.createReport(otherId, OTHER_TITLE)
})

test.afterAll(async ({ adminApi }) => {
  await adminApi.removeTmpRecords()
})

const reportsRequest = (page: Page, check: (params: URLSearchParams) => boolean) =>
  apiRequest(page, "/api/report", (p) => p.get("projectId") === projectId && check(p))

const names = async (page: Page) => (await bodyRows(page).locator("td:nth-child(2)").allTextContents()).map((n) => n.trim())

const openProject = async (page: Page) => {
  const firstPage = reportsRequest(page, (p) => p.get("offset") === "0" && p.get("limit") === "25")
  await page.goto(`/project/${projectId}`)
  await waitForApp(page)
  await firstPage
  await expect(bodyRows(page)).toHaveCount(25)
  await expect(pager(page).locator("strong")).toHaveText("1 of 2")
}

const goToSecondPage = async (page: Page) => {
  const secondPage = reportsRequest(page, (p) => p.get("offset") === "25")
  await pager(page).locator("button").last().click()
  await secondPage
  await expect(pager(page).locator("strong")).toHaveText("2 of 2")
}

test("pagination moves between server pages of the project's reports", async ({ page }) => {
  await openProject(page)
  const [prev, next] = [pager(page).locator("button").first(), pager(page).locator("button").last()]
  await expect(prev).toBeDisabled()

  await goToSecondPage(page)
  await expect(bodyRows(page)).toHaveCount(REPORT_COUNT - 25)
  await expect(next).toBeDisabled()

  // Page 1 is still in RTK Query's cache, so going back doesn't always send a request
  await prev.click()
  await expect(pager(page).locator("strong")).toHaveText("1 of 2")
  await expect(bodyRows(page)).toHaveCount(25)
})

test("only the project's own reports are listed", async ({ page }) => {
  await openProject(page)
  await goToSecondPage(page)
  const shown = [...(await names(page))]
  const prev = pager(page).locator("button").first()
  await prev.click()
  await expect(bodyRows(page)).toHaveCount(25)
  shown.push(...(await names(page)))
  expect(shown).not.toContain(OTHER_TITLE)
  expect(new Set(shown)).toEqual(new Set(titles))
})

test("clicking a header sorts on the server, descending then ascending", async ({ page }) => {
  await openProject(page)
  const header = page.getByRole("columnheader", { name: "Name" })

  const desc = reportsRequest(page, (p) => p.get("sort") === "report.title" && p.get("order") === "desc")
  await header.click()
  await desc
  await expect.poll(() => names(page).then((n) => n[0])).toBe(titles[REPORT_COUNT - 1])

  const asc = reportsRequest(page, (p) => p.get("sort") === "report.title" && p.get("order") === "asc")
  await header.click()
  await asc
  await expect.poll(() => names(page).then((n) => n[0])).toBe(titles[0])
})

test("sorting from the second page goes back to the first one", async ({ page }) => {
  await openProject(page)
  await goToSecondPage(page)
  const sorted = reportsRequest(page, (p) => p.get("sort") === "report.title" && p.get("offset") === "0")
  await page.getByRole("columnheader", { name: "Name" }).click()
  await sorted
  await expect(pager(page).locator("strong")).toHaveText("1 of 2")
  await expect(bodyRows(page)).toHaveCount(25)
})

test("a search from the second page goes back to the first one", async ({ page }) => {
  await openProject(page)
  await goToSecondPage(page)
  const searched = reportsRequest(page, (p) => p.get("search") === titles[5] && p.get("offset") === "0")
  await page.getByRole("textbox", { name: "Search" }).fill(titles[5])
  await searched
  await expect(bodyRows(page)).toHaveCount(1)
  await expect(bodyRows(page).first()).toContainText(titles[5])
  await expect(pager(page).locator("strong")).toHaveText("1 of 1")
})
