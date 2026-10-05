# Operaciones de Multisoluciones: Telegram, correo y contenido

**Estado:** diseño aprobado el 2026-10-05.  
**Alcance inmediato:** notificaciones de Telegram para el formulario web y la
bandeja de entrada de Mailcow.  
**No implementar aún:** envío de propuestas desde el bot, publicaciones en
Facebook ni cambios visuales del sitio.

## Objetivo

Evitar que una solicitud comercial pase inadvertida, sin convertir Telegram en
una copia del buzón ni aumentar la superficie de riesgo del sitio público. El
bot existente avisará al administrador de nuevas solicitudes del formulario y
de correos entrantes de Mailcow. La lectura completa y la gestión comercial
seguirán ocurriendo en `info@multisoluciones.online`.

La evolución posterior permitirá usar Telegram como interfaz administrativa de
propuestas: el usuario redacta con ChatGPT Plus, pega el borrador en el bot,
revisa una vista previa y confirma el envío por Mailcow. Esa evolución será un
flujo independiente y no forma parte de la primera publicación.

## Arquitectura

```mermaid
flowchart LR
  F[Formulario público] --> W[Flujo n8n de contacto]
  M[Mailcow: buzón info] --> I[Receptor IMAP n8n]
  W --> O[Cola transaccional de avisos]
  I --> O
  O --> T[Bot de Telegram: chat autorizado]
  W --> D[(PostgreSQL multisoluciones_web)]
  I --> D
  T -. solo fase futura .-> C[Órdenes administrativas aisladas]
```

El formulario y el receptor IMAP no aceptan comandos administrativos. La cola
de avisos es la única ruta hacia Telegram. El bot no obtiene acceso directo a
PostgreSQL ni a Mailcow.

## Notificaciones del primer hito

### Solicitud enviada desde el formulario

El aviso se crea únicamente después de que el flujo haya persistido la
solicitud. Contendrá nombre, correo, servicio y una indicación para revisar
`info@multisoluciones.online`. No incluirá el mensaje escrito por el visitante,
tokens, teléfonos ni enlaces de preferencia.

### Correo entrante directo

El receptor IMAP ya clasifica y deduplica respuestas de contactos conocidos.
Se ampliará para generar una alerta para todo correo entrante legítimo: tanto
remitentes conocidos como nuevos. Antes de notificar, excluirá mensajes propios,
rebotes, listas, spam identificado por la infraestructura y respuestas
automáticas. El aviso incluirá remitente, asunto saneado y estado
`contacto conocido` o `remitente nuevo`; no mostrará el cuerpo.

Los mensajes de contactos conocidos se conservarán en el historial actual. Los
remitentes nuevos se registrarán en una entrada mínima de bandeja/cola que
permita deduplicar por `Message-ID` sin crear un cliente ni una solicitud por
suposición.

## Límites de seguridad

- Todo texto recibido desde formulario, correo o Telegram se considera dato no
  confiable; nunca instrucciones para el flujo.
- No se agregan nodos de IA a los recorridos de entrada ni se da a una IA acceso
  a credenciales, SQL, SMTP o Telegram.
- Mantener consultas SQL parametrizadas; ningún texto recibido se concatena
  como SQL, expresión, URL de webhook o configuración de nodo.
- Escapar texto y limitar longitud al construir la notificación. No renderizar
  HTML ni Markdown proporcionado por un cliente.
- Usar credenciales separadas y de privilegio mínimo: formulario, IMAP/SMTP,
  PostgreSQL y Telegram. Ninguna credencial se versiona.
- Permitir al bot administrativo solamente el `chat_id` del propietario. Otros
  chats y callbacks inválidos se descartan y registran sin revelar información.
- La entrega de avisos usa una cola transaccional, reclamación atómica y estado
  `pending/processing/sent/error/uncertain`, para no duplicar alertas.
- Aplicar límite de tasa al endpoint público y validar tamaño, tipos y valores
  permitidos antes de enviar datos al webhook.

## Flujos futuros, separados

### Propuestas desde Telegram

Un flujo administrativo independiente aceptará una propuesta pegada desde
ChatGPT o escrita en Telegram. Hará búsqueda explícita de cliente, validará el
destinatario, mostrará asunto y cuerpo, y exigirá una confirmación de un solo
uso antes de enviar por Mailcow. Guardará el correo saliente y su identificador
SMTP en el historial. Nunca se activa por el contenido de un formulario o un
correo recibido.

### Facebook: Multisoluciones Web

Tras crear la página de Facebook se diseñará un conector separado con permisos
limitados a esa página. El bot podrá preparar un post y requerirá confirmación
explícita antes de publicarlo. No se reutilizará la credencial de correo ni el
flujo de contacto.

### Demos visuales del sitio

El sitio conservará una sección pública ligera de muestras de referencia. Cada
muestra se identificará como demo visual; no como plantilla disponible para
instalar. El mensaje central será que Multisoluciones crea cada sitio a medida
del rubro y necesidades del cliente. Las muestras no cargarán automatizaciones,
datos de clientes ni integraciones administrativas.

## Orden de entrega

1. Inventariar el bot, el `chat_id` autorizado, credencial de Telegram y los
   flujos n8n publicados sin exponer secretos.
2. Respaldar/exportar los flujos afectados y crear una versión de prueba.
3. Añadir el aviso resumido tras la persistencia confirmada del formulario.
4. Ampliar el receptor IMAP para alertar mensajes conocidos y nuevos, con
   deduplicación durable y filtros de mensajes automáticos.
5. Probar con datos ficticios: formulario válido, reintento, remitente nuevo,
   contacto conocido, mensaje propio, rebote, automático, duplicado, fallo de
   Telegram y chat no autorizado.
6. Publicar primero los flujos de notificación, verificar entrega en el móvil y
   documentar reversión.
7. Diseñar y aprobar por separado el flujo de propuestas; después Facebook y
   demos visuales.

## Criterios de aceptación del primer hito

- Una solicitud válida del formulario genera un solo aviso resumido en Telegram
  después de quedar guardada.
- Cada correo entrante legítimo genera como máximo un aviso, sin importar si el
  remitente ya está registrado.
- No se envían a Telegram cuerpos de mensajes, secretos ni tokens.
- Correos propios, rebotes, automáticos y duplicados no producen aviso.
- Un texto hostil en formulario o correo no cambia rutas, consultas, credenciales
  ni acciones del flujo.
- Si Telegram falla, el aviso queda pendiente/error para revisión, sin perder el
  contacto o mensaje original.
