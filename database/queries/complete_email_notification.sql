-- Parameters: notification id, claim token, sent/error/uncertain, SMTP message id,
-- diagnostic error text. Mark ambiguous SMTP outcomes uncertain; do not retry.
UPDATE public.email_notifications
SET state = $3::text,
    smtp_message_id = NULLIF($4::text, ''),
    sent_at = CASE WHEN $3::text = 'sent' THEN now() ELSE NULL END,
    error_message = NULLIF($5::text, '')
WHERE id = $1::bigint AND claim_token = $2::text AND state = 'processing'
  AND $3::text IN ('sent', 'error', 'uncertain')
RETURNING id, state;
