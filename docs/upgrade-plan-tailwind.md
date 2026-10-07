# Upgrade plan: Tailwind CSS 2.2.19 → 3.4 → (maybe) 4.x

**Goal:** a maintained Tailwind version with **no visible change** to the UI.
**Branch:** `upgrade/tailwind`, started from `upgrade/dependencies` (`3335093`).
**Visual safety net:** the Playwright screenshots in `e2e/` (Storybook and Chromatic were removed).

The plan stops on purpose at **v3.4** and treats v4 as a separate decision (see "Decision gate" below).

## Progress

**Status (2026-10-07): Phase 0 and Phase 1 done (Tailwind 3.4.19).** Next: the decision gate for v4.

| Commit | Change |
|---|---|
| `f90a839` | **Phase 0:** `e2e/visual.spec.ts`, element screenshots of the main dialogs (create user with the password meter, create project/resource, new configuration, share configuration, rename/delete project), the users list with a selected row, the login error and the 2FA passcode screen. Recorded on Tailwind 2 |
| `232d65c` | **Phase 1:** Tailwind 3.4, `@tailwindcss/aspect-ratio` 0.4, one build pipeline (details below) |
| `989280b` | Deprecated class names replaced: `bg-opacity-*`/`text-opacity-*` → slash syntax, `flex-grow` → `grow`, `overflow-ellipsis` → `text-ellipsis` (same CSS values) |

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

## Phase 2: Tailwind 3.4 → 4.x (only if the gate is passed)

1. Continue on `upgrade/tailwind` (or a new branch from the merged v3 work).
2. Run the official upgrade tool: `npx @tailwindcss/upgrade`. It:
   - moves `@tailwind` directives to `@import "tailwindcss"`
   - changes PostCSS to `@tailwindcss/postcss` (autoprefixer is no longer needed)
   - renames utilities (`rounded`, `shadow`, `outline-none`, …) throughout the codebase
   - turns `tailwind.config.js` into CSS `@theme` variables, or keeps it through `@config`
3. **Review the codemod's diff by hand.** It touches about 100 class strings. Look carefully at class names built with string interpolation, which the tool can't see.
4. **Border colour:** to keep the current look, add the compatibility rule to the base layer:
   ```css
   @layer base {
     *, ::after, ::before, ::backdrop, ::file-selector-button {
       border-color: var(--color-gray-200, currentColor);
     }
   }
   ```
   Note that `gray-200` is **overridden** to `#e5e5e5` in this theme, so make sure that value survives into `@theme`.
5. Port the theme carefully:
   - Custom `fontSize`, `spacing` and `colors` **replace** the defaults today. In v4, use `--*: initial` inside `@theme` for each namespace you replace fully. Otherwise the defaults merge in.
   - Default palette colours move to OKLCH and shift slightly. The custom hex values stay exact.
   - Custom spacing keys (`sm`, `md`, `xxl`…) clash with v4's dynamic spacing scale and with named sizes such as `max-w-md`. Check every use.
6. Remove `@tailwindcss/aspect-ratio` and use the built-in `aspect-*` utilities (`aspect-w-*`/`aspect-h-*` → `aspect-[16/9]` and similar).
7. Check the base-style changes: focus rings (3px → 1px, `ring` → `ring-3`), placeholder colour, and `cursor: default` on buttons, which used to be `pointer`.
8. Run the e2e screenshots, compare, deploy to beta, and **test on the oldest browser you've agreed to support**.

## Rollout and rollback

- Each phase is its own PR → beta tag → production tag, following the usual release flow.
- Rollback means re-deploying the previous image tag. Nothing here touches data or the API.

## Risks to watch

| Risk | Phase | Mitigation |
|---|---|---|
| Missing or extra CSS from changing the purge/content paths | 1 | Done: 6 missing classes found, no visual change |
| Dropping browser support | 2 | Decision gate, using real analytics data |
| ~100 borders turning dark | 2 | Compatibility rule in the base layer |
| Codemod misses classes built dynamically | 2 | Review the diff by hand, grep for `` className={` `` templates |
| Theme merges with defaults where it used to replace them | 2 | `--*: initial` per namespace |
| Slight shifts in default colours | 2 | Accept, or pin those colours as hex values in `@theme` |
