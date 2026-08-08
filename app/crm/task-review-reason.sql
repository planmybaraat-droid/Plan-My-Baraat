-- Adds a dedicated column to store the admin's reason when sending a task
-- back for revision or rejecting it, so it never collides with the staff
-- member's own completion notes/work-summary field.
ALTER TABLE crm_tasks ADD COLUMN IF NOT EXISTS review_reason TEXT;
