-- Additive schema migration for the dedicated Multisoluciones Web database.
-- Safe to re-run. This must only be applied to multisoluciones_web, never to
-- n8n's internal database or SistemaSaaS.

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS contact_preference text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS contact_preference_updated_at timestamptz;

ALTER TABLE public.requests
  ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS preference_token uuid,
  ADD COLUMN IF NOT EXISTS preference_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS preference_used_at timestamptz;

DO $migration$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'contacts_contact_preference_check'
      AND conrelid = 'public.contacts'::regclass
  ) THEN
    ALTER TABLE public.contacts
      ADD CONSTRAINT contacts_contact_preference_check
      CHECK (contact_preference IN ('pending', 'email', 'call', 'whatsapp', 'none'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'requests_locale_check'
      AND conrelid = 'public.requests'::regclass
  ) THEN
    ALTER TABLE public.requests
      ADD CONSTRAINT requests_locale_check
      CHECK (locale IN ('en', 'es', 'ko', 'pt'));
  END IF;
END
$migration$;

CREATE UNIQUE INDEX IF NOT EXISTS requests_preference_token_uidx
  ON public.requests (preference_token)
  WHERE preference_token IS NOT NULL;
