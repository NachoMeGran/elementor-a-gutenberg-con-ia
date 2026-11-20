# 04. Reconstrucción con bloques

Este es el capítulo donde la IA ahorra más horas y donde es más fácil estropearlo. Un agente puede escribir en minutos el marcado de bloques de una portada entera. Si ese marcado no es exactamente el que el editor espera, la página se ve bien en la web y aparece rota cuando su dueño intenta editarla. Y una web que su dueño no puede editar es una dependencia nueva, solo que con otro proveedor.

## La regla: bloques del núcleo, editables por el dueño

En nachomg.com la portada y las páginas se reconstruyeron con bloques del núcleo de WordPress: Grupo, Columnas, Encabezado, Párrafo, Lista, Imagen, Botones, Detalles, Cita. Nada de bloques de «HTML personalizado» con la maquetación dentro. El criterio es simple: cualquier texto, imagen o botón debe poder cambiarse desde el editor visual, sin tocar código.

GenerateBlocks queda para lo que el núcleo resuelve peor: las plantillas, los listados de entradas y los elementos de cabecera y pie (véase [05](05-plantillas-generatepress.md)). Desde su versión 2.0, de febrero de 2025, GenerateBlocks se apoya en cuatro bloques básicos (Element, Text, Media y Shape) más los de consulta para listados.

## Cómo guarda WordPress los bloques

Los bloques se guardan en `post_content` como HTML normal delimitado por comentarios con la «gramática de bloques»: un comentario de apertura con el nombre del bloque y, si hace falta, un objeto JSON con sus atributos ([Block Editor Handbook](https://github.com/WordPress/gutenberg/blob/trunk/docs/explanations/architecture/key-concepts.md)). Por ejemplo:

```html
<!-- wp:group {"className":"rejilla"} -->
<div class="wp-block-group rejilla">
  <!-- wp:heading -->
  <h2 class="wp-block-heading">Servicios</h2>
  <!-- /wp:heading -->
</div>
<!-- /wp:group -->
```

Al abrir el editor, WordPress **valida** cada bloque: regenera su HTML a partir de los atributos y lo compara con lo guardado. Si no coincide, marca el bloque como no válido y ofrece «intentar recuperar el bloque» ([documentación de validación](https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-edit-save.md#validation)). La causa más común, según la propia documentación, es que alguien o algo externo haya cambiado el HTML de un bloque de forma que ya no se considera correcto. Un agente de IA que escribe marcado a mano es exactamente ese «algo externo».

De ahí la comprobación que no se puede saltar: **después de cada página reconstruida, ábrela en el editor y confirma que no aparece ningún aviso de bloque no válido**. La web publicada no te lo dirá.

## Cómo trabajar con el agente

### Leer antes de escribir

El agente debe empezar leyendo la estructura de bloques de la página (en Easy MCP AI, la herramienta `wp_get_post_blocks`), no el HTML renderizado. Así trabaja sobre la misma representación que el editor.

### Operaciones por bloque, no reemplazos de texto

Hay dos formas de cambiar una página por MCP:

- **Reemplazo de texto** (`wp_replace_in_post`): busca una cadena y la cambia por otra. Sirve para corregir una errata o cambiar un enlace.
- **Operaciones por bloque** (`wp_update_post_blocks`): insertar, sustituir, mover o borrar bloques identificados por su posición en el árbol.

Para cualquier cambio de estructura (añadir una columna, mover una sección, envolver bloques en un Grupo) hay que usar operaciones por bloque. En el caso real, la herramienta de reemplazo rechazaba los cambios que alteraban la estructura de bloques, y con razón: un reemplazo de texto que abre un `<div>` y no lo cierra deja la página en un estado que el editor no sabe reconstruir.

### Construir en borrador

Cada página nueva se construye como borrador o como una página de trabajo sin enlazar. Se revisa con un enlace de vista previa, a escritorio y móvil, y solo entonces sustituye a la publicada. La sustitución (cambiar el contenido de la página con la URL buena, o intercambiar páginas) es una acción sensible: la aprueba una persona.

### Patrones para lo que se repite

Si una sección aparece en varias páginas (una llamada a la acción, un bloque de contacto), conviene convertirla en un patrón sincronizado. Así se cambia en un sitio y se actualiza en todos. El agente puede detectar las secciones repetidas en el inventario y proponerlas como patrones; la persona decide cuáles.

## Equivalencias habituales

No hay correspondencia uno a uno, y conviene aprovechar la reconstrucción para simplificar. Esta tabla recoge las equivalencias que más usé:

| En Elementor | En bloques | Nota |
|---|---|---|
| Sección, columna, contenedor | Grupo (con sus variantes Fila, Pila y Cuadrícula) o Columnas | Una clase del sistema (`.rejilla`) mejor que ajustes sueltos |
| Encabezado | Encabezado | Respeta la jerarquía H2/H3 por estructura, no por tamaño |
| Editor de texto | Párrafo, Lista | Divide los bloques de texto largos en párrafos reales |
| Imagen | Imagen | Revisa el texto alternativo de cada una |
| Botón | Botones | Un estilo de botón del sistema, no colores por botón |
| Lista de iconos | Lista | Los iconos decorativos, por CSS |
| Espaciador | Nada | El espaciado lo pone el sistema; los espaciadores vacíos sobran |
| Divisor | Separador | |
| Acordeón, pestañas | Detalles o Acordeón | Las pestañas casi nunca hacen falta; el contenido visible posiciona y se lee mejor |
| Carrusel de imágenes | Galería | Un carrusel automático es un problema de accesibilidad y de INP |
| Testimonio | Cita | Con nombre real y permiso de la persona citada |
| Contadores, barras de progreso | Texto | Sin animación; la cifra se lee igual |
| Formulario de Elementor Pro | Plugin de formularios | Revisa casillas de consentimiento, textos y eventos de analítica |

## Contenido: lo que se copia y lo que se revisa

El agente puede trasladar el texto existente con fidelidad. Lo que no debe hacer sin aprobación es **reescribirlo**. Si durante la reconstrucción detecta textos desfasados, cifras dudosas o afirmaciones que ya no son ciertas, las marca en su informe y la persona decide. Las decisiones de contenido y de marca no se delegan (véase [11](11-que-no-delegar-en-la-ia.md)).

Lo mismo vale para los encabezados. Una reconstrucción es buena ocasión para ordenar la jerarquía (un solo H1, H2 por sección, H3 dentro), pero cambiar el texto de un encabezado puede afectar al posicionamiento. Se propone, no se impone.

## Comprobaciones por página

Antes de dar una página por terminada:

1. Se abre en el editor sin avisos de bloque no válido.
2. Todos los textos, imágenes y botones se pueden editar desde el editor visual.
3. No hay bloques de HTML personalizado con maquetación dentro.
4. El título SEO, la metadescripción y la canónica siguen como estaban (o como se decidió cambiarlos).
5. Los enlaces internos funcionan.
6. Las capturas a 1440 y 390 px se han revisado a ojo (véase [`scripts/capturas.js`](../scripts/capturas.js)).
7. axe-core no devuelve infracciones (véase [`scripts/axe-wcag.js`](../scripts/axe-wcag.js)).

Instrucción de ejemplo para reconstruir una página: [prompts/03-reconstruir-pagina.md](../prompts/03-reconstruir-pagina.md).

---

Anterior: [03. Sistema de diseño](03-sistema-de-diseno.md) · Siguiente: [05. Plantillas con GeneratePress](05-plantillas-generatepress.md)
