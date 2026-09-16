import React, { useEffect, useState } from 'react';

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
 * REGLA PARA LOS PRÓXIMOS VÍDEOS: pegar la dirección y ya. Si algo no se
 * reproduce, se mira en el panel del servicio antes que en este archivo.
 */
interface VideoNubeProps {
  /** La dirección de incrustar tal cual la da el servicio. */
  src: string;
  /** Proporción de la caja. 56.25% es 16:9, que es lo que da el proveedor. */
  proporcion?: string;
  /** Clases del contenedor exterior. */
  className?: string;
}

export const VideoNube: React.FC<VideoNubeProps> = ({
  src,
  proporcion = '56.25%',
  className,
}) => (
  <div className={className} style={{ padding: `${proporcion} 0 0 0`, position: 'relative', width: '100%' }}>
    <iframe
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share"
      allowFullScreen
      frameBorder="0"
      referrerPolicy="strict-origin-when-cross-origin"
      src={src}
      title="Vídeo de producción para hotel"
    />
  </div>
);

/**
 * Ancho de móvil, el mismo corte `md` de Tailwind.
 *
 * Hace falta en JavaScript y no basta con `md:hidden`: ocultar un iframe con
 * CSS no impide que cargue ni que reproduzca, y con una copia para cada tamaño
 * el vídeo se descargaba dos veces y sonaban dos reproductores a la vez.
 */
export function useEsMovil(): boolean {
  const consulta = '(max-width: 767px)';
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
  }, []);
  return movil;
}
