# 09. Verificación

Un agente de IA puede informar de que un cambio se ha hecho correctamente porque la herramienta devolvió «éxito». Eso significa que la escritura en la base de datos funcionó, no que la página se vea bien, se pueda usar con teclado o siga posicionando. Verificar es comprobar el resultado donde lo verán las personas: en la web publicada, sin caché, en varios anchos.

Ningún cambio visible se da por terminado sin verificación visual. Es una de las líneas que no se delegan.

## Tres niveles de verificación

### 1. Por cambio

Después de cada escritura, el agente comprueba lo mínimo:

- Vuelve a leer la entrada o el bloque modificado y confirma que contiene lo esperado.
- Si el cambio es estructural, comprueba que la estructura de bloques es coherente (bloques abiertos y cerrados, atributos válidos).
- Anota el identificador del cambio en el historial, para poder revertirlo.

### 2. Por página

Antes de dar una página por terminada:

- **Editor**: se abre sin avisos de bloque no válido y todo es editable (véase [04](04-reconstruccion-con-bloques.md)).
- **Capturas** a 1440 y 390 px, revisadas a ojo por una persona. El script [`scripts/capturas.js`](../scripts/capturas.js) genera capturas de página completa con nombres estables (`dominio--ruta--ancho.png`), de modo que dos carpetas, «antes» y «después», se comparan archivo a archivo.
- **axe-core** sin infracciones en ambos anchos y revisión de los incompletos ([08](08-accesibilidad.md)).
- **SEO**: título, metadescripción, canónica, indexación y H1 como se decidió ([06](06-seo-y-redirecciones.md)).
- **Enlaces**: los internos funcionan, los botones llevan a donde deben.

### 3. Por fase y al final

- **Caché purgada** y comprobación en la web publicada como visitante anónimo.
- **Restos de Elementor**: [`scripts/restos-elementor.js`](../scripts/restos-elementor.js) sobre la muestra de URL, sin hallazgos.
- **Redirecciones**: [`scripts/redirecciones.js`](../scripts/redirecciones.js) sobre el mapa completo, sin fallos.
- **Rendimiento**: medición con el mismo método que en la auditoría previa.
- **Rastreo completo** con una herramienta de rastreo, comparado con el inicial.
- **Formularios y analítica**: envío real de cada formulario y comprobación de que el evento llega a la herramienta de analítica.
- **Banner de consentimiento**: los scripts que dependen del consentimiento no se cargan antes de aceptarlo.

## Las capturas no son opcionales

Hay errores que solo se ven con los ojos: una imagen recortada en móvil, un texto blanco sobre un fondo que no cargó, una columna que se desborda a 390 px, un banner de cookies que tapa el botón principal. axe no los detecta y el agente, si no mira capturas, tampoco.

Dos recomendaciones:

- **Revisa las capturas tú**, aunque el agente también las mire. El agente puede describir lo que ve y señalar diferencias; la valoración de si algo «se ve bien» para tu marca es tuya.
- **Desactiva las animaciones** al capturar (el script lo hace con `prefers-reduced-motion` y la opción de Playwright para animaciones) y recorre la página antes, para que las imágenes con carga diferida aparezcan.

## Verificar en la web publicada

En el caso real, el cierre consistió en purgar la caché y comprobar las páginas en la web publicada, con capturas y axe-core a 1440 y 390 px. Hay tres motivos para no conformarse con la vista previa:

1. La caché de página puede servir una versión antigua.
2. Las optimizaciones de CSS y JavaScript (minificación, aplazamiento, CSS crítico) solo se aplican a la versión pública, y son una fuente habitual de errores que en la vista previa no aparecen.
3. Los plugins que inyectan contenido por JavaScript (avisos de cookies, chats, widgets de terceros) se comportan distinto con sesión iniciada.

## Seguimiento posterior

La verificación no acaba el día de la publicación:

- **Primera semana**: Monitor 404 de Rank Math y errores de cobertura en Search Console a diario.
- **Primer mes**: clics e impresiones por URL comparados con el mismo periodo anterior; atención especial a las URL críticas del inventario.
- **A partir de las cuatro semanas**: Core Web Vitals de campo. Antes no hay datos suficientes, porque Search Console los agrega en periodos de 28 días.

## El informe de verificación

Cada fase se cierra con un informe breve que **escribe la persona responsable**. El agente no lo redacta: recopila los datos y las evidencias (tablas por URL, salidas de axe, rutas de capturas, códigos HTTP) en el formato de [prompts/05-verificacion.md](../prompts/05-verificacion.md), y la persona los revisa, los interpreta y escribe el informe. El informe debe distinguir tres categorías sin mezclarlas:

- **Hecho y verificado**, con la evidencia (captura, resultado de axe, respuesta HTTP).
- **Hecho sin verificar**, con el motivo.
- **No hecho**, con el motivo.

Si todo aparece como «hecho» y no hay ni una evidencia, desconfía de los datos. Lo mismo vale para el diario de migración ([00](00-principios.md#3-trazabilidad)): lo escribe la persona a partir de lo que el agente ha recopilado.

---

Anterior: [08. Accesibilidad](08-accesibilidad.md) · Siguiente: [10. Trampas conocidas](10-trampas-conocidas.md)
