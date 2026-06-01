# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

NGO donor-management platform ("Plataforma ONG") built for a hackathon. Lets staff log in, register donors, take recurring donations via MercadoPago, and email donors via Resend. UI text is in Spanish.

This is an **early-stage scaffold**: many files under `src/components/` and `src/lib/server.ts`, plus `src/types/payment.ts` and `src/types/subscription.ts`, are intentionally empty stubs awaiting implementation. Don't assume a stub is complete — open it before wiring against it.

## Commands

```bash
npm run dev     # Next.js dev server at http://localhost:3000
npm run build   # production build
npm run start   # serve production build
npm run lint    # eslint (flat config, eslint-config-next)
```

No test framework is configured.

### Local setup
Create a Supabase project, run `DB scripts/db.sql` against it to create tables and RLS policies, then set env vars (see below).

## Architecture

- **Next.js 16 App Router** with React 19 and the React Compiler enabled (`reactCompiler: true` in [next.config.ts](next.config.ts)) — do not hand-add `useMemo`/`useCallback` for perf; the compiler handles memoization.
- **Routing is not wired up yet.** [src/app/page.tsx](src/app/page.tsx) is a placeholder. The screen components live under `src/app/pages/` (`DashboardPage`, `DonorsPage`, `LoginPage`, `DonatePage`, `ProfilePage`) but have no route segments — there are no `app/dashboard/page.tsx` style routes yet. When adding navigation, create App Router route folders that render these page components.
- **Server vs. client data access:**
  - [src/lib/client.ts](src/lib/client.ts) — browser Supabase client built on `NEXT_PUBLIC_*` env vars. Client components (e.g. [DonorForm.tsx](src/components/DonorForm.tsx), `"use client"`) import this and call Supabase directly.
  - Server Components (e.g. [DonorsPage.tsx](src/app/pages/DonorsPage.tsx)) are `async` and currently also import the same `client.ts`. `src/lib/server.ts` is an empty stub intended for an SSR/service-role Supabase client (`@supabase/ssr` is already a dependency) — implement it there when server-side auth/cookies are needed rather than reusing the anon client.
- **Auth:** Supabase magic-link OTP (`signInWithOtp` in [LoginPage.tsx](src/app/pages/LoginPage.tsx)), redirecting to `/dashboard`. `profiles` table links to `auth.users`.
- **Payments:** MercadoPago SDK configured in [src/lib/mercadopago.ts](src/lib/mercadopago.ts). The `DonatePage`/`DonationForm` flow and webhook handling are not yet implemented.
- **Email:** Resend client in [src/lib/resend.ts](src/lib/resend.ts); templates are React Email components in `src/emails/` (`WelcomeEmail`, `PaymentSuccess`, `PaymentFailed`).

## Data model

Defined in [DB scripts/db.sql](DB%20scripts/db.sql). Tables: `profiles` (staff, FK to `auth.users`), `donors`, `subscriptions` (FK `donor_id`, recurring `amount`/`status`), `payments` (FK `donor_id`, `mercadopago_id`), `communication_logs` (FK `donor_id`, email/channel audit). Only `donors` currently has RLS enabled, with permissive policies allowing any authenticated user full CRUD. TS types in `src/types/` mirror these tables but only `donor.ts` is filled in.

## Conventions

- Import alias `@/*` maps to `src/*` (see [tsconfig.json](tsconfig.json)).
- Styling is **Tailwind v4** via PostCSS (`@tailwindcss/postcss`); `@mui/material` + Emotion are installed but not yet used. Match the surrounding utility-class style.
- Secrets are read from env at module load with non-null assertions (`process.env.X!`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `MERCADOPAGO_ACCESS_TOKEN`, `RESEND_API_KEY`. `.env*` is gitignored.
</content>
</invoke>
