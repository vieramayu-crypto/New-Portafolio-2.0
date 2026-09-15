import React from 'react';
import { motion } from 'motion/react';
import { useSiteContent } from '../src/lib/content';

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-90px' },
  transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] as const, delay },
});

/** "Formas de trabajar juntos" (pág. 8): cuatro modalidades con nombre, no
 *  paquetes cerrados -- reduce la incertidumbre del hotel sin publicar
 *  precio. Mismo cristal que el resto de bloques nuevos de la Home. */
export const WaysToWork: React.FC = () => {
  const { waysToWork } = useSiteContent();

  return (
    <section className="w-full bg-[#fbfaf6] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.div {...rise(0)} className="mb-14 text-center md:mb-16">
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#5a5854] md:text-xs">
            {waysToWork.eyebrow}
          </span>
          <h2 className="mt-4 font-serif text-4xl text-[#1a1918] md:text-6xl">{waysToWork.heading}</h2>
        </motion.div>

        <div className="mt-glass-async grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-7 lg:grid-cols-3">
          {waysToWork.items.map((item, i) => (
            <motion.div
              key={item.title}
              {...rise(0.06 * (i + 1))}
              className="mt-glass mt-glass-light relative overflow-hidden rounded-lg p-7 md:p-9"
            >
              <h3 className="font-serif text-xl text-[#1a1918] md:text-2xl">{item.title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#5a5854] md:text-[16px]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          {...rise(0.26)}
          className="mx-auto mt-10 max-w-[54ch] text-center font-sans text-[13.5px] leading-relaxed text-[#5a5854] md:mt-12 md:text-sm"
        >
          {waysToWork.intro}
        </motion.p>

        {/* El alcance en cifras, justo antes del último botón: es donde alguien
            decide y donde quiere saber la escala. Misma pieza que la banda de
            trayectoria del hero — cifra en serif cursiva sobre rótulo pequeño,
            separadas por hairline — para no introducir un formato nuevo. */}
        <motion.div {...rise(0.32)} className="mx-auto mt-14 max-w-[52rem] md:mt-18">
          <div className="border-t border-[#1a1918]/12 pt-9 text-center md:pt-11">
            <div className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#5a5854] md:text-xs">
              {waysToWork.scopeLabel}
            </div>
            <div className="mt-8 grid grid-cols-3 md:mt-10">
              {waysToWork.scopeItems.map((item, i) => (
                <div
                  key={item.label}
                  className={`px-2 ${i === 0 ? '' : 'border-l border-[#1a1918]/12'}`}
                >
                  <div className="font-serif text-[30px] font-normal italic leading-none text-[#1a1918] md:text-[40px]">
                    {item.value}
                  </div>
                  <div className="mx-auto mt-3 max-w-[14ch] font-sans text-[11px] uppercase leading-[1.35] tracking-[0.14em] text-[#5a5854] md:text-[12px]">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-9 max-w-[48ch] font-sans text-[13px] leading-relaxed text-[#5a5854] md:mt-10 md:text-[14px]">
              {waysToWork.scopeNote}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
