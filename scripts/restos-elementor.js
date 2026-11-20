#!/usr/bin/env node
'use strict';
/*
 * restos-elementor.js — Busca restos de Elementor en el HTML publicado y en
 * las hojas de estilo y scripts que ese HTML enlaza.
 *
 * Uso:
 *   node restos-elementor.js https://ejemplo.com/ https://ejemplo.com/blog/
 *   node restos-elementor.js --archivo urls.txt
 *
 * Qué busca (insensible a mayúsculas):
 *   - Variables globales de Elementor: --e-global-color-*, --e-global-typography-*
 *   - Clases de su marcado: elementor-element, elementor-widget, elementor-section,
 *     elementor-column, elementor-kit-*, e-con
 *   - Archivos generados en /wp-content/uploads/elementor/
 *   - Recursos del propio plugin en /wp-content/plugins/elementor
 *   - Cualquier otra mención de «elementor» (se informa aparte, como aviso)
 *
 * Código de salida: 0 si no hay restos, 1 si los hay, 2 si hubo errores.
 * Licencia: MIT (véase LICENSE-MIT en la raíz del repositorio).
 */

const { request } = require('playwright');
const { leerArgumentos, leerUrls } = require('./lib/comun');

const PATRONES = [
  { nombre: 'variables --e-global-*', re: /--e-global-[a-z]+-[\w-]+/gi },
  { nombre: 'clases de marcado Elementor', re: /\belementor-(?:element|widget|section|column|container|kit-\d+)\b|\be-con\b/gi },
  { nombre: 'archivos en uploads/elementor', re: /wp-content\/uploads\/elementor\//gi },
  { nombre: 'recursos del plugin', re: /wp-content\/plugins\/elementor(?:-pro)?\//gi },
];
const MENCION = /elementor/gi;

function contar(texto) {
  const hallazgos = [];
  for (const p of PATRONES) {
    const m = texto.match(p.re);
    if (m) hallazgos.push({ patron: p.nombre, veces: m.length, ejemplos: [...new Set(m)].slice(0, 3) });
  }
  const menciones = (texto.match(MENCION) || []).length;
  return { hallazgos, menciones };
}

function recursosEnlazados(html, base) {
  const urls = new Set();
  const reCss = /<link\b[^>]*rel=["']?stylesheet["']?[^>]*>/gi;
  const reJs = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  for (const etiqueta of html.match(reCss) || []) {
    const href = /href=["']([^"']+)["']/i.exec(etiqueta);
    if (href) urls.add(new URL(href[1].replace(/&amp;/g, '&'), base).href);
  }
  let m;
  while ((m = reJs.exec(html))) urls.add(new URL(m[1].replace(/&amp;/g, '&'), base).href);
  return [...urls];
}

async function main() {
  const { opciones, posicionales } = leerArgumentos(process.argv.slice(2));
  const urls = leerUrls(posicionales, opciones.archivo);
  if (!urls.length) {
    console.error('Indica al menos una URL o un --archivo.');
    process.exit(2);
  }
  const ctx = await request.newContext({
    extraHTTPHeaders: { 'Accept-Encoding': 'gzip, deflate, br' },
    proxy: process.env.PW_PROXY ? { server: process.env.PW_PROXY } : undefined,
  });
  let conRestos = 0;
  let errores = 0;
  const yaRevisados = new Map();
  try {
    for (const url of urls) {
      try {
        const r = await ctx.get(url, { timeout: 30000 });
        const html = await r.text();
        const res = contar(html);
        console.log(`\n${url} (HTTP ${r.status()})`);
        let restosPagina = res.hallazgos.length;
        for (const h of res.hallazgos) console.log(`  HTML  ${h.patron}: ${h.veces} (${h.ejemplos.join(', ')})`);
        if (!res.hallazgos.length && res.menciones) console.log(`  aviso: ${res.menciones} mención/es de «elementor» en el HTML sin patrón reconocido; revísalas.`);
        for (const recurso of recursosEnlazados(html, url)) {
          let rr = yaRevisados.get(recurso);
          if (!rr && recurso.startsWith('data:')) {
            // Recursos en línea (p. ej. scripts que LiteSpeed convierte en data:): se decodifican sin descargar nada.
            const coma = recurso.indexOf(',');
            const cabecera = recurso.slice(5, coma);
            const datos = recurso.slice(coma + 1);
            const texto = cabecera.endsWith(';base64') ? Buffer.from(datos, 'base64').toString('utf8') : decodeURIComponent(datos);
            rr = { estado: 'en línea', ...contar(texto) };
            yaRevisados.set(recurso, rr);
          }
          if (!rr) {
            try {
              const resp = await ctx.get(recurso, { timeout: 30000 });
              rr = { estado: resp.status(), ...contar(await resp.text()) };
            } catch (e) {
              rr = { error: e.message, hallazgos: [], menciones: 0 };
            }
            yaRevisados.set(recurso, rr);
          }
          if (rr.error) console.log(`  aviso: no pude descargar ${recurso}: ${rr.error}`);
          const nombre = recurso.startsWith('data:') ? `${recurso.slice(0, 40)}… (recurso en línea)` : recurso;
          for (const h of rr.hallazgos) {
            restosPagina++;
            console.log(`  ${nombre}\n        ${h.patron}: ${h.veces} (${h.ejemplos.join(', ')})`);
          }
        }
        if (restosPagina) conRestos++;
        else console.log('  sin restos reconocibles de Elementor');
      } catch (e) {
        errores++;
        console.log(`\nERROR ${url}: ${e.message}`);
      }
    }
  } finally {
    await ctx.dispose();
  }
  console.log(`\nResumen: ${urls.length} URL, ${conRestos} con restos, ${errores} con error.`);
  process.exit(errores ? 2 : conRestos ? 1 : 0);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(2);
});
