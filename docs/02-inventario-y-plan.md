# 02. Inventario y plan

No hay botón mágico para pasar de Elementor a Gutenberg. Una página hecha con Elementor no se traslada: se reconstruye, porque su contenido no está donde WordPress espera encontrarlo. Este capítulo explica dónde está, cómo inventariarlo y en qué orden atacar la reconstrucción.

## Dónde guarda Elementor el contenido

Lo he comprobado en el código del plugin (Elementor 4.4.1, [WordPress.org](https://wordpress.org/plugins/elementor/)):

- La maquetación completa vive en el metadato **`_elementor_data`** de cada entrada o página, en JSON.
- El metadato **`_elementor_edit_mode`** con valor `builder` marca qué contenidos se editan con Elementor.
- En **`post_content`** Elementor guarda una versión simplificada del contenido, sin los `div` de la maquetación (función `save_plain_text`). Sirve como materia prima de los textos, no como maquetación.
- Los estilos generados se escriben como archivos en **`wp-content/uploads/elementor/css/`**.
- Los colores y tipografías globales del «kit» se exponen como variables CSS **`--e-global-color-*`** y **`--e-global-typography-*`**. Son las que suelen sobrevivir a la migración en forma de CSS huérfano (véase [10. Trampas conocidas](10-trampas-conocidas.md)).

Si desactivas Elementor sin reconstruir, lo que queda en pantalla es ese `post_content` simplificado: un esqueleto de texto sin diseño. Por eso conviene hacer el inventario con Elementor todavía activo.

## Inventario con WP-CLI

Estas órdenes son WP-CLI estándar y de solo lectura. Un agente con una herramienta tipo `wp_cli_run` puede ejecutarlas; también puedes hacerlo tú por SSH.

```bash
# Contenidos construidos con Elementor (cualquier tipo de contenido)
wp post list --post_type=any --meta_key=_elementor_edit_mode --meta_value=builder \
  --fields=ID,post_type,post_status,post_name,post_title --format=csv

# Plantillas de Elementor (cabeceras, pies, secciones guardadas)
wp post list --post_type=elementor_library --fields=ID,post_title,post_status --format=csv

# Plugins activos, para detectar dependencias del maquetador
wp plugin list --status=active --fields=name,version,update --format=csv

# Temas instalados y cuál está activo (o es padre del activo)
wp theme list --fields=name,status,version --format=csv
```

`wp post list` acepta argumentos de `WP_Query` como `--meta_key` y `--meta_value` ([documentación de WP-CLI](https://developer.wordpress.org/cli/commands/post/list/)).

Cruza ese listado con la exportación de Search Console de la fase anterior. El resultado es una hoja con una fila por URL y estas columnas: tipo, plantilla o maquetación propia, clics e impresiones de 12 meses, enlaces entrantes conocidos, complejidad estimada (baja, media, alta) y decisión.

## La columna «decisión»

Para cada URL hay cuatro opciones, y elegir entre ellas es trabajo de la persona responsable:

| Decisión | Cuándo | Qué implica |
|---|---|---|
| **Reconstruir** | La página tiene sentido y tráfico o valor de negocio | Misma URL, contenido revisado, maquetación en bloques |
| **Reconstruir y mejorar** | El contenido está desfasado | Misma URL; el texto lo revisa o reescribe una persona |
| **Fusionar** | Dos páginas compiten por lo mismo | Una URL sobrevive; la otra redirige con 301 (véase [06](06-seo-y-redirecciones.md)) |
| **Retirar** | Sin tráfico, sin enlaces, sin valor | 301 a la página más próxima o 410 si no hay equivalente; nunca sin mirar los datos |

El agente puede proponer una decisión por fila a partir de los datos. La persona la confirma o la cambia, fila a fila, en las URL con tráfico. Borrar o redirigir sin datos de Search Console es una de las cosas que no se delegan.

## Orden de trabajo

Este es el orden que seguí y que recomiendo:

1. **Sistema de diseño** (tokens, rejilla, tipografía, foco) cargado en la parte pública y en el editor. Sin esto, cada página se maqueta con valores sueltos y la coherencia se pierde a la tercera. Véase [03](03-sistema-de-diseno.md).
2. **Estructura global**: cabecera, pie y plantillas de entrada, blog y archivo, con los Elements de GeneratePress. Véase [05](05-plantillas-generatepress.md).
3. **Páginas con maquetación propia**: portada, servicios, sobre mí, contacto. Son las más laboriosas, porque cada sección hecha con widgets hay que pensarla de nuevo con bloques. Copiarla tal cual suele dar un calco torpe del original. Véase [04](04-reconstruccion-con-bloques.md).
4. **Entradas del blog**: suelen ser texto con imágenes y, si se escribieron con el editor de bloques o el clásico, a menudo no necesitan reconstrucción, solo revisión.
5. **Limpieza de restos de Elementor** y revisión de la caché. Véase [07](07-rendimiento-y-cache.md).
6. **Verificación completa** y seguimiento. Véase [09](09-verificacion.md).

## Entorno de trabajo

Lo prudente es trabajar en un entorno de pruebas y llevar los cambios a producción cuando estén verificados. Si trabajas directamente en producción, como hacen muchas webs pequeñas, el mínimo es:

- Copia de seguridad completa justo antes de empezar cada fase.
- Las páginas nuevas se construyen como borradores o en URL de trabajo no enlazadas, y se revisan con enlaces de vista previa antes de sustituir a las publicadas.
- Elementor sigue activo hasta que la última página que depende de él se ha reconstruido y verificado.

## Coste y licencias

El dinero no debería decidir la migración, pero hay que contarlo. Precios de tarifa en noviembre de 2026, según los recogí en [la entrada sobre Elementor vs Gutenberg](https://nachomg.com/elementor-vs-gutenberg/) (compruébalos, porque cambian sin aviso):

| Producto | Precio |
|---|---|
| Gutenberg, GeneratePress y GenerateBlocks (versiones gratuitas) | 0 € |
| GeneratePress One (GP Premium, GenerateBlocks Pro y extras) | 99 dólares al año, una web |
| Elementor (versión gratuita) | 0 € |
| Elementor Pro, plan Essential | unos 60 dólares al año, una web |

Los Elements de cabecera, pie y plantillas condicionales que uso en el capítulo 05 son de GP Premium. Para un blog o una web sencilla bastan el tema y GenerateBlocks gratuitos.

## Entregable de esta fase

Una hoja de inventario con decisión por URL, aprobada por la persona responsable, y un plan por fases con fechas, puntos de control y criterio de vuelta atrás para cada fase. Instrucción de ejemplo en [prompts/02-inventario.md](../prompts/02-inventario.md).

---

Anterior: [01. Auditoría previa](01-auditoria-previa.md) · Siguiente: [03. Sistema de diseño](03-sistema-de-diseno.md)
