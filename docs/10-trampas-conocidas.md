# 10. Trampas conocidas

Las trampas 1 a 8 aparecieron de verdad en la migración de nachomg.com; aquí van con su causa y la solución que funcionó. Las dos últimas no llegaron a ocurrir, pero son riesgos previsibles cuando un agente trabaja con borradores y plantillas, y las incluyo para que no te ocurran a ti. Donde he podido, he comprobado la causa en el código fuente del software implicado; donde no, lo indico. Si encuentras otras, abre una incidencia (véase [CONTRIBUTING.md](../CONTRIBUTING.md)).

## 1. El envoltorio interno del Grupo rompe las rejillas

**Síntoma**: declaras `display: grid` (o `flex`) en un bloque Grupo con una clase propia, defines doce columnas, y todos los hijos se apilan en la primera columna.

**Causa**: en los temas clásicos, WordPress envuelve el contenido del Grupo en un `<div class="wp-block-group__inner-container">`. Lo hace la función `wp_restore_group_inner_container` ([`wp-includes/block-supports/layout.php`](https://github.com/WordPress/wordpress-develop/blob/trunk/src/wp-includes/block-supports/layout.php)), que no actúa si el tema tiene `theme.json` ni si el Grupo usa un layout de tipo `flex` o `grid`. GeneratePress 3.6.1 no incluye `theme.json` (lo he comprobado en el paquete del tema), así que el envoltorio aparece. Tu rejilla tiene un único hijo: el envoltorio.

**Solución**: que el envoltorio no genere caja, con `display: contents`, acotado a los grupos que lo necesitan mediante una clase:

```css
.wp-block-group.rejilla > .wp-block-group__inner-container {
	display: contents;
}
```

El CSS completo está en [`snippets/css/contenedor-interno-grupo.css`](../snippets/css/contenedor-interno-grupo.css), y la prueba automatizada del repositorio comprueba con Playwright que, sin el arreglo, tres columnas se apilan y, con él, quedan en la misma fila.

**Alternativa**: usar las variantes Fila, Pila o Cuadrícula del Grupo, que aplican un layout `flex` o `grid` y no reciben el envoltorio. Es la opción sin CSS, aunque te da menos control que una rejilla de 12 columnas propia.

**Precaución**: aplica `display: contents` solo a envoltorios `div` sin significado, como este. En elementos con semántica (botones, listas, encabezados) puede afectar a cómo los interpretan las tecnologías de apoyo.

## 2. La especificidad de los estilos de botón del tema

**Síntoma**: defines el estilo de botón del sistema y algunos botones lo ignoran, o lo respetan en la web y no en el editor.

**Causa**: el tema y el núcleo aplican sus propios estilos a `.wp-block-button__link` y `.wp-element-button`, a veces con selectores más específicos que los tuyos, y el editor añade sus propios envoltorios.

**Solución**: subir la especificidad de forma controlada (por ejemplo, anteponiendo la clase de la sección o usando `:where()` para bajar la del tema cuando lo controlas tú), nunca con `!important` generalizado. Comprueba el botón en la web, en el editor y en sus estados de hover y foco.

## 3. Plugins que inyectan su CSS por JavaScript

**Síntoma**: el banner de cookies (u otro widget) no respeta tus estilos, aunque el selector es correcto.

**Causa**: algunos plugins inyectan su hoja de estilos mediante JavaScript después de cargar la página, de modo que su CSS llega más tarde que el tuyo y gana a igual especificidad.

**Solución**: subir la especificidad de tus reglas para ese componente (por ejemplo, prefijando con el identificador del contenedor del banner). Documenta por qué esas reglas son más específicas de lo normal, o alguien las «limpiará» más adelante. Y revisa el banner con axe y con teclado: es un componente que suele fallar en foco y contraste.

## 4. Las exclusiones de LiteSpeed por nombre dejan de coincidir

**Síntoma**: excluyes un script del aplazamiento en «JS Deferred / Delayed Excludes» por su nombre de archivo y sigue cargándose aplazado.

**Causa observada en el caso real**: LiteSpeed minificaba el script y servía un archivo con otro nombre; la exclusión por nombre dejaba de coincidir con lo que se acababa aplazando. He revisado el código de LiteSpeed Cache 7.9.3: según la combinación de minificar, combinar y aplazar que tengas activa, las exclusiones se evalúan en momentos distintos, así que el comportamiento exacto depende de la versión y la configuración.

**Solución que funcionó**: excluir el script **también** de la minificación, en «JS Excludes». Otra vía es añadir `data-no-optimize="1"` o `data-no-defer="1"` a la etiqueta `<script>`, atributos que el plugin respeta.

**Verificación**: mira el HTML publicado, no el panel. En modo retrasado, un script que LiteSpeed ha procesado aparece con `type="litespeed/javascript"` y `data-src`. Si el script que excluiste aparece así, la exclusión no funciona.

## 5. Code Snippets desactiva un fragmento al guardarlo

**Síntoma**: editas un fragmento PHP que funcionaba, lo guardas, y deja de funcionar. Está desactivado.

**Causa** (comprobada en el código de Code Snippets 4.1.0): al guardar un fragmento activo, el plugin lo valida y, si encuentra un error, lo desactiva. El validador compara los nombres de función que declara el fragmento con todas las funciones ya definidas en ese momento. Si el fragmento ya está cargado, sus propias funciones existen, y el validador puede informar de «Cannot redeclare function».

**Solución**: envolver cada declaración en `if ( ! function_exists( 'nombre' ) )`, patrón que el validador reconoce, o usar funciones anónimas. Ejemplo en [`snippets/php/snippet-con-guardas.php`](../snippets/php/snippet-con-guardas.php). Y, sobre todo, **comprobar después de cada guardado que el fragmento sigue activo**. Si lo guarda un agente, esa comprobación forma parte de su tarea.

## 6. Herramientas MCP que rechazan cambios estructurales en reemplazos de texto

**Síntoma**: el agente intenta añadir una sección con una herramienta de buscar y reemplazar y el servidor rechaza el cambio.

**Causa**: el servidor protege la estructura de bloques. Un reemplazo de texto que abre o cierra bloques o etiquetas puede dejar la página en un estado que el editor no sabe reconstruir.

**Solución**: usar las operaciones por bloque del servidor (insertar, sustituir, mover, borrar bloques) para cualquier cambio de estructura, y reservar los reemplazos para texto. No intentes sortear ese rechazo con trucos: está para eso. Véase [04](04-reconstruccion-con-bloques.md).

## 7. Límites de frecuencia en las purgas de caché

**Síntoma**: el agente purga la caché y el servidor responde que se ha superado el límite.

**Causa**: las purgas están limitadas para evitar abusos y sobrecarga. La especificación de MCP pide a los servidores que limiten la frecuencia de invocación de herramientas.

**Solución**: agrupar cambios y purgar una vez por lote. Planifica el trabajo del agente en lotes con una purga y una verificación al final de cada uno, no una purga por cambio.

## 8. Restos de Elementor tras desactivarlo

**Síntoma**: Elementor está desactivado, pero el HTML o el CSS siguen conteniendo `--e-global-*`, clases `elementor-*` o referencias a `uploads/elementor/`.

**Causa**: CSS personalizado que usaba las variables globales del kit, CSS crítico generado con la maquetación antigua, archivos combinados en caché.

**Solución**: localizar con [`scripts/restos-elementor.js`](../scripts/restos-elementor.js), retirar el CSS huérfano, purgar CSS crítico y UCSS y volver a comprobar. Véase [07](07-rendimiento-y-cache.md).

## Riesgos previsibles

### 9. Metadatos SEO que se quedan en el borrador

**Síntoma posible**: tras sustituir una página por su versión reconstruida, el título SEO o la metadescripción han vuelto a los valores por defecto.

**Causa probable**: la página nueva se construyó como entrada distinta y los metadatos de Rank Math se quedaron en la antigua.

**Solución**: reconstruir sobre la misma entrada siempre que sea posible. Si no, copiar los metadatos antes del intercambio y comprobarlos después. Véase [06](06-seo-y-redirecciones.md).

### 10. Plantillas que muestran datos de una sola entrada

**Síntoma posible**: todas las entradas muestran el mismo título o la misma fecha en la cabecera.

**Causa probable**: la plantilla se construye a partir de una entrada concreta y el agente copia sus datos como texto fijo en lugar de usar etiquetas dinámicas.

**Solución**: etiquetas dinámicas para todo dato que dependa de la entrada, y comprobación en al menos tres entradas distintas. Véase [05](05-plantillas-generatepress.md).

---

Anterior: [09. Verificación](09-verificacion.md) · Siguiente: [11. Qué no delegar en la IA](11-que-no-delegar-en-la-ia.md)
