# Upgrade plan: Tailwind CSS 2.2.19 → 3.4 → 4.x

**Goal:** a maintained Tailwind version with **no visible change** to the UI.
**Branch:** `upgrade/tailwind`, started from `upgrade/dependencies` (`3335093`).
**Visual safety net:** the Playwright screenshots in `e2e/` (Storybook and Chromatic were removed).

The plan stops on purpose at **v3.4** and treats v4 as a separate decision (see "Decision gate" below).

## Progress

**Status (2026-10-07): done. Tailwind 4.3.3** (via 3.4). Waiting for a beta drop; see `docs/manual-checks.md`.

| Commit | Change |
|---|---|
| `f90a839` | **Phase 0:** `e2e/visual.spec.ts`, element screenshots of the main dialogs (create user with the password meter, create project/resource, new configuration, share configuration, rename/delete project), the users list with a selected row, the login error and the 2FA passcode screen. Recorded on Tailwind 2 |
| `232d65c` | **Phase 1:** Tailwind 3.4, `@tailwindcss/aspect-ratio` 0.4, one build pipeline (details below) |
| `989280b` | Deprecated class names replaced: `bg-opacity-*`/`text-opacity-*` → slash syntax, `flex-grow` → `grow`, `overflow-ellipsis` → `text-ellipsis` (same CSS values) |
| `4a5095d` | Decision recorded: go to v4, accepting the browser cost |
| `25aa04e` | `@config` added for the upgrade tool; unused `packages/ui/styles/globals.css` removed |
| `aac9bd6` | **Phase 2: Tailwind 4.3.3** (details under "Phase 2") |

What Phase 1 found and did:
- **The committed v2 stylesheet was stale.** It only scanned `packages/ui` and was last rebuilt in Jan 2025, so 6 classes used in the code were missing: `w-40`, `opacity-0`, `opacity-100`, `transition`, `pb-1`, `blur`. They now apply. None changed a screenshot; the visible effect should be the toast fade-out, which now animates.
- **Theme defaults pinned to v2:** v3's `defaultTheme.colors` is a function (spreading it, as the old config did, gives nothing), and v2's `green`/`yellow`/`purple` are v3's `emerald`/`amber`/`violet`. Shades 50–900 are identical. v2's shadows and sans-serif fallbacks are pinned too.
- **One real difference, fixed:** Tailwind 3 dropped `body { font-family: inherit }` from its base styles, so body text without `font-sans` fell back to the system fonts in `globals.css` (seen on the report page). Restored in `styles/tailwind.css`.
- `aspect-w-*`/`aspect-h-*` (report thumbnails) still come from the plugin; v3's built-in `aspect-*` utilities are disabled with `corePlugins.aspectRatio: false`.
- Result: all 28 screenshots (pages, dialogs, states) match Tailwind 2. `e2e` and `e2e:prod` 53 passed / 1 skipped; Docker image builds and serves the generated CSS.
- Dev-only audit: 28 findings remain (29 before). Tailwind 3.4 still depends on an old `postcss-selector-parser`; Tailwind 4 would clear those.

## Starting point

- `tailwind.config.js` uses v2-only keys: `purge` (only `./packages/ui/**/*.tsx`), `darkMode: false`, `variants.extend`.
- The theme **replaces** `colors`, `fontSize` and `spacing`, spreading `defaultTheme`. It has custom blue/gray/customgray scales, custom font sizes (`sm` = 11px, `base` = 14px…) and custom spacing keys (`xsm`, `sm`, `md`, `xxl`…).
- The plugin is `@tailwindcss/aspect-ratio`.
- **There are two pipelines today:** `styles/tailwind.css` is a **pre-built, committed** file (`npm run build:css`) imported by `_app.tsx`, *and* `postcss.config.js` runs `tailwindcss`. Because `purge` only scans `packages/ui`, classes used only in `pages/` or `components/` may be missing from that file.

Usage that the upgrades will affect (counted in `packages/`, `pages/` and `components/`):

| Pattern | Count | v3 | v4 |
|---|---|---|---|
| `border` with no colour | ~100 of 153 | unchanged (gray-200) | **turns `currentColor` (dark)** |
| `rounded` | 59 | unchanged | renamed `rounded-sm` (the old `rounded-sm` becomes `rounded-xs`) |
| `shadow` | 19 | unchanged | renamed `shadow-sm` |
| `outline-none` | 8 | unchanged | `outline-hidden` |
| `bg-/text-opacity-*` | 12 | ✅ replaced with the slash syntax | **removed** in v4 |
| `flex-grow` | 1 (2 more are plain CSS in styled-components) | ✅ `grow` | `grow` |
| `overflow-ellipsis` | 1 | ✅ `text-ellipsis` | `text-ellipsis` |

## Phase 0: Baseline ✅
Done with Playwright instead of Chromatic: page screenshots (`pages.spec.ts`, `auth.spec.ts`) plus element screenshots of dialogs and states (`visual.spec.ts`).

