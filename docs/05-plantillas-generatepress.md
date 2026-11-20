# 05. Plantillas con GeneratePress

Elementor Pro resuelve cabeceras, pies y plantillas de entrada con su constructor de temas. En GeneratePress ese papel lo cumple el módulo **Elements** de GP Premium. En nachomg.com, la cabecera, el pie, la plantilla de entrada y la del blog están hechas con Elements, con GeneratePress 3.6, GP Premium y GenerateBlocks 2.x y su versión Pro.

## Qué es un Element

Un Element es una entrada de un tipo de contenido especial que el tema inserta en un lugar concreto de la página según unas reglas de visualización. Según la [documentación de GeneratePress](https://docs.generatepress.com/article/block-element-overview/), los Block Elements (los que se construyen con bloques) son de estos tipos:

| Tipo | Para qué sirve |
|---|---|
| Hook | Insertar bloques en cualquier gancho del tema (una barra superior, una llamada a la acción tras el contenido) |
| Site Header | Sustituir la cabecera del sitio |
| Page Hero | Añadir una cabecera de página por encima del contenido |
| Content Template | Controlar cómo se muestra cada entrada en los archivos |
| Loop Template | Construir un listado propio de entradas con un bloque de consulta |
| Post Meta Template | Sustituir los metadatos de la entrada (autor, fecha, categorías) |
| Post Navigation | Sustituir la navegación entre entradas |
| Archive Navigation | Sustituir la paginación de los archivos |
| Site Footer | Sustituir los widgets del pie y la barra inferior |
| Right Sidebar / Left Sidebar | Sustituir una barra lateral |

Además de los Block Elements existen el **Layout Element**, que controla el ancho del contenedor, la barra lateral y otros ajustes de maquetación por tipo de página, y el **Hook Element** clásico, que inserta código en un gancho.

Un detalle que se olvida: **cada Element necesita reglas de visualización**. Sin una ubicación, no se muestra en ninguna parte. Y con reglas que se solapan, dos Elements pueden competir por el mismo sitio.

## Orden de construcción

1. **Layout Elements**: anchos de contenedor y barras laterales por tipo de contenido. Es lo que más cambia el aspecto general y conviene fijarlo antes de maquetar nada encima.
2. **Site Header**: logotipo, navegación, enlace para saltar al contenido. El menú se gestiona desde Apariencia, no se escribe a mano dentro del Element.
3. **Site Footer**: enlaces legales, datos de contacto públicos, navegación secundaria.
4. **Plantilla de entrada**: Page Hero o Content Template para la cabecera de la entrada (título, fecha, autor, imagen destacada), Post Meta Template y Post Navigation.
5. **Plantilla del blog y de archivos**: Loop Template con el bloque de consulta de GenerateBlocks (la documentación de GeneratePress lo recomienda frente al bloque Consulta del núcleo) y Archive Navigation.

## Etiquetas dinámicas en lugar de texto fijo

Las plantillas deben mostrar datos de cada entrada: título, fecha, autor, imagen destacada, categorías. GenerateBlocks ofrece etiquetas dinámicas para insertarlos. Si el agente escribe una plantilla con el título de una entrada concreta como texto fijo, la plantilla está mal hecha, por bien que se vea en la página que usó de ejemplo. La comprobación es fácil: abrir tres entradas distintas y ver que cada una muestra lo suyo.

## Trabajo con el agente

Los Elements son entradas de WordPress, así que un agente puede leer y escribir su contenido con las mismas herramientas que una página. Pero hay tres diferencias que obligan a ir con más cuidado:

- **El alcance**. Un error en una página afecta a una URL; un error en la cabecera afecta a todas. Cada cambio en un Element con reglas globales se revisa en varias páginas de tipos distintos antes de darlo por bueno.
- **Las reglas de visualización** son metadatos, no contenido. Cambiarlas es una decisión de estructura, y la aprueba una persona.
- **La caché**. Al cambiar un Element global hay que purgar toda la caché, no solo una URL. Y las purgas tienen límites de frecuencia (véase [10](10-trampas-conocidas.md)).

Una práctica prudente: crear el Element nuevo como borrador, con reglas de visualización restringidas a una página de prueba, revisarlo allí y solo entonces ampliar las reglas a todo el sitio y retirar el equivalente de Elementor.

## Accesibilidad en las plantillas

Las plantillas son el sitio donde un error de accesibilidad se multiplica por todas las páginas:

- Enlace «Saltar al contenido» como primer elemento enfocable.
- Un solo `<header>`, un `<nav>` con nombre accesible si hay varios menús, un `<main>`, un `<footer>`.
- El título de la entrada como único H1; en archivos, el título del archivo como H1 y los títulos de las entradas como H2.
- Botón del menú móvil con nombre accesible y estado (`aria-expanded`). GeneratePress lo gestiona en su menú; si se sustituye por uno propio, hay que reproducirlo.
- Foco visible y no tapado por la cabecera fija ([WCAG 2.4.11](https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum)).

## Retirar las plantillas de Elementor

Cuando todas las plantillas nuevas estén publicadas y verificadas:

1. Desactiva las condiciones de visualización de las plantillas del constructor de temas de Elementor Pro, una a una, comprobando cada vez que el Element de GeneratePress toma el relevo.
2. Cuando ninguna página dependa de Elementor, desactiva Elementor Pro y Elementor.
3. No borres todavía las plantillas ni los datos. Mantenlos unas semanas como red de seguridad; el borrado definitivo es una decisión de la persona responsable, con copia de seguridad reciente.

---

Anterior: [04. Reconstrucción con bloques](04-reconstruccion-con-bloques.md) · Siguiente: [06. SEO y redirecciones](06-seo-y-redirecciones.md)
