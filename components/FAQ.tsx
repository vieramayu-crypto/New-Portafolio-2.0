import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSiteContent } from '../src/lib/content';

/** Bloque de dudas.
 *
 *  Las preguntas se leen todas de entrada y sólo se despliega la respuesta.
 *  Antes vivían detrás de un primer desplegable y cada respuesta pedía otro
 *  clic: dos clics para saber qué derechos de uso incluye la entrega, y ni
 *  siquiera se veía que la pregunta estaba contestada. */
export const FAQ: React.FC = () => {
  const { faq } = useSiteContent();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <div className="text-center">
          {/* Las preguntas se leen de entrada. Antes vivían todas detrás de un
              primer desplegable, y cada respuesta pedía otro clic: dos clics
              para saber qué derechos de uso incluye la entrega. */}
          <h2 className="font-serif text-4xl text-[#1a1918] md:text-5xl">{faq.heading}</h2>
        </div>

        <div className="mt-12 divide-y divide-[#1a1918]/10 md:mt-16">
                {faq.questions.map((entry, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <div key={entry.question} className="py-2">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-respuesta-${i}`}
                        className="group flex w-full items-center justify-between gap-6 py-5 text-left md:py-6"
                      >
                        <span className="font-serif text-lg leading-snug text-[#1a1918] md:text-2xl">
                          {entry.question}
                        </span>
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#1a1918]/40 text-[#1a1918] transition-transform duration-300 md:h-7 md:w-7 ${
                            isOpen ? 'rotate-45' : 'group-hover:scale-110'
                          }`}
                          aria-hidden
                        >
                          +
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`faq-respuesta-${i}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <p className="pb-6 pr-10 font-sans text-base leading-relaxed text-[#5a5854] md:pb-8 md:text-lg">
                              {entry.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
        </div>
      </div>
    </section>
  );
};
