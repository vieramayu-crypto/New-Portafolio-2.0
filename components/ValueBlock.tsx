import React from 'react';
import { motion } from 'motion/react';
import { useSiteContent } from '../src/lib/content';

/** Entrada compartida: desenfoque que se aclara y sube. Se reproduce una vez
 *  al entrar en pantalla y se queda fija, como pidió Mayurlin. */
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 26, filter: 'blur(10px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-90px' },
  transition: { duration: 0.85, ease: [0.4, 0, 0.2, 1] as const, delay },
});

/** LOS TRES MODELOS DE TRABAJO, A LA VEZ Y SIN NADA QUE PULSAR.
 *
 *  Vienen de la auditoría (pág. 5): la segunda capa, la distribución, pasaba
 *  desapercibida detrás de un selector de clic. Desde entonces las tarjetas
 *  se ven todas a la vez, con el mismo cristal que "Qué creamos" y "Formas de
 *  trabajar juntos".
 *
 *  ERAN DOS Y AHORA SON TRES, por el media kit: producción, exposición en
 *  @mayurlintravel, o las dos. La rejilla pasa a tres columnas en escritorio
 *  y sigue apilada en móvil; a partir de `sm` y hasta `md` también se apila,
 *  porque tres tarjetas de texto en 640px salen a 200px de ancho y el título
 *  se parte en cuatro líneas. */
export const ValueBlock: React.FC = () => {
  const { valueBlock } = useSiteContent();

  return (
    <section id="value-block" className="relative w-full bg-[#fbfaf6] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.h2
          {...rise(0)}
          className="text-center font-serif text-[11vw] leading-[1.02] text-[#1a1918] sm:text-[8vw] md:text-[5.2vw]"
        >
          {valueBlock.claim}
        </motion.h2>

        <div className="mt-glass-async mt-14 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-3 md:gap-7">
          {valueBlock.benefits.map((benefit, i) => (
            <motion.div
              key={benefit}
              {...rise(0.08 * (i + 1))}
              className="mt-glass mt-glass-light relative overflow-hidden rounded-lg p-7 md:p-9"
            >
              <h3 className="font-serif text-xl text-[#1a1918] md:text-2xl">{benefit}</h3>
              {valueBlock.benefitDetails[i] && (
                <p className="mt-3 font-sans text-sm leading-relaxed text-[#5a5854] md:text-[16px]">
                  {valueBlock.benefitDetails[i]}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
