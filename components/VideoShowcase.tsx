import React, { useEffect, useRef, useState } from 'react';
import { GaleriaPiezas, PIEZAS_HORIZONTALES, PIEZAS_VERTICALES } from './GaleriaPiezas';
import { VideoNube } from './VideoNube';

/** El bloque de vídeo de Inicio: DOS galerías, una por formato, y ya NO van
 *  seguidas -- ver `VideoVerticalesInicio` al final de este archivo.
 *
 *  HISTORIAL, PORQUE LA SECCIÓN SE REHÍZO SEIS VECES Y CONVIENE NO REPETIRLO.
 *
 *  1. Vídeo horizontal a sangre completa en un bloque pegajoso, y encima
 *     cuatro tarjetas verticales que se desplegaban al bajar. **Tapaban el
 *     vídeo** al primer scroll.
 *  2. Se separaron en dos secciones. Ahí se vio que las cuatro tarjetas
 *     verticales **no tenían nada dentro**: caja de color, círculo de play y
 *     la placa del nombre. Contraste con el fondo: 1,33:1.
 *  3. Se les metió el vídeo real y un tratamiento de "sala de proyección".
 *     Mayurlin: "no me cierra para nada".
 *  4. Opción C: los verticales como cuarto carrusel hermano, en marfil.
 *     "Está mejor que antes pero no me cierra aún."
 *  5. Opción D: las siete piezas en UNA sola galería. "Me gusta, es más
 *     elegante", pero con un fallo que ella detectó: "hay que desplazarse por
 *     todos los vídeos para poder ver una pieza u otra", y el marco pegaba un
 *     salto de alto en cada cambio de formato.
 *  6. Una galería POR FORMATO, las dos seguidas.
 *  7. Esto: las dos galerías repartidas por la página.
 *
 *  `PiezasVerticales.tsx` (la opción C) sigue en el repositorio sin usar, a
 *  propósito: ella dijo que podríamos volver.
 */
export const VideoShowcase: React.FC = () => (
  <>
    <div aria-hidden className="h-px w-full bg-[#1a1918]/12" />

    <GaleriaPiezas
      piezas={PIEZAS_HORIZONTALES}
      titulo="Vídeos para mostrar la experiencia de tu hotel"
      subtitulo="Una pieza que presenta la propiedad entera, para su web y sus campañas."
    />
  </>
);

/** LAS PIEZAS VERTICALES VIVEN ARRIBA, ENTRE "QUÉ CREAMOS" Y "UNA PRODUCCIÓN,
 *  DOS DESTINOS".
 *
 *  PRIMERO SE PROBARON ABAJO, entre "Por qué Mayu Travel" y "Formas de
 *  trabajar juntos", por un argumento de copy: la banda de "Un rodaje tipo"
 *  promete 3 piezas verticales y la prueba quedaba justo antes. Sobre el papel
 *  encajaba; en la web no. Medido, caían al **80% de la página**, y Mayurlin
 *  no las encontró: *"han desaparecido"*, *"quedó enterrada abajo"*.
 *
 *  LECCIÓN, PARA NO REPETIRLA: un argumento de copy no compensa estar al final
 *  del scroll. Las piezas principales van donde se ven.
 *
 *  Va con `alterno` a propósito: sus dos vecinas son marfil `#fbfaf6`, y sin
 *  el cambio de fondo las tres se leerían como un solo bloque.
 */
export const VideoVerticalesInicio: React.FC = () => (
  <GaleriaPiezas
    piezas={PIEZAS_VERTICALES}
    titulo="Piezas verticales para sus redes"
    subtitulo="Centradas en un espacio, la gastronomía o el servicio."
    alterno
  />
);

/** LA BANDA DE RESPIRO, entre "Por qué Mayu Travel" y "Formas de trabajar
 *  juntos". Es el único vídeo de la web SIN NINGÚN TEXTO: ni titular, ni
 *  subtítulo, ni nombre de hotel, ni flechas, ni índice. Tampoco se puede
 *  pulsar.
 *
 *  Y es a propósito. Mayurlin: *"ahí puede seguir habiendo un vídeo, para
 *  darle algo de aire entre tanto texto, pero sin ningún objetivo concreto de
 *  venta, sino más con aporte visual"*. El tramo final de Inicio son cuatro
 *  bloques de texto seguidos; esto los parte por la mitad sin pedir nada a
 *  cambio.
 *
 *  SI NO VENDE, NO LLEVA ROTULO. Ponerle un nombre de hotel o un "ver más" la
 *  convertiría en la cuarta llamada a la acción de ese tramo, compitiendo con
 *  el botón que cierra la página, que es donde se decide.
 *
 *  PARA CAMBIAR LA PIEZA: sólo esta constante.
 */
const PIEZA_BANDA = PIEZAS_HORIZONTALES.find((p) => p.id === 'v-binidufa') ?? PIEZAS_HORIZONTALES[0];

export const BandaVideo: React.FC = () => {
  const [cerca, setCerca] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  /* Se monta al acercarse, igual que los vídeos de los mosaicos: es el sexto
     reproductor de Inicio y está en el último tercio, así que cargarlo de
     entrada sería pagarlo siempre para que lo vea menos gente. */
  useEffect(() => {
    const el = caja.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setCerca(true);
      return;
    }
    const io = new IntersectionObserver(
      (e) => {
        if (e[0]?.isIntersecting) {
          setCerca(true);
          io.disconnect();
        }
      },
      { rootMargin: '1800px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!PIEZA_BANDA) return null;

  return (
    /* EL VÍDEO CUBRE LA BANDA, no al revés. El alto lo fija la banda y el
       ancho sale de `max(100%, alto * 16/9)`, así que la pieza siempre la
       tapa entera y lo que sobra lo recorta el contenedor -- que es como
       manda recortar `VideoNube`, desde fuera y sin deformar el iframe.
       Con el vídeo a ancho fijo, en móvil (390 px) un 16:9 mide 219 px de
       alto contra una banda de 287 y quedaban dos franjas negras. */
    <div
      ref={caja}
      aria-hidden
      className="relative h-[var(--banda)] w-full overflow-hidden bg-[#1a1918] [--banda:34svh] md:[--banda:52svh]"
    >
      {cerca && (
        <div className="absolute left-1/2 top-1/2 w-[max(100%,calc(var(--banda)*16/9))] -translate-x-1/2 -translate-y-1/2">
          <VideoNube src={PIEZA_BANDA.src} />
        </div>
      )}
    </div>
  );
};
