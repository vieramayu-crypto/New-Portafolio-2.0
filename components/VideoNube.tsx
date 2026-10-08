import React, { useEffect, useState } from 'react';
import { useIdioma } from '../src/lib/idioma';
import { crearT } from '../src/lib/textos';

/**
 * Vídeo del servicio en la nube de Mayurlin.
 *
 * ESTE COMPONENTE ES, A PROPÓSITO, EL CÓDIGO QUE DA EL PROVEEDOR. NADA MÁS.
 *
 * Historial, para no repetirlo: se le fueron añadiendo capas -- montar el
 * iframe con un IntersectionObserver, sondear la dirección con fetch antes de
 * cargarla, bloquear los toques, duplicar el iframe para móvil y escritorio, y
 * por último añadirle `playsinline=1` a la dirección. Cada capa tenía su
 * motivo y cada capa lo dejó peor, hasta que dejó de reproducirse en todos los
 * navegadores. Ninguna estaba verificada contra el servicio real, porque desde
 * el entorno de desarrollo no hay acceso a dominios externos.
 *
 * Así que la línea base vuelve a ser la del proveedor, literal:
 *
 *   <div style="padding:56.25% 0 0 0;position:relative;width:100%;">
 *     <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;"
 *       allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share"
 *       allowfullscreen frameborder="0"
 *       referrerpolicy="strict-origin-when-cross-origin"
 *       src="..."></iframe>
 *   </div>
 *
 * Lo que se conserva de ese código, sin tocar:
 *
 *   - LA DIRECCIÓN, tal cual. No se le añade ni se le quita un parámetro.
 *     Los ajustes de reproducción (autoplay, loop, muted) se configuran en el
 *     panel del servicio y viajan en la dirección que él genera.
 *   - Los atributos `allow`, `allowFullScreen`, `frameBorder` y
 *     `referrerPolicy`, con los mismos valores.
 *   - La caja de proporción por `padding` y el iframe absoluto al 100%.
 *
 * Dos diferencias, y las dos están FUERA del iframe, así que no pueden afectar
 * a la reproducción:
 *
 *   - `title` es genérico en vez del nombre del archivo, que decía
 *     "MASTER 4K SDR — H265 10BIT" y se publicaba en el HTML.
 *   - `proporcion` permite una caja distinta de 16:9 sin tocar nada más.
 *
 * SI HAY QUE RECORTAR (el fondo de Inicio, que va a sangre completa), se
 * recorta el CONTENEDOR desde fuera, nunca deformando el iframe.
 *
 * EL RECORTE DE SEGURIDAD (`recorte`): unos pocos píxeles que se comen por los
 * cuatro lados. Mayurlin vio una línea negra de unos 4 px en el borde de
 * arriba, en Inicio y en la galería. Medido aquí: la caja es 16:9 exacta
 * (1600,02 x 900) y el iframe la cubre con 0 px de hueco en los cuatro bordes,
 * a 1x y a 2x. O sea que la línea la pinta el reproductor DENTRO del iframe, y
 * desde fuera de un marco de otro dominio no se puede ni mirar ni corregir.
 * Ella comprobó además que el archivo no la tiene.
 *
 * Así que se tapa, que es lo que hace cualquier reproductor de televisión: el
 * iframe crece unos píxeles y el contenedor recorta el sobrante. Crece EN
 * PROPORCIÓN -- y la proporción es la de ESTA caja, no una fija: ver el
 * cálculo de `rx` más abajo, que es justo lo que estaba mal para los
 * verticales. Así la imagen no se deforma: sólo se pierde ese par de píxeles
 * de borde. A 900 px de alto, 4 px son un 0,9%: invisible.
 *
 * Y NO CRECER EN PROPORCIÓN NO ES UN DETALLE ESTÉTICO. El reproductor de
 * dentro respeta la forma del vídeo: si el iframe no la tiene, centra la
 * imagen y rellena lo que sobra con sus propias barras. Eso es lo que dejaba
 * una línea negra fina en el borde de los verticales.
 *
 * REGLA PARA LOS PRÓXIMOS VÍDEOS: pegar la dirección y ya. Si algo no se
 * reproduce, se mira en el panel del servicio antes que en este archivo.
 */
/** Cuántos píxeles de borde se comen por defecto. Un solo número para todos
 *  los vídeos de la web: si mañana el reproductor deja de pintar esa línea, se
 *  pone a 0 aquí y se acabó. */
const RECORTE_POR_DEFECTO = 5;

