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

## Screenshot baselines are local only

`e2e/__screenshots__/` is **gitignored**, because the screenshots contain whatever is in your local database (names, emails, file titles). Record the baseline on the code *before* a change with `npm run e2e:update`, then run `npm run e2e` after it. Any visual difference fails the test and shows up in the HTML report. Dev and production builds share the same baselines. Don't change local backend data between recording and comparing, or you'll get false diffs.
