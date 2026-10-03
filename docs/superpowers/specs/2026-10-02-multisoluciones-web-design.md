# Multisoluciones Web: renovación visual y contenido

**Fecha:** 2026-10-02

**Estado:** Diseño aprobado por el usuario; requiere revisión del documento antes de planificar la implementación.

**Proyecto:** `C:\ProgramandoconClaude\Proyectos\enProceso\jscothserver`
**Ejecución:** local únicamente. No modificar, consultar ni desplegar en ningún VPS durante esta fase.

## Lectura de diseño

Rediseño de un sitio de servicios web para emprendedores y pequeñas empresas, con lenguaje editorial claro, profesional y cercano. Se adopta la dirección visual **Jade y menta** de la comparación aprobada, apoyada por la estructura existente en Next.js 16, React 19, Tailwind CSS 4 y `next-intl`.

**Diales:** variación 6/10 (asimetría editorial moderada), movimiento 3/10 (transiciones discretas y respetuosas de `prefers-reduced-motion`), densidad 3/10 (contenido aireado y fácil de escanear).

## Objetivo

Transformar la página inicial genérica de Jscothserver en la presencia de marca de **Multisoluciones Web** y reemplazar el contenido provisional de Servicios y Proyectos por información clara, precisa y útil para clientes potenciales. El visitante debe entender pronto qué soluciones se ofrecen, por qué considerarlas y cómo contactar.

## Alcance

- Actualizar la portada en `/`.
- Completar el contenido de `/services` con solo tres servicios confirmados: sitios web profesionales, tiendas en línea y sistemas web a medida.
- Completar `/projects` con estudios descriptivos de Rescuvo y Aprendiendo a Programar.
- Actualizar encabezado, identidad textual y tokens visuales compartidos que necesiten esas páginas.
- Quitar Blog del encabezado y retirar su página provisional `/blog`.
- Conservar sin cambios de slug las demás rutas existentes:
  - `/`
  - `/home` como alias que redirige al inicio del mismo idioma.
  - `/services`
  - `/projects`
  - `/resources`
  - `/resources/drivers`
  - `/resources/quelea`
- Conservar el soporte actual de `en`, `es`, `ko` y `pt`; inglés es el idioma predeterminado y no lleva prefijo (`/`, nunca `/en`). Los demás idiomas conservan sus prefijos actuales.
- Conservar el selector de idioma, el cambio claro/oscuro y la navegación responsive.
- Mantener los mensajes de interfaz en los cuatro archivos JSON con el mismo conjunto de claves por idioma. Las traducciones `ko` y `pt` continúan siendo borradores pendientes de revisión nativa y el trabajo local no autoriza publicarlas.

## Fuera de alcance

- Cualquier conexión, lectura, cambio o despliegue en los VPS de Hostinger.
- Integración de producción con Mailcow o n8n, entrega real de correo y alta de secretos/credenciales.
- Cambios de contenido, slugs o comportamiento en `/resources` y sus subrutas.
- RemoteAutoService, servicios de programación de controles automotrices, proyectos privados, casos/clientes no autorizados o afirmaciones de clientes, métricas o resultados no verificados.
- Imágenes y capturas de proyectos por ahora; tampoco se usarán bloques grises que finjan capturas. La presentación será tipográfica hasta que el usuario apruebe assets locales.
- Nuevas rutas públicas, CMS, blog, comentarios o formularios adicionales.

## Rutas e idioma

El grupo internacionalizado `src/app/[locale]` conserva su patrón y las rutas de recursos. El enlace Inicio continúa apuntando al índice `/`. La página `/home` deja de ser contenido duplicado y redirige al índice del mismo idioma; para inglés la URL destino no lleva `/en` y para `es`, `ko` y `pt` mantiene su prefijo. Se retirará solo la ruta Blog, que ahora es una página placeholder y no contiene artículos.

No se renombrarán slugs existentes ni se crearán páginas de detalle individuales para proyectos. Los detalles de proyectos vivirán en `/projects` (se permiten anclas dentro de esa página si resultan necesarias, no rutas nuevas).

