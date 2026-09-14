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
 *  el material (mismo patrón que ya usa GalleryVideo, con poster + mp4/webm).
 *  Llena siempre la caja que le da su contenedor (h-full w-full): la forma
 *  la decide el bento de fuera, no una relación de aspecto propia. */
const VideoPlaceholder: React.FC<{ label: string; caption: string; big?: boolean }> = ({
  label,
  caption,
  big,
}) => (
  <div className="group relative h-full w-full overflow-hidden rounded-[10px] bg-[#1a1918] shadow-2xl">
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center md:gap-3">
      <span className={`font-serif italic text-white/25 ${big ? 'text-3xl md:text-6xl' : 'text-lg md:text-2xl'}`}>
        VÍDEO
      </span>
      <span
        className={`font-sans uppercase tracking-[0.22em] text-white/45 ${
          big ? 'text-[10px] md:text-xs' : 'text-[8px] md:text-[10px]'
        }`}
      >
        {label}
      </span>
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <span
        className={`flex items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-105 ${
          big ? 'h-16 w-16 md:h-20 md:w-20' : 'h-9 w-9 md:h-12 md:w-12'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`translate-x-[2px] text-[#1a1918] ${big ? 'h-6 w-6 md:h-7 md:w-7' : 'h-4 w-4 md:h-5 md:w-5'}`}
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </div>
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-6 text-center md:px-4 md:pb-3">
      <span
        className={`font-sans uppercase tracking-[0.18em] text-white/70 ${big ? 'text-[9px] md:text-[10px]' : 'text-[7px] md:text-[9px]'}`}
      >
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
 *  llegue el archivo.
 *
 *  Ni el horizontal ni el vertical muestran una sola pieza a pantalla
 *  completa: eso frena el scroll y concentra la atención en el vídeo en vez
 *  de en el texto que debe llevar al visitante a la sección siguiente. Con
 *  varias piezas en un bento asimétrico, el ojo capta que hay film sin que
 *  ninguna lo atrape sesenta segundos -- misma lógica en las dos escenas
 *  (horizontal y vertical), cada una ocupando su propia pantalla. */
export const VideoShowcase: React.FC = () => {
  return (
    <section className="w-full bg-[#fbfaf6] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.div {...rise(0)} className="mb-12 text-center md:mb-16">
          <h2 className="font-serif text-4xl text-[#1a1918] md:text-6xl">El hotel en movimiento</h2>
        </motion.div>

        {/* Escena horizontal: una pieza grande + dos más pequeñas, asimétrico. */}
        <motion.div
          {...rise(0.08)}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:grid-rows-2 sm:gap-4 sm:h-[64vh] sm:max-h-[560px] md:gap-5"
        >
          <div className="h-[38vh] sm:col-span-2 sm:row-span-2 sm:h-auto">
            <VideoPlaceholder big label="Vídeo horizontal 1" caption="Showreel · 30 a 45 segundos" />
          </div>
          <div className="h-[22vh] sm:col-span-1 sm:row-span-1 sm:h-auto">
            <VideoPlaceholder label="Vídeo horizontal 2" caption="Campaña · 20 a 30 segundos" />
          </div>
          <div className="h-[22vh] sm:col-span-1 sm:row-span-1 sm:h-auto">
            <VideoPlaceholder label="Vídeo horizontal 3" caption="Campaña · 20 a 30 segundos" />
          </div>
        </motion.div>

        {/* Escena vertical: piezas en fila con alturas desiguales (escritorio) o
            en mosaico escalonado de dos columnas (móvil) -- nunca una sola
            pieza ocupando el ancho completo. */}
        <motion.div {...rise(0.16)} className="mt-6 sm:mt-8 md:mt-10">
          <div className="hidden items-end justify-center gap-4 sm:flex sm:h-[58vh] sm:max-h-[460px] md:gap-6">
            <div style={{ height: '68%' }} className="aspect-[9/16] shrink-0">
              <VideoPlaceholder label="Vídeo vertical 1" caption="Redes sociales · 8 a 20 segundos" />
            </div>
            <div style={{ height: '92%' }} className="aspect-[9/16] shrink-0">
              <VideoPlaceholder label="Vídeo vertical 2" caption="Redes sociales · 8 a 20 segundos" />
            </div>
            <div style={{ height: '78%' }} className="aspect-[9/16] shrink-0">
              <VideoPlaceholder label="Vídeo vertical 3" caption="Redes sociales · 8 a 20 segundos" />
            </div>
            <div style={{ height: '58%' }} className="aspect-[9/16] shrink-0">
              <VideoPlaceholder label="Vídeo vertical 4" caption="Redes sociales · 8 a 20 segundos" />
            </div>
          </div>

          {/* Móvil: el ancho lo da la columna del grid, el alto lo calcula
              `aspect-[9/16]` a partir de ese ancho -- así la proporción es
              siempre 9:16 real, nunca una altura fija adivinada. */}
          <div className="grid grid-cols-2 gap-3 sm:hidden">
            <div className="aspect-[9/16]">
              <VideoPlaceholder label="Vídeo vertical 1" caption="Redes sociales · 8 a 20 segundos" />
            </div>
            <div className="mt-7 aspect-[9/16]">
              <VideoPlaceholder label="Vídeo vertical 2" caption="Redes sociales · 8 a 20 segundos" />
            </div>
            <div className="aspect-[9/16]">
              <VideoPlaceholder label="Vídeo vertical 3" caption="Redes sociales · 8 a 20 segundos" />
            </div>
            <div className="mt-7 aspect-[9/16]">
              <VideoPlaceholder label="Vídeo vertical 4" caption="Redes sociales · 8 a 20 segundos" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
