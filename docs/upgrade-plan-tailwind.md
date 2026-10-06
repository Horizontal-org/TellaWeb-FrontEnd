# Upgrade plan: Tailwind CSS 2.2.19 → 3.4 → (maybe) 4.x

**Goal:** a maintained Tailwind version with **no visible change** to the UI.
**Prerequisite:** the Next.js upgrade is done, or at least Storybook and Chromatic work (see Phase 5 of `upgrade-plan-nextjs.md`). Without a visual-diff tool, regressions here are silent.

The plan stops on purpose at **v3.4** and treats v4 as a separate decision (see "Decision gate" below).

## Starting point

- `tailwind.config.js` uses v2-only keys: `purge` (only `./packages/ui/**/*.tsx`), `darkMode: false`, `variants.extend`.
- The theme **replaces** `colors`, `fontSize` and `spacing`, spreading `defaultTheme`. It has custom blue/gray/customgray scales, custom font sizes (`sm` = 11px, `base` = 14px…) and custom spacing keys (`xsm`, `sm`, `md`, `xxl`…).
- The plugin is `@tailwindcss/aspect-ratio`.
- **There are two pipelines today:** `styles/tailwind.css` is a **pre-built, committed** file (`npm run build:css`) imported by `_app.tsx`, *and* `postcss.config.js` runs `tailwindcss`. Because `purge` only scans `packages/ui`, classes used only in `pages/` or `components/` may be missing from that file.
- Storybook loads Tailwind through `@storybook/addon-postcss`.

Usage that the upgrades will affect (counted in `packages/`, `pages/` and `components/`):

| Pattern | Count | v3 | v4 |
|---|---|---|---|
| `border` with no colour | ~100 of 153 | unchanged (gray-200) | **turns `currentColor` (dark)** |
| `rounded` | 59 | unchanged | renamed `rounded-sm` (the old `rounded-sm` becomes `rounded-xs`) |
| `shadow` | 19 | unchanged | renamed `shadow-sm` |
| `outline-none` | 8 | unchanged | `outline-hidden` |
| `bg-/text-opacity-*` | 12 | deprecated, still works | **removed**. Use `bg-black/50` |
| `flex-grow` | 3 | deprecated alias | `grow` |
| `overflow-ellipsis` | 1 | `text-ellipsis` | `text-ellipsis` |

## Phase 0: Baseline

1. Make a branch, `upgrade/tailwind-v3`.
2. Get **Chromatic** running on the current stories and accept the result as the baseline. Add stories for any key screens that don't have one yet; at least the page components in `packages/ui/pages/` are worth covering.
3. Take full-page screenshots of the real app (login, report list, report detail, project pages, configuration wizard, admin center), because Storybook doesn't cover everything.

## Phase 1: Tailwind 2 → 3.4

1. `npm i -D tailwindcss@3 postcss@8 autoprefixer@10 @tailwindcss/aspect-ratio@latest`
2. Update `tailwind.config.js`:
   - `purge` → `content`, and **widen it** to `./packages/**/*.tsx`, `./pages/**/*.tsx`, `./components/**/*.tsx`, `./common/**/*.tsx`.
   - Remove `darkMode: false` and the whole `variants` block. v3 enables every variant by default.
   - Keep `...defaultTheme.colors` but check for warnings about renamed colours (`lightBlue` → `sky` and so on). If any appear, use `tailwindcss/colors` and pick the scales you use.
3. **Use one pipeline:** delete the committed `styles/tailwind.css` and the `build:css` script. Create a small `styles/tailwind.css` (or reuse `globals.css`) with `@tailwind base; @tailwind components; @tailwind utilities;` and let PostCSS build it through Next. Add the generated file to `.gitignore` if anything still writes it.
4. Fix the deprecations even though they still work, because it makes Phase 2 smaller:
   - `bg-opacity-*` / `text-opacity-*` → the slash syntax (`bg-black/50`, `text-gray-500/80`)
   - `flex-grow` → `grow`, `overflow-ellipsis` → `text-ellipsis`
5. Get Storybook's PostCSS working with Tailwind 3. On a modern Storybook this means importing the CSS in `.storybook/preview`.
6. Run Chromatic and compare the screenshots.
   - Expect a **few intended differences**: classes in `pages/` and `components/` that were missing from the purged CSS will now apply. Check each one; usually they fix things.
   - Any other difference is a regression to fix.
7. Deploy to beta and check it by eye on the browsers your users actually have.

**Done when:** Chromatic shows no unintended changes and beta looks the same. **Phase 1 is a good place to stop.** Tailwind 3.4 is stable and still supports older browsers.

## Decision gate: should you go to v4?

Tailwind v4 **only supports Safari 16.4+, Chrome 111+ and Firefox 128+.** In older browsers the styling doesn't degrade gracefully; it breaks badly. Some Tella Web users (admins and editors reviewing reports) may work in low-resource or high-risk settings on older devices.

Before Phase 2, answer these:
- [ ] What browsers do real users have? Check the visit analytics (`common/globalSettings/VisitAnalytic`) or the server logs.
- [ ] Is losing support for the browsers below the minimum acceptable? Who decides?
- [ ] Is there a concrete benefit you need from v4 (speed, CSS-first config, new utilities), or is it only about staying current?

If the answer isn't a clear yes, **stay on 3.4** and come back to this later.

## Phase 2: Tailwind 3.4 → 4.x (only if the gate is passed)

1. Make a branch, `upgrade/tailwind-v4`, from the merged v3 work.
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
8. Run Chromatic, compare screenshots, deploy to beta, and **test on the oldest browser you've agreed to support**.

## Rollout and rollback

- Each phase is its own PR → beta tag → production tag, following the usual release flow.
- Rollback means re-deploying the previous image tag. Nothing here touches data or the API.

## Risks to watch

| Risk | Phase | Mitigation |
|---|---|---|
| Missing or extra CSS from changing the purge/content paths | 1 | Chromatic plus screenshots; check each difference |
| Dropping browser support | 2 | Decision gate, using real analytics data |
| ~100 borders turning dark | 2 | Compatibility rule in the base layer |
| Codemod misses classes built dynamically | 2 | Review the diff by hand, grep for `` className={` `` templates |
| Theme merges with defaults where it used to replace them | 2 | `--*: initial` per namespace |
| Slight shifts in default colours | 2 | Accept, or pin those colours as hex values in `@theme` |
