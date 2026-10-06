-- n8n Postgres: Query Parameters = {{ [JSON.stringify($json.classification)] }}
-- Never interpolate email text directly into this SQL.
SELECT public.persist_incoming_email_with_telegram_alert($1::jsonb) AS result;
