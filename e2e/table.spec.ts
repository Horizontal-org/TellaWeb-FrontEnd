import { Page } from "@playwright/test"
import { authenticated as test, expect, waitForApp } from "./fixtures"
import { TMP_PREFIX } from "./support/api"

// Behaviour of components/Table on the users list: server-side sorting, search, pagination and
// row selection. The test users share a unique prefix and every test searches for it, so the
// results only contain users created here.
const PREFIX = `${TMP_PREFIX}tbl-${Date.now().toString(36)}-`
const USER_COUNT = 27 // one more page than the list's 25 rows per page
const emails = Array.from({ length: USER_COUNT }, (_, i) => `${PREFIX}${String(i).padStart(2, "0")}@tella.local`)

test.describe.configure({ mode: "serial" })

test.beforeAll(async ({ adminApi }) => {
  for (const email of emails) await adminApi.createUser(email, "viewer")
})

test.afterAll(async ({ adminApi }) => {
  await adminApi.removeTmpRecords()
})

const usersRequest = (page: Page, check: (params: URLSearchParams) => boolean) =>
  page.waitForRequest((req) => {
    const url = new URL(req.url())
    return url.pathname.endsWith("/api/user/list") && check(url.searchParams)
  })

// Opens the users list filtered to this spec's users
const openFiltered = async (page: Page) => {
  await page.goto("/user")
  await waitForApp(page)
  const searched = usersRequest(page, (p) => p.get("search") === PREFIX)
  await page.getByRole("textbox", { name: "Search" }).fill(PREFIX)
  await searched
  await expect(bodyRows(page).first()).toContainText(PREFIX)
}

const bodyRows = (page: Page) => page.locator("tbody tr")
const names = async (page: Page) => (await bodyRows(page).locator("td:nth-child(2)").allTextContents()).map((n) => n.trim())

// Paginator: [<] "N of M" [>], the label is a <strong> inside the middle box
const pager = (page: Page) => page.locator("strong", { hasText: / of / }).locator("xpath=../..")

test("search filters the rows on the server", async ({ page }) => {
  await openFiltered(page)
  const shown = await names(page)
  expect(shown.length).toBeGreaterThan(0)
  for (const name of shown) expect(name.startsWith(PREFIX)).toBe(true)
})

test("pagination moves between server pages", async ({ page }) => {
  await openFiltered(page)
  await expect(bodyRows(page)).toHaveCount(25)
  await expect(pager(page).locator("strong")).toHaveText("1 of 2")

  const [prev, next] = [pager(page).locator("button").first(), pager(page).locator("button").last()]
  await expect(prev).toBeDisabled()
  const secondPage = usersRequest(page, (p) => p.get("offset") === "25" && p.get("search") === PREFIX)
  await next.click()
  await secondPage
  await expect(pager(page).locator("strong")).toHaveText("2 of 2")
  await expect(bodyRows(page)).toHaveCount(USER_COUNT - 25)
  await expect(next).toBeDisabled()

  const firstPage = usersRequest(page, (p) => p.get("offset") === "0")
  await prev.click()
  await firstPage
  await expect(pager(page).locator("strong")).toHaveText("1 of 2")
  await expect(bodyRows(page)).toHaveCount(25)
})

test("clicking a header sorts on the server, descending then ascending", async ({ page }) => {
  await openFiltered(page)
  const header = page.getByRole("columnheader", { name: "Name" })

  const desc = usersRequest(page, (p) => p.get("sort") === "user.username" && p.get("order") === "desc")
  await header.click()
  await desc
  await expect(header.locator("svg")).toHaveCount(1)
  await expect.poll(() => names(page).then((n) => n[0])).toBe(emails[USER_COUNT - 1])

  const asc = usersRequest(page, (p) => p.get("sort") === "user.username" && p.get("order") === "asc")
  await header.click()
  await asc
  await expect.poll(() => names(page).then((n) => n[0])).toBe(emails[0])
})

test("rows can be selected one by one or all at once", async ({ page }) => {
  await openFiltered(page)
  const first = bodyRows(page).first()
  const rowCheckboxes = page.locator("tbody").getByRole("checkbox")

  // Clicking a row selects it: its checkbox appears and the toolbar offers "Open"
  await first.locator("td").nth(1).click()
  await expect(first.getByRole("checkbox")).toBeChecked()
  // Move off the row so only the toolbar's "Open" is shown (hovered rows have their own)
  await page.getByRole("heading", { level: 1 }).hover()
  await expect(page.getByRole("button", { name: "Open", exact: true })).toBeVisible()
  await first.locator("td").nth(1).click()
  await expect(rowCheckboxes).toHaveCount(0)

  // The header checkbox selects every row on the page
  const all = page.getByRole("checkbox", { name: "Toggle All Rows Selected" })
  await all.check()
  await expect(rowCheckboxes).toHaveCount(await bodyRows(page).count())
  await all.uncheck()
  await expect(rowCheckboxes).toHaveCount(0)
})