interface VideoNubeProps {
  /** La dirección de incrustar tal cual la da el servicio. */
  src: string;
  /** Proporción de la caja. 56.25% es 16:9, que es lo que da el proveedor. */
  proporcion?: string;
  /** Clases del contenedor exterior. */
  className?: string;
  /** Píxeles de borde que se comen por arriba y por abajo (y lo proporcional
   *  a los lados). Tapa lo que pinte el reproductor en el borde. 0 lo apaga. */
  recorte?: number;
  /** Aviso de que el marco ha terminado de cargar.
   *
   *  ES LO ÚNICO QUE SE PUEDE SABER DESDE FUERA. El vídeo vive en otro
   *  dominio, así que el navegador no deja mirar dentro del marco: no hay
   *  forma de preguntarle si ya está reproduciendo, ni de mandarle que
   *  empiece. `load` del propio `<iframe>` avisa de que la página del
   *  reproductor está puesta, que es un poco antes de que pinte el primer
   *  fotograma -- de ahí el respiro que espera `GaleriaPiezas`.
   *
   *  No toca nada de lo que da el proveedor: es un escucha del elemento, no
   *  un parámetro de la dirección ni un atributo suyo. */
  alCargar?: () => void;
}

export const VideoNube: React.FC<VideoNubeProps> = ({
  src,
  proporcion = '56.25%',
  className,
  recorte = RECORTE_POR_DEFECTO,
  alCargar,
}) => {
  const t = crearT(useIdioma().idioma);

  /* EL CRECIMIENTO HORIZONTAL SALE DE LA PROPORCIÓN DE ESTA CAJA, no de 16/9.
   *
   *  Estaba escrito a 16/9 fijo, y para los verticales eso era al revés: una
   *  caja 9:16 que crece 5 px de alto tiene que crecer 2,81 a los lados
   *  (5 x 9/16), no 8,89 (5 x 16/9). Medido en la galería a 1440x900, el
   *  iframe del vertical quedaba en 437,95 x 757 -- proporción 0,5785 contra
   *  los 0,5625 de la caja, un 2,8% más ancho de lo que le tocaba.
   *
   *  Y UN IFRAME DESPROPORCIONADO SE NOTA, porque el reproductor de dentro sí
   *  respeta la forma del vídeo: lo centraba en 425,81 px y rellenaba los
   *  12,14 que sobraban con sus propias barras negras, 6,07 por lado. El
   *  recorte se comía 8,89, así que quedaban 2,82 px de margen -- y con el
   *  ancho de la caja en 420,1875 px ese margen se iba en el redondeo de
   *  subpíxel, por un lado sí y por el otro no. De ahí la línea negra fina
   *  que Mayurlin veía SÓLO en el borde derecho de todos los verticales.
   *
   *  Con la proporción correcta el iframe conserva la forma de la caja, el
   *  vídeo lo llena entero y no hay barras que tapar. */
  const r = Math.max(0, recorte);
  const alturaPorAncho = parseFloat(proporcion) / 100;
  const anchoPorAltura = alturaPorAncho > 0 ? 1 / alturaPorAncho : 16 / 9;
  const rx = +(r * anchoPorAltura).toFixed(2);

  return (
    <div
      className={className}
      style={{
        padding: `${proporcion} 0 0 0`,
        position: 'relative',
        width: '100%',
        overflow: r > 0 ? 'hidden' : undefined,
      }}
    >
      <iframe
        style={{
          position: 'absolute',
          top: -r,
          left: -rx,
          width: `calc(100% + ${rx * 2}px)`,
          height: `calc(100% + ${r * 2}px)`,
        }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share"
        allowFullScreen
        frameBorder="0"
        referrerPolicy="strict-origin-when-cross-origin"
        src={src}
        onLoad={alCargar}
        title={t('videoTitulo')}
      />
    </div>
  );
};

/**
 * Ancho de móvil, el mismo corte `md` de Tailwind.
 *
 * Hace falta en JavaScript y no basta con `md:hidden`: ocultar un iframe con
 * CSS no impide que cargue ni que reproduzca, y con una copia para cada tamaño
 * el vídeo se descargaba dos veces y sonaban dos reproductores a la vez.
 */
export function useEsMovil(consulta = '(max-width: 767px)'): boolean {
  const [movil, setMovil] = useState(() =>
    typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(consulta).matches,
  );
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(consulta);
    const alCambiar = () => setMovil(mq.matches);
    alCambiar();
    mq.addEventListener('change', alCambiar);
    return () => mq.removeEventListener('change', alCambiar);
  }, [consulta]);
  return movil;
}
