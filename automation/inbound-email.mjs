// Pure functions: database identity, atomic Message-ID deduplication and sending belong to the workflow.
const clean = (value, limit = 10000) => String(value ?? '').replace(/\u0000/g, '').slice(0, limit);
const singleLine = (value, limit = 200) => clean(value, limit).replace(/[\r\n\x00-\x1f]/g, ' ').trim();
const ids = (value) => [...new Set(clean(Array.isArray(value) ? value.join(' ') : value).match(/<[^<>\s]+@[^<>\s]+>/g) || [])];
const address = (value) => {
  if (Array.isArray(value)) return value.length === 1 ? address(value[0]) : '';
  if (value && typeof value === 'object') return address(value.value || value.address || value.email || value.text);
  const matches = clean(value).match(/[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  return matches.length === 1 ? matches[0].toLowerCase() : '';
};
export function stripQuotedText(value) {
  const lines = clean(value).replace(/\r\n?/g, '\n').split('\n');
  const fresh = [];
  for (const line of lines) {
    if (/^\s*(?:>|On .+wrote:|El .+escribi[oó]:|Le .+[ée]crit|Am .+schrieb|[-_]{2,}\s*(?:Original Message|Mensaje original)|From:|De:|Sent:|Enviado:)/i.test(line)) break;
    fresh.push(line);
  }
  return fresh.join('\n').trim();
}
export function normalizeImapEmail(payload = {}) {
  const data = payload.json || payload;
  // n8n IMAP "Simple" format exposes parsed addresses/headers as objects and
  // often nests the original RFC822 fields under attributes.
  const attributes = data.attributes || data.attr || {};
  const sourceHeaders = data.headers || data.header || data.metadata || attributes.headers || {};
  const headers = {};
  const headerKeys = ['message-id', 'in-reply-to', 'references', 'auto-submitted', 'list-id', 'list-unsubscribe', 'precedence', 'x-autoreply', 'x-autorespond', 'return-path', 'content-type', 'x-multisoluciones-generated', 'from', 'subject'];
  for (const key of headerKeys) if (data[key] != null) headers[key] = clean(Array.isArray(data[key]) ? data[key].join(' ') : data[key], 2000);
  for (const headerSet of [sourceHeaders, data.metadata, data.header, data.headers].filter(Boolean)) {
    const entries = Array.isArray(headerSet)
      ? headerSet.map((header) => typeof header === 'string'
        ? [header.split(':')[0], header]
        : [header.key || header.name || '', header.value || ''])
      : Object.entries(headerSet);
    for (const [key, value] of entries) {
      const normalizedKey = String(key).toLowerCase();
      const raw = clean(Array.isArray(value) ? value.join(' ') : value, 2000);
      const separator = raw.indexOf(':');
      headers[normalizedKey] = separator >= 0 && raw.slice(0, separator).trim().toLowerCase() === normalizedKey
        ? raw.slice(separator + 1).trim() : raw;
    }
  }
  const text = clean(data.textPlain ?? data.text ?? (typeof data.body === 'string' ? data.body : ''));
  const from = address(data.from || data.fromEmail || data.sender || headers.from || attributes.from);
  const rawDate = data.receivedAt || data.date || headers.date || attributes.date;
  const date = new Date(rawDate ? clean(Array.isArray(rawDate) ? rawDate[0] : rawDate).replace(/^date:\s*/i, '') : NaN);
  return {
    from, fromEmail: from, subject: singleLine(data.subject || headers.subject),
    messageId: ids(data.messageId || data.message_id || data.messageID || headers['message-id'] || attributes['message-id'] || attributes.messageId)[0] || '',
    references: ids([data.inReplyTo, data.references, headers['in-reply-to'], headers.references].flat().filter(Boolean)),
    inReplyTo: ids(data.inReplyTo || headers['in-reply-to']).join(' '),
    receivedAt: Number.isNaN(date.getTime()) ? null : date.toISOString(),
    text, body: text, freshText: stripQuotedText(text), headers, duplicate: data.duplicate === true,
    generated: data.generated === true || data.systemGenerated === true,
  };
}
export const parseImapEmail = normalizeImapEmail;

function explicitChoice(text) {
  const value = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const choices = new Set();
  if (/^(?:none|sin seguimiento|no deseo seguimiento|no follow[- ]?up)[.!\s]*$/.test(value.trim())) choices.add('none');
  if (/^(?:por )?(?:correo|email|e-mail)[.!\s]*$/.test(value.trim())) choices.add('email');
  if (/^(?:please\s+)?email me(?:\s+(?:please|instead))?[.!\s]*$/.test(value.trim())) choices.add('email');
  if (/^(?:llamada|call|whatsapp)\s*[:,-]?\s*\+[\d ().-]+$/.test(value.trim())) choices.add(value.trim().startsWith('whatsapp') ? 'whatsapp' : 'call');
  if (/\b(?:no (?:deseo|quiero) (?:seguimiento|que me contacten|ser contactado)|no me contacten|do not contact me|don't contact me|i (?:do not|don't) want (?:follow[- ]?up|to be contacted)|no follow[- ]?up)\b/.test(value)) choices.add('none');
  if (/\b(?:prefiero|quiero|deseo|continuar|contactame|contactenme|escribeme|escribanme|i prefer|i want|contact me|email me|continue|please contact me)\b[^\n.!?]{0,55}\b(?:correo|email|e-mail)\b/.test(value) || /^(?:correo|email|e-mail)[.!\s]*$/.test(value.trim())) choices.add('email');
  if (/\b(?:llamame|llamenme|quiero una llamada|prefiero (?:una )?llamada|contactame por (?:telefono|llamada)|call me|please call|i (?:prefer|want) (?:a )?(?:phone )?call)\b/.test(value) || /^(?:llamada|call)[.!\s]*$/.test(value.trim())) choices.add('call');
  if (/\b(?:prefiero|quiero|deseo|contactame|contactenme|escribeme|escribanme|i prefer|i want|contact me|message me|please contact me)\b[^\n.!?]{0,55}\bwhatsapp\b/.test(value) || /^whatsapp[.!\s]*$/.test(value.trim())) choices.add('whatsapp');
  // Negative or hypothetical channel wording must never become positive consent.
  if (/\b(?:no|not|don't|do not|if|quizas|maybe)\b[^\n.!?]{0,45}\b(?:llam|call|whatsapp|correo|email)/.test(value) && !choices.has('none')) return { choice: null, ambiguous: true, evident: true };
  return { choice: choices.size === 1 ? [...choices][0] : null, ambiguous: choices.size > 1, evident: choices.size > 0 || /\b(?:contactame|contactenme|quiero seguimiento|i want follow[- ]?up|please contact me)\b/.test(value) };
}
export function classifyIncomingEmail({ email, contact, knownRequests = [], duplicate = false } = {}) {
  const envelope = normalizeImapEmail(email);
  const language = contact?.locale === 'es' ? 'es' : 'en';
  const result = { action: 'ignore', reason: '', email: envelope, language, requestId: null, correlation: 'unmatched', preference: null, phone: null, saveMessage: false, notifyAdmin: false, notifyTelegram: false, sendReply: false };
  const ignore = (reason) => ({ ...result, reason });
  if (!envelope.from) return ignore('invalid_sender');
  if (envelope.from === 'info@multisoluciones.online' || envelope.generated || envelope.headers['x-multisoluciones-generated']) return ignore('own_or_generated');
  if (duplicate || envelope.duplicate) return ignore('duplicate');
  const h = envelope.headers;
  if ((h['auto-submitted'] && h['auto-submitted'].toLowerCase() !== 'no') || h['list-id'] || h['list-unsubscribe'] || /\b(?:bulk|list|junk)\b/i.test(h.precedence || '') || h['x-autoreply'] || h['x-autorespond']) return ignore('automated');
  if (/^(?:mailer-daemon|postmaster)@/i.test(envelope.from) || h['return-path']?.trim() === '<>' || /(?:delivery-status|multipart\/report)/i.test(h['content-type'] || '') || /^(?:automatic reply|auto[- ]?reply|out of office|respuesta automatica|respuesta automática|fuera de (?:la )?oficina|undeliverable|delivery (?:status|failure)|mail delivery failed)/i.test(envelope.subject)) return ignore('bounce_or_auto_reply');
  if (!envelope.messageId) return ignore('missing_message_id');
  if (!contact || address(contact.email) !== envelope.from) {
    return { ...result, action: 'new_sender', reason: 'unknown_contact', notifyTelegram: true };
  }
  const matched = knownRequests.filter((request) => {
    const outbound = ids([request.outbound_message_id, request.outboundMessageId, ...(request.outboundMessageIds || []), ...(request.outbound_message_ids || [])].filter(Boolean));
    return outbound.some((id) => envelope.references.includes(id));
  });
  const unique = [...new Set(matched.map((request) => request.id ?? request.request_id).filter((id) => id != null))];
  if (unique.length === 1) { result.requestId = unique[0]; result.correlation = 'matched'; }
  else if (unique.length > 1) result.correlation = 'ambiguous';
  const matchedRequest = unique.length === 1 ? matched.find((request) => (request.id ?? request.request_id) === unique[0]) : null;
  result.language = (matchedRequest?.locale ?? contact.locale) === 'es' ? 'es' : 'en';
  const selection = explicitChoice(envelope.freshText);
  const phones = [...new Set((envelope.freshText.match(/\+[1-9][\d ().-]{6,25}\d/g) || []).map((value) => value.replace(/[^+\d]/g, '')).filter((value) => /^\+[1-9]\d{7,14}$/.test(value)))];
  result.action = 'save'; result.reason = 'ordinary_message'; result.saveMessage = true; result.notifyAdmin = true; result.notifyTelegram = true;
  if (selection.evident && (selection.ambiguous || !selection.choice || (['call', 'whatsapp'].includes(selection.choice) && phones.length !== 1))) {
    result.action = 'clarify'; result.reason = selection.ambiguous ? 'ambiguous_choice' : !selection.choice ? 'missing_channel' : 'missing_or_ambiguous_phone'; result.sendReply = true;
  } else if (selection.choice) {
    result.action = 'preference'; result.reason = 'explicit_choice'; result.preference = selection.choice;
    result.phone = ['call', 'whatsapp'].includes(selection.choice) ? phones[0] : null;
    result.sendReply = true;
  }
  return result;
}
export function buildIncomingReply(result, contact = {}) {
  if (!result.sendReply || result.action === 'ignore') return null;
  const es = result.language === 'es';
  let message = result.action === 'clarify'
    ? (es ? 'Para confirmar tu preferencia, indica una sola opción: correo, llamada, WhatsApp o sin seguimiento. Para llamada o WhatsApp, incluye tu número con el código de país (por ejemplo, +34).' : 'To confirm your preference, choose one option: email, phone call, WhatsApp or no follow-up. For a call or WhatsApp, include your number with the country code (for example, +1).')
    : (es ? 'Hemos registrado tu preferencia de contacto. Un asesor revisará tu mensaje.' : 'We have recorded your contact preference. An advisor will review your message.');
  if (result.action === 'preference') {
    if (result.preference === 'none') message = es ? 'Hemos registrado tu elección de no recibir seguimiento. Este correo confirma tu preferencia; no te enviaremos seguimiento no solicitado.' : 'We have recorded your choice of no follow-up. This email confirms your preference; we will not send unsolicited follow-up.';
    else if (result.preference === 'email') message = es ? 'Hemos registrado tu preferencia. Continuaremos por correo, como elegiste.' : 'We have recorded your preference. We will continue by email, as you chose.';
    else message = es
      ? 'Hemos registrado tu preferencia. Un asesor te contactará ' + (result.preference === 'call' ? 'por llamada' : 'por WhatsApp') + ' al número ' + result.phone + ' cuando esté disponible.'
      : 'We have recorded your preference. An advisor will contact you ' + (result.preference === 'call' ? 'by phone' : 'on WhatsApp') + ' at ' + result.phone + ' when available.';
  }
  const name = singleLine(contact.full_name || contact.name);
  const text = (es ? 'Hola' : 'Hello') + (name ? ' ' + name : '') + ',\n\n' + message + '\n\nMultisoluciones Web';
  return { to: result.email.from, subject: es ? 'Preferencia de contacto | Multisoluciones Web' : 'Contact preference | Multisoluciones Web', text, inReplyTo: result.email.messageId };
}
export function buildAdminNotification(result, contact = {}) {
  if (!result.notifyAdmin) return null;
  return { subject: 'Nuevo correo de contacto | Multisoluciones Web', text: [
    'Contacto: ' + singleLine(contact.full_name || contact.name), 'Correo: ' + result.email.from,
    'Asunto: ' + result.email.subject, 'Clasificación: ' + result.reason,
    'Solicitud: ' + (result.requestId ?? 'sin asignar') + ' (' + result.correlation + ')',
    'Preferencia explícita: ' + (result.preference || 'sin cambio'),
    'Teléfono: ' + (result.phone || 'sin cambio'), '', result.email.freshText,
  ].join('\n') };
}

// Telegram is deliberately a summary-only channel. Neither customer bodies,
// preference tokens nor arbitrary subject text belong in an administrative
// notification that may be displayed on a phone lock screen.
export function buildTelegramNotification(payload = {}, contact = {}) {
  const source = payload.source;
  const summary = (value, limit = 120) => singleLine(value, limit)
    .replace(/[<>`*_\[\]{}]/g, '')
    .trim();
  const name = summary(contact.full_name || contact.name || payload.contact?.name) || 'Sin nombre';
  const email = address(contact.email || payload.contact?.email) || 'sin correo válido';

  if (source === 'inbound_email') {
    const inbound = payload.email || {};
    const sender = address(inbound.from || inbound.fromEmail);
    if (!sender || !inbound.messageId) return null;
    const subject = summary(inbound.subject, 120) || '(sin asunto)';
    const status = payload.contact?.known === true ? 'Contacto conocido' : 'Remitente nuevo';
    return [
      '📩 Nuevo correo entrante',
      '',
      `De: ${sender}`,
      `Asunto: ${subject}`,
      `Estado: ${status}`,
      '',
      'Revisa info@multisoluciones.online para leerlo.',
    ].join('\n');
  }

  if (source === 'web_form') {
    const service = summary(payload.service) || 'Sin especificar';
    return [
      '🔔 Nuevo contacto desde Multisoluciones Web',
      '',
      `Cliente: ${name}`,
      `Correo: ${email}`,
      `Servicio: ${service}`,
      '',
      'Revisa info@multisoluciones.online para el detalle.',
    ].join('\n');
  }

  if (payload.preferenceApplied && ['call', 'whatsapp'].includes(payload.preference)) {
    const channel = payload.preference === 'call' ? 'llamada' : 'WhatsApp';
    return [
      '📞 Preferencia de contacto actualizada',
      '',
      `Cliente: ${name}`,
      `Correo: ${email}`,
      `Canal: ${channel}`,
      '',
      'Revisa info@multisoluciones.online para el detalle.',
    ].join('\n');
  }

  return null;
}
