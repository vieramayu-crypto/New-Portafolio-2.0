import React from 'react';
import { motion } from 'motion/react';
import { Page } from '../types';
import { useSiteContent } from '../src/lib/content';

interface ClosingCtaProps {
  onOpenAvailability: () => void;
  onNavigate: (page: Page) => void;
}

/** Cierre de Inicio: la página no termina en una foto suelta, termina en una
 *  invitación. Sin subtítulo ni email — los dos repetían lo que dice Contacto
 *  y lo que el pie, justo debajo, ya lleva. */
export const ClosingCta: React.FC<ClosingCtaProps> = ({ onOpenAvailability, onNavigate }) => {
  const { closingCta } = useSiteContent();

  return (
    <section className="relative w-full bg-[#1a1918] px-6 pb-24 pt-32 text-center text-[#f5f3ed] md:px-12 md:pb-28 md:pt-44">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
          className="mx-auto max-w-4xl font-serif text-[11vw] leading-[1.04] sm:text-[8vw] md:text-[5.2vw]"
        >
          {closingCta.heading}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.14 }}
          className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-16"
        >
          <button
            onClick={onOpenAvailability}
            className="bg-[#f5f3ed] px-8 py-4 text-[11px] font-sans uppercase tracking-[0.22em] font-medium text-[#1a1918] transition-colors hover:bg-[#f5f3ed]/80 md:px-10 md:py-[1.15rem] md:text-xs"
          >
            {closingCta.ctaLabel}
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="border border-[#f5f3ed]/50 px-8 py-4 text-[11px] font-sans uppercase tracking-[0.22em] font-medium text-[#f5f3ed] transition-colors hover:border-[#f5f3ed] hover:bg-[#f5f3ed] hover:text-[#1a1918] md:px-10 md:py-[1.15rem] md:text-xs"
          >
            {closingCta.secondaryLabel}
          </button>
        </motion.div>
      </div>
    </section>
  );
};
