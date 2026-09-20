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
  {
    id: 'v-gpro',
    hotelName: 'GPRO Valparaíso Palace & Spa',
    hotelId: 'gpro-valparaiso',
    descripcion: 'Jardines, piscina y spa sobre la Bahía de Palma.',
    // El archivo que mandó Mayurlin es una MUESTRA en baja resolución
    // ("WEB CLIENTES HORIZONTAL (MUESTRA) LOW RESOLU"). Funciona para verlo
    // montado, pero choca con su propia regla de máxima calidad siempre:
    // conviene cambiarlo por el definitivo antes de migrar al dominio propio.
    src: 'https://livid.com/embed/bAN6qRGuhiHw?autoplay=1&loop=1&muted=1',
    portada: publicImage('sec5-gal09-piscina-palmeras-v.jpg'),
  },
  // ┌──────────────────────────────────────────────────────────────────────┐
  // │  PROVISIONAL: el de abajo apunta al MISMO vídeo que el primero, el de │
  // │  Abama. Está así para que Mayurlin pueda ver el carrusel funcionando  │
  // │  mientras termina de subir el suyo.                                   │
  // │                                                                       │
  // │  QUÉ HAY QUE CAMBIAR: sólo la línea `src`, pegando la dirección de    │
  // │  incrustar que da el servicio. El hotel, la portada y el texto ya son │
  // │  los definitivos.                                                     │
  // │                                                                       │
  // │  ANTES DE MIGRAR AL DOMINIO PROPIO hay que haberlo hecho: publicar    │
  // │  esto tal cual pondría el vídeo de Abama bajo el nombre de otro       │
  // │  hotel, y eso es atribuir un trabajo a quien no es.                   │
  // └──────────────────────────────────────────────────────────────────────┘
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


/** Una pieza vertical (9:16), de las que se publican en redes del hotel.
 *
 *  `hotel` y `tipo` son la firma, con el mismo reparto que el resto de los
 *  carruseles hermanos: el nombre en serif y debajo el rótulo en versalitas.
 *  `titular` es la línea grande en serif que envuelve al vídeo, el equivalente
 *  a la cita de "Voces de la industria".
 *
 *  `hotelId` sólo si esa propiedad tiene ficha en `data/hotels.ts`. Si no la
 *  tiene, la firma no enlaza: mandar a una página que no existe es peor que
 *  no mandar a ninguna.
 */
export interface VideoVertical {
  id: string;
  hotel: string;
  tipo: string;
  titular: string;
  src: string;
  hotelId?: string;
  /** Marca las que hay que sustituir antes de migrar al dominio propio. */
  provisional?: boolean;
}

/** Las piezas verticales del bloque de vídeos de Inicio.
 *
 *  SÓLO SE PINTAN LAS QUE NO SON PROVISIONALES. El carrusel se ajusta a las
 *  que haya: con tres, tres. En la constelación anterior hacían falta cuatro
 *  huecos llenos sí o sí, y eso obligó a repetir una pieza; aquí no, y repetir
 *  una pieza en un portafolio se nota mucho más cuando se ve de una en una.
 *
 *  UN SOLO REPRODUCTOR MONTADO, el de la pieza a la vista. Antes eran cuatro
 *  a la vez -- y durante una ronda, ocho, porque había un juego de tarjetas
 *  para móvil y otro para escritorio y ocultar un iframe con CSS no impide que
 *  descargue.
 */
export const VIDEOS_VERTICALES: VideoVertical[] = [
  {
    id: 'stic-restaurante',
    hotel: 'Stic Urban',
    tipo: 'Restaurante',
    titular: 'La sala llena, a la hora a la que de verdad se llena.',
    src: 'https://livid.com/embed/aBvRZRirC6Bl?autoplay=1&loop=1&muted=1',
  },
  {
    id: 'stic-spa',
    hotel: 'Stic Urban',
    tipo: 'Spa',
    titular: 'Un spa se enseña por la luz y el ritmo, no por el catálogo.',
    src: 'https://livid.com/embed/AFaBlCH42ZBt?autoplay=1&loop=1&muted=1',
  },
  {
    id: 'stic-roof',
    hotel: 'Stic Urban',
    tipo: 'Azotea',
    titular: 'La azotea a la hora en que justifica la reserva.',
    src: 'https://livid.com/embed/RU8PsfvjtTor?autoplay=1&loop=1&muted=1',
  },
];
