# Upgrade plan: remaining dependencies

**Goal:** every runtime dependency on its current major version, without changing how the app behaves. Tailwind has its own plan (`upgrade-plan-tailwind.md`).
**Side effect:** at the end the app runs on React 19, the known requirement for Next 17.
**Branch:** `upgrade/dependencies`, started from `upgrade/nextjs` (`8248498`). Rebase onto `development` once `upgrade/nextjs` is merged.

## Decisions

- **New branch `upgrade/dependencies`**, from `development` once `upgrade/nextjs` is merged (or from `upgrade/nextjs` if work starts before that). Beta drop #2 stays exactly what was tested.
- **One commit per step**, same checks as the Next.js upgrade after each: `typecheck`, `lint`, `build`, `e2e` and `e2e:prod`. Docker build before each beta drop.
- **Every step works on React 18.** The new versions all support React 18 and 19, so the app is shippable after any step, and React 19 itself is a small last step.
- **Tags and deploys are done by a maintainer.** The work stops at each beta checkpoint.
- **Held back on purpose:**
  - TypeScript 7: the new native compiler; Next 16 support isn't confirmed.
  - ESLint 10: plugins may lag.
  - `@types/node` > 22: pinned to match Node 22.
  - Next 16.4: the Turbopack dev regression (see the Next.js plan).
- **Decided (2026-10-07):** remove Storybook; keep the map code and upgrade `react-leaflet`; protobufjs stays gated on a mobile check.

## Current state

| Package | Now | Latest | Used in |
|---|---|---|---|
| qrcode.react | 3 | 4 | `TwoFactorAuthModal/Connect.tsx`, `ShareConfigurationModal.tsx` (already use the named `QRCodeCanvas`) |
| react-to-print | 2 | 3 | `ShareConfigurationModal.tsx` (`useReactToPrint`) |
| react-icons | 4 | 5 | 57 files |
| date-fns | 2 | 4 | 14 files, only `format` and `addSeconds` |
| @reduxjs/toolkit | 1.9 | 2 | 15 files; `extraReducers` object syntax (removed in v2) in `authSlice`, `reportsSlice`, `userSlice` |
| react-redux | 7 | 9 | 8 files |
| @casl/ability, @casl/react | 5 / 3 | 7 | `common/casl/Ability.tsx`, `Can.tsx` |
| react-table | 7 (no React 19 version) | → @tanstack/react-table 8 | `components/Table/Table.tsx`, column definitions in `domain/*TableColumns.ts`, `domain/ItemQuery.ts`, `types/react-table-config.d.ts`; 7 list pages render `<Table>` |
| styled-components | 5 | 6 | 11 files |
| react-leaflet (+ leaflet, @types/leaflet) | 4 | 5 | only `VerificationMap`, used only by `VerificationInformation`, which **nothing imports** (dead code) |
| react, react-dom, @types/react* | 18.3 | 19 | everywhere |
| protobufjs | 6 | 8 | `packages/ui/proto/configuration.ts` (`Writer`/`Reader` from `protobufjs/minimal`); encodes remote configurations **the mobile app decodes** |

## Steps

### 1. Remove Storybook ✅
The team doesn't use it, and the e2e suite (real pages) plus Jest + Testing Library (isolated components) cover what it was for.
- Removed `.storybook/`, `storybook/`, the `storybook` / `build-storybook` scripts, `storybook`, `@storybook/*`, `@fontsource/open-sans`, `namor`, the `storybook` exclude in `tsconfig.json`, and the `storybook-static` / `build-storybook.log` ignores.
- `npm i` no longer prints the React 17 peer warnings.
- Can be set up fresh later if the team wants a component catalogue again.

### 2. Small independent upgrades
- `qrcode.react` 4: the named `QRCodeCanvas` is already in use; check the props.
- `react-to-print` 3: `useReactToPrint({ content: () => ref.current })` → `useReactToPrint({ contentRef: ref })`.
- `react-icons` 5: fix any renamed or removed icons (the type check finds them).
- `date-fns` 4: check `format` patterns and `addSeconds`.
- Verify by hand: 2FA setup QR code (settings), remote configuration share + print.

### 3. Redux Toolkit 2 + react-redux 9
- `extraReducers`: object syntax → builder callback in the 3 slices.
- RTK 2 type and option changes (`configureStore` middleware callback, `createSlice` typing).
- The e2e write tests exercise most RTK Query endpoints.

### 4. CASL 7
- `@casl/ability` + `@casl/react` 7: update `AbilityBuilder` / `createMongoAbility` usage and `<Can>` / `AbilityContext`.
- Covered by `roles.spec.ts` (viewer, editor, admin, reporter).

### 5. react-table 7 → TanStack Table 8 (largest step)
- **Before:** add e2e tests for what the table does: sorting, row selection (single, all), pagination, search. Today these are only partly covered.
- Rewrite `components/Table/Table.tsx` on `@tanstack/react-table` (`useReactTable`, column helpers, controlled sorting/pagination through `ItemQuery`).
- Port the column definitions (`domain/*TableColumns.ts`) and remove `types/react-table-config.d.ts`.
- Check all 7 list pages; screenshots catch layout changes.

### 6. styled-components 6
- Props that reach the DOM → transient `$props`. Drop any `@types/styled-components`.
- Screenshots catch visual changes.

### 7. React 19
- `react`, `react-dom`, `@types/react`, `@types/react-dom` 19.
- Fix removed or changed APIs (`defaultProps` on function components, implicit `children`, ref changes).
- **react-leaflet 5** (React 19 only). The map code isn't used today (`VerificationInformation` isn't imported anywhere), but it stays: upgrade it and check it still type-checks and builds.

### 8. protobufjs 8: needs a mobile-app check
- `protobufjs/minimal` `Writer`/`Reader` API changes.
- **Gate:** someone shares a remote configuration from the web app to a phone running Tella and confirms it applies. If nobody can test that, keep protobufjs 6 pinned and note why.

## Beta drops (maintainer)
- **#1 after step 4:** Storybook removal, small upgrades, RTK, CASL. Lower risk.
- **#2 after step 7:** the Table rewrite, styled-components and React 19.
- **Step 8** ships on its own after the mobile check.
- On beta, check by hand: list pages (sort, select, paginate, search), 2FA setup QR, configuration share + print, permissions per role.

## Risks

| Risk | Mitigation |
|---|---|
| Table behaviour changes (sorting, selection, pagination) | Add table e2e tests before step 5; screenshots for layout |
| RTK 2 changes how requests or caching behave | e2e write tests cover the main endpoints; beta soak |
| Permission regressions after CASL 7 | `roles.spec.ts` |
| Remote configuration encoding breaks phones | Step 8 is gated on a mobile check, or stays pinned |
| React 19 breaks a library without a declared peer range | Every step on React 18 first; React 19 last, on its own |
