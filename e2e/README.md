# E2E smoke tests (Playwright)

A smoke suite that checks the main screens load, don't throw, and look the same. It was written for the Next.js and Tailwind upgrades.

## Setup

1. Run the backend locally on `:3001` (see `TellaWeb-backend`: `docker-compose up db redis`, then `npm run start:dev`).
2. Create an admin user **without 2FA** in the backend:
   ```bash
   npm run console:dev -- users create e2e-admin@tella.local -a   # prompts for the password
   ```
3. Put the credentials in `.env.e2e.local` at the repo root (gitignored):
   ```
   E2E_USER=e2e-admin@tella.local
   E2E_PASS=...
   ```
4. `npx playwright install chromium`

## Running

```bash
npm run e2e                                  # starts `next dev -p 3100` unless something is already serving it
npm run e2e:prod                             # same suite against `next build && next start -p 3101`
npm run e2e -- e2e/auth.spec.ts              # one file
npm run e2e -- -g "report page"              # by test name
npm run e2e:update                           # re-record screenshot baselines
npx playwright show-report                   # HTML report with screenshot diffs
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
