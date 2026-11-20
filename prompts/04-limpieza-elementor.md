# Instrucción: limpieza de restos de Elementor

Capítulo relacionado: [docs/07-rendimiento-y-cache.md](../docs/07-rendimiento-y-cache.md)

```text
OBJETIVO
Localizar y retirar los restos de Elementor que siguen cargándose en la parte
pública después de reconstruir todas las páginas, y revisar la configuración
de caché para la web nueva.

CONTEXTO
- Todas las páginas del inventario están reconstruidas y verificadas.
- Elementor y Elementor Pro siguen [activos | desactivados].
- Resultado de scripts/restos-elementor.js sobre la muestra: [pegar salida].

PERMISOS
- Puedes leer CSS personalizado, ajustes del tema, ajustes de LiteSpeed y
  fragmentos de código.
- Puedes proponer cambios. Requieren mi aprobación: editar CSS
  personalizado, cambiar ajustes de LiteSpeed, desactivar plugins, purgar.
- No borres datos de Elementor (_elementor_data, plantillas, archivos en
  uploads/elementor). Eso lo decidiré más adelante.

RESTRICCIONES
- Agrupa las purgas: una al final del lote, no una por cambio. Las purgas
  tienen límite de frecuencia.
- Si usas WP-CLI, ten en cuenta que los comandos añadidos por plugins (como
  los de LiteSpeed) pueden no estar disponibles; usa wp_clear_cache.

PASOS
1. Busca en el CSS personalizado, el tema hijo y los fragmentos cualquier uso
   de --e-global-*, clases elementor-* o rutas uploads/elementor.
2. Lista los plugins que solo tienen sentido con Elementor.
3. Revisa en LiteSpeed: minificar y combinar CSS/JS, carga diferida de JS,
   CSS asíncrono, CSS crítico, UCSS y ambas listas de exclusiones.
4. Propón el lote de cambios con el motivo de cada uno y el modo de
   revertirlo.
5. Tras mi aprobación, aplica el lote, purga una vez y comprueba.

VERIFICACIÓN
- Comprueba en el HTML publicado (no en el panel) que los scripts excluidos
  del aplazamiento no aparecen reescritos por LiteSpeed (por ejemplo, con
  type="litespeed/javascript").
- Pide que se vuelva a ejecutar scripts/restos-elementor.js sobre la muestra
  y compara.

INFORME
- Lista de restos encontrados, con ubicación exacta.
- Cambios aplicados, con estado anterior y cómo revertir.
- Resultado de la verificación.
- Hecho y verificado / hecho sin verificar / no hecho.
```
