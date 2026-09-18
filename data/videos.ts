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
 *
 *  LA PORTADA TIENE QUE SER DE ESE HOTEL. Las fotos van por prefijo y el
 *  número NO es el orden en que salen en la web: Abama es `sec1`, Binidufà
 *  `sec2`, Deltapark `sec3`, Honeymoon `sec4`, GPRO `sec5`, Espléndido `sec6`,
 *  InterContinental `sec7`, Welmoon `sec8` y District Hive `sec9`. Dos de
 *  estas entradas llevaban la portada de otro hotel por dar por hecho que el
 *  número seguía el orden de la página.
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
  {
    id: 'v-binidufa',
    hotelName: 'Vestige Collection, Binidufà',
    hotelId: 'vestige-binidufa',
    descripcion: 'Finca, patios y piscina en el interior de Menorca.',
    src: 'https://livid.com/embed/wbn5AZWOb8V9?autoplay=1&loop=1&muted=1',
    portada: publicImage('sec2-gal01-aerea-h.jpg'),
  },
  // ┌──────────────────────────────────────────────────────────────────────┐
  // │  PROVISIONAL: los dos de abajo apuntan al MISMO vídeo que el primero, │
  // │  el de Abama. Están así para que Mayurlin pueda ver el carrusel       │
  // │  funcionando y decidir si la forma de presentarlo le vale, mientras   │
  // │  termina de subir los suyos.                                          │
  // │                                                                       │
  // │  QUÉ HAY QUE CAMBIAR: sólo la línea `src` de cada uno, pegando la     │
  // │  dirección de incrustar que da el servicio. El hotel, la portada y    │
  // │  el texto ya son los definitivos.                                     │
  // │                                                                       │
  // │  ANTES DE MIGRAR AL DOMINIO PROPIO hay que haberlo hecho: publicar    │
  // │  esto tal cual pondría el mismo vídeo bajo el nombre de dos hoteles   │
  // │  distintos, y eso es atribuir un trabajo a quien no es.               │
  // └──────────────────────────────────────────────────────────────────────┘
  {
    id: 'v-gpro',
    hotelName: 'GPRO Valparaíso Palace & Spa',
    hotelId: 'gpro-valparaiso',
    descripcion: 'Jardines, piscina y spa sobre la Bahía de Palma.',
    src: 'https://livid.com/embed/oSYQOQcPwP5R?autoplay=1&loop=1&muted=1', // PROVISIONAL
    portada: publicImage('sec5-gal09-piscina-palmeras-v.jpg'),
  },
  {
    id: 'v-intercontinental',
    hotelName: 'InterContinental Lisboa',
    hotelId: 'intercontinental-lisboa',
    descripcion: 'Interiores, servicio y experiencia de ciudad.',
    src: 'https://livid.com/embed/oSYQOQcPwP5R?autoplay=1&loop=1&muted=1', // PROVISIONAL
    // Llevaba `sec3-gal08`, que es de Deltapark: la miniatura de un hotel
    // enseñaba la fachada de otro. Las fotos de InterContinental son `sec7`.
    portada: publicImage('sec7-gal02-fachada-h.jpg'),
  },
];
