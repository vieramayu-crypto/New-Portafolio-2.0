import { build } from 'esbuild';
import { readFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

/** TODAS LAS DIRECCIONES DEL SITIO, EN LOS DOS IDIOMAS.
 *
 *  Lo usan el prerenderizado y el sitemap, así que las dos cosas hablan
 *  siempre de la misma lista y no se pueden desincronizar.
 *
 *  LAS PALABRAS DE CADA RUTA NO SE COPIAN AQUÍ. Se compila `src/lib/rutas.ts`
 *  con esbuild y se importa: si mañana `/en/team` pasa a llamarse de otra
 *  forma, cambia en un sitio y esto se entera solo. (Ese archivo sólo importa
 *  un tipo, y los tipos desaparecen al compilar, así que sale suelto y sin
 *  arrastrar React detrás.)
 *
 *  LOS IDENTIFICADORES DE HOTEL Y DE CASO sí se leen con una expresión
 *  regular, porque sus archivos arrastran medio proyecto si se compilan. Es
 *  frágil por naturaleza, así que se comprueba la cuenta: si algún día deja
 *  de encontrarlos, esto falla en voz alta en vez de generar un sitemap a
 *  medias sin que nadie se entere.
 */

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

async function cargarRutas() {
  const salida = path.join(RAIZ, 'node_modules', '.cache', 'rutas.mjs');
  await mkdir(path.dirname(salida), { recursive: true });
  await build({
    entryPoints: [path.join(RAIZ, 'src/lib/rutas.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: salida,
    logLevel: 'silent',
  });
  return import(pathToFileURL(salida).href);
}

async function idsDeHoteles() {
  const texto = await readFile(path.join(RAIZ, 'data/hotels.ts'), 'utf8');
  const ids = [...texto.matchAll(/^ {4}id: '([^']+)',$/gm)].map((m) => m[1]);
  if (ids.length < 5) {
    throw new Error(
      `No se reconocieron los hoteles en data/hotels.ts (encontrados: ${ids.length}). ` +
        'Si cambió el formato del archivo, hay que actualizar esta expresión regular.'
    );
  }
  return ids;
}

async function slugsDeCasos() {
  const texto = await readFile(path.join(RAIZ, 'data/caseStudies.ts'), 'utf8');
  const slugs = [...texto.matchAll(/^ {4}slug: '([^']+)',$/gm)].map((m) => m[1]);
  if (slugs.length < 1) {
    throw new Error('No se reconocieron los casos de estudio en data/caseStudies.ts.');
  }
  return slugs;
}

/** Devuelve, por cada página, su dirección en cada idioma:
 *  `[{ clave, param, porIdioma: { es: '/proyectos', en: '/en/projects' } }, ...]` */
export async function rutasDelSitio() {
  const { ruta, IDIOMAS } = await cargarRutas();
  const hoteles = await idsDeHoteles();
  const casos = await slugsDeCasos();

  const paginas = [
    { clave: 'inicio' },
    { clave: 'proyectos' },
    { clave: 'equipo' },
    { clave: 'contacto' },
    ...hoteles.map((id) => ({ clave: 'trabajo', param: id })),
    ...casos.map((slug) => ({ clave: 'proyecto', param: slug })),
  ];

  return paginas.map((p) => ({
    ...p,
    porIdioma: Object.fromEntries(IDIOMAS.map((i) => [i, ruta(i, p.clave, p.param)])),
  }));
}

export { cargarRutas };
