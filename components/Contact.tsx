import React from 'react';
import { motion } from 'motion/react';
import { FAQ } from './FAQ';
import { useSiteContent } from '../src/lib/content';

interface ContactProps {
  onOpen: () => void;
}

/** Contacto — habla el mismo idioma visual que Acerca de.
 *
 *  Portada monumental, una segunda pantalla con una sola orientación, y el
 *  formulario recogido en un modal de cristal para que la página en reposo
 *  siga siendo tipografía sobre crema y no un impreso. */
export const Contact: React.FC<ContactProps> = ({ onOpen }) => {
  const { contact } = useSiteContent();

  const headingLines = contact.headingLines;
  const lastLine = headingLines[headingLines.length - 1];

  return (
    <div className="min-h-screen bg-[#f5f3ed] font-sans text-[#1a1918]">
        {/* Portada monumental */}
        <section className="flex min-h-[calc(100svh-7rem)] items-center justify-center px-6 pb-[8vh] pt-28 text-center md:px-12">
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.06 }}
            className="m-0 font-serif text-[clamp(66px,20vw,100px)] font-medium leading-[1.05] tracking-[-0.055em] md:text-[clamp(76px,10.5vw,170px)]"
          >
            {headingLines.slice(0, -1).map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 10, filter: 'blur(9px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.68, ease: 'easeInOut', delay: 0.58 }}
              className="block"
            >
              {lastLine}
            </motion.span>
          </motion.h1>
        </section>

        {/* Segunda pantalla: una sola orientación y un solo CTA */}
        <section className="flex min-h-[82svh] items-center justify-center px-6 py-[12vh] text-center md:min-h-[88svh] md:px-12">
          <div className="w-full max-w-[940px]">
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-90px' }}
              transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
              className="mx-auto max-w-[18ch] font-serif text-[clamp(31px,9vw,42px)] leading-[1.32] tracking-[-0.024em] md:text-[clamp(34px,3.4vw,54px)]"
            >
              {contact.introMain}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-90px' }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.12 }}
              className="mx-auto mt-7 max-w-[52ch] text-[12.5px] leading-[1.75] text-[#5a5854] md:text-[13px]"
            >
              {contact.introSub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-90px' }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
              className="mt-14 flex flex-col items-center gap-6"
            >
              <button
                onClick={onOpen}
                className="bg-[#1a1918] px-8 py-4 text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:px-10 md:py-[1.15rem] md:text-xs"
              >
                {contact.ctaLabel}
              </button>

              <div className="text-[10px] uppercase tracking-[0.14em] text-[#5a5854]">
                {contact.directLabel}{' '}
                <a
                  href={`mailto:${contact.emailAddress}`}
                  className="underline underline-offset-4 hover:text-[#1a1918]"
                >
                  {contact.emailAddress}
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      <FAQ />
    </div>
  );
};
