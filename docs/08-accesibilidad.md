# 08. Accesibilidad

Una migración es el mejor momento para corregir la accesibilidad, porque se rehace todo el marcado. También es el mejor momento para empeorarla sin darte cuenta, por la misma razón. En nachomg.com el objetivo fue WCAG 2.2 nivel AA, comprobado con axe-core a 1440 y 390 px con Playwright, más revisión manual.

## El objetivo: WCAG 2.2 AA

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) es la versión vigente de las pautas del W3C. Respecto a la 2.1, añade varios criterios; los de nivel AA que más afectan a una migración son:

- [2.4.11 Foco no oculto (mínimo)](https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum): cuando un componente recibe el foco del teclado, no puede quedar totalmente oculto por contenido del autor. Cabeceras fijas y banners de cookies son los sospechosos habituales.
- [2.5.8 Tamaño del objetivo (mínimo)](https://www.w3.org/TR/WCAG22/#target-size-minimum): los objetivos de puntero miden al menos 24 × 24 píxeles CSS, con excepciones por espaciado, enlaces dentro de un texto, control equivalente, control del navegador o presentación esencial.
- [3.3.8 Autenticación accesible (mínimo)](https://www.w3.org/TR/WCAG22/#accessible-authentication-minimum): relevante si la web tiene áreas con acceso de usuarios.

Y siguen vigentes los de siempre que una reconstrucción toca de lleno: contraste de texto ([1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum), 4,5:1), contraste de componentes ([1.4.11](https://www.w3.org/TR/WCAG22/#non-text-contrast), 3:1), foco visible ([2.4.7](https://www.w3.org/TR/WCAG22/#focus-visible)), reajuste del contenido sin desplazamiento horizontal a 320 píxeles CSS de ancho ([1.4.10](https://www.w3.org/TR/WCAG22/#reflow)), información y relaciones ([1.3.1](https://www.w3.org/TR/WCAG22/#info-and-relationships)) y nombre, función y valor ([4.1.2](https://www.w3.org/TR/WCAG22/#name-role-value)).

Este repositorio es una guía práctica; si tu web está sujeta a obligaciones legales de accesibilidad, consulta la normativa aplicable con quien corresponda.

## Lo que mejora al pasar a bloques

- **Encabezados que son encabezados**. En los maquetadores visuales abundan títulos convertidos en `div` o jerarquías elegidas por tamaño de letra. El bloque Encabezado genera `<h2>`, `<h3>`, etc., y la vista de lista del editor muestra la jerarquía.
- **Menos envoltorios**. Un DOM más pequeño facilita la navegación con lectores de pantalla y reduce la probabilidad de anidamientos sin sentido.
- **Listas reales**. Las «listas de iconos» pasan a ser `<ul>` con elementos `<li>`.

## Lo que puede empeorar

- **Botones que son enlaces y enlaces que son botones**. Un botón que lleva a otra página es un enlace; uno que abre un menú o envía un formulario es un botón. El bloque Botones genera enlaces; si necesitas un botón de acción, no lo simules.
- **Textos alternativos perdidos** al volver a insertar imágenes.
- **Contraste**: los colores del sistema nuevo deben comprobarse en cada combinación real, incluidos los estados de hover y foco.
- **Componentes interactivos propios** (acordeones, pestañas, menús) escritos a mano sin gestión de teclado ni ARIA. Usa los bloques del núcleo (Detalles, Acordeón) o los del tema, que ya lo resuelven.
- **Avisos de cookies inyectados por JavaScript**, que a menudo traen sus propios problemas de foco, contraste y orden de tabulación. Ajustarlos obliga a subir la especificidad del CSS (véase [10](10-trampas-conocidas.md)).

## Comprobación automática con axe-core

[axe-core](https://github.com/dequelabs/axe-core) es un motor de pruebas de accesibilidad de código abierto. Su propia documentación advierte de que detecta **de media un 57 % de los problemas de WCAG** de forma automática, y que devuelve como «incompletos» los elementos en los que no puede estar seguro y hace falta revisión manual. Dicho de otro modo: cero infracciones en axe es una condición necesaria, no una prueba de accesibilidad.

El script [`scripts/axe-wcag.js`](../scripts/axe-wcag.js) carga cada URL con Playwright en Chromium, en los anchos que indiques (por defecto 1440 y 390 px), inyecta axe-core y ejecuta las reglas de las etiquetas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` y `wcag22aa`:

```bash
cd scripts && npm install && npx playwright install chromium
node axe-wcag.js --archivo ../urls.txt --anchos 1440,390,320 --salida informe-axe.json
```

Añadir 320 px permite revisar el reajuste de contenido (1.4.10). El informe JSON separa infracciones e incompletos, con los selectores de los elementos afectados. Devuelve código de salida 1 si hay infracciones, así que puede integrarse en una comprobación automática.

Un apunte sobre el ancho: axe evalúa la página tal como se ve en ese ancho. Un menú que solo aparece en móvil, o un contraste que cambia con una media query, solo se comprueba si pasas ese ancho. Por eso conviene, como mínimo, uno de escritorio y uno de móvil.

## Revisión manual imprescindible

Lo que axe no puede juzgar y alguien tiene que comprobar:

1. **Teclado**: recorrer cada plantilla con Tab y Mayús+Tab. El foco se ve siempre, sigue un orden lógico, no queda atrapado y no se esconde bajo la cabecera fija.
2. **Saltar al contenido**: el primer Tab muestra el enlace y funciona.
3. **Menú móvil**: se abre y se cierra con teclado, anuncia su estado, y al cerrarse el foco vuelve al botón.
4. **Formularios**: cada campo tiene etiqueta visible, los errores se anuncian y se entienden, las casillas de consentimiento se pueden marcar con teclado.
5. **Lector de pantalla**: una pasada por la portada y una entrada con un lector de pantalla (NVDA, VoiceOver o TalkBack), revisando encabezados, enlaces y textos alternativos.
6. **Zoom**: al 200 % y al 400 % el contenido se reajusta sin pérdida.
7. **Textos alternativos**: describen la función de la imagen en su contexto. El agente detecta las imágenes sin texto alternativo y las lista; los escribe una persona, porque es contenido publicado y porque un texto alternativo inventado es peor que uno vacío en una imagen decorativa.

## Reparto con el agente

El agente es muy bueno pasando axe a cien URL, agrupando las infracciones por regla y proponiendo correcciones de CSS o de marcado. También puede revisar el contraste de toda la paleta y detectar imágenes sin texto alternativo. La navegación con teclado, la prueba con lector de pantalla y el juicio sobre si un texto alternativo es adecuado son trabajo de una persona. Si alguien de tu equipo usa tecnologías de apoyo a diario, su opinión vale más que cualquier informe.

---

Anterior: [07. Rendimiento y caché](07-rendimiento-y-cache.md) · Siguiente: [09. Verificación](09-verificacion.md)
