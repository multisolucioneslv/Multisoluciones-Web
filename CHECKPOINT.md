# Checkpoint - Proyecto: jscothserver

**Fecha de inicio:** 2026-09-30
**Tecnología principal:** Next.js (App Router), TypeScript, Tailwind CSS

## En qué nos quedamos
El sitio funciona en **cuatro idiomas**: inglés (predeterminado), español, coreano y portugués. `lint` y `build` pasan, y Playwright ejecutó 30 verificaciones sobre las banderas sin un solo fallo (88 en la batería completa de los cuatro idiomas). El selector de idioma muestra **banderas en SVG** (en = Estados Unidos, es = México, ko = Corea del Sur, pt = Brasil); la de **Corea del Sur se reconstruyó** porque la anterior tenía arcos inválidos, ningún trigrama y la S descentrada, y ahora sigue la norma oficial. Todo el texto visible vive en `messages/{en,es,ko,pt}.json` (10 namespaces, 126 claves idénticas en los cuatro archivos); las páginas ya no contienen copy hardcodeado, solo datos (URLs, tamaños, nombres propios de Biblias). El inglés va **sin prefijo** (`/resources`) y los demás idiomas con prefijo (`/es/...`, `/ko/...`, `/pt/...`); `/en/...` redirige a la versión inglesa. Hay **detección automática por el navegador** y además un **selector de idioma** en el header (escritorio y móvil) que conserva la ruta actual al cambiar. Los conteos de canciones y Biblias usan ICU con plurales y **formato numérico por locale** (en/coreano `2,570`; es/pt `2570` en 4 dígitos y `72.098` en 5, según el estándar CLDR de cada idioma). Los manuales oficiales de Quelea solo se muestran en inglés y español: en coreano y portugués se ocultan porque no existe versión oficial en esos idiomas. `/resources` es el índice de categorías y `/resources/quelea` reúne descargas oficiales, catálogos Zefania por idioma, bases de canciones y guías. Se retiraron todas las descargas locales de Biblias y canciones hasta verificar su licencia de redistribución y compatibilidad. Las traducciones de coreano y portugués ya pasaron una **revisión de contenido** (doble sentido, palabras ofensivas o de jerga, uniformidad de tono), pero siguen siendo **borrador pendientes de revisión nativa**; no se ha publicado nada.

## Última revisión técnica
- 2026-10-01: **rediseño de la bandera de Corea del Sur por defectos reales de dibujo.** El usuario|reportó que se veía mal y la investigación confirmó tres errores objetivos en el SVG anterior de `SouthKorea`:
  1. **Los arcos del taegeuk eran inválidos.** Los `path` usaban `A2 2` entre puntos separados 8 unidades (por ejemplo `M8 8 A2 2 0 0 1 16 8`). SVG escala el radio cuando la cuerda excede el diámetro, así que ambos arcos se convertían en un círculo de radio 4 y los dos `path` pintaban el disco entero: **el azul tapaba al rojo y el resultado era un círculo azul liso, sin taegeuk**.
  2. **Faltaban los cuatro trigramas** (괘). El diseño anterior solo tenía el círculo y los dos puntos.
  3. **La curva en S no estaba alineada con la diagonal** y los puntos pequeños estaban mal distribuídos y coloreados.

  Se reconstruyó siguiendo la norma oficial coreana (`https://www.mois.go.kr/eng/sub/a03/nationalSymbol/screen.do`):
  - `viewBox="0 0 24 16"`, taegeuk de centro `(12, 8)` y radio `4`.
  - El grupo completo se rota `33.6900675°` alrededor de `(12, 8)` (el ángulo de la diagonal de la bandera), lo que produce la S correcta.
  - Rojo `#CD2E3A`, azul `#0047A0`, trigramas en negro `#000000`.
  - Puntos: azul en `(12, 6)` y rojo en `(12, 10)` dentro del grupo rotado (radio `1`, un cuarto del diámetro del taegeuk). **Importante:** van en vertical, no desplazados en horizontal; con offset horizontal el punto azul caía dentro de la zona azul y quedaba invisible.
  - **Trigramas en su posición y patrón oficiales:** superior izquierdo **Geon ☰** (tres barras sólidas), superior derecho **Gon ☷** (tres partidas), inferior izquierdo **Gam ☵** (partida-sólida-partida), inferior derecho **Ri ☲** (sólida-partida-sólida). Rotación `∓56.3099325°` según la esquina. Cada trigrama mide 4 de largo por `8/3` de ancho, con barras de `2/3` y separaciones de `1/3`: **18 barras en total** (3 + 6 + 5 + 4), todas en negro.
  - Durante la verificación se detectaron y corrigieron dos errores propios: el **segundo arco del `path` azul** quedaba en `sweep=1` y no trazaba la S complementaria, y los **patrones de los trigramas estaban intercambiados** (Gam/Ri invertidos). Ambos se confirmaron leyendo el DOM renderizado, no a ojo.
  - Verificación: `npm run lint` y `npm run build` correctos; Playwright **30 verificaciones, 0 fallos**, incluyendo que el SVG real se rasteriza con la S y los puntos correctos, los 4 grupos de trigramas con 18 barras negras, los colores oficiales de las cuatro banderas leídos del canvas, `aria-hidden`, visibilidad y esquinas redondeadas en tema claro y oscuro, conservación de ruta al cambiar de idioma y cierre con `Escape`.
  - El tamaño sigue en `h-4 w-6` (24×16 px). A `h-6 w-9` las barras de los trigramas pasarían de 0.67 px a 1 px y se verían más nítidas; **queda pendiente deciding con el usuario** si agrandar las banderas en el selector.
