-- Run immediately after SMTP accepts an outgoing contact email.
-- Parameters: contact id, request id/null, SMTP messageID, subject, body.
-- The id must use the same canonical normalization as inbound messageId.
-- Wrong contact/request ownership and missing SMTP ids produce zero rows.
INSERT INTO public.messages(contact_id, request_id, direction, channel, body, is_test,
                            email_message_id, email_subject)
SELECT c.id, $2::bigint, 'outbound', 'email', COALESCE($5::text, ''), c.is_test,
       btrim($3::text), COALESCE($4::text, '')
FROM public.contacts c
WHERE c.id = $1::bigint AND NULLIF(btrim($3::text), '') IS NOT NULL
  AND length(btrim($3::text)) <= 998
  AND ($2::bigint IS NULL OR EXISTS (
    SELECT 1 FROM public.requests r WHERE r.id = $2::bigint AND r.contact_id = c.id
  ))
ON CONFLICT (email_message_id) WHERE email_message_id IS NOT NULL DO NOTHING
RETURNING id, contact_id, request_id, email_message_id;
