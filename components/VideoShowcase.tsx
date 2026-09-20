import React from 'react';
import { GaleriaPiezas, PIEZAS_HORIZONTALES, PIEZAS_VERTICALES } from './GaleriaPiezas';

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

/** LAS PIEZAS VERTICALES VIVEN ABAJO, ENTRE "POR QUÉ MAYU TRAVEL" Y "FORMAS
 *  DE TRABAJAR JUNTOS".
 *
 *  El sitio no es decorativo, lo decide el copy: la banda de "Un rodaje tipo"
 *  que cierra "Formas de trabajar juntos" promete literalmente **3 piezas de
 *  vídeo vertical**. Puestas justo antes, la prueba llega antes que la
 *  promesa en vez de quedar diez pantallas por encima.
 *
 *  Y encaja por arriba: "Espacios con alguien dentro" y "Un hotel en marcha"
 *  son exactamente lo que enseñan estas tres piezas -- el restaurante lleno,
 *  el spa y la azotea a su hora, con el hotel funcionando.
 *
 *  Se baja la vertical y no la horizontal porque la horizontal ya aparece dos
 *  veces arriba (su galería y, desde esta ronda, el mosaico de cada hotel).
 *  Este formato no tenía otro sitio en Inicio.
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
