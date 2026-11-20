#!/usr/bin/env node
'use strict';
/*
 * axe-wcag.js — Pasa axe-core a una lista de URL en varios anchos de ventana.
 *
 * Uso:
 *   node axe-wcag.js https://ejemplo.com/ https://ejemplo.com/contacto/
 *   node axe-wcag.js --archivo urls.txt --anchos 1440,390 --salida informe-axe.json
 *
 * Opciones:
 *   --archivo <ruta>   Archivo con una URL por línea (# para comentarios).
 *   --anchos <lista>   Anchos de ventana en px. Por defecto: 1440,390.
 *   --etiquetas <lista> Etiquetas de reglas axe. Por defecto:
 *                      wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa
 *   --salida <ruta>    Guarda el informe completo en JSON.
 *   --espera <ms>      Espera adicional tras cargar (p. ej. banners de cookies).
 *
 * Código de salida: 0 sin infracciones, 1 con infracciones, 2 si hubo errores.
 * Recuerda: axe detecta una parte de los problemas. «0 infracciones» no
 * significa «accesible»; los resultados «incompletos» piden revisión humana.
 *
 * Licencia: MIT (véase LICENSE-MIT en la raíz del repositorio).
 */

const fs = require('fs');
const { chromium } = require('playwright');
const { leerArgumentos, leerUrls, leerAnchos, rutaAxe, opcionesNavegador } = require('./lib/comun');

const ETIQUETAS_POR_DEFECTO = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function auditar(navegador, url, ancho, etiquetas, axePath, espera) {
  const contexto = await navegador.newContext({
    viewport: { width: ancho, height: 900 },
    reducedMotion: 'reduce',
  });
  const pagina = await contexto.newPage();
  try {
    const respuesta = await pagina.goto(url, { waitUntil: 'load', timeout: 60000 });
    const estado = respuesta ? respuesta.status() : null;
    await pagina.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    if (espera) await pagina.waitForTimeout(espera);
    await pagina.addScriptTag({ path: axePath });
    const resultado = await pagina.evaluate(async (valores) => {
      // eslint-disable-next-line no-undef
      const r = await axe.run(document, {
        runOnly: { type: 'tag', values: valores },
        resultTypes: ['violations', 'incomplete'],
      });
      const resumir = (lista) =>
        lista.map((v) => ({
          id: v.id,
          impacto: v.impact,
          ayuda: v.help,
          enlace: v.helpUrl,
          etiquetas: v.tags.filter((t) => t.startsWith('wcag')),
          nodos: v.nodes.length,
          selectores: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
        }));
      // eslint-disable-next-line no-undef
      return { version: axe.version, infracciones: resumir(r.violations), incompletos: resumir(r.incomplete) };
    }, etiquetas);
    return { url, ancho, estado, ...resultado };
  } finally {
    await contexto.close();
  }
}

async function main() {
  const { opciones, posicionales } = leerArgumentos(process.argv.slice(2));
  const urls = leerUrls(posicionales, opciones.archivo);
  if (!urls.length) {
    console.error('Indica al menos una URL o un --archivo. Detalles en la cabecera del script.');
    process.exit(2);
  }
  const anchos = leerAnchos(opciones.anchos, [1440, 390]);
  const etiquetas = opciones.etiquetas ? opciones.etiquetas.split(',').map((t) => t.trim()) : ETIQUETAS_POR_DEFECTO;
  const espera = opciones.espera ? parseInt(opciones.espera, 10) : 0;
  const axePath = rutaAxe();

  const navegador = await chromium.launch(opcionesNavegador());
  const informe = [];
  let errores = 0;
  try {
    for (const url of urls) {
      for (const ancho of anchos) {
        try {
          const r = await auditar(navegador, url, ancho, etiquetas, axePath, espera);
          informe.push(r);
          const marca = r.infracciones.length ? 'FALLA' : 'OK   ';
          console.log(`${marca} ${ancho}px ${url} (HTTP ${r.estado}) — infracciones: ${r.infracciones.length}, a revisar a mano: ${r.incompletos.length}`);
          for (const v of r.infracciones) {
            console.log(`      · [${v.impacto}] ${v.id}: ${v.ayuda} (${v.nodos} nodo/s)`);
            for (const s of v.selectores) console.log(`          ${s}`);
          }
        } catch (e) {
          errores++;
          informe.push({ url, ancho, error: e.message });
          console.log(`ERROR ${ancho}px ${url}: ${e.message}`);
        }
      }
    }
  } finally {
    await navegador.close();
  }

  if (opciones.salida) {
    fs.writeFileSync(opciones.salida, JSON.stringify({ fecha: new Date().toISOString(), etiquetas, informe }, null, 2));
    console.log(`Informe guardado en ${opciones.salida}`);
  }
  const conInfracciones = informe.filter((r) => r.infracciones && r.infracciones.length).length;
  console.log(`\nResumen: ${informe.length} comprobaciones, ${conInfracciones} con infracciones, ${errores} con error.`);
  process.exit(errores ? 2 : conInfracciones ? 1 : 0);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(2);
});
