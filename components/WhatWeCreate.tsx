import React from 'react';
import { motion } from 'motion/react';
import { useSiteContent } from '../src/lib/content';

/** Entrada compartida con el resto de bloques de la Home: sube y se aclara
 *  una sola vez al entrar en pantalla. */
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-90px' },
  transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] as const, delay },
});

/** "Qué creamos" — hueco comercial más importante de la Home (pág. 5 del
 *  documento de estrategia): antes de las nueve historias de hotel, el
 *  visitante ya sabe qué puede contratar. Cuatro tarjetas, sin lista de
 *  veinte servicios. Reutiliza el mismo cristal que el modal de Contacto y
 *  el selector de hoteles, no un estilo de tarjeta nuevo. */
export const WhatWeCreate: React.FC = () => {
  const { whatWeCreate } = useSiteContent();

  return (
    <section className="w-full bg-[#fbfaf6] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.div {...rise(0)} className="mb-14 text-center md:mb-16">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#5a5854] md:text-xs">
            {whatWeCreate.eyebrow}
          </span>
          <h2 className="mt-4 font-serif text-4xl text-[#1a1918] md:text-6xl">{whatWeCreate.heading}</h2>
        </motion.div>

        <div className="mt-glass-async grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-7">
          {whatWeCreate.items.map((item, i) => (
            <motion.div
              key={item.title}
              {...rise(0.06 * (i + 1))}
              className="mt-glass mt-glass-light relative overflow-hidden rounded-lg p-7 md:p-9"
            >
              <h3 className="font-serif text-xl text-[#1a1918] md:text-2xl">{item.title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#5a5854] md:text-[15px]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
