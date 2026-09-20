import React from 'react';
import { GaleriaPiezas, PIEZAS_HORIZONTALES, PIEZAS_VERTICALES } from './GaleriaPiezas';

/** El bloque de vídeo de Inicio: DOS galerías, una por formato.
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
 *  6. Esto: la misma galería, pero UNA POR FORMATO.
 *
 *  `PiezasVerticales.tsx` (la opción C) sigue en el repositorio sin usar, a
 *  propósito: ella dijo que podríamos volver.
 *
 *  LAS DOS GALERÍAS SON PORTÁTILES. Cada una lleva su cabecera y su fondo, así
 *  que separarlas y mandar una a otro punto de la página es mover una línea en
 *  `HomeMain`. Está pendiente decidir si los verticales se van más abajo para
 *  repartir el vídeo por la web.
 */
export const VideoShowcase: React.FC = () => (
  <>
    <div aria-hidden className="h-px w-full bg-[#1a1918]/12" />

    <GaleriaPiezas
      piezas={PIEZAS_HORIZONTALES}
      titulo="Vídeos para mostrar la experiencia de tu hotel"
      subtitulo="Una pieza que presenta la propiedad entera, para su web y sus campañas."
    />

    <GaleriaPiezas
      piezas={PIEZAS_VERTICALES}
      titulo="Piezas verticales para sus redes"
      subtitulo="Centradas en un espacio, la gastronomía o el servicio."
      alterno
    />
  </>
);
