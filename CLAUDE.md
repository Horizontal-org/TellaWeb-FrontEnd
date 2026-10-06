# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Next.js dev server on :3000
npm run build          # production build
npm run lint           # next lint
npm run build:css      # regenerate styles/tailwind.css (imported by pages/_app.tsx)
npm run storybook      # Storybook on :6006 (stories live in storybook/stories)
npm test               # jest --watch
npm run test:ci        # jest --ci
npx jest path/to/file.test.tsx   # run a single test file
npx jest -t "test name"          # run tests matching a name
```

`next.config.js` sets `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`, so a successful `npm run build` does **not** mean the code type-checks or passes lint. Run `npx tsc --noEmit` and `npm run lint` yourself. `tsconfig` has `strict: false`.

Jest is set up with `next/jest`, jsdom and `@testing-library/jest-dom`, but the repo currently has almost no test files.

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
