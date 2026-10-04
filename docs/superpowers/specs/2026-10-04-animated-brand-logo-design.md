# Logo animado en la cabecera

Ubicación aprobada: junto al nombre Multisoluciones Web, conservando las rutas,
la navegación, los textos y la paleta actuales. Evolución puntual, no rediseño.

- `logoGif_a.mp4`: tema claro; `logoGif_b.mp4`: tema oscuro.
- Copias públicas con nombres descriptivos; conservar los tres originales.
- Reproducción silenciosa en bucle, inline, sin controles de reproductor.
- Variante automática según la clase `dark` existente.
- Imagen fija extraída del mismo vídeo cuando se solicita reducir movimiento.
- Caja reservada de 80 × 45 px en escritorio y 64 × 36 px en móvil.
- El nombre visible identifica el enlace; el vídeo es decorativo.
- Verificación: lint, build, reproducción, cambio de tema y navegación móvil.

Se conserva Tailwind y el sistema existente. Variación y densidad sin cambios;
movimiento limitado al logo, con alternativa estática accesible.

## Corrección aprobada: fondo realmente transparente

Los MP4 contienen el fondo dentro de sus fotogramas. A petición del usuario,
se sustituye su uso en la cabecera por un SVG nativo del símbolo `{MW}`.
Los colores proceden de los tokens existentes de cada tema y una luz recorre
los trazos durante tres segundos en bucle. Con movimiento reducido, se oculta
la luz y permanece el símbolo fijo. No se reproduce ni descarga el vídeo.
Los vídeos originales y sus copias se conservan como referencia.
