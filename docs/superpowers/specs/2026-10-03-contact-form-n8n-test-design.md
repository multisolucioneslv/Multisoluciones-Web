# Diseño: conexión temporal del formulario local con n8n

## Objetivo

Permitir una prueba real, solo desde el entorno local de desarrollo, del formulario de contacto de Multisoluciones Web con el flujo de prueba de n8n creado en la carpeta `MultisolucionesWeb`. La prueba verifica la entrega del aviso interno a `info@multisoluciones.online` mediante Mailcow y el acuse automático al correo enviado por quien completa el formulario.

## Límites y decisiones

- El navegador continúa enviando el formulario a la Server Action existente de Next.js. El navegador no recibe la URL de n8n ni realiza solicitudes directas a ese servicio.
- La Server Action conserva la validación existente y reenvía solo `name`, `email`, `service` y `message` al webhook configurado por una variable de entorno exclusiva del servidor.
- Se incorpora un modo local explícito, `CONTACT_MODE=n8n-test`, que solo se acepta cuando `NODE_ENV=development`. Requiere `CONTACT_WEBHOOK_URL` configurada localmente; no se guardará el endpoint en el repositorio.
- Sin `CONTACT_MODE=n8n-test`, el entorno local sigue en modo `mock` por defecto. En cualquier entorno que no sea desarrollo, el envío sigue deshabilitado y devuelve el estado `notConfigured`.
- La respuesta exitosa requiere una respuesta HTTP satisfactoria del webhook y un cuerpo JSON que indique `status: "received"`. Los errores o tiempos de espera se convierten en el estado `failure`; no se registran valores del formulario ni respuestas que puedan contener datos personales.
- No se reintentan envíos automáticamente, para no duplicar avisos ni acuses.
- La URL temporal del webhook no tiene autenticación y solo escucha durante una prueba manual en n8n. Por tanto, se usará únicamente con información ficticia y durante la escucha. Este mecanismo no constituye la integración de producción.

## Alternativas consideradas

1. Mantener únicamente el modo simulado: seguro y útil para interfaz, pero no comprueba la entrega real de correos.
2. Enviar desde el navegador directamente al webhook: descartado porque expondría el endpoint y acoplaría el cliente a n8n.
3. Reenviar desde la Server Action local a una URL temporal de prueba, con modo explícito y endpoint solo del lado del servidor: seleccionado por permitir la prueba solicitada sin alterar el comportamiento predeterminado ni producción.

## Manejo y minimización de datos

- Se envían únicamente los cuatro campos que el visitante ya entrega en el formulario.
- El endpoint se configura en un archivo local ignorado por Git o en el entorno del proceso; nunca se usa un prefijo `NEXT_PUBLIC_`.
- La petición tiene un tiempo máximo finito y no se hacen reintentos.
- No se agregan base de datos, registros de solicitudes, IA, CAPTCHA, rate limiting ni cambios a otros flujos de n8n.
- La interfaz muestra éxito solo después de la aceptación del flujo; si el webhook no está escuchando o falla, muestra el mensaje genérico de error ya traducido.

## Verificación

- `npm run lint` y `npm run build` deben pasar.
- El modo `mock` mantiene su comportamiento actual y no hace llamadas de red.
- El modo de prueba se rechaza en producción y falla con estado genérico si falta el endpoint.
- Con n8n escuchando, una solicitud ficticia completada desde el formulario local debe ejecutar ambos nodos de correo y el nodo de respuesta, y el formulario debe reflejar el resultado.
- El endpoint no debe aparecer en el JavaScript del cliente ni en la interfaz.
- Después de la prueba, el flujo permanece como borrador y no se publica ni activa.

## Fuera de alcance

Despliegue, activación del flujo, reemplazo del webhook temporal por uno permanente/autenticado, SSL, cambios del VPS o Nginx, integración de producción, base de datos, blog y comentarios.
