# 01. Auditoría previa

Antes de migrar hay que saber de dónde partes. Sin cifras de partida no podrás demostrar que la migración ha mejorado algo, ni detectar a tiempo que ha empeorado otra cosa. Lo digo con conocimiento de causa: en la migración de nachomg.com no guardé mediciones equivalentes de la web antigua y tuve que conformarme con comparar contra el paquete oficial de Elementor ([lo cuento en la entrada](https://nachomg.com/elementor-vs-gutenberg/)). No repitas mi error.

Esta fase es la más adecuada para empezar a trabajar con un agente de IA: es casi toda de lectura, el riesgo es bajo y el volumen de datos que hay que ordenar es alto.

## Permisos del agente en esta fase

Solo lectura. Si tu servidor MCP permite crear un token o una conexión con un perfil de permisos limitado, crea uno para la auditoría y retíralo al terminar.

## Qué auditar

### Rendimiento

- **Peso por página**: HTML, CSS, JavaScript, fuentes e imágenes, con compresión, en una muestra representativa (portada, una página de servicio, una entrada larga, un archivo de categoría).
- **Número de peticiones** y qué dominios de terceros intervienen.
- **Tiempo hasta el primer byte (TTFB)** con y sin caché. En mi caso, 0,6–0,9 s sin caché y 0,15–0,27 s con caché tras la migración: el TTFB depende sobre todo del servidor, no del maquetador.
- **Core Web Vitals de campo** en el informe de Search Console. Los umbrales de «bueno» en el percentil 75 son LCP ≤ 2,5 s, INP ≤ 200 ms y CLS ≤ 0,1 ([web.dev](https://web.dev/articles/vitals)). INP sustituyó a FID el 12 de marzo de 2024 ([web.dev](https://web.dev/blog/inp-cwv-march-12)).
- **Tamaño del DOM**: número de elementos HTML por página. Las páginas actuales de nachomg.com tienen entre 390 y 450 etiquetas, cabecera y pie incluidos.

Guarda los resultados con fecha. Los datos de campo de Search Console se agregan en periodos de 28 días, así que el efecto de la migración tardará semanas en verse.

### SEO

- Listado completo de URL indexables: sitemap, más las que reciben tráfico según Search Console aunque no estén en el sitemap.
- Por URL: título, metadescripción, H1, canónica, indexación, datos estructurados.
- Enlaces internos y redirecciones existentes.
- Las URL con más clics e impresiones de los últimos 12 meses (exportación de Search Console). Esa lista decide qué no se puede romper bajo ningún concepto.

### Analítica

- Qué etiquetas se cargan y cómo (Site Kit, Tag Manager, código pegado en el tema).
- Qué eventos y conversiones están configurados y de qué elementos dependen. Un formulario reconstruido con otro marcado puede dejar de disparar el evento sin que nadie lo note durante semanas.
- Cuánto pesa la analítica. En mi web, tras migrar, el archivo más pesado que descarga un visitante es la etiqueta de Google que inserta Site Kit: 162 KB comprimidos, más de tres veces todo el JavaScript propio del tema.

### Legal

- Aviso legal, política de privacidad y de cookies: dónde están y quién los mantiene.
- Banner de consentimiento: plugin, configuración, si bloquea de verdad los scripts antes del consentimiento.
- Formularios: casillas de consentimiento, textos informativos, destino de los datos.

Esto se documenta, no se reescribe. La revisión de textos legales corresponde a una persona con criterio jurídico (véase [11. Qué no delegar](11-que-no-delegar-en-la-ia.md)). Esta guía es práctica y no sustituye asesoramiento legal.

### Accesibilidad

- Pase automático con axe-core en la muestra de páginas, a escritorio y móvil (el script [`scripts/axe-wcag.js`](../scripts/axe-wcag.js) lo hace en 1440 y 390 px).
- Revisión manual básica: navegación completa con teclado, foco visible, orden de encabezados, textos alternativos, contraste.

El objetivo de referencia es WCAG 2.2 nivel AA. Lo detallo en [08. Accesibilidad](08-accesibilidad.md).

### Inventario técnico

- Versión de WordPress, PHP, tema, plugins activos e inactivos.
- Qué plugins dependen de Elementor (paquetes de widgets, extensiones de formularios, plantillas).
- Fragmentos de código personalizados (functions.php, plugins de snippets) y qué hacen.
- Configuración de caché y optimización: minificación, combinación, aplazamiento de JavaScript, CSS crítico. Mucho de esto existe para compensar al maquetador y sobrará después (véase [07. Rendimiento y caché](07-rendimiento-y-cache.md)).

## Cómo repartir el trabajo con el agente

| Tarea | Agente | Persona |
|---|---|---|
| Listar plugins, versiones, ajustes de caché | Sí, con herramientas de lectura | Revisa el resumen |
| Inventario de URL, títulos, meta, H1 | Sí | Decide la muestra representativa |
| Pase de axe-core y capturas | Sí, con los scripts del repositorio | Revisa lo que axe marca como incompleto |
| Exportar datos de Search Console | Puede leerlos si tiene acceso; si no, la persona los exporta | Interpreta qué URL son críticas |
| Evaluar textos legales | Solo señalar dónde están y qué falta a primera vista | Revisión con criterio jurídico |
| Navegación con teclado y lector de pantalla | No sustituye la prueba | La hace una persona |

## Entregable de esta fase

Un documento de auditoría con fecha que incluya: cifras de rendimiento por página, lista de URL críticas, inventario de plugins y dependencias de Elementor, estado de accesibilidad, observaciones legales para revisar y una lista priorizada de problemas. El agente recopila los datos en tablas a partir de lo que ha leído; la persona responsable los revisa, escribe el documento y lo convierte en el punto de partida del plan.

Para la instrucción de ejemplo, véase [prompts/01-auditoria.md](../prompts/01-auditoria.md).

---

Anterior: [00. Principios](00-principios.md) · Siguiente: [02. Inventario y plan](02-inventario-y-plan.md)
