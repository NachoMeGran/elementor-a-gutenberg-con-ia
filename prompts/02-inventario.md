# Instrucción: inventario y propuesta de plan

Capítulo relacionado: [docs/02-inventario-y-plan.md](../docs/02-inventario-y-plan.md)

```text
OBJETIVO
Preparar el inventario de todo el contenido construido con Elementor y una
propuesta de decisión por URL (reconstruir, reconstruir y mejorar, fusionar,
retirar) para que yo la revise. No ejecutes ninguna decisión.

CONTEXTO
- La auditoría previa está en [documento].
- La exportación de Search Console (12 meses, por página) está en [archivo].

PERMISOS
- Solo lectura. Puedes usar WP-CLI de lectura, por ejemplo:
  wp post list --post_type=any --meta_key=_elementor_edit_mode
    --meta_value=builder --fields=ID,post_type,post_status,post_name,post_title
    --format=csv
  wp post list --post_type=elementor_library --fields=ID,post_title,post_status
    --format=csv

RESTRICCIONES
- La columna «decisión» es una propuesta. Para cualquier URL con clics en los
  últimos 12 meses, la propuesta por defecto es «reconstruir» salvo que
  argumentes otra cosa con datos.
- No propongas cambios de URL salvo en fusiones, y en ese caso indica el
  destino de la redirección 301.
- No propongas retirar contenido con enlaces entrantes conocidos sin
  señalarlo de forma explícita.

PASOS
1. Lista de contenidos con _elementor_edit_mode = builder, incluidas
   plantillas de elementor_library.
2. Cruce con Search Console: clics, impresiones, posición media.
3. Complejidad estimada de reconstrucción (baja/media/alta) según el número
   de secciones y widgets en _elementor_data. Explica el criterio.
4. Detección de secciones repetidas entre páginas, candidatas a patrón.
5. Propuesta de decisión por URL, con una frase de justificación.
6. Propuesta de orden de trabajo por fases.

VERIFICACIÓN
- Comprueba que el número de filas del inventario coincide con el total de
  contenidos detectados en el paso 1 y explica cualquier diferencia.

INFORME
- Hoja (CSV) con columnas: ID, tipo, slug, título, estado, clics_12m,
  impresiones_12m, complejidad, decision_propuesta, justificacion,
  destino_301.
- Lista de secciones candidatas a patrón.
- Propuesta de fases con criterio de vuelta atrás para cada una.
- «No he podido comprobar», con motivos.
```

La persona responsable revisa la hoja fila a fila en todas las URL con tráfico y marca la decisión definitiva. Esa hoja aprobada es la que rige las fases siguientes.
