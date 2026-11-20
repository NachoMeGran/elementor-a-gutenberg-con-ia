#!/usr/bin/env node
'use strict';
/*
 * capturas.js — Hace capturas de página completa de una lista de URL en
 * varios anchos, para revisar a ojo antes y después de cada cambio.
 *
 * Uso:
 *   node capturas.js https://ejemplo.com/ --carpeta capturas/antes
 *   node capturas.js --archivo urls.txt --anchos 1440,390 --carpeta capturas/despues
 *
 * Opciones:
 *   --archivo <ruta>   Archivo con una URL por línea (# para comentarios).
 *   --anchos <lista>   Anchos de ventana en px. Por defecto: 1440,390.
 *   --carpeta <ruta>   Carpeta de destino. Por defecto: ./capturas
 *   --espera <ms>      Espera adicional tras cargar.
 *   --solo-ventana     Captura solo la ventana visible, no la página completa.
 *
 * Los archivos se llaman <dominio>--<ruta>--<ancho>.png, de modo que dos
 * carpetas (antes/después) se pueden comparar archivo a archivo.
 *
 * Licencia: MIT (véase LICENSE-MIT en la raíz del repositorio).
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { leerArgumentos, leerUrls, slugDeUrl, leerAnchos, opcionesNavegador } = require('./lib/comun');

async function main() {
  const { opciones, posicionales } = leerArgumentos(process.argv.slice(2), ['solo-ventana']);
  const urls = leerUrls(posicionales, opciones.archivo);
  if (!urls.length) {
    console.error('Indica al menos una URL o un --archivo.');
    process.exit(2);
  }
  const anchos = leerAnchos(opciones.anchos, [1440, 390]);
  const carpeta = opciones.carpeta || 'capturas';
  const espera = opciones.espera ? parseInt(opciones.espera, 10) : 0;
  fs.mkdirSync(carpeta, { recursive: true });

  const navegador = await chromium.launch(opcionesNavegador());
  let errores = 0;
  try {
    for (const url of urls) {
      for (const ancho of anchos) {
        const contexto = await navegador.newContext({
          viewport: { width: ancho, height: 900 },
          reducedMotion: 'reduce',
        });
        const pagina = await contexto.newPage();
        const destino = path.join(carpeta, `${slugDeUrl(url)}--${ancho}.png`);
        try {
          const respuesta = await pagina.goto(url, { waitUntil: 'load', timeout: 60000 });
          await pagina.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
          // Fuerza la carga de imágenes diferidas recorriendo la página.
          await pagina.evaluate(async () => {
            const paso = Math.max(200, Math.floor(window.innerHeight * 0.8));
            for (let y = 0; y < document.body.scrollHeight; y += paso) {
              window.scrollTo(0, y);
              await new Promise((r) => setTimeout(r, 60));
            }
            window.scrollTo(0, 0);
          });
          if (espera) await pagina.waitForTimeout(espera);
          await pagina.screenshot({ path: destino, fullPage: !opciones['solo-ventana'], animations: 'disabled' });
          console.log(`OK    ${ancho}px ${url} (HTTP ${respuesta ? respuesta.status() : '?'}) -> ${destino}`);
        } catch (e) {
          errores++;
          console.log(`ERROR ${ancho}px ${url}: ${e.message}`);
        } finally {
          await contexto.close();
        }
      }
    }
  } finally {
    await navegador.close();
  }
  process.exit(errores ? 2 : 0);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(2);
});
