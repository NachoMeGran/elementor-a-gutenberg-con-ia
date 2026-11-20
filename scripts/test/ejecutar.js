'use strict';
/*
 * Pruebas de los scripts contra un servidor local con páginas de prueba.
 * No necesita conexión a Internet. Uso: npm test (desde /scripts).
 * Licencia: MIT (véase LICENSE-MIT en la raíz del repositorio).
 */

const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');
const { chromium } = require('playwright');

const FIXTURES = path.join(__dirname, 'fixtures');
const SCRIPTS = path.join(__dirname, '..');
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.csv': 'text/csv' };
const REDIRECCIONES = {
  '/servicios-antiguos/': [301, '/accesible.html'],
  '/temporal/': [302, '/accesible.html'],
  '/mal-destino/': [301, '/con-errores.html'],
};

function servidor() {
  return http.createServer((req, res) => {
    const ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (REDIRECCIONES[ruta]) {
      const [codigo, destino] = REDIRECCIONES[ruta];
      res.writeHead(codigo, { Location: destino });
      return res.end();
    }
    const archivo = path.join(FIXTURES, path.normalize(ruta));
    if (!archivo.startsWith(FIXTURES) || !fs.existsSync(archivo) || fs.statSync(archivo).isDirectory()) {
      res.writeHead(404);
      return res.end('no encontrado');
    }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream' });
    fs.createReadStream(archivo).pipe(res);
  });
}

function ejecutar(script, args, cwd) {
  return new Promise((resolve) => {
    execFile(process.execPath, [path.join(SCRIPTS, script), ...args], { cwd, timeout: 120000 }, (err, stdout, stderr) => {
      resolve({ codigo: err ? err.code : 0, salida: stdout + stderr });
    });
  });
}

const resultados = [];
function comprobar(nombre, condicion, detalle = '') {
  resultados.push({ nombre, ok: !!condicion });
  console.log(`${condicion ? 'OK   ' : 'FALLA'} ${nombre}${!condicion && detalle ? '\n' + detalle : ''}`);
}

async function main() {
  const srv = servidor();
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const BASE = `http://127.0.0.1:${srv.address().port}`;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'egia-'));

  try {
    // 1. axe-wcag.js
    let r = await ejecutar('axe-wcag.js', [`${BASE}/accesible.html`, '--anchos', '1440,390', '--salida', path.join(tmp, 'axe.json')], tmp);
    comprobar('axe: página accesible sin infracciones (código 0)', r.codigo === 0, r.salida);
    const informe = JSON.parse(fs.readFileSync(path.join(tmp, 'axe.json'), 'utf8'));
    comprobar('axe: informe JSON con dos anchos', informe.informe.length === 2 && informe.informe.every((x) => x.version));

    r = await ejecutar('axe-wcag.js', [`${BASE}/con-errores.html`, '--anchos', '1440'], tmp);
    comprobar('axe: página con errores devuelve código 1', r.codigo === 1, r.salida);
    for (const regla of ['image-alt', 'button-name', 'color-contrast', 'html-has-lang']) {
      comprobar(`axe: detecta ${regla}`, r.salida.includes(regla), r.salida);
    }

    // 2. capturas.js
    r = await ejecutar('capturas.js', [`${BASE}/accesible.html`, '--anchos', '1440,390', '--carpeta', path.join(tmp, 'capturas')], tmp);
    const pngs = fs.existsSync(path.join(tmp, 'capturas')) ? fs.readdirSync(path.join(tmp, 'capturas')) : [];
    comprobar('capturas: genera un PNG por ancho', r.codigo === 0 && pngs.length === 2 && pngs.every((p) => p.endsWith('.png')), r.salida);
    const cabecera = pngs.length ? fs.readFileSync(path.join(tmp, 'capturas', pngs[0])).subarray(0, 8).toString('hex') : '';
    comprobar('capturas: el archivo es un PNG válido', cabecera === '89504e470d0a1a0a');

    // 3. restos-elementor.js
    r = await ejecutar('restos-elementor.js', [`${BASE}/elementor-restos.html`], tmp);
    comprobar('restos: detecta restos (código 1)', r.codigo === 1, r.salida);
    comprobar('restos: detecta variables --e-global-*', r.salida.includes('--e-global-color-primary'), r.salida);
    comprobar('restos: detecta CSS en uploads/elementor', r.salida.includes('uploads/elementor'), r.salida);
    comprobar('restos: decodifica recursos data: en línea', r.salida.includes('--e-global-color-accent'), r.salida);
    comprobar('restos: detecta clases e-con / elementor-kit', /e-con|elementor-kit-7/.test(r.salida), r.salida);
    r = await ejecutar('restos-elementor.js', [`${BASE}/accesible.html`], tmp);
    comprobar('restos: página limpia sin restos (código 0)', r.codigo === 0, r.salida);

    // 4. redirecciones.js
    const csv = fs.readFileSync(path.join(FIXTURES, 'redirecciones.csv'), 'utf8').replaceAll('{BASE}', BASE);
    fs.writeFileSync(path.join(tmp, 'mapa.csv'), csv);
    r = await ejecutar('redirecciones.js', [path.join(tmp, 'mapa.csv')], tmp);
    comprobar('redirecciones: fila correcta aprobada', /OK\s+\S+servicios-antiguos/.test(r.salida), r.salida);
    comprobar('redirecciones: 302 marcada como fallo', /FALLA\s+\S+temporal.*302/.test(r.salida), r.salida);
    comprobar('redirecciones: destino equivocado marcado', /FALLA\s+\S+mal-destino.*redirige a/.test(r.salida), r.salida);
    comprobar('redirecciones: código de salida 1', r.codigo === 1, r.salida);

    // 5. Snippet CSS del contenedor interno del Grupo
    const css = fs.readFileSync(path.join(SCRIPTS, '..', 'snippets', 'css', 'contenedor-interno-grupo.css'), 'utf8');
    const navegador = await chromium.launch();
    try {
      const pagina = await navegador.newPage({ viewport: { width: 1200, height: 800 } });
      const html = fs.readFileSync(path.join(FIXTURES, 'rejilla.html'), 'utf8');
      const posiciones = async () =>
        pagina.evaluate(() => ['a', 'b', 'c'].map((id) => document.getElementById(id).getBoundingClientRect().top));
      await pagina.setContent(html);
      const sinArreglo = await posiciones();
      comprobar('rejilla: sin el arreglo, las columnas se apilan', new Set(sinArreglo).size === 3, JSON.stringify(sinArreglo));
      await pagina.setContent(html.replace('<!--ARREGLO-->', `<style>${css}</style>`));
      const conArreglo = await posiciones();
      comprobar('rejilla: con display:contents, tres columnas en la misma fila', new Set(conArreglo).size === 1, JSON.stringify(conArreglo));
    } finally {
      await navegador.close();
    }
  } finally {
    srv.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  const fallos = resultados.filter((x) => !x.ok).length;
  console.log(`\n${resultados.length - fallos}/${resultados.length} comprobaciones superadas.`);
  process.exit(fallos ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