## Identidad visual y estructura de la portada

### Paleta propuesta

Tema claro:

| Uso | Color |
|---|---|
| Tinta y texto principal | `#10232A` |
| Jade de marca y acciones | `#08766F` |
| Fondo menta de portada | `#EAFBF6` |
| Fondo general | `#FBFDFB` |
| Superficie secundaria | `#F2F8F6` |
| Bordes | `#D7E5E1` |
| Texto secundario | `#4B6266` |

El tema oscuro existente se conserva mediante equivalentes legibles de los mismos tokens; no se alternarán fondos claros y oscuros entre secciones dentro de un mismo tema. En el tema claro, jade y tinta deben superar contraste WCAG AA para texto normal cuando se usen como pares de primer plano/fondo.

### Orden de la portada

1. Encabezado con marca Multisoluciones Web, Inicio, Servicios, Recursos y Proyectos, selector de idioma y tema. Blog desaparece.
2. Portada con propuesta principal, explicación concisa, llamada por botón y acceso a Servicios.
3. Vista resumida de los tres servicios.
4. Explicación breve del enfoque/diferenciadores, sin garantías, cifras, testimonios ni certificaciones inventadas.
5. Selección de dos proyectos reales, enlazando a los detalles en `/projects`.
6. Bloque final de contacto con tres vías: llamar, WhatsApp o formulario.

La dirección aprobada usa composición editorial ligeramente asimétrica, buen espacio en blanco, jerarquía tipográfica fuerte y filas claras para servicios. No usará la antigua cuadrícula de tarjetas genéricas como patrón dominante ni una portada completamente oscura.

## Servicios

`/services` explica exactamente las tres ofertas acordadas:

1. Sitios web profesionales: presencia clara y adecuada al negocio.
2. Tiendas en línea: presentación de productos y organización del proceso de compra/pedidos.
3. Sistemas web a medida: herramientas alineadas con procesos reales.

Se eliminarán afirmaciones obsoletas de aplicaciones móviles, programación de controles de vehículos, “servicios físicos” y asesorías no confirmadas. No se publicarán precios ni promesas de plazos/resultados que el usuario no haya confirmado.

## Proyectos

`/projects` dejará de ser una página placeholder y presentará los dos proyectos con contexto, objetivo, trabajo realizado y estado, usando únicamente datos verificables. No se insinuará que estos son todos los proyectos del usuario ni se explicará al visitante la existencia de trabajo confidencial.

### Rescuvo

- El usuario confirma que es 100% suyo.
- Puede mostrarse el nombre y el dominio `rescuvo.com`.
- No se inferirá propiedad del código, tecnologías, resultados de negocio ni funciones específicas solo a partir de la propiedad del proyecto. Esos detalles se verificarán con el usuario o con material local antes de redactarlos como hechos.
- No obtener imágenes desde el VPS; no se añaden capturas en esta fase.

### Aprendiendo a Programar

- Se presentará como curso/plataforma educativa funcional y como proyecto propio, no como proyecto en desarrollo.
- La copia local confirma que el contenido del curso está completo: 12 módulos y 38 lecciones, con ejercicios, evaluaciones y rúbricas; el checkpoint local dice que quedó listo para impartirse.
- No se mostrará un enlace de acceso mientras no se confirme una URL alcanzable. No se comunicará públicamente la indisponibilidad temporal del VPS.
- No se afirmará que existe seguimiento automatizado de alumnos u otras funciones que el extracto local no verifica.

## Contacto y envío de formulario

El bloque de contacto ofrecerá alternativas inequívocas:

- **Llamar:** enlace `tel:+17023379581`. El número no aparecerá en el texto visible; el control accesible se llamará “Llamar” o su traducción.
- **WhatsApp:** botón a `https://wa.me/17023379581` con el mensaje prellenado acordado anteriormente: “Hola, me interesa crear o mejorar mi sitio web. Me gustaría recibir más información.” El botón muestra solo la acción, no el número.
- **Formulario:** opción para enviar nombre, correo, servicio de interés y mensaje. Se validarán campos y errores y se mostrará confirmación solo al aceptar la solicitud.

