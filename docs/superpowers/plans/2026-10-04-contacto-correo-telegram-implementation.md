# Implementación del diseño aprobado de contacto

Especificación: ../specs/2026-10-04-contacto-correo-telegram-design.md.

1. GitHub: autenticar clave exclusiva; verificar repositorio privado y revisar historial antes del primer push. No subir entornos, claves, datos de clientes ni exportaciones con secretos.
2. Respaldar flujo actual y base dedicada; comprobar que los flujos antiguos están inactivos.
3. Versionar lógica de acuse y probar matriz de cuatro locales, nuevo/recurrente y cinco preferencias. Aplicar al borrador n8n y verificar los resultados antes de publicarlo.
4. Añadir validación en webhook, deduplicación de entregas y registro de mensajes salientes/consentimiento mediante migración aditiva. Probar transacciones y reintentos sin enviar correos duplicados.
5. Crear receptor IMAP independiente e inactivo. Filtrar propios/automáticos/rebotes, deduplicar Message-ID, buscar contacto y correlacionar respuestas inequívocas. No interpretar números aislados como consentimiento.
6. Verificar credencial del bot y destinatario. Notificar autorizaciones válidas de llamada/WhatsApp y guardar estado para reintentos.
7. Pruebas integrales con datos ficticios, revisión de código y configuración, publicación y documentación de reversión.

Cada etapa registra evidencia y estado real; los archivos locales por sí solos no equivalen a publicación. Si la autenticación de GitHub está pendiente, continuar desarrollo y commits locales.
