-- Automatic daily staff report delivery configuration and audit trail.
-- WhatsApp API credentials remain server-side environment secrets; only the
-- recipient and delivery preferences live in the production database.

CREATE TABLE IF NOT EXISTS public.crm_daily_staff_report_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  recipient_e164 TEXT NOT NULL CHECK (recipient_e164 ~ '^[1-9][0-9]{7,14}$'),
  whatsapp_template_name TEXT NOT NULL DEFAULT 'daily_staff_report',
  whatsapp_template_language TEXT NOT NULL DEFAULT 'en',
  max_attempts SMALLINT NOT NULL DEFAULT 3 CHECK (max_attempts BETWEEN 1 AND 5),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.crm_users(id) ON DELETE SET NULL
);

INSERT INTO public.crm_daily_staff_report_settings(id, recipient_e164)
VALUES (1, '918830612287')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.crm_daily_staff_report_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_date DATE NOT NULL,
  recipient_e164 TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','SENDING','SENT','FAILED')),
  attempt_count SMALLINT NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  pdf_storage_path TEXT,
  whatsapp_message_id TEXT,
  error_message TEXT,
  requested_by UUID REFERENCES public.crm_users(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (report_date, recipient_e164)
);

CREATE INDEX IF NOT EXISTS crm_daily_staff_report_deliveries_date_idx
ON public.crm_daily_staff_report_deliveries(report_date DESC, created_at DESC);

CREATE OR REPLACE FUNCTION public.crm_touch_daily_staff_report_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS crm_daily_staff_report_settings_touch_updated_at ON public.crm_daily_staff_report_settings;
CREATE TRIGGER crm_daily_staff_report_settings_touch_updated_at
BEFORE UPDATE ON public.crm_daily_staff_report_settings
FOR EACH ROW EXECUTE FUNCTION public.crm_touch_daily_staff_report_updated_at();

DROP TRIGGER IF EXISTS crm_daily_staff_report_deliveries_touch_updated_at ON public.crm_daily_staff_report_deliveries;
CREATE TRIGGER crm_daily_staff_report_deliveries_touch_updated_at
BEFORE UPDATE ON public.crm_daily_staff_report_deliveries
FOR EACH ROW EXECUTE FUNCTION public.crm_touch_daily_staff_report_updated_at();

ALTER TABLE public.crm_daily_staff_report_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_daily_staff_report_deliveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Daily report settings visible to admin" ON public.crm_daily_staff_report_settings;
CREATE POLICY "Daily report settings visible to admin"
ON public.crm_daily_staff_report_settings FOR SELECT TO authenticated
USING (public.is_crm_admin());

DROP POLICY IF EXISTS "Daily report settings managed by admin" ON public.crm_daily_staff_report_settings;
CREATE POLICY "Daily report settings managed by admin"
ON public.crm_daily_staff_report_settings FOR UPDATE TO authenticated
USING (public.is_crm_admin()) WITH CHECK (public.is_crm_admin());

DROP POLICY IF EXISTS "Daily report delivery history visible to admin" ON public.crm_daily_staff_report_deliveries;
CREATE POLICY "Daily report delivery history visible to admin"
ON public.crm_daily_staff_report_deliveries FOR SELECT TO authenticated
USING (public.is_crm_admin());

REVOKE ALL ON public.crm_daily_staff_report_settings FROM anon, authenticated;
REVOKE ALL ON public.crm_daily_staff_report_deliveries FROM anon, authenticated;
GRANT SELECT, UPDATE(is_enabled,recipient_e164,whatsapp_template_name,whatsapp_template_language,max_attempts,updated_by)
ON public.crm_daily_staff_report_settings TO authenticated;
GRANT SELECT ON public.crm_daily_staff_report_deliveries TO authenticated;

-- Reports are private. The server creates short-lived signed URLs only while
-- handing the document to the WhatsApp Business API.
INSERT INTO storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
VALUES ('daily-staff-reports', 'daily-staff-reports', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET public=false, file_size_limit=10485760, allowed_mime_types=ARRAY['application/pdf'];
