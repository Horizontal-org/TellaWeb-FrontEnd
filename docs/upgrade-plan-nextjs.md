# Upgrade plan: Next.js 12.2.5 → 16.x

**Goal:** get Next.js onto a supported, patched version without changing how the app behaves.
**Out of scope:** moving to the App Router, redesigning the UI, and the Tailwind upgrade (see `upgrade-plan-tailwind.md`, a separate PR).

**Status (2026-10-06):** Milestone A is done. Milestone B is done through Next 15 + ESLint 9. **Next 16 is installed but not checked or committed.**

## Decisions

- **One branch (`upgrade/nextjs`), one commit per step and per Next major version.** It goes to beta only **twice**: drop #1 after Milestone A (Next still on 12), and drop #2 on Next 16. Versions 13–15 are only checked locally.
- **A maintainer does every tag and deploy.** The upgrade work stops at each beta checkpoint and hands off.
- **Verification is the Playwright suite** in `e2e/`, run in dev mode (`npm run e2e`) and against a production build (`npm run e2e:prod`). Screenshot baselines stay local only (they capture local backend data).
- **Chromatic is removed.** Storybook gets upgraded after Next 16 (Milestone C).
- **Packages the upgrade requires get upgraded along with it.** Packages that are only outdated stay out of scope: React 19, RTK 2 / react-redux 9, CASL 7, date-fns 4, styled-components 6, react-leaflet 5, react-icons 5, qrcode.react 4, react-to-print 3, protobufjs 8, @fontsource 5. Each of these becomes a follow-up ticket.
- **Lint scope stays where `next lint` had it** (`pages/`, `components/`) unless decided otherwise (see "Open decisions").

## Done

### Milestone A: safety net and prep (Next 12) → beta drop #1 from `e09fb53`

| Commit | Change |
|---|---|
| `189c84e` | CLAUDE.md and the upgrade plans |
| `730f4e8` | TypeScript 4.4 → 5.9, @types bumps, `typecheck` script. **Baseline: 22 app-code errors** |
| `5badd56` | Playwright smoke suite |
| `42023d4` | Babel → SWC, `next/dist/client/router` → `next/router`, removed the stray `import { on } from "cluster"` (→ 21 errors) |
| `d926f4d` | Node 22 (Dockerfile, `.nvmrc`) |
| `1fcc1e0` | Removed Chromatic, 10 unused packages and `yarn.lock` |
| `81357d1` | **Bug fix:** `backupsApi` middleware wasn't registered in the store (RTK 1.9 throws in dev) |
| `ac02bf5` | Minor/patch updates (next 12.3.7, react 18.3.1, RTK 1.9.7, axios 1.20). `@divviup/dap` 0.9.1 needs the root import |
| `e09fb53` | Progress notes. **← tag beta drop #1 here** |

### Milestone B: Next 13 → 16 (in progress)

| Commit | Change |
|---|---|
| `7cff015` | e2e: production-build mode (`e2e:prod`, port 3101). Global setup creates an "e2e configuration" if none exists. Audio and resource PDF specs. Logout spec checks the end state |
| `5ec2d5e` | **Next 13.5:** `next/image` moved to the new API (numeric sizes; `ImageView` uses `fill` + `objectFit` style + `onLoad`), `images.domains` → `remotePatterns` |
| `b038880` | **Next 14.2** |
| `49ff4e1` | **Next 15.5**, next-i18next 16 (imports moved to `next-i18next/pages`) with i18next 26 and react-i18next 17, tsconfig `moduleResolution: "bundler"`, `outputFileTracingRoot` pinned |
| `40f19d0` | ESLint 9 with flat config (`eslint.config.mjs` via FlatCompat), `lint` = `eslint pages components` |

