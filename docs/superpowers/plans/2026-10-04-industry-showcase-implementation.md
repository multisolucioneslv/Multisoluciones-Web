# Plan de implementación: muestra visual de rubros

> **Para ejecutar:** realizar los pasos en orden y verificar cada hito antes de pasar al siguiente. No desplegar ni hacer `push`.

**Objetivo:** Mostrar siete conceptos visuales de sitios para negocios de servicios en la portada de Multisoluciones Web, usando imágenes originales y sin convertirlos en páginas funcionales.

**Arquitectura:** Un componente de servidor concentra los datos de cada rubro y renderiza tarjetas semánticas; el índice de la portada lo inserta después del bloque de Servicios. Los mensajes de interfaz se traducen por `next-intl`; los textos dentro de las miniportadas permanecen en inglés por decisión de producto. Siete imágenes locales generadas específicamente para el sitio completan cada demostración.

**Tecnologías:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, `next-intl` 4 y el generador de imágenes autorizado.

## Recomendaciones incorporadas antes de crear las muestras

- **Legibilidad antes que número de columnas:** cuatro columnas solo cuando permitan leer los titulares y servicios sin reducir excesivamente la tipografía. Si no caben, usar tres o dos columnas; no miniaturizar texto para cumplir la cuadrícula. Verificar a zoom 100% en escritorio y en móvil.
- **No confundir rubros con servicios propios:** el encabezado y la explicación deben indicar explícitamente «Ejemplos de sitios web que podemos crear para negocios de estos rubros» (con traducción equivalente). Multisoluciones Web ofrece desarrollo web para esos negocios, no servicios de plomería, electricidad, reparación automotriz u otros oficios representados. Comprobar que esa distinción sea visible antes de la cuadrícula y no dependa únicamente del aviso de ejemplos ficticios.

---

## 1. Validar el marco técnico antes de editar

**Archivos a consultar:**
- `AGENTS.md`
- `node_modules/next/dist/docs/`
- `src/app/[locale]/page.tsx`
- `src/app/globals.css`
- `messages/en.json`, `messages/es.json`, `messages/ko.json`, `messages/pt.json`

1. Leer la guía de Next.js 16 correspondiente a imágenes estáticas, componentes de servidor y metadatos si los cambios lo requieren.
2. Revisar los tokens de color, espaciado y tema existentes, para no introducir un sistema visual paralelo.
3. Revisar el espacio de nombres `HomePage` en los cuatro archivos de mensajes y confirmar su paridad actual.
4. Confirmar árbol limpio antes de crear código; los commits de documentación anteriores no deben mezclarse con cambios no relacionados.

**Verificación:** no hay cambios de interfaz ni modificaciones a archivos durante este paso.

---

## 2. Generar y preparar los assets originales

**Archivos nuevos previstos:**
- `public/industry-showcase/cleaning-services.webp`
- `public/industry-showcase/construction-remodeling.webp`
- `public/industry-showcase/landscaping-irrigation.webp`
- `public/industry-showcase/electrical-services.webp`
- `public/industry-showcase/plumbing-services.webp`
- `public/industry-showcase/mobile-auto-service.webp`
- `public/industry-showcase/pool-maintenance.webp`

1. Usar el flujo de generación de imágenes para producir una imagen horizontal por rubro, apropiada para una mini portada web.
2. Incluir en cada instrucción: fotografía editorial original, sin logotipos, sin letreros, sin texto legible, sin marcas, sin matrículas identificables ni personas reconocibles.
3. Ajustar cada imagen a la dirección de arte aprobada:
   - Limpieza: interior luminoso, limpio y acogedor.
   - Construcción: acabado o remodelación de calidad, material y sobrio.
   - Jardinería: jardín cuidado y sistema de riego discreto.
   - Electricidad: intervención profesional segura, entorno técnico no peligroso.
   - Plomería: detalle profesional de instalación o reparación limpia.
   - Auto móvil: técnico y vehículo de servicio genérico, sin marca ni placa legible.
   - Albercas: agua clara, equipo de cuidado y ambiente aqua técnico.
4. Guardar los resultados como WebP bajo `public/industry-showcase/`, con nombres estables y en proporción que no recorte el motivo principal en móvil.
5. Inspeccionar visualmente todos los archivos antes de usarlos; regenerar cualquier imagen que contenga texto, marcas o anomalías visibles.

**Verificación:** siete imágenes locales visibles, coherentes entre sí, sin recursos de terceros ni texto de marca incorporado.

---

## 3. Construir el componente de la muestra

**Archivo nuevo:** `src/components/industry-showcase.tsx`

