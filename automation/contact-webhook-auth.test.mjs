import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWebhookAuthHeaders,
  CONTACT_WEBHOOK_SECRET_HEADER
} from './contact-webhook-auth.mjs';

test('builds the private n8n header only for a 256-bit hex secret', () => {
  const secret = 'a'.repeat(64);
  assert.deepEqual(buildWebhookAuthHeaders(secret), {
    'content-type': 'application/json',
    [CONTACT_WEBHOOK_SECRET_HEADER]: secret
  });
});

test('fails closed when the webhook secret is missing or malformed', () => {
  for (const secret of [undefined, '', 'too-short', 'g'.repeat(64), 'a'.repeat(63)]) {
    assert.equal(buildWebhookAuthHeaders(secret), null);
  }
});
