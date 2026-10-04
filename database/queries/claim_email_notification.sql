-- Parameters: notification id, random execution-specific claim token.
-- Returns zero rows for a second worker, duplicate execution, or already sent job.
UPDATE public.email_notifications
SET state = 'processing', claim_token = $2::text, claimed_at = now()
WHERE id = $1::bigint AND state = 'pending' AND NULLIF($2::text, '') IS NOT NULL
RETURNING id, kind, contact_id, request_id, message_id, payload, claim_token;
