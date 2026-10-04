-- Run after migration 002 inside an existing BEGIN; caller must ROLLBACK.
-- No BEGIN/COMMIT here so schema creation and fixtures share one rollback.
-- psql should use ON_ERROR_STOP=1. Any violated invariant raises an exception.
DO $test$
DECLARE
  c1 bigint;
  c2 bigint;
  r1 bigint;
  r2 bigint;
  suffix text := txid_current()::text;
  address1 text := 'email-tracking-' || txid_current()::text || '-one@example.invalid';
  address2 text := 'email-tracking-' || txid_current()::text || '-two@example.invalid';
  envelope jsonb;
  payload jsonb;
  result jsonb;
  message_count bigint;
  notification_count bigint;
  preference_value text;
  claim_id bigint;
  claimed_count bigint;
BEGIN
  INSERT INTO public.contacts(email_normalized, email_original, full_name, is_test, locale)
  VALUES(address1, address1, 'Email tracking test one', true, 'ko') RETURNING id INTO c1;
  INSERT INTO public.contacts(email_normalized, email_original, full_name, is_test)
  VALUES(address2, address2, 'Email tracking test two', true) RETURNING id INTO c2;
  INSERT INTO public.requests(contact_id, service_key, source, locale, is_test)
  VALUES(c1, 'other', 'web_form', 'ko', true) RETURNING id INTO r1;
  INSERT INTO public.requests(contact_id, service_key, source, locale, is_test)
  VALUES(c2, 'other', 'web_form', 'en', true) RETURNING id INTO r2;

  envelope := jsonb_build_object('fromEmail', address1, 'messageId', 'ordinary-' || suffix,
    'references', '[]'::jsonb, 'subject', 'Ordinary test', 'body', 'A normal email');
  payload := jsonb_build_object('action', 'save', 'email', envelope, 'requestId', NULL,
    'correlation', 'unmatched', 'saveMessage', true, 'notifyAdmin', true, 'sendReply', false,
    'language', 'en');
  result := public.persist_known_contact_email(payload);
  IF result->>'status' <> 'saved' OR result->>'request_id' IS NOT NULL
    OR result->>'send_reply' <> 'false' OR result->>'notify_admin' <> 'true' THEN
    RAISE EXCEPTION 'Ordinary email failed: %', result;
  END IF;
  SELECT count(*) INTO notification_count FROM public.email_notifications
    WHERE message_id = (result->>'message_id')::bigint AND kind = 'admin';
  IF notification_count <> 1 THEN RAISE EXCEPTION 'Expected one admin notification'; END IF;
  SELECT count(*) INTO message_count FROM public.messages WHERE contact_id IN (c1, c2);
  SELECT count(*) INTO notification_count FROM public.email_notifications WHERE contact_id IN (c1, c2);
  result := public.persist_known_contact_email(payload);
  IF result->>'status' <> 'duplicate'
    OR message_count <> (SELECT count(*) FROM public.messages WHERE contact_id IN (c1, c2))
    OR notification_count <> (SELECT count(*) FROM public.email_notifications WHERE contact_id IN (c1, c2)) THEN
    RAISE EXCEPTION 'Duplicate had side effects: %', result;
  END IF;

  payload := payload || jsonb_build_object('action', 'preference', 'preference', 'none',
    'sendReply', true, 'email', envelope || jsonb_build_object('messageId', 'none-' || suffix));
  result := public.persist_known_contact_email(payload);
  SELECT contact_preference INTO preference_value FROM public.contacts WHERE id = c1;
  IF preference_value <> 'none' OR result->>'preference_applied' <> 'true'
    OR result->>'send_reply' <> 'true' THEN RAISE EXCEPTION 'None preference failed: %', result; END IF;
  IF (SELECT count(*) FROM public.email_notifications WHERE message_id = (result->>'message_id')::bigint) <> 2
    OR (SELECT count(*) FROM public.contact_preference_events WHERE message_id = (result->>'message_id')::bigint) <> 1 THEN
    RAISE EXCEPTION 'None preference did not create exactly one event and admin/reply notifications';
  END IF;
  IF (SELECT locale FROM public.contacts WHERE id = c1) <> 'ko' THEN
    RAISE EXCEPTION 'Response language overwrote contact locale';
  END IF;

  payload := payload || jsonb_build_object('preference', 'whatsapp', 'phone', '+15551234567',
    'email', envelope || jsonb_build_object('messageId', 'whatsapp-' || suffix));
  result := public.persist_known_contact_email(payload);
  IF result->>'preference_applied' <> 'true' OR result->>'notify_telegram' <> 'true'
    OR (SELECT contact_phone FROM public.contacts WHERE id = c1) <> '+15551234567'
    OR (SELECT count(*) FROM public.email_notifications WHERE message_id = (result->>'message_id')::bigint AND kind = 'telegram') <> 1 THEN
    RAISE EXCEPTION 'WhatsApp preference/telegram failed: %', result;
  END IF;
  SELECT id INTO claim_id FROM public.email_notifications
    WHERE message_id = (result->>'message_id')::bigint AND kind = 'telegram';
  UPDATE public.email_notifications SET state = 'processing', claim_token = 'test-worker-1', claimed_at = now()
    WHERE id = claim_id AND state = 'pending';
  GET DIAGNOSTICS claimed_count = ROW_COUNT;
  IF claimed_count <> 1 THEN RAISE EXCEPTION 'First claim failed'; END IF;
  UPDATE public.email_notifications SET state = 'processing', claim_token = 'test-worker-2'
    WHERE id = claim_id AND state = 'pending';
  GET DIAGNOSTICS claimed_count = ROW_COUNT;
  IF claimed_count <> 0 THEN RAISE EXCEPTION 'Duplicate claim succeeded'; END IF;
  UPDATE public.email_notifications SET state = 'sent'
    WHERE id = claim_id AND claim_token = 'wrong-token' AND state = 'processing';
  GET DIAGNOSTICS claimed_count = ROW_COUNT;
  IF claimed_count <> 0 THEN RAISE EXCEPTION 'Wrong token completed delivery'; END IF;

  payload := payload || jsonb_build_object('phone', '5551234567',
    'email', envelope || jsonb_build_object('messageId', 'bad-phone-' || suffix));
  result := public.persist_known_contact_email(payload);
  IF result->>'preference_applied' <> 'false' OR result->>'send_reply' <> 'false'
    OR result->>'notify_telegram' <> 'false' THEN RAISE EXCEPTION 'Invalid phone accepted: %', result; END IF;

  SELECT count(*) INTO message_count FROM public.messages WHERE contact_id IN (c1, c2);
  payload := payload || jsonb_build_object('email', envelope || jsonb_build_object(
    'fromEmail', 'unknown-' || suffix || '@example.invalid', 'messageId', 'unknown-' || suffix));
  result := public.persist_known_contact_email(payload);
  IF result->>'reason' <> 'unknown_contact'
    OR message_count <> (SELECT count(*) FROM public.messages WHERE contact_id IN (c1, c2)) THEN
    RAISE EXCEPTION 'Unknown contact was persisted: %', result;
  END IF;

  INSERT INTO public.messages(contact_id, request_id, direction, channel, body, is_test, email_message_id)
  VALUES(c1, r1, 'outbound', 'email', 'Registered SMTP one', true, 'outbound-one-' || suffix),
        (c2, r2, 'outbound', 'email', 'Registered SMTP two', true, 'outbound-two-' || suffix);
  payload := payload || jsonb_build_object('preference', 'email', 'phone', NULL,
    'requestId', r2, 'correlation', 'matched',
    'email', envelope || jsonb_build_object('messageId', 'foreign-' || suffix,
      'references', jsonb_build_array('outbound-two-' || suffix)));
  result := public.persist_known_contact_email(payload);
  IF result->>'preference_applied' <> 'false' OR result->>'request_id' IS NOT NULL
    OR (SELECT contact_preference FROM public.contacts WHERE id = c1) <> 'whatsapp' THEN
    RAISE EXCEPTION 'Cross-contact request changed preference: %', result;
  END IF;
  payload := payload || jsonb_build_object('requestId', r1,
    'email', envelope || jsonb_build_object('messageId', 'matched-' || suffix,
      'references', jsonb_build_array('outbound-one-' || suffix)));
  result := public.persist_known_contact_email(payload);
  IF result->>'preference_applied' <> 'true' OR (result->>'request_id')::bigint <> r1 THEN
    RAISE EXCEPTION 'Owned SMTP correlation failed: %', result;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_proc p CROSS JOIN LATERAL aclexplode(COALESCE(p.proacl, acldefault('f', p.proowner))) a
    WHERE p.oid = 'public.persist_known_contact_email(jsonb)'::regprocedure
      AND a.grantee = 0 AND a.privilege_type = 'EXECUTE'
  ) THEN RAISE EXCEPTION 'PUBLIC retains function EXECUTE'; END IF;
  IF NOT has_function_privilege('multisoluciones_web_app', 'public.persist_known_contact_email(jsonb)', 'EXECUTE')
    OR NOT has_table_privilege('multisoluciones_web_app', 'public.email_notifications', 'SELECT,INSERT,UPDATE')
    OR NOT has_sequence_privilege('multisoluciones_web_app', 'public.email_notifications_id_seq', 'USAGE') THEN
    RAISE EXCEPTION 'Application role lacks required outbox access';
  END IF;
  RAISE NOTICE 'Email tracking transactional integration assertions passed';
END
$test$;