### Arquitectura prevista

- El formulario se procesa desde el servidor Next.js, preferentemente mediante Server Action si la documentación local de Next.js 16 confirma el patrón adecuado; el navegador nunca llama directamente a n8n ni recibe su URL secreta o credenciales.
- En desarrollo local la entrega usa `mock` por defecto: permite probar validación, estados de carga, éxito y fallo sin mandar correos ni contactar sistemas externos.
- En producción, tras una autorización y fase separadas, el servidor podrá enviar los datos a un webhook autenticado de n8n. n8n coordinaría: notificación de la solicitud a `info@multisoluciones.online` mediante Mailcow y respuesta automática al correo del visitante.
- El modo y secretos serán configuración exclusivamente de servidor. Ninguna clave se expondrá mediante variables `NEXT_PUBLIC_*`.
- Ningún secreto, host privado, endpoint real, correo de prueba o solicitud se configurará o ejecutará en esta fase. El envío real queda expresamente fuera de alcance hasta autorización posterior para la integración/despliegue.
- Validar y limitar datos en el servidor, reducir datos recolectados a lo necesario y no incluir el contenido personal en logs de aplicación. La copia de consentimiento contextual será breve y no prometerá políticas de retención aún no definidas.

## Contenido y traducciones

Los textos de portada, Servicios, Proyectos, contacto, validación y estados del formulario vivirán en `messages/{en,es,ko,pt}.json`. Se conservará paridad estructural de claves y uso correcto de ICU cuando aplique. El contenido puede quedar en los cuatro idiomas para pruebas locales; la publicación de coreano y portugués requiere revisión nativa, conforme al checkpoint.

Todo el texto en inglés, coreano y portugués debe comunicar los mismos hechos y estados que el español. Ninguna traducción puede afirmar que Aprendiendo a Programar está “en desarrollo” o que RemoteAutoService está disponible.

## Dependencias visuales y técnicas

- Mantener Tailwind CSS 4 y los componentes presentes; no añadir bibliotecas de interfaz o animación por esta renovación.
- Mantener el App Router y `next-intl` existentes; páginas estáticas siguen siendo Server Components salvo que una interacción cliente lo exija.
- Revisar la guía de Next.js 16 instalada localmente antes de cambiar APIs/rutas/componentes, según `AGENTS.md`.
- No copiar o sustituir assets de marca o recursos desde servidores remotos.

## Verificación

Antes del cierre local:

- `npm run lint` y `npm run build` pasan.
- Probar directamente: `/`, `/home`, `/services`, `/projects`, `/resources`, `/resources/drivers` y `/resources/quelea`.
- Probar `en` en raíz/sin `/en`, además de prefijos `/es`, `/ko`, `/pt`; verificar redirección localizada de `/home` y que Blog ya no se publica.
- Confirmar que `/resources` y sus dos subrutas conservan sus destinos, idioma y contenido.
- Verificar el selector de idiomas, conservación de ruta, modo claro/oscuro, encabezado móvil/escritorio y ausencia de overflow horizontal.
- Verificar las tres salidas de contacto. `tel:` y WhatsApp deben ocultar el número en su etiqueta visible y apuntar al destino previsto.
- Probar el formulario local en modo simulado: inválido, procesando, éxito y fallo; comprobar que no genera solicitudes de correo o a n8n.
- Comprobar paridad de claves JSON y mensajes ICU en los cuatro idiomas.
- Inspeccionar el diff y crear commits locales pequeños por hito. No agregar remotos ni ejecutar `push`.

## Revisión del documento

Antes de redactar un plan de implementación, el usuario revisará este documento. Los hechos aún no verificados para el texto detallado de Rescuvo no se completarán por inferencia.
