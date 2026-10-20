import { Browser, Page, request } from "@playwright/test"
import { test, expect, waitForApp } from "./fixtures"
import { TMP_PASSWORD, loginWeb, sessionState, uniqueEmail } from "./support/api"

const MENU = ["Projects", "Users", "Resources", "Admin Center", "Settings", "Help", "Logout"]

// Opens a browser session logged in as a new user with this role
const openAs = async (browser: Browser, baseURL: string, adminApi, role: string) => {
  const email = uniqueEmail(role)
  await adminApi.createUser(email, role)
  const api = await request.newContext({ baseURL })
  const tokens = await loginWeb(api, email, TMP_PASSWORD)
  await api.dispose()
  const context = await browser.newContext({ storageState: sessionState(baseURL, tokens.access_token, tokens.refresh_token) })
  const page = await context.newPage()
  const errors: Error[] = []
  page.on("pageerror", (error) => errors.push(error))
  return { page, errors, close: () => context.close() }
}

const menuButton = (page: Page, name: string) => page.getByRole("list").getByRole("button", { name, exact: true })

const expectMenu = async (page: Page, visible: string[]) => {
  for (const item of MENU) {
    await expect(menuButton(page, item), `menu item "${item}"`).toHaveCount(visible.includes(item) ? 1 : 0)
  }
}

const expectBlocked = async (page: Page, path: string) => {
  await page.goto(path)
  await expect(page, `${path} is blocked`).toHaveURL(/\/404$/)
}

test("a viewer can read projects but not manage anything", async ({ browser, baseURL, adminApi }) => {
  const session = await openAs(browser, baseURL, adminApi, "viewer")
  const { page } = session
  try {
    await page.goto("/project")
    await waitForApp(page)
    await expectMenu(page, ["Projects", "Settings", "Help", "Logout"])
    await expect(page.getByRole("button", { name: "NEW", exact: true })).toHaveCount(0)

    await expectBlocked(page, "/user")
    await expectBlocked(page, "/resource")
    await expectBlocked(page, "/admin-center")
    expect(session.errors).toEqual([])
  } finally {
    await session.close()
  }
})

test("an editor can create projects but not manage users, resources or settings", async ({ browser, baseURL, adminApi }) => {
  const session = await openAs(browser, baseURL, adminApi, "editor")
  const { page } = session
  try {
    await page.goto("/project")
    await waitForApp(page)
    await expectMenu(page, ["Projects", "Settings", "Help", "Logout"])
    await expect(page.getByRole("button", { name: "NEW", exact: true })).toBeVisible()

    await expectBlocked(page, "/user")
    await expectBlocked(page, "/resource")
    await expectBlocked(page, "/admin-center")
    expect(session.errors).toEqual([])
  } finally {
    await session.close()
  }
})

test("an admin sees every menu item", async ({ browser, baseURL, adminApi }) => {
  const session = await openAs(browser, baseURL, adminApi, "admin")
  const { page } = session
  try {
    await page.goto("/project")
    await waitForApp(page)
    await expectMenu(page, MENU)
    expect(session.errors).toEqual([])
  } finally {
    await session.close()
  }
})

test("a reporter can't log into the web app", async ({ page, adminApi }) => {
  const email = uniqueEmail("reporter")
  await adminApi.createUser(email, "reporter")

  await page.goto("/login")
  await page.getByPlaceholder("Email").fill(email)
  await page.getByPlaceholder("Password").fill(TMP_PASSWORD)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page.getByText("Invalid password or username.")).toBeVisible()
  await expect(page).toHaveURL(/\/login$/)
  expect(await page.evaluate(() => localStorage.getItem("access_token"))).toBeNull()
})
