import React from 'react';
import { motion } from 'motion/react';
import { useSiteContent } from '../src/lib/content';

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-90px' },
  transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] as const, delay },
});

/** "Formas de trabajar juntos" (pág. 7): tres categorías, no un paquete
 *  cerrado -- reduce la incertidumbre del hotel sin publicar precio. Mismo
 *  cristal que el modal de Contacto; la cifra reutiliza el mismo tratamiento
 *  serif-cursiva que ya usan el bloque de valor y "El proceso". */
export const WaysToWork: React.FC = () => {
  const { waysToWork } = useSiteContent();

  return (
    <section className="w-full bg-[#fbfaf6] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.div {...rise(0)} className="mb-14 text-center md:mb-16">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#5a5854] md:text-xs">
            {waysToWork.eyebrow}
          </span>
          <h2 className="mt-4 font-serif text-4xl text-[#1a1918] md:text-6xl">{waysToWork.heading}</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-7">
          {waysToWork.items.map((item, i) => (
            <motion.div
              key={item.number}
              {...rise(0.08 * (i + 1))}
              className="mt-glass mt-glass-light rounded-lg p-7 md:p-9"
            >
              <div className="font-serif text-2xl italic text-[#1a1918]/50 md:text-3xl">{item.number}</div>
              <h3 className="mt-4 font-serif text-xl text-[#1a1918] md:text-2xl">{item.title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#5a5854] md:text-[15px]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          {...rise(0.3)}
          className="mx-auto mt-10 max-w-[54ch] text-center font-sans text-[12.5px] leading-relaxed text-[#5a5854] md:mt-12 md:text-sm"
        >
          {waysToWork.intro}
        </motion.p>
      </div>
    </section>
  );
};
