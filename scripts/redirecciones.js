#!/usr/bin/env node
'use strict';
/*
 * redirecciones.js — Comprueba un mapa de redirecciones: cada URL antigua debe
 * responder con una redirección permanente (301 o 308) hacia la URL nueva, en
 * un solo salto, y la URL nueva debe responder 200.
 *
 * Uso:
 *   node redirecciones.js mapa.csv
 *
 * Formato del CSV (con o sin cabecera; separador coma o punto y coma):
 *   origen,destino
 *   https://ejemplo.com/servicios-antiguos/,https://ejemplo.com/servicios/
 *
 * Código de salida: 0 si todo cuadra, 1 si alguna fila falla, 2 si hubo errores.
 * Licencia: MIT (véase LICENSE-MIT en la raíz del repositorio).
 */

const fs = require('fs');
const { request } = require('playwright');

function leerMapa(ruta) {
  const filas = [];
  for (const linea of fs.readFileSync(ruta, 'utf8').split(/\r?\n/)) {
    const t = linea.trim();
    if (!t || t.startsWith('#')) continue;
    const [origen, destino] = t.split(/[;,]/).map((c) => c.trim().replace(/^"|"$/g, ''));
    if (/^origen$/i.test(origen)) continue;
    if (!origen || !destino) throw new Error(`Fila incompleta: ${t}`);
    filas.push({ origen, destino });
  }
  return filas;
}

const normalizar = (u) => {
  const x = new URL(u);
  x.hash = '';
  return x.href;
};

async function main() {
  const ruta = process.argv[2];
  if (!ruta) {
    console.error('Uso: node redirecciones.js mapa.csv');
    process.exit(2);
  }
  const filas = leerMapa(ruta);
  const ctx = await request.newContext({
    proxy: process.env.PW_PROXY ? { server: process.env.PW_PROXY } : undefined,
  });
  let fallos = 0;
  let errores = 0;
  try {
    for (const { origen, destino } of filas) {
      try {
        const r = await ctx.get(origen, { maxRedirects: 0, timeout: 30000 });
        const estado = r.status();
        const location = r.headers()['location'];
        const problemas = [];
        if (![301, 308].includes(estado)) problemas.push(`responde ${estado}, no 301/308`);
        if (!location) {
          problemas.push('sin cabecera Location');
        } else if (normalizar(new URL(location, origen).href) !== normalizar(destino)) {
          problemas.push(`redirige a ${new URL(location, origen).href}`);
        }
        const final = await ctx.get(destino, { maxRedirects: 0, timeout: 30000 });
        if (final.status() !== 200) problemas.push(`el destino responde ${final.status()}`);
        if (problemas.length) {
          fallos++;
          console.log(`FALLA ${origen} -> ${destino}: ${problemas.join('; ')}`);
        } else {
          console.log(`OK    ${origen} -> ${destino} (${estado}, destino 200)`);
        }
      } catch (e) {
        errores++;
        console.log(`ERROR ${origen}: ${e.message}`);
      }
    }
  } finally {
    await ctx.dispose();
  }
  console.log(`\nResumen: ${filas.length} filas, ${fallos} con fallos, ${errores} con error.`);
  process.exit(errores ? 2 : fallos ? 1 : 0);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(2);
});
