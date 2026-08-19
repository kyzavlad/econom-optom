# ECONOM OPTOM

Client-ready wholesale storefront prototype for `econom-optom.pro`.

## Stack
- Next.js 15 / React 19 / TypeScript
- Supabase PostgreSQL with RLS
- Vercel
- Victoria/Forsage catalog snapshot with a production sync boundary

## Current preview
The storefront is intentionally `noindex` until client approval and production cutover.

## Local development
```bash
npm install
npm run typecheck
npm run build
npm run dev
```

Copy `.env.example` to `.env.local` and provide the Supabase project URL and publishable key when the dedicated project is created.
