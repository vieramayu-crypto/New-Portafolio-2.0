import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { rutasDelSitio } from './rutas-del-sitio.mjs';

/** EL SITEMAP, GENERADO DE LA MISMA LISTA QUE EL PRERENDERIZADO.
 *
 *  El que había listaba UNA dirección, la portada, porque hasta ahora era la
 *  única que existía para un buscador: el resto vivía detrás de una
 *  almohadilla. Ahora hay dieciséis páginas por dos idiomas, y todas entran.
 *
 *  CADA ENTRADA DECLARA SUS HERMANAS. Un sitemap con `hreflang` es la forma
 *  que recomienda Google de decir "esta página y esta otra son la misma en
 *  dos lenguas": sin eso, `/proyectos` y `/en/projects` compiten entre sí en
 *  vez de sumar, y el buscador decide por su cuenta cuál enseñar.
 *
 *  SE ESCRIBE CONTRA EL DOMINIO DEFINITIVO, nunca contra la subcarpeta de
 *  GitHub Pages: el taller no tiene que aparecer en ningún buscador.
 *
 *  Y NO SE INVENTA UNA FECHA. `lastmod` sale de la fecha de la compilación,
 *  que es lo único cierto que hay aquí.
 */

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DOMINIO = 'https://mayurlintravel.eu';

/** Cuánto pesa cada página dentro del sitio. La portada manda, las galerías
 *  y los casos son el contenido que de verdad se busca, y las páginas de
 *  servicio van detrás. */
const PRIORIDAD = {
  inicio: '1.0',
  proyectos: '0.9',
  trabajo: '0.8',
  proyecto: '0.8',
  equipo: '0.6',
  contacto: '0.6',
};

function escapar(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function main() {
  const paginas = await rutasDelSitio();
  const fecha = new Date().toISOString().slice(0, 10);

  const entradas = paginas.flatMap((p) =>
    Object.entries(p.porIdioma).map(([idioma, r]) => {
      const alternativas = [
        ...Object.entries(p.porIdioma).map(
          ([i, otra]) =>
            `    <xhtml:link rel="alternate" hreflang="${i}" href="${escapar(DOMINIO + otra)}" />`
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapar(DOMINIO + p.porIdioma.es)}" />`,
      ].join('\n');
      return [
        '  <url>',
        `    <loc>${escapar(DOMINIO + r)}</loc>`,
        alternativas,
        `    <lastmod>${fecha}</lastmod>`,
        `    <changefreq>monthly</changefreq>`,
        `    <priority>${PRIORIDAD[p.clave] || '0.5'}</priority>`,
        '  </url>',
      ].join('\n');
    })
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entradas,
    '</urlset>',
    '',
  ].join('\n');

  for (const destino of [path.join(RAIZ, 'public/sitemap.xml'), path.join(RAIZ, 'dist/sitemap.xml')]) {
    await writeFile(destino, xml).catch(() => {});
  }
  console.log(`Sitemap con ${entradas.length} direcciones.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
