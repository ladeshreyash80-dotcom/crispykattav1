# Crispy Katta — Campus Café & Snacks · Ordering Kiosk

A mobile-first food-ordering kiosk for **Crispy Katta**, the college food stall
at Campus Gate No. 2. Guests browse the menu, customize items, check out as
guests, and track orders — **no accounts, no OTP, no phone verification**.
The phone number is used purely as contact info.

---

## Feature status (only what is implemented and tested)

| Area | Status |
| --- | --- |
| Home page — hero, popular items, category tiles, CTAs | ✅ Implemented |
| Menu page — category filters, live search, sold-out handling | ✅ Implemented |
| Item detail — size, spice level, add-ons, quantity, note | ✅ Implemented |
| Cart — quantity controls, line totals, free-delivery progress, persisted | ✅ Implemented |
| Guest checkout — name, phone, delivery/pickup, address, payment on hand | ✅ Implemented |
| Checkout — Zod server-style validation, server-side re-pricing, idempotency UUID | ✅ Implemented (+ tests) |
| Order confirmation — unique `CK-XXXXXX` reference + copy button | ✅ Implemented |
| Order tracking — reference + phone verification, live status timeline | ✅ Implemented |
| Store page — hours, delivery area/fees, contact, photos | ✅ Implemented |
| Terms & privacy pages | ✅ Implemented |
| Feedback — public form + rating, admin can read | ✅ Implemented |
| Katta Rewards — 1 point per ₹10 on delivered orders; 100 points = ₹50 off | ✅ Implemented prototype |
| Rewards admin view — balances and credited-order count | ✅ Implemented prototype |
| Admin dashboard — orders (filter/search/advance/cancel), menu CRUD, categories CRUD, feedback, store settings | ✅ Implemented |
| Admin auth — passcode gate, SHA-256 hashed, session-only | ✅ Implemented (single-device kiosk gate) |
| Supabase Postgres adapter | ✅ Implemented, activates via env vars (see below) |
| Local adapter | ✅ Default — every feature works with zero config |
| Payment gateway | ❌ Not implemented — pay on hand (cash/UPI) by design |

## Tech stack

- **Next.js App Router + TypeScript, React, Tailwind, Supabase Postgres, Zod, Node LTS, npm** was the requested stack.
- The repository was provisioned with **Vite + React 19 + TypeScript + Tailwind v4**, so the app is built on that toolchain and ships from it. The service layer is written to map 1:1 onto Next.js App Router — see **docs/NEXT_MIGRATION.md**. All other requested pieces are in place:
  - **TypeScript + React 19** ✅
  - **Tailwind CSS v4** ✅ (custom brand theme in `src/index.css`)
  - **Zod validation** ✅ (`src/lib/validation.ts`, used by the order/catalog/feedback services)
  - **Supabase Postgres** ✅ (`src/lib/store/supabase.ts` + `docs/schema.sql` with RLS)
  - **npm with committed lockfile** ✅ (`package-lock.json`)

## Quick start

```bash
npm install        # installs deps (lockfile included)
npm run dev        # dev server
npm run build      # type-check + production build
npm run preview    # serve the production build locally
```

The app runs **out of the box** in standalone mode: menu, cart, checkout,
orders, admin and feedback all persist to the browser's localStorage.

### Testing

Automated service-layer tests (Zod validation, pricing math, min-order rules,
idempotent order creation, tracking privacy, status simulation, admin gate,
category delete-guard):

```bash
npm run smoke
```

Manual test script:

1. Open `/menu`, add a **Samosa (₹20)** and a **Majito (₹49)** → cart.
2. Open `/cart` — check the free-delivery progress bar (₹199 threshold).
3. Checkout as **delivery** with a 10-digit phone → below ₹99 minimum you get
   a validation error; add a **Margherita (₹159)** and retry → order placed
   with a `CK-XXXXXX` reference.
4. Refresh mid-checkout and re-submit → the idempotency key returns the same
   order instead of creating a duplicate.
5. Open `/track`, enter the reference + phone → timeline advances from
   *placed → on the kadai → ready → out for delivery → delivered* (demo
   clock). A wrong phone is refused.
6. Open `/admin`, sign in with the demo passcode **`katta-admin`** → advance
   order status, toggle an item sold-out, edit prices, add a category, read
   feedback, change the delivery fee.
