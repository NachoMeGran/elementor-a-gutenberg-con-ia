# Instrucción: verificación de una fase

Capítulo relacionado: [docs/09-verificacion.md](../docs/09-verificacion.md)

```text
OBJETIVO
Verificar el resultado de la fase [nombre] en la web publicada y entregar un
informe con evidencias, separando lo verificado de lo que no lo está.

CONTEXTO
- URL afectadas en esta fase: [lista].
- Capturas «antes» en [carpeta]; resultados de axe «antes» en [archivo].
- Mapa de redirecciones aprobado: [archivo CSV], si aplica.

PERMISOS
- Lectura de contenido, bloques, metadatos SEO y redirecciones.
- Puedes purgar la caché una vez al inicio de la verificación.
- No corrijas nada durante la verificación: anota y propón.

PASOS
1. Purga la caché y espera a que se regenere lo que se genera en segundo
   plano.
2. Para cada URL: estado HTTP, título SEO, metadescripción, canónica, robots,
   H1. Compara con los valores decididos.
3. Comprueba que ningún contenido de la fase contiene bloques core/html con
   maquetación.
4. Si hay terminal disponible, ejecuta:
   node scripts/axe-wcag.js --archivo urls.txt --anchos 1440,390
   node scripts/capturas.js --archivo urls.txt --carpeta capturas/despues
   node scripts/restos-elementor.js --archivo urls.txt
   node scripts/redirecciones.js mapa.csv
   Si no la hay, indícame qué debo ejecutar yo.
5. Compara capturas antes/después y describe diferencias visibles, sin
   juzgar si son aceptables.

VERIFICACIÓN
- Cada afirmación del informe lleva su evidencia: salida de la herramienta,
  ruta de la captura o código HTTP.

INFORME
- Tabla por URL: HTTP, SEO correcto (sí/no y qué cambia), axe 1440, axe 390,
  restos Elementor, diferencias visuales.
- Infracciones de axe agrupadas por regla, con propuesta de corrección.
- Lista de lo que debe revisar una persona: incompletos de axe, capturas,
  navegación con teclado, formularios, banner de cookies.
- Hecho y verificado / hecho sin verificar / no hecho.
```
