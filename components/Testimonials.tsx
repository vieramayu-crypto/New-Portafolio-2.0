import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TESTIMONIALS } from '../data/collaborations';
import type { Testimonial } from '../types';

const AUTO_ADVANCE_MS = 9000;

/** La tarjeta de una cita.
 *
 *  Se pinta dos veces: la de verdad, y una copia invisible por cada testimonio
 *  que sirve sólo para medir (ver el comentario del marco, más abajo). En la
 *  copia la foto se sustituye por un hueco de las mismas medidas, para no
 *  descargar ocho fotografías que nadie va a ver.
 */
const TarjetaTestimonio: React.FC<{ t: Testimonial; medidor?: boolean }> = ({ t, medidor }) => {
  const clasesFoto = 'float-left mb-3 mr-5 w-28 sm:w-36 md:mb-4 md:mr-8 md:w-[210px] lg:w-[240px]';

  return (
    <div className="md:grid md:grid-cols-[auto_1fr] md:gap-x-10 lg:gap-x-16">
      {/* La comilla enorme -- el ancla decorativa, igual que la cifra de "El
          proceso", para que los dos carruseles se lean como un conjunto. */}
      <div
        aria-hidden
        className="mb-4 font-serif text-6xl leading-none text-[#1a1918]/25 md:mb-0 md:text-8xl lg:text-9xl"
      >
        &ldquo;
      </div>

      <div>
        {/* Una foto de esa propiedad, flotada para que la cita la envuelva.
            Si no hay imagen, cae al nombre de la marca compuesto en tipografía. */}
        {medidor ? (
          <div className={clasesFoto} style={{ aspectRatio: '3 / 4' }} />
        ) : t.photo ? (
          <img
            src={t.photo}
            alt=""
            className={`${clasesFoto} object-cover`}
            style={{ aspectRatio: '3 / 4' }}
          />
        ) : (
          <div
            className={`${clasesFoto} flex items-center justify-center bg-[#1a1918] px-3 text-center md:px-6`}
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
  );
};

/** El carrusel de citas.
 *
 *  El orden lo manda `TESTIMONIALS`: abre por GPRO Valparaíso, que es el
 *  cliente que ha repetido tres veces y cuya cita habla de oficio y de
 *  continuidad, y sigue por Ritz-Carlton Abama, que es la marca que más pesa.
 *  Antes arrancaba en GPRO saltando a su posición dentro de la lista; ahora el
 *  orden del dato es el orden que se ve, así que añadir una cita nueva no
 *  descoloca la apertura.
 */
export const Testimonials: React.FC = () => {
  const [index, setIndex] = useState(0);

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
      {/* El marco mide siempre lo que mide la cita más larga a este ancho.
          Antes llevaba un `min-h` fijo, que es un mínimo y no un tope: las
          citas largas lo desbordaban y la caja crecía. Medido: el marco
          saltaba 58 px en móvil, 202 px en tableta y 44 px en escritorio, y
          ese salto movía el rótulo de arriba y la fila de puntos de abajo cada
          vez que cambiaba la cita.

          Un número fijo por tramo tampoco vale: dependería de la longitud
          exacta de cada texto y se rompería al editar una cita, la tipografía
          o el ancho. Así que todas las tarjetas se apilan en la MISMA celda de
          una rejilla -- las copias, invisibles, sólo para medir -- y la
          rejilla toma la altura de la más alta. Sale exacta a cualquier ancho
          y se ajusta sola si mañana se cambia un testimonio. */}
      <div className="relative grid">
        {TESTIMONIALS.map((item) => (
          <div
            key={`medidor-${item.id}`}
            aria-hidden
            className="pointer-events-none invisible [grid-area:1/1]"
          >
            <TarjetaTestimonio t={item} medidor />
          </div>
        ))}

        <div className="[grid-area:1/1]">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
            >
              <TarjetaTestimonio t={t} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controles */}
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
