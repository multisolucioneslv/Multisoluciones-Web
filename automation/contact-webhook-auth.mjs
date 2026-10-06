export const CONTACT_WEBHOOK_SECRET_HEADER = 'x-multisoluciones-webhook-secret';

const SECRET_PATTERN = /^[a-f0-9]{64}$/i;

export function buildWebhookAuthHeaders(secret) {
  if (typeof secret !== 'string' || !SECRET_PATTERN.test(secret)) return null;

  return {
    'content-type': 'application/json',
    [CONTACT_WEBHOOK_SECRET_HEADER]: secret
  };
}
