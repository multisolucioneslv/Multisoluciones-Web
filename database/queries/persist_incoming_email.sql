-- n8n Postgres: Query Parameters = {{ [JSON.stringify($json.classification)] }}
-- Never interpolate email text directly into this SQL.
SELECT public.persist_known_contact_email($1::jsonb) AS result;
