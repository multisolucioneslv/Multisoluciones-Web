# Multisoluciones Web: muestra visual de rubros

**Fecha:** 2026-10-04  
**Estado:** Diseño aprobado; pendiente de revisión del documento antes de la planificación técnica.  
**Proyecto:** `C:\ProgramandoconClaude\Proyectos\enProceso\jscothserver`  
**Ejecución:** Local únicamente. No leer, modificar ni desplegar contenido en VPS o n8n.

## Propósito

Añadir a la página de inicio de Multisoluciones Web una muestra visual de posibles sitios web para emprendimientos de servicios. Su objetivo es ayudar a una persona interesada a imaginar un sitio adaptado a su rubro.

No son plantillas comerciales, catálogos para descarga, diseños preasignados ni páginas funcionales. Cada futuro proyecto seguirá diseñándose para el negocio concreto del cliente.

## Ubicación y jerarquía

La nueva sección se ubicará en `src/app/[locale]/page.tsx`, inmediatamente después del resumen de servicios y antes del bloque que explica el enfoque de trabajo.

Esta posición responde a la secuencia de decisión de la portada:

1. Multisoluciones Web explica qué hace.
2. La persona ve ejemplos ilustrativos de cómo esas soluciones pueden tomar forma en distintos rubros.
3. La persona conoce cómo se trabaja.
4. La persona ve proyectos reales y puede contactar.

La sección no se colocará dentro de Proyectos: los proyectos existentes comunican trabajo real, mientras que estas demostraciones son ficticias. Tampoco se creará una ruta nueva ni se modificará la navegación.

## Contenido de la sección

La sección incluirá un encabezado traducido para el sitio principal, una explicación breve y un aviso visible que aclare, en esencia, que son conceptos ilustrativos y que cada sitio se diseña alrededor de cada negocio, no a partir de un diseño fijo.

La cuadrícula mostrará siete miniportadas estáticas, escritas en inglés para mantenerlas deliberadamente simples y universales:

1. **Cleaning Services** — limpieza residencial, de oficinas y profunda.
2. **Construction & Remodeling** — construcción, reparaciones y remodelación.
3. **Landscaping & Irrigation** — diseño, cuidado de jardines e instalación de riego.
4. **Electrical Services** — trabajos eléctricos residenciales y comerciales.
5. **Plumbing Services** — reparaciones, instalaciones y mantenimiento de plomería.
6. **Auto Repair / Mobile Service** — reparación automotriz y servicio móvil.
7. **Pool Cleaning & Maintenance** — mantenimiento periódico, reparación de equipos y servicios de temporada para albercas.

En escritorio, se presentarán como cuadrícula de cuatro elementos y una segunda fila de tres. En pantallas pequeñas, pasarán a una columna o a la cantidad de columnas que conserve la legibilidad, sin carrusel, controles ni contenido oculto.

## Dirección visual

Cada demostración será una mini portada ficticia, no una tarjeta genérica. Tendrá una estructura compacta que sugiera una página real: nombre inventado, navegación mínima, titular, frase de apoyo, llamada a la acción sin destino y un resumen de servicios. El contenido de las demostraciones se mantiene en inglés; el texto que explica la sección y sus avisos se traduce con la infraestructura existente de `next-intl`.

Las direcciones deben ser claramente diferentes sin romper la identidad general de Multisoluciones Web:

| Rubro | Dirección de la miniportada |
|---|---|
| Cleaning Services | Clara, luminosa y amable; blancos y azules/mentas suaves. |
| Construction & Remodeling | Material, sobria y editorial; tonos tierra, piedra y tinta. |
| Landscaping & Irrigation | Natural y cuidada; verdes profundos, arena y detalle de vegetación. |
| Electrical Services | Técnica y directa; alto contraste, azul marino y acento eléctrico. |
| Plumbing Services | Práctica y confiable; azul, blanco y referencias discretas al flujo de agua. |
| Auto Repair / Mobile Service | Robusta y dinámica; grafito, metal y acento cálido. |
| Pool Cleaning & Maintenance | Aqua técnico; azul profundo, turquesa, blanco y arena. Distingue Weekly Care, Equipment Repair y Seasonal Service. |

Se evitarán falsos indicadores de confianza (calificaciones, reseñas, sellos, precios, áreas de cobertura, licencias, disponibilidad 24/7 o métricas), porque se trataría de negocios ficticios.

## Imágenes y propiedad intelectual

Las imágenes de cada rubro se generarán específicamente para esta sección y se guardarán como activos locales del proyecto. No se descargarán, reutilizarán ni transformarán imágenes, logotipos, capturas, nombres, textos o marcas de negocios encontrados durante la investigación.

Las imágenes comunicarán la atmósfera del rubro, sin marcas reconocibles, texto legible incrustado, matrículas, uniformes identificables ni la apariencia de que representan clientes de Multisoluciones Web.

## Comportamiento y accesibilidad

- Las demostraciones son ilustrativas y no incluyen enlaces, reservas, formularios o interacciones funcionales.
- El marcado será semántico: sección con título, artículos para cada muestra e imágenes con texto alternativo apropiado.
- La información esencial no dependerá solo de las imágenes.
- La cuadrícula debe conservar contraste y lectura en tema claro y oscuro.
- No se añadirán animaciones necesarias para entender el contenido ni comportamiento que cause desplazamiento horizontal.

## Arquitectura prevista

- Extraer los datos de las siete demostraciones a una estructura local y tipada, para mantener la página de inicio legible y evitar contenido repetido.
- Crear un componente de presentación dedicado para la muestra y, si aporta claridad, un componente específico para cada vista previa visual reutilizando la misma estructura base.
- Mantener `src/app/[locale]/page.tsx` como Server Component.
- Añadir solo las claves necesarias al espacio de traducciones de la portada en `messages/en.json`, `messages/es.json`, `messages/ko.json` y `messages/pt.json`, con paridad de claves.
- Usar los estilos y tokens existentes de Tailwind CSS 4; no incorporar bibliotecas de carrusel, galería, animación o UI.
- Guardar los nuevos assets generados en una ruta pública local, organizada para esta sección.

## Fuera de alcance

- Rutas nuevas para las demostraciones o enlaces desde ellas.
- Formularios, reserva, cotización, calculadoras, mapas, precios, reseñas o contactos ficticios.
- Conversión de estas muestras en una biblioteca de plantillas vendible o administrable.
- Cambios a n8n, VPS, Mailcow, secretos, despliegues o integraciones externas.
- Cambios a Servicios, Recursos, Proyectos, el formulario de contacto o navegación.
- Uso de recursos visuales de negocios o bancos de imágenes de terceros.

## Verificación

Antes de cerrar la implementación local:

- Ejecutar `npm run lint` y `npm run build` correctamente.
- Comprobar la portada en escritorio y móvil, en temas claro y oscuro, sin overflow horizontal.
- Confirmar que las siete demostraciones aparecen, que el aviso ilustrativo es visible y que no contienen acciones funcionales.
- Confirmar que las imágenes locales poseen alternativas de texto útiles y que no muestran marcas o texto legible de terceros.
- Verificar la paridad de las nuevas claves entre los cuatro archivos de mensajes y el funcionamiento de las rutas en inglés, español, coreano y portugués.
- Revisar el diff final y no realizar `push` ni despliegue.
