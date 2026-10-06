import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./build-mail-workflows.mjs', import.meta.url));

test('direct-email receiver passes the normalized email object to classification', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'mail-workflow-test-'));
  const input = join(root, 'input');
  const output = join(root, 'output');
  mkdirSync(input);
  mkdirSync(output);
  t.after(() => rmSync(root, { recursive: true, force: true }));

  writeFileSync(join(input, 'contact.json'), JSON.stringify({ nodes: [
    { type: 'n8n-nodes-base.postgres', credentials: { postgres: { id: 'dummy-db', name: 'dummy' } } },
    { type: 'n8n-nodes-base.emailSend', credentials: { smtp: { id: 'dummy-smtp', name: 'dummy' } } },
    { name: 'Buscar Clientes existentes', parameters: { query: 'RETURNING id) SELECT contact.id AS contact_id' } },
    { name: 'Enviar acuse de recibo al cliente' },
    { name: 'Responder al formulario de contacto web' },
  ], connections: { 'Enviar acuse de recibo al cliente': { main: [[]] } } }));
  writeFileSync(join(input, 'old-imap.json'), JSON.stringify({ nodes: [
    { type: 'n8n-nodes-base.emailReadImap', credentials: { imap: { id: 'dummy-imap', name: 'dummy' } } },
    { type: 'n8n-nodes-base.telegram', credentials: { telegramApi: { id: 'dummy-telegram', name: 'dummy' } }, parameters: { chatId: 'dummy-chat' } },
  ] }));

  const result = spawnSync(process.execPath, [script, input, output], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const workflow = JSON.parse(readFileSync(join(output, 'receiver.json'), 'utf8'));
  const lookup = workflow.nodes.find((node) => node.name === 'Buscar contacto y solicitudes por identificadores de correo');
  assert.ok(lookup, 'receiver should include the contact/request lookup node');
  assert.match(lookup.parameters.query, /\$3::jsonb AS email/);
  assert.doesNotMatch(lookup.parameters.query, /input\.email AS email/);
  assert.match(lookup.parameters.options.queryReplacement, /JSON\.stringify\(\$json\.email\)/);

  const contactWorkflow = JSON.parse(readFileSync(join(output, 'contact-with-history.json'), 'utf8'));
  const acknowledgement = contactWorkflow.nodes.find((node) => node.name === 'Enviar acuse de recibo al cliente');
  assert.equal(acknowledgement.parameters.fromEmail, 'Multisoluciones Web <info@multisoluciones.online>');
  assert.match(acknowledgement.parameters.html, /width="100%"/);
  assert.doesNotMatch(acknowledgement.parameters.html, /max-width:600px|width="600"/);
  const renderAcknowledgment = new Function('$node', `return ${acknowledgement.parameters.html.slice(3, -2)}`);
  const html = renderAcknowledgment({
    'Entrada formulario web': { json: { body: { name: 'Cliente de prueba' } } },
    'Buscar Clientes existentes': { json: {
      is_new: true, contact_preference: 'pending', preference_token: '11111111-1111-4111-8111-111111111111'
    } },
    'Determinar idioma de respuesta': { json: { idioma_respuesta: 'es' } }
  });
  assert.match(html, /width="100%"/);
  assert.doesNotMatch(html, /max-width:600px|width="600"/);
  assert.match(html, /Hola Cliente de prueba/);
});