- 2026-10-01: **banderas en el selector de idioma.** Se creó `src/components/flag-icon.tsx` con las cuatro banderas dibujadas en **SVG embebido** (no archivos `.png` y **no emoji**). Motivo de no usar emoji: **Windows no dibuja los emoji de bandera**, los muestra como letras sueltas (KR, PT, GB), y además heredan el color del tema. Decisiones de bandera acordadas con el usuario: **inglés = Estados Unidos, español = México, coreano = Corea del Sur, portugués = Brasil** (el contenido de portugués ya es de Brasil). Las banderas aparecen en el botón del selector (junto al código `EN`/`ES`/`KO`/`PT`) y en cada opción del desplegable. Cada bandera es `aria-hidden="true"` porque el nombre del idioma ya está en texto y no debe duplicarse para lectores de pantalla. Para que no se pierdan con el tema llevan `ring-1 ring-slate-300 dark:ring-slate-600`, y sus colores son fijos, nunca `currentColor`. Colores exactos que usa cada bandera: **en** `#3C3B6E` / `#B22234` / `#FFFFFF`; **es** `#006847` / `#CE1126` / `#FFFFFF` / `#7A5A38` (águila); **ko** `#CD2E3A` / `#0047A0` / `#FFFFFF` / `#000000`; **pt** `#009739` / `#FFDF00` / `#002776` / `#FFFFFF`.
- 2026-10-01: **revisión de las traducciones coreana y portuguesa** buscando doble sentido, palabras offensivas o de jerga yuniformidad de tono. 20 correcciones aplicadas. Los dos errores más graves: en portugués `hinoário` por `hinário` (ortografía estándar de Brasil; el plural es `hinários`), y en coreano `ResourcesQuelea.helpText` que decía `교회가 Quelea를 도입하고 싶어 하신다면`, donde el sujeto `교회` (iglesia, cosa) no puede llevar la honorificación `하신`, que exige una persona. Ahora es `Quelea 도입을 검토하시는 교회는` («la iglesia que esté considerando…»). También se corrigieron en coreano `물리적 서비스` («servicios físicos», literal y sin sentido) y `원격 키 폰` por `현장 방문 서비스` y `리모컨`; y en portugués `serviços físicos` y `unidades de alimentação` (que en cardiopatología significa «unidades de alimentación», no «sucursales de restaurante») por `serviços que envolvem trabalho presencial` y `unidades de restaurantes`. En coreano se unificó el registro: se mezclaba `여러분` con `당신`, y se cambiaron finales informales como `봅시다` por `보겠습니다`. También se corrigió la ortografía `음식점 지점` (redundante) por `음식점 매장`, y `레스토랑` por `음식점` para usar un solo término. Escaneo automático final: sin palabras del español en portugués, sin acentos españoles (`más`, `aquí`, `también`, `además`, `información`), sin palabras groseras o de jerga, sin hanja en el coreano y sin mezcla de niveles de cortesía.
- 2026-10-01: **migración completa a 4 idiomas.** Se reescribieron `resources/page.tsx`, `resources/drivers/page.tsx`, `resources/quelea/page.tsx`, `page.tsx` (índice) y las páginas provisionales `blog`, `home`, `projects` y `services` para consumir `getTranslations()` en vez de objetos `copy.en/copy.es` y textos fijos. En `resources/quelea/page.tsx` el archivo quedó únicamente con datos (URLs, tamaños, conteos y nombres propios de Biblias) y todo el texto pasó a los mensajes. `blog/page.tsx` además tenía un **byte corrupto** que rompía la palabra «Artículos»; al reescribirlo quedó correcto. Playwright: 68 verificaciones, 0 fallos.
- 2026-10-01: **bug real de formato numérico en coreano.** `ResourcesQuelea.fullCollectionSongs` usaba el argumento simple `{count}`, y en `intl-messageformat` un argumento sin tipo **no** pasa por `Intl.NumberFormat`, por lo que se veía `72098곡` en lugar de `72,098곡`. Se cambió a `{count, plural, other {#곡}}`. Se añadió un validador que detecta cualquier argumento simple `{x}` en los cuatro archivos; ya no queda ninguno. Todos los conteos deben usar `#` dentro de `plural`.
- 2026-10-01: **error de traducción en portugués.** El borrador usaba `cantor/cantores` (cantante) donde decía «canción», en 18 lugares. Al corregir se produjo primero `cançãoes`, que también es incorrecto: en portugués el plural es `canções` **sin** tilde (`ção` → `ões`). Versión final correcta: `canção` / `canções`, `banco de canções`, `Pacote de canções do Quelea (QSP)`. También se ajustó la concordancia de `digitar cantores um por um` a `digitar canções uma por uma`.
- 2026-10-01: se corrigió una etiqueta de la página de Quelea que se mostraba **sin traducir**: `RV1960 + 6 more` era texto fijo y salía en inglés también en español, coreano y portugués. Ahora es la clave traducible `ResourcesQuelea.bibleNames.sevenPack` (`Paquete con 7 Biblias` / `Seven-Bible package` / `성경 7종 패키지` / `Pacote com 7 Bíblias`).
- 2026-10-01: se renombraron las claves de navegación que estaban en español a inglés, para que el proyecto sea coherente con los slugs en inglés: `Navigation.servicios` → `services`, `Navigation.recursos` → `resources`, `Navigation.proyectos` → `projects`. Confirmado que esos nombres no existían en ningún otro namespace.
- 2026-10-01: se eliminaron las carpetas heredadas `src/app/[locale]/servicios`, `proyectos` y `recursos`. Se comprobó con `Get-ChildItem -Recurse -File` que estaban **vacías** (0 archivos) y devolvían 404; `recursos` contenía solo las subcarpetas vacías `drivers` y `quelea`. La estructura final es `blog`, `home`, `projects`, `resources` (con `drivers` y `quelea`) y `services`.
- 2026-10-01: verificado con Playwright el cambio de idioma conservando la ruta (`ko → es → ko → en`), incluyendo que al pasar a inglés **desaparece** el prefijo (`/ko/resources/quelea` → `/resources/quelea`); también que `Escape` cierra el desplegable y que los cuatro manuales quedan ocultos en coreano y portugués (ningún `manual-*.pdf` en el HTML).
- 2026-10-01: **detección por navegador verificada** con Playwright creando un contexto por idioma: `ko-KR → /ko`, `pt-BR → /pt`, `es-MX → /es`, `en-US →` raíz sin prefijo. `Accept-Language: en-US` no debe redirigir a `/en` porque inglés es el idioma por defecto y va sin prefijo.
- 2026-09-30 (tarde): corregido error de hidratación en `ThemeToggle`. La causa era `useState<Theme>(getInitialTheme)`: en el servidor `typeof window === 'undefined'` devolvía `light` (icono sol) y en el primer render del cliente sí existía `window`, por lo que leía `localStorage`/`matchMedia` y podía devolver `dark` (icono luna). El HTML del servidor y el del cliente no coincidían y React regeneraba el árbol. `suppressHydrationWarning` en el `<button>` no lo evitaba, porque solo silencia diferencias de atributos o texto a un nivel, no de la estructura de los hijos. La solución fue eliminar el estado: ahora el componente renderiza **los dos SVG siempre** y la visibilidad la decide CSS con `dark:block` / `dark:hidden`, apoyándose en `@custom-variant dark (&:where(.dark, .dark *))` de `globals.css`. El markup es idéntico en servidor y cliente, así que la diferencia es imposible. La lectura de la preferencia y la aplicación inicial del tema pasan a un `useEffect` de montaje; el toggle calcula el siguiente tema desde la clase real de `<html>`. Playwright: 0 errores de hidratación y 0 errores de consola en `/es`, `/en` y `/es/resources/quelea`; el toggle aplica `dark`, guarda `theme=dark` en `localStorage`, muestra la luna y persiste tras recargar.
- 2026-09-30 (tarde): `ThemeToggle` tenía `aria-label` y `title` fijos en español (`Cambiar a tema claro` / `Tema oscuro`), por lo que en el locale `en` se mostraban en español. Se sustituyeron por una etiqueta genérica y traducida con la clave `Navigation.themeToggle` (`Cambiar tema` / `Toggle theme`). Era un cambio necesario: al pasar los iconos a CSS la etiqueta ya no puede depender del estado del tema.
- 2026-09-30 (tarde): corregido fragmento de código que se había colado en el texto visible de `/resources/quelea`. Decía `sinMarshaller canciones una por una`; ahora dice `sin teclear o copiar canciones una por una`. Se revisó `src/` y `messages/` en busca de otros fragmentos similares y no hay ninguno.
- 2026-09-30: tras retirar recursos locales pendientes de licencia, `npm run lint` y `npm run build` pasan correctamente. Next.js generó las rutas `/[locale]/resources`, `/[locale]/resources/quelea` y `/[locale]/resources/drivers`.
- `npm run build`: pasa correctamente.
- `npm run lint`: pasa correctamente.
- `localhost:3000`: responde. **Nota:** desde el 2026-10-01 `/` ya **no** redirige a `/es`; detecta el idioma del navegador y el inglés queda en la raíz sin prefijo.
- Playwright headless: no mostró errores de aplicación en consola, solo mensajes normales de React DevTools/HMR.
- Next.js 16: `middleware.ts` fue migrado a `src/proxy.ts`; la advertencia de deprecación ya no aparece en `build`.
- Tema claro/oscuro: probado con Playwright; el botón usa SVG de sol/luna, cambia la clase `dark`, guarda `theme=dark` en `localStorage`, persiste al recargar, y el `body` queda con fondo `rgb(17,24,39)` en oscuro.
- Header responsive: probado con Playwright en 390px, 768px y 1366px. En móvil aparece hamburguesa con 5 enlaces; en tablet/desktop aparece menú completo; después de scroll el header sigue en `top=0`.
- Ruta activa en header: probado con Playwright en `/es/servicios`; desktop y móvil marcan `Servicios` con `aria-current="page"`.
- Consola del navegador: corregido error de React por scripts de inicialización de tema dentro del layout. Se eliminó el script temprano y el tema se sincroniza desde `ThemeToggle` en cliente. Playwright confirmó 0 errores en `/recursos`.
- Ruta `/resources/quelea`: página Quelea bilingüe implementada. Cada Biblia se muestra como fila con nombre comprensible, formato, tamaño y botón `Descargar` que abre el archivo ZIP real de la fuente en pestaña nueva. Playwright verificó 12 enlaces directos en español e inglés, 0 errores de consola.
- Biblias de `/resources/quelea`: 12 enlaces directos verificados uno por uno en SourceForge/Zefania (4 español, 4 inglés, 2 coreano, 2 portugués). Los nombres visibles se abrevian para el visitante (`Reina-Valera` en lugar de `Spanish Reina-Valera`), mientras el archivo conserva su nombre original de origen. El catálogo del idioma se conserva como enlace secundario.
- RV1960: resuelta. El foro de Quelea publica un ZIP con 7 Biblias en español; se verificó descargando el archivo y revisando su contenido. Contiene `RV1960.xml` con texto confirmado de Reina-Valera 1960, más Dios Habla Hoy, Nueva Traducción Viviente, Nueva Versión Internacional, Reina-Valera Contemporánea y Traducción en Lenguaje Actual. La copia local anterior se eliminó porque no tenía procedencia documentada; ahora la fuente es pública y verificable. Nota: el ZIP mezcla formatos, `.xmm` (nativo de Quelea) y `.xml`.
- Tema inicial: se quitó el script temprano de tema porque en navegación cliente generaba error de React/Next. El tema se sincroniza desde `ThemeToggle` en cliente para mantener consola limpia.
- Catálogo de recursos: `/resources` es el índice de categorías, no la página de Quelea. Actualmente muestra Quelea (disponible) y Drivers para PC (preparado). Quelea vive en `/resources/quelea`; Drivers vive en `/resources/drivers`. Esto permite agregar categorías sin mezclarlas. Dentro de Quelea, Biblias y canciones se organizan por idioma. Las Biblias enlazan catálogos Zefania para español, inglés, coreano y portugués; los himnarios no se publicarán sin licencia explícita y compatibilidad comprobada.
- Tema de `/recursos`: la tarjeta Descargar Quelea ya no usa fondo negro fijo. En claro usa fondo claro y en oscuro fondo `slate-950`, para respetar el tema sin perder contraste.
- URLs: todos los slugs de ruta son universales en inglés, independientemente del idioma visible. Se migraron `servicios` a `services`, `recursos` a `resources` y `proyectos` a `projects`, incluidas las subrutas de recursos. Ejemplos: `/es/resources` y `/en/resources`.
- Ortografía: se corrigieron tildes y textos en español de las páginas de recursos. El título Quelea ahora es: `Quelea para proyección, Biblias, himnario y mucho más`.

