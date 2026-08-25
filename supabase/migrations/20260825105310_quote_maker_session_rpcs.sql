create extension if not exists pgcrypto with schema extensions;

create or replace function public.crm_quote_maker_session_is_valid(p_token text)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select case
    when p_token is null or p_token !~ '^\d{10,16}\.[0-9a-f]{64}$' then false
    else
      (extract(epoch from now()) * 1000 - split_part(p_token, '.', 1)::numeric) between 0 and (12 * 60 * 60 * 1000)
      and encode(
        extensions.hmac(
          split_part(p_token, '.', 1)::bytea,
          'pmb-quote-maker-session-9f3c7a1e-2026'::bytea,
          'sha256'
        ),
        'hex'
      ) = split_part(p_token, '.', 2)
  end;
$$;

create or replace function public.crm_quote_maker_save_quote(
  p_session_token text,
  p_id uuid,
  p_client_name text,
  p_event_date date,
  p_client_number text,
  p_selected_services jsonb,
  p_final_price numeric,
  p_transport_cost numeric,
  p_discount numeric
)
returns setof public.crm_quote_maker_quotes
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.crm_quote_maker_session_is_valid(p_session_token) then
    raise exception 'Quote Maker session is invalid or expired.' using errcode = '28000';
  end if;

  if p_id is null then
    return query
      insert into public.crm_quote_maker_quotes (
        quote_number, client_name, event_date, client_number, selected_services,
        final_price, transport_cost, discount
      ) values (
        null, p_client_name, p_event_date, p_client_number, p_selected_services,
        p_final_price, p_transport_cost, p_discount
      )
      returning *;
  else
    return query
      update public.crm_quote_maker_quotes
      set client_name = p_client_name,
          event_date = p_event_date,
          client_number = p_client_number,
          selected_services = p_selected_services,
          final_price = p_final_price,
          transport_cost = p_transport_cost,
          discount = p_discount
      where id = p_id
      returning *;

    if not found then
      raise exception 'Saved quote not found.' using errcode = 'P0002';
    end if;
  end if;
end;
$$;

create or replace function public.crm_quote_maker_list_quotes(
  p_session_token text,
  p_page integer default 1,
  p_page_size integer default 10,
  p_search text default ''
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_page integer := greatest(1, least(coalesce(p_page, 1), 10000));
  v_page_size integer := greatest(5, least(coalesce(p_page_size, 10), 50));
  v_search text := left(btrim(coalesce(p_search, '')), 60);
  v_result jsonb;
begin
  if not public.crm_quote_maker_session_is_valid(p_session_token) then
    raise exception 'Quote Maker session is invalid or expired.' using errcode = '28000';
  end if;

  with filtered as materialized (
    select q.*
    from public.crm_quote_maker_quotes q
    where v_search = ''
       or q.quote_number ilike '%' || v_search || '%'
       or q.client_name ilike '%' || v_search || '%'
       or q.client_number ilike '%' || v_search || '%'
  ), page_rows as (
    select f.*
    from filtered f
    order by f.created_at desc
    offset ((v_page - 1) * v_page_size)
    limit v_page_size
  )
  select jsonb_build_object(
    'quotes', coalesce((select jsonb_agg(to_jsonb(p) order by p.created_at desc) from page_rows p), '[]'::jsonb),
    'total', (select count(*) from filtered),
    'page', v_page,
    'pageSize', v_page_size
  ) into v_result;

  return v_result;
end;
$$;

revoke execute on function public.crm_quote_maker_session_is_valid(text) from public, anon, authenticated;
revoke execute on function public.crm_quote_maker_save_quote(text, uuid, text, date, text, jsonb, numeric, numeric, numeric) from public;
revoke execute on function public.crm_quote_maker_list_quotes(text, integer, integer, text) from public;

grant execute on function public.crm_quote_maker_save_quote(text, uuid, text, date, text, jsonb, numeric, numeric, numeric) to anon, authenticated;
grant execute on function public.crm_quote_maker_list_quotes(text, integer, integer, text) to anon, authenticated;
