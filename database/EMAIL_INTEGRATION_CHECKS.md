# Incoming email database integration

Migration `002_multisoluciones_web_email_tracking.sql` was applied on 2026-10-04
to the dedicated `multisoluciones_web` database after migration 001. The existing web form still uses its same tables,
columns, constraints, and non-null request IDs. New email messages may have a null
request ID. No request `source` constraint is changed.

Use Postgres bound parameters for every query. `persist_incoming_email.sql`
expects one JSON string representing the classifier result (not the complete
n8n item). Expected keys are `action`, `reason`, `email`, `requestId`,
`correlation`, `preference`, `phone`, `saveMessage`, `notifyAdmin`, `sendReply`,
and `language`. The email envelope uses `fromEmail`, `messageId`, `inReplyTo`,
`references` (array of canonical message IDs), `subject`, and `body`.
Sender/text aliases `from` and `text` also work. Booleans must be JSON booleans.

Pass normalized SMTP IDs from the classifier to outbound registration too.
`find_known_email_contact.sql` supplies the contact and `outbound_messages`
for classifier correlation. A request is attached only when outgoing message
references match and the selected request belongs to the matched contact.
Two referenced requests leave request_id null. An explicit, unambiguous contact
preference may still update the contact and create an event with null request_id.
Ambiguity in the preference itself must be classified `clarify`, which does not
update the contact. The response language never overwrites the contact locale.
Locale is backfilled from the latest owned request only when the contacts.locale
column is first added; rerunning the migration preserves later contact locale
choices. The existing application role receives access to the new tables and
their sequences if that role exists.
Missing message IDs are ignored because durable deduplication requires an ID.

Delivery uses the transactional outbox:

1. Persist the incoming email, then read the returned notification IDs.
2. Claim each ID with `claim_email_notification.sql` and a unique execution token.
   Send only if the claim returned a row. SMTP must occur after this claim.
3. On confirmed SMTP success, register any outgoing **contact** email using
   `register_outbound_email.sql`, then mark the notification sent using
   `complete_email_notification.sql`. Administrator alerts do not become contact
   history or request-correlation evidence. A `telegram` outbox entry is queued
   only for an applied call/WhatsApp preference. Claim it with the same query and
   complete it after the Telegram API result (SMTP ID parameter is null).
4. Mark definite delivery failures `error`; mark an ambiguous outcome `uncertain`.
   A timeout or crash can leave `processing`. Never automatically retry these
   states: reconcile with SMTP logs first. This protects against duplicate sends
   while honestly exposing the unavoidable database/SMTP transaction gap.

Required staging integration cases (inside a transaction rolled back afterwards):

| Input / scenario | Expected database result |
| --- | --- |
| Unknown sender | ignored; no messages, events, or notifications |
| Same known email Message-ID twice | one message; second call duplicate; no additional effects |
| Two workers persist same ID | one saved result, one duplicate |
| Ordinary known message, no references | history with null request_id; admin outbox entry |
| References one registered outgoing request | request_id assigned to that owned request |
| References two registered requests | null request_id; explicit contact-wide preference may update |
| Foreign contact's request ID | null request_id; matched preference rejected |
| Explicit email/none preference | contact updated; one event; requested notifications |
| Explicit call/WhatsApp with `+15551234567` | preference and phone updated atomically |
| Applied call/WhatsApp | exactly one additional telegram outbox entry |
| Call/WhatsApp without valid international phone | history stored; preference unchanged; no confirmation |
| Clarification | history stored; preference unchanged; reply outbox entry |
| Two workers claim one notification | only one returned row |
| Reclaim processing/sent/error/uncertain | zero rows; no send |
| Complete with wrong claim token | zero rows |
| SMTP ID registered twice | one outgoing history entry |
| New/legacy web-form message | original insert still accepted |

Verify migration reapplication and rollback of a deliberately failed persistence
transaction as well. The SQL integration suite was executed against PostgreSQL
inside a transaction and rolled back; file-level tests alone do not verify SQL.

## Published and verified — 2026-10-04

