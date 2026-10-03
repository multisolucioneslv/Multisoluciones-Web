# Plan de implementación: Multisoluciones Web

**Base:** `docs/superpowers/specs/2026-10-02-multisoluciones-web-design.md` (aprobado por el usuario)

**Modo:** local; sin acceso ni despliegue a VPS; sin GitHub.
**Estado:** en ejecución.

## Salvaguardas iniciales

- `b3ab307` respalda el proyecto recuperado antes de esta renovación.
- `8fb256b` guarda el diseño aprobado.
- Crear commits locales al completar cada fase; revisar `git status` y el diff antes de cada commit.
- No revertir ni borrar trabajo previo. Los artefactos de brainstorming viven bajo `.superpowers/` e ignorados por Git.
- No configurar un remoto ni ejecutar `push`.

## Fases

### 1. Identidad compartida e internacionalización

- Cambiar el nombre visible de Jscothserver por Multisoluciones Web.
- Conservar locales, prefijos y selector; retirar Blog del encabezado y de los mensajes.
- Cambiar `/home` a redirección localizada a `/` sin prefijo `/en`.
- Introducir tokens Jade y menta coherentes en claro/oscuro, sin rediseñar Recursos.
- Añadir metadata base en las cuatro locales sin alterar slugs.
- Verificar paridad de claves y hacer un commit local.

### 2. Portada `/`

- Sustituir el contenido genérico por propuesta de valor, resumen de las tres ofertas, enfoque, proyectos seleccionados y contacto.
- Mantener servicios y proyectos sin imágenes ni capturas.
- Mostrar Aprendiendo a Programar como curso completo, no en desarrollo.
- Sustituir el formulario inactivo por un componente accesible con los mismos campos, nombres y orden: `name`, `email`, `service`, `message`.
- Añadir botones de llamada y WhatsApp sin imprimir el número.
- Verificar todos los cuatro mensajes, estados del formulario y diseño responsive/tema; hacer un commit local.

### 3. Servicios `/services`

- Presentar solo sitios web profesionales, comercio electrónico y sistemas web a medida.
- Eliminar menciones obsoletas de apps móviles, programación de controles y servicios no confirmados.
- Enlazar a contacto sin añadir rutas.
- Verificar slugs y traducciones; hacer un commit local.

### 4. Proyectos `/projects`

- Presentar Rescuvo como proyecto propio con solo hechos confirmados, enlace externo sujeto a verificación y sin assets VPS.
- Presentar Aprendiendo a Programar como curso/plataforma funcional; validar los hechos con la copia local y no mostrar link inaccesible.
- Omitir proyectos no autorizados y no crear páginas individuales.
- Verificar contenido y rutas; hacer un commit local.

### 5. Contacto seguro local

- Procesar el Server Action en el servidor y validar/sanitizar `FormData`.
- Modo `mock` por defecto en desarrollo para éxito, error y validación, sin llamadas externas.
- Preparar modo `n8n` únicamente mediante variables de entorno server-side para futura integración; sin valores reales, pruebas remotas ni correo saliente ahora.
- Incluir honeypot sencillo y límite de longitudes; dejar rate limiting de producción y protección del webhook como requisito de despliegue pendiente.
- Comprobar accesibilidad de etiquetas, foco y estados, y que el número solo está en enlaces `tel:`/WhatsApp.
- Hacer un commit local.

### 6. Validación final

- Ejecutar `npm run lint` y `npm run build`.
- Probar rutas en `en`, `es`, `ko` y `pt`; verificar redirección de `/home`, retirada de `/blog`, y ausencia de `/en` canónico.
- Verificar que `/resources`, `/resources/drivers` y `/resources/quelea` conservan contenido/rutas.
- Revisar formulario en modo simulado, enlaces de contacto, mobile, tema claro/oscuro, errores de consola y overflow horizontal.
- Autorrevisar todas las cadenas visibles, contraste de color y accesibilidad.
- Crear commit final local y comprobar árbol limpio y ausencia de remotos.

## Dependencias y condiciones de parada

- No se agrega ninguna dependencia sin justificación.
- No se integra ni prueba Mailcow/n8n real hasta que el usuario autorice explícitamente la fase de VPS.
- El estado de transmisión real debe aparecer como no configurado/error y nunca fingir entrega en modo `n8n` si faltan secretos o webhook.
- No inventar funcionalidades o resultados de Rescuvo.
- Si las traducciones `ko` o `pt` no pueden expresarse con confianza, conservar el sentido y señalar que requieren revisión nativa antes de publicar.
