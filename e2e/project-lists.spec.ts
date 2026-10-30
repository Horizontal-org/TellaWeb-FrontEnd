import { Page } from "@playwright/test"
import { apiRequest, apiResponse, authenticated as test, bodyRows, expect, pager, waitForApp } from "./fixtures"
import { TMP_PREFIX } from "./support/api"
import { tinyPdf } from "./support/files"

// The users and resources lists of a project (/project/[projectId]/users and /resources): server-side
// sorting and pagination through GET /user/list?projectId= and GET /resource?projectId=. A second
// project gets a user and a resource with the same prefix, which must never show up in the first
// project's lists
const PREFIX = `${TMP_PREFIX}plst-${Date.now().toString(36)}-`
const COUNT = 27 // one more page than the lists' 25 rows per page
const padded = (i: number) => String(i).padStart(2, "0")
const userNames = Array.from({ length: COUNT }, (_, i) => `${PREFIX}${padded(i)}@tella.local`)
const resourceTitles = Array.from({ length: COUNT }, (_, i) => `${PREFIX}${padded(i)}`)
const OTHER_USER = `${PREFIX}other@tella.local`
const OTHER_RESOURCE = `${PREFIX}other`

let projectId: string
// Admins belong to every project, so the users list has them on top of the ones added here
let projectUserCount: number

test.describe.configure({ mode: "serial" })

test.beforeAll(async ({ adminApi }) => {
  test.setTimeout(120_000)
  await adminApi.createProject(`${PREFIX}project`)
  await adminApi.createProject(`${PREFIX}other-project`)
  projectId = (await adminApi.findProject(`${PREFIX}project`)).id
  const otherId = (await adminApi.findProject(`${PREFIX}other-project`)).id

  for (const name of [...userNames, OTHER_USER]) await adminApi.createUser(name, "viewer")
  for (const title of [...resourceTitles, OTHER_RESOURCE]) await adminApi.uploadResource(`${title}.pdf`, tinyPdf())

  const userIds = await Promise.all(userNames.map(async (name) => (await adminApi.findUser(name)).id))
  const resourceIds = await Promise.all(resourceTitles.map(async (title) => (await adminApi.findResource(title)).id))
  await adminApi.toggleInProject(projectId, { users: userIds, resources: resourceIds })
  await adminApi.toggleInProject(otherId, {
    users: [(await adminApi.findUser(OTHER_USER)).id],
    resources: [(await adminApi.findResource(OTHER_RESOURCE)).id],
  })

  projectUserCount = (await adminApi.getProject(projectId)).users.length
})

test.afterAll(async ({ adminApi }) => {
  await adminApi.removeTmpRecords()
})

const names = async (page: Page) => (await bodyRows(page).locator("td:nth-child(2)").allTextContents()).map((n) => n.trim())

const lists = [
  {
    name: "users",
    path: "/api/user/list",
    header: "Name",
    sortKey: "user.username",
    own: userNames,
    other: OTHER_USER,
    total: () => projectUserCount,
  },
  {
    name: "resources",
    path: "/api/resource",
    header: "Title",
    sortKey: "resource.title",
    own: resourceTitles,
    other: OTHER_RESOURCE,
    total: () => COUNT,
  },
]

for (const list of lists) {
  test.describe(`project ${list.name}`, () => {
    const listRequest = (page: Page, check: (params: URLSearchParams) => boolean) =>
      apiRequest(page, list.path, (p) => p.get("projectId") === projectId && check(p))

    const pageCount = () => Math.ceil(list.total() / 25)

    const open = async (page: Page) => {
      const firstPage = listRequest(page, (p) => p.get("offset") === "0" && p.get("limit") === "25")
      await page.goto(`/project/${projectId}/${list.name}`)
      await waitForApp(page)
      await firstPage
      await expect(bodyRows(page)).toHaveCount(25)
      await expect(pager(page).locator("strong")).toHaveText(`1 of ${pageCount()}`)
    }

    test("pagination goes through the project's rows only", async ({ page }) => {
      await open(page)
      const next = pager(page).locator("button").last()
      const shown = [...(await names(page))]
      for (let i = 1; i < pageCount(); i++) {
        const nextPage = listRequest(page, (p) => p.get("offset") === String(i * 25))
        await next.click()
        await nextPage
        await expect(pager(page).locator("strong")).toHaveText(`${i + 1} of ${pageCount()}`)
        await expect(bodyRows(page)).toHaveCount(Math.min(25, list.total() - i * 25))
        shown.push(...(await names(page)))
      }
      await expect(next).toBeDisabled()

      expect(shown).toHaveLength(list.total())
      expect(shown).not.toContain(list.other)
      for (const own of list.own) expect(shown).toContain(own)
    })

    test("clicking a header sorts on the server, descending then ascending", async ({ page }) => {
      await open(page)
      const header = page.getByRole("columnheader", { name: list.header })
      // Only this spec's rows are compared: the users list also has the instance's admins
      const ownShown = async () => (await names(page)).filter((n) => n.startsWith(PREFIX))

      const desc = listRequest(page, (p) => p.get("sort") === list.sortKey && p.get("order") === "desc")
      await header.click()
      await desc
      await expect.poll(async () => (await ownShown())[0]).toBe(list.own[COUNT - 1])
      const descending = await ownShown()
      expect(descending).toEqual([...descending].sort().reverse())

      const asc = listRequest(page, (p) => p.get("sort") === list.sortKey && p.get("order") === "asc")
      await header.click()
      await asc
      await expect.poll(async () => (await ownShown())[0]).toBe(list.own[0])
      const ascending = await ownShown()
      expect(ascending).toEqual([...ascending].sort())
    })

    test("sorting from the second page goes back to the first one", async ({ page }) => {
      await open(page)
      const secondPage = listRequest(page, (p) => p.get("offset") === "25")
      await pager(page).locator("button").last().click()
      await secondPage
      await expect(pager(page).locator("strong")).toHaveText(`2 of ${pageCount()}`)

      const sorted = listRequest(page, (p) => p.get("sort") === list.sortKey && p.get("offset") === "0")
      await page.getByRole("columnheader", { name: list.header }).click()
      await sorted
      await expect(pager(page).locator("strong")).toHaveText(`1 of ${pageCount()}`)
      await expect(bodyRows(page)).toHaveCount(25)
    })
  })
}

test("sorting the project's resources by date is accepted by the server", async ({ page }) => {
  await page.goto(`/project/${projectId}/resources`)
  await waitForApp(page)
  await expect(bodyRows(page)).toHaveCount(25)
  const response = apiResponse(page, "/api/resource", (p) => p.get("sort") === "resource.createdAt")
  await page.getByRole("columnheader", { name: "Date created" }).click()
  expect((await response).status()).toBe(200)
})
