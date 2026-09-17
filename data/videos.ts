import { publicImage } from '../src/lib/content';

/** Un vídeo horizontal del servicio en la nube de Mayurlin.
 *
 *  `src` es la dirección de incrustar TAL CUAL la da el servicio: no se le
 *  añade ni se le quita un parámetro. Los ajustes de reproducción (arranque
 *  automático, bucle, silencio) se configuran en su panel y viajan dentro de
 *  esa dirección. Ver la regla completa en `components/VideoNube.tsx`.
 *
 *  `portada` es la foto que se ve mientras ese vídeo no es el del centro del
 *  carrusel. No es decorativa: es lo que evita montar cuatro reproductores a
 *  la vez (ver el comentario de `VideoModal`).
 */
export interface VideoHorizontal {
  id: string;
  /** Qué hotel es, para el rótulo de debajo del carrusel. */
  hotelName: string;
  /** El hotel de `data/hotels.ts` al que lleva el botón, si lo tiene. */
  hotelId?: string;
  /** Una línea corta: qué es esta pieza. */
  descripcion?: string;
  src: string;
  portada: string;
}

/** Los vídeos horizontales, en el orden en que se ven.
 *
 *  PARA AÑADIR UNO: copiar un bloque, pegar la dirección de incrustar que da
 *  el servicio y elegir una foto de `public/images` como portada. Nada más.
 *  El carrusel se ajusta solo a la cantidad que haya.
 *
 *  El primero es el mismo que se reproduce de fondo en el bloque de vídeos de
 *  Inicio: quien abre la ventana encuentra primero lo que ya estaba viendo, y
 *  desde ahí pasa a los demás.
 */
export const VIDEOS_HORIZONTALES: VideoHorizontal[] = [
  {
    id: 'v-abama',
    hotelName: 'The Ritz-Carlton Tenerife, Abama',
    hotelId: 'ritz-carlton-abama',
    descripcion: 'Arquitectura, jardines y experiencia de estancia.',
    src: 'https://livid.com/embed/oSYQOQcPwP5R?autoplay=1&loop=1&muted=1',
    portada: publicImage('sec1-gal4-playa-h.jpg'),
  },
  // LOS QUE FALTAN. El carrusel está hecho y verificado con cuatro vídeos
  // (un solo reproductor a la vez, 16:9 exacto, sin solapes en móvil ni en
  // escritorio). Para activarlo basta con descomentar estos bloques y pegar
  // en cada `src` la dirección de incrustar que da el servicio.
  //
  // No se publican con una dirección provisional a propósito: apuntarían
  // todos al vídeo de Abama con el nombre de otro hotel, y eso es atribuir un
  // trabajo a quien no es. Mientras haya un solo vídeo, el botón "Más vídeos"
  // no se muestra y el bloque de Inicio se comporta como hasta ahora.
  //
  // {
  //   id: 'v-gpro',
  //   hotelName: 'GPRO Valparaíso Palace & Spa',
  //   hotelId: 'gpro-valparaiso',
  //   descripcion: 'Jardines, piscina y spa sobre la Bahía de Palma.',
  //   src: 'PEGAR AQUÍ LA DIRECCIÓN DE INCRUSTAR',
  //   portada: publicImage('sec5-gal09-piscina-palmeras-v.jpg'),
  // },
  // {
  //   id: 'v-intercontinental',
  //   hotelName: 'InterContinental Lisboa',
  //   hotelId: 'intercontinental-lisboa',
  //   descripcion: 'Interiores, servicio y experiencia de ciudad.',
  //   src: 'PEGAR AQUÍ LA DIRECCIÓN DE INCRUSTAR',
  //   portada: publicImage('sec3-gal08-fachada-h.jpg'),
  // },
  // {
  //   id: 'v-deltapark',
  //   hotelName: 'Deltapark Vitalresort',
  //   hotelId: 'deltapark-vitalresort',
  //   descripcion: 'Habitación, spa y lago Thun.',
  //   src: 'PEGAR AQUÍ LA DIRECCIÓN DE INCRUSTAR',
  //   portada: publicImage('sec6-gal01-fachada-noche-h.jpg'),
  // },
];
