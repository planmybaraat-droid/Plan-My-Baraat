-- Adds a "quote valid until" date to Quote Maker quotes -- the date up to
-- which the quoted price is guaranteed. Backfills existing rows with their
-- own event_date (best available fallback) before making the column
-- required, matching how every other required field on this table behaves.

alter table public.crm_quote_maker_quotes add column if not exists valid_until date;

update public.crm_quote_maker_quotes
set valid_until = event_date
where valid_until is null;

alter table public.crm_quote_maker_quotes alter column valid_until set not null;

-- crm_quote_maker_save_quote's argument list is changing (a new required
-- parameter), which is a different function identity to Postgres -- drop
-- the old one explicitly rather than relying on CREATE OR REPLACE, which
-- would otherwise leave both the old and new signatures registered side by
-- side instead of cleanly replacing it.
drop function if exists public.crm_quote_maker_save_quote(text, uuid, text, date, text, jsonb, numeric, numeric, numeric);

create function public.crm_quote_maker_save_quote(
  p_session_token text,
  p_id uuid,
  p_client_name text,
  p_event_date date,
  p_client_number text,
  p_selected_services jsonb,
  p_final_price numeric,
  p_transport_cost numeric,
  p_discount numeric,
  p_valid_until date
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
        final_price, transport_cost, discount, valid_until
      ) values (
        null, p_client_name, p_event_date, p_client_number, p_selected_services,
        p_final_price, p_transport_cost, p_discount, p_valid_until
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
          discount = p_discount,
          valid_until = p_valid_until
      where id = p_id
      returning *;

    if not found then
      raise exception 'Saved quote not found.' using errcode = 'P0002';
    end if;
  end if;
end;
$$;

revoke execute on function public.crm_quote_maker_save_quote(text, uuid, text, date, text, jsonb, numeric, numeric, numeric, date) from public;
grant execute on function public.crm_quote_maker_save_quote(text, uuid, text, date, text, jsonb, numeric, numeric, numeric, date) to anon, authenticated;
