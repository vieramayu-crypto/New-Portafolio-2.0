import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { rutasDelSitio } from './rutas-del-sitio.mjs';

/** EL HTML YA DIBUJADO, UNA COPIA POR PÁGINA Y POR IDIOMA.
 *
 *  EL PROBLEMA. La web se dibuja con JavaScript, así que lo primero que
 *  recibía cualquiera que la pidiera era esto:
 *
 *      <div id="root"></div>
 *
 *  Una página en blanco. Google ejecuta JavaScript, sí, pero lo hace en una
 *  segunda pasada, más tarde y peor; y el resto de rastreadores (los de las
 *  redes al generar la vista previa de un enlace, los de las IA que citan
 *  fuentes) muchas veces no lo ejecutan en absoluto. Todo el copy que hay
 *  detrás, en dos idiomas, no estaba en lo que se servía.
 *
 *  LA SOLUCIÓN. Al compilar se abre la web en un navegador de verdad, se
 *  recorre cada una de sus direcciones, y se guarda el HTML resultante en su
 *  carpeta. Un navegador de verdad y no una simulación: lo que se guarda es
 *  exactamente lo que ve una persona, sin riesgo de que algo se dibuje
 *  distinto fuera del navegador.
 *
 *  SE RECORRE LA PÁGINA ENTERA ANTES DE GUARDARLA, de arriba abajo y vuelta.
 *  Media web entra con una animación que arranca cuando el bloque asoma por
 *  la pantalla; sin ese paseo, todo lo que está más abajo se guardaría con la
 *  opacidad a cero, que es justo el tipo de texto escondido que un buscador
 *  descuenta.
 *
 *  Y SE SALTA LA INTRO. Si no, las 32 copias empezarían por un vídeo a
 *  pantalla completa tapando el contenido.
 *
 *  EL 404 SE GUARDA ANTES DE TOCAR NADA. GitHub Pages sirve `404.html` cuando
 *  pide una dirección que no tiene archivo, así que ahí va el esqueleto
 *  original (el que todavía está vacío): la aplicación arranca y el enrutador
 *  resuelve por su cuenta. Es lo que hace que un enlace directo funcione en
 *  un hosting que no sabe de enrutadores.
 */

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(RAIZ, 'dist');
const BASE = (process.env.VITE_BASE || '/').replace(/\/+$/, '') + '/';
const PUERTO = 4317;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

/** Un servidor mínimo sobre `dist`, colgado en la misma subcarpeta que el
 *  sitio real, y que devuelve el esqueleto para cualquier ruta sin archivo:
 *  eso es lo que deja que el enrutador resuelva la dirección. */
function servidor(esqueleto) {
  return createServer(async (req, res) => {
    let camino = decodeURIComponent((req.url || '/').split('?')[0]);
    if (BASE !== '/' && camino.startsWith(BASE.replace(/\/$/, ''))) {
      camino = camino.slice(BASE.length - 1) || '/';
    }
    const archivo = path.join(DIST, camino);
    if (existsSync(archivo) && !archivo.endsWith('/')) {
      try {
        const datos = await readFile(archivo);
        res.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream' });
        res.end(datos);
        return;
      } catch {
        /* cae al esqueleto */
      }
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(esqueleto);
  });
}

async function main() {
  const esqueleto = await readFile(path.join(DIST, 'index.html'), 'utf8');
  // El 404 de GitHub Pages, con el esqueleto todavía sin dibujar.
  await writeFile(path.join(DIST, '404.html'), esqueleto);

  const paginas = await rutasDelSitio();
  const direcciones = paginas.flatMap((p) => Object.values(p.porIdioma));

  const srv = servidor(esqueleto);
  await new Promise((r) => srv.listen(PUERTO, r));

  const navegador = await chromium.launch({
    executablePath: process.env.PRERENDER_CHROMIUM || undefined,
    args: ['--no-sandbox'],
  });
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem('mt-intro-visto', '1');
    } catch {
      /* da igual: sólo sirve para no grabar la intro encima */
    }
  });

  let hechas = 0;
  for (const direccion of direcciones) {
    const pagina = await ctx.newPage();
    const url = `http://127.0.0.1:${PUERTO}${BASE.replace(/\/$/, '')}${direccion === '/' ? '/' : direccion}`;
    await pagina.goto(url, { waitUntil: 'load' });
    // Que la aplicación haya montado algo de verdad.
    await pagina.waitForFunction(() => {
      const r = document.getElementById('root');
      return !!r && r.children.length > 0;
    }, { timeout: 20000 });
    // El paseo que despierta las animaciones de entrada.
    await pagina.evaluate(async () => {
      const alto = document.body.scrollHeight;
      for (let y = 0; y < alto; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 45));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
    // EL RECORTE QUE EVITA QUE ESTA COPIA DESCARGUE NADA.
    //
    // React monta con `createRoot().render()`, que TIRA entero lo que haya
    // dentro de `#root` y lo vuelve a dibujar. Así que esta copia no se ve
    // nunca: su único trabajo es llevar el texto para quien no ejecuta
    // JavaScript. Todo lo que haya aquí dentro y pida red es gasto puro.
    //
    // Y era mucho gasto. Medido en Inicio: dos reproductores de vídeo y doce
    // fotos sin carga diferida, saliendo a la red ANTES de que arrancara
    // React, compitiendo con el propio código de la web. En un móvil con
    // datos eso se nota, y además los reproductores se montaban, se
    // destruían al entrar React y se volvían a montar: el peor escenario
    // posible para que un navegador de móvil conceda la reproducción
    // automática.
    //
    // LOS VÍDEOS SE QUITAN DEL TODO. El contenido de un marco incrustado no
    // cuenta como contenido de la página para un buscador, así que no se
    // pierde nada y se ahorra toda su descarga. Los monta React cuando toca,
    // uno a la vez, como siempre.
    //
    // LAS FOTOS SE QUEDAN, pero con carga diferida. El texto alternativo y la
    // dirección sí valen para el buscador. `lazy` no retrasa lo que se ve al
    // entrar: sólo evita que el navegador se traiga de golpe lo que está
    // doce pantallas más abajo.
    await pagina.evaluate(() => {
      document.querySelectorAll('iframe').forEach((f) => f.remove());
      document.querySelectorAll('img').forEach((i) => {
        i.setAttribute('loading', 'lazy');
        i.setAttribute('decoding', 'async');
      });
    });
    const html = await pagina.evaluate(() => '<!DOCTYPE html>\n' + document.documentElement.outerHTML);
    await pagina.close();

    const destino =
      direccion === '/'
        ? path.join(DIST, 'index.html')
        : path.join(DIST, direccion.replace(/^\//, ''), 'index.html');
    await mkdir(path.dirname(destino), { recursive: true });
    await writeFile(destino, html);
    hechas += 1;
    process.stdout.write(`  ${String(hechas).padStart(2)}/${direcciones.length}  ${direccion}\n`);
  }

  await navegador.close();
  srv.close();
  console.log(`Prerenderizadas ${hechas} direcciones.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
