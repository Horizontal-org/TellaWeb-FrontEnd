# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Next.js dev server on :3000
npm run build          # production build (needs NEXT_PUBLIC_API_URL=/api NEXT_REDIRECT_API_URL=http://localhost:3001, or the /api rewrite is invalid)
npm run typecheck      # next typegen && tsc --noEmit (next-env.d.ts is generated, not committed)
npm run lint           # next lint
npm run build:css      # regenerate styles/tailwind.css (imported by pages/_app.tsx)
npm test               # jest --watch
npm run test:ci        # jest --ci
npx jest path/to/file.test.tsx   # run a single test file
npx jest -t "test name"          # run tests matching a name
npm run e2e            # Playwright smoke suite (needs the local backend, see e2e/README.md)
npm run e2e:prod       # same suite against a production build (next build && next start on :3101)
npm run e2e -- -g "report page"  # single e2e test by name
npm run e2e:update     # re-record local screenshot baselines
```

`next.config.js` sets `typescript.ignoreBuildErrors`, and Next 16's `next build` doesn't lint, so a successful `npm run build` does **not** mean the code type-checks or passes lint. Run `npm run typecheck` and `npm run lint` yourself. `tsconfig` has `strict: false`.

Jest is set up with `next/jest`, jsdom and `@testing-library/jest-dom`, but the repo currently has almost no test files. Behaviour is covered by the Playwright suite in `e2e/` (page loads, CRUD flows, roles, token refresh, 2FA, error toasts). Its screenshot baselines are gitignored because they capture local backend data. Tests that write data name records `e2e-tmp-…` and clean them up; use the helpers in `e2e/support/api.ts` and `expectToast()` from `e2e/fixtures.ts` (see `e2e/README.md`).

## Environment / API

This is the web frontend for Tella. It talks to a separate backend API. `.env.development` sets:
- `NEXT_PUBLIC_API_URL=/api`: the prefix every RTK Query service uses
- `NEXT_REDIRECT_API_URL=http://localhost:3001`: where `next.config.js` rewrites `/api/*` to

So locally the backend has to be running on port 3001. In Docker, `NEXT_REDIRECT_API_URL=http://api:3001`.

## Architecture

There are three layers, wired together with tsconfig path aliases (`@tellaweb/ui` → `packages/ui`, `@tellaweb/state` → `packages/state`). Code also imports straight from `packages/...`, `common/...` and `components/...` through `baseUrl: "."`.

- **`packages/ui`**: presentational components, layouts, modals and full page views (`packages/ui/pages/*Page`). These must **not** call the API. They only take data through props and report back through callbacks. `packages/ui/index.tsx` is the barrel export.
- **`packages/state`**: business logic and API access.
  - `services/*.ts`: one RTK Query `createApi` per backend resource. Each one uses `baseQueryWithRefresh(\`${NEXT_PUBLIC_API_URL}/<resource>\`)`, which adds the Bearer token and, on a 401, makes a single shared `/auth/refresh` call and then retries.
  - `features/*`: Redux slices (`auth`, `user`, `reports`) and hooks (for example `useAuthRequired`, `useUserProfile`, file downloaders).
  - `domain/*.ts`: shared TypeScript types.
  - `store.ts`: the single store. **A new API service has to be registered in both `reducer` and `middleware` here.**
- **`pages/`** (Next.js pages router): only routing and glue. A page calls the state hooks and RTK Query hooks, maps them to props for a `packages/ui` page component, and handles navigation and toasts. List pages convert between the UI's generic `ItemQuery` (sort, search, pagination) and the resource-specific query type (see `pages/resource/index.tsx`).
- **`common/`**: app-level glue. CASL permissions live in `common/casl` and data mappers in `toReport`/`toRemoteConfiguration`.
- **`components/`**: app-level wrappers such as `Menu` and `ToastWrapper` (`useToast`).

### Auth and permissions
- Tokens are kept in `localStorage` (`access_token`, `refresh_token`), plus an `access_token` cookie, by `features/auth/authSlice.ts`.
- Protected pages call `useAuthRequired()`. It loads the profile, calls `updateAbility(user, ability)` and sends unauthenticated users to `/login`. Public routes are listed in `packages/ui/utilities/publicRoutes`.
- Role-based access goes through CASL (`common/casl/Ability.tsx`). The roles are admin, editor, viewer and reporter, and permissions are defined over `ENTITIES`. Use `<Can>` / `AbilityContext` in the UI. `validateRoute` maps URL segments to entities.

### i18n
`next-i18next` handles translation, with locales `en` (default) and `es`. Translation files are in `public/locales/<locale>/<namespace>.json`. Pages that translate text load their namespaces in `getStaticProps`/`getServerSideProps` with `serverSideTranslations(locale, [...])`.

### Styling
The project uses Tailwind CSS v2 (`tailwind.config.js`), with some styled-components.

## Code style
- Leave out semicolons in new JS/TS code. Existing files are inconsistent, so match the file you are editing where it matters.

## Releases
Versions are tags that trigger Docker Hub image builds:
- Beta: set `version` in `package.json` (no prefix), merge to `development`, then push the tag `beta-X.Y.Z` from `development`.
- Production: merge into `main`, then push the tag `X.Y.Z`.
- `./prepare-release.sh <version>` bumps `package.json` (with no git tag from npm) and creates an annotated tag locally. You still have to push it.
