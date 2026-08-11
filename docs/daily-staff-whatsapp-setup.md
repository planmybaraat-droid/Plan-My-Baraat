# Daily Staff WhatsApp Report — production setup

The CRM schedules the primary delivery at **05:00 Asia/Kolkata** (`23:30 UTC`) and safe failure retries at 05:15 and 05:30. A successfully sent report is never sent again for the same report date and recipient.

## Required encrypted environment variables

- `CRON_SECRET`: a long random value used by Vercel to authenticate cron calls.
- `WHATSAPP_ACCESS_TOKEN`: permanent/system-user token for the official Meta WhatsApp Business Cloud API.
- `WHATSAPP_PHONE_NUMBER_ID`: Meta WhatsApp Business sender phone-number ID.
- `WHATSAPP_GRAPH_API_VERSION`: configured Graph API version (the project default is `v23.0`).
- `WHATSAPP_DAILY_REPORT_TEMPLATE_NAME`: optional override for the approved template name stored in CRM Settings.

Never use a personal WhatsApp token, WhatsApp Web session, QR automation, or a browser session for this automation.

## Approved WhatsApp template contract

The default template name is `daily_staff_report`, language `en`. Create and approve it in WhatsApp Manager with:

- A **document header**. The CRM attaches the private, short-lived signed PDF here.
- Eleven text body placeholders, in this exact order:

1. Report date
2. Total active staff
3. Present
4. Absent / not marked
5. Approved leave
6. Incomplete attendance
7. Reports submitted
8. Reports not submitted
9. Reports not required
10. Completed activities
11. Pending activities

Suggested body:

```text
DAILY STAFF REPORT — {{1}}

Attendance
Total Staff: {{2}}
Present: {{3}}
Absent: {{4}}
Leave: {{5}}
Incomplete: {{6}}

Daily Work Reports
Submitted: {{7}}
Not Submitted: {{8}}
Not Required: {{9}}
Completed Activities: {{10}}
Pending Activities: {{11}}

The complete staff-wise report is attached.
```

The PDF keeps every submitted activity title, DONE/PENDING status, and staff-written description without rewriting or summarizing it.

## Admin controls

Use **CRM → Settings → Daily Staff WhatsApp report** to enable/disable delivery, change the recipient, and set the approved template name/language. Use **CRM → Daily Work Reports** to see delivery status or manually retry a failed date.
