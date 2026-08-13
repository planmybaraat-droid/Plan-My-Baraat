-- Shared operational calendar and once-per-day birthday celebration.

CREATE TABLE IF NOT EXISTS public.crm_birthday_celebration_views (
  user_id UUID NOT NULL REFERENCES public.crm_users(id) ON DELETE CASCADE,
  celebration_date DATE NOT NULL,
  shown_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(user_id,celebration_date)
);

ALTER TABLE public.crm_birthday_celebration_views ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.crm_birthday_celebration_views FROM anon,authenticated;

CREATE OR REPLACE FUNCTION public.crm_calendar_is_authorized()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.crm_users u
    WHERE u.id=auth.uid() AND u.is_active=true
      AND (
        u.role IN ('admin','super_admin')
        OR (u.role='manager' AND COALESCE((u.crm_section_access->>'eventCalendar')::boolean,false))
        OR (u.role IN ('staff','sales','accountant') AND COALESCE((u.module_access->>'calendar')::boolean,false))
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.crm_get_shared_calendar_birthdays(p_years INTEGER[])
RETURNS TABLE(staff_id UUID,full_name TEXT,date DATE)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF NOT public.crm_calendar_is_authorized() THEN
    RAISE EXCEPTION 'Event Calendar access is required.';
  END IF;
  RETURN QUERY
  SELECT s.id,s.full_name::TEXT,
    make_date(y,EXTRACT(MONTH FROM s.date_of_birth)::INTEGER,
      LEAST(EXTRACT(DAY FROM s.date_of_birth)::INTEGER,
        EXTRACT(DAY FROM (make_date(y,EXTRACT(MONTH FROM s.date_of_birth)::INTEGER,1)+INTERVAL '1 month - 1 day'))::INTEGER))
  FROM public.crm_staff s
  CROSS JOIN unnest(p_years) y
  WHERE s.status<>'Inactive' AND s.date_of_birth IS NOT NULL
  ORDER BY 3,s.full_name;
END; $$;

CREATE OR REPLACE FUNCTION public.crm_get_shared_calendar_events()
RETURNS TABLE(
  agreement_id UUID,agreement_number TEXT,client_name TEXT,groom_name TEXT,
  bride_name TEXT,mobile TEXT,event_date DATE,venue TEXT,package_name TEXT,
  agreement_status TEXT,invoice_number TEXT,invoice_status TEXT
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF NOT public.crm_calendar_is_authorized() THEN
    RAISE EXCEPTION 'Event Calendar access is required.';
  END IF;
  RETURN QUERY
  SELECT a.id,a.agreement_number::TEXT,a.client_name::TEXT,
    COALESCE(a.payload->>'groom_name',''),COALESCE(a.payload->>'bride_name',''),
    a.mobile::TEXT,a.event_date,COALESCE(a.payload->>'venue',''),a.package_name::TEXT,
    a.status::TEXT,i.invoice_number::TEXT,i.status::TEXT
  FROM public.crm_agreements a
  JOIN LATERAL (
    SELECT inv.invoice_number,inv.status
    FROM public.crm_invoices inv
    WHERE inv.agreement_id=a.id AND inv.status<>'Cancelled'
    ORDER BY inv.created_at DESC LIMIT 1
  ) i ON true
  WHERE a.status IN ('Signed','Completed') AND a.event_date IS NOT NULL
  ORDER BY a.event_date,a.client_name;
END; $$;

CREATE OR REPLACE FUNCTION public.crm_claim_my_birthday_celebration()
RETURNS TABLE(full_name TEXT,celebration_date DATE)
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE local_date DATE:=(now() AT TIME ZONE 'Asia/Kolkata')::DATE; staff_row public.crm_staff%ROWTYPE;
BEGIN
  SELECT * INTO staff_row FROM public.crm_staff
  WHERE user_id=auth.uid() AND status<>'Inactive' LIMIT 1;
  IF NOT FOUND OR staff_row.date_of_birth IS NULL
     OR EXTRACT(MONTH FROM staff_row.date_of_birth)<>EXTRACT(MONTH FROM local_date)
     OR EXTRACT(DAY FROM staff_row.date_of_birth)<>EXTRACT(DAY FROM local_date) THEN
    RETURN;
  END IF;
  INSERT INTO public.crm_birthday_celebration_views(user_id,celebration_date)
  VALUES(auth.uid(),local_date) ON CONFLICT DO NOTHING;
  IF FOUND THEN
    RETURN QUERY SELECT staff_row.full_name::TEXT,local_date;
  END IF;
END; $$;

GRANT EXECUTE ON FUNCTION public.crm_calendar_is_authorized() TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_get_shared_calendar_birthdays(INTEGER[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_get_shared_calendar_events() TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_claim_my_birthday_celebration() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_calendar_is_authorized() FROM anon;
REVOKE EXECUTE ON FUNCTION public.crm_get_shared_calendar_birthdays(INTEGER[]) FROM anon;
REVOKE EXECUTE ON FUNCTION public.crm_get_shared_calendar_events() FROM anon;
REVOKE EXECUTE ON FUNCTION public.crm_claim_my_birthday_celebration() FROM anon;
