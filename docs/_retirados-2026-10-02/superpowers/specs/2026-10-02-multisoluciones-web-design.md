# Multisoluciones Web — diseño de la primera versión

**Fecha:** 2026-10-02  
**Estado:** aprobado para planificación

## Propósito

Convertir `multisoluciones.online` en la presencia pública de **Multisoluciones Web**, dirigida a emprendedores y pequeñas empresas que necesitan sitios web, tiendas en línea o sistemas web a medida.

El proyecto técnico existente `jscothserver` será la base Next.js. Su nombre no será una identidad pública; el nombre visible será Multisoluciones Web. Juan Torres se presentará solo donde corresponda como contacto o fundador.

## Alcance de la primera versión

- Página pública clara, móvil y bilingüe solo si el contenido está revisado para cada idioma publicado.
- Servicios: sitios web profesionales, tiendas en línea y sistemas web a medida.
- Proyectos destacados, como selección representativa y no listado completo.
- Sección de colaboración profesional para Yapame, atribuida con precisión a programación y seguridad de sistemas.
- Proyecto propio y línea de capacitación: Aprendiendo Programación.
- Apoyo a iglesias: asesoría gratuita; donaciones opcionales y nunca una oferta comercial mezclada con los servicios de empresa.
- Centro de contacto directo: llamada, WhatsApp y `info@multisoluciones.online`.
- Nota discreta: existen soluciones internas y privadas no mostrables por confidencialidad y seguridad.

## Fuera de alcance

- Formulario de contacto y envío SMTP desde el sitio.
- Telegram en la primera versión.
- Blog, CMS, comentarios o interacción de visitantes. Se construirán después como proyecto separado.
- Publicar sistemas privados, nombres de clientes no autorizados, o capturas que revelen información confidencial.
- Convertir seguridad informática o soporte en servicio comercial inicial.
- Cambiar SistemaSaaS, su API, n8n o rutas de tenants.

## Estructura pública

1. **Encabezado:** Inicio, Servicios, Proyectos y Contacto.
2. **Portada:** propuesta directa para emprendedores y pequeñas empresas; CTA principal a WhatsApp.
3. **Servicios:** tres tarjetas de servicios principales.
4. **Proyectos destacados:** tarjetas con enlace, imagen aprobada y descripción exacta de la contribución.
5. **Confidencialidad:** nota breve sobre trabajo privado no exhibible.
6. **Educación y apoyo:** Aprendiendo Programación y asesoría gratuita para iglesias, claramente separados de los servicios comerciales.
7. **Contacto:** `tel:`, enlace de WhatsApp con mensaje preescrito y `mailto:info@multisoluciones.online`.

### Mensaje inicial de WhatsApp

> Hola, me interesa crear o mejorar mi sitio web. Me gustaría recibir más información.

## Proyectos candidatos

- Rescuvo: proyecto público alojado en infraestructura propia; describir solo el trabajo que se pueda atribuir con certeza.
- Yuli Import y Sistema Yuli: casos públicos sujetos a confirmación de autorización para nombre, enlace y capturas.
- Equimport y Sistema Equimport: casos públicos sujetos a confirmación de autorización; no anunciar un sistema como activo hasta comprobar que responda.
- Yapame: **colaboración profesional**, no sitio atribuido como desarrollo propio. La atribución pública es programación y seguridad de sistemas.
- Aprendiendo Programación: proyecto propio y capacitación.

## Despliegue

- VPS Multisoluciones alojará solo aplicaciones web, APIs y automatizaciones existentes.
- `multisoluciones.online` recibirá una aplicación Next.js aislada, con reinicio automático.
- Nginx conservará HTTPS y dirigirá solamente ese dominio a la aplicación nueva.
- `sistemasass.online`, API, tenants y n8n no se modificarán.
- El antiguo contenido de Multisoluciones y SistemaSaaS se conserva en un respaldo local y otro remoto, ambos con hash SHA-256 verificado, antes de cualquier cambio de producción.
- La Fonda se respaldará y se deshabilitará en una fase posterior; no se eliminarán archivos ni datos.

## Verificación y reversión

- `npm run lint` y `npm run build` deben pasar antes de cualquier despliegue.
- Probar navegación, diseño móvil, enlaces externos, enlaces de contacto, HTTPS y cabeceras de seguridad.
- Confirmar que `sistemasass.online`, API, tenants y n8n siguen operativos.
- Si el sitio nuevo falla, restaurar el build y la configuración desde el respaldo previo.

## Decisiones pendientes antes de publicar

- Confirmar autorización para publicar Yuli Import, Sistema Yuli, Equimport y sus capturas/enlaces.
- Elegir imágenes aprobadas para cada tarjeta de proyecto; los sistemas solo locales se omiten hasta tener imágenes seguras.
- Decidir qué idiomas distintos de español se revisarán y publicarán en esta identidad comercial.
