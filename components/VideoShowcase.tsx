import React from 'react';
import { motion } from 'motion/react';

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-90px' },
  transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] as const, delay },
});

/** Marcador de posición de vídeo: mismo tratamiento visual que el reproductor
 *  real (GalleryVideo en HotelDetail.tsx) -- fondo oscuro, sombra, botón de
 *  reproducción circular -- para que Mayurlin vea el hueco exacto (tamaño,
 *  proporción, sombra) antes de tener el archivo final. El texto "VÍDEO"
 *  ocupa el lugar del vídeo real; se sustituye por el <video> cuando llegue
 *  el material (mismo patrón que ya usa GalleryVideo, con poster + mp4/webm). */
const VideoPlaceholder: React.FC<{ aspect: string; label: string; caption: string }> = ({
  aspect,
  label,
  caption,
}) => (
  <div
    className="group relative w-full overflow-hidden bg-[#1a1918] shadow-2xl"
    style={{ aspectRatio: aspect }}
  >
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
      <span className="font-serif text-3xl italic text-white/25 md:text-5xl">VÍDEO</span>
      <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-white/45 md:text-xs">
        {label}
      </span>
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-105 md:h-20 md:w-20">
        <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-[2px] text-[#1a1918] md:h-7 md:w-7" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </div>
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-8 text-center md:px-6 md:pb-4">
      <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-white/70 md:text-[10px]">
        {caption}
      </span>
    </div>
  </div>
);

/** Sección "El hotel en movimiento" (pág. 9 de la auditoría): la web afirma
 *  que se produce film, pero hoy no hay ni un solo vídeo visible en Inicio.
 *  Estos son marcadores de posición -- ocupan exactamente el espacio, la
 *  proporción y el tratamiento visual que tendrá cada pieza real, para
 *  decidir la distribución antes de tener el material. Se reemplazan por
 *  <video> real (con poster + mp4/webm, ver HotelDetail.tsx) en cuanto
 *  llegue el archivo. */
export const VideoShowcase: React.FC = () => {
  return (
    <section className="w-full bg-[#fbfaf6] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.div {...rise(0)} className="mb-14 text-center md:mb-16">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#5a5854] md:text-xs">
            Vídeo
          </span>
          <h2 className="mt-4 font-serif text-4xl text-[#1a1918] md:text-6xl">El hotel en movimiento</h2>
          <p className="mx-auto mt-5 max-w-[52ch] font-serif text-xl leading-snug text-[#1a1918]/80 md:text-2xl">
            Un showreel corto y tres piezas verticales, antes de pedir contacto.
          </p>
        </motion.div>

        <motion.div {...rise(0.08)}>
          <VideoPlaceholder aspect="16 / 9" label="Vídeo de presentación" caption="Horizontal · 30 a 45 segundos" />
        </motion.div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 md:mt-7 md:gap-7">
          <motion.div {...rise(0.14)}>
            <VideoPlaceholder aspect="9 / 16" label="Vídeo vertical 1" caption="Redes sociales · 8 a 20 segundos" />
          </motion.div>
          <motion.div {...rise(0.2)}>
            <VideoPlaceholder aspect="9 / 16" label="Vídeo vertical 2" caption="Redes sociales · 8 a 20 segundos" />
          </motion.div>
          <motion.div {...rise(0.26)}>
            <VideoPlaceholder aspect="9 / 16" label="Vídeo vertical 3" caption="Redes sociales · 8 a 20 segundos" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
