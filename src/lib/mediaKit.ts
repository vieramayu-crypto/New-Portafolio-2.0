import type { Idioma } from './idioma';

/** EL MEDIA KIT: DOS PÁGINAS QUE NO SE ENLAZAN DESDE NINGUNA PARTE.
 *
 *  Pedido de Mayurlin: *"quiero incluir el media kit dentro de la web... que
 *  cuando yo comparta el enlace directo las personas puedan acceder, pero que
 *  sea completamente privado. No quiero que nadie que entre a mi web pueda
 *  acceder a mi media kit. Del media kit se puede salir a mi web, pero no de
 *  la web entrar al media kit."*
 *
 *  LO QUE ESTO ES, Y LO QUE NO. En una web estática no hay "privado" sin
 *  contraseña: todo lo que está en el servidor se puede pedir. Lo que sí hay
 *  es NO LISTADO, que es lo mismo que hace un enlace de "cualquiera con el
 *  enlace" de Drive:
 *
 *    - no está en `src/lib/rutas.ts`, así que no entra en el sitemap ni en el
 *      prerenderizado (los dos despliegues vigilan que sigan siendo 32
 *      páginas, y éstas no las mueven);
 *    - no sale en el menú, ni en el pie, ni en ningún enlace de la web;
 *    - la página se pone `noindex, nofollow` mientras se mira, para que no
 *      acabe en Google ni aunque alguien la enlace desde fuera.
 *
 *  Y EL CAMINO ES DE UNA SOLA DIRECCIÓN, que es justo lo que ella pidió: desde
 *  el media kit se sale al portafolio con un enlace al pie, pero desde la web
 *  no hay forma de llegar aquí.
 *
 *  LAS DIRECCIONES SON LIMPIAS A PROPÓSITO, decisión suya entre las dos
 *  opciones: `/media-kit` y `/en/media-kit`, que se dictan por teléfono y se
 *  ponen en un correo sin que parezcan un enlace de descarga sospechoso. El
 *  precio es que se pueden adivinar escribiéndolas; Google no las va a
 *  enseñar, pero una persona curiosa puede dar con ellas. Si algún día eso
 *  molesta, aquí se le añade un código al final y ya está. */
export const RUTA_MEDIA_KIT: Record<Idioma, string> = {
  es: '/media-kit',
  en: '/en/media-kit',
};

/** Si esta dirección es una de las dos del media kit. Sirve para apagarle a la
 *  página la cabecera, el pie y la intro: es una página suelta que se comparte
 *  por enlace, no una sección más de la web. */
export function esMediaKit(pathname: string): boolean {
  const limpio = pathname.replace(/\/+$/, '') || '/';
  return Object.values(RUTA_MEDIA_KIT).includes(limpio);
}

/** LOS DOS ARCHIVOS, Y SUS NOMBRES NO CAMBIAN NUNCA.
 *
 *  Viven en `public/media-kit/`. Que el nombre sea fijo es la mitad del
 *  encargo: *"que una vez que yo actualice el media kit sea tan simple como
 *  subirlo"*. Para publicar una versión nueva se sube el PDF con este mismo
 *  nombre encima del anterior, y el enlace que ella ya haya compartido sigue
 *  valiendo. Nada de código, nada de fechas en el nombre. */
export const ARCHIVO_MEDIA_KIT: Record<Idioma, string> = {
  es: 'mayu-travel-media-kit-es.pdf',
  en: 'mayu-travel-media-kit-en.pdf',
};

/** La dirección del PDF, colgada de donde esté el sitio. Igual que las fotos,
 *  pasa por `BASE_URL` y nunca por una ruta absoluta escrita a mano: así vale
 *  en la subcarpeta de GitHub Pages y en la raíz de su dominio. */
export function urlMediaKit(idioma: Idioma): string {
  return `${import.meta.env.BASE_URL}media-kit/${ARCHIVO_MEDIA_KIT[idioma]}`;
}

interface CopyMediaKit {
  rotulo: string;
  titular: string;
  linea: string;
  descargar: string;
  abrir: string;
  portafolio: string;
  pendiente: string;
}

/** EL COPY VIVE AQUÍ Y NO EN `content.json` a propósito: son siete frases que
 *  no se tocan nunca, y meterlas en el archivo que Mayurlin edita sería
 *  darle una cosa más que mantener a cambio de nada. El titular es el mismo
 *  del hero, que ya está aprobado en los dos idiomas. */
export const COPY_MEDIA_KIT: Record<Idioma, CopyMediaKit> = {
  es: {
    rotulo: 'MEDIA KIT · 2026',
    titular: 'Fotografía y producción audiovisual para hoteles de lujo.',
    linea: 'Servicios, formatos de entrega y cómo trabajamos con cada propiedad.',
    descargar: 'Descargar PDF',
    abrir: 'Abrir en el navegador',
    portafolio: 'Ver el portafolio',
    pendiente: 'El media kit se está actualizando. Escríbeme y te lo mando ahora mismo.',
  },
  en: {
    rotulo: 'MEDIA KIT · 2026',
    titular: 'Photography and film production for luxury hotels.',
    linea: 'Services, delivery formats and how we work with each property.',
    descargar: 'Download PDF',
    abrir: 'Open in the browser',
    portafolio: 'See the work',
    pendiente: 'The media kit is being updated. Write to me and I will send it over.',
  },
};

/** El correo que cierra la página. El mismo de Contacto y del pie. */
export const CORREO = 'mayuviera@gmail.com';
