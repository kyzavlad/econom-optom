# ECONOM OPTOM

Client-ready wholesale storefront prototype for `econom-optom.pro`.

## Stack
- Next.js 15 / React 19 / TypeScript
- Supabase PostgreSQL + RLS
- Vercel
- Victoria/Forsage catalog snapshot with a dedicated production sync boundary

## Customer journey
Catalog → product → box cart → verified server-side total → wholesale request → manager confirmation.

## Current zero-extra-cost backend
The user chose not to create another billed Supabase project. ECONOM OPTOM therefore uses the existing `dacha-tv-prod` Supabase project as infrastructure only, with strict logical isolation:
- every ECONOM table is prefixed `econom_`;
- the order RPC is `econom_submit_order_request`;
- existing Dacha TV tables are not reused or modified by the storefront;
- RLS exposes only active ECONOM products publicly;
- order/sync tables have no public table policies.

The deployed shared-backend schema is `supabase/shared_backend/001_econom_optom.sql`. The older files under `supabase/migrations` document the standalone-project path and must not be applied to the shared Dacha TV database.

## Supplier boundary
The supplier is an assortment source, not the store database. A future authorized Victoria/Forsage sync writes a normalized snapshot into `econom_products`. The storefront reads that snapshot, so a temporary supplier outage cannot erase the last successful catalog state or order history.

## Local development
```bash
npm install
npm run typecheck
npm run build
npm run dev
```

## Release rules
- keep preview `noindex` until client approval;
- use this repository as the code source of truth;
- use the existing canonical `econom-optom` Vercel project;
- do not create a second billed Supabase project without explicit approval;
- never touch Dacha TV production tables for ECONOM application logic;
- do not enable production supplier synchronization without official credentials and a dry-run diff.
