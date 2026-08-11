-- Daily Work Report: one report per authenticated staff member and calendar day.
-- The edit window is enforced in the database using Asia/Kolkata calendar days.

CREATE TABLE IF NOT EXISTS public.crm_daily_work_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.crm_users(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  report_status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (report_status IN ('DRAFT', 'SUBMITTED', 'REVIEWED')),
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.crm_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, report_date)
);

CREATE TABLE IF NOT EXISTS public.crm_daily_work_report_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES public.crm_daily_work_reports(id) ON DELETE CASCADE,
  activity_title TEXT NOT NULL CHECK (length(btrim(activity_title)) BETWEEN 1 AND 200),
  description TEXT NOT NULL CHECK (length(btrim(description)) BETWEEN 1 AND 5000),
  activity_status TEXT NOT NULL CHECK (activity_status IN ('DONE', 'PENDING')),
  related_task_id UUID REFERENCES public.crm_tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS crm_daily_work_reports_date_idx ON public.crm_daily_work_reports(report_date DESC);
CREATE INDEX IF NOT EXISTS crm_daily_work_reports_user_date_idx ON public.crm_daily_work_reports(user_id, report_date DESC);
CREATE INDEX IF NOT EXISTS crm_daily_work_report_items_report_idx ON public.crm_daily_work_report_items(report_id) WHERE deleted_at IS NULL;

CREATE OR REPLACE FUNCTION public.crm_daily_report_date_is_editable(p_report_date DATE)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p_report_date BETWEEN ((now() AT TIME ZONE 'Asia/Kolkata')::date - 1)
                           AND (now() AT TIME ZONE 'Asia/Kolkata')::date;
$$;

CREATE OR REPLACE FUNCTION public.crm_touch_daily_work_report_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crm_daily_work_reports_touch_updated_at ON public.crm_daily_work_reports;
CREATE TRIGGER crm_daily_work_reports_touch_updated_at
BEFORE UPDATE ON public.crm_daily_work_reports
FOR EACH ROW EXECUTE FUNCTION public.crm_touch_daily_work_report_updated_at();

DROP TRIGGER IF EXISTS crm_daily_work_report_items_touch_updated_at ON public.crm_daily_work_report_items;
CREATE TRIGGER crm_daily_work_report_items_touch_updated_at
BEFORE UPDATE ON public.crm_daily_work_report_items
FOR EACH ROW EXECUTE FUNCTION public.crm_touch_daily_work_report_updated_at();

ALTER TABLE public.crm_daily_work_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_daily_work_report_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Daily reports visible to owner or admin" ON public.crm_daily_work_reports;
CREATE POLICY "Daily reports visible to owner or admin"
ON public.crm_daily_work_reports FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_crm_admin());

DROP POLICY IF EXISTS "Staff creates own editable daily report" ON public.crm_daily_work_reports;
CREATE POLICY "Staff creates own editable daily report"
ON public.crm_daily_work_reports FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND report_status IN ('DRAFT', 'SUBMITTED')
  AND crm_daily_report_date_is_editable(report_date)
  AND EXISTS (
    SELECT 1 FROM public.crm_users u
    WHERE u.id = auth.uid() AND u.is_active = true AND u.role IN ('staff', 'sales', 'accountant')
  )
);

DROP POLICY IF EXISTS "Staff edits own open daily report" ON public.crm_daily_work_reports;
CREATE POLICY "Staff edits own open daily report"
ON public.crm_daily_work_reports FOR UPDATE TO authenticated
USING (user_id = auth.uid() AND crm_daily_report_date_is_editable(report_date))
WITH CHECK (user_id = auth.uid() AND report_status IN ('DRAFT', 'SUBMITTED') AND crm_daily_report_date_is_editable(report_date));

DROP POLICY IF EXISTS "Admin reviews daily reports" ON public.crm_daily_work_reports;
CREATE POLICY "Admin reviews daily reports"
ON public.crm_daily_work_reports FOR UPDATE TO authenticated
USING (is_crm_admin()) WITH CHECK (is_crm_admin());

DROP POLICY IF EXISTS "Daily report items visible to report reader" ON public.crm_daily_work_report_items;
CREATE POLICY "Daily report items visible to report reader"
ON public.crm_daily_work_report_items FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.crm_daily_work_reports r
  WHERE r.id = report_id AND (r.user_id = auth.uid() OR is_crm_admin())
));

DROP POLICY IF EXISTS "Staff adds own daily report items" ON public.crm_daily_work_report_items;
CREATE POLICY "Staff adds own daily report items"
ON public.crm_daily_work_report_items FOR INSERT TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.crm_daily_work_reports r
  WHERE r.id = report_id AND r.user_id = auth.uid() AND crm_daily_report_date_is_editable(r.report_date)
));

DROP POLICY IF EXISTS "Staff edits own daily report items" ON public.crm_daily_work_report_items;
CREATE POLICY "Staff edits own daily report items"
ON public.crm_daily_work_report_items FOR UPDATE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.crm_daily_work_reports r
  WHERE r.id = report_id AND r.user_id = auth.uid() AND crm_daily_report_date_is_editable(r.report_date)
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.crm_daily_work_reports r
  WHERE r.id = report_id AND r.user_id = auth.uid() AND crm_daily_report_date_is_editable(r.report_date)
));

REVOKE ALL ON FUNCTION public.crm_daily_report_date_is_editable(DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crm_daily_report_date_is_editable(DATE) TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.crm_daily_work_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.crm_daily_work_report_items TO authenticated;
