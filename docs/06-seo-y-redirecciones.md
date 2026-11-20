# 06. SEO y redirecciones

Cambiar de maquetador no hace perder posiciones. Lo que las hace perder son los descuidos: URL que cambian sin redirección, enlaces internos rotos, encabezados que desaparecen, páginas publicadas a medio hacer. En consultoría lo veo a menudo, y casi nunca es culpa del editor.

En el SEO on-page tradicional, Elementor y Gutenberg empatan: ambos se integran con Rank Math o Yoast y permiten controlar títulos, metadescripciones, encabezados y datos estructurados. La ventaja de Gutenberg está en lo técnico (menos código, mejor rendimiento en móvil, menos JavaScript que perjudique el INP), no en ningún efecto mágico sobre el posicionamiento.

## La regla principal: mismas URL

Si una página se reconstruye, conserva su URL. La migración de maquetador no es el momento de «aprovechar para ordenar los slugs». Cada URL que cambia necesita una redirección, y cada redirección es una ocasión de error y un pequeño retraso para quien llega por un enlace antiguo.

Cuando una URL tiene que desaparecer (por fusión o retirada, según la decisión tomada en el [inventario](02-inventario-y-plan.md)), se redirige con un **301** a la página equivalente más próxima. Si no existe equivalente, un **410** (contenido eliminado) es más honesto que redirigir a la portada.

## Redirecciones con Rank Math

Rank Math incluye un módulo de **Redirecciones** y un **Monitor 404**, y permite los tipos 301 (permanente), 302 (temporal), 307 (temporal), 410 (contenido eliminado) y 451 (no disponible por motivos legales). Lo he comprobado en el código del plugin (versión 1.0.282, [WordPress.org](https://wordpress.org/plugins/seo-by-rank-math/)).

Google recomienda usar redirecciones permanentes cuando el cambio no se va a revertir, y mantenerlas **tanto tiempo como sea posible, en general al menos un año**, para que pueda transferir las señales a las nuevas URL, incluidas las de los enlaces de otros sitios ([Google Search Central: traslados de sitios](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes); [redirecciones y Google](https://developers.google.com/search/docs/crawling-indexing/301-redirects)). Desde el punto de vista de quien visita la web, lo razonable es no retirarlas nunca.

### Qué hace el agente y qué decide la persona

Con un servidor MCP que exponga las herramientas de Rank Math (en el caso real, la familia `wp_rm_*`), el agente puede:

- Listar las redirecciones existentes y detectar cadenas (A → B → C) o bucles.
- Leer el Monitor 404 y agrupar las URL rotas por patrón.
- Proponer un mapa de redirecciones origen → destino a partir del inventario.
- Crearlas, una vez aprobado el mapa.

Lo que no hace sin aprobación explícita es **crear o cambiar redirecciones de URL con tráfico**. Para decidir si una URL con 300 clics al mes se fusiona con otra hay que mirar los datos de Search Console y entender la intención de búsqueda de cada una. Eso es criterio, no ejecución.

### Verificar el mapa

El script [`scripts/redirecciones.js`](../scripts/redirecciones.js) recibe un CSV con columnas `origen,destino` y comprueba, para cada fila, que el origen responde 301 o 308 en un solo salto hacia el destino exacto y que el destino responde 200. Señala las redirecciones temporales, las que apuntan a otro sitio y los destinos rotos.

```bash
node scripts/redirecciones.js mapa-redirecciones.csv
```

## Metadatos SEO

Rank Math guarda título, metadescripción, canónica, robots y datos estructurados como metadatos de cada entrada, no dentro del contenido. Por eso sobreviven a la reconstrucción si se reconstruye **sobre la misma entrada**. Si en cambio se construye una página nueva y luego se intercambia con la antigua, los metadatos hay que copiarlos. Es un error fácil de cometer cuando el agente trabaja en borradores.

Comprobaciones por URL tras la migración:

- El título y la metadescripción son los decididos.
- La canónica apunta a sí misma (o a donde se decidió).
- La página sigue siendo indexable si lo era.
- Los datos estructurados siguen presentes y válidos.
- Hay un único H1 y la jerarquía de encabezados tiene sentido.

El agente puede extraer todo esto en una tabla antes y después de la migración y señalar las diferencias. La tabla de diferencias la revisa una persona.

## Enlaces internos

Elementor guarda los enlaces dentro de su JSON. Al reconstruir, es fácil que un botón pierda su enlace o que un enlace apunte a una URL de prueba. Pide al agente un listado de enlaces internos por página (antes y después) y revisa los que cambian. Un rastreo completo de la web con una herramienta de rastreo, antes y después, es la red de seguridad final.

## Sitemap y Search Console

- Comprueba que el sitemap no incluye páginas de prueba, borradores publicados por error ni plantillas de Elementor (`elementor_library` no debe ser indexable).
- Tras publicar, revisa en Search Console el informe de páginas indexadas y el de experiencia, y vigila durante las semanas siguientes los errores 404 y las caídas de clics por URL.
- Recuerda que los datos de Core Web Vitals de Search Console se agregan en periodos de 28 días. Los primeros días no demuestran nada, ni para bien ni para mal.

## Lo que no es SEO aunque lo parezca

El agente puede sugerir «optimizar» textos para palabras clave mientras reconstruye. No es el momento. Una migración se valida comparando un antes y un después; si a la vez cambias maquetación, textos y encabezados, no sabrás qué causó cualquier variación posterior. Primero se migra; la optimización de contenido, si toca, viene después y con su propia medición.

---

Anterior: [05. Plantillas con GeneratePress](05-plantillas-generatepress.md) · Siguiente: [07. Rendimiento y caché](07-rendimiento-y-cache.md)
