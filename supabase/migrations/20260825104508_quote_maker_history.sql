create sequence if not exists public.crm_quote_maker_quote_number_seq;

create table if not exists public.crm_quote_maker_quotes (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null unique,
  client_name text not null check (char_length(btrim(client_name)) between 2 and 120),
  event_date date not null,
  client_number text not null check (char_length(btrim(client_number)) between 7 and 20),
  selected_services jsonb not null default '[]'::jsonb,
  final_price numeric(12,2) not null default 0 check (final_price >= 0),
  transport_cost numeric(12,2) not null default 0 check (transport_cost >= 0),
  discount numeric(12,2) not null default 0 check (discount >= 0),
  grand_total numeric(12,2) generated always as (
    greatest(final_price + transport_cost - discount, 0::numeric)
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crm_quote_maker_services_array_check
    check (jsonb_typeof(selected_services) = 'array')
);

create index if not exists crm_quote_maker_quotes_created_at_idx
  on public.crm_quote_maker_quotes (created_at desc);
create index if not exists crm_quote_maker_quotes_event_date_idx
  on public.crm_quote_maker_quotes (event_date desc);
create index if not exists crm_quote_maker_quotes_client_number_idx
  on public.crm_quote_maker_quotes (client_number);

create or replace function public.crm_prepare_quote_maker_quote()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.quote_number is null or btrim(new.quote_number) = '' then
    new.quote_number := format(
      'PMB-QM-%s-%s',
      to_char(coalesce(new.created_at, now()) at time zone 'Asia/Kolkata', 'YYYY'),
      lpad(nextval('public.crm_quote_maker_quote_number_seq')::text, 6, '0')
    );
  end if;
  new.client_name := btrim(new.client_name);
  new.client_number := btrim(new.client_number);
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists crm_prepare_quote_maker_quote_trigger on public.crm_quote_maker_quotes;
create trigger crm_prepare_quote_maker_quote_trigger
before insert or update on public.crm_quote_maker_quotes
for each row execute function public.crm_prepare_quote_maker_quote();

alter table public.crm_quote_maker_quotes enable row level security;

revoke all on table public.crm_quote_maker_quotes from public, anon, authenticated;
revoke all on sequence public.crm_quote_maker_quote_number_seq from public, anon, authenticated;
revoke execute on function public.crm_prepare_quote_maker_quote() from public, anon, authenticated;

grant select, insert, update, delete on table public.crm_quote_maker_quotes to service_role;
grant usage, select on sequence public.crm_quote_maker_quote_number_seq to service_role;
