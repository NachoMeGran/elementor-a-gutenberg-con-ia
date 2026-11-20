# 11. Qué no delegar en la IA

Todo lo anterior describe tareas que un agente puede hacer bien, rápido y con trazabilidad. Este capítulo trata de lo contrario: las decisiones que no se le pasan, aunque técnicamente pueda ejecutarlas. Hay decisiones cuyas consecuencias recaen en personas concretas, y quien las toma tiene que poder responder por ellas. Un modelo no puede.

La lista es corta a propósito: cinco líneas claras se respetan mejor que un reglamento. A ellas se suman dos que atraviesan toda la guía: el agente no genera los textos ni las imágenes de la web, y no redacta el diario de migración ni los informes finales; recopila los datos y la persona escribe.

## 1. Decisiones de marca y de contenido

Qué dice la web, cómo lo dice y qué se queda fuera son decisiones de la marca. El agente puede detectar incoherencias, señalar contenido desfasado o sugerir una estructura técnica. No escribe ni decide:

- El mensaje de la portada, los servicios que se ofrecen ni cómo se describen.
- La paleta, la tipografía o el tono visual.
- Qué testimonios, casos o cifras se publican. Un testimonio es la palabra de una persona real; una cifra comercial es un compromiso.
- Cambios de redacción en páginas que ya funcionan, «aprovechando» la migración.

**Cómo se hace en la práctica**: el agente traslada el contenido con fidelidad y deja en su informe una lista de observaciones (erratas, datos dudosos, textos alternativos que faltan). La persona decide y, si hay que escribir algo, lo escribe ella.

### Los textos y las imágenes de la web no se generan con IA

Es la línea más clara de esta guía: **ningún texto que se publique en la web ni ninguna imagen se generan con IA.** Eso incluye los textos de las páginas y entradas, los titulares y los botones, las metadescripciones y los títulos SEO, los textos alternativos, los pies de foto y las imágenes destacadas, ilustraciones o fondos.

Los motivos son dos. El primero es de responsabilidad: lo que dice la web lo firma la marca, y un texto generado es plausible, no necesariamente cierto. El segundo es ético: los modelos generativos de imagen se han alimentado de obra de autores que no dieron su consentimiento ni recibieron nada a cambio, y el contenido generado sin autoría ni criterio es *AI slop* que degrada la web y la confianza de quien la lee. Lo desarrollo en el repositorio [ia-responsable-en-marketing](https://github.com/NachoMeGran/ia-responsable-en-marketing).

En una migración, el agente traslada los textos y las imágenes que ya existen, sin cambiarlos. Si falta algo (un texto alternativo, una metadescripción, una imagen), lo anota; lo escribe o lo encarga una persona.

## 2. Textos legales sin revisión

Aviso legal, política de privacidad, política de cookies, condiciones de contratación, cláusulas informativas de formularios. Un modelo de lenguaje puede redactar algo que suene correcto y no lo sea para tu caso: otra base de legitimación, otro encargado del tratamiento, otro plazo. El agente puede:

- Localizar los textos legales y comprobar que siguen enlazados y accesibles tras la migración.
- Señalar incoherencias evidentes (un formulario que envía datos a un servicio que la política no menciona).
- Trasladar los textos existentes sin cambiarlos.

Lo que no hace es redactarlos o modificarlos y publicarlos sin la revisión de una persona con criterio jurídico. Esta guía tampoco es asesoramiento legal.

## 3. Borrar contenido o redirigir URL con tráfico sin datos

Borrar una página, fusionar dos o redirigir una URL que recibe visitas son decisiones con efectos difíciles de revertir: los enlaces externos, las posiciones y la confianza de quien llega se pierden antes de que nadie se dé cuenta. Requieren:

- Datos de Search Console de al menos los últimos 12 meses para esa URL.
- Una decisión explícita y registrada de la persona responsable.
- Copia de seguridad reciente.

El agente puede preparar la tabla con los datos y una propuesta razonada por fila. La decisión y la aprobación son humanas. Y el borrado definitivo de contenido, plantillas o medios se deja para cuando la migración esté verificada y haya pasado un tiempo prudencial.

## 4. Publicar sin verificación visual

Un «éxito» de la herramienta no es una página bien hecha. Nada visible se publica, ni se sustituye una página publicada, sin que una persona haya visto el resultado en escritorio y móvil (véase [09. Verificación](09-verificacion.md)). Esto incluye los cambios en cabecera, pie y plantillas, que afectan a todas las páginas a la vez.

## 5. Credenciales

Contraseñas, claves de API, tokens de acceso, datos de conexión a la base de datos o al servidor: nunca en la conversación con el agente, nunca en un archivo que el agente lea, nunca en el repositorio. La conexión entre el agente y WordPress se autoriza con el flujo previsto por el servidor MCP (Easy MCP AI, el servidor del caso real, usa OAuth 2.1 y permisos por token, [según su ficha en WordPress.org](https://wordpress.org/plugins/easy-mcp-ai/)), y las credenciales de terceros las configura una persona directamente en el servicio correspondiente.

Si un agente te pide una contraseña para «terminar la tarea», la respuesta es no. Busca otra vía o haz ese paso tú.

## Zonas grises

Hay tareas que no encajan del todo en ninguna categoría. El criterio que uso es preguntarme qué pasa si sale mal y quién lo nota primero, y si el resultado es un texto que se publica (en ese caso, lo escribe una persona):

| Tarea | Riesgo si sale mal | Criterio |
|---|---|---|
| Activar o desactivar plugins | Puede romper la web entera | Aprobación explícita en el momento, con copia previa |
| Cambiar ajustes globales del tema o de caché | Afecta a todas las páginas | Aprobación explícita; verificación en varias plantillas |
| Textos alternativos de imágenes | Descripciones inventadas o inexactas | El agente detecta las imágenes sin texto alternativo y las lista; la persona los escribe |
| Metadescripciones nuevas | Mensajes que no representan a la marca | El agente detecta las que faltan o están duplicadas; la persona las escribe |
| Corregir infracciones de axe | Cambios de diseño no deseados | El agente corrige las de marcado; las de color o diseño se aprueban |
| Purgar caché | Ninguno grave, salvo los límites de frecuencia | Delegable, agrupando cambios |

## Por qué esto también es eficiente

Podría parecer que todas estas comprobaciones frenan el trabajo. En mi experiencia es al revés: las horas que ahorra el agente en lo mecánico son las que permiten dedicar atención a lo que de verdad la necesita. Lo que no es eficiente es deshacer una redirección mal puesta tres meses después, cuando Search Console ya ha registrado la caída.

---

Anterior: [10. Trampas conocidas](10-trampas-conocidas.md) · Volver al [índice](../README.md#índice)
