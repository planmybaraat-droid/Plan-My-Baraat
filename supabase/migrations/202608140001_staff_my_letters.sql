-- Staff My Letters module: permission-gated, read-only access to the signed-in
-- employee's own letters. Admin and manager policies remain unchanged.

DROP POLICY IF EXISTS "Staff read own profile" ON public.crm_staff;
CREATE POLICY "Staff read own profile"
ON public.crm_staff
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Staff read own letters" ON public.crm_employee_letters;
CREATE POLICY "Staff read own letters"
ON public.crm_employee_letters
FOR SELECT
TO authenticated
USING (
  public.crm_user_has_module_access('myLetters')
  AND EXISTS (
    SELECT 1
    FROM public.crm_staff staff
    WHERE staff.id = crm_employee_letters.employee_id
      AND staff.user_id = auth.uid()
  )
);

-- Replace the legacy self-read policy, which allowed employee letters without
-- consulting Manage Access. Admin access remains intact; staff self-access now
-- requires the My Letters toggle just like the route and sidebar do.
DROP POLICY IF EXISTS "Employee letters visible to admin or self" ON public.crm_employee_letters;
CREATE POLICY "Employee letters visible to admin or permitted self"
ON public.crm_employee_letters
FOR SELECT
TO authenticated
USING (
  public.is_crm_admin()
  OR (
    public.crm_user_has_module_access('myLetters')
    AND EXISTS (
      SELECT 1
      FROM public.crm_staff staff
      WHERE staff.id = crm_employee_letters.employee_id
        AND staff.user_id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "Staff read letter templates" ON public.crm_letter_templates;
CREATE POLICY "Staff read letter templates"
ON public.crm_letter_templates
FOR SELECT
TO authenticated
USING (public.crm_user_has_module_access('myLetters'));
