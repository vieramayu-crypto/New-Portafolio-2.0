import React, { useEffect, useRef, useState } from 'react';

/**
 * Vídeo incrustado del servicio en la nube. UNA sola implementación para toda
 * la web: el fondo de Inicio y los vídeos dentro de las galerías usan este
 * componente, así que cualquier arreglo vale para todos y no hay que repetirlo
 * en cada vídeo nuevo.
 *
 * POR QUÉ SE CONGELABA EN CHROME
 *
 * La versión anterior montaba el iframe al entrar en pantalla y lo DESMONTABA
 * al salir, para parar la reproducción sin depender del SDK del proveedor.
 * Funcionaba en Safari y se quedaba en negro en Chrome: al volver a bajar, el
 * iframe se creaba de cero y su reproducción automática ya no arrancaba. La
 * primera carga de una página tiene permiso de autoplay silenciado; un marco
 * creado después, por JavaScript y sin ningún gesto del visitante, no siempre
 * lo hereda. Safari lo permitía, Chrome no, y el resultado era el primer
 * fotograma congelado sin controles para rescatarlo.
 *
 * Ahora el iframe se monta UNA vez, la primera que la sección se acerca a
 * pantalla, y no se vuelve a desmontar nunca. El vídeo sigue sin cargarse
 * mientras no haga falta -- que era la mitad útil de la idea -- pero deja de
 * recrearse, que era la mitad que lo rompía. El coste es que un vídeo
 * silenciado sigue en bucle fuera de pantalla; a cambio funciona en el
 * navegador que usa la mayoría.
 *
 * EL SONDEO
 *
 * Un iframe que falla no se queda transparente: pinta un rectángulo gris sobre
 * todo. Y `onLoad` no sirve para detectarlo, porque el navegador lo dispara
 * igual cuando la carga falla (su propia página de error también "carga").
 * Por eso se llama antes a la dirección con `no-cors`, que no necesita permiso
 * del servidor: si el servicio no responde, el iframe no se monta y se ve lo
 * que haya debajo -- una foto de respaldo o el fondo oscuro -- nunca el gris.
 */
interface VideoNubeProps {
  /** Dirección de incrustar que da el servicio, con sus parámetros. */
  src: string;
  /** Clases del <iframe>: es lo que decide el recorte en cada sitio. */
  className: string;
  /** Margen para adelantar la carga antes de que entre en pantalla. */
  margen?: string;
}

export const VideoNube: React.FC<VideoNubeProps> = ({ src, className, margen = '400px 0px' }) => {
  const ancla = useRef<HTMLSpanElement>(null);
  const [cerca, setCerca] = useState(false);
  const [responde, setResponde] = useState(false);

  useEffect(() => {
    const n = ancla.current;
    if (!n || typeof IntersectionObserver === 'undefined') {
      setCerca(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entrada]) => {
        // Sólo se enciende. Nunca se apaga: ver la nota de arriba.
        if (entrada.isIntersecting) {
          setCerca(true);
          obs.disconnect();
        }
      },
      { rootMargin: margen },
    );
    obs.observe(n);
    return () => obs.disconnect();
  }, [margen]);

  useEffect(() => {
    if (!cerca || responde) return;
    let vivo = true;
    fetch(src, { mode: 'no-cors' })
      .then(() => { if (vivo) setResponde(true); })
      .catch(() => { /* sin respuesta: no se monta nada, y nunca hay gris */ });
    return () => { vivo = false; };
  }, [cerca, responde, src]);

  return (
    <>
      <span ref={ancla} aria-hidden className="pointer-events-none absolute left-0 top-0 h-px w-px" />
      {cerca && responde && (
        <iframe
          src={src}
          title=""
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className={className}
        />
      )}
    </>
  );
};
