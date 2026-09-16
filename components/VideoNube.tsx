import React, { useEffect, useState } from 'react';

/**
 * Vídeo incrustado del servicio en la nube. UNA sola implementación para toda
 * la web -- el fondo de Inicio y los vídeos de las galerías -- para que cada
 * arreglo valga para todos y no haya que repetirlo en cada vídeo nuevo.
 *
 * ================================================================
 * POR QUÉ NO SE REPRODUCÍA FUERA DE SAFARI
 * ================================================================
 *
 * En Safari funcionaba y en Chrome y Opera se quedaba congelado o en negro.
 * El reproductor es del proveedor y no se puede depurar desde fuera, así que
 * la vía fue quitar todo lo que este código hacía DE MÁS entre el navegador y
 * ese iframe. Eran tres cosas, y las tres son nuestras, no del proveedor:
 *
 * 1. EL IFRAME SE CREABA DESDE JAVASCRIPT, NO CON LA PÁGINA.
 *    Se montaba al acercarse a pantalla para no cargar el vídeo antes de
 *    tiempo. Pero el permiso para reproducir sin sonido y sin que nadie toque
 *    nada no se reparte igual a un marco que nace con el documento que a uno
 *    que aparece después: Safari lo concedía, Chrome no siempre. Ahora el
 *    iframe va en el HTML desde el primer momento, que es la situación en la
 *    que el propio proveedor prueba sus vídeos. Se paga con carga por
 *    adelantado; se gana que se reproduzca.
 *
 * 2. SE PEDÍA LA MISMA DIRECCIÓN DOS VECES.
 *    Antes de montar nada se llamaba a la dirección del vídeo con `no-cors`
 *    para saber si el servicio respondía. Esa llamada deja en la caché una
 *    respuesta OPACA -- el navegador la guarda pero no puede leerla -- y justo
 *    después el iframe pide esa misma dirección. Qué hace cada navegador con
 *    esa entrada de caché al cargar un documento no está garantizado, y es
 *    exactamente la clase de detalle que funciona en un motor y falla en otro.
 *    El sondeo desaparece de la carga del vídeo.
 *
 * 3. NO HABÍA FORMA DE DARLE AL PLAY.
 *    El iframe llevaba `pointer-events-none`, así que si el navegador se
 *    negaba a reproducir solo, el reproductor enseñaba su botón de play y
 *    nadie podía pulsarlo. Da igual la causa de fondo: ahora el vídeo de las
 *    galerías se puede tocar, así que siempre hay salida manual. El fondo de
 *    Inicio sigue sin ser tocable a propósito -- ocupa la pantalla entera y
 *    capturaría el gesto de desplazar -- pero ahí es decorado, no contenido.
 *
 * ================================================================
 * Y POR QUÉ SE QUEDA EN NEGRO TAMBIÉN EN SAFARI
 * ================================================================
 *
 * Porque el BUCLE no se está aplicando. El vídeo se reproduce una vez, llega
 * al final y se queda parado en el último fotograma, que es negro. Sin
 * controles no hay forma de reiniciarlo. Eso explica que pase en todos los
 * navegadores y que tarde un rato en pasar, y descarta que sea la política de
 * reproducción automática, que fallaría desde el primer segundo.
 *
 * `loop=1` va en la dirección, así que o el reproductor no lo lee de ahí o el
 * ajuste manda desde el panel del servicio -- donde, por cierto, se reinicia
 * al cerrar la ventana. Desde fuera de un iframe de otro dominio no se puede
 * ni consultar ni forzar: no hay acceso al reproductor.
 *
 * LA SOLUCIÓN DE VERDAD ES SERVIR EL ARCHIVO. Con un enlace directo al .mp4
 * (en H.264, no H.265) este componente usa un <video> normal, y entonces el
 * bucle, el silencio y la reproducción automática son atributos nuestros:
 * garantizados, iguales en todos los navegadores y verificables. Por eso
 * admite las dos formas -- incrustado y archivo -- y cambiar de una a otra es
 * cambiar la dirección en los datos.
 *
 * ================================================================
 * REGLA PARA LOS PRÓXIMOS VÍDEOS
 * ================================================================
 *
 * Usar SIEMPRE este componente. No volver a montar el iframe desde un
 * IntersectionObserver, no pre-pedir su dirección con fetch, y dejar tocable
 * todo vídeo que sea contenido. Los parámetros van en la dirección
 * (`autoplay=1&loop=1&muted=1&playsinline=1`), no en atributos del iframe.
 *
 * Y preferir SIEMPRE el archivo directo al incrustado cuando el servicio lo
 * dé: es la única forma de que el bucle esté garantizado.
 */
interface VideoNubeProps {
  /** Dirección de incrustar que da el servicio. */
  src: string;
  /** Clases del <iframe>: es lo que decide el recorte en cada sitio. */
  className: string;
  /**
   * `false` en el fondo decorativo de Inicio, que ocupa toda la pantalla y
   * se tragaría el gesto de desplazar. `true` (por defecto) en los vídeos de
   * contenido, para que siempre se puedan arrancar a mano.
   */
  tocable?: boolean;
  /** Sólo para archivo directo: primer fotograma mientras carga. */
  poster?: string;
}

/**
 * iOS es especialmente estricto con la reproducción dentro de un marco: sin
 * `playsinline` intenta abrir el reproductor a pantalla completa, no puede, y
 * se queda en el primer fotograma. Se añade aquí y no en cada dato para que
 * no dependa de acordarse al pegar una dirección nueva.
 */
function conPlaysinline(src: string): string {
  if (/[?&]playsinline=/.test(src)) return src;
  return src + (src.includes('?') ? '&' : '?') + 'playsinline=1';
}

/** Un enlace a un archivo de vídeo, frente a una página de incrustar. */
function esArchivo(src: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(src);
}

export const VideoNube: React.FC<VideoNubeProps> = ({ src, className, tocable = true, poster }) => {
  const clases = `${tocable ? '' : 'pointer-events-none '}${className}`;

  /* Archivo directo: el bucle es un atributo nuestro, no una preferencia que
     el reproductor del proveedor pueda ignorar. `muted` va también por
     propiedad en el momento del montaje porque Safari evalúa a veces si puede
     reproducir antes de que el DOM refleje el silencio. */
  if (esArchivo(src)) {
    return (
      <video
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        ref={(n) => { if (n) n.muted = true; }}
        className={clases}
      />
    );
  }

  return (
    <iframe
      src={conPlaysinline(src)}
      title=""
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      className={clases}
    />
  );
};

/**
 * Ancho de móvil, el mismo corte `md` de Tailwind.
 *
 * Hace falta en JavaScript y no basta con `md:hidden`: ocultar un iframe con
 * CSS no impide que cargue ni que reproduzca. Poniendo una copia para móvil y
 * otra para escritorio, el vídeo se descargaba DOS veces y sonaban dos
 * reproductores a la vez. Con esto se monta exactamente uno.
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
