# De Elementor a Gutenberg con IA

Guía abierta, práctica y actualizable para migrar una web WordPress de Elementor a bloques nativos de Gutenberg con la ayuda de un agente de IA conectado por MCP (Model Context Protocol), sin renunciar al criterio humano.

Está basada en un caso real: la migración de [nachomg.com](https://nachomg.com/) en 2026, de Elementor a GeneratePress 3.6 con GP Premium, GenerateBlocks 2.x y su versión Pro, sobre WordPress 7.1, con Rank Math y LiteSpeed Cache. Las cifras de rendimiento, las decisiones y los precios de ese proceso están en la entrada [Elementor vs Gutenberg (2026): lo que aprendí al migrar mi web a GeneratePress](https://nachomg.com/elementor-vs-gutenberg/). Este repositorio recoge el método.

## El principio rector

**La IA ejecuta y propone; la persona decide, revisa y responde.**

Un agente conectado a WordPress puede inventariar, reescribir marcado, pasar pruebas y documentar en una fracción del tiempo que llevaría a mano. Lo que no puede es responder ante clientes, lectores y buscadores por lo que se publica, se borra o se redirige. Esta guía separa con claridad las dos cosas en cada fase. Es un caso técnico, pero el fondo es el uso moral de la IA: velocidad para lo mecánico y responsabilidad humana para lo que tiene consecuencias.

## Para quién es

- Responsables de webs WordPress hechas con Elementor que quieren pasar a bloques nativos.
- Consultoras, agencias y profesionales independientes que van a usar agentes de IA en trabajos para clientes y quieren un método defendible.
- Equipos que ya usan un servidor MCP con WordPress y buscan pautas de trabajo seguras.

Se asume familiaridad con WordPress y algo de CSS. No hace falta saber programar para seguir la guía; sí para adaptar los scripts.

## Índice

| Capítulo | Contenido |
|---|---|
| [00. Principios](docs/00-principios.md) | Humano en el bucle, reversibilidad, trazabilidad, mínimos privilegios, transparencia. Qué dice la especificación de MCP. |
| [01. Auditoría previa](docs/01-auditoria-previa.md) | Rendimiento, SEO, analítica, legal, accesibilidad e inventario técnico antes de tocar nada. |
| [02. Inventario y plan](docs/02-inventario-y-plan.md) | Dónde guarda Elementor el contenido, inventario con WP-CLI, decisión por URL y orden de trabajo. |
| [03. Sistema de diseño](docs/03-sistema-de-diseno.md) | Tokens, rejilla de 12 columnas, tipografías autoalojadas, foco visible, carga en el editor. |
| [04. Reconstrucción con bloques](docs/04-reconstruccion-con-bloques.md) | Bloques del núcleo editables por el dueño, validación de bloques, operaciones por bloque, equivalencias. |
| [05. Plantillas con GeneratePress](docs/05-plantillas-generatepress.md) | Elements: cabecera, pie, entrada, blog y archivos; reglas de visualización. |
| [06. SEO y redirecciones](docs/06-seo-y-redirecciones.md) | Mismas URL, redirecciones con Rank Math, metadatos, enlaces internos, seguimiento. |
| [07. Rendimiento y caché](docs/07-rendimiento-y-cache.md) | Cifras medidas, restos de Elementor, revisión de LiteSpeed Cache, purgas. |
| [08. Accesibilidad](docs/08-accesibilidad.md) | WCAG 2.2 AA, axe-core a 1440 y 390 px, revisión manual. |
| [09. Verificación](docs/09-verificacion.md) | Por cambio, por página y por fase; capturas; web publicada; informe honesto. |
| [10. Trampas conocidas](docs/10-trampas-conocidas.md) | Las que aparecieron en el caso real, con causa y solución. |
| [11. Qué no delegar en la IA](docs/11-que-no-delegar-en-la-ia.md) | Marca y contenido, textos legales, borrados y redirecciones, publicación, credenciales. |

Material de trabajo:

- [Checklist imprimible](checklists/migracion.md), con quién hace cada tarea (agente, persona o ambos).
- [Instrucciones de ejemplo para el agente](prompts/README.md): auditoría, inventario, reconstrucción de una página, limpieza y verificación.
- [Scripts de verificación](scripts/README.md) en Node.js con Playwright: axe-core en varios anchos, capturas, restos de Elementor y mapa de redirecciones. Probados.
- [Fragmentos de código](snippets/README.md): arreglo de rejillas en temas clásicos, esqueleto de sistema de diseño, estilos en el editor y fragmentos PHP que no se desactivan al guardar.

## Cómo usarla

1. Lee [00. Principios](docs/00-principios.md) y [11. Qué no delegar](docs/11-que-no-delegar-en-la-ia.md). Son cortos y condicionan todo lo demás.
2. Imprime o copia la [checklist](checklists/migracion.md) y asigna responsables.
3. Sigue los capítulos 01 a 09 en orden. Cada fase tiene su instrucción de ejemplo en [prompts/](prompts/).
4. Usa los [scripts](scripts/) para medir antes y después con el mismo método.
5. Ten a mano [10. Trampas conocidas](docs/10-trampas-conocidas.md).

La guía usa como referencia la pila del caso real. Si tu tema destino es otro (un tema de bloques con `theme.json`, por ejemplo), la mayor parte del método sirve igual, y algunas trampas, como la del envoltorio interno del Grupo, no te afectarán.

## Estado y versión

Versión 1.0.0, del 20 de noviembre de 2026. Versiones de referencia comprobadas en WordPress.org en esa fecha:

| Software | Versión |
|---|---|
| WordPress | 7.1 (rama vigente; última 7.1.5) |
| GeneratePress | 3.6.1 |
| GenerateBlocks | 2.5.1 |
| Elementor | 4.4.1 |
| LiteSpeed Cache | 7.9.3 |
| Rank Math SEO | 1.0.282 |
| Code Snippets | 4.1.0 |
| Easy MCP AI | 2.5.0 |
| Especificación MCP | 2026-07-28 |

El software cambia rápido. Si algo ha dejado de ser cierto, abre una incidencia. Los cambios se registran en [CHANGELOG.md](CHANGELOG.md).

## Sobre el caso real

En la migración de nachomg.com, un agente de IA trabajó conectado a WordPress mediante el plugin [Easy MCP AI](https://wordpress.org/plugins/easy-mcp-ai/), que convierte la propia web en un servidor MCP. Cada escritura pasaba por los permisos de WordPress y quedaba registrada en un historial de cambios con auditoría, y las acciones sensibles pedían aprobación humana. El proceso siguió el orden de esta guía: auditoría, sistema de diseño propio cargado también en el editor, reconstrucción de portada y páginas con bloques del núcleo, plantillas con Elements de GeneratePress, retirada de restos de Elementor, accesibilidad comprobada con axe-core a 1440 y 390 px, verificación visual y comprobación en la web publicada con la caché purgada.

El resultado medido, el balance de lo que se gana y lo que se pierde al dejar Elementor y los precios están en [la entrada del blog](https://nachomg.com/elementor-vs-gutenberg/). Si te planteas una migración así y quieres una segunda opinión, puedes ver cómo trabajo como [consultor de marketing digital](https://nachomg.com/consultor-de-marketing-freelance-en-barcelona/).

## Contribuir

Las incidencias y las propuestas de cambio son bienvenidas, sobre todo trampas nuevas documentadas con su causa, correcciones de datos que hayan cambiado y mejoras de los scripts con sus pruebas. Criterios en [CONTRIBUTING.md](CONTRIBUTING.md).

## Autoría

[Nacho Menéndez Granda](https://nachomg.com/nacho-menendez/) (Nacho MG), consultor de marketing digital en Barcelona. Escribo sobre marketing, tecnología y cultura en [nachomg.com](https://nachomg.com/) y en la newsletter quincenal [Life on marketing](https://nachomg.com/life-on-marketing/).

Este repositorio se ha preparado con asistencia de IA y aplicando la misma regla que defiende: la IA redactó y probó, y la revisión y la responsabilidad del contenido son mías.

## Cómo citar

Hay un archivo [CITATION.cff](CITATION.cff) que GitHub muestra como «Cite this repository». En texto:

> Menéndez Granda, N. (2026). *De Elementor a Gutenberg con IA: guía práctica de migración con agentes MCP y criterio humano* (versión 1.0.0). https://github.com/NachoMeGran/elementor-a-gutenberg-con-ia

## Licencias

Este repositorio combina dos licencias:

| Contenido | Licencia |
|---|---|
| Textos y documentación: `README.md`, `docs/`, `checklists/`, `prompts/` y demás archivos Markdown | [CC BY 4.0](LICENSE) |
| Código: `scripts/` y `snippets/` | [MIT](LICENSE-MIT) |

Puedes reutilizar y adaptar los textos citando la autoría y enlazando a este repositorio. El código puedes usarlo en proyectos propios y comerciales conservando el aviso de copyright.

Los nombres de productos citados (WordPress, Elementor, GeneratePress, GenerateBlocks, LiteSpeed, Rank Math, Code Snippets, Easy MCP AI y otros) pertenecen a sus titulares. Esta guía no tiene relación comercial con ninguno de ellos.