## Tareas por hacer (Pendientes)
- [ ] Desarrollar los componentes visuales de la Landing Page en `/home`.
- [ ] Diseñar el modelo de datos para el /blog (ej. Markdown, MDX o base de datos).
- [ ] Construir el formulario de solicitud de demos en `/proyectos`.
- [ ] Reemplazar assets default de Next.js en `public/` por recursos propios del proyecto.
- [ ] Adaptar `README.md` al proyecto real.
- [ ] Confirmar en otra fuente si existe un archivo Reina-Valera identificado como edición 1960, si se quiere mostrar el año.
- [ ] **Revisión nativa de las traducciones `ko.json` y `pt.json` antes de publicar.** Son borradores generados automáticamente: la terminología ya se corrigió (`canções`, sin `cançãoes`), pero falta que una persona nativa valide la naturalidad, el registro y el vocabulario técnico de la iglesia. No publicar hasta entonces.
- [ ] Decidir si se mantiene oculto el manual de Quelea en coreano y portugués, o si se enlaza al manual en inglés con un aviso visible de que el idioma del manual no coincide con el de la página.

## Himnarios y bases de canciones (agregado 2026-09-30)
- Fuente principal: `https://worshipleaderapp.com/en/download-song-database-opensong-openlp-and-quelea`, que publica bases en formato QSP nativamente compatible con Quelea y se actualiza a diario.
- Enlaces verificados con respuesta `200` y `Content-Length`:
  - Español: `es.qsp` (2.8 MB, 2.570 canciones)
  - Inglés: `en.qsp` (4.5 MB, 3.000 canciones)
  - Coreano: `ko.qsp` (381 KB, 13 canciones)
  - Portugués: `pt.qsp` (525 KB, 102 canciones)
  - Completo: `all.qsp` (115 MB, 72.098 canciones en más de 40 idiomas)
