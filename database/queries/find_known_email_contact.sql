-- Parameters: normalized sender email. Run before classification.
-- Returns no rows for unknown senders. SMTP ids are the only request correlation
-- evidence; history without request_id is intentionally excluded.
SELECT c.id, c.email_normalized AS email, c.full_name, c.locale,
       c.contact_preference, c.contact_phone, c.is_test,
       COALESCE((
         SELECT jsonb_agg(jsonb_build_object('requestId', m.request_id,
                                           'messageId', m.email_message_id))
         FROM public.messages m JOIN public.requests r ON r.id = m.request_id
         WHERE m.contact_id = c.id AND r.contact_id = c.id
           AND m.direction = 'outbound' AND m.channel = 'email'
           AND m.email_message_id IS NOT NULL
       ), '[]'::jsonb) AS outbound_messages
FROM public.contacts c
WHERE c.email_normalized = lower(btrim($1::text));
