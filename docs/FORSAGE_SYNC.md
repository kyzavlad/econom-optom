# Victoria / Forsage synchronization boundary

## Confirmed public integration behavior
Forsage has an API integration flow and exposes an API Token in the supplier account profile. Public historical documentation examples describe token delivery either as a request parameter or as `Authorization: Bearer <token>`.

Forsage also supports push notifications to a URL configured in the supplier profile. Public examples use JSON shaped like:

```json
{"product_ids":[1432,5436],"change_type":["BaseChars","OtherChars"]}
```

Known change classes include `BaseChars`, `OtherChars`, and `NewProduct`. Base changes can include SKU, availability, purchase/sale price and product photos.

## Econom Optom design
1. The webhook receiver authenticates with an additional ECONOM secret and writes only IDs/change types into `supplier_events` using the server-only Supabase service role.
2. A worker fetches authoritative product records from the official Forsage API using `FORSAGE_API_KEY`.
3. The worker normalizes and upserts the local `products` snapshot.
4. Missing products are archived only after a complete successful full reconciliation, never because of one partial event/run.
5. Each full sync is logged in `sync_runs`; partial/failed cycles remain visible and do not silently delete products.

## Credentials required before activation
- `FORSAGE_API_KEY` from the client's Forsage profile;
- confirmed current Forsage API base URL/endpoints from the official account/docs;
- `FORSAGE_WEBHOOK_SECRET` generated for this project;
- Supabase service role key stored server-side only.

Do not guess API endpoints or expose supplier/Supabase secrets to browser code.
