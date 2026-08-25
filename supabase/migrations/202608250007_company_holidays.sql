-- Central company holiday calendar. Dates are generated from fixed company
-- rules and the Vadodara Panchang, then shared by Admin and Staff portals.

CREATE TABLE IF NOT EXISTS public.crm_company_holidays (
  holiday_date DATE PRIMARY KEY,
  holiday_key TEXT NOT NULL,
  name TEXT NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT true,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT crm_company_holidays_key_year_unique UNIQUE (holiday_key, holiday_date)
);

CREATE INDEX IF NOT EXISTS crm_company_holidays_date_idx ON public.crm_company_holidays(holiday_date);
ALTER TABLE public.crm_company_holidays ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.crm_company_holidays FROM anon, authenticated;

INSERT INTO public.crm_company_holidays(holiday_date,holiday_key,name,source) VALUES
  ('2026-01-14','makar_sankranti_pongal','Makar Sankranti / Pongal','company-fixed-rule'),
  ('2026-01-26','republic_day','Republic Day','company-fixed-rule'),
  ('2026-02-15','maha_shivaratri','Maha Shivaratri','panchangam-js-v3.0.0-vadodara'),
  ('2026-03-04','holi','Holi','panchangam-js-v3.0.0-vadodara'),
  ('2026-03-26','ram_navami','Ram Navami','panchangam-js-v3.0.0-vadodara'),
  ('2026-04-02','hanuman_jayanti','Hanuman Jayanti','panchangam-js-v3.0.0-vadodara'),
  ('2026-07-16','jagannath_rath_yatra','Jagannath Rath Yatra','panchangam-js-v3.0.0-vadodara'),
  ('2026-08-15','independence_day','Independence Day','company-fixed-rule'),
  ('2026-08-28','raksha_bandhan','Raksha Bandhan','panchangam-js-v3.0.0-vadodara'),
  ('2026-09-04','krishna_janmashtami','Krishna Janmashtami','panchangam-js-v3.0.0-vadodara'),
  ('2026-09-14','ganesh_chaturthi','Ganesh Chaturthi','panchangam-js-v3.0.0-vadodara'),
  ('2026-10-02','gandhi_jayanti','Gandhi Jayanti','company-fixed-rule'),
  ('2026-10-20','dussehra','Dussehra / Vijayadashami','panchangam-js-v3.0.0-vadodara'),
  ('2026-11-06','dhanteras','Dhanteras','panchangam-js-v3.0.0-vadodara'),
  ('2026-11-08','diwali','Diwali','panchangam-js-v3.0.0-vadodara'),
  ('2026-11-11','bhai_dooj_govardhan','Bhai Dooj / Govardhan Puja','panchangam-js-v3.0.0-vadodara'),
  ('2027-01-14','makar_sankranti_pongal','Makar Sankranti / Pongal','company-fixed-rule'),
  ('2027-01-26','republic_day','Republic Day','company-fixed-rule'),
  ('2027-03-06','maha_shivaratri','Maha Shivaratri','panchangam-js-v3.0.0-vadodara'),
  ('2027-03-23','holi','Holi','panchangam-js-v3.0.0-vadodara'),
  ('2027-04-15','ram_navami','Ram Navami','panchangam-js-v3.0.0-vadodara'),
  ('2027-04-20','hanuman_jayanti','Hanuman Jayanti','panchangam-js-v3.0.0-vadodara'),
  ('2027-07-05','jagannath_rath_yatra','Jagannath Rath Yatra','panchangam-js-v3.0.0-vadodara'),
  ('2027-08-15','independence_day','Independence Day','company-fixed-rule'),
  ('2027-08-17','raksha_bandhan','Raksha Bandhan','panchangam-js-v3.0.0-vadodara'),
  ('2027-08-25','krishna_janmashtami','Krishna Janmashtami','panchangam-js-v3.0.0-vadodara'),
  ('2027-09-04','ganesh_chaturthi','Ganesh Chaturthi','panchangam-js-v3.0.0-vadodara'),
  ('2027-10-02','gandhi_jayanti','Gandhi Jayanti','company-fixed-rule'),
  ('2027-10-09','dussehra','Dussehra / Vijayadashami','panchangam-js-v3.0.0-vadodara'),
  ('2027-10-27','dhanteras','Dhanteras','panchangam-js-v3.0.0-vadodara'),
  ('2027-10-29','diwali','Diwali','panchangam-js-v3.0.0-vadodara'),
  ('2027-10-31','bhai_dooj_govardhan','Bhai Dooj / Govardhan Puja','panchangam-js-v3.0.0-vadodara'),
  ('2028-01-14','makar_sankranti_pongal','Makar Sankranti / Pongal','company-fixed-rule'),
  ('2028-01-26','republic_day','Republic Day','company-fixed-rule'),
  ('2028-02-23','maha_shivaratri','Maha Shivaratri','panchangam-js-v3.0.0-vadodara'),
  ('2028-03-11','holi','Holi','panchangam-js-v3.0.0-vadodara'),
  ('2028-04-03','ram_navami','Ram Navami','panchangam-js-v3.0.0-vadodara'),
  ('2028-04-09','hanuman_jayanti','Hanuman Jayanti','panchangam-js-v3.0.0-vadodara'),
  ('2028-06-24','jagannath_rath_yatra','Jagannath Rath Yatra','panchangam-js-v3.0.0-vadodara'),
  ('2028-08-05','raksha_bandhan','Raksha Bandhan','panchangam-js-v3.0.0-vadodara'),
  ('2028-08-13','krishna_janmashtami','Krishna Janmashtami','panchangam-js-v3.0.0-vadodara'),
  ('2028-08-15','independence_day','Independence Day','company-fixed-rule'),
  ('2028-08-23','ganesh_chaturthi','Ganesh Chaturthi','panchangam-js-v3.0.0-vadodara'),
  ('2028-09-27','dussehra','Dussehra / Vijayadashami','panchangam-js-v3.0.0-vadodara'),
  ('2028-10-02','gandhi_jayanti','Gandhi Jayanti','company-fixed-rule'),
  ('2028-10-15','dhanteras','Dhanteras','panchangam-js-v3.0.0-vadodara'),
  ('2028-10-17','diwali','Diwali','panchangam-js-v3.0.0-vadodara'),
  ('2028-10-19','bhai_dooj_govardhan','Bhai Dooj / Govardhan Puja','panchangam-js-v3.0.0-vadodara')
