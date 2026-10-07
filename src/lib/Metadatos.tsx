import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIdioma } from './idioma';
import { analizarRuta, ruta } from './rutas';
import { useSiteContent } from './content';
import { toTitleCase } from './hotelName';
import { HOTEL_STORIES } from '../../data/hotels';
import { CASE_STUDIES } from '../../data/caseStudies';
import { traducirCaso } from '../../data/textosEn';
import {
  DATOS_ESTRUCTURADOS,
  alternativas,
  imagenPublica,
  metadatos,
  recortar,
  urlPublica,
} from './seo';

/** ESCRIBE LA CABECERA DE CADA PÁGINA, y se reescribe sola al navegar.
 *
 *  No pinta nada. Vive dentro del enrutador, mira qué página se está viendo y
 *  deja en el `<head>` el título, la descripción, la dirección canónica, las
 *  alternativas por idioma y las etiquetas de vista previa. El
 *  prerenderizado recorre la web con un navegador de verdad, así que lo que
 *  esto escriba acaba grabado en el HTML de cada carpeta: no es una etiqueta
 *  que sólo exista mientras alguien navega.
 *
 *  POR QUÉ SIN LIBRERÍA. Un gestor de cabecera al uso son otras dependencias
 *  y otro proveedor envolviendo la aplicación. Como el prerenderizado ya usa
 *  un navegador, basta con escribir en el DOM, que es lo que haría la
 *  librería de todos modos.
 *
 *  LAS ETIQUETAS QUE PONE LLEVAN MARCA (`data-mt-seo`) para poder retirarlas
 *  al cambiar de página. Sin eso, ir de Abama a Binidufà dejaría las dos
 *  declaraciones de idioma a la vez y el buscador leería una contradicción.
 */

const MARCA = 'data-mt-seo';

function fijarMeta(clave: string, valor: string, porPropiedad = false) {
  const atributo = porPropiedad ? 'property' : 'name';
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${atributo}="${clave}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(atributo, clave);
    el.setAttribute(MARCA, '');
    document.head.appendChild(el);
  }
  el.setAttribute('content', valor);
}

function fijarEnlace(rel: string, href: string, hreflang?: string) {
  // Sólo puede haber una dirección canónica. Si quedara alguna escrita a mano
  // en el `index.html`, el buscador leería dos y no haría caso a ninguna.
  if (rel === 'canonical') {
    document.head.querySelectorAll('link[rel="canonical"]').forEach((e) => e.remove());
  }
  const el = document.createElement('link');
  el.setAttribute('rel', rel);
  el.setAttribute('href', href);
  if (hreflang) el.setAttribute('hreflang', hreflang);
  el.setAttribute(MARCA, '');
  document.head.appendChild(el);
}

/** PONE LOS DATOS ESTRUCTURADOS EN EL IDIOMA DE LA PÁGINA.
 *
 *  El bloque JSON-LD vive escrito a mano en `index.html` y es uno solo, así
 *  que las páginas inglesas declaraban en español su descripción, el cargo, los
 *  países y los servicios. Aquí se sustituyen esos cinco campos; todo lo demás
 *  (nombre, direcciones, redes) se queda intacto porque identifica la marca.
 *
 *  SE REESCRIBE EL BLOQUE EXISTENTE, no se añade otro: dos JSON-LD del mismo
 *  negocio con datos distintos es peor que uno en el idioma equivocado. Y si
 *  el JSON viniera roto, se deja como está en vez de tirar la página.
 */
function fijarDatosEstructurados(idioma: 'es' | 'en') {
  const el = document.head.querySelector<HTMLScriptElement>(
    'script[type="application/ld+json"]'
  );
  if (!el || !el.textContent) return;
  try {
    const datos = JSON.parse(el.textContent);
    const campos = DATOS_ESTRUCTURADOS[idioma];
    datos.description = campos.description;
    if (datos.founder) datos.founder.jobTitle = campos.jobTitle;
    datos.areaServed = campos.areaServed.map((name: string) => ({ '@type': 'Country', name }));
    datos.serviceType = campos.serviceType;
    datos.knowsAbout = campos.knowsAbout;
    el.textContent = JSON.stringify(datos, null, 2);
  } catch {
    /* JSON-LD ilegible: mejor dejarlo como estaba que dejarlo a medias. */
  }
}

export const Metadatos: React.FC = () => {
  const { pathname } = useLocation();
  const { idioma } = useIdioma();
  const contenido = useSiteContent();

  useEffect(() => {
    const partes = analizarRuta(pathname);
    // Una ruta que no se reconoce cae en Inicio, así que se anuncia como
    // Inicio: es lo que el visitante está viendo.
    const clave = partes?.clave ?? 'inicio';
    const param = partes?.param;

    // Las páginas con nombre propio se describen con su propio copy, el que
    // Mayurlin edita, no con una frase genérica.
    let propios: { titulo?: string; descripcion?: string; imagen?: string } | undefined;

    if (clave === 'trabajo' && param) {
      const i = HOTEL_STORIES.findIndex((h) => h.id === param);
      if (i !== -1) {
        // En versalitas dentro de la web, pero en el resultado de Google un
        // título todo en mayúsculas parece que grita. Se compone igual que en
        // la ficha del hotel.
        const nombre = toTitleCase(
          contenido.hotels[i]?.hotelName ?? HOTEL_STORIES[i].hotelName
        );
        const sufijo = idioma === 'en' ? 'Gallery' : 'Galería';
        propios = {
          titulo: `${nombre} · ${sufijo} · Mayu Travel`,
          descripcion: contenido.hotels[i]?.description ?? HOTEL_STORIES[i].description,
          imagen: imagenPublica(HOTEL_STORIES[i].coverImage),
        };
      }
    }

    if (clave === 'proyecto' && param) {
      const base = CASE_STUDIES.find((c) => c.slug === param);
      if (base) {
        const caso = traducirCaso(base, idioma);
        const hotel = HOTEL_STORIES.find((h) => h.id === caso.hotelId);
        propios = {
          titulo: `${caso.heading} · Mayu Travel`,
          descripcion: caso.sections[0]?.body,
          imagen: imagenPublica(hotel?.coverImage),
        };
      }
    }

    const meta = metadatos(idioma, clave, propios);
    const canonica = urlPublica(ruta(idioma, clave, param));

    // Fuera lo que dejó la página anterior.
    document.head.querySelectorAll(`[${MARCA}]`).forEach((el) => el.remove());

    document.title = meta.titulo;
    fijarMeta('description', meta.descripcion);
    fijarMeta('og:title', meta.titulo, true);
    fijarMeta('og:description', meta.descripcion, true);
    fijarMeta('og:url', canonica, true);
    fijarMeta('og:locale', idioma === 'en' ? 'en_GB' : 'es_ES', true);
    fijarMeta('og:locale:alternate', idioma === 'en' ? 'es_ES' : 'en_GB', true);
    fijarMeta('twitter:title', meta.titulo);
    fijarMeta('twitter:description', recortar(meta.descripcion, 120));
    if (meta.imagen) {
      fijarMeta('og:image', meta.imagen, true);
      fijarMeta('twitter:image', meta.imagen);
    }

    fijarEnlace('canonical', canonica);
    alternativas(clave, param).forEach((a) => fijarEnlace('alternate', a.href, a.hreflang));
    fijarDatosEstructurados(idioma);
  }, [pathname, idioma, contenido]);

  return null;
};
