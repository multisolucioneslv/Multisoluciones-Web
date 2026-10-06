-- Run after migrations 002 and 003 inside an existing transaction; caller must ROLLBACK.
-- Uses isolated, transaction-scoped test contacts and never sends real mail/Telegram.
DO $test$
DECLARE
  suffix text := txid_current()::text;
  known_address text := 'inbound-known-' || txid_current()::text || '@example.invalid';
  new_address text := 'inbound-new-' || txid_current()::text || '@example.invalid';
  known_contact bigint;
  before_contacts bigint;
  before_messages bigint;
  payload jsonb;
  result jsonb;
  notification_count bigint;
BEGIN
  INSERT INTO public.contacts(email_normalized, email_original, full_name, is_test)
  VALUES(known_address, known_address, 'Inbound alert test', true)
  RETURNING id INTO known_contact;

  payload := jsonb_build_object(
    'action', 'save', 'reason', 'ordinary_message', 'saveMessage', true,
    'notifyAdmin', true, 'notifyTelegram', true, 'sendReply', false,
    'correlation', 'unmatched', 'email', jsonb_build_object(
      'from', known_address, 'fromEmail', known_address,
      'messageId', '<known-' || suffix || '@example.invalid>',
      'subject', 'Known sender', 'body', 'private message body', 'text', 'private message body'),
    'contact', jsonb_build_object('known', true));
  result := public.persist_incoming_email_with_telegram_alert(payload);
  IF result #>> '{persistence,status}' <> 'saved'
     OR result #>> '{telegram,status}' <> 'queued'
     OR result #>> '{telegram,known_contact}' <> 'true' THEN
    RAISE EXCEPTION 'Known sender alert failed: %', result;
  END IF;
  SELECT count(*) INTO notification_count FROM public.email_notifications
    WHERE kind = 'telegram' AND message_id = (result #>> '{persistence,message_id}')::bigint;
  IF notification_count <> 1 THEN RAISE EXCEPTION 'Expected one known-sender alert'; END IF;

  result := public.persist_incoming_email_with_telegram_alert(payload);
  SELECT count(*) INTO notification_count FROM public.email_notifications n
    WHERE n.kind = 'telegram' AND n.payload #>> '{email,messageId}' = '<known-' || suffix || '@example.invalid>';
  IF result #>> '{telegram,status}' <> 'already_queued' OR notification_count <> 1 THEN
    RAISE EXCEPTION 'Known-sender duplicate was not idempotent: %', result;
  END IF;

  SELECT count(*) INTO before_contacts FROM public.contacts;
  SELECT count(*) INTO before_messages FROM public.messages;
  payload := jsonb_build_object(
    'action', 'new_sender', 'reason', 'unknown_contact', 'saveMessage', false,
    'notifyAdmin', false, 'notifyTelegram', true, 'sendReply', false,
    'email', jsonb_build_object('from', new_address, 'fromEmail', new_address,
      'messageId', '<new-' || suffix || '@example.invalid>',
      'subject', E'New\nsubject', 'body', 'must not be stored', 'text', 'must not be stored'),
    'contact', jsonb_build_object('known', false));
  result := public.persist_incoming_email_with_telegram_alert(payload);
  IF result #>> '{persistence,status}' <> 'ignored'
     OR result #>> '{telegram,status}' <> 'queued'
     OR result #>> '{telegram,known_contact}' <> 'false' THEN
    RAISE EXCEPTION 'New sender alert failed: %', result;
  END IF;
  IF (SELECT count(*) FROM public.contacts) <> before_contacts
     OR (SELECT count(*) FROM public.messages) <> before_messages THEN
    RAISE EXCEPTION 'Unknown sender created a contact or message record';
  END IF;
  SELECT count(*) INTO notification_count FROM public.email_notifications n
    WHERE n.kind = 'telegram' AND n.contact_id IS NULL AND n.message_id IS NULL
      AND n.payload #>> '{email,messageId}' = '<new-' || suffix || '@example.invalid>'
      AND n.payload::text NOT LIKE '%must not be stored%';
  IF notification_count <> 1 THEN RAISE EXCEPTION 'New sender row is not minimal/idempotent'; END IF;

  result := public.persist_incoming_email_with_telegram_alert(payload);
  SELECT count(*) INTO notification_count FROM public.email_notifications n
    WHERE n.kind = 'telegram' AND n.payload #>> '{email,messageId}' = '<new-' || suffix || '@example.invalid>';
  IF result #>> '{telegram,status}' <> 'already_queued' OR notification_count <> 1 THEN
    RAISE EXCEPTION 'New-sender duplicate was not idempotent: %', result;
  END IF;

  payload := payload || jsonb_build_object('action', 'ignore', 'notifyTelegram', false);
  result := public.persist_incoming_email_with_telegram_alert(payload);
  IF result #>> '{telegram,status}' <> 'ignored' THEN
    RAISE EXCEPTION 'Filtered email was queued: %', result;
  END IF;

  IF NOT has_function_privilege('multisoluciones_web_app',
      'public.persist_incoming_email_with_telegram_alert(jsonb)', 'EXECUTE')
     OR NOT has_function_privilege('multisoluciones_web_app',
      'public.enqueue_inbound_email_telegram(jsonb)', 'EXECUTE') THEN
    RAISE EXCEPTION 'Application role cannot execute the inbound-email notification functions';
  END IF;
END
$test$;
