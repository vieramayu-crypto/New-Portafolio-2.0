import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TESTIMONIALS } from '../data/collaborations';

const AUTO_ADVANCE_MS = 9000;

/** El carrusel abre por GPRO, no por la primera cita de la lista: es el
 *  cliente que ha repetido tres veces, y su testimonio habla de
 *  profesionalidad y continuidad -- la prueba más fuerte que hay publicada.
 *  Ocho citas rotando dejaban esa lectura al azar. */
const OPENING_TESTIMONIAL_ID = 't-gpro';

export const Testimonials: React.FC = () => {
  const [index, setIndex] = useState(() => {
    const i = TESTIMONIALS.findIndex((t) => t.id === OPENING_TESTIMONIAL_ID);
    return i === -1 ? 0 : i;
  });

  useEffect(() => {
    if (TESTIMONIALS.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, []);

  const t = TESTIMONIALS[index];
  if (!t) return null;

  const go = (delta: number) =>
    setIndex((prev) => (prev + delta + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <div className="relative">
      <div className="relative min-h-[430px] sm:min-h-[400px] md:min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
          >
            <div className="md:grid md:grid-cols-[auto_1fr] md:gap-x-10 lg:gap-x-16">
              {/* Oversized quote mark — the decorative anchor, mirroring the
                  step number in "El proceso" so both carousels read as a set. */}
              <div
                aria-hidden
                className="mb-4 font-serif text-6xl leading-none text-[#1a1918]/25 md:mb-0 md:text-8xl lg:text-9xl"
              >
                &ldquo;
              </div>

              <div>
                {/* Work from that property, floated so the quote wraps around it.
                    Falls back to the brand set in type when we have no imagery. */}
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt=""
                    className="float-left mb-3 mr-5 w-28 object-cover sm:w-36 md:mb-4 md:mr-8 md:w-[210px] lg:w-[240px]"
                    style={{ aspectRatio: '3 / 4' }}
                  />
                ) : (
                  <div
                    className="float-left mb-3 mr-5 flex w-28 items-center justify-center bg-[#1a1918] px-3 text-center sm:w-36 md:mb-4 md:mr-8 md:w-[210px] md:px-6 lg:w-[240px]"
                    style={{ aspectRatio: '3 / 4' }}
                  >
                    <span className="font-serif text-lg leading-snug tracking-wide text-[#f5f3ed] md:text-3xl">
                      {t.brandName}
                    </span>
                  </div>
                )}

                <p className="font-serif text-[1.45rem] leading-[1.3] text-[#1a1918] sm:text-3xl md:text-[2.35rem] md:leading-[1.28] lg:text-[2.6rem]">
                  {t.quote}
                </p>

                <div className="clear-left pt-8 md:pt-10">
                  <div className="font-serif text-xl text-[#1a1918] md:text-2xl">{t.author}</div>
                  <div className="mt-1 text-[11px] font-sans uppercase tracking-[0.22em] text-[#5a5854] md:text-xs">
                    {t.role ? `${t.role} · ` : ''}
                    {t.brandName}
                  </div>
                  {t.repeatNote && (
                    <div className="mt-3 inline-block border border-[#1a1918]/30 px-3 py-1.5 text-[11px] font-sans uppercase tracking-[0.2em] text-[#1a1918] md:text-[12px]">
                      {t.repeatNote}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 pt-12 md:pt-14">
        <button
          onClick={() => go(-1)}
          aria-label="Testimonio anterior"
          className="p-2 text-[#1a1918]/50 transition-colors hover:text-[#1a1918]"
        >
          <span className="text-2xl leading-none">&#8249;</span>
        </button>

        <div className="flex items-center gap-3">
          {TESTIMONIALS.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setIndex(i)}
              aria-label={`Ver testimonio de ${item.brandName}`}
              aria-current={i === index}
              className="p-1.5 -m-1.5"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === index ? 'h-2.5 w-2.5 bg-[#1a1918]' : 'h-1.5 w-1.5 bg-[#1a1918]/25'
                }`}
              />
            </button>
          ))}
        </div>

        <button
          onClick={() => go(1)}
          aria-label="Siguiente testimonio"
          className="p-2 text-[#1a1918]/50 transition-colors hover:text-[#1a1918]"
        >
          <span className="text-2xl leading-none">&#8250;</span>
        </button>
      </div>
    </div>
  );
};
