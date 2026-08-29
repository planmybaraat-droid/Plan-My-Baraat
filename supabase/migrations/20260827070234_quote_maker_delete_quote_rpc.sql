-- Adds a delete RPC for Quote Maker, mirroring the exact session-token-gated
-- SECURITY DEFINER pattern already used by crm_quote_maker_save_quote and
-- crm_quote_maker_list_quotes in 20260825105310_quote_maker_session_rpcs.sql.
-- The underlying crm_quote_maker_quotes table has RLS enabled with zero
-- policies, so this RPC (like the other two) is the only way to reach it.

create or replace function public.crm_quote_maker_delete_quote(
  p_session_token text,
  p_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.crm_quote_maker_session_is_valid(p_session_token) then
    raise exception 'Quote Maker session is invalid or expired.' using errcode = '28000';
  end if;

  delete from public.crm_quote_maker_quotes where id = p_id;

  if not found then
    raise exception 'Saved quote not found.' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.crm_quote_maker_delete_quote(text, uuid) from public;
grant execute on function public.crm_quote_maker_delete_quote(text, uuid) to anon, authenticated;
