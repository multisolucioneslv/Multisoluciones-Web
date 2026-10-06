import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeImapEmail, classifyIncomingEmail, buildIncomingReply, buildAdminNotification, buildTelegramNotification } from './inbound-email.mjs';
const contact = { email: 'client@example.org', locale: 'es', name: 'Cliente' };
const email = (text, extra = {}) => ({ from: { value: [{ address: contact.email }] }, messageId: '<inbound@example.org>', textPlain: text, ...extra });
const classify = (text, extra = {}) => classifyIncomingEmail({ email: email(text), contact, ...extra });

test('normalizes IMAP Date header lines and date arrays', () => {
  for (const date of ['Date: Sun, 4 Oct 2026 13:34:00 -0700', ['Date: Sun, 4 Oct 2026 13:34:00 -0700']]) {
    assert.equal(normalizeImapEmail(email('Hello', {date})).receivedAt, '2026-10-04T20:34:00.000Z');
  }
});
test('normalizes structured IMAP and prevents header injection', () => {
  const parsed = normalizeImapEmail(email('Hola', { subject: 'Hola\r\nBcc: victim@example.org', headers: { 'In-Reply-To': '<out@example.org>' } }));
  assert.equal(parsed.from, contact.email); assert.ok(!parsed.subject.includes('\n')); assert.deepEqual(parsed.references, ['<out@example.org>']);
});
test('unknown legitimate senders get a Telegram alert only; filtered and unkeyed mail is ignored', () => {
  const unknown = classifyIncomingEmail({email: email('Hello', {from:'new@example.org'})});
  assert.equal(unknown.action, 'new_sender'); assert.equal(unknown.notifyTelegram, true);
  assert.equal(unknown.saveMessage, false); assert.equal(unknown.notifyAdmin, false); assert.equal(unknown.sendReply, false);
  const notification = buildTelegramNotification({source:'inbound_email',email:{from:'new@example.org',messageId:'<new@example.org>',subject:'Hello'},contact:{email:'new@example.org',known:false}});
  assert.match(notification, /Remitente nuevo/); assert.doesNotMatch(notification, /Hello\\n/);
  for (const [extra, reason] of [
    [{ email: email('Hi', { from: 'info@multisoluciones.online' }) }, 'own_or_generated'],
    [{ email: email('Hi', { generated: true }) }, 'own_or_generated'],
    [{ duplicate: true }, 'duplicate'],
    [{ email: email('Hi', { duplicate: true }) }, 'duplicate'],
    [{ email: email('Hi', { messageId: '' }) }, 'missing_message_id'],
  ]) { const result = classify('Hi', extra); assert.equal(result.reason, reason); assert.equal(result.saveMessage, false); assert.equal(buildIncomingReply(result), null); }
});
test('direct mail Telegram alert is sanitized and never contains the body', () => {
  const result = buildTelegramNotification({source:'inbound_email',email:{from:'client@example.org',messageId:'<id@example.org>',subject:'Hello\n<b>bad</b> _` [x]'},contact:{known:true},body:'SECRET BODY'});
  assert.match(result,/De: client@example.org/); assert.match(result,/Contacto conocido/);
  assert.doesNotMatch(result,/SECRET BODY|<|>|`/);
});
test('automated, bounce and list mail never produce replies', () => {
  for (const extra of [ {headers:{'Auto-Submitted':'auto-replied'}}, {headers:{'List-ID':'newsletter'}}, {headers:{'Return-Path':'<>'}}, {from:'mailer-daemon@example.org'}, {subject:'Out of office'}, {headers:{'Content-Type':'multipart/report; report-type=delivery-status'}} ]) {
    const result = classify('Call me +14155550123', { email: email('Call me +14155550123', extra) });
    assert.equal(result.action, 'ignore'); assert.equal(result.sendReply, false);
  }
});
test('recognizes explicit bilingual preferences with international phones', () => {
  for (const [text, preference] of [['Llámame al +34 612 345 678','call'], ['Call me at +1 (415) 555-0123','call'], ['Prefiero WhatsApp al +34 612 345 678','whatsapp'], ['Contact me on WhatsApp +14155550123','whatsapp'], ['Prefiero continuar por correo','email'], ['Please contact me by email','email'], ['No deseo seguimiento','none'], ['Do not contact me','none']]) {
    const result = classify(text); assert.equal(result.action, 'preference', text); assert.equal(result.preference, preference, text);
    assert.equal(result.sendReply, true);
  }
});
test('none confirms once and channel confirmations explain actual follow-up', () => {
  const none = buildIncomingReply(classify('No deseo seguimiento'), {full_name:'Ana'});
  assert.match(none.text, /^Hola Ana,/); assert.match(none.text, /no te enviaremos seguimiento no solicitado/);
  assert.match(buildIncomingReply(classify('Llámame +34612345678')).text, /por llamada.*cuando esté disponible/);
  assert.match(buildIncomingReply(classify('Prefiero WhatsApp +34612345678')).text, /por WhatsApp.*cuando esté disponible/);
  assert.match(buildIncomingReply(classify('Por correo')).text, /Continuaremos por correo/);
});
test('simple root IMAP headers, arrays and metadata keep automated safeguards', () => {
  const parsed = normalizeImapEmail({from:['Client <client@example.org>'], 'message-id':['<simple@example.org>'], 'in-reply-to':['<out@example.org>'], textPlain:'Thanks'});
  assert.equal(parsed.from, contact.email); assert.equal(parsed.messageId,'<simple@example.org>'); assert.deepEqual(parsed.references,['<out@example.org>']);
  for (const extra of [{'auto-submitted':['auto-generated']}, {metadata:{'Auto-Submitted':['auto-replied']}}, {headers:[{key:'auto-submitted',value:'auto-replied'}]}]) {
    assert.equal(classify('Call me +14155550123',{email:email('Call me +14155550123',extra)}).action,'ignore');
  }
});
test('actual IMAP simple metadata raw header lines normalize and block automatic replies', () => {
  const actual = {from:'Client <client@example.org>',date:'2026-10-04T10:00:00Z',textPlain:'Please call me +14155550123',metadata:{'message-id':'Message-ID: <actual@example.org>','in-reply-to':'In-Reply-To: <out@example.org>',references:'References: <older@example.org> <out@example.org>','auto-submitted':'Auto-Submitted: auto-replied'}};
  const parsed = normalizeImapEmail(actual);
  assert.equal(parsed.messageId,'<actual@example.org>');
  assert.equal(parsed.headers['auto-submitted'],'auto-replied');
  assert.deepEqual(parsed.references,['<out@example.org>','<older@example.org>']);
  assert.equal(classifyIncomingEmail({email:actual,contact}).reason,'automated');
  assert.equal(parsed.receivedAt,'2026-10-04T10:00:00.000Z');
});
test('n8n Simple IMAP attribute headers preserve sender, Message-ID and date', () => {
  const actual = {from:{value:[{address:'new@example.org'}]}, subject:'A new message', textPlain:'Hello', attributes:{date:'2026-10-05T12:00:00Z',headers:{'message-id':'<new-1@example.org>'}}};
  const normalized = normalizeImapEmail(actual);
  assert.equal(normalized.from,'new@example.org');
  assert.equal(normalized.messageId,'<new-1@example.org>');
  assert.equal(normalized.receivedAt,'2026-10-05T12:00:00.000Z');
  assert.equal(classifyIncomingEmail({email:actual}).reason,'unknown_contact');
});
test('valid known and new senders both pass intake filtering; automated mail does not', () => {
  const known = email('A valid message', {date:'2026-10-05T12:00:00Z'});
  const unknown = email('A valid message', {from:'new@example.org',date:'2026-10-05T12:00:00Z'});
  for (const message of [known, unknown]) assert.notEqual(classifyIncomingEmail({email:message,contact:message===known?contact:null}).action,'ignore');
  assert.equal(classifyIncomingEmail({email:email('automatic',{date:'2026-10-05T12:00:00Z',headers:{'auto-submitted':'auto-replied'}})}).action,'ignore');
});
test('missing phone, conflicting choices and incomplete intent clarify', () => {
  for (const text of ['Llámame al 612345678', 'Prefiero WhatsApp', 'Prefiero correo y quiero una llamada', 'Please contact me', 'No quiero WhatsApp', 'Call me +14155550123 or +14155550999']) {
    const result = classify(text); assert.equal(result.action, 'clarify', text); assert.equal(result.preference, null); assert.ok(buildIncomingReply(result));
  }
});
test('short unambiguous channel responses and affirmative Spanish calls count', () => {
  assert.equal(classify('WhatsApp +14155550123').preference, 'whatsapp');
  assert.equal(classify('Sí, llámame al +34612345678').preference, 'call');
  assert.equal(classify('Por correo').preference, 'email');
  assert.equal(classify('none').preference, 'none');
  assert.equal(classify('Email me.').preference, 'email');
  assert.equal(classify('Please email me.').preference, 'email');
  assert.equal(classify('Can I email you?').action, 'save');
});
test('number alone, thanks and mentions do not change preference', () => {
  for (const text of ['Gracias', '+14155550123', 'My WhatsApp stopped working', 'El correo llegó correctamente']) {
    const result = classify(text); assert.equal(result.action, 'save', text); assert.equal(result.preference, null); assert.equal(result.sendReply, false); assert.ok(buildAdminNotification(result, contact));
  }
});
test('quoted previous offers and instructions never count as consent', () => {
  for (const text of ['Gracias\n> Prefiero WhatsApp +14155550123', 'Thanks\nOn Tuesday, advisor wrote:\nCall me +14155550123', 'Gracias\nEl lunes asesor escribió:\nNo deseo seguimiento', 'Thanks\nFrom: Advisor\nPlease contact me by email']) {
    assert.equal(classify(text).action, 'save');
  }
});
test('correlates registered references only, leaves multiple and unregistered requests unassigned', () => {
  const knownRequests = [{id: 1, outbound_message_id:'<first@example.org>'}, {id:2,outboundMessageIds:['<second@example.org>']}];
  const correlated = classify('Thanks', { email:email('Thanks',{ inReplyTo:'<first@example.org>' }), knownRequests });
  assert.equal(correlated.requestId,1); assert.equal(correlated.correlation,'matched');
  const ambiguous = classify('Thanks', { email:email('Thanks',{ references:'<first@example.org> <second@example.org>' }), knownRequests });
  assert.equal(ambiguous.requestId,null); assert.equal(ambiguous.correlation,'ambiguous');
  assert.equal(classify('Thanks', {knownRequests}).requestId,null);
});
test('locale es produces Spanish, all other locales English; safe plain text only', () => {
  assert.match(buildIncomingReply(classify('Llámame')).text,/Para confirmar/);
  const result = classify('Call me', {contact:{...contact,locale:'ko'}});
  assert.match(buildIncomingReply(result).text,/To confirm/);
  assert.equal(buildAdminNotification(classify('Gracias',{contact:{...contact,name:'Name\r\nInjected'}}),{name:'Name\r\nInjected'}).text.split('\n')[0],'Contacto: Name  Injected');
});
test('uniquely matched request locale takes precedence over contact locale', () => {
  const options = {email:email('Call me',{inReplyTo:'<localized@example.org>'}),contact:{...contact,locale:'en'}};
  const spanish = classifyIncomingEmail({...options,knownRequests:[{id:1,outbound_message_id:'<localized@example.org>',locale:'es'}]});
  assert.equal(spanish.language,'es'); assert.match(buildIncomingReply(spanish).text,/Para confirmar/);
  for (const locale of ['pt','ko']) {
    assert.equal(classifyIncomingEmail({...options,contact:{...contact,locale:'es'},knownRequests:[{id:1,outbound_message_id:'<localized@example.org>',locale}]}).language,'en');
  }
});
test('ambiguous request correlation leaves request unassigned but permits explicit contact preference', () => {
  const result = classify('Call me +14155550123',{email:email('Call me +14155550123',{references:'<one@example.org> <two@example.org>'}),knownRequests:[{id:1,outbound_message_id:'<one@example.org>'},{id:2,outbound_message_id:'<two@example.org>'}]});
  assert.equal(result.action,'preference'); assert.equal(result.reason,'explicit_choice'); assert.equal(result.preference,'call'); assert.equal(result.phone,'+14155550123'); assert.equal(result.requestId,null);
  assert.equal(result.correlation,'ambiguous'); assert.equal(result.notifyAdmin,true);
});
