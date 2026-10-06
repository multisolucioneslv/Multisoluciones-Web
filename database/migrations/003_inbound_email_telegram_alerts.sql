-- Let the transactional outbox represent legitimate mail from an unknown
-- sender without inventing a contact or message-history row.
ALTER TABLE public.email_notifications
  ALTER COLUMN contact_id DROP NOT NULL,
  ALTER COLUMN message_id DROP NOT NULL;

-- Message-ID is the durable idempotency key for direct-mail Telegram alerts.
CREATE UNIQUE INDEX IF NOT EXISTS email_notifications_inbound_telegram_message_uidx
  ON public.email_notifications ((payload #>> '{email,messageId}'))
  WHERE kind = 'telegram' AND payload->>'source' = 'inbound_email'
    AND NULLIF(payload #>> '{email,messageId}', '') IS NOT NULL;

CREATE OR REPLACE FUNCTION public.enqueue_inbound_email_telegram(p_payload jsonb)
RETURNS jsonb LANGUAGE plpgsql AS $function$
DECLARE
  v_email jsonb := COALESCE(p_payload->'email', '{}'::jsonb);
  v_message_key text := NULLIF(btrim(v_email->>'messageId'), '');
  v_from text := lower(btrim(COALESCE(v_email->>'fromEmail', v_email->>'from', '')));
  v_subject text := left(btrim(regexp_replace(COALESCE(v_email->>'subject', ''), '[[:cntrl:]]+', ' ', 'g')), 180);
  v_message_id bigint;
  v_contact_id bigint;
  v_request_id bigint;
  v_contact_name text;
  v_contact_email text;
  v_known boolean := false;
  v_payload jsonb;
  v_notification_id bigint;
BEGIN
  IF p_payload->>'notifyTelegram' IS DISTINCT FROM 'true'
     OR p_payload->>'action' = 'ignore' THEN
    RETURN jsonb_build_object('status', 'ignored');
  END IF;
  IF v_from !~ '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
     OR v_message_key IS NULL OR length(v_message_key) > 998
     OR v_message_key !~ '^<[^<>[:space:]]+@[^<>[:space:]]+>$' THEN
    RETURN jsonb_build_object('status', 'ignored', 'reason', 'invalid_sender_or_message_id');
  END IF;

  SELECT m.id, m.contact_id, m.request_id, c.full_name, c.email_normalized
    INTO v_message_id, v_contact_id, v_request_id, v_contact_name, v_contact_email
  FROM public.messages m
  JOIN public.contacts c ON c.id = m.contact_id
  WHERE m.email_message_id = v_message_key
    AND m.direction = 'inbound' AND m.channel = 'email'
  LIMIT 1;
  v_known := FOUND;

  IF NOT v_known AND p_payload->>'action' <> 'new_sender' THEN
    RETURN jsonb_build_object('status', 'ignored', 'reason', 'inbound_message_not_persisted');
  END IF;
  IF v_known AND EXISTS (
    SELECT 1 FROM public.email_notifications n
    WHERE n.message_id = v_message_id AND n.kind = 'telegram'
  ) THEN
    RETURN jsonb_build_object('status', 'already_queued', 'message_id', v_message_id);
  END IF;

  v_payload := jsonb_build_object(
    'source', 'inbound_email',
    'email', jsonb_build_object('from', v_from, 'fromEmail', v_from,
      'messageId', v_message_key, 'subject', v_subject),
    'contact', jsonb_build_object('name', COALESCE(v_contact_name, ''),
      'email', COALESCE(v_contact_email, v_from), 'known', v_known)
  );

  INSERT INTO public.email_notifications(contact_id, request_id, message_id, kind, payload)
  VALUES(v_contact_id, v_request_id, v_message_id, 'telegram', v_payload)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_notification_id;

  IF v_notification_id IS NULL THEN
    SELECT n.id INTO v_notification_id FROM public.email_notifications n
    WHERE n.kind = 'telegram' AND n.payload->>'source' = 'inbound_email'
      AND n.payload #>> '{email,messageId}' = v_message_key
    LIMIT 1;
    RETURN jsonb_build_object('status', 'already_queued', 'notification_id', v_notification_id);
  END IF;
  RETURN jsonb_build_object('status', 'queued', 'notification_id', v_notification_id,
    'known_contact', v_known);
END
$function$;

CREATE OR REPLACE FUNCTION public.persist_incoming_email_with_telegram_alert(p_payload jsonb)
RETURNS jsonb LANGUAGE plpgsql AS $function$
DECLARE
  v_saved jsonb;
  v_alert jsonb;
BEGIN
  -- Known contacts keep the existing deduplication, message, and consent path.
  -- Unknown senders are not added as contacts; only a minimal alert is queued.
  v_saved := public.persist_known_contact_email(p_payload);
  v_alert := public.enqueue_inbound_email_telegram(p_payload);
  RETURN jsonb_build_object('persistence', v_saved, 'telegram', v_alert);
END
$function$;

REVOKE ALL ON FUNCTION public.enqueue_inbound_email_telegram(jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.persist_incoming_email_with_telegram_alert(jsonb) FROM PUBLIC;
DO $migration$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'multisoluciones_web_app') THEN
    GRANT EXECUTE ON FUNCTION public.enqueue_inbound_email_telegram(jsonb),
      public.persist_incoming_email_with_telegram_alert(jsonb) TO multisoluciones_web_app;
  END IF;
END
$migration$;
