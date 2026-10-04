# Visuales de servicios, proceso, proyectos y recursos

Diseño aprobado por el usuario el 2026-10-04. Conservar Rescuvo y el curso.

## Alcance

- Mantener rutas, paleta menta/petróleo, temas y formulario existentes.
- Iconos Phosphor SSR para teléfono, WhatsApp y acceso a servicios; texto visible
  junto al icono y número únicamente en el enlace de acción.
- Tres tarjetas de servicio con imagen, descripción y dos beneficios: primera
  y segunda con proporciones diferentes; tercera horizontal en escritorio.
- Proceso con iconos de conversación, planificación y código, y texto breve.
- Proyectos con capturas auténticas: Rescuvo público y quiz del módulo 05 del
  curso local. Identificar el quiz como ejercicio, no como interfaz de plataforma.
- Reemplazar Controladores de PC por una tarjeta no interactiva con cohete y
  título inglés fijo «Coming soon». Eliminar el bloque inferior duplicado.
- Mantener la antigua URL de drivers como redirección al catálogo, sin contenido
  de la categoría retirada ni enlaces que la promocionen.
- Textos descriptivos y alternativos en es/en/pt/ko. Imágenes con proporción
  reservada, carga diferida y WebP optimizado.

## Assets y procedencia

`public/service-visuals/{web,commerce,systems}.webp`: generación integrada.
Prompts: fotografía editorial de sitio profesional en laptop/teléfono; tienda
en línea con cerámica y pedidos; sistema de gestión con calendario e inventario.
Paleta verde petróleo/menta, encuadre horizontal, sin marcas ni texto legible.
Son ilustraciones de servicios, no proyectos reales vendidos como portafolio.

`public/project-previews/rescuvo.webp`: captura de https://rescuvo.com/.
`public/project-previews/course.webp`: captura del ejercicio real
`AprendiendoProgramacion/05-proyecto-quiz/solucion/`, servido solo en localhost.

## Implementación y verificación

1. Generar y optimizar los tres visuales; obtener las dos capturas auténticas.
2. Crear tarjetas reutilizables y textos visuales para los cuatro idiomas.
3. Integrar iconos, proceso, tarjetas y nuevo catálogo.
4. Lint, compilación y comprobación visual; verificar carga de imágenes, enlaces,
   redirección, temas e idiomas. Registrar limitaciones de pruebas si las hay.
5. Compilar en preparación aislada en VPS, conservar variables de producción y
   copia recuperable anterior; cambiar el servicio solo después del build.
6. Verificar dominio y respaldar código/assets/documentación en GitHub.

## Resultado publicado

Lint y build de producción pasan. Las cinco imágenes optimizadas pesan entre
14 y 101 KiB cada una. Catálogo comprobado en navegador público en los cuatro
idiomas, con «Coming soon» fijo y sin enlaces de drivers. Tarjetas inspeccionadas
en claro/oscuro. La prueba de viewport de 375 px no se aplicó en el navegador
conectado: no se afirma una verificación móvil real a ese ancho; el diseño tiene
colapso explícito a una columna y se comprobó sin desbordamiento a 903 px.

Servicio publicado: `multisoluciones-web-v2.service`. Variables del formulario
conservadas y copia recuperable anterior en
`/opt/multisoluciones-web-v2-pre-visual-cards-20261004`.
