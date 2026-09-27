import type { Idioma } from './idioma';

/** LAS DIRECCIONES DE LA WEB, EN LOS DOS IDIOMAS.
 *
 *  POR QUÉ EXISTE ESTE ARCHIVO. Hasta ahora las rutas vivían detrás de una
 *  almohadilla (`/#/proyectos`) y el idioma sólo existía dentro del navegador.
 *  Las dos cosas son invisibles para Google: lo que va detrás de la almohadilla
 *  no lo indexa, y un idioma que no está en la dirección no se puede enlazar,
 *  ni compartir, ni declarar con `hreflang`. Es decir, de toda la web Google
 *  veía UNA página, y de la versión inglesa no sabía ni que existía.
 *
 *  AHORA CADA PÁGINA TIENE SU DIRECCIÓN REAL, y cada idioma la suya:
 *
 *    español                     inglés
 *    /                           /en
 *    /proyectos                  /en/projects
 *    /acerca-de                  /en/team
 *    /contacto                   /en/contact
 *    /trabajo/:hotel             /en/work/:hotel
 *    /proyecto/:caso             /en/project/:caso
 *
 *  EL INGLÉS LLEVA SUS PROPIAS PALABRAS, no las españolas con un prefijo
 *  delante. `/en/proyectos` funcionaría igual de bien para Google, pero un
 *  director de marketing de un hotel de Londres lee la dirección, y
 *  `/en/projects` es lo que tiene un portafolio de este nivel.
 *
 *  EL ESPAÑOL NO LLEVA PREFIJO porque es el idioma por defecto del sitio: la
 *  portada es `/`, no `/es`. Así los enlaces que ya estén circulando siguen
 *  valiendo.
 *
 *  Y TODO PASA POR AQUÍ. Ningún componente escribe una ruta a mano: piden
 *  `ruta(idioma, 'trabajo', id)`. Si mañana cambia una palabra, cambia en un
 *  sitio y no en catorce.
 */

export type Clave = 'inicio' | 'proyectos' | 'equipo' | 'contacto' | 'trabajo' | 'proyecto';

type ClaveConSegmento = Exclude<Clave, 'inicio'>;

const SEGMENTOS: Record<Idioma, Record<ClaveConSegmento, string>> = {
  es: {
    proyectos: 'proyectos',
    equipo: 'acerca-de',
    contacto: 'contacto',
    trabajo: 'trabajo',
    proyecto: 'proyecto',
  },
  en: {
    proyectos: 'projects',
    equipo: 'team',
    contacto: 'contact',
    trabajo: 'work',
    proyecto: 'project',
  },
};

export const PREFIJO_EN = '/en';

/** Los dos idiomas, en el orden en que se declaran al buscador. */
export const IDIOMAS: Idioma[] = ['es', 'en'];

/** La dirección de una página. `param` es el hotel o el caso, cuando la ruta
 *  lo lleva. Siempre empieza por barra y nunca termina en barra. */
export function ruta(idioma: Idioma, clave: Clave, param?: string): string {
  const raiz = idioma === 'en' ? PREFIJO_EN : '';
  if (clave === 'inicio') return raiz || '/';
  const segmento = SEGMENTOS[idioma][clave];
  return param ? `${raiz}/${segmento}/${param}` : `${raiz}/${segmento}`;
}

function limpiar(pathname: string): string {
  const sinBarra = pathname.replace(/\/+$/, '');
  return sinBarra || '/';
}

/** El idioma que dice la dirección. Es la única fuente de verdad: si la
 *  dirección dice `/en`, la web está en inglés, se haya llegado como se haya
 *  llegado. */
export function idiomaDeRuta(pathname: string): Idioma {
  const p = limpiar(pathname);
  return p === PREFIJO_EN || p.startsWith(`${PREFIJO_EN}/`) ? 'en' : 'es';
}

/** Descompone una dirección en la página que nombra. Devuelve `null` si no
 *  reconoce la ruta, que es lo que hay que tratar como "no existe". */
export function analizarRuta(
  pathname: string
): { idioma: Idioma; clave: Clave; param?: string } | null {
  const p = limpiar(pathname);
  const idioma = idiomaDeRuta(p);
  const resto = idioma === 'en' ? limpiar(p.slice(PREFIJO_EN.length)) : p;

  if (resto === '/') return { idioma, clave: 'inicio' };

  const partes = resto.split('/').filter(Boolean);
  const segmentos = SEGMENTOS[idioma];
  const claves = Object.keys(segmentos) as ClaveConSegmento[];
  const clave = claves.find((c) => segmentos[c] === partes[0]);
  if (!clave) return null;

  const llevaParametro = clave === 'trabajo' || clave === 'proyecto';
  if (llevaParametro) {
    if (partes.length !== 2) return null;
    return { idioma, clave, param: partes[1] };
  }
  if (partes.length !== 1) return null;
  return { idioma, clave };
}

/** La MISMA página en el otro idioma.
 *
 *  Es lo que usa el interruptor, y por eso no puede devolver la portada: quien
 *  está leyendo la galería de Abama y pulsa EN quiere la galería de Abama en
 *  inglés, no volver al principio y buscarla otra vez. Si la ruta no se
 *  reconoce, entonces sí, a la portada del idioma pedido. */
export function traducirRuta(pathname: string, a: Idioma): string {
  const partes = analizarRuta(pathname);
  if (!partes) return ruta(a, 'inicio');
  return ruta(a, partes.clave, partes.param);
}

/** Todas las rutas fijas de un idioma, sin las que llevan parámetro. Las usan
 *  el sitemap y el prerenderizado. */
export function rutasFijas(idioma: Idioma): { clave: Clave; ruta: string }[] {
  const claves: Clave[] = ['inicio', 'proyectos', 'equipo', 'contacto'];
  return claves.map((clave) => ({ clave, ruta: ruta(idioma, clave) }));
}
