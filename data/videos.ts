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
  /** La misma línea en inglés. Si falta, se queda la española. */
  descripcionEn?: string;
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
    descripcionEn: 'Architecture, gardens and the experience of the stay.',
    src: 'https://livid.com/embed/oSYQOQcPwP5R?autoplay=1&loop=1&muted=1',
    portada: publicImage('sec1-gal4-playa-h.jpg'),
  },
  {
    id: 'v-binidufa',
    hotelName: 'Vestige Collection, Binidufà',
    hotelId: 'vestige-binidufa',
    descripcion: 'Finca, patios y piscina en el interior de Menorca.',
    descripcionEn: 'Estate, courtyards and pool in the interior of Menorca.',
    src: 'https://livid.com/embed/wbn5AZWOb8V9?autoplay=1&loop=1&muted=1',
    portada: publicImage('sec2-gal01-aerea-h.jpg'),
  },
  {
    id: 'v-gpro',
    hotelName: 'GPRO Valparaíso Palace & Spa',
    hotelId: 'gpro-valparaiso',
    descripcion: 'Jardines, piscina y spa sobre la Bahía de Palma.',
    descripcionEn: 'Gardens, pool and spa above the Bay of Palma.',
    // OJO CON EL NOMBRE DEL ARCHIVO: dice "MUESTRA ... LOW RESOLU", y durante
    // varias rondas se dio por hecho que era una copia de baja calidad que
    // había que sustituir. Mayurlin lo aclaró: el título miente, el vídeo es
    // el bueno. No hay nada que cambiar aquí.
    src: 'https://livid.com/embed/bAN6qRGuhiHw?autoplay=1&loop=1&muted=1',
    portada: publicImage('sec5-gal09-piscina-palmeras-v.jpg'),
  },
  {
    id: 'v-esplendido',
    hotelName: 'Hotel Espléndido',
    hotelId: 'hotel-esplendido',
    descripcion: 'Terrazas y piscina frente a la Bahía de Port de Sóller.',
    descripcionEn: 'Terraces and pool facing the Bay of Port de Sóller.',
    src: 'https://livid.com/embed/rx3uWQWDbVyM?autoplay=1&loop=1&muted=1',
    portada: publicImage('sec6-portada.jpg'),
  },
  {
    id: 'v-deltapark',
    hotelName: 'Deltapark Vitalresort',
    hotelId: 'deltapark-vitalresort',
    descripcion: 'Spa, lago Thun y arquitectura alpina contemporánea.',
    descripcionEn: 'Spa, Lake Thun and contemporary alpine architecture.',
    src: 'https://livid.com/embed/BHmN51jTIGSH?autoplay=1&loop=1&muted=1',
    portada: publicImage('sec3-gal08-fachada-h.jpg'),
  },
  {
    // Esta entrada era la última que apuntaba a un vídeo que no era suyo: el
    // de Abama bajo el nombre de InterContinental, que es atribuir un trabajo
    // a quien no lo hizo. Ya lleva el suyo, y con esto no queda en la web
    // ninguna pieza prestada.
    id: 'v-intercontinental',
    hotelName: 'InterContinental Lisboa',
    hotelId: 'intercontinental-lisboa',
    descripcion: 'Interiores, servicio y experiencia de ciudad.',
    descripcionEn: 'Interiors, service and the experience of the city.',
    src: 'https://livid.com/embed/AnikHPeM1YCc?autoplay=1&loop=1&muted=1',
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
  /** El rótulo y la línea grande en inglés. Si faltan, se queda el español. */
  tipoEn?: string;
  titularEn?: string;
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
    // ABRE LA GALERÍA, y no es casualidad. Las piezas con ficha de hotel
    // detrás van primero, porque su firma enlaza a una galería de verdad; las
    // tres de Stic Urban cierran, porque ese hotel no tiene página y su firma
    // no lleva a ningún sitio. Así lo primero que se ve de este formato es un
    // hotel con nombre, fotos y galería propia.
    //
    // OJO CON EL RÓTULO: desde este entorno no se puede ver el vídeo (el
    // proveedor está bloqueado), así que `tipo` y `titular` se escribieron
    // sobre lo que es el hotel -- un Vitalresort a orillas del lago Thun, con
    // un spa de 2.000 m² -- y no sobre lo que enseña el plano. Si la pieza va
    // de otra cosa, es cambiar estas dos líneas.
    id: 'deltapark-bienestar',
    hotel: 'Deltapark Vitalresort',
    hotelId: 'deltapark-vitalresort',
    tipo: 'Bienestar',
    titular: 'El lago marca el ritmo y el resort lo sigue.',
    tipoEn: 'Wellbeing',
    titularEn: 'The lake sets the pace and the resort follows.',
    src: 'https://livid.com/embed/ZEpjpzzaB-K0?autoplay=1&loop=1&muted=1',
  },
  {
    // LAS DOS DE GPRO VALPARAÍSO. Es el cliente que más ha repetido (tres
    // rodajes en tres años) y tiene ficha, caso de estudio y pieza
    // horizontal propia, así que su firma enlaza igual que la de Deltapark.
    //
    // ESTOS DOS RÓTULOS LOS DICTA ELLA, no son una lectura del plano: desde
    // este entorno el proveedor está bloqueado y no se puede ver ninguno de
    // los dos vídeos. La primera versión los etiquetó "Spa" y "Jardines"
    // deduciéndolo de lo que es el hotel, y las dos estaban mal. Mayurlin lo
    // corrigió: a la primera la llama "Despertar en Valparaíso" (mañana,
    // habitación, luz dorada, cama) y a la segunda "Un día en Valparaíso"
    // (piscina, jacuzzi en la habitación, pareja, vistas).
    //
    // LECCIÓN, PARA NO REPETIRLA: con un vídeo que no se puede ver, deducir el
    // rótulo de lo que ES el hotel no funciona, y emparejar a ciegas tampoco.
    // Hubo que corregirlo DOS veces: primero el rótulo, y luego el reparto,
    // porque las direcciones estaban cruzadas. Las de ahora las confirmó ella
    // mirando la web.
    //
    // "Habitación" y no "Despertar" porque el rótulo también le dice a un
    // hotel qué sabemos rodar, y la habitación es el primer activo que pide
    // cualquiera. "Un día" es suyo tal cual: dice que es un recorrido y no un
    // espacio, y no se confunde con el de al lado.
    id: 'gpro-habitacion',
    hotel: 'GPRO Valparaíso Palace & Spa',
    hotelId: 'gpro-valparaiso',
    tipo: 'Habitación',
    titular: 'La mañana entra por la ventana, y el día empieza ahí.',
    tipoEn: 'Room',
    titularEn: 'Morning comes in through the window, and the day starts there.',
    src: 'https://livid.com/embed/go09mrrDKdd2?autoplay=1&loop=1&muted=1',
  },
  {
    id: 'gpro-dia',
    hotel: 'GPRO Valparaíso Palace & Spa',
    hotelId: 'gpro-valparaiso',
    tipo: 'Un día',
    titular: 'Un día entero en el hotel, sin salir de él.',
    tipoEn: 'A day',
    titularEn: 'A whole day at the hotel, without leaving it.',
    src: 'https://livid.com/embed/r-awOhn9HWPr?autoplay=1&loop=1&muted=1',
  },
  {
    id: 'stic-restaurante',
    hotel: 'Stic Urban',
    tipo: 'Restaurante',
    titular: 'La sala llena, a la hora a la que de verdad se llena.',
    tipoEn: 'Restaurant',
    titularEn: 'A full room, at the hour when it really fills up.',
    src: 'https://livid.com/embed/aBvRZRirC6Bl?autoplay=1&loop=1&muted=1',
  },
  {
    id: 'stic-spa',
    hotel: 'Stic Urban',
    tipo: 'Spa',
    titular: 'Un spa se enseña por la luz y el ritmo, no por el catálogo.',
    tipoEn: 'Spa',
    titularEn: 'A spa is shown by its light and its pace, not by a catalogue.',
    src: 'https://livid.com/embed/AFaBlCH42ZBt?autoplay=1&loop=1&muted=1',
  },
  {
    id: 'stic-roof',
    hotel: 'Stic Urban',
    tipo: 'Azotea',
    titular: 'La azotea a la hora en que justifica la reserva.',
    tipoEn: 'Rooftop',
    titularEn: 'The rooftop at the hour that justifies the booking.',
    src: 'https://livid.com/embed/RU8PsfvjtTor?autoplay=1&loop=1&muted=1',
  },
];
