# ECONOM OPTOM

Client-ready wholesale storefront prototype for `econom-optom.pro`.

## Stack
- Next.js 15 / React 19 / TypeScript
- Supabase PostgreSQL + RLS
- Vercel
- Victoria/Forsage catalog snapshot with a dedicated production sync boundary

## Customer journey
Catalog → product → box cart → verified server-side total → wholesale request → manager confirmation.

## Data architecture
The supplier is an assortment source, not the store database. A sync job writes a normalized product snapshot into Supabase. The storefront reads the local snapshot; orders are stored independently. Supplier outages therefore do not remove previously synchronized catalog data or order history.

The repository contains only a photo-verified client preview subset until official Victoria/Forsage API/export access is provided. We never generate fake product imagery. The production connector must ingest the official source, upsert changed products and safely archive missing SKUs.

## Local development
```bash
npm install
cp .env.example .env.local
npm run typecheck
npm run build
npm run dev
```

## Release rules
- keep preview `noindex` until client approval;
- use this repository as the code source of truth;
- use the existing canonical `econom-optom` Vercel project;
- use a dedicated `econom-optom` Supabase project;
- do not enable production supplier synchronization without official credentials and a dry-run diff.
