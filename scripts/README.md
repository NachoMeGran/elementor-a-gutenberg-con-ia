# Scripts de verificación

Cuatro utilidades en Node.js con [Playwright](https://playwright.dev/) para comprobar una migración desde fuera, sobre la web publicada. Ninguna escribe en WordPress: solo hacen peticiones de lectura.

| Script | Qué hace | Código de salida |
|---|---|---|
| [`axe-wcag.js`](axe-wcag.js) | Pasa [axe-core](https://github.com/dequelabs/axe-core) a una lista de URL en varios anchos (por defecto 1440 y 390 px) con las reglas WCAG 2.0, 2.1 y 2.2 de niveles A y AA. Informe en consola y en JSON. | 0 sin infracciones, 1 con infracciones, 2 errores |
| [`capturas.js`](capturas.js) | Capturas de página completa por URL y ancho, con nombres estables para comparar «antes» y «después». | 0 correcto, 2 errores |
| [`restos-elementor.js`](restos-elementor.js) | Busca restos de Elementor en el HTML y en los CSS y JS enlazados (incluidos recursos `data:` en línea). | 0 limpio, 1 con restos, 2 errores |
| [`redirecciones.js`](redirecciones.js) | Comprueba un mapa CSV `origen,destino`: redirección 301/308 en un salto al destino exacto y destino con 200. | 0 correcto, 1 con fallos, 2 errores |

## Instalación

Requiere Node.js 18 o posterior.

```bash
cd scripts
npm install
npx playwright install chromium
```

## Uso

```bash
# Accesibilidad en escritorio, móvil y 320 px (reajuste, WCAG 1.4.10)
node axe-wcag.js --archivo urls.txt --anchos 1440,390,320 --salida informe-axe.json

# Capturas antes y después
node capturas.js --archivo urls.txt --carpeta capturas/antes
node capturas.js --archivo urls.txt --carpeta capturas/despues

# Restos de Elementor
node restos-elementor.js https://tu-dominio.com/ https://tu-dominio.com/blog/

# Mapa de redirecciones
node redirecciones.js mapa.csv
```

`urls.txt` lleva una URL por línea; las líneas que empiezan por `#` se ignoran. Opciones comunes:

- `--anchos 1440,390`: anchos de ventana en píxeles.
- `--espera 2000`: espera adicional tras la carga, por ejemplo para banners que aparecen con retraso.
- Variable `AXE_PATH`: ruta a un `axe.min.js` concreto si no quieres usar el del paquete instalado.
- Variable `PW_PROXY`: proxy HTTP para Chromium y para las peticiones, si tu red lo necesita.

## Pruebas

```bash
npm test
```

Levanta un servidor local con páginas de prueba (accesible, con errores, con restos de Elementor, con redirecciones 301, 302 y a un destino equivocado, y una rejilla con el envoltorio interno del Grupo) y comprueba que cada script detecta lo que debe. No necesita conexión a Internet. La última prueba carga [`../snippets/css/contenedor-interno-grupo.css`](../snippets/css/contenedor-interno-grupo.css) y verifica con Playwright que, sin el arreglo, tres columnas se apilan y, con él, quedan en la misma fila.

Probado el 20 de noviembre de 2026 con Node.js 22, Playwright 1.63 (Chromium 153) y axe-core 4.10.2 y 4.14.1: 21 de 21 comprobaciones superadas. Además, `axe-wcag.js`, `capturas.js` y `restos-elementor.js` se ejecutaron contra páginas públicas de nachomg.com.

## Límites

- axe-core detecta, según su propia documentación, de media un 57 % de los problemas de WCAG. Cero infracciones no significa que la web sea accesible; revisa los resultados «incompletos» y haz las pruebas manuales de [docs/08-accesibilidad.md](../docs/08-accesibilidad.md).
- `restos-elementor.js` busca patrones conocidos. Una mención de la palabra «elementor» en el texto se señala como aviso, no como resto.
- `redirecciones.js` exige un único salto. Si tu configuración añade un salto previo (por ejemplo, de `http` a `https`), usa en el CSV las URL de origen ya en `https`.

## Licencia

MIT. Véase [LICENSE-MIT](../LICENSE-MIT).
