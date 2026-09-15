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
        {/* Titular, explicación y botón en la MISMA pantalla. Antes la portada
            ocupaba casi toda la altura y la acción vivía en una segunda
            sección larga: quien ya había decidido escribir tenía que seguir
            buscando dónde hacerlo. El titular baja de cuerpo para que quepan
            los tres. */}
        <section className="flex min-h-[calc(100svh-5rem)] items-center justify-center px-6 py-24 text-center md:px-12">
          <div className="w-full max-w-[940px]">
            <motion.h1
              initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.06 }}
              className="m-0 font-serif text-[clamp(46px,13vw,64px)] font-medium leading-[1.05] tracking-[-0.055em] md:text-[clamp(56px,6.6vw,104px)]"
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

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.74 }}
              className="mx-auto mt-8 max-w-[48ch] text-[14px] leading-[1.75] text-[#5a5854] md:mt-10 md:text-sm"
            >
              {contact.introMain} {contact.introSub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.84 }}
              className="mt-10 flex flex-col items-center gap-6 md:mt-12"
            >
              <button
                onClick={onOpen}
                className="bg-[#1a1918] px-8 py-4 text-[12px] font-sans font-medium uppercase tracking-[0.22em] text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:px-10 md:py-[1.15rem] md:text-xs"
              >
                {contact.ctaLabel}
              </button>

              <div className="text-[11px] uppercase tracking-[0.14em] text-[#5a5854]">
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