ON CONFLICT (holiday_date) DO UPDATE SET
  holiday_key=EXCLUDED.holiday_key,
  name=EXCLUDED.name,
  source=EXCLUDED.source,
  is_paid=true,
  updated_at=now();

CREATE OR REPLACE FUNCTION public.crm_get_company_holidays(p_from DATE, p_to DATE)
RETURNS TABLE(holiday_date DATE,holiday_key TEXT,name TEXT)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS(
    SELECT 1 FROM public.crm_users u WHERE u.id=auth.uid() AND u.is_active=true
  ) THEN
    RAISE EXCEPTION 'Active CRM access is required.';
  END IF;
  IF p_from IS NULL OR p_to IS NULL OR p_from>p_to OR (p_to-p_from)>1830 THEN
    RAISE EXCEPTION 'A valid holiday range of five years or less is required.';
  END IF;
  RETURN QUERY
  SELECT h.holiday_date,h.holiday_key,h.name
  FROM public.crm_company_holidays h
  WHERE h.holiday_date BETWEEN p_from AND p_to
  ORDER BY h.holiday_date,h.name;
END; $$;

REVOKE ALL ON FUNCTION public.crm_get_company_holidays(DATE,DATE) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.crm_get_company_holidays(DATE,DATE) TO authenticated;
