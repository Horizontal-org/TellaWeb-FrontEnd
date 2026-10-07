# Manual checks for the upgrade releases

What a person should check on **beta** before each upgrade release goes to production. The e2e suite (`e2e/`) runs locally against a local backend; this list covers what it can't: real devices, real email, other browsers, long sessions, real data and the deployed environment.

**Legend**
- 🧑 **manual only**: the e2e suite doesn't cover it. Needs a person.
- 🤖 **covered by e2e locally**: a quick spot check on beta is enough (different environment, real data).

Keep this file up to date: every upgrade step adds the checks it needs to the release it ships in.

---

## 1. Release focus: what changed and where to look

Check these first for the release being tested, then run section 2.

### Next.js beta drop #1 (`e09fb53`, still Next 12)
| Change | Check |
|---|---|
| Docker image on Node 22 | 🧑 Container starts on the beta server; the app loads over the beta domain (HTTPS, `/api` reaches the backend) |
| Babel → SWC compiler | 🧑 styled-components look right: 2FA passcode boxes (login), password strength meter, 2FA setup steps |
| `backupsApi` middleware fix | 🧑 Admin Center → backups: generate a backup, the list refreshes by itself, download it, delete it |
| `@divviup/dap` import change | 🧑 With analytics enabled (Admin Center), log in: a request goes to `dap-09-3.api.divviup.org` (browser network tab), no console errors |
| Minor/patch updates (axios, RTK 1.9, React 18.3) | 🤖 General regression (section 2) |

### Next.js beta drop #2 (branch tip of `upgrade/nextjs`, Next 16.3)
| Change | Check |
|---|---|
| Turbopack production build (webpack before) | 🧑 Every main page loads in **Chrome, Firefox and Safari**; no console errors |
| New `next/image` | 🧑 Logos (login, sidebar, splash, logout, `/verify`) keep their size; the report **image viewer** fits large and small images, portrait and landscape, without distortion |
| next-i18next 16 | 🧑 `/es/login` shows "Ingresar"; switching `/es/...` URLs doesn't break pages |
| Error toasts (`errorMessage()` helper, 19 places) | 🧑 Trigger a few real errors: create a user with an existing email, a project with an invalid or duplicate name, upload a resource with a taken name. The toast shows the backend's message |
| Login response typing (`refresh_token` stored) | 🧑 Token refresh after a real 15+ minute idle (section 2.1) |
| Lint fixes (list keys, `publicRoutes`) | 🤖 `/login` and `/verify` reachable while logged out |

### Dependency beta drop #1 (`upgrade/dependencies` after step 4)
| Change | Check |
|---|---|
| qrcode.react 4 | 🧑 **Scan with a real phone:** the 2FA setup QR (with an authenticator app) and the remote configuration share QR (with Tella, see 2.8) |
| react-to-print 3 | 🧑 Remote configuration → Share → **Print**: the print dialog shows only the QR code, not the whole page |
| react-icons 5 | 🤖 Icons look the same (menu, buttons, media controls, file-type thumbnails) |
| date-fns 4 | 🧑 Dates and times on real data: report list and report info (date and time), backups list, project and resource lists |
| Redux Toolkit 2 | 🤖 General regression: lists refresh after create, edit and delete; nothing shows stale data after navigating back and forth |
| CASL 7 | 🧑 Log in as **each role** on beta (section 2.2) |
| Storybook removed | Nothing to check in the app |
| protobufjs and `ConfigurationPanel` removed (unused code) | 🧑 Remote configuration → Share → scan with Tella on a phone: the configuration applies (the QR is JSON, unchanged); edit crash reports settings and check they save |

