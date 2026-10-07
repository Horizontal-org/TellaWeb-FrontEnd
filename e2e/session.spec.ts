import { Page, request } from "@playwright/test"
import { test, expect, waitForApp } from "./fixtures"
import { TMP_PASSWORD, loginWeb, sessionState, totp, uniqueEmail } from "./support/api"

const NOT_A_TOKEN = "not-a-valid-token"

const storage = (page: Page, key: string) => page.evaluate((k) => localStorage.getItem(k), key)

// The passcode screen has one input per digit (components/OtpInput.tsx); fill each one
const enterCode = async (page: Page, code: string) => {
  for (let i = 0; i < code.length; i++) await page.locator(`.otp-input-${i}`).fill(code[i])
  await expect(page.locator(".otp-input-5")).toHaveValue(code[5])
}

test.describe("token refresh", () => {
  test("an expired access token is refreshed and the user stays logged in", async ({ browser, baseURL, adminApi }) => {
    const email = uniqueEmail("refresh")
    await adminApi.createUser(email, "viewer")
    const api = await request.newContext({ baseURL })
    const { refresh_token } = await loginWeb(api, email, TMP_PASSWORD)
    await api.dispose()

    // The backend rejects the access token with a 401, so baseQueryWithRefresh calls /auth/refresh
    const context = await browser.newContext({ storageState: sessionState(baseURL, NOT_A_TOKEN, refresh_token) })
    const page = await context.newPage()
    try {
      const refreshed = page.waitForResponse((res) => res.url().endsWith("/api/auth/refresh") && res.ok())
      await page.goto("/project")
      await refreshed
      await waitForApp(page)
      await expect(page.getByRole("list").getByRole("button", { name: "Projects", exact: true })).toBeVisible()
      await expect.poll(() => storage(page, "access_token")).not.toBe(NOT_A_TOKEN)
    } finally {
      await context.close()
    }
  })

  test("when the refresh token is invalid too, the user goes to /login", async ({ browser, baseURL }) => {
    const context = await browser.newContext({ storageState: sessionState(baseURL, NOT_A_TOKEN, NOT_A_TOKEN) })
    const page = await context.newPage()
    try {
      await page.goto("/project")
      await expect(page).toHaveURL(/\/login$/)
      await expect.poll(() => storage(page, "access_token")).toBeNull()
      await expect.poll(() => storage(page, "refresh_token")).toBeNull()
    } finally {
      await context.close()
    }
  })
})

test.describe("two-factor authentication", () => {
  // Waits out the end of a 30 s TOTP window so the code doesn't expire while the test types it
  const freshTotp = async (secret: string) => {
    const secondsLeft = 30 - (Math.floor(Date.now() / 1000) % 30)
    if (secondsLeft < 8) await new Promise((resolve) => setTimeout(resolve, secondsLeft * 1000 + 500))
    return totp(secret)
  }

  test("a user with 2FA logs in with a one-time code", async ({ page, baseURL, adminApi }) => {
    const email = uniqueEmail("otp")
    await adminApi.createUser(email, "viewer")

    // Enable 2FA for the user through the API, like the settings page does
    const api = await request.newContext({ baseURL })
    const { access_token } = await loginWeb(api, email, TMP_PASSWORD)
    const headers = { authorization: `Bearer ${access_token}` }
    const enable = await (await api.post("/api/auth/otp/enable", { headers, data: { password: TMP_PASSWORD } })).json()
    const secret = new URL(enable.otp_url).searchParams.get("secret")
    const activate = await api.post("/api/auth/otp/activate", { headers, data: { code: totp(secret) } })
    expect(activate.ok(), "2FA activated").toBe(true)
    await api.dispose()

    await page.goto("/login")
    await page.getByPlaceholder("Email").fill(email)
    await page.getByPlaceholder("Password").fill(TMP_PASSWORD)
    await page.getByRole("button", { name: "Sign in" }).click()

    // Second step: the one-time passcode screen
    await expect(page.getByText("One-time passcode")).toBeVisible()
    const logIn = page.getByRole("button", { name: "LOG IN" })

    // A wrong code is rejected with an error
    const correct = await freshTotp(secret)
    const wrong = String((Number(correct) + 1) % 1_000_000).padStart(6, "0")
    await enterCode(page, wrong)
    await logIn.click()
    await expect(page.getByRole("alert").filter({ hasText: /\S/ })).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)

    // The right code logs in
    await enterCode(page, await freshTotp(secret))
    await logIn.click()
    await expect(page).toHaveURL(/\/project$/)
    await expect.poll(() => storage(page, "access_token")).toBeTruthy()
  })
})
