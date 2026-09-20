import React from 'react';
import { motion } from 'motion/react';
import { GaleriaPiezas } from './GaleriaPiezas';

/** El bloque de vídeo de Inicio: una cabecera y la galería.
 *
 *  HISTORIAL, PORQUE COSTÓ CINCO RONDAS Y CONVIENE NO REPETIRLO.
 *
 *  1. Un vídeo horizontal a sangre completa en un bloque pegajoso, y encima,
 *     al bajar, cuatro tarjetas verticales que se desplegaban con muelle.
 *     Las tarjetas TAPABAN el vídeo al primer scroll.
 *  2. Se separaron en dos secciones. Entonces se vio que las cuatro tarjetas
 *     verticales no tenían NADA dentro: caja de color, círculo de play y la
 *     placa del nombre. Contraste con el fondo: 1,33:1.
 *  3. Se les metió el vídeo real y un tratamiento de "sala de proyección".
 *     Mayurlin: "no me cierra para nada".
 *  4. Los verticales pasaron a ser el cuarto carrusel hermano, en marfil
 *     (opción C, `PiezasVerticales.tsx`). Mejor, pero tampoco.
 *  5. Esto: una sola galería, una pieza a la vez (opción D).
 *
 *  `PiezasVerticales.tsx` SIGUE EN EL REPOSITORIO sin usar, a propósito:
 *  Mayurlin quiso ver la D antes de decidir y dijo que podríamos volver.
 *  Volver es cambiar el import y la línea de abajo.
 */
export const VideoShowcase: React.FC = () => (
  <>
    {/* La cabecera va fuera del vídeo. Antes vivía encima: con una foto fija
        se leía bien, pero el vídeo se reproduce solo y en bucle, y un bloque
        de texto fijo sobre imagen en movimiento le quita la pantalla justo
        cuando hay algo que ver.

        Y EN MARFIL. Este bloque fue durante muchas rondas el único oscuro de
        la web, y por eso se leía como un bache. Ahora el vídeo es lo más
        oscuro de la página, que es donde tiene que ir la mirada. */}
    <div aria-hidden className="h-px w-full bg-[#1a1918]/12" />
    <section className="w-full bg-[#fbfaf6] px-6 pb-9 pt-20 text-center md:pb-12 md:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h2 className="mx-auto max-w-[20ch] font-serif text-3xl leading-[1.15] text-[#1a1918] md:max-w-none md:text-5xl">
          Vídeos para mostrar la experiencia de tu hotel
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-[14px] leading-[1.7] text-[#5a5854] md:mt-5 md:text-sm">
          Desde una presentación de la propiedad hasta reels centrados en sus espacios,
          gastronomía o servicio.
        </p>
      </motion.div>
    </section>

    <GaleriaPiezas />
  </>
);
