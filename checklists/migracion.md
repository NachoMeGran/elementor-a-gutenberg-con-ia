# Checklist de migración de Elementor a Gutenberg con IA

Versión imprimible. Cada casilla indica entre corchetes quién la hace: **[IA]** el agente, **[P]** una persona, **[IA→P]** el agente prepara y la persona decide o revisa. Las explicaciones están en [docs/](../docs/).

Web: ______________________ · Responsable: ______________________ · Inicio: ____/____/______

## 0. Antes de empezar

- [ ] [P] Copia de seguridad completa (archivos y base de datos) y prueba de que se puede restaurar.
- [ ] [P] Servidor MCP configurado con permisos mínimos: solo lectura para la auditoría.
- [ ] [P] Herramientas destructivas desactivadas o sujetas a aprobación.
- [ ] [P] Registro de auditoría e historial de cambios del servidor MCP activados.
- [ ] [P] Ninguna credencial en conversaciones, instrucciones ni archivos del agente.
- [ ] [P] Diario de migración abierto (decisiones, motivos, fechas).

## 1. Auditoría previa ([01](../docs/01-auditoria-previa.md))

- [ ] [P] Muestra representativa de URL elegida.
- [ ] [IA] Inventario técnico: WordPress, PHP, tema, plugins y dependencias de Elementor.
- [ ] [IA] Ajustes de caché y optimización documentados.
- [ ] [IA→P] Peso por archivo y TTFB con y sin caché de la muestra, con fecha.
- [ ] [P] Core Web Vitals de campo (Search Console) anotadas.
- [ ] [IA→P] SEO por URL: título, metadescripción, canónica, robots, H1.
- [ ] [P] Exportación de Search Console de 12 meses por página.
- [ ] [IA] axe-core a 1440 y 390 px sobre la muestra (informe guardado).
- [ ] [IA] Capturas «antes» a 1440 y 390 px.
- [ ] [P] Navegación con teclado de las plantillas principales.
- [ ] [IA→P] Textos legales y banner de consentimiento localizados (sin reescribir).
- [ ] [IA→P] Analítica: etiquetas, eventos y conversiones documentados.

## 2. Inventario y plan ([02](../docs/02-inventario-y-plan.md))

- [ ] [IA] Listado de contenidos con `_elementor_edit_mode = builder` y plantillas `elementor_library`.
- [ ] [IA] Cruce con Search Console.
- [ ] [IA→P] Decisión por URL (reconstruir, mejorar, fusionar, retirar) aprobada fila a fila en las URL con tráfico.
- [ ] [IA→P] Mapa de redirecciones para fusiones y retiradas aprobado.
- [ ] [P] Plan por fases con criterio de vuelta atrás.

## 3. Sistema de diseño ([03](../docs/03-sistema-de-diseno.md))

- [ ] [P] Decisiones de marca: paleta, tipografías, tono visual.
- [ ] [IA] Tokens de color, tipografía, espaciado y medidas.
- [ ] [IA→P] Tabla de contraste de todas las combinaciones de texto y fondo (≥ 4,5:1; ≥ 3:1 en texto grande).
- [ ] [IA] Rejilla de 12 columnas con arreglo del contenedor interno del Grupo.
- [ ] [IA] Tipografías autoalojadas en WOFF2 con `font-display: swap`; sin Google Fonts residual.
- [ ] [IA] Foco visible único, objetivos de al menos 24 × 24 px, `prefers-reduced-motion`.
- [ ] [IA] Sistema cargado también en el editor.
- [ ] [P] Comprobado: editor y web se ven igual.

## 4. Plantillas con GeneratePress ([05](../docs/05-plantillas-generatepress.md))

- [ ] [IA→P] Layout Elements por tipo de contenido.
- [ ] [IA→P] Site Header con enlace «Saltar al contenido» y menú accesible.
- [ ] [IA→P] Site Footer.
- [ ] [IA→P] Plantilla de entrada con etiquetas dinámicas (probada en 3 entradas).
- [ ] [IA→P] Plantilla de blog y archivos con Loop Template y Archive Navigation.
- [ ] [P] Reglas de visualización revisadas, sin solapamientos.
- [ ] [P] Plantillas del constructor de temas de Elementor desactivadas una a una, comprobando el relevo.