- Public form: https://multisoluciones.online/es
- Form/preferences workflow: `GIocLWM9jy4nl4GU` (published).
- Incoming known-contact email workflow: `MWCorreoDirecto20261004` (published).
- Email notification delivery workflow: `MWAvisosCorreo20261004` (published;
  schedule every minute).
- Existing-contact public form submission delivered the internal alert and a
  Spanish acknowledgement to Gmail, respecting the stored email preference.
- A real Gmail reply selecting no follow-up was matched to request 19 through
  SMTP references, persisted as `none`, and automatically confirmed in Spanish.
- A new-contact public form submission delivered a Spanish welcome with four
  preference links to the authorised Gmail test alias.
- The public preference page saved WhatsApp with a fictional international
  telephone number, displayed success, and delivered the administrative email
  with the selected channel and number to `info@multisoluciones.online`.
- Database checks confirmed contact locale, saved preferences and sent states;
  Gmail and Mailcow were inspected for actual delivery, not just SMTP acceptance.
- Locale routing is `es -> es`; `en/pt/ko -> en`. The four mappings are covered
  by automated tests; live browser submissions above were in Spanish.
- SQL/tests cover duplicate Message-IDs, ownership of request references,
  unknown senders, preference validation and single-worker notification claims.
- Backup before migration: protected VPS directory
  `/opt/multisoluciones-web-backups/20261004-mail-integration/`.
- Telegram delivery is not implemented by this release. Its reserved outbox
  entries must not be described as delivered notifications.

The workflow builder consumes protected exports `contact.json` and
`old-imap.json`, containing credential references (not decrypted passwords).
Run `node automation/build-mail-workflows.mjs AUDIT_DIRECTORY OUTPUT_DIRECTORY`.
Preserve `MW_EMAIL_START_AT` when regenerating the receiver so its initial
mail cutoff does not silently move forward. Do not commit credentials, mailbox
exports, customer data or private audit files.

## Estado operativo actual — 2026-10-06

La sección del 2026-10-04 es el registro histórico de aquella publicación; sus
IDs y estado de Telegram no describen la instalación actual. En la carpeta
MultisolucionesWeb se conservaron seis flujos: `mrOly0udSli3SYQV` (formulario y
preferencias), `uWwgwhO4cuprATDl` (receptor/notificación de formulario),
`WodmxwY1V5B4EoFn` (entrega de avisos por correo y Telegram), además de los tres
flujos del usuario `QPZhVLldIeR7ADWB`, `WZz8uo8R8iQjrzJI` y
`GIocLWM9jy4nl4GU`. Se eliminaron, previa confirmación, los seis borradores de
prueba/respaldo creados durante la implementación: `GMxnWRZMpKVnDCZG`,
`t9lgvMCLcaT4FKNC`, `8R9pW9tNCHkvdNtJ`, `u9dn9VgNC65vBUH5`,
`MWCorreoDirecto20261004` y `MWAvisosCorreo20261004`.

Pruebas recientes: se verificó la entrega del aviso de formulario a Telegram;
el aviso y acuse de correo llegaron al buzón durante la prueba de producción;
la preferencia `none` se guardó correctamente y se limpió después el contacto
ficticio y sus registros relacionados. Antes de esa limpieza se creó el dump
protegido `/opt/multisoluciones-web-backups/20261006-after-test-before-cleanup.dump`.
Los contadores de contactos, solicitudes, mensajes, notificaciones y eventos de
preferencia quedaron en cero tras limpiar los datos ficticios.

El 2026-10-06 se publicó en el flujo `mrOly0udSli3SYQV` una plantilla HTML de
ancho 100%, colores menta y escape de contenido para los dos avisos internos
(nueva solicitud y preferencia guardada). El aviso de nueva solicitud conserva
también el formato de texto alternativo; el acuse al cliente ya tenía HTML y
texto. No se ejecutó una nueva prueba de envío tras esta última edición; debe
validarse con el siguiente envío ficticio controlado antes de considerar la
plantilla visual comprobada en la bandeja.

El flujo de correo entrante general y el filtrado de remitentes nuevos siguen
siendo una fase pendiente: la notificación de formulario y la entrega de la
cola de avisos están activas, pero no debe afirmarse que toda la bandeja IMAP
queda monitorizada hasta publicar y probar el receptor general y sus reglas.
