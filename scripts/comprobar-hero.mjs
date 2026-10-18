/**
 * ¿TAPA ALGO AL TEXTO DEL HERO? Barrido de anchos por altos.
 *
 *   node scripts/comprobar-hero.mjs http://127.0.0.1:8111/New-Portafolio-2.0/
 *
 * POR QUÉ EXISTE ESTE ARCHIVO. El bloque de texto del hero se centraba sobre
 * la sección entera y la banda de cifras flota sobre ese mismo espacio, así
 * que en una ventana ancha y baja -- un portátil con la barra del navegador,
 * que es lo normal -- la banda se comía las dos últimas líneas del párrafo.
 * No se había visto porque siempre se medía a 1440x900 y a 390x844, y en esos
 * dos tamaños no pasa. Mayurlin: "no solo que está mal, sino que es un error
 * imperdonable... esto debe contemplarse siempre en todas las mediciones".
 *
 * Así que esto se pasa en cada ronda que toque Inicio. Sale con código 1 si
 * encuentra un solo solape, para que no haya que leerse la salida entera.
 *
 * Mide cajas de verdad, no "parece que cabe": para cada texto del hero mira
 * si su rectángulo se cruza con el de la banda en los dos ejes a la vez.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8111/New-Portafolio-2.0/';

/* Los anchos son los de portátiles y monitores reales; los altos incluyen los
 * que deja una ventana con pestañas y barra de marcadores, que es donde
 * apareció el fallo. */
const ANCHOS = [1024, 1180, 1280, 1366, 1440, 1512, 1680, 1920, 2560];
const ALTOS = [600, 650, 700, 768, 800, 900, 1080];

const solapes = (pagina) => pagina.evaluate(() => {
  const banda = document.querySelector('.mt-hero-cifras');
  if (!banda) return [{ t: 'no encuentro la banda de cifras', px: -1 }];
  const rb = banda.getBoundingClientRect();
  const fuera = [];
  document.querySelector('section').querySelectorAll('h1, p, a, span, button').forEach((el) => {
    if (banda.contains(el) || el.contains(banda)) return;
    const texto = (el.textContent || '').trim();
    if (texto.length < 4) return;
    const r = el.getBoundingClientRect();
    if (r.width < 20 || r.height < 8) return;
    const y = Math.min(r.bottom, rb.bottom) - Math.max(r.top, rb.top);
    const x = Math.min(r.right, rb.right) - Math.max(r.left, rb.left);
    if (y > 1 && x > 1) fuera.push({ t: texto.slice(0, 40), px: Math.round(y) });
  });
  return fuera.sort((a, b) => b.px - a.px);
});

const navegador = await chromium.launch({
  executablePath: process.env.PRERENDER_CHROMIUM || undefined,
  args: ['--no-sandbox'],
});

let malos = 0;
for (const ancho of ANCHOS) {
  const fila = [];
  for (const alto of ALTOS) {
    const ctx = await navegador.newContext({ viewport: { width: ancho, height: alto } });
    await ctx.addInitScript(() => {
      try {
        sessionStorage.setItem('mt-intro-visto', '1');
      } catch {
        /* da igual: sólo sirve para saltarse la intro */
      }
    });
    const pagina = await ctx.newPage();
    await pagina.goto(BASE, { waitUntil: 'load' });
    await pagina.waitForTimeout(1400);
    const malo = await solapes(pagina);
    if (malo.length) {
      malos += 1;
      fila.push(`${alto}:TAPA ${malo[0].px}px "${malo[0].t}"`);
    } else {
      fila.push(`${alto}:ok`);
    }
    await ctx.close();
  }
  console.log(`${String(ancho).padStart(4)}  ${fila.join('  ')}`);
}

await navegador.close();

if (malos) {
  console.error(`\nLA BANDA TAPA TEXTO EN ${malos} DE ${ANCHOS.length * ALTOS.length} TAMAÑOS.`);
  process.exit(1);
}
console.log(`\nSin solapes en ${ANCHOS.length * ALTOS.length} tamaños.`);
