-- Switch the Daily Staff Report's automatic delivery channel from WhatsApp
-- to free Gmail SMTP email (owner request: WhatsApp Business API needs Meta
-- verification + template approval; Gmail SMTP is free and works immediately
-- with just an App Password). WhatsApp columns are left in place (nullable,
-- unused) rather than dropped, so no historical delivery data is lost.

ALTER TABLE public.crm_daily_staff_report_settings
  ADD COLUMN IF NOT EXISTS recipient_email TEXT;

ALTER TABLE public.crm_daily_staff_report_settings
  DROP CONSTRAINT IF EXISTS crm_daily_staff_report_settings_recipient_e164_check;
ALTER TABLE public.crm_daily_staff_report_settings
  ALTER COLUMN recipient_e164 DROP NOT NULL;
ALTER TABLE public.crm_daily_staff_report_settings
  ALTER COLUMN whatsapp_template_name DROP NOT NULL;
ALTER TABLE public.crm_daily_staff_report_settings
  ALTER COLUMN whatsapp_template_language DROP NOT NULL;

ALTER TABLE public.crm_daily_staff_report_settings
  ADD CONSTRAINT crm_daily_staff_report_settings_recipient_email_check
  CHECK (recipient_email IS NULL OR recipient_email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$');

ALTER TABLE public.crm_daily_staff_report_deliveries
  ADD COLUMN IF NOT EXISTS recipient_email TEXT,
  ADD COLUMN IF NOT EXISTS email_message_id TEXT;

ALTER TABLE public.crm_daily_staff_report_deliveries
  DROP CONSTRAINT IF EXISTS crm_daily_staff_report_deliverie_report_date_recipient_e164_key;
ALTER TABLE public.crm_daily_staff_report_deliveries
  ADD CONSTRAINT crm_daily_staff_report_deliveries_date_email_key
  UNIQUE (report_date, recipient_email);

REVOKE ALL ON public.crm_daily_staff_report_settings FROM anon, authenticated;
GRANT SELECT, UPDATE(is_enabled, recipient_email, max_attempts, updated_by)
ON public.crm_daily_staff_report_settings TO authenticated;
