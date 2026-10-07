import { APIRequestContext, request } from "@playwright/test"
import crypto from "crypto"

// Records created by tests use this prefix so leftovers from crashed runs can be found and removed
export const TMP_PREFIX = "e2e-tmp-"
export const TMP_PASSWORD = "E2e-Tmp-Pass-123!"

export const uniqueName = (label: string) => `${TMP_PREFIX}${label}-${Date.now().toString(36)}`
export const uniqueEmail = (label: string) => `${uniqueName(label)}@tella.local`

export type Tokens = { access_token: string; refresh_token: string; user: { id: string; otp_active?: boolean } }

// Admin client for the backend, going through the Next /api rewrite like the app does
export class AdminApi {
  private constructor(private ctx: APIRequestContext, private token: string) {}

  static async login(baseURL: string) {
    const ctx = await request.newContext({ baseURL })
    const tokens = await loginWeb(ctx, process.env.E2E_USER, process.env.E2E_PASS)
    return new AdminApi(ctx, tokens.access_token)
  }

  private get headers() {
    return { authorization: `Bearer ${this.token}` }
  }

  async get(url: string, params?: Record<string, string | number>) {
    const res = await this.ctx.get(`/api${url}`, { headers: this.headers, params })
    if (!res.ok()) throw new Error(`GET ${url}: ${res.status()}`)
    return res.json()
  }

  async post(url: string, data: unknown) {
    const res = await this.ctx.post(`/api${url}`, { headers: this.headers, data })
    if (!res.ok()) throw new Error(`POST ${url}: ${res.status()} ${await res.text()}`)
    return res.json()
  }

  async delete(url: string) {
    const res = await this.ctx.delete(`/api${url}`, { headers: this.headers })
    if (!res.ok() && res.status() !== 404) throw new Error(`DELETE ${url}: ${res.status()}`)
  }

  createUser(username: string, role: string, password = TMP_PASSWORD) {
    return this.post("/user/", { username, password, role })
  }

  createProject(name: string) {
    return this.post("/project/", { name })
  }

  async findUser(username: string) {
    const { results } = await this.get("/user/list", { limit: 50, offset: 0, search: username })
    return results.find((user) => user.username === username)
  }

  async findProject(name: string) {
    const { results } = await this.get("/project/", { limit: 50, offset: 0, search: name })
    return results.find((project) => project.name === name)
  }

  async findConfiguration(name: string) {
    const { results } = await this.get("/config/", { limit: 50, offset: 0, search: name })
    return results.find((config) => config.name === name)
  }

  async findResource(title: string) {
    const { results } = await this.get("/resource/", { limit: 50, offset: 0, search: title })
    return results.find((resource) => resource.title === title)
  }

  // Deletes every record whose name starts with TMP_PREFIX
  async removeTmpRecords() {
    const search = { limit: 100, offset: 0, search: TMP_PREFIX }
    const byPrefix = (field: string) => (item) => String(item[field] ?? "").startsWith(TMP_PREFIX)
    const [users, projects, configs, resources] = await Promise.all([
      this.get("/user/list", search),
      this.get("/project/", search),
      this.get("/config/", search),
      this.get("/resource/", search),
    ])
    for (const user of users.results.filter(byPrefix("username"))) await this.delete(`/user/${user.id}`)
    for (const project of projects.results.filter(byPrefix("name"))) await this.delete(`/project/${project.id}`)
    for (const config of configs.results.filter(byPrefix("name"))) await this.delete(`/config/${config.id}`)
    for (const resource of resources.results.filter(byPrefix("title"))) await this.delete(`/resource/${resource.id}`)
  }

  dispose() {
    return this.ctx.dispose()
  }
}

export const loginWeb = async (ctx: APIRequestContext, username: string, password: string): Promise<Tokens> => {
  const res = await ctx.post("/api/login/web", { data: { username, password } })
  if (!res.ok()) throw new Error(`Login as ${username} failed: ${res.status()}`)
  return res.json()
}

// Storage state that makes the app consider the browser logged in with these tokens
export const sessionState = (baseURL: string, access_token: string, refresh_token: string) => ({
  cookies: [],
  origins: [
    {
      origin: new URL(baseURL).origin,
      localStorage: [
        { name: "access_token", value: access_token },
        { name: "refresh_token", value: refresh_token },
      ],
    },
  ],
})

// RFC 6238 TOTP (SHA-1, 30 s, 6 digits), the format the backend's otpauth:// URLs use
export const totp = (base32Secret: string, at = Date.now()) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  const bits = base32Secret
    .replace(/=+$/, "")
    .toUpperCase()
    .split("")
    .map((char) => alphabet.indexOf(char).toString(2).padStart(5, "0"))
    .join("")
  const key = Buffer.from(bits.match(/.{8}/g).map((byte) => parseInt(byte, 2)))
  const counter = Buffer.alloc(8)
  counter.writeBigUInt64BE(BigInt(Math.floor(at / 1000 / 30)))
  const hmac = crypto.createHmac("sha1", key).update(counter).digest()
  const offset = hmac[hmac.length - 1] & 0xf
  return String((hmac.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).padStart(6, "0")
}