7. Verify the sold-out item disappears from checkout with a clear error.

## Configuration

Copy `.env.example` to `.env` (`.env*` is gitignored — no secrets are
committed or exposed in client code beyond the public Supabase anon key):

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL | — (local mode) |
| `VITE_SUPABASE_ANON_KEY` | Supabase **anon** key (public, RLS-protected) | — (local mode) |
| `VITE_ADMIN_PASSCODE` | Admin passcode, stored as SHA-256 | demo `katta-admin` |

### Supabase Postgres (production)

1. Create a Supabase project.
2. Run **`docs/schema.sql`** in the SQL editor (tables + RLS + indexes).
3. Set the two `VITE_SUPABASE_*` vars. The app then persists menu, orders, feedback, and prototype loyalty balances to Postgres instead of localStorage.
4. Set `VITE_ADMIN_PASSCODE` and remove the demo fallback before going live.

> The menu/order **business rules** (validation, re-pricing, idempotency,
> min-order, tracking privacy) live in `src/lib/orders.ts` / `catalog.ts` and
> run identically in both modes. In a multi-device production deployment,
> admin writes should move behind a server route using the Supabase service
> role key — see `docs/NEXT_MIGRATION.md`.

## Deployment (Vercel)

1. Push to GitHub.
2. Import the repo in Vercel — framework **Vite**, build command
   `npm run build`, output `dist`.
3. Add the env vars above in the project settings.
4. `vercel.json` already contains the SPA rewrite so deep links
   (`/menu`, `/order/CK-XXXXXX`, `/admin`) work.

## Business rules & security compliance

| Rule from the brief | Implementation |
| --- | --- |
| No OTP / phone verification / customer login | Guest checkout; phone is a plain contact field validated by Zod (`/^[6-9]\d{9}$/`) |
| No fake logins or dead buttons | Every control is wired: cart, checkout, tracking, admin CRUD, feedback, settings |
| Only claim what runs | Feature table above; failures documented, demo modes labeled in-app |
| No secrets in client code / no `.env` commits | Only public anon key is read; `.env*` in `.gitignore`; `.env.example` committed |
| Don't touch existing databases | The app only uses its own new Supabase tables / device localStorage; no external DB connections |
| Single app root | One Vite app at repo root, no nested app dirs |
| Checkout: product IDs + quantities + idempotency UUID | `sessionStorage`-persisted UUID; retries return the same order |
| Server validates & responds with unique reference | `createOrder()` → Zod → idempotency check → availability → re-price → `CK-XXXXXX` |
| Efficient schema + admin authorization | `docs/schema.sql` (indexes, RLS, JSONB order snapshots); admin passcode gate |

## Feedback mechanisms

- Public feedback form on `/store` (name, 1–5 stars, message) with Zod
  validation; recent feedback displays on the same page.
- Admin reads all feedback under `/admin/feedback` with average rating.
- Order-level channel: phone number on orders for cancellations.

## Known demo behaviours (documented, not hidden)

- **Order status auto-advance**: in the order timeline, statuses progress on
  a demo clock (1 min → preparing, 6 → ready, 14 → out for delivery,
  25 → delivered). Admin status updates always win over the simulation.
- **Standalone mode** (no Supabase env): data persists on the device running
  the kiosk. "Reset demo data" in admin settings restores the seed menu.
- **Admin gate** is a single-device passcode; production deployments should
  move it server-side (linked guide).

## Project structure

```
src/
  lib/
    types.ts / validation.ts / format.ts     # domain + Zod + helpers
    seed.ts                                  # real menu board data (42 items)
    orders.ts / catalog.ts / feedback.ts     # service layer (validation + rules)
    admin.ts                                 # passcode gate (SHA-256)
    cart.tsx / toast.tsx / storefront.tsx    # state providers
    store/                                   # adapter pattern
      adapter.ts  local.ts  supabase.ts  index.ts
  components/                                # Header, ItemCard, StatusTimeline…
  pages/                                     # Home, Menu, Item, Cart, Checkout…
  pages/admin/                               # Orders, Menu, Categories, Feedback, Settings
docs/
  schema.sql                                 # DDL + RLS for Supabase
  NEXT_MIGRATION.md                          # Next.js App Router mapping
scripts/smoke.ts                             # service-layer tests (npm run smoke)
```
