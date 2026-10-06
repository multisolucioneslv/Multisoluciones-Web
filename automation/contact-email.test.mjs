import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildContactAck } from './contact-ack.mjs';
import { renderContactEmail } from './contact-email.mjs';

for (const locale of ['es', 'en', 'pt', 'ko']) {
  for (const preference of ['pending', 'email', 'call', 'whatsapp', 'none']) {
    test(`HTML ${locale} ${preference}`, () => {
      const ack = buildContactAck({ name: '<img src=x onerror=alert(1)>', locale }, {
        is_new: false, contact_preference: preference,
        preference_token: '11111111-1111-4111-8111-111111111111'
      });
      const html = renderContactEmail(ack);
      assert.ok(html.includes('lang="' + (locale === 'es' ? 'es' : 'en') + '"'));
      assert.ok(html.includes('&lt;img'));
      assert.ok(!html.includes('<img'));
      assert.ok(html.includes('#075e59'));
      assert.equal((html.match(/<table role="presentation" width="100%"/g) || []).length, 2);
      assert.match(html, /width="100%"[^>]*style="width:100%;max-width:none;/);
      assert.match(html, /<td align="left" width="100%" style="width:100%;padding:0;">/);
      assert.ok(!html.includes('max-width:600px'));
      assert.ok(!html.includes('Multisoluciones IA'));
      assert.ok(!html.includes('n8n'));
      assert.equal((html.match(/href="https:\/\/multisoluciones.online[^\"]*\?channel=/g) || []).length, preference === 'pending' ? 4 : 0);
    });
  }
}
