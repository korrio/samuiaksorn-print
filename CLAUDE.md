# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm install          # node_modules is not committed and is often absent — install before build/lint
npm run dev          # dev server with Turbopack
npm run build        # production build (the only real type-check: tsc has no standalone script)
npm run start
npm run lint         # next lint (eslint-config-next, core-web-vitals + typescript)
```

There is no test framework configured — no Jest/Vitest/Playwright, no test files. Verify changes by
loading a real job and checking the screen plus the print preview.

**Testing URL: https://print.erpsamuiaksorn.com/** — the deployed app, backed by live Odoo data; open
a job as `https://print.erpsamuiaksorn.com/?id=<lead_id>`. Use it to reproduce behaviour against real
leads (property values, related jobs, print layout) instead of hunting for local fixtures. Locally
the same paths work under `http://localhost:3000` once `npm run dev` is running.

## Architecture Overview

Next.js 15 App Router frontend over a **custom REST wrapper around Odoo 16**. The core domain object
is a `crm.lead` record that the print shop (โรงพิมพ์สมุยอักษร) treats as a print job order
("ใบสั่งงาน"). The UI is almost entirely in Thai.

### Backend hosts

All data comes from external services; this app has only one route handler of its own (`/api/og`).

| Host | Used for |
| --- | --- |
| `NEXT_PUBLIC_API_URL` → `https://api.erpsamuiaksorn.com` | Odoo model REST wrapper: `/api/crm.lead`, `/api/crm.lead/{id}`, `/api/crm.lead/by-job/{jobNo}`, `/api/crm.lead/search_read`, `/api/crm.stage`, `/api/crm.team.member`, `/api/res.partner/{id}`, `/api/auth/*`, `/api/notifications/*` |
| `https://erpsamuiaksorn.com` (hardcoded) | `/api/crm/lead/{id}/timeline` |
| `https://dashboard-api.erpsamuiaksorn.com` (hardcoded) | `/api/crm/activities/recent` |
| `https://print.erpsamuiaksorn.com` (hardcoded) | base for OG image URLs in metadata |

The wrapper returns `{ success: boolean, data: T }` for model endpoints but `{ error: boolean, data }`
for the timeline endpoint — check which shape you are consuming. Odoo many2one fields arrive as
`[id, display_name]` tuples or `false`; empty values are `false`, not `null`.

Writes are `PUT /api/crm.lead/{id}` with a partial body (`{ stage_id }`, `{ lead_properties: [...] }`).
`lead_properties` writes send only the changed entries, not the whole array.

### `lead_properties` — opaque 16-hex keys

Odoo 16 Properties fields are addressed by generated hex ids, not names. Every job field (JOB NO,
paper, printer, page count, …) is an entry in `lead.lead_properties` looked up by `name`:

```ts
const prop = lead.lead_properties.find(p => p.name === "2f9b502ecd32baca");
```

These keys are hardcoded throughout the components and are the single biggest source of bugs
(see commit `e6411e2`, "use correct property key … for paper/material"). When adding a field, copy
the key from the main job table in `components/PrintJobPageV2.tsx` rather than guessing. Current
mapping as used in `PrintJobPageV2`:

| Key | Field |
| --- | --- |
| `2f9b502ecd32baca` | JOB NO. |
| `c800637841b7aff1` | related/old leads (array of `[id, name]`) |
| `05545f6d64cf2f2e` | เครื่องพิมพ์ (printer; writable select, options list in `printerOptions`) |
| `b1f8d75d35d06603` | ผู้รับงาน (written by "accept job") |
| `1f489f8b812714ab` | กระดาษ/วัสดุ |
| `cfa88ab31faaa9e3` | ช่างอาร์ต |
| `cfd03e83e1f2ad7b` | ช่างพิมพ์/ปริ้น |
| `1c1029ef80193852` | เล่มที่ |
| `eb1bdca381cad707` | จำนวนหน้า/เล่ม |
| `a1c403ebe63df23d` | จำนวนใบ/ชุด |
| `c1454aabcb10809c` | จำนวนพิมพ์ |
| `8995a01cd158af5e` | ขนาดระบุ |
| `1f90378ffeb5b087` | สีพิมพ์ |
| `2bd3d4bb377c3ec4` | สีพิมพ์ (ชุดเก่า) |
| `b480cd0a8f660acb` | หลังพิมพ์ |
| `be4eaaad4563df0f` | เลขที่ No. |
| `13915b99e3484da1` | ราคาต่อหน่วย |
| `d788801775fe4bf4` | ลำดับสีกระดาษ |
| `a650bebd1ba8f7c2` | Job PL / อาร์ตเก่า |
| `f97e8d714c4323ac` | Stock งาน |

`type: 'selection'` properties store the option key in `value`; resolve the label via
`prop.selection.find(o => o[0] === prop.value)[1]` — the `getPropertyValue*` helpers already do this.

