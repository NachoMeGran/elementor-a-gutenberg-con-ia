'use strict';
// Utilidades compartidas por los scripts de verificación.
// Licencia: MIT (véase LICENSE-MIT en la raíz del repositorio).

const fs = require('fs');
const path = require('path');

/**
 * Analiza argumentos del tipo `--clave valor`, `--bandera` y posicionales.
 * Devuelve { opciones, posicionales }.
 */
function leerArgumentos(argv, booleanas = []) {
  const opciones = {};
  const posicionales = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [clave, valorEnLinea] = a.slice(2).split('=');
      if (booleanas.includes(clave)) {
        opciones[clave] = true;
      } else if (valorEnLinea !== undefined) {
        opciones[clave] = valorEnLinea;
      } else {
        opciones[clave] = argv[++i];
      }
    } else {
      posicionales.push(a);
    }
  }
  return { opciones, posicionales };
}

/**
 * Junta las URL pasadas como argumentos y las de un archivo (una por línea;
 * se ignoran líneas vacías y las que empiezan por #).
 */
function leerUrls(posicionales, archivo) {
  const urls = [...posicionales];
  if (archivo) {
    const lineas = fs.readFileSync(archivo, 'utf8').split(/\r?\n/);
    for (const l of lineas) {
      const t = l.trim();
      if (t && !t.startsWith('#')) urls.push(t);
    }
  }
  for (const u of urls) {
    try {
      new URL(u);
    } catch {
      throw new Error(`URL no válida: ${u}`);
    }
  }
  return urls;
}

/** Convierte una URL en un nombre de archivo legible y estable. */
function slugDeUrl(u) {
  const url = new URL(u);
  const ruta = (url.pathname + url.search)
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${url.hostname.replace(/[^a-zA-Z0-9]+/g, '-')}${ruta ? '--' + ruta : '--portada'}`.slice(0, 120);
}

/** Lista de anchos, p. ej. "1440,390" -> [1440, 390]. */
function leerAnchos(valor, porDefecto) {
  if (!valor) return porDefecto;
  const anchos = String(valor)
    .split(',')
    .map((v) => parseInt(v.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (!anchos.length) throw new Error(`Anchos no válidos: ${valor}`);
  return anchos;
}

/** Localiza axe.min.js: variable AXE_PATH o paquete axe-core instalado. */
function rutaAxe() {
  if (process.env.AXE_PATH) {
    if (!fs.existsSync(process.env.AXE_PATH)) {
      throw new Error(`AXE_PATH apunta a un archivo que no existe: ${process.env.AXE_PATH}`);
    }
    return path.resolve(process.env.AXE_PATH);
  }
  try {
    return require.resolve('axe-core/axe.min.js');
  } catch {
    throw new Error('No encuentro axe-core. Ejecuta `npm install` en /scripts o define AXE_PATH.');
  }
}

/** Opciones de lanzamiento de Chromium. Respeta PW_PROXY si se define. */
function opcionesNavegador() {
  const o = {};
  if (process.env.PW_PROXY) o.proxy = { server: process.env.PW_PROXY };
  return o;
}

module.exports = { leerArgumentos, leerUrls, slugDeUrl, leerAnchos, rutaAxe, opcionesNavegador };
