/** Fotografía con dos pesos: máxima calidad en escritorio, versión ligera en
 *  móvil.
 *
 *  La regla de la casa es máxima calidad siempre, y se mantiene donde se nota:
 *  en pantalla grande se sirve el archivo original, sin tocar. Pero la misma
 *  foto de 1,1 MB y una de 400 KB se ven idénticas en un móvil de 390px, y la
 *  Home descargaba 12,8 MB en los primeros ocho segundos. Las copias de
 *  `images/m/` son las mismas fotos a 900px de ancho — el doble de lo que
 *  cabe en un móvil, para que se vean nítidas en pantallas retina.
 *
 *  Se usa con `<picture>` y `media`, no con `srcset` por anchos: así el
 *  navegador no elige por su cuenta y la versión pesada nunca llega a un
 *  teléfono, ni la ligera a un escritorio. */
export function versionMovil(url: string): string {
  const corte = url.lastIndexOf('/');
  if (corte === -1) return url;
  return `${url.slice(0, corte + 1)}m/${url.slice(corte + 1)}`;
}

/** Ancho a partir del cual manda el archivo de máxima calidad. Coincide con el
 *  `md:` de Tailwind que usa el resto de la web. */
export const MEDIA_MOVIL = '(max-width: 767px)';

/** LA ESCALERA DE TAMAÑOS: cada pantalla se lleva el archivo de SU medida.
 *
 *  POR QUÉ EXISTE. Mayurlin, sobre la aérea de Deltapark: "hay algo en el
 *  proceso que la está destruyendo". Tenía razón, y no era el guardado: era
 *  que el navegador recibía un archivo mucho más grande que el hueco y lo
 *  reducía él, con un filtro barato. Aislado en una prueba con la misma foto,
 *  la misma caja de 1920 y la misma pantalla:
 *
 *      archivo de 5120, reducido por el navegador  ->  87% del detalle
 *      archivo ya a 1920, sin reducir              -> 101% del detalle
 *
 *  O sea que darle MÁS píxeles la empeoraba. Es justo lo contrario de lo que
 *  parece, y es la razón por la que subir el archivo a 5120 no arregló nada.
 *
 *  CÓMO SE USA. `srcSetDe` devuelve la lista de copias con su ancho, y el
 *  navegador elige la que necesita según el tamaño del hueco y la densidad de
 *  la pantalla. Las copias viven en `images/w<ancho>/`.
 *
 *  ES OPCIONAL A PROPÓSITO. Sólo las fotos de esta lista tienen copias; para
 *  el resto devuelve `undefined` y se sirve el archivo de siempre. Apuntar a
 *  copias que no existen es exactamente el fallo que dejó la aérea rota en
 *  móvil: un `<source>` o un `srcset` que da 404 no cae al archivo de
 *  respaldo, se queda el hueco vacío. */
const ESCALERA: Record<string, number[]> = {
  'sec3-gal00-aerea-anochecer-h.jpg': [1440, 1920, 2560, 2880, 3024, 3840, 5120],
};

export function srcSetDe(url: string): string | undefined {
  const archivo = url.slice(url.lastIndexOf('/') + 1);
  const anchos = ESCALERA[archivo];
  if (!anchos) return undefined;
  const carpeta = url.slice(0, url.lastIndexOf('/') + 1);
  return anchos.map((a) => `${carpeta}w${a}/${archivo} ${a}w`).join(', ');
}
