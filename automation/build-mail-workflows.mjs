// Builds importable n8n artifacts from credential references, never decrypted secrets.
import { readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
const [auditDirectory, outputDirectory = auditDirectory] = process.argv.slice(2);
if (!auditDirectory) throw new Error('Usage: node automation/build-mail-workflows.mjs AUDIT_DIRECTORY [OUTPUT_DIRECTORY]');
// n8n exports one workflow as an object. Earlier protected audit exports used
// a one-item array, so accept both without changing the imported workflow.
const load = (file) => {
  const parsed = JSON.parse(readFileSync(`${auditDirectory}/${file}`, 'utf8'));
  return Array.isArray(parsed) ? parsed[0] : parsed;
};
const current = load('contact.json');
const old = load('old-imap.json');
const postgres = current.nodes.find(n => n.type.endsWith('.postgres')).credentials;
const smtp = current.nodes.find(n => n.type.endsWith('.emailSend')).credentials;
const imap = old.nodes.find(n => n.type.endsWith('.emailReadImap')).credentials;
const telegramNode = old.nodes.find(n => n.type.endsWith('.telegram'));
const telegram = telegramNode?.credentials?.telegramApi;
const telegramChatId = telegramNode?.parameters?.chatId;
if (!telegram || !telegramChatId) throw new Error('The audit export does not contain a Telegram credential and chat destination');
const source = readFileSync(new URL('./inbound-email.mjs', import.meta.url), 'utf8').replace(/^export /gm, '');
const renderer = readFileSync(new URL('./contact-email.mjs', import.meta.url), 'utf8').replace(/^export /gm, '');
const sql = file => readFileSync(new URL(`../database/queries/${file}.sql`, import.meta.url), 'utf8');
const node = (name, type, parameters, position, credentials, typeVersion=1) => ({id:randomUUID(),name,type:`n8n-nodes-base.${type}`,typeVersion,position,parameters,...(credentials?{credentials}:{})});
const code = (name,jsCode,position) => node(name,'code',{mode:'runOnceForAllItems',jsCode},position,null,2);
const db = (name,query,queryReplacement,position) => node(name,'postgres',{operation:'executeQuery',query,options:{queryReplacement}},position,postgres,2.6);
const connect = (connections,from,to,output=0) => {
  const entries = connections[from] ||= {main:[]};
  entries.main[output] ||= [];
  entries.main[output].push({node:to,type:'main',index:0});
};
const startDate = process.env.MW_EMAIL_START_AT || new Date().toISOString();
if (Number.isNaN(Date.parse(startDate))) throw new Error('Invalid MW_EMAIL_START_AT');
const receiverNodes = [
  node('Recibir correos directos - info Multisoluciones Web','emailReadImap',{mailbox:'INBOX',postProcessAction:'nothing',format:'simple',downloadAttachments:false,options:{customEmailConfig:'["ALL"]',trackLastMessageId:true,forceReconnect:30}},[0,0],imap,2.1),
  code('Normalizar correo y excluir automáticos',source+`\nconst cutoff = ${JSON.stringify(startDate)};\nreturn $input.all().flatMap((item,index) => { const email=normalizeImapEmail(item.json); if (!email.receivedAt || email.receivedAt < cutoff) return []; const preliminary=classifyIncomingEmail({email}); if (preliminary.action === 'ignore') return []; return [{json:{email},pairedItem:{item:index}}]; });`,[240,0]),
  db('Buscar contacto y solicitudes por identificadores de correo',`SELECT row_to_json(c) AS contact, input.email AS email, COALESCE((SELECT jsonb_agg(q) FROM (SELECT r.id,r.locale,array_agg(m.email_message_id) AS "outboundMessageIds" FROM public.requests r JOIN public.messages m ON m.request_id=r.id AND m.direction='outbound' AND m.email_message_id=ANY($2::text[]) WHERE r.contact_id=c.id GROUP BY r.id,r.locale LIMIT 20) q),'[]'::jsonb) AS requests FROM (SELECT $1::text AS email) input LEFT JOIN public.contacts c ON c.email_normalized=input.email LIMIT 1;`,"={{ [$json.email.from, $json.email.references, JSON.stringify($json.email)] }}",[480,0]),
  code('Clasificar respuesta y autorización explícita',source+`\nreturn $input.all().map((item,index) => { const row=item.json; const contact=row.contact ? {...row.contact,email:row.contact.email_normalized,name:row.contact.full_name,known:true} : {email:row.email.from,name:'',known:false}; const classification=classifyIncomingEmail({email:row.email,contact:row.contact ? contact : null,knownRequests:row.requests}); classification.contact=contact; return {json:{classification},pairedItem:{item:index}}; });`,[720,0]),
  db('Guardar historial consentimiento y avisos pendientes',sql('persist_incoming_email'),"={{ [JSON.stringify($json.classification)] }}",[960,0])
];
const receiverConnections={};
receiverNodes.slice(1).forEach((n,i)=>connect(receiverConnections,receiverNodes[i].name,n.name));
const receiver={id:'MWCorreoDirecto20261004',name:'Multisoluciones Web - Recibir correos directos',active:false,nodes:receiverNodes,connections:receiverConnections,settings:{executionOrder:'v1',executionTimeout:120},pinData:{},staticData:null};
const adminName='Enviar aviso de correo a administración';
const replyName='Enviar confirmación al cliente por correo';
const workerNodes=[
  node('Revisar avisos pendientes cada minuto','scheduleTrigger',{rule:{interval:[{field:'minutes',minutesInterval:1}]}},[0,0],null,1.2),
  db('Reservar avisos pendientes sin duplicarlos',`WITH jobs AS (SELECT id FROM public.email_notifications WHERE state='pending' AND kind IN ('admin','reply','telegram') ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 20) UPDATE public.email_notifications n SET state='processing',claim_token=$1,claimed_at=now() FROM jobs WHERE n.id=jobs.id;`,"={{ [String($execution.id)] }}",[240,0]),
  db('Leer avisos reservados por esta ejecución',`SELECT id,kind,contact_id,request_id,message_id,payload,claim_token FROM public.email_notifications WHERE state='processing' AND claim_token=$1::text ORDER BY id;`,"={{ [String($execution.id)] }}",[360,0]),
  code('Preparar avisos de correo y Telegram',source+'\n'+renderer+`\nreturn $input.all().map((item,index)=> { const job=item.json; const result=job.payload; const contact=result.contact || {}; if (job.kind==='telegram') { const text=buildTelegramNotification(result,contact); if (!text) throw new Error('Telegram notification without safe summary'); return {json:{...job,text},pairedItem:{item:index}}; } const content=job.kind==='admin'?buildAdminNotification(result,contact):buildIncomingReply(result,contact); if (!content) throw new Error('Notification without content'); return {json:{...job,to:job.kind==='admin'?'info@multisoluciones.online':content.to,subject:content.subject,text:content.text,html:renderContactEmail({...content,language:job.kind==='admin'?'es':result.language})},pairedItem:{item:index}}; });`,[480,0]),
  node('¿El aviso es Telegram?','if',{conditions:{options:{caseSensitive:true,leftValue:'',typeValidation:'strict',version:2},conditions:[{id:randomUUID(),leftValue:'={{ $json.kind }}',rightValue:'telegram',operator:{type:'string',operation:'equals'}}],combinator:'and'},options:{}},[720,0],null,2.2),
  node('Notificar por Telegram - Multisoluciones Web','telegram',{resource:'message',operation:'sendMessage',chatId:telegramChatId,text:'={{ $json.text }}',additionalFields:{}},[960,-220],{telegramApi:telegram},1),
  node('¿El aviso es para administración?','if',{conditions:{options:{caseSensitive:true,leftValue:'',typeValidation:'strict',version:2},conditions:[{id:randomUUID(),leftValue:'={{ $json.kind }}',rightValue:'admin',operator:{type:'string',operation:'equals'}}],combinator:'and'},options:{}},[720,0],null,2.2),
  node(adminName,'emailSend',{fromEmail:'Multisoluciones Web <info@multisoluciones.online>',toEmail:'={{ $json.to }}',subject:'={{ $json.subject }}',emailFormat:'both',text:'={{ $json.text }}',html:'={{ $json.html }}',options:{appendAttribution:false}},[960,-100],smtp,2.1),
  node(replyName,'emailSend',{fromEmail:'Multisoluciones Web <info@multisoluciones.online>',toEmail:'={{ $json.to }}',subject:'={{ $json.subject }}',emailFormat:'both',text:'={{ $json.text }}',html:'={{ $json.html }}',options:{appendAttribution:false,replyTo:'info@multisoluciones.online'}},[960,100],smtp,2.1),
  db('Registrar aviso Telegram entregado',sql('complete_email_notification'),"={{ [$('Preparar avisos de correo y Telegram').item.json.id, $('Preparar avisos de correo y Telegram').item.json.claim_token, $json.error ? 'uncertain' : 'sent', null, $json.error || null] }}",[1200,-220]),
  db('Registrar aviso enviado a administración',sql('complete_email_notification'),"={{ [$('Preparar avisos de correo y Telegram').item.json.id, $('Preparar avisos de correo y Telegram').item.json.claim_token, $json.error ? 'uncertain' : 'sent', $json.messageId || null, $json.error || null] }}",[1200,-100]),
  db('Registrar confirmación enviada y su identificador SMTP',`WITH completed AS (${sql('complete_email_notification').replace(/;\s*$/,'')}) INSERT INTO public.messages(contact_id,request_id,direction,channel,body,is_test,email_message_id,email_subject) SELECT c.id,$6::bigint,'outbound','email',$7::text,c.is_test,$4::text,$8::text FROM completed n JOIN public.email_notifications j ON j.id=n.id JOIN public.contacts c ON c.id=j.contact_id WHERE n.state='sent' AND $4::text IS NOT NULL ON CONFLICT (email_message_id) WHERE email_message_id IS NOT NULL DO NOTHING RETURNING id;`,"={{ [$('Preparar avisos de correo y Telegram').item.json.id, $('Preparar avisos de correo y Telegram').item.json.claim_token, $json.error ? 'uncertain' : 'sent', $json.messageId || null, $json.error || null, $('Preparar avisos de correo y Telegram').item.json.request_id, $('Preparar avisos de correo y Telegram').item.json.text, $('Preparar avisos de correo y Telegram').item.json.subject] }}",[1200,100])
];
for (const n of workerNodes.filter(n=>n.type.endsWith('.emailSend') || n.type.endsWith('.telegram'))) n.onError='continueRegularOutput';
const workerConnections={};
workerNodes.slice(1,4).forEach((n,i)=>connect(workerConnections,workerNodes[i].name,n.name));
connect(workerConnections,'Preparar avisos de correo y Telegram','¿El aviso es Telegram?');
connect(workerConnections,'¿El aviso es Telegram?','Notificar por Telegram - Multisoluciones Web',0);connect(workerConnections,'¿El aviso es Telegram?','¿El aviso es para administración?',1);
connect(workerConnections,'¿El aviso es para administración?',adminName,0);connect(workerConnections,'¿El aviso es para administración?',replyName,1);
connect(workerConnections,adminName,'Registrar aviso enviado a administración');connect(workerConnections,replyName,'Registrar confirmación enviada y su identificador SMTP');
connect(workerConnections,'Notificar por Telegram - Multisoluciones Web','Registrar aviso Telegram entregado');
const worker={id:'MWAvisosCorreo20261004',name:'Multisoluciones Web - Entregar avisos de correo',active:false,nodes:workerNodes,connections:workerConnections,settings:{executionOrder:'v1',executionTimeout:120},pinData:{},staticData:null};
delete receiver.id;
delete worker.id;
writeFileSync(`${outputDirectory}/receiver.json`,JSON.stringify(receiver,null,2));
writeFileSync(`${outputDirectory}/worker.json`,JSON.stringify(worker,null,2));
// Preserve the existing flow and its published brand template, adding SMTP
// history so incoming replies can be related to the right request.
const registrationName='Registrar acuse enviado al cliente y su identificador SMTP';
const registration=db(registrationName,sql('register_outbound_email'),"={{ [$('Buscar Clientes existentes').item.json.contact_id, $('Buscar Clientes existentes').item.json.request_id, $json.messageId || null, $('Determinar idioma de respuesta').item.json.idioma_respuesta === 'es' ? 'Recibimos tu mensaje | Multisoluciones Web' : 'We received your message | Multisoluciones Web', 'Acuse automático de recepción enviado al cliente'] }}",[900,128]);
current.nodes.push(registration);
current.connections['Enviar acuse de recibo al cliente']={main:[[{node:registrationName,type:'main',index:0}]]};
connect(current.connections,registrationName,'Responder al formulario de contacto web');
const webQuery=current.nodes.find(n=>n.name==='Buscar Clientes existentes');
webQuery.parameters.query=webQuery.parameters.query
  .replace('(email_normalized,email_original,full_name,is_test) SELECT email_normalized,email_original,full_name,is_test FROM payload','(email_normalized,email_original,full_name,is_test,locale) SELECT email_normalized,email_original,full_name,is_test,locale FROM payload')
  .replace('full_name=EXCLUDED.full_name,last_contact_at','full_name=EXCLUDED.full_name,locale=EXCLUDED.locale,last_contact_at');
if (!webQuery.parameters.query.includes('telegram_notification AS')) {
  webQuery.parameters.query=webQuery.parameters.query.replace(
    'RETURNING id) SELECT contact.id AS contact_id',
    `RETURNING id), telegram_notification AS (INSERT INTO public.email_notifications(contact_id,request_id,message_id,kind,payload) SELECT new_request.contact_id,new_request.id,new_message.id,'telegram',jsonb_build_object('source','web_form','contact',jsonb_build_object('name',payload.full_name,'email',contact.email_normalized),'service',payload.service_key,'requestId',new_request.id,'messageId',new_message.id) FROM new_request CROSS JOIN new_message CROSS JOIN contact CROSS JOIN payload ON CONFLICT (message_id,kind) DO NOTHING RETURNING id) SELECT contact.id AS contact_id`
  );
}
// Import as a draft; publish only after validating the new DB schema.
current.name='Multisoluciones Web - Formulario y preferencias de contacto';
current.active=false;
delete current.id;
delete current.versionId;
delete current.activeVersionId;
delete current.shared;
writeFileSync(`${outputDirectory}/contact-with-history.json`,JSON.stringify(current,null,2));
console.log('Generated inactive receiver and notification worker; publication requires tested DB and credentials.');
