# Upgrade plan: Next.js 12.2.5 → 16.x

**Goal:** get Next.js onto a supported, patched version without changing how the app behaves.
**Out of scope:** moving to the App Router, redesigning the UI, and the Tailwind upgrade (see `upgrade-plan-tailwind.md`). Do that one as a separate PR.

## Starting point

| | Now | Needed for Next 16 |
|---|---|---|
| next | 12.2.5 | 16.x |
| Node (Docker) | `node:16.15-alpine` | ≥ 20.9 (use 22 LTS) |
| TypeScript | 4.4.4 (pinned) | ≥ 5.1 |
| React | 18.2 | 18.2 is fine (React 19 is optional, not part of this plan) |
| ESLint | 8 + `.eslintrc` + `next lint` | `next lint` is removed in 16. Use ESLint 9 with flat config |
| next-i18next | 10.5 | 15+/16 (it has its own i18next peer dependencies) |
| Storybook | 6.5 (webpack 4) | Probably breaks. Upgrade separately (Phase 0 / Phase 5) |

Facts about the codebase that shape this plan:
- Only the **Pages Router** is used. There is no `app/`, no `middleware`, and no `pages/api`. Most of the Next 13–15 breaking changes don't apply.
- `next.config.js` ignores TypeScript **and** ESLint errors during build, so a green build proves very little.
- `.babelrc` (`next/babel` + `react-require`) turns off SWC today.
- `next/dist/client/router` is imported in 7 files. That is an internal path.
- `next/image` is used in 9 files. `ImageView.tsx` uses `layout="fill"`, `objectFit` and `onLoadingComplete`, which are legacy-only props.
- `serverSideTranslations` is used in 3 pages (`login`, `settings`, `resource`).
- `npx tsc --noEmit` currently stops at **104 parse errors, all inside `react-leaflet` type definitions**. TS 4.4 can't read the newer `.d.ts` syntax, so **the real type-error baseline for app code is unknown right now.**

## Phase 0: Safety net (before touching Next)

1. Make a branch, `upgrade/nextjs`, off `development`.
2. **Bump TypeScript to 5.x on its own** and run `npx tsc --noEmit`. Write down the number of app-code errors as the baseline, for example in a comment on the PR. Don't fix them all now. The point is to be able to tell when the upgrade *adds* errors.
3. Add a `typecheck` script (`tsc --noEmit`). From now on, run it after every phase.
4. Write a **manual smoke-test checklist** and run it on the current build to record baseline behaviour:
   - login (plus 2FA), logout, and redirect to `/login` when signed out
   - `/verify` (a public route)
   - report list → report detail: image, audio, video, PDF and map views, file download
   - projects: list, detail, users, resources, settings
   - remote configuration list/detail and the camouflage wizard
   - users, resources, admin center (backups)
   - language switch en/es on `login`, `settings` and `resource`
   - token refresh (wait for the access token to expire, or force a 401)
5. Optional but recommended: take screenshots of the main pages. They become the visual baseline for the Tailwind plan as well.

**Done when:** the TS baseline is recorded and the smoke checklist passes on the current code.

## Phase 1: Clean-ups that work on Next 12

These are small PRs that make the jump smaller and ship without risk:

1. Change `next/dist/client/router` to `next/router` (7 files).
2. Delete `.babelrc`. `react-require` isn't needed with React 18's automatic JSX runtime. This switches the build to SWC, which is what Turbopack expects later. Then confirm that styled-components still render correctly. If class names or SSR styles go wrong, add `compiler: { styledComponents: true }` in `next.config.js`.
3. Run the smoke checklist.

**Done when:** this is merged and deployed to beta with no regressions.

## Phase 2: Runtime and tooling

1. Dockerfile: `node:16.15-alpine` → `node:22-alpine`. Use the same Node version locally (consider adding `.nvmrc`).
2. Move ESLint to v9 with flat config (`eslint.config.mjs`), using `eslint-config-next` and `eslint-plugin-testing-library`. Change the `lint` script from `next lint` to `eslint .`. Keep `react-hooks/exhaustive-deps: off`.
3. Run the smoke checklist and the Docker build.

## Phase 3: Next.js, one major version at a time

At each step: bump `next` and `eslint-config-next` → run the codemods → `typecheck` → `npm run build` → run the smoke checklist → commit.

### 12 → 13
- `npx @next/codemod@latest new-link .`: probably nothing to change (no `<Link><a>` found), but run it anyway.
- **`next/image`:** start with `npx @next/codemod@latest next-image-to-legacy-image .` so behaviour stays the same. Then move each of the 9 files to the new `next/image` by hand:
  - `ImageView.tsx`: `layout="fill"` → `fill`, `objectFit="contain"` → `style={{ objectFit: "contain" }}`, `onLoadingComplete` → `onLoad`.
  - The other 8 files (logos and icons): check that their sizes look the same.
  - The aim is **no `next/legacy/image` left by the end of Phase 3**, because it is deprecated.
- `images.domains` → `images.remotePatterns`. `domains` is deprecated, and `ImageView` uses `unoptimized` anyway.

### 13 → 14
- Mostly painless for the Pages Router. Remove `next export` usage if there is any (there is none today).

### 14 → 15
- The async request APIs and caching changes only affect the App Router, so skip them.
- Check the `rewrites()` config: `source` is built from `process.env.NEXT_PUBLIC_API_URL`, so make sure the env var is set at build time in Docker. It is today.
- Upgrade **next-i18next** here (to the current major, with matching `i18next` and `react-i18next`). Check the 3 `serverSideTranslations` pages and the 6 files that use `useTranslation`.

### 15 → 16
- **Turbopack becomes the default** for `dev` and `build`. Phase 1 deleted `.babelrc`, so the custom-Babel problem should be gone. If something breaks only under Turbopack, `next build --webpack` is available as a temporary fallback.
- Check that nothing still uses `next/legacy/image` or `next lint`.
- Bump `@types/react` and `@types/react-dom` as needed.

## Phase 4: Turn the safety checks back on

1. Fix any type errors **added** during the upgrade, compared with the Phase 0 baseline.
2. Remove `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` from `next.config.js` if the error count lets you. If it doesn't, open a follow-up ticket and at least run `typecheck` in CI.

## Phase 5: Storybook (separate PR, can run in parallel)

Storybook 6.5 is unlikely to survive the toolchain changes. Upgrade it with `npx storybook@latest upgrade` (to `@storybook/nextjs`) and check that `npm run chromatic` still works. You need this before the Tailwind upgrade, which depends on Chromatic for visual diffs.

## Rollout

1. Merge each phase into `development` → tag `beta-X.Y.Z` → deploy to beta → run the smoke checklist on beta.
2. Leave it on beta for at least a few days of real use before production.
3. Production: tag `X.Y.Z` as usual.

**Rollback:** each phase is its own PR/tag, so you can roll back by re-deploying the previous Docker image tag. Nothing in this plan touches the backend or data.

## Risks to watch

| Risk | Mitigation |
|---|---|
| Errors hidden by `ignoreBuildErrors` | Phase 0 baseline plus `typecheck` after every step |
| `next/image` layout shifts (the media viewer especially) | Migrate `ImageView` by hand and check it with real report media |
| styled-components rendering after removing Babel | `compiler.styledComponents`, and check visually |
| Turbopack-only build differences | `--webpack` fallback while investigating |
| next-i18next API changes | Test en/es on the 3 translated pages |
| Leaflet/OpenLayers maps (they need `window`) | Smoke-test the verification map and the report map views |
