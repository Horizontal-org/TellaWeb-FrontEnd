# E2E tests (Playwright)

A smoke and behaviour suite: the main screens load, don't throw and look the same, and the main flows (CRUD, roles, sessions, 2FA, error toasts) work. It was written for the Next.js and Tailwind upgrades.

## Fresh clone checklist

1. **Backend running on `:3001`**, migrated, with its file storage available. Resource upload and download need it. See `TellaWeb-backend`: `docker-compose up db redis`, `npm run typeorm:run`, `npm run start:dev`.
2. **An admin user without 2FA** for the tests:
   ```bash
   # in TellaWeb-backend
   npm run console:dev -- users create e2e-admin@tella.local -a   # prompts for the password
   ```
3. **Credentials** in `.env.e2e.local` at the frontend repo root (gitignored):
   ```
   E2E_USER=e2e-admin@tella.local
   E2E_PASS=...
   ```
4. **Dependencies and browser:** `npm ci` and `npx playwright install chromium`.
5. **First run:** `npm run e2e`. With no `e2e/__screenshots__/` folder yet, this run **records the screenshot baselines** and passes ("No screenshot baselines … this run records them"). Do the first run on code you know is good, because those screenshots become the reference.
6. **Later runs** compare against those baselines. Re-record on purpose with `npm run e2e:update`.

You don't need `.env.development`: the Playwright config passes the API env vars to the server it starts.

### What to expect on an empty database

The write, roles, session, 2FA and error tests create their own data, so they pass on an empty database. "e2e configuration" is created automatically. Tests for pages that need existing records **skip** until that data exists:

| Needs | Skipped tests |
|---|---|
| A project | project detail, users, resources and settings pages |
| A report | report page |
| Reports with an image, video or audio file | the media viewer tests (reports only come in through the mobile app) |
| A PDF resource | the resource PDF viewer test |

## Running

```bash
npm run e2e                                  # starts `next dev -p 3100` unless something is already serving it
npm run e2e:prod                             # same suite against `next build && next start -p 3101`
npm run e2e -- e2e/auth.spec.ts              # one file
npm run e2e -- -g "report page"              # by test name
npm run e2e:update                           # re-record screenshot baselines
npx playwright show-report                   # HTML report with screenshot diffs
E2E_BASE_URL=http://localhost:3200 npm run e2e  # against an already running server, e.g. the Docker image (see CLAUDE.md)
```

`global-setup.ts` logs in through the `/api` rewrite, saves the session to `e2e/.auth/`, and picks existing records for the detail pages: the first project and report, reports with an image, video or audio file, and a PDF resource. If there's no remote configuration it creates one called "e2e configuration". Specs skip themselves when the local backend has no matching record. Today the audio spec skips, because there are no audio files locally.

## What the suite covers

| Spec | Covers | Screenshots |
|---|---|---|
| `auth.spec.ts` | redirect to `/login`, login, logout, `/verify`, Spanish login | login page |
| `pages.spec.ts` | every main screen loads without errors | yes, one per screen |
| `report-media.spec.ts` | image, video, audio viewers; resource PDF | no |
| `projects.spec.ts` | create, rename, delete a project | no |
| `users.spec.ts` | create a user, change role, delete; duplicate-email error | no |
| `configurations.spec.ts` | create and delete a remote configuration | no |
| `resources.spec.ts` | upload a PDF, download it, delete it | no |
| `roles.spec.ts` | what viewer, editor and admin can see and open; reporters can't log in | no |
| `session.spec.ts` | expired access token is refreshed; invalid refresh → `/login`; 2FA login (wrong and right code) | no |
| `errors.spec.ts` | error toasts with the backend's message; an error without a body doesn't crash the page (mocked responses) | no |

Every test fails if the page throws an uncaught error (`pageErrors` fixture in `fixtures.ts`).

### Tests that write data

The write tests create real records in your local backend, always named `e2e-tmp-…` (users, projects, configurations, resources). They remove them when the run ends (`adminApi` fixture), and `global-setup.ts` removes leftovers from a run that crashed. So the screenshot baselines aren't affected.

Helpers for these tests are in `support/api.ts`: an admin API client, `uniqueName()` / `uniqueEmail()`, `sessionState()` to open a browser already logged in as any user, and `totp()` to compute 2FA codes.

### Toasts

Use `expectToast(page, text)` after an action. It waits for the toast to appear **and to go away**: `ToastWrapper` doesn't cancel the previous toast's 5 s timer, so a toast shown right after another can disappear early.

## Screenshot baselines are local only

`e2e/__screenshots__/` is **gitignored**, because the screenshots contain whatever is in your local database (names, emails, file titles). Record the baseline on the code *before* a change with `npm run e2e:update`, then run `npm run e2e` after it. Any visual difference fails the test and shows up in the HTML report. Dev and production builds share the same baselines. Don't change local backend data between recording and comparing, or you'll get false diffs.
