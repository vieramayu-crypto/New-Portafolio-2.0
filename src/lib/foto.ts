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
