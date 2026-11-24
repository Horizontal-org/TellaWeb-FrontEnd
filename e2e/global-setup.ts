import { request, FullConfig } from "@playwright/test"
import { AdminApi } from "./support/api"
import fs from "fs"
import path from "path"

export const AUTH_FILE = path.join(__dirname, ".auth", "admin.json")
export const DATA_FILE = path.join(__dirname, ".auth", "data.json")

export type ReportFile = { reportId: string; fileIndex: number; fileName: string }

export type E2EData = {
  projectId?: string
  reportId?: string
  image?: ReportFile
  video?: ReportFile
  audio?: ReportFile
  pdfResource?: string
  configurationId?: string
}

// Logs in through the Next /api rewrite, saves the session as storage state and
// picks existing records from the local backend for the detail-page specs
export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL
  const { E2E_USER, E2E_PASS } = process.env
  if (!E2E_USER || !E2E_PASS) {
    throw new Error("Set E2E_USER and E2E_PASS (see e2e/README.md)")
  }

  // Remove records left behind by a previous run that crashed before cleaning up
  const adminApi = await AdminApi.login(baseURL)
  await adminApi.removeTmpRecords()
  await adminApi.dispose()

  const api = await request.newContext({ baseURL })
  const login = await api.post("/api/login/web", {
    data: { username: E2E_USER, password: E2E_PASS },
  })
  if (!login.ok()) {
    throw new Error(`Login failed (${login.status()}): is the backend running on :3001?`)
  }
  const { access_token, refresh_token, user } = await login.json()
  if (user?.otp_active) {
    throw new Error("The e2e user has 2FA enabled, use a user without it")
  }

  const headers = { authorization: `Bearer ${access_token}` }
  const list = async (resource: string, limit = 50) => {
    const res = await api.get(`/api/${resource}/`, { headers, params: { limit, offset: 0 } })
    return res.ok() ? (await res.json()).results ?? [] : []
  }

  let [projects, reports, configurations] = await Promise.all([
    list("project"),
    list("report"),
    list("config"),
  ])

  // Remote configurations are cheap to create, so make one if the local backend has none
  if (configurations.length === 0) {
    await api.post("/api/config/", {
      headers,
      data: {
        name: "e2e configuration",
        camouflage: JSON.stringify({ visible: true, calculator: true, change_name: true }),
        crashReports: JSON.stringify({ visible: true, enabled: true }),
        serversVisible: true,
      },
    })
    configurations = await list("config")
  }
  const resources = await list("resource")

  const withFileType = (type: string) => {
    for (const report of reports) {
      const fileIndex = (report.files ?? []).findIndex((file) => file.type === type)
      if (fileIndex >= 0) return { reportId: report.id, fileIndex, fileName: report.files[fileIndex].fileName }
    }
  }

  const data: E2EData = {
    projectId: projects[0]?.id,
    reportId: reports[0]?.id,
    image: withFileType("IMAGE"),
    video: withFileType("VIDEO"),
    audio: withFileType("AUDIO"),
    pdfResource: resources.find((resource) => resource.fileName?.toLowerCase().endsWith(".pdf"))?.fileName,
    configurationId: configurations[0]?.id,
  }

  const origin = new URL(baseURL).origin
  const storageState = {
    cookies: [
      {
        name: "access_token",
        value: access_token,
        domain: new URL(baseURL).hostname,
        path: "/",
        expires: -1,
        httpOnly: false,
        secure: false,
        sameSite: "Lax" as const,
      },
    ],
    origins: [
      {
        origin,
        localStorage: [
          { name: "access_token", value: access_token },
          { name: "refresh_token", value: refresh_token },
        ],
      },
    ],
  }

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true })
  fs.writeFileSync(AUTH_FILE, JSON.stringify(storageState, null, 2))
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  await api.dispose()
}
