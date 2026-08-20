import 'server-only';

import { supabaseAdmin } from './supabase-admin';

// Runs the monthly PL/SL accrual RPC (crm_accrue_monthly_leave). Idempotent:
// safe to call more than once in the same month, and safe to call late since
// it catches up every missed month in one pass. See
// supabase/migrations/202608190002_leave_balances_pl_sl.sql for the RPC.
export async function runMonthlyLeaveAccrual() {
  if (!supabaseAdmin) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured on the server.');
  const { error } = await supabaseAdmin.rpc('crm_accrue_monthly_leave');
  if (error) throw new Error(error.message);
  return { ok: true, ranAt: new Date().toISOString() };
}