### Dependency beta drop #2
| Change | Check |
|---|---|
| React 19 | 🧑 General regression (section 2), with attention to: forms and dialogs (react-modal), search boxes (focus, typing), the audio and video players, the 2FA passcode boxes, print from Share configuration. Browser console: no new errors |
| `defaultProps` → default parameters (12 components) | 🧑 Buttons keep their default style (primary vs secondary), menu buttons and nav buttons look right, report thumbnails and the image viewer still respond to clicks |
| Table rewritten on TanStack Table (9) | 🧑 On every list (users, resources, reports, configurations, project reports/users/resources): rows look the same; clicking a row selects it (checkbox appears, toolbar actions show); header checkbox selects all (and shows a dash when only some rows are selected); clicking a column header sorts (arrow shows, order flips on second click); hover shows the row's actions |
| Pagination fix (lists stopped at 25 items) | 🧑 On a list with **more than 25 items** (reports on beta likely): the pager shows the right number of pages, next/previous load the other pages, and searching updates the page count |
| styled-components 6 (transient props, built-in types) | 🧑 These components look and behave as before: 2FA passcode boxes (login), password strength meter (create user, change password), "Add users / resources to project" search box (border, selected chips, results list), Feedback button, PDF viewer close button, "exit 2FA setup" confirmation buttons, "use a backup code" link |

### Tailwind 4 beta drop (`upgrade/tailwind`, via 3.4)
| Change | Check |
|---|---|
| Tailwind 4, CSS built from source (was a stale pre-built file) | 🧑 **Side-by-side with production** on the main pages and dialogs: colours, spacing, fonts, borders (light grey, not dark), corner rounding, shadows. Expected differences only: toasts now **fade out** (the fade classes were missing before), and the "Name" column in lists may be slightly wider (`w-40` now applies) |
| Body font restored to Open Sans | 🧑 Report page side panel and other text-heavy areas use Open Sans, not the system font |
| `globals.css` moved into a CSS layer | 🧑 Links look the same; the volume/progress sliders in the audio/video players, radio buttons (create user role) and checkboxes look as before; the loading animation (double bounce) still plays |
| v3 defaults kept | 🧑 Placeholders in inputs are light grey; the mouse shows a pointing hand over buttons |
| Deprecated classes replaced | 🧑 Dialog backdrops are semi-transparent black; menu items show a light grey on hover; long project URLs in project settings end with "…" |
| **Browser support changed** | 🧑 Works on Safari 16.4+, Chrome/Edge 111+, Firefox 128+. **Older browsers (Windows 7/8.1, old macOS, iPhone 7 and older) will show a broken layout: expected and accepted.** If a user reports a broken layout, check their browser version first |

---

## 2. Full regression

### 2.1 Authentication and session
- [ ] 🤖 Log in with email and password, then log out
- [ ] 🧑 Wrong password shows an error and stays on `/login`
- [ ] 🤖 Logged-out users opening any page are sent to `/login`
- [ ] 🧑 **Token refresh in real use:** stay logged in, idle for 20+ minutes, then click around. Still logged in, no errors
- [ ] 🧑 Reload the page while logged in: still logged in
- [ ] 🧑 Two tabs: log out in one, the other goes to `/login` on its next action
- [ ] 🧑 **2FA with a real authenticator app:** Settings → enable 2FA → scan the QR → enter the code → save the backup codes → log out → log in with a code from the app
- [ ] 🧑 2FA login with a **backup code** ("use a backup code instead")
- [ ] 🧑 Disable 2FA from Settings
- [ ] 🧑 Suspicious-login flow (backend flags the login): the "suspicious" screen shows instead of logging in
- [ ] 🧑 Email verification link from a real email opens `/verify` and works
- [ ] 🧑 Change your own password in Settings, then log in with the new one

### 2.2 Roles and permissions
- [ ] 🤖 **Admin:** sees Projects, Users, Resources, Admin Center, Settings, Help, Logout
- [ ] 🤖 **Editor:** Projects (can create), Settings, Help, Logout; `/user`, `/resource`, `/admin-center` show 404
- [ ] 🤖 **Viewer:** Projects (read only, no "NEW"), Settings, Help, Logout; same 404s
- [ ] 🤖 **Reporter:** can't log into the web app
- [ ] 🧑 Editor and viewer only see the projects they belong to; opening another project's URL directly is refused
- [ ] 🧑 Viewer can open reports and files but has no edit or delete actions

