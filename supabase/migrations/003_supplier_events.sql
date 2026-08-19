create table if not exists public.supplier_events (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'victoria_forsage',
  product_ids jsonb not null default '[]'::jsonb,
  change_types jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending','processing','processed','failed')),
  attempts integer not null default 0,
  last_error text,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

alter table public.supplier_events enable row level security;
create index if not exists supplier_events_status_received_idx on public.supplier_events(status, received_at);

-- No anon/authenticated policies on supplier_events: only the server-side service role may read/write this queue.
