# 07. Rendimiento y caché

Al migrar comprobé que buena parte de mis ajustes de caché, minificación y carga diferida solo servían para compensar lo que añadía el maquetador. Eran parches para un problema que yo mismo había instalado. Este capítulo trata de dos cosas: retirar los restos de Elementor que siguen pesando cuando Elementor ya no está, y revisar la configuración de caché para que trabaje a favor de la web nueva y no contra ella.

## Lo que pesa hoy nachomg.com

El 10 de noviembre de 2026 descargué con curl tres páginas públicas (portada, una guía larga y un artículo) con todos sus CSS y JavaScript, pidiendo compresión como haría un navegador. Lo cuento con detalle en [Elementor vs Gutenberg](https://nachomg.com/elementor-vs-gutenberg/):

| Concepto | Resultado medido |
|---|---|
| HTML de cada página (Brotli) | 48–53 KB (161–167 KB sin comprimir) |
| Hojas de estilo externas | 6–7 archivos, unos 9 KB comprimidos |
| JavaScript propio (tema, GenerateBlocks, LiteSpeed) | 6–7 archivos, unos 47 KB comprimidos |
| Etiqueta de Google (Site Kit) | 162 KB comprimidos, un solo archivo |
| Tiempo hasta el primer byte | 0,6–0,9 s sin caché; 0,15–0,27 s con caché |
| Referencias a Elementor en el HTML | Cero |

Como referencia del otro lado, los archivos básicos de front-end del paquete oficial de Elementor 4.4.0 suman unos 74 KB con gzip (JavaScript principal, jQuery y hoja de estilos base) antes de colocar un solo widget. Es una orientación, no una comparación exacta: no conservé mediciones equivalentes de mi web antigua.

La conclusión práctica: con el tema y GenerateBlocks bien configurados, lo más pesado de la web pasa a ser la analítica. Por eso conviene medir por archivo, no solo la puntuación global.

## Retirar los restos de Elementor

Con Elementor ya desactivado, mi web seguía cargando restos de su CSS: estilos que no se aplicaban a nada y que el navegador descargaba igualmente. Dónde buscar:

- **CSS personalizado** del personalizador o del tema hijo que usa variables `--e-global-color-*` y `--e-global-typography-*`. Sin Elementor, esas variables no están definidas y las reglas que dependen de ellas no hacen nada útil.
- **Archivos generados** en `wp-content/uploads/elementor/css/`, que alguna configuración de caché o de CSS combinado puede seguir referenciando.
- **CSS crítico y CSS no usado generados** por el plugin de caché cuando la web aún tenía la maquetación de Elementor. En LiteSpeed Cache, el CSS crítico (CCSS) y el CSS único por página (UCSS) se generan en segundo plano; si se generaron con la web antigua, describen una página que ya no existe. Hay que purgarlos y dejar que se regeneren.
- **Plugins satélite**: paquetes de widgets para Elementor, extensiones de formularios, plugins de plantillas. Se desactivan después de comprobar que ninguna página los usa.
- **Opciones y metadatos** (`_elementor_data` y compañía). No pesan en la parte pública. Su limpieza puede esperar y es una decisión de la persona responsable, con copia de seguridad.

El script [`scripts/restos-elementor.js`](../scripts/restos-elementor.js) descarga el HTML publicado y todos los CSS y JS que enlaza (incluidos los que LiteSpeed convierte en recursos `data:` en línea) y busca variables `--e-global-*`, clases de marcado de Elementor, archivos de `uploads/elementor/` y recursos del propio plugin:

```bash
node scripts/restos-elementor.js https://tu-dominio.com/ https://tu-dominio.com/blog/
```

Si una página habla de Elementor en su texto (como esta guía), el script lo señala solo como aviso: no confunde una mención con un resto.

## Revisar LiteSpeed Cache

Los nombres de los ajustes que cito corresponden a LiteSpeed Cache 7.9.3 ([WordPress.org](https://wordpress.org/plugins/litespeed-cache/)), comprobados en el código del plugin.

### Qué revisar

- **CSS Minify / CSS Combine** y **JS Minify / JS Combine**: con mucho menos código, combinar aporta poco y complica la depuración. Minificar sigue siendo razonable.
- **Load JS Deferred** (modos diferido y retrasado): útil, pero cada script que deba ejecutarse pronto (consentimiento de cookies, el menú móvil si no es del tema) tiene que quedar excluido.
- **Load CSS Asynchronously**, **Generate UCSS** y el CSS crítico: si los activaste para domar a Elementor, valora si siguen compensando. Cuando se mantengan, purga lo generado con la web antigua.
- **Exclusiones**: hay dos listas distintas, **JS Excludes** (excluye de minificar y combinar) y **JS Deferred / Delayed Excludes** (excluye del aplazamiento). Además, el plugin respeta los atributos `data-no-optimize="1"` y `data-no-defer="1"` en la propia etiqueta `<script>`.

### La trampa de las exclusiones por nombre

En el caso real, un script excluido del aplazamiento por su nombre de archivo seguía aplazándose. La causa: la minificación generaba un archivo con otro nombre y la exclusión dejaba de coincidir. La solución fue excluirlo **también de la minificación** (JS Excludes). La lógica concreta depende de la versión y de qué combinación de minificar, combinar y aplazar tengas activa, así que la regla útil es otra: **verifica en el HTML publicado**, no en el panel. Un script aplazado o retrasado por LiteSpeed aparece reescrito (por ejemplo, con `type="litespeed/javascript"` y `data-src` en modo retrasado). Si el script que excluiste aparece así, la exclusión no está funcionando. Lo detallo en [10. Trampas conocidas](10-trampas-conocidas.md#4-las-exclusiones-de-litespeed-por-nombre-dejan-de-coincidir).

## Purgar y volver a medir

Después de limpiar restos o cambiar la configuración:

1. Purga toda la caché (página, CSS y JS optimizados, CSS crítico y UCSS).
2. Espera a que se regenere lo que se genera en segundo plano.
3. Visita las páginas de la muestra como visitante anónimo (sesión privada, sin estar identificado).
4. Vuelve a medir con el mismo método que en la [auditoría previa](01-auditoria-previa.md).

Si mides antes de purgar, acabarás juzgando la migración con datos contaminados.

### Purgas desde el agente

Dos detalles prácticos del caso real:

- Las purgas tienen **límites de frecuencia**. Un agente que purga después de cada pequeño cambio acaba bloqueado justo cuando necesita la purga importante. Agrupa cambios y purga al final de cada lote. La especificación de MCP pide a los servidores que limiten la frecuencia de invocación de herramientas ([MCP, herramientas, consideraciones de seguridad](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)), así que conviene contar con ese límite al planificar.
- La orden de WP-CLI de LiteSpeed (`wp litespeed-purge all`) es un comando añadido por un plugin, y algunos servidores MCP no ejecutan comandos de WP-CLI añadidos por plugins. En ese caso, usa la herramienta de purga del propio servidor (en Easy MCP AI, `wp_clear_cache`).

## Analítica: la siguiente dieta

En mi caso, la etiqueta de Google que inserta Site Kit pesa más de tres veces todo el JavaScript propio del tema. No es un problema de Gutenberg ni de Elementor, pero la migración lo deja a la vista. Revisa qué etiquetas cargas, si se cargan solo tras el consentimiento y si todas aportan algo que alguien consulte.

---

Anterior: [06. SEO y redirecciones](06-seo-y-redirecciones.md) · Siguiente: [08. Accesibilidad](08-accesibilidad.md)
