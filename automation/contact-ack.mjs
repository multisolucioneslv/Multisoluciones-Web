// Shared, dependency-free logic rendered into the n8n email expression.
export function buildContactAck(form, contact) {
  const spanish = form.locale === 'es';
  const language = spanish ? 'es' : 'en';
  const preference = contact.contact_preference || 'pending';
  const returning = contact.is_new === false || Number(contact.previous_request_count || 0) > 0;
  const name = String(form.name || '').trim();
  const opening = returning
    ? (spanish ? 'Gracias por volver a escribirnos.' : 'Thank you for writing to us again.')
    : (spanish ? 'Gracias por contactarnos. Te damos la bienvenida a Multisoluciones Web.' : 'Thank you for contacting us. Welcome to Multisoluciones Web.');
  const received = spanish
    ? 'Hemos recibido tu mensaje y lo estamos revisando.'
    : 'We have received your message and are reviewing it.';
  let followUp;
  if (preference === 'pending') {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(contact.preference_token || '')) {
      throw new Error('Missing valid preference token');
    }
    // The follow-up page uses the same language as the email, including pt/ko.
    const base = 'https://multisoluciones.online' + (spanish ? '/es' : '')
      + '/contact-preference/' + contact.preference_token + '?channel=';
    followUp = (spanish ? 'Si deseas seguimiento, elige cómo prefieres que te contactemos:' : 'If you would like follow-up, choose how you prefer us to contact you:')
      + '\n' + (spanish ? 'Continuar por correo' : 'Continue by email') + ': ' + base + 'email'
      + '\n' + (spanish ? 'Llamada directa' : 'Phone call') + ': ' + base + 'call'
      + '\nWhatsApp: ' + base + 'whatsapp'
      + '\n' + (spanish ? 'No deseo seguimiento' : 'I do not want follow-up') + ': ' + base + 'none';
  } else if (preference === 'email') {
    followUp = spanish ? 'Continuaremos por correo, como elegiste.' : 'We will continue by email, as you chose.';
  } else if (preference === 'call' || preference === 'whatsapp') {
    followUp = spanish
      ? 'Un asesor te contactará ' + (preference === 'call' ? 'por llamada' : 'por WhatsApp') + ' al número registrado cuando esté disponible.'
      : 'An advisor will contact you ' + (preference === 'call' ? 'by phone' : 'on WhatsApp') + ' at your registered number when available.';
  } else if (preference === 'none') {
    followUp = spanish
      ? 'Esta es únicamente una confirmación de recepción. Respetamos tu elección de no recibir seguimiento.'
      : 'This is only an acknowledgment of receipt. We respect your choice not to receive follow-up.';
  } else {
    throw new Error('Unknown contact preference');
  }
  return {
    language,
    subject: spanish ? 'Recibimos tu mensaje | Multisoluciones Web' : 'We received your message | Multisoluciones Web',
    text: [(spanish ? 'Hola ' : 'Hello ') + name + ',', opening, received, followUp, 'Multisoluciones Web'].join('\n\n')
  };
}
