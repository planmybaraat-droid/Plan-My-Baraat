-- Store blood group once on the staff profile and reuse it in ID-card drafts.
ALTER TABLE public.crm_staff
  ADD COLUMN IF NOT EXISTS blood_group varchar(3);

ALTER TABLE public.crm_staff
  DROP CONSTRAINT IF EXISTS crm_staff_blood_group_check;

ALTER TABLE public.crm_staff
  ADD CONSTRAINT crm_staff_blood_group_check
  CHECK (blood_group IS NULL OR blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'));

COMMENT ON COLUMN public.crm_staff.blood_group IS
  'Staff blood group used as the source of truth for generated ID cards.';
