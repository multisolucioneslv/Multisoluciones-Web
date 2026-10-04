import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildContactAck } from './contact-ack.mjs';

const token = '11111111-1111-4111-8111-111111111111';
for (const locale of ['es', 'en', 'pt', 'ko']) {
  for (const is_new of [true, false]) {
    for (const preference of ['pending', 'email', 'call', 'whatsapp', 'none']) {
      test(`${locale} ${is_new ? 'new' : 'returning'} ${preference}`, () => {
        const ack = buildContactAck({ name: 'Cliente de prueba', locale }, {
          is_new, contact_preference: preference, preference_token: token
        });
        assert.equal(ack.language, locale === 'es' ? 'es' : 'en');
        assert.ok(ack.text.includes('Cliente de prueba'));
        assert.equal(ack.text.includes('/contact-preference/'), preference === 'pending');
        assert.equal(ack.text.includes('Welcome') || ack.text.includes('bienvenida'), is_new);
        assert.ok(!ack.text.includes('solicitud anterior'));
        if (preference === 'pending') {
          assert.ok(ack.text.includes(locale === 'es' ? '/es/contact-preference/' : '.online/contact-preference/'));
          for (const channel of ['email', 'call', 'whatsapp', 'none']) assert.ok(ack.text.includes('?channel=' + channel));
        }
        if (['call', 'whatsapp'].includes(preference)) assert.ok(ack.text.includes(locale === 'es' ? 'cuando esté disponible' : 'when available'));
        if (preference === 'none') assert.ok(ack.text.includes(locale === 'es' ? 'no recibir seguimiento' : 'not to receive follow-up'));
      });
    }
  }
}
test('pending requires valid token', () => {
  assert.throws(() => buildContactAck({ locale: 'es' }, {}), /token/);
});
test('unknown preference fails closed', () => {
  assert.throws(() => buildContactAck({ locale: 'es' }, { contact_preference: 'invalid' }), /preference/);
});
