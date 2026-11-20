# 03. Sistema de diseño en CSS

Elementor te deja elegir un color, un margen y un tamaño de letra en cada widget. Esa libertad es cómoda el primer día y una pesadilla el día cien, cuando hay catorce azules casi iguales repartidos por la web. La migración es la ocasión de sustituir esa colección de decisiones sueltas por un sistema: pocas piezas, con nombre, que se reutilizan.

En nachomg.com el sistema de diseño es CSS propio, sin framework: tokens en variables, una rejilla de 12 columnas, tipografías autoalojadas y un foco visible coherente. Y se carga también en el editor, para que quien escribe vea lo mismo que quien lee.

## Qué decide la persona y qué hace el agente

Las decisiones de marca (paleta, familias tipográficas, tono visual, densidad) son de la persona o del equipo de diseño. El agente es muy útil para lo que viene después: convertir esas decisiones en tokens, comprobar contrastes, generar la escala tipográfica, detectar valores sueltos que deberían ser tokens y escribir el CSS con una convención de nombres consistente.

## Las piezas

### 1. Tokens

Variables CSS en `:root` con nombre semántico, no descriptivo: `--color-acento` envejece mejor que `--azul-oscuro`. Como mínimo:

- **Color**: texto, fondo, acento, texto sobre acento, bordes, estado de foco, estados de error y éxito.
- **Tipografía**: familias, escala de tamaños (mejor fluida, con `clamp()`), alturas de línea.
- **Espaciado**: una escala corta (cuatro o cinco pasos) que se use en márgenes, rellenos y huecos.
- **Medidas**: ancho máximo de contenido, radio de bordes.

Cada pareja de color de texto y fondo debe cumplir el contraste de [WCAG 2.2, criterio 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum): 4,5:1 para texto normal y 3:1 para texto grande. Pide al agente una tabla con el contraste de cada combinación que se vaya a usar, y descarta las que no lleguen antes de que aparezcan en una página.

### 2. Rejilla de 12 columnas

Una rejilla de 12 columnas con CSS Grid permite mitades, tercios, cuartos y combinaciones asimétricas con las mismas reglas. La clave es que la rejilla se aplique a bloques nativos (el Grupo de WordPress o el Element de GenerateBlocks) mediante clases, sin HTML personalizado.

Aquí aparece la primera trampa del tema clásico: el envoltorio `wp-block-group__inner-container`, que rompe las rejillas declaradas en el Grupo. Está explicado, con su solución probada, en [10. Trampas conocidas](10-trampas-conocidas.md#1-el-envoltorio-interno-del-grupo-rompe-las-rejillas), y el CSS está en [`snippets/css/contenedor-interno-grupo.css`](../snippets/css/contenedor-interno-grupo.css).

### 3. Tipografía autoalojada

Servir las fuentes desde tu propio dominio evita una conexión a terceros en cada visita y la consiguiente transferencia de la IP del visitante a ese tercero. Pasos:

- Descarga las fuentes en WOFF2 con una licencia que permita autoalojarlas.
- Usa fuentes variables si la familia las tiene: un archivo cubre varios pesos.
- Declara `font-display: swap` para que el texto se vea mientras la fuente carga.
- Precarga solo la fuente del texto principal, no todas.
- Elimina cualquier carga residual de Google Fonts que hicieran Elementor o el tema. GeneratePress tiene su propia gestión de Google Fonts en el personalizador; si autoalojas, comprueba que no queda ninguna activada.

### 4. Foco visible y objetivos táctiles

El foco visible es un requisito de nivel AA ([2.4.7](https://www.w3.org/TR/WCAG22/#focus-visible)), y WCAG 2.2 añadió dos criterios AA que afectan directamente al diseño:

- [2.4.11 Foco no oculto (mínimo)](https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum): el elemento con foco no puede quedar totalmente tapado por contenido del autor, como una cabecera fija o un banner de cookies. `scroll-padding-top` en `html` ayuda con las cabeceras fijas.
- [2.5.8 Tamaño del objetivo (mínimo)](https://www.w3.org/TR/WCAG22/#target-size-minimum): los objetivos de puntero miden al menos 24 × 24 píxeles CSS, salvo excepciones (espaciado suficiente, enlaces dentro de un texto, control equivalente, etc.).

Define un único estilo de foco en el sistema (`:focus-visible`, con contorno y desplazamiento) y no lo sobrescribas página a página.

### 5. Movimiento reducido

Respeta `prefers-reduced-motion`. Los efectos de entrada que tanto abundan en las webs hechas con maquetadores visuales son un problema para personas con trastornos vestibulares y, además, castigan el INP.

## Cargar el sistema en el editor

Si el editor no carga el mismo CSS que la parte pública, quien edita trabaja a ciegas: ve márgenes, colores y rejillas distintos de los publicados, y acaba «corrigiendo» lo que no está roto.

En WordPress 7.1 el editor de entradas se carga siempre en un iframe, como ya ocurría con el editor del sitio ([Block Editor Handbook](https://github.com/WordPress/gutenberg/blob/trunk/docs/how-to-guides/enqueueing-assets-in-the-editor.md)). Eso significa que el CSS de la parte pública no llega solo al editor: hay que declararlo. La vía recomendada para un tema es `add_editor_style()`, que WordPress prefija con `.editor-styles-wrapper` para que los estilos no afecten a la interfaz del editor. El fragmento [`snippets/php/estilos-en-editor.php`](../snippets/php/estilos-en-editor.php) hace las dos cargas (parte pública y editor) desde un tema hijo.

Comprueba el resultado abriendo una página en el editor y en la web, una al lado de la otra. Si la rejilla funciona en la web y no en el editor, revisa los selectores: en el editor hay envoltorios distintos alrededor de cada bloque.

## Un esqueleto de partida

[`snippets/css/tokens.css`](../snippets/css/tokens.css) es un punto de partida con tokens, tipografía autoalojada, foco visible, tamaño mínimo de botones y movimiento reducido. Los valores son de ejemplo: sustitúyelos por las decisiones de tu marca.

## Errores que conviene evitar

- **Traducir el kit de Elementor tal cual**. Si el kit tenía doce colores globales y solo se usaban cuatro, el sistema nuevo tiene cuatro.
- **Clases de utilidad para todo**. Una clase por propiedad (`.mt-24`, `.texto-azul`) reproduce el problema de Elementor con otra sintaxis. Mejor pocas clases de composición (`.rejilla`, `.tarjeta`, `.destacado`) y tokens para los valores.
- **Estilos en línea generados por bloques**. Los controles de color y espaciado de cada bloque escriben estilos en línea o clases sueltas. Úsalos con la paleta y la escala del sistema, no con valores libres.
- **No documentar**. Una página del propio WordPress (privada) o un archivo en el tema hijo con la lista de clases y tokens ahorra muchas preguntas a quien edite después.

---

Anterior: [02. Inventario y plan](02-inventario-y-plan.md) · Siguiente: [04. Reconstrucción con bloques](04-reconstruccion-con-bloques.md)