### 2.3 Projects
- [ ] 🤖 Create, rename, delete (delete needs the name and "DELETE")
- [ ] 🧑 Copy the project URL; edit the URL (slug)
- [ ] 🤖 Add a user and a resource to a project
- [ ] 🧑 Remove a user or resource from a project
- [ ] 🧑 Project page lists its reports; search, sort and pagination work

### 2.4 Reports (data from the Tella mobile app)
- [ ] 🧑 **Send a report from a phone** running Tella to a beta project: it appears in the web app with all its files
- [ ] 🧑 Report viewer: **image** (fits, click to enlarge if available), **video** (play, pause, seek, volume, fullscreen, ±10 s), **audio** (play, seek, time display), **PDF/other** files
- [ ] 🧑 Move between files with the arrows and thumbnails; "1 OF N" counter updates
- [ ] 🧑 **Download** a single file and the whole report
- [ ] 🧑 Edit the report title; delete a report; batch-delete several from the list
- [ ] 🧑 Report information panel: date, time, author, ID, device info, file information

### 2.5 Resources
- [ ] 🤖 Upload a PDF, download it, delete it
- [ ] 🧑 Uploading a file with a name that's already taken is refused with a message
- [ ] 🧑 PDF over 20 MB is refused
- [ ] 🧑 **Open** a PDF: it renders in the viewer (real browser PDF plugin)
- [ ] 🧑 Preview panel; download several resources at once
- [ ] 🧑 A resource attached to a project is visible to that project's users on Tella mobile

### 2.6 Users
- [ ] 🤖 Create a user (each role), change role, delete
- [ ] 🤖 Existing email shows the backend's error
- [ ] 🧑 Change another user's password; edit the note; batch-delete
- [ ] 🧑 Search the user list; open a user from the list

### 2.7 Admin Center
- [ ] 🧑 Toggle global settings (for example analytics): the page refreshes and the setting sticks
- [ ] 🧑 Backups: generate, wait for completion, download (file opens), delete
- [ ] 🧑 App version shown matches the release

### 2.8 Remote configurations (reachable at `/configuration`; hidden from the menu)
- [ ] 🤖 Create and delete
- [ ] 🧑 Edit name, camouflage, crash reports and servers settings
- [ ] 🧑 **Share → scan the QR code with Tella on a phone:** the configuration is applied in the app
- [ ] 🤖 Share → Download gives `qrcode.png`
- [ ] 🧑 Share → Print shows only the QR code

### 2.9 Settings (own account)
- [ ] 🧑 Change email or username
- [ ] 🧑 Change password (2.1)
- [ ] 🧑 Enable and disable 2FA (2.1)

### 2.10 General
- [ ] 🧑 **Browsers:** Chrome, Firefox, Safari (desktop). Note the versions tested
- [ ] 🧑 **Visual comparison with production:** main pages side by side (layout, spacing, fonts, icons)
- [ ] 🧑 **Browser console:** no new errors while using the app
- [ ] 🧑 Toasts appear for success and errors. Known bug: a toast shown within 5 s of another can disappear early
- [ ] 🧑 Spanish URLs (`/es/...`) load
- [ ] 🧑 Narrow window (laptop size): sidebars and tables still usable

---

## Results

Record each run here or in the release ticket.

| Release | Date | Tested by | Browsers | Result / issues |
|---|---|---|---|---|
| Next.js beta #1 | | | | |
| Next.js beta #2 | | | | |
| Dependencies beta #1 | | | | |
| Dependencies beta #2 | | | | |
| Tailwind 4 | | | | |
