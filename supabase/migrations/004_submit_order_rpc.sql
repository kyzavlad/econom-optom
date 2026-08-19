create or replace function public.submit_order_request(
  p_company_name text,
  p_contact_name text,
  p_phone text,
  p_city text,
  p_delivery_method text,
  p_comment text,
  p_items jsonb
)
returns table(number bigint, total_uah numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_requested_count integer;
  v_valid_count integer;
  v_items jsonb;
  v_total numeric(12,2);
  v_number bigint;
begin
  if length(trim(coalesce(p_company_name,''))) = 0
    or length(trim(coalesce(p_contact_name,''))) = 0
    or length(regexp_replace(coalesce(p_phone,''), '[^0-9]', '', 'g')) < 8
    or length(trim(coalesce(p_city,''))) = 0
    or length(trim(coalesce(p_delivery_method,''))) = 0 then
    raise exception 'invalid_contact_data';
  end if;

  if jsonb_typeof(p_items) <> 'array' then
    raise exception 'invalid_items';
  end if;

  v_requested_count := jsonb_array_length(p_items);
  if v_requested_count < 1 or v_requested_count > 100 then
    raise exception 'invalid_items';
  end if;

  if exists (
    select 1 from jsonb_array_elements(p_items) line
    where coalesce(line->>'source_id','') = ''
       or coalesce(line->>'boxes','') !~ '^[1-9][0-9]{0,2}$'
  ) then
    raise exception 'invalid_items';
  end if;

  if exists (
    select 1 from jsonb_array_elements(p_items) line
    where (line->>'boxes')::integer > 100
  ) then
    raise exception 'invalid_items';
  end if;

  with requested as (
    select line->>'source_id' as source_id, (line->>'boxes')::integer as boxes
    from jsonb_array_elements(p_items) line
  ), resolved as (
    select p.source_id, p.sku, p.name, r.boxes, p.pack_size,
           p.unit_price_uah as unit_price,
           (p.unit_price_uah * p.pack_size * r.boxes)::numeric(12,2) as line_total
    from requested r
    join public.products p on p.source_id = r.source_id and p.is_active = true
  )
  select count(*),
         coalesce(jsonb_agg(jsonb_build_object(
           'source_id', source_id,
           'sku', sku,
           'name', name,
           'boxes', boxes,
           'pack_size', pack_size,
           'unit_price', unit_price,
           'line_total', line_total
         ) order by source_id), '[]'::jsonb),
         coalesce(sum(line_total),0)::numeric(12,2)
    into v_valid_count, v_items, v_total
  from resolved;

  if v_valid_count <> v_requested_count then
    raise exception 'catalog_changed';
  end if;

  insert into public.order_requests(
    company_name, contact_name, phone, city, delivery_method, comment,
    total_uah, status, items
  ) values (
    left(trim(p_company_name),120), left(trim(p_contact_name),100), left(trim(p_phone),40),
    left(trim(p_city),100), left(trim(p_delivery_method),80), nullif(left(trim(coalesce(p_comment,'')),1000),''),
    v_total, 'new', v_items
  ) returning order_requests.number into v_number;

  return query select v_number, v_total;
end;
$$;

revoke all on function public.submit_order_request(text,text,text,text,text,text,jsonb) from public;
grant execute on function public.submit_order_request(text,text,text,text,text,text,jsonb) to anon, authenticated;
