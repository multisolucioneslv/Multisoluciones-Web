# Logo transparente publicado

Publicado el 2026-10-04 en `https://multisoluciones.online/es`.

- Componente: `src/components/brand-logo.tsx`, SVG inline sin fondo.
- Conserva el símbolo `{MW}` y un trazo luminoso animado mediante CSS.
- Los colores usan las variables de marca del tema claro y oscuro.
- La preferencia de movimiento reducido desactiva la animación.
- Verificación pública: ambos temas inspeccionados visualmente; SVG presente,
  vídeo ausente, fondo `rgba(0, 0, 0, 0)` y animación `brand-logo-light` activa.
- La compilación de preparación terminó correctamente; servicio publicado
  `multisoluciones-web-v2.service` activo y ruta `/es` devuelve HTTP 200.
- Se conservaron las variables de producción del formulario.
- Copia recuperable anterior en el VPS:
  `/opt/multisoluciones-web-v2-pre-transparent-20261004`.
- Los MP4 originales se conservan localmente, sin sobrescribirlos.

Esta versión recrea el monograma en vector; no convierte los MP4 a un formato
con canal alfa ni pretende conservar exactamente todos sus fotogramas.

## Corrección de visibilidad del movimiento

El 2026-10-04 se sustituyó el trazo apenas perceptible por dos corredores
luminosos, sobre las letras y las llaves, con punto y estela. Ciclo de 2.4 segundos,
verde intenso en claro y blanco menta en oscuro. Se verificó en el dominio que
`stroke-dashoffset` cambia entre observaciones (47.9208 a 5.5625 en las llaves),
no únicamente que exista una declaración CSS. Lint y build de producción pasan.
Copia previa: `/opt/multisoluciones-web-v2-pre-motion-20261004`.