## 5. Reconstrucción de páginas ([04](../docs/04-reconstruccion-con-bloques.md))

Por cada página:

- [ ] [IA] Construida en borrador con bloques del núcleo, sin HTML personalizado.
- [ ] [IA] Operaciones por bloque para cambios de estructura.
- [ ] [P] Abierta en el editor sin avisos de bloque no válido.
- [ ] [P] Todo editable desde el editor visual.
- [ ] [IA→P] Anotaciones de contenido revisadas (erratas, datos dudosos, textos alternativos que faltan); lo que haya que escribir lo escribe una persona.
- [ ] [P] Ningún texto ni imagen de la página generado con IA.
- [ ] [P] Capturas a 1440 y 390 px revisadas.
- [ ] [IA] axe-core sin infracciones en ambos anchos.
- [ ] [IA→P] Metadatos SEO conservados.
- [ ] [P] Publicación o sustitución aprobada.

## 6. SEO y redirecciones ([06](../docs/06-seo-y-redirecciones.md))

- [ ] [IA] Redirecciones del mapa creadas (301 o 410).
- [ ] [IA] `scripts/redirecciones.js` sin fallos.
- [ ] [IA] Sin cadenas ni bucles de redirección.
- [ ] [IA→P] Enlaces internos revisados antes y después.
- [ ] [IA] Sitemap sin páginas de prueba ni plantillas.
- [ ] [P] Rastreo completo comparado con el inicial.

## 7. Rendimiento y caché ([07](../docs/07-rendimiento-y-cache.md))

- [ ] [IA] `scripts/restos-elementor.js` sin hallazgos en la muestra.
- [ ] [IA→P] CSS con `--e-global-*` retirado.
- [ ] [IA→P] Plugins satélite de Elementor desactivados.
- [ ] [IA→P] Ajustes de LiteSpeed revisados; exclusiones de JS comprobadas en el HTML publicado.
- [ ] [IA] CSS crítico y UCSS antiguos purgados.
- [ ] [IA] Caché purgada (una vez por lote).
- [ ] [P] Medición repetida con el mismo método que en la auditoría.
- [ ] [P] Elementor y Elementor Pro desactivados cuando ninguna página dependa de ellos.

## 8. Accesibilidad ([08](../docs/08-accesibilidad.md))

- [ ] [IA] axe-core a 1440, 390 y 320 px sobre todas las plantillas.
- [ ] [P] Incompletos de axe revisados.
- [ ] [P] Teclado: foco visible, orden lógico, sin trampas, no tapado por la cabecera.
- [ ] [P] Menú móvil con teclado.
- [ ] [P] Formularios: etiquetas, errores, consentimiento.
- [ ] [P] Pasada con lector de pantalla por portada y una entrada.
- [ ] [P] Zoom al 200 % y 400 %.
- [ ] [P] Banner de cookies: foco, contraste, no tapa contenido enfocado.

## 9. Verificación final ([09](../docs/09-verificacion.md))

- [ ] [IA→P] Datos y evidencias recopilados por el agente; informe final escrito por la persona, con «hecho y verificado», «hecho sin verificar» y «no hecho».
- [ ] [P] Formularios enviados de verdad y eventos de analítica recibidos.
- [ ] [P] Scripts dependientes del consentimiento no se cargan antes de aceptar.
- [ ] [P] Textos legales revisados por quien corresponda.

## 10. Seguimiento

- [ ] [IA→P] Semana 1: Monitor 404 y cobertura en Search Console a diario.
- [ ] [IA→P] Mes 1: clics e impresiones por URL frente al periodo anterior.
- [ ] [P] Semana 4 en adelante: Core Web Vitals de campo.
- [ ] [P] Decisión sobre el borrado definitivo de datos de Elementor, con copia reciente.
- [ ] [P] Diario de migración cerrado (lo escribe la persona; el agente solo aporta datos).

Cierre: ____/____/______ · Firma: ______________________
