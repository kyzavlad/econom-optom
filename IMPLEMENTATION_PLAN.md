# ECONOM OPTOM — client preview and production path

## Goal
Show a credible modern wholesale store now, while keeping a production-safe path to the client's complete Victoria/Forsage catalog.

## Architecture
Official Victoria/Forsage feed → isolated normalization/sync → Supabase product snapshot → Next.js storefront.
Wholesale requests are validated and totals are recalculated server-side before they are written to our own order table.

## Preview scope already implemented
- premium responsive storefront;
- only real product photography, with a neutral no-image state instead of generated art;
- category, season, audience, search and price filters;
- product pages, box pricing, persistent cart and checkout;
- server-side cart validation/recalculation;
- admin preview of catalog/sync architecture;
- Supabase schema + RLS + seed;
- `noindex` until approval.

## Production sync contract
1. Fetch the official catalog with authenticated Victoria/Forsage access.
2. Validate a dry-run payload before mutations.
3. Normalize stable source ID, SKU, title, category, audience, season, material, price, pack size, size grid, images and source timestamps.
4. Upsert new/changed products into Supabase.
5. Mark missing products inactive only after a complete successful supplier run; never hard-delete order history.
6. Record counts/errors in `sync_runs` and alert on partial/failed cycles.

## External inputs still required
- official Victoria/Forsage API/export credentials for complete automated catalog ingestion;
- merchant details/payment method only if online payment enters agreed scope;
- final delivery/contact/legal content;
- client approval before indexing/domain cutover.

## Client-preview definition of done
- exact GitHub commit verified;
- Vercel build/typecheck successful for that commit;
- homepage/catalog/product/checkout/admin render successfully;
- dedicated Supabase project connected and RLS/advisors checked;
- at least one test order persists end-to-end;
- no fake product images or unverified business claims;
- production domain remains untouched until approval.
