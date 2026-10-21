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
 *  LA ESCALERA TAMBIÉN MANDA EN EL MÓVIL, y por eso `copias` empieza en 780 y
 *  1170 (un teléfono de 390pt a 2x y a 3x). La copia de `images/m/` mide 900
 *  y la ampliaba un 30%: Mayurlin pidió que la foto no perdiera calidad "ni en
 *  escritorio ni en móvil", y con 900px fijos eso no se podía cumplir. Así que
 *  una foto con escalera NO usa `images/m/` -- quien la pinta tiene que saltarse
 *  ese `<source>` cuando `srcSetDe` devuelve algo, porque un `<source media>`
 *  que casa gana siempre al `srcset` del `<img>`.
 *
 *  `nativo` ES EL ARCHIVO PRINCIPAL, con su ancho real, y entra en la lista.
 *  Sin él, un `srcset` que sólo llegara a 1170 dejaría al escritorio con la
 *  copia de móvil: cuando hay `srcset`, el navegador ignora el `src`. Y así
 *  tampoco se guarda dos veces la misma imagen.
 *
 *  ES OPCIONAL A PROPÓSITO. Sólo las fotos de esta lista tienen copias; para
 *  el resto devuelve `undefined` y se sirve el archivo de siempre. Apuntar a
 *  copias que no existen es exactamente el fallo que dejó la aérea rota en
 *  móvil: un `<source>` o un `srcset` que da 404 no cae al archivo de
 *  respaldo, se queda el hueco vacío. */
const ESCALERA: Record<string, { copias: number[]; nativo: number }> = {
  'sec3-gal00-aerea-anochecer-h.jpg': {
    copias: [780, 1170, 1440, 1920, 2560, 2880, 3024, 3840],
    nativo: 5120,
  },
  // HOTEL ESPLÉNDIDO, la galería entera. Las trece que ya estaban llegaron por
  // el chat, que recomprime y corta en ~2000px de ancho, así que su `nativo`
  // es ese tope y no hay más detalle que sacar: lo que arregla la escalera en
  // ellas es el móvil, que venía ampliando los 900px de `images/m/`. Las dos
  // nuevas (la cama y el restaurante) sí vienen del archivo de cámara.
  'sec6-gal00-cama-lectura-h.jpg': {
    copias: [780, 1170, 1440, 1920, 2560, 2880, 3024, 3840],
    nativo: 5120,
  },
  'sec6-gal02-guia-flatlay-v.jpg': { copias: [780, 1170], nativo: 1333 },
  'sec6-foto3-h.jpg': { copias: [780, 1170, 1440], nativo: 1777 },
  'sec6-gal03-detalle-habitacion-v.jpg': { copias: [780, 1170], nativo: 1333 },
  'sec6-gal11-restaurante-v.jpg': { copias: [780, 1170, 1440], nativo: 1920 },
  'sec6-gal04-spa-entrada-v.jpg': { copias: [780, 1170], nativo: 1333 },
  'sec6-gal05-spa-interior-h.jpg': { copias: [780, 1170, 1440, 1920], nativo: 2000 },
  'sec6-gal06-bahia-panoramica-v.jpg': { copias: [780, 1170], nativo: 1333 },
  'sec6-gal07-playa-vestido-v.jpg': { copias: [780], nativo: 1147 },
  'sec6-gal08-piscina-pareja-h.jpg': { copias: [780, 1170, 1440, 1920], nativo: 2000 },
  'sec6-gal09-piscina-coco-v.jpg': { copias: [780, 1170], nativo: 1333 },
  'sec6-gal10-piscina-copa-v.jpg': { copias: [780, 1170], nativo: 1295 },
  'sec6-foto1-c.jpg': { copias: [780, 1170], nativo: 1333 },
  'sec6-foto2-v.jpg': { copias: [780, 1170], nativo: 1207 },
  'sec6-gal01-fachada-noche-h.jpg': { copias: [780, 1170, 1440, 1920], nativo: 2000 },
};

export function srcSetDe(url: string): string | undefined {
  const archivo = url.slice(url.lastIndexOf('/') + 1);
  const escalera = ESCALERA[archivo];
  if (!escalera) return undefined;
  const carpeta = url.slice(0, url.lastIndexOf('/') + 1);
  const copias = escalera.copias.map((a) => `${carpeta}w${a}/${archivo} ${a}w`);
  return [...copias, `${url} ${escalera.nativo}w`].join(', ');
}

/** EL `sizes` DE UN HUECO DE LA GALERÍA, en porcentaje del contenido.
 *
 *  Sin esto la escalera sirve de poco: `sizes` es lo que el navegador usa para
 *  decidir qué peldaño pide, y si se le dice `100vw` para una foto que ocupa
 *  media columna, pide el doble de lo que necesita y vuelve a reducirlo él
 *  mismo -- justo el problema que la escalera venía a resolver.
 *
 *  Los números salen de la propia galería (`HotelDetail.tsx`): un contenedor
 *  de 1600px como mucho, con 16px de margen en móvil, 40 a partir de 768 y 64
 *  a partir de 1024. Así que a pantalla ancha el contenido mide 1472px fijos y
 *  el hueco es un número de píxeles, no un porcentaje. */
export function sizesDe(porcentaje: number): string {
  const p = porcentaje / 100;
  return [
    `(min-width: 1728px) ${Math.round(1472 * p)}px`,
    `(min-width: 1024px) calc(${porcentaje}vw - ${Math.round(128 * p)}px)`,
    `(min-width: 768px) calc(${porcentaje}vw - ${Math.round(80 * p)}px)`,
    'calc(100vw - 32px)',
  ].join(', ');
}

/** Las fotos a sangre completa salen del contenedor y ocupan la ventana. */
export const SIZES_SANGRE = '100vw';
