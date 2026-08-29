revoke all on function public.crm_has_asset_access() from public;
grant execute on function public.crm_has_asset_access() to authenticated, service_role;
