import type { Idioma } from './idioma';
import type { Clave } from './rutas';
import { IDIOMAS, ruta } from './rutas';

/** LO QUE VE UN BUSCADOR DE CADA PÁGINA.
 *
 *  Hasta ahora toda la web compartía un solo título y una sola descripción,
 *  los del `index.html`. Para Google eso son dieciséis páginas diciendo
 *  exactamente lo mismo: no puede saber cuál enseñar a quien busca "fotógrafo
 *  de hoteles en Mallorca", y las trata como copias.
 *
 *  Aquí cada página tiene los suyos, en los dos idiomas, más la declaración
 *  `hreflang` que le dice al buscador que `/proyectos` y `/en/projects` son la
 *  misma página en dos lenguas, no dos páginas distintas compitiendo.
 *
 *  ESTOS TEXTOS NO SE VEN EN LA WEB. Son los que salen en el resultado de
 *  búsqueda y en la vista previa de un enlace al pegarlo en WhatsApp o
 *  LinkedIn. Por eso viven aquí y no en `content.json`: Mayurlin edita lo que
 *  se lee en pantalla, y esto es otra cosa.
 *
 *  LO DE LOS HOTELES SÍ SALE DE SU COPY. La descripción de la galería de un
 *  hotel es la que ella escribe en `content.json`, recortada. Así, cuando
 *  cambia el texto de Abama, cambia también lo que Google enseña de Abama,
 *  sin que nadie tenga que acordarse de tocar dos sitios.
 *
 *  SIN GUIONES QUE SEPAREN IDEAS, igual que el resto de la web.
 */

/** El dominio definitivo. Las direcciones canónicas y las alternativas se
 *  declaran SIEMPRE contra él, nunca contra la subcarpeta de GitHub Pages:
 *  así el taller no compite en Google con el sitio de verdad, y el día de la
 *  migración no hay que tocar ni una etiqueta. */
export const DOMINIO = 'https://mayurlintravel.eu';

export interface Metadatos {
  titulo: string;
  descripcion: string;
  /** Foto para la vista previa del enlace. Ruta pública, sin dominio. */
  imagen?: string;
}

type Fijas = Record<Clave, Metadatos>;

const FIJAS: Record<Idioma, Fijas> = {
  es: {
    inicio: {
      titulo: 'Producción visual para hoteles de lujo · Mayu Travel',
      descripcion:
        'Fotografía y vídeo para hoteles de lujo. Más de 35 propiedades en cinco países, entre ellas hoteles de Marriott, IHG y Wyndham.',
    },
    proyectos: {
      titulo: 'Proyectos y portafolio · Mayu Travel',
      descripcion:
        'Nueve producciones para hoteles de lujo en España, Portugal, Grecia y Suiza. Galerías completas y casos contados de principio a fin.',
    },
    equipo: {
      titulo: 'Equipo · Mayurlin Viera y Yerfran · Mayu Travel',
      descripcion:
        'Somos dos y vamos los dos. Fotografía y dirección creativa de Mayurlin Viera, producción audiovisual de Yerfran. Nada se subcontrata.',
    },
    contacto: {
      titulo: 'Contacto · Mayu Travel',
      descripcion:
        'Cuéntanos qué fotografías o vídeos necesita tu hotel, dónde y para cuándo. No hace falta tener el proyecto cerrado.',
    },
    trabajo: {
      titulo: 'Galería · Mayu Travel',
      descripcion: 'Recorrido fotográfico completo por la propiedad.',
    },
    proyecto: {
      titulo: 'Proyecto · Mayu Travel',
      descripcion: 'Un rodaje contado de principio a fin.',
    },
  },
  en: {
    inicio: {
      titulo: 'Visual production for luxury hotels · Mayu Travel',
      descripcion:
        'Photography and film for luxury hotels. More than 35 properties across five countries, among them hotels within Marriott, IHG and Wyndham.',
    },
    proyectos: {
      titulo: 'Projects and portfolio · Mayu Travel',
      descripcion:
        'Nine productions for luxury hotels in Spain, Portugal, Greece and Switzerland. Full galleries and shoots told from start to finish.',
    },
    equipo: {
      titulo: 'Team · Mayurlin Viera and Yerfran · Mayu Travel',
      descripcion:
        'There are two of us and both of us come. Photography and creative direction by Mayurlin Viera, film production by Yerfran. Nothing is outsourced.',
    },
    contacto: {
      titulo: 'Contact · Mayu Travel',
      descripcion:
        'Tell us what photography or film your hotel needs, where and by when. The project does not have to be settled yet.',
    },
    trabajo: {
      titulo: 'Gallery · Mayu Travel',
      descripcion: 'A full photographic walk through the property.',
    },
    proyecto: {
      titulo: 'Project · Mayu Travel',
      descripcion: 'One shoot told from start to finish.',
    },
  },
};

/** Recorta sin partir una palabra y sin dejar la frase colgando de una coma.
 *  Google corta alrededor de los 160 caracteres, así que más allá no se lee. */
export function recortar(texto: string, tope = 158): string {
  const limpio = texto.replace(/\s+/g, ' ').trim();
  if (limpio.length <= tope) return limpio;
  const corte = limpio.slice(0, tope);
  const hasta = Math.max(corte.lastIndexOf('. '), corte.lastIndexOf(' '));
  return corte.slice(0, hasta > 60 ? hasta : tope).replace(/[,;:]$/, '') + '…';
}

/** La dirección pública de una ruta interna, ya con dominio. */
export function urlPublica(rutaInterna: string): string {
  return `${DOMINIO}${rutaInterna === '/' ? '/' : rutaInterna}`;
}

/** Una ruta de foto del sitio (que lleva dentro la subcarpeta donde está
 *  colgado) convertida en dirección pública del dominio definitivo. */
export function imagenPublica(src: string | undefined): string | undefined {
  if (!src) return undefined;
  const i = src.indexOf('/images/');
  return i === -1 ? undefined : `${DOMINIO}${src.slice(i)}`;
}

/** Los metadatos de una página. `titulo` y `descripcion` sustituyen a los
 *  fijos cuando la página es la de un hotel o un caso, que tienen nombre
 *  propio. */
export function metadatos(
  idioma: Idioma,
  clave: Clave,
  propios?: Partial<Metadatos>
): Metadatos {
  const base = FIJAS[idioma][clave];
  return {
    titulo: propios?.titulo || base.titulo,
    descripcion: recortar(propios?.descripcion || base.descripcion),
    imagen: propios?.imagen,
  };
}

/** Las direcciones alternativas de esta misma página, para `hreflang`.
 *  `x-default` apunta al español, que es el idioma por defecto del sitio. */
export function alternativas(clave: Clave, param?: string) {
  const porIdioma = IDIOMAS.map((i) => ({
    hreflang: i,
    href: urlPublica(ruta(i, clave, param)),
  }));
  return [...porIdioma, { hreflang: 'x-default', href: urlPublica(ruta('es', clave, param)) }];
}