- Recurso adicional en portugués: `https://github.com/irnjunior/quelea-portugues-brasil`, con 5 hinarios en QSP (Harpa Cristã, Cantor Cristão, Hinário Para o Culto Cristão, Hinário Novo Cântico, Hinário Evangélico) más Biblias y manual en portugués.
- Importación en Quelea: `Database > Import > Paquete de canciones de Quelea (QSP)`.
- Nota sobre coreano: la fuente solo tiene 13 canciones, muy por debajo de los otros idiomas. **Resuelto el 2026-10-01:** la página ya muestra el conteo real traducido por locale (13 en coreano), así que el visitante ve la diferencia sin generar expectativa.
- [ ] Localizar paquetes de canciones/himnarios por idioma con licencia explícita de redistribución y compatibilidad con Quelea; actualmente no se encontró ninguno apto.

## Tareas realizadas (Terminadas)
- [x] Configurar i18n (`next-intl`) para detección automática por headers (inglés y español).
- [x] Crear estructura de páginas: `/home`, `/blog`, `/servicios`, `/recursos`, `/proyectos`.
- [x] Crear layout principal con navegación superior (`src/app/[locale]/layout.tsx`).
- [x] Decidir framework: Next.js (React).
- [x] Crear repositorio/carpeta de proyecto e inicializar dependencias.
- [x] Verificar servidor local y rutas principales en `localhost:3000`.
- [x] Crear `Documentacion/jscothserver/LibroDeComandos.md` con comandos usados en la revisión.
- [x] Corregir errores de lint: se eliminó `as any` de la validación de locales y el import `redirect` no usado.
- [x] Migrar `src/middleware.ts` a `src/proxy.ts` siguiendo Next.js 16.
- [x] Agregar soporte de tema claro/oscuro con botón en header, detección inicial del sistema y persistencia en `localStorage`.
- [x] Corregir contraste de tema oscuro: body, landing y páginas placeholder; cambiar botón de texto Claro/Oscuro a iconos SVG sol/luna.
- [x] Hacer header sticky y responsive: menú hamburguesa en móvil, menú completo en tablet/desktop.
- [x] Marcar enlace activo del header según ruta actual, tanto en desktop como en menú móvil.
- [x] Corregir error de consola por script inline del tema eliminando el script temprano y dejando la sincronización en `ThemeToggle`.
- [x] Implementar `/recursos` como página de Quelea con contenido bilingüe, enlaces oficiales, Biblias XML, paquetes de canciones y pasos de integración.
- [x] Traducir etiquetas del header usando `next-intl` en vez de textos fijos.
- [x] Convertir `/recursos` en índice de recursos y mover Quelea a `/recursos/quelea`; agregar `/recursos/drivers` como categoría preparada.
- [x] Organizar recursos Quelea por idioma.
- [x] Corregir tarjeta Descargar Quelea para que responda al tema claro/oscuro.
- [x] Migrar slugs de rutas a inglés universal y actualizar todos los enlaces internos.
- [x] Corregir ortografía en español de recursos y actualizar el título de Quelea.
- [x] Retirar recursos locales de Quelea sin licencia de redistribución verificada.
- [x] Convertir cada Biblia en una fila con enlace directo de descarga verificada y nombre comprensible para el visitante.
- [x] Agregar Reina-Valera 1960 y el paquete de 7 Biblias en español desde el foro oficial de Quelea.
- [x] Agregar bases de canciones QSP por idioma (es, en, ko, pt) más la colección completa, con enlace directo verificado.
- [x] Agregar los hinarios y materiales en portugués Brasil para Quelea.
- [x] Traducir el `aria-label` del botón hamburguesa con la clave `Navigation.menuToggle` (ya no fijo en español).
- [x] Agregar coreano (`ko`) y portugués (`pt`) como idiomas del proyecto, con inglés predeterminado.
- [x] Configurar `localePrefix: 'as-needed'` para que el inglés quede sin prefijo y los demás con prefijo; `/en/...` redirige a la raíz.
- [x] Ampliar el matcher de `src/proxy.ts` a catch-all para que la detección de idioma funcione en todas las rutas.
- [x] Consolidar todo el copy en `messages/{en,es,ko,pt}.json` (10 namespaces, 126 claves idénticas) y eliminar el copy hardcodeado de las páginas.
- [x] Migrar todas las páginas a `getTranslations()`: índice, recursos, drivers, Quelea y las páginas provisionales de blog, home, proyectos y servicios.
- [x] Crear `src/components/locale-switcher.tsx` e integrarlo en escritorio y móvil del header.
- [x] Ocultar los manuales oficiales de Quelea en coreano y portugués por no existir versión oficial en esos idiomas.
- [x] Migrar los conteos a ICU con plurales y formato numérico por locale.
- [x] Eliminar las carpetas vacías heredadas `servicios`, `proyectos` y `recursos` de `src/app/[locale]`.
- [x] Verificar los cuatro idiomas con Playwright (68 verificaciones, 0 fallos) y validar paridad de claves, compilación ICU y ausencia de contaminación entre idiomas.
- [x] Agregar banderas al selector de idioma en SVG, acordadas con el usuario: en = Estados Unidos, es = México, ko = Corea del Sur, pt = Brasil.
- [x] Verificar los colores reales de cada bandera rasterizándola en un canvas y leyendo los píxeles, y comprobar que no cambian al alternar el tema (88 verificaciones, 0 fallos).
- [x] Revisar las traducciones `ko` y `pt` en busca de doble sentido, palabras ofensivas o de jerga y falta de uniformidad en el tono; 20 correcciones aplicadas.
- [x] Corregir la bandera de Corea del Sur: arcos inválidos que pintaban un disco azul, cuatro trigramas ausentes, S sin alinear con la diagonal y puntos mal colocados. Reconstruida según la norma oficial y verificada leyendo el DOM renderizado (30 verificaciones, 0 fallos).
- [ ] **Decidir con el usuario si agrandar las banderas del selector** de `h-4 w-6` a `h-6 w-9`. Motivo: a 24×16 px las barras de los trigramas miden 0.67 px y se ven difuminadas; a 36×24 px miden 1 px y se notan más. No se cambió por defecto para no alterar la maqueta sin aprobación.
- [ ] **Revisión visual del usuario de la bandera coreana nueva.** La verificación técnica es objetiva (geometría, patrones, colores y píxeles), pero el aspecto final debe confirmarlo una persona mirando la pantalla.
