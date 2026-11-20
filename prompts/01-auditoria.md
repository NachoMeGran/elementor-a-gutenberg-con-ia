# Instrucción: auditoría previa

Capítulo relacionado: [docs/01-auditoria-previa.md](../docs/01-auditoria-previa.md)

```text
OBJETIVO
Elaborar una auditoría de partida de la web antes de migrar de Elementor a
Gutenberg, con cifras que permitan comparar después. Esta fase es solo de
lectura.

CONTEXTO
- Web en WordPress con Elementor y Elementor Pro. Destino: GeneratePress,
  GP Premium y GenerateBlocks. Caché: LiteSpeed Cache. SEO: Rank Math.
- Muestra representativa (la he elegido yo): [lista de 4 a 8 URL].
- Los datos de Search Console de 12 meses están en [archivo/hoja].

PERMISOS
- Puedes usar herramientas de lectura: contenido, bloques, ajustes, plugins,
  WP-CLI de solo lectura (list, get), Rank Math en lectura.
- No escribas, no actives ni desactives nada, no purgues caché.
- Si una tarea necesitara escribir, detente y pregunta.

RESTRICCIONES
- No inventes cifras. Si un dato no está disponible, escribe «no disponible»
  y explica por qué.
- No evalúes los textos legales en cuanto a su corrección jurídica: solo
  localízalos e indica dónde están y si los formularios los enlazan.

PASOS
1. Inventario técnico: versión de WordPress y PHP, tema y tema padre, plugins
   activos con versión, plugins que dependen de Elementor.
2. Configuración de LiteSpeed Cache relacionada con CSS y JS (minificar,
   combinar, aplazar, CSS crítico, UCSS, exclusiones).
3. Para cada URL de la muestra: título, metadescripción, canónica, robots,
   H1, número de encabezados por nivel, número de elementos HTML.
4. Fragmentos de código personalizados (tema hijo, plugin de fragmentos):
   qué hacen, en una línea cada uno.
5. Analítica: qué etiquetas se cargan y cómo; eventos configurados si puedes
   verlos.
6. Legal: dónde están aviso legal, privacidad y cookies; qué plugin gestiona
   el consentimiento.

VERIFICACIÓN
- Cada dato del informe debe proceder de una lectura que puedas citar
  (herramienta y parámetros). Indica la fuente junto a cada bloque de datos.

INFORME
- Tabla por URL con los datos del paso 3.
- Lista de plugins con una columna «depende de Elementor: sí/no/no sé».
- Lista de ajustes de caché que probablemente existen para compensar a
  Elementor, con tu razonamiento.
- Problemas detectados, priorizados (alto/medio/bajo), sin proponer todavía
  cambios de contenido.
- Apartado final «No he podido comprobar», con los motivos.
```

Fuera de la instrucción, la persona responsable hace en paralelo las mediciones de rendimiento por archivo, el pase de [`scripts/axe-wcag.js`](../scripts/axe-wcag.js) y las capturas «antes» con [`scripts/capturas.js`](../scripts/capturas.js), si el agente no tiene acceso a una terminal.
