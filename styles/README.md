# Styles

The app uses Tailwind CSS 4. There is no `tailwind.config.js`: `styles/tailwind.css` is both the
entry point and the configuration.

## How it is built

```
pages/_app.tsx
  ├─ import "../styles/globals.css"    hand-written global CSS
  └─ import "../styles/tailwind.css"   Tailwind entry + theme
        │
        ▼
Next.js runs PostCSS (postcss.config.js → "@tailwindcss/postcss")
        │
        ▼
Tailwind scans the source folders and emits only the utilities that are used
```

Vendor prefixes are handled by Tailwind itself (no autoprefixer).

## `tailwind.css`

1. **Source scanning.** `@import 'tailwindcss' source(none)` turns off automatic scanning. Only
   the folders listed with `@source` are scanned for class names: `packages/`, `pages/`,
   `components/` and `common/`. A new top-level folder with components needs its own `@source`
   line, or its classes won't be generated.
2. **`@theme`.** Design tokens as CSS variables. The variable name decides the utilities it
   creates: `--color-blue-300` → `bg-blue-300`, `text-blue-300`, …; `--spacing-sm` → `p-sm`,
   `m-sm`, …; `--text-base` → `text-base`. The tokens are also real CSS variables at runtime
   (`var(--color-blue-300)`), usable from plain CSS or styled-components.
3. **Compatibility rules (`@layer base`).** These keep the Tailwind 3 look: the default border
   colour is `gray-200`, `body` inherits Open Sans, placeholders are `gray-400`, and buttons get
   `cursor: pointer`. Removing one changes the UI.

## The theme is not Tailwind's default theme

`--<namespace>-*: initial` in `@theme` **removes all of Tailwind's default values** for that
namespace, so only the values listed in the file exist. A class from the Tailwind docs that
isn't defined here **fails silently**: no error, the class produces no CSS.

| Namespace | Reset? | Notes |
|---|---|---|
| Colours (`--color-*`) | yes | Only `black`, `white`, `gray`, `red`, `yellow`, `green`, `indigo`, `purple`, `pink`, `blue`, `blue-light`, `customgray`. **`gray` and `blue` have custom values**: `gray` isn't in light-to-dark order, and `blue-50` is a saturated `#3eacf1`. No `orange`, `slate`, `sky`, `teal`, … |
| Font sizes (`--text-*`) | yes | Only `sm` (11px), `base` (14px), `lg` (16px), `xl` (20px), `xxl` (3rem), `xxxl` (24px). No `text-xs` and no `text-2xl` to `text-9xl`. |
| Font weights (`--font-weight-*`) | yes | Same as the defaults, plus `extrablack` (1000). |
| Shadows (`--shadow-*`) | yes | The Tailwind 3 scale (`sm`, default, `md`, `lg`, `xl`, `2xl`, `inner`, `none`) plus `inbox`. **No `shadow-xs`**, and `shadow-sm`/`shadow` keep their v3 sizes. |
| Spacing (`--spacing-*`) | yes | A fixed list: `0`–`96` (Tailwind 3 steps), `px`, `0_5`, `1_5`, `2_5`, `3_5`, and the named sizes `xxxsm` (5px), `xsm` (15px), `sm` (20px), `md` (30px), `xxl` (60px), `xxxxl` (80px). |
| Everything else | no | Tailwind's defaults apply as documented: `rounded-*`, container sizes (`max-w-3xl`), `leading-*`, `tracking-*`, `blur-*`, breakpoints (`md:`, `lg:`), `font-mono`, `ease-*`, `animate-*`, … |

Utilities that don't come from the theme always work: `flex`, `grid`, `hidden`, `absolute`,
`z-10`, `w-1/2`, and so on. So do arbitrary values: `text-[13px]`, `bg-[#5759ff]`, `p-[7px]`.

### Spacing differs from the v4 docs

- Tailwind 4 normally uses one multiplier (`--spacing: 0.25rem`), so **any** number works
  (`p-13`, `mt-17`). Here only the numbers in the list exist: `p-13` produces nothing.
- Width utilities take the **spacing names first**: `max-w-md` is `30px` and `w-sm` is `20px`,
  not the container sizes from the docs. For container widths, use the sizes that have no
  spacing name of the same name (`max-w-lg`, `max-w-3xl`, …) or an arbitrary value
  (`max-w-[28rem]`).

## Rules

- **For colours, font sizes, shadows and spacing, check `@theme` in `tailwind.css`, not the
  Tailwind docs.** For every other kind of utility, the docs are correct.
- A one-off value: use an arbitrary value (`text-[13px]`). A value you'll reuse: add a variable
  to `@theme` (`--color-brand: #5759ff;` gives `bg-brand`, `text-brand`, …).
- **Write class names as complete strings.** Tailwind reads the files as text, so
  `` `bg-${color}-500` `` is never generated. Use a map of full class names, as
  `packages/ui/components/Button/Button.tsx` does with `classnames`.
- **Put global CSS inside a layer.** Tailwind 4 uses native CSS cascade layers, and unlayered CSS
  beats every utility whatever its specificity. Put element rules in `@layer base` (as
  `globals.css` does) and reusable classes in `@layer components`, so utilities can still
  override them.
- Custom utilities go in `tailwind.css` as `@utility name { … }` (Tailwind 4 syntax).
- v4 renames already applied in the code: `rounded` → `rounded-sm`, `rounded-sm` → `rounded-xs`,
  `outline-none` → `outline-hidden`. These don't apply to shadows, because the shadow scale here
  is custom.
- Some components use styled-components 6. Props used only for styling must be transient
  (`$prop`).

## Checking whether a class exists

When a class seems to do nothing, check two things: the token is in `@theme`, and the file is
inside one of the `@source` folders. To be sure, compile the class against the real config:

```bash
node --input-type=module -e "
import { compile } from '@tailwindcss/node'
import fs from 'node:fs'
import path from 'node:path'
const css = fs.readFileSync('styles/tailwind.css', 'utf8')
const opts = { base: path.resolve('styles'), onDependency() {} }
for (const cls of process.argv.slice(1)) {
  const c = await compile(css, opts)
  const empty = c.build([])
  console.log(cls, c.build([cls]) === empty ? 'NOT GENERATED' : 'OK')
}
" bg-orange-500 p-13 max-w-md
```

`OK` only means the class exists. It doesn't mean it has the value from the docs: `max-w-md`
reports `OK` but is 30px (see above).

## Browser support

Tailwind 4 needs `@layer`, `@property` and `color-mix()`: Safari 16.4+, Chrome 111+, Firefox 128+.
Older browsers get a mostly unstyled app.

See `docs/upgrade-plan-tailwind.md` for why the upgrade made each of these choices.