1. Crear un componente de servidor con un arreglo tipado de siete objetos. Cada objeto contendrá: identificador, nombre del concepto ficticio, categoría, titular en inglés, texto breve en inglés, etiqueta de acción ilustrativa, dos o tres servicios breves, ruta local de imagen y texto alternativo.
2. Construir una sección semántica con `aria-labelledby`, encabezado traducible, explicación traducible y aviso traducible de carácter ilustrativo.
3. Renderizar las siete muestras como `article`, no como enlaces ni botones. Las etiquetas de llamada a la acción se presentarán como apariencia visual estática, sin `href`, manejadores ni formularios.
4. Usar `next/image` solo si la documentación de Next.js 16 consultada en el paso 1 confirma el patrón adecuado para archivos locales; en caso contrario, usar una imagen HTML con dimensiones explícitas y carga diferida. Mantener texto alternativo descriptivo.
5. Diseñar la cuadrícula como una sola columna en móvil, dos o tres columnas en pantallas medias y cuatro columnas en pantallas grandes; la última fila tendrá tres muestras sin alterar el orden lógico.
6. Mantener la miniportada dentro de una relación de aspecto estable, con zonas visuales consistentes: cabecera ficticia, imagen, propuesta, etiquetas de servicios y acción ilustrativa.
7. Añadir variaciones de color por rubro usando clases locales declarativas, manteniendo contraste suficiente en ambos temas y sin colores de texto codificados que fallen en modo oscuro.

**Verificación:** TypeScript no presenta errores; cada tarjeta se entiende sin imagen; ningún elemento de la muestra es interactivo o afirma datos falsos.

---

## 4. Integrar el componente en la portada

**Archivo a modificar:** `src/app/[locale]/page.tsx`

1. Importar `IndustryShowcase`.
2. Colocarlo inmediatamente después de la sección de Servicios y antes de la sección de Enfoque, preservando el espaciado vertical de `space-y-28 sm:space-y-36`.
3. No modificar el orden, contenido, enlaces o comportamiento de los bloques de Proyectos y Contacto.
4. No modificar rutas, cabecera, selector de idioma, formulario o servicios de servidor.

**Verificación:** la secuencia de la portada es Hero → Servicios → Muestra de rubros → Enfoque → Proyectos → Contacto.

---

## 5. Incorporar mensajes traducidos con paridad

**Archivos a modificar:**
- `messages/en.json`
- `messages/es.json`
- `messages/ko.json`
- `messages/pt.json`

1. Añadir las claves de interfaz mínimas a `HomePage`: etiqueta superior de la sección, título, introducción y aviso ilustrativo.
2. Traducir esas cuatro piezas de interfaz a los idiomas existentes sin traducir los textos incluidos dentro de las siete miniportadas, los cuales permanecen intencionalmente en inglés.
3. Verificar mediante un script local de comparación o revisión estructural que los cuatro JSON contienen exactamente las mismas claves nuevas y siguen siendo JSON válido.

**Verificación:** no hay claves faltantes ni error de `next-intl` al cargar `/`, `/es`, `/ko` o `/pt`.

---

## 6. Afinar y verificar la presentación

**Archivos potencialmente modificados:**
- `src/components/industry-showcase.tsx`
- `src/app/globals.css` (solo si las utilidades Tailwind existentes no bastan)

1. Abrir la portada local y revisar las cuadrículas en móvil, tableta y escritorio.
2. Revisar los temas claro y oscuro para contrastes, bordes, imágenes y legibilidad de la acción ilustrativa.
3. Confirmar que las imágenes no deforman, no provocan saltos de diseño visibles y no crean desplazamiento horizontal.
4. Confirmar que el lector puede distinguir que se trata de ejemplos, no de clientes, sitios operativos o promesas de servicio.
5. Ajustar solo lo necesario; evitar animaciones, carruseles y complejidad no incluida en el diseño.

**Verificación:** las siete muestras son visualmente distintas, el mensaje legal/editorial es inequívoco y la portada conserva la identidad de Multisoluciones Web.

---

## 7. Validación final y entrega local

1. Ejecutar `npm run lint`.
2. Ejecutar `npm run build`.
3. Navegar localmente a `/`, `/es`, `/ko`, `/pt`, `/home`, `/services`, `/projects` y `/resources` para detectar regresiones relevantes.
4. Comprobar navegación móvil, cambio de tema, selector de idioma y ausencia de errores de consola en la portada.
5. Ejecutar `git diff --check`, revisar el diff y confirmar que solo contiene el componente, la integración, los mensajes y assets de la muestra.
6. Crear commits locales claros por hito (assets y UI/traducciones, si procede). No hacer `push`, despliegue ni cambios a VPS/n8n.

**Resultado esperado:** la portada comunica los siete rubros mediante conceptos visuales originales, accesibles y claramente ilustrativos, sin alterar el resto de las operaciones del sitio.
