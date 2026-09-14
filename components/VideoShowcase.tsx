import React from 'react';
import { motion } from 'motion/react';

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 as const },
  transition: { duration: 1, ease: 'easeOut' as const, delay },
});

const VIDEO_SLOTS = ['Vídeo horizontal 1', 'Vídeo horizontal 2', 'Vídeo horizontal 3'];

/** Sección "El hotel en movimiento" (pág. 9 de la auditoría): la web afirma
 *  que se produce film, pero hoy no hay ni un solo vídeo visible en Inicio.
 *
 *  Tres columnas a pantalla completa, sin ningún texto sobre el vídeo -- solo
 *  el botón de cristal (mismo mt-glass, letra y forma que "Ver trabajo" de
 *  Inicio) marca dónde va cada pieza. El ícono de reproducción, no texto, es
 *  lo que dice "aquí va un vídeo"; se sustituye por un <video> real (con
 *  poster + mp4/webm, ver HotelDetail.tsx) en cuanto llegue el material. */
export const VideoShowcase: React.FC = () => {
  return (
    <section className="w-full bg-[#fbfaf6] py-20 md:py-28">
      <div className="mx-auto mb-12 max-w-6xl px-6 text-center md:mb-16 md:px-12">
        <motion.h2 {...rise(0)} className="font-serif text-4xl text-[#1a1918] md:text-6xl">
          El hotel en movimiento
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {VIDEO_SLOTS.map((label, i) => (
          <motion.div
            key={label}
            {...rise(0.1 + i * 0.15)}
            className="group relative flex min-h-[400px] flex-col items-center justify-end overflow-hidden bg-[#1a1918] p-6 sm:min-h-[500px] sm:p-8 md:min-h-[750px] md:p-12"
          >
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg md:h-20 md:w-20">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 translate-x-[2px] text-[#1a1918] md:h-7 md:w-7"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>

            <button
              aria-label={label}
              className="mt-glass mt-glass-light relative z-10 overflow-hidden rounded-md px-5 py-2 text-sm font-serif font-medium tracking-[0.25em] text-[#1a1918] shadow-[0_2px_20px_rgba(26,25,24,0.14)] transition-all duration-300 hover:bg-[#1a1918] hover:text-[#f5f3ed] md:text-base"
            >
              Ver vídeo
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
