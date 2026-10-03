# Plan de implementación: Multisoluciones Web

> Basado en la especificación aprobada `2026-10-02-multisoluciones-web-design.md`.

## Objetivo

Convertir el proyecto local en el sitio público de **Multisoluciones Web** para
emprendedores y pequeñas empresas, conservando el despliegue actual hasta que
el reemplazo haya pasado todas las verificaciones.

## Límites de seguridad

- No tocar `sistemasass.online`, `api.sistemasass.online`,
  `tenants.sistemasass.online`, n8n ni sus contenedores.
- No eliminar el respaldo `multisoluciones-before-rebuild-20261002-115809.tar.gz`.
- No borrar `lafondadedonjulio.com`; se deshabilitará solo tras comprobar el
  nuevo sitio en producción.
- No publicar proyectos privados ni capturas, marcas o nombres de clientes sin
  la autorización correspondiente.

## Etapa 1: auditoría local y base de contenido

1. Inventariar rutas, componentes, idiomas, dependencias y comandos de calidad
   del proyecto `jscothserver`.
2. Identificar las rutas que se reutilizan y las que deben ocultarse: blog,
   páginas comerciales ajenas al enfoque y contenido de iglesia fuera de su
   sección de apoyo.
3. Centralizar los textos públicos en español: marca, servicios, contacto,
   transparencia de portafolio y apoyo gratuito a iglesias.
4. Definir una lista de proyectos como "selección" y dejar fuera los candidatos
   que aún requieren aprobación de publicación.

## Etapa 2: interfaz

1. Adaptar el encabezado a Inicio, Servicios, Proyectos y Contacto.
2. Crear un hero conciso con llamada a WhatsApp.
3. Presentar tres servicios: sitios profesionales, comercio electrónico y
   sistemas web a medida.
4. Construir la sección de proyectos seleccionados y el aviso de
   confidencialidad.
5. Incorporar la plataforma de formación `AprendiendoProgramacion` como
   iniciativa propia de formación, sin convertirla todavía en línea comercial.
6. Incluir una sección sobria de apoyo gratuito a iglesias, independiente de la
   oferta comercial y sin exigir donaciones.
7. Añadir un hub de contacto con enlaces de teléfono, WhatsApp y correo, sin
   formulario ni Telegram.
8. Ocultar completamente blog, comentarios y publicaciones hasta que exista su
   sistema de administración y moderación.

## Etapa 3: validación local

1. Ejecutar las verificaciones de tipo, lint y build provistas por el proyecto.
2. Revisar el comportamiento en móvil y escritorio.
3. Comprobar enlaces `tel:`, WhatsApp y `mailto:` y su texto inicial.
4. Verificar etiquetas SEO básicas, favicon, título y ausencia de textos de
   plantilla o enlaces rotos.
5. Obtener la decisión expresa sobre cada nombre, URL y captura que se vaya a
   publicar en el portafolio.

## Etapa 4: despliegue aislado

1. Preparar el servicio Next.js en un directorio y puerto propios del VPS de
   Multisoluciones.
2. Configurar Nginx para que solo `multisoluciones.online` apunte al nuevo
   servicio; conservar una copia fechada de la configuración actual.
3. Verificar HTTPS, respuesta pública, registro de errores y enlaces de
   contacto.
4. Deshabilitar el sitio de La Fonda únicamente cuando se confirme que ya no se
   necesita, conservando intactos sus archivos y configuración recuperable.
5. Documentar servicio, rutas, comando de actualización y procedimiento de
   reversión.

## Criterio de salida

El sitio responde por HTTPS en `multisoluciones.online`, no modifica los demás
servicios del VPS, conserva el respaldo anterior, y muestra únicamente
atribuciones y proyectos autorizados.
