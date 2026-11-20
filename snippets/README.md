# Fragmentos de código

Fragmentos pequeños, comentados y listos para adaptar. No son un tema ni un plugin: cópialos a tu tema hijo o a tu plugin de fragmentos después de leerlos.

| Archivo | Qué resuelve | Capítulo |
|---|---|---|
| [`css/contenedor-interno-grupo.css`](css/contenedor-interno-grupo.css) | Rejillas que se rompen por el envoltorio `.wp-block-group__inner-container` en temas clásicos. Incluye una rejilla de 12 columnas de ejemplo. Probado con Playwright (véase `scripts/test`). | [10](../docs/10-trampas-conocidas.md#1-el-envoltorio-interno-del-grupo-rompe-las-rejillas) |
| [`css/tokens.css`](css/tokens.css) | Esqueleto de sistema de diseño: tokens, fuente autoalojada, foco visible, tamaño mínimo de botones y movimiento reducido. Los valores son de ejemplo. | [03](../docs/03-sistema-de-diseno.md) |
| [`php/estilos-en-editor.php`](php/estilos-en-editor.php) | Carga el mismo CSS en la parte pública y en el editor de bloques desde un tema hijo. | [03](../docs/03-sistema-de-diseno.md#cargar-el-sistema-en-el-editor) |
| [`php/snippet-con-guardas.php`](php/snippet-con-guardas.php) | Patrón para que Code Snippets no desactive un fragmento al guardarlo. | [10](../docs/10-trampas-conocidas.md#5-code-snippets-desactiva-un-fragmento-al-guardarlo) |

Los archivos PHP pasan `php -l` sin errores. Si pegas un fragmento PHP en Code Snippets, puedes omitir la línea `<?php` inicial.

Licencia: MIT. Véase [LICENSE-MIT](../LICENSE-MIT).
