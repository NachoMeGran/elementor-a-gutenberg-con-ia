# 00. Principios: la IA ejecuta y propone; la persona decide

Esta guía describe una migración técnica, pero empieza por las reglas de trabajo porque son las que evitan los desastres. Un agente de IA conectado a WordPress puede leer, escribir, borrar y purgar en segundos. Esa velocidad es útil cuando el trabajo está bien acotado y peligrosa cuando no lo está.

La regla que guía todo lo demás cabe en una línea: **la IA ejecuta y propone; la persona decide, revisa y responde**. Responder significa asumir las consecuencias ante clientes, lectores y buscadores. Un modelo no puede hacerlo, así que la decisión no puede ser suya.

## Lo que dice el propio protocolo

El Model Context Protocol (MCP) no es neutral en esto. La especificación vigente ([versión 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)) establece, en el apartado de herramientas, que «por confianza, seguridad y protección, **debería** haber siempre una persona en el bucle con capacidad de denegar invocaciones de herramientas», y recomienda a las aplicaciones mostrar qué herramientas se exponen al modelo, indicar con claridad cuándo se invocan y pedir confirmación para las operaciones.

En la [página general de la especificación](https://modelcontextprotocol.io/specification/2026-07-28), el apartado de seguridad añade tres principios que conviene tener presentes:

- **Consentimiento y control del usuario**: quien usa el sistema debe consentir y entender los accesos y operaciones, y conservar el control sobre lo que se comparte y lo que se hace.
- **Seguridad de las herramientas**: las herramientas equivalen a ejecución de código arbitrario. Las descripciones de su comportamiento (las anotaciones) se consideran no fiables salvo que procedan de un servidor de confianza.
- **Privacidad de los datos**: no se exponen ni se transmiten datos sin consentimiento explícito.

La especificación también pide a los servidores que validen las entradas, controlen el acceso y **limiten la frecuencia** de las invocaciones, y a los clientes que registren el uso de herramientas para auditoría. Si el servidor MCP de tu WordPress no hace nada de esto, el problema no es la IA.

## Cinco principios operativos

### 1. Humano en el bucle, de verdad

No basta con que alguien pulse «aprobar» sin leer. En la práctica, humano en el bucle significa:

- El plan de cada fase lo aprueba una persona antes de que empiece la ejecución.
- Las acciones sensibles (publicar, borrar, redirigir, cambiar ajustes globales, activar o desactivar plugins) requieren aprobación explícita en el momento.
- El resultado de cada cambio visible lo revisa una persona en la web publicada, no en el informe del agente.

En el caso real, el servidor MCP pedía aprobación humana para las acciones sensibles, y cada escritura pasaba por los permisos de WordPress del usuario que había autorizado la conexión.

### 2. Reversibilidad

Antes de tocar nada, debe estar claro cómo se deshace. En WordPress eso se traduce en:

- Copia de seguridad completa (archivos y base de datos) antes de empezar y antes de cada fase grande.
- Revisiones activadas en entradas y páginas, para poder volver atrás bloque a bloque.
- Un historial de cambios del servidor MCP que permita ver el estado anterior de cada escritura y restaurarlo.
- Cambios pequeños y frecuentes en lugar de grandes reescrituras: un cambio pequeño se revierte sin daños colaterales.

Una regla práctica: si no sabes cómo deshacer una acción, todavía no estás en condiciones de pedírsela al agente.

### 3. Trazabilidad

Cada cambio debe poder responder a cuatro preguntas: qué se cambió, quién lo pidió, quién lo aprobó y cómo se verificó. Para eso sirven tres registros complementarios:

- El **registro de auditoría** del servidor MCP (qué herramienta se llamó, con qué parámetros, con qué resultado).
- El **historial de cambios** con el estado anterior y posterior.
- Un **diario de migración** escrito por la persona responsable, con las decisiones y sus motivos. El agente no lo redacta: recopila los datos que lo alimentan (cambios aplicados con su identificador, resultados de pruebas, enlaces a capturas) y la persona lo escribe.

### 4. Mínimos privilegios

El agente debe tener los permisos justos para la fase en curso, ni uno más:

- Durante la auditoría, solo lectura.
- Durante la reconstrucción, escritura en contenido, sin acceso a usuarios, plugins ni ajustes globales.
- Las herramientas destructivas (borrado de contenido, de medios, de usuarios; desinstalación de plugins) desactivadas salvo necesidad concreta y temporal.
- Nunca credenciales en la conversación: ni contraseñas, ni claves de API, ni tokens. La conexión se autoriza por el flujo previsto por el servidor MCP; Easy MCP AI, por ejemplo, usa OAuth 2.1 y permisos por token ([ficha en WordPress.org](https://wordpress.org/plugins/easy-mcp-ai/)).

Los servidores MCP para WordPress suelen permitir elegir qué herramientas se exponen y con qué permisos. Úsalo. Que el agente pueda hacer algo no significa que deba poder hacerlo hoy.

### 5. Transparencia

Hacia dentro, la persona responsable debe saber en todo momento qué ha hecho el agente y qué no ha verificado. El agente entrega datos y evidencias; los informes que se firman, se entregan a un cliente o se archivan los escribe la persona. Hacia fuera, si la IA ha intervenido de forma relevante en un trabajo que entregas a un cliente o publicas, dilo. No hace falta un aviso en cada página; sí ser honesto cuando alguien pregunta cómo se hizo.

Hay una transparencia que se olvida a menudo: la del propio agente sobre sus límites. Un buen informe distingue entre «hecho y verificado», «hecho sin verificar» y «no hecho». Exígela en cada instrucción (véase [prompts/](../prompts/)).

## Por qué importa en una migración

Una migración de maquetador toca a la vez contenido, diseño, SEO, rendimiento, accesibilidad y aspectos legales (avisos de cookies, textos legales, formularios). Cada uno de esos frentes tiene consecuencias para personas concretas: quien no puede usar un formulario con teclado, quien pierde una página que posicionaba, quien recibe un aviso de cookies que ya no funciona. La IA acelera el trabajo mecánico; la responsabilidad sobre esas consecuencias no se delega.

Mi forma de verlo es tratar al agente como a un colaborador técnico muy rápido y sin contexto de negocio: excelente para inventariar, reescribir marcado, comprobar y recopilar datos; inútil para decidir qué se queda, qué se borra o qué dice la marca. Por eso no escribe los contenidos de la web, no genera sus imágenes y no redacta el diario ni los informes finales. El capítulo [11. Qué no delegar en la IA](11-que-no-delegar-en-la-ia.md) concreta esa frontera.

---

Siguiente: [01. Auditoría previa](01-auditoria-previa.md)
