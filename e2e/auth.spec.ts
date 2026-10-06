import { test, expect } from "./fixtures"

test("signed-out users are redirected to /login", async ({ page }) => {
  await page.goto("/project")
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByPlaceholder("Email")).toBeVisible()
})

test("login page renders", async ({ page }) => {
  await page.goto("/login")
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible()
  await expect(page).toHaveScreenshot("login.png", { fullPage: true })
})

test("login page is translated to Spanish", async ({ page }) => {
  await page.goto("/es/login")
  await expect(page.getByRole("button", { name: "Ingresar" })).toBeVisible()
})

test("/verify is public", async ({ page }) => {
  await page.goto("/verify")
  await expect(page).toHaveURL(/\/verify/)
})

test("login with email and password lands on projects", async ({ page }) => {
  await page.goto("/login")
  await page.getByPlaceholder("Email").fill(process.env.E2E_USER)
  await page.getByPlaceholder("Password").fill(process.env.E2E_PASS)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page).toHaveURL(/\/project$/)
  expect(await page.evaluate(() => localStorage.getItem("access_token"))).toBeTruthy()
})

// Logs in on its own because logout revokes the token on the backend
test("logout clears the session", async ({ page }) => {
  await page.goto("/login")
  await page.getByPlaceholder("Email").fill(process.env.E2E_USER)
  await page.getByPlaceholder("Password").fill(process.env.E2E_PASS)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page).toHaveURL(/\/project$/)

  await page.goto("/logout")
  await expect(page.getByText("Good bye")).toBeVisible()
  await expect(page).toHaveScreenshot("logout.png", { fullPage: true })
  await page.getByRole("button", { name: "Back to login" }).click()
  await page.goto("/project")
  await expect(page).toHaveURL(/\/login$/)
  expect(await page.evaluate(() => localStorage.getItem("access_token"))).toBeNull()
})