### Routes and entry points

- `/?id=<lead_id>` — **the real print-job URL.** `app/page.tsx` reads `searchParams`, generates
  metadata + OG image, then renders the job; with no `id`/`job` it renders `LeadSearch` +
  `RecentActivities` instead.
- `/lead/[id]` — exists only for metadata/link previews; `redirect()`s to `/?id=...`.
- `/crm/[partner_id]` — customer-facing portal (`CustomerPortal`, tabbed: dashboard / orders /
  loyalty / settings). `app/crm/layout.tsx` swaps in the Noto Sans Thai font for this subtree.
- `/crm/dashboard`, `/crm/dashboard/new`, `/crm/dashboard/mock` — recharts analytics dashboards.
  **Note:** the first two read `process.env.REACT_APP_API_URL` with a `http://localhost:3001`
  fallback — a CRA leftover that never resolves in Next.js, so they effectively only work against a
  local API or fall back to the bundled `data.json`. `mock/` is fully static.
- `/api/og` — `next/og` `ImageResponse` (edge runtime) rendering a job summary card.

### Which print-job component is live

`app/page.tsx` renders **`components/PrintJobPageV2.tsx` for both desktop and mobile** (the mobile
branch's `PrintJobPageMobile` import is commented out). Despite the breakpoint wrappers there is
currently no separate mobile experience.

Dead code — do not edit these expecting to see changes, and prefer deleting over reviving:
`components/PrintJobPage.tsx`, `components/PrintJobPageV1.tsx`, `components/PrintJobPageMobile.tsx`,
`components/TableModeLeadDetails.tsx`, `print-job-details.tsx` (stray file at repo root). They are
earlier copies of the same screen and still contain stale property keys.

### Printing

`handlePrint()` in `PrintJobPageV2` does **not** use a print stylesheet. It replaces
`document.body.innerHTML` with the `printRef` subtree wrapped in an inline `<style>` block
(A4 `@page`, grid overrides, font sizes) and calls `window.print()`. Consequences:

- Print-specific CSS lives inside that template string, keyed off element ids and class names
  (`#old-job-table`, `#related-main`, `.related-lead-properties`, `.card`, `.no-print`, `.see-more`).
  Renaming a class in JSX silently breaks the print layout.
- Interactive controls are hidden from print via `.no-print` / `button { display: none }`; where a
  control must still print a value, the markup carries both a `hidden print:inline` plain-text span
  and the live control (see the printer dropdown).

### Related ("ข้อมูลเก่า") jobs

Two sources, in order: the `c800637841b7aff1` property array, else a fallback search by
`partner_id` + a name fragment (`leadName.slice(7, 10)`) limited to 3. Each related lead renders one
of two ways — a parsed HTML table from `lead.description` (`parseTableToJSON`), or the
`lead_properties` grid — so **a field added for related jobs usually has to be added to both
branches**.

### Client-side state (localStorage only — no auth provider, no server sessions)

| Key | Written by |
| --- | --- |
| `crm_current_user` | `hooks/useCurrentUser.ts` — the shop-floor user who "accepted" a job |
| `customer_auth_<partner_id>` | `utils/customerAuth.ts` — customer portal, phone/email code, 24h expiry |
| `deletedRelatedLeads_<lead_id>` | `PrintJobPageV2` — related jobs hidden locally, never deleted server-side |

### Conventions in this codebase

- Data fetching is inconsistent by design/history: `hooks/useFetchLeadById.ts` (axios, exposes
  `refetch` and `silentRefetch`) for the main lead, bare `fetch` inside component functions for
  stages/team/timeline/related, `hooks/useCustomerData.ts` for the portal.
  `hooks/useStageManager.js` duplicates stage logic already inlined in `PrintJobPageV2` and is unused.
- User-facing dialogs are SweetAlert2 (`Swal.fire`) with Thai copy and the green/red confirm-button
  colors `#10b981` / `#ef4444`; all user-visible strings are Thai.
- Stage/team names drive emoji lookup tables (`getStageEmoji`, `getTeamEmoji`) keyed on the Thai
  name, and stage advancement only offers stages after the current one, excluding
  `['การเงิน', 'งานเก่า']`.
- The large components start with `/* eslint-disable @typescript-eslint/no-explicit-any */` and
  carry commented-out blocks and `console.log`s; `any` is pervasive on API payloads.
- `next.config.mjs` sends `Cache-Control: public, max-age=0, must-revalidate` on every route — the
  app is treated as always-fresh; server-side metadata fetches use `next: { revalidate: 300 }`.
- shadcn/ui ("new-york", neutral base, cssVariables) in `components/ui`; add components with the
  shadcn CLI rather than hand-writing them. Path alias `@/*` → repo root.