## Phase 1: Tailwind 2 → 3.4 ✅
See "Progress". Remaining: deploy to beta and check by eye on the browsers your users actually have (`docs/manual-checks.md`, "Tailwind 3.4 beta drop").

## Decision gate: should you go to v4?

**Decided (2026-10-07): go to v4.** Accepted consequence: browsers below Safari 16.4, Chrome 111 and Firefox 128 lose the layout. In practice that's Windows 7/8.1 (Chrome stops at 109, Firefox at 115 ESR), older Macs on old macOS, iPhones that can't install iOS 16.4 (iPhone 7 and older) and Android 6 or older. If someone reports a broken layout on beta or in production, check their browser first.


Tailwind v4 **only supports Safari 16.4+, Chrome 111+ and Firefox 128+.** In older browsers the styling doesn't degrade gracefully; it breaks badly. Some Tella Web users (admins and editors reviewing reports) may work in low-resource or high-risk settings on older devices.

Before Phase 2, answer these:
- [ ] What browsers do real users have? Check the visit analytics (`common/globalSettings/VisitAnalytic`) or the server logs.
- [ ] Is losing support for the browsers below the minimum acceptable? Who decides?
- [ ] Is there a concrete benefit you need from v4 (speed, CSS-first config, new utilities), or is it only about staying current?

If the answer isn't a clear yes, **stay on 3.4** and come back to this later.

## Phase 2: Tailwind 3.4 → 4.x ✅
Ran `@tailwindcss/upgrade` 4.3.3, then reviewed and fixed its output:
- **Theme** moved from `tailwind.config.js` (deleted) into `@theme` in `styles/tailwind.css`, with the **exact hex values** (no shift to v4's OKLCH palette). `--*: initial` keeps colours, font sizes, font weights, shadows and spacing replacing the defaults, as before. The border-colour compatibility rule keeps v3's `gray-200` (`#e5e5e5`) default.
- **Class renames** in 27 files: `rounded` → `rounded-sm`, `rounded-sm` → `rounded-xs`, `outline-none` → `outline-hidden`. No dynamic (template-string) class names used renamed utilities.
- **One wrong codemod edit, reverted:** it changed `flex-grow: 1;` to `grow: 1;` inside two styled-components CSS blocks (CSS properties, not Tailwind classes).
- **PostCSS** uses `@tailwindcss/postcss` (the tool couldn't migrate the config); `autoprefixer` removed (v4 handles prefixes).
- **Native cascade layers (the main v4 surprise):** unlayered CSS beats every Tailwind utility and base style. `styles/globals.css` (element resets, range/radio/checkbox styles, a few classes) is now inside `@layer base`. It's imported before `styles/tailwind.css`, so Tailwind's base rules still follow it, as in v3. Without this, the restored body font rule had no effect (the same 4 screenshot diffs as in Phase 1 came back).
- **v4 default changes kept as v3** (upgrade guide): placeholder colour (`gray-400`) and `cursor: pointer` on buttons.
- **Sources:** v4 scans the whole repo by default (docs included; a `max-w-md` from this doc was being generated as 30px because of the custom `md` spacing). `@import 'tailwindcss' source(none)` plus `@source` for `packages/`, `pages/`, `components/` and `common/`, the same folders as v3's `content`.
- **Custom spacing names** (`sm`, `md`, `xsm`, `xxl`, …) are only used for margins and padding in the app, where they resolve as before. Avoid `max-w-sm/md` and similar with these names: in v4 they'd resolve to the spacing values.
- **Removed** `@tailwindcss/aspect-ratio`: its classes were only in the thumbnails' `box` mode, which no caller uses; that branch now uses the built-in `aspect-square`. Also removed `packages/ui/styles/tailwind.css`, an unused Tailwind 2.2.16 output from 2022.
- Result: all 28 screenshots match; `e2e` and `e2e:prod` 53 passed / 1 skipped; Docker image builds and serves the v4 CSS (26 KB). Production audit 0; dev-only audit 24 (was 28; the old CSS parser is gone).

## Rollout and rollback

- Each phase is its own PR → beta tag → production tag, following the usual release flow.
- Rollback means re-deploying the previous image tag. Nothing here touches data or the API.

## Risks to watch

| Risk | Phase | Mitigation |
|---|---|---|
| Missing or extra CSS from changing the purge/content paths | 1 | Done: 6 missing classes found, no visual change |
| Dropping browser support | 2 | Decided and accepted (see the decision gate); check reports of broken layouts against the browser |
| ~100 borders turning dark | 2 | ✅ Compatibility rule in the base layer |
| Codemod misses classes built dynamically | 2 | ✅ Checked; also caught one wrong edit in styled-components CSS |
| Theme merges with defaults where it used to replace them | 2 | ✅ `--*: initial` per namespace (generated by the tool) |
| Slight shifts in default colours | 2 | ✅ Exact hex values in `@theme` |
