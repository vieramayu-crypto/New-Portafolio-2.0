import React from 'react';
import { motion } from 'motion/react';
import { useSiteContent } from '../src/lib/content';

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-90px' },
  transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] as const, delay },
});

/** "Por qué Mayu Travel" (pág. 6): convierte la estructura real del equipo
 *  -- dos personas, ejecución senior -- en argumento comercial, en vez de
 *  dejar que se lea como una marca creativa cualquiera. Misma lista de
 *  hairlines que las preguntas frecuentes, ningún componente nuevo. */
export const WhyUs: React.FC = () => {
  const { whyUs } = useSiteContent();

  return (
    <section className="w-full bg-[#fbfaf6] py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <motion.div {...rise(0)} className="text-center">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#5a5854] md:text-xs">
            {whyUs.eyebrow}
          </span>
          <h2 className="mt-4 font-serif text-4xl text-[#1a1918] md:text-5xl">{whyUs.heading}</h2>
          <p className="mx-auto mt-5 max-w-[48ch] font-serif text-xl leading-snug text-[#1a1918]/80 md:text-2xl">
            {whyUs.intro}
          </p>
        </motion.div>

        <motion.div {...rise(0.12)} className="mt-12 divide-y divide-[#1a1918]/10 md:mt-16">
          {whyUs.items.map((item) => (
            <div key={item} className="py-5 text-center font-sans text-base leading-relaxed text-[#5a5854] md:py-6 md:text-lg">
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
