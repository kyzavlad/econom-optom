-- Applied to the shared dacha-tv-prod project for the isolated ECONOM schema only.
-- Generalizes catalog/order money fields because Victoria's current public catalog reports sale currency as USD.

alter table public.econom_products rename column unit_price_uah to unit_price;
alter table public.econom_products add column if not exists currency text not null default 'UAH' check (currency in ('UAH','USD'));
alter table public.econom_order_requests rename column total_uah to total_amount;
alter table public.econom_order_requests add column if not exists currency text not null default 'UAH' check (currency in ('UAH','USD'));

drop function if exists public.econom_submit_order_request(text,text,text,text,text,text,jsonb);
create function public.econom_submit_order_request(
  p_company_name text,p_contact_name text,p_phone text,p_city text,p_delivery_method text,p_comment text,p_items jsonb
)
returns table(number bigint,total_amount numeric,currency text)
language plpgsql
security definer
set search_path=public
as $$
declare
  v_requested_count integer; v_valid_count integer; v_items jsonb; v_total numeric(14,2);
  v_currency text; v_currency_count integer; v_number bigint;
begin
  if length(trim(coalesce(p_company_name,'')))=0 or length(trim(coalesce(p_contact_name,'')))=0
     or length(regexp_replace(coalesce(p_phone,''),'[^0-9]','','g'))<8 or length(trim(coalesce(p_city,'')))=0
     or length(trim(coalesce(p_delivery_method,'')))=0 then raise exception 'invalid_contact_data'; end if;
  if jsonb_typeof(p_items)<>'array' then raise exception 'invalid_items'; end if;
  v_requested_count:=jsonb_array_length(p_items);
  if v_requested_count<1 or v_requested_count>100 then raise exception 'invalid_items'; end if;
  if exists(select 1 from jsonb_array_elements(p_items) line where coalesce(line->>'source_id','')=''
    or coalesce(line->>'boxes','') !~ '^[1-9][0-9]{0,2}$' or (line->>'boxes')::integer>100) then raise exception 'invalid_items'; end if;

  with requested as (
    select line->>'source_id' source_id,(line->>'boxes')::integer boxes from jsonb_array_elements(p_items) line
  ),resolved as (
    select p.source_id,p.sku,p.name,r.boxes,p.pack_size,p.unit_price,p.currency,
      (p.unit_price*p.pack_size*r.boxes)::numeric(14,2) line_total
    from requested r join public.econom_products p on p.source_id=r.source_id and p.is_active=true
  )
  select count(*),count(distinct currency),min(currency),
    coalesce(jsonb_agg(jsonb_build_object('source_id',source_id,'sku',sku,'name',name,'boxes',boxes,'pack_size',pack_size,'unit_price',unit_price,'currency',currency,'line_total',line_total) order by source_id),'[]'::jsonb),
    coalesce(sum(line_total),0)::numeric(14,2)
  into v_valid_count,v_currency_count,v_currency,v_items,v_total from resolved;

  if v_valid_count<>v_requested_count then raise exception 'catalog_changed'; end if;
  if v_currency_count<>1 then raise exception 'mixed_currency'; end if;
  insert into public.econom_order_requests(company_name,contact_name,phone,city,delivery_method,comment,total_amount,currency,status,items)
  values(left(trim(p_company_name),120),left(trim(p_contact_name),100),left(trim(p_phone),40),left(trim(p_city),100),left(trim(p_delivery_method),80),nullif(left(trim(coalesce(p_comment,'')),1000),''),v_total,v_currency,'new',v_items)
  returning econom_order_requests.number into v_number;
  return query select v_number,v_total,v_currency;
end;
$$;
revoke all on function public.econom_submit_order_request(text,text,text,text,text,text,jsonb) from public;
grant execute on function public.econom_submit_order_request(text,text,text,text,text,text,jsonb) to anon,authenticated;
