import type { LetterTemplate } from '../../lib/types';

export const EXPERIENCE_LETTER_TEMPLATE: LetterTemplate = {
  id: 'tpl-experience',
  letter_type: 'experience_letter',
  label: 'Experience Letter',
  icon: 'Award',
  description: 'Confirms an employee’s role and experience from their joining date through Till Date or a selected date.',
  category: 'Exit',
  body_template: `To Whom It May Concern,

This is to certify that **{{employee_name}}** has been employed with **PlanMyBaraat** as **{{designation}}** in the **{{department}}** department from **{{joining_date}}** through **{{experience_end_display}}**.

During this period, they have displayed professionalism, dedication and competence. We appreciate their contribution and wish them continued success.

Warm regards,
PlanMyBaraat — HR Department`,
  extra_fields: [
    {
      key: 'experience_end_date',
      label: 'Experience End Date',
      type: 'date',
      required: false,
      hint: 'Leave blank for “Till Date”, or select a specific ending date.',
    },
  ],
  requires_status: null,
  is_active: true,
};
