import React from 'react';
import { motion } from 'motion/react';
import { Page } from '../types';
import { useSiteContent } from '../src/lib/content';

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-90px' },
  transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] as const, delay },
});

interface WhyUsProps {
  onNavigate: (page: Page) => void;
}

/** "Por qué Mayu Travel" (pág. 7 de la auditoría): convierte la estructura de
 *  equipo de dos personas en argumento comercial, con las tarjetas ligadas a
 *  Mayurlin y Yerfran por nombre. El CTA lleva a Acerca de, donde se explica
 *  cada rol a fondo -- esta sección solo lo anticipa. */
export const WhyUs: React.FC<WhyUsProps> = ({ onNavigate }) => {
  const { whyUs } = useSiteContent();

  return (
    <section className="w-full bg-[#fbfaf6] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.div {...rise(0)} className="mb-14 text-center md:mb-16">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#5a5854] md:text-xs">
            {whyUs.eyebrow}
          </span>
          <h2 className="mt-4 font-serif text-4xl text-[#1a1918] md:text-6xl">{whyUs.heading}</h2>
          <p className="mx-auto mt-5 max-w-[48ch] font-serif text-xl leading-snug text-[#1a1918]/80 md:text-2xl">
            {whyUs.intro}
          </p>
        </motion.div>

        <div className="mt-glass-async grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-7">
          {whyUs.items.map((item, i) => (
            <motion.div
              key={item.title}
              {...rise(0.06 * (i + 1))}
              className="mt-glass mt-glass-light rounded-lg p-7 md:p-9"
            >
              <h3 className="font-serif text-xl text-[#1a1918] md:text-2xl">{item.title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#5a5854] md:text-[15px]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div {...rise(0.3)} className="mt-12 text-center md:mt-14">
          <button
            onClick={() => onNavigate('about')}
            className="bg-[#1a1918] px-8 py-4 text-[11px] font-sans uppercase tracking-[0.22em] font-medium text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:px-10 md:py-[1.15rem] md:text-xs"
          >
            {whyUs.ctaLabel}
          </button>
        </motion.div>
      </div>
    </section>
  );
};