Every Next commit passed: typecheck (21), build, `e2e` and `e2e:prod` (22 passed, 1 skipped because there's no audio locally), lint.

**Order changed from the original plan:** `eslint-config-next` ≤ 14 only supports ESLint ≤ 8, so ESLint 9 moved to the Next 15 hop. Jest 30 moves to after Next 16.

## Remaining

### 1. Finish Next 16 (packages already installed, uncommitted)
`next@16` and `eslint-config-next@16` are in `package.json` and the lockfile. Typecheck is still at 21.
- [ ] `eslint.config.mjs`: drop FlatCompat and import `eslint-config-next`'s native flat configs directly (`eslint-config-next` + `eslint-config-next/core-web-vitals`). Then remove `@eslint/eslintrc` if nothing else needs it. Check that `npm run lint` passes.
- [ ] **Turbopack is the default for `dev` and `build`.** Watch for:
  - the named `version` import from `package.json` in `NewVersionBanner`, `AdminCenterPage` and `SettingsPage`. Webpack warns about it today, and Turbopack may reject it. Fix it with a default import (`import pkg from "…/package.json"` → `pkg.version`).
  - the workspace root: add `turbopack.root` next to `outputFileTracingRoot` if Next complains about multiple lockfiles.
  - Fallback while investigating: `next build --webpack`.
- [ ] Typecheck ≤ 21, build, `e2e`, `e2e:prod`, lint → commit `chore: next 16`.

### 2. Jest 30 and Testing Library (own commit)
- [ ] `jest` and `babel-jest` 30, plus `jest-environment-jsdom` 30, `@testing-library/react` 16 with `@testing-library/dom` 10, `@testing-library/jest-dom` 6, `@testing-library/user-event` 14.
- [ ] `jest.setup.js`: `@testing-library/jest-dom/extend-expect` → `@testing-library/jest-dom`.
- [ ] There are no Jest tests: check with a throwaway test (not committed) and add `--passWithNoTests` to `test:ci`.

### 3. Turn the build checks back on (own commit, depends on an open decision)
- [ ] Fix the 21 known type errors: 19 × `.message` on `unknown` in catch blocks, `pages/login/index.tsx` (login response type), `ProjectUsersPage` (`ButtonMenu` without `children`).
- [ ] Remove `typescript.ignoreBuildErrors` from `next.config.js`.
- [ ] Remove `eslint.ignoreDuringBuilds`. It does nothing in Next 16, because `next build` no longer lints.
- [ ] Full `e2e` and `e2e:prod`.

### 4. Gate → STOP for beta drop #2
- [ ] Typecheck, lint, `e2e`, `e2e:prod`, `docker build` + run the container and check `/login`.
- [ ] Update this doc's "Done" section and CLAUDE.md where commands changed.
- [ ] **Hand off:** a maintainer tags and deploys beta drop #2, soaks it for several days, then tags production.
- On beta, check by hand: real report media (audio, PDF, download), token refresh after 15 min, 2FA login, the visit analytics call.

### 5. Milestone C: Storybook (separate PR, after B)
- [ ] `npx storybook@latest upgrade` → `@storybook/nextjs`. Remove `@storybook/addon-postcss`.
- [ ] `.storybook/preview.js`: remove the `next/image` monkey-patch.
- [ ] Check that the stories in `storybook/stories` render. This also clears the React 17 peer warnings from Storybook 6 dependencies during `npm i`.

## Open decisions

- **Lint scope:** keep `eslint pages components` (same as `next lint`), or widen to `eslint .` and fix the 8 existing errors in `packages/` and `storybook/` (missing `key` props ×3, a display name, an unescaped `'`, disable comments for unknown `@typescript-eslint` rules).
- **Step 3:** fix the type errors and remove `ignoreBuildErrors` in this upgrade, or open a follow-up ticket.
- **Local clean-up when finished:** the `e2e-admin@tella.local` user and the "e2e configuration" record in the local backend database, and the Docker images `tellaweb-frontend:upgrade-a4` / `upgrade-milestone-a`.

## Resuming work

- The worktree is `../TellaWeb-FrontEnd-nextjs`, on branch `upgrade/nextjs`. Not pushed, no upstream (`git push -u origin upgrade/nextjs` when ready).
- The local backend must be running on `:3001` (`TellaWeb-backend`: `docker-compose up db redis`, `npm run start:dev`).
- E2E credentials are in `.env.e2e.local` (gitignored). Baselines are in `e2e/__screenshots__/`, recorded on the Milestone A code. **Don't change local backend data,** or the screenshots will show false diffs.
- `npm run build` needs `NEXT_PUBLIC_API_URL=/api NEXT_REDIRECT_API_URL=http://localhost:3001` (Docker sets them).
- Port 3000 is usually taken by the main checkout's dev server. e2e uses 3100 (dev) and 3101 (prod).
- To discard the uncommitted Next 16 install: `git checkout package.json package-lock.json && npm ci`.

## Risks still open

| Risk | Mitigation |
|---|---|
| Turbopack-only build differences | `e2e:prod` on every change, `--webpack` fallback |
| Type errors hidden by `ignoreBuildErrors` | `typecheck` stays ≤ 21; step 3 removes the flag |
| Not covered by e2e: 2FA, token refresh, write flows, audio (no local file) | Manual checks on beta |
| Long-lived branch vs. ongoing work on `development` | Short pause on dependency changes, or rebase before the PR |
