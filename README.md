# Crispy Katta

Campus food-ordering platform (Next.js + Supabase).

## Setup
1. Copy `.env.example` to `.env.local` and fill values.
2. Apply `supabase/migrations/0001_init.sql` to your Supabase project.
3. `npm install`
4. `npm run dev`

## Env vars (names only)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_EMAIL
- ADMIN_PASSWORD_HASH
- NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_WHATSAPP_NUMBER
- NEXT_PUBLIC_STORE_NAME

## Tests
`npm run test` (vitest), `npm run typecheck`, `npm run lint`, `npm run build`.
