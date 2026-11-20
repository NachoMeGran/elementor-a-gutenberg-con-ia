# Instrucción: reconstruir una página con bloques

Capítulo relacionado: [docs/04-reconstruccion-con-bloques.md](../docs/04-reconstruccion-con-bloques.md)

```text
OBJETIVO
Reconstruir la página [título, ID, URL] con bloques del núcleo de WordPress,
de modo que su dueño pueda editar cualquier texto, imagen o botón desde el
editor visual. El resultado debe quedar en un borrador para mi revisión.

CONTEXTO
- Sistema de diseño: clases y tokens documentados en [enlace o archivo].
  Rejilla: clase .rejilla en un Grupo, hijos con .col-4, .col-6, etc.
- Tema clásico (GeneratePress, sin theme.json): los Grupos reciben el
  envoltorio .wp-block-group__inner-container; el CSS del sistema ya lo
  resuelve con display:contents para .rejilla.
- La decisión para esta URL es: [reconstruir | reconstruir y mejorar].

PERMISOS
- Puedes leer la página original y su _elementor_data.
- Puedes crear un borrador nuevo o escribir en el borrador [ID] con
  operaciones por bloque (wp_update_post_blocks).
- Puedes usar wp_replace_in_post solo para cambios de texto, nunca de
  estructura.
- Requiere mi aprobación: publicar, sustituir la página original, cambiar
  el slug, cambiar metadatos SEO.
- No uses bloques de HTML personalizado para maquetar.

RESTRICCIONES
- Traslada los textos con fidelidad. Si ves erratas, datos desfasados o
  afirmaciones dudosas, no las cambies: anótalas en el informe.
- Conserva la jerarquía de encabezados del original salvo errores evidentes
  (por ejemplo, dos H1), que también anotas.
- Usa solo colores, tamaños y espacios del sistema de diseño. Si algo no
  encaja en el sistema, dímelo en lugar de crear valores nuevos.
- No añadas animaciones, carruseles automáticos ni pestañas.
- Conserva el texto alternativo de las imágenes. Si falta, anótalo en el
  informe; no lo redactes ni en la página ni en el informe.
- No escribas textos nuevos ni generes imágenes: solo trasladas lo que ya
  existe.

PASOS
1. Lee la página original (estructura y contenido) y resume sus secciones.
2. Propón la estructura en bloques, sección por sección, antes de escribir.
   Espera mi confirmación si la estructura cambia respecto al original.
3. Construye el borrador sección a sección con operaciones por bloque.
4. Tras cada sección, vuelve a leer los bloques y confirma que la estructura
   es la esperada.

VERIFICACIÓN
- Lee el borrador completo con wp_get_post_blocks y confirma que no hay
  bloques core/html con maquetación.
- Genera un enlace de vista previa del borrador.
- Indícame que debo abrir el borrador en el editor para confirmar que no hay
  avisos de bloque no válido: esa comprobación no la puedes hacer tú.

INFORME
- Enlace de vista previa e ID del borrador.
- Tabla de correspondencias: sección original -> bloques usados.
- Lista de anotaciones de contenido (erratas, datos dudosos, alt pendientes).
- Hecho y verificado / hecho sin verificar / no hecho.
```

Después, la persona responsable abre el borrador en el editor, revisa capturas a 1440 y 390 px, pasa axe-core y decide si se publica.
