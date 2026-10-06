// Table layout and inline styles preserve compatibility with email clients.
// No external images, tracking pixels, scripts or platform attribution.
export function renderContactEmail(ack) {
  const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  const blocks = ack.text.split('\n\n');
  const paragraphs = blocks.map((block) => {
    const lines = block.split('\n').map((line) => {
      const link = line.match(/^(.*): (https:\/\/multisoluciones\.online(?:\/es)?\/contact-preference\/[0-9a-f-]{36}\?channel=(?:email|call|whatsapp|none))$/i);
      if (!link) return escape(line);
      return '<a href="' + escape(link[2]) + '" style="display:inline-block;background:#08766f;color:#ffffff;text-decoration:none;border-radius:8px;padding:12px 18px;margin:6px 0;font-weight:bold;">' + escape(link[1]) + '</a>';
    });
    return '<p style="margin:0 0 18px;color:#10232a;font-size:16px;line-height:1.65;">' + lines.join('<br>') + '</p>';
  }).join('');
  const subtitle = ack.language === 'es' ? 'Gracias por escribirnos' : 'Thank you for reaching out';
  return '<!doctype html><html lang="' + (ack.language === 'es' ? 'es' : 'en') + '"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
    + '<body style="margin:0;padding:24px 12px;background:#f2f8f6;font-family:Arial,Helvetica,sans-serif;">'
    + '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:none;"><tr><td align="left" width="100%" style="width:100%;padding:0;">'
    + '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:none;background:#fbfdfb;border:1px solid #d7e5e1;border-radius:12px;overflow:hidden;">'
    + '<tr><td style="background:#075e59;padding:30px 24px;text-align:center;"><h1 style="margin:0;color:#ffffff;font-size:24px;">Multisoluciones Web</h1><p style="margin:10px 0 0;color:#eafbf6;font-size:14px;">' + subtitle + '</p></td></tr>'
    + '<tr><td style="padding:30px 24px;">' + paragraphs + '</td></tr>'
    + '<tr><td style="padding:18px 24px;background:#eafbf6;border-top:1px solid #d7e5e1;text-align:center;color:#4b6266;font-size:12px;"><a href="https://multisoluciones.online" style="color:#075e59;">multisoluciones.online</a></td></tr>'
    + '</table></td></tr></table></body></html>';
}
